import { create } from 'zustand'
import api, { ApiError, WorkshopInfo, Module, AIMessage, Language } from '../../lib/api'

// Types matching the backend
export interface Session {
  _id?: string
  time?: string
  session: string
  type?: 'break' | 'section' | 'day_recap' | 'day_end' | 'day_title'
  module?: string
  topics?: string[]
  slides?: string[]
  /** Per-workshop slide edits: source ref → custom_slides/<fork> */
  slideOverrides?: Record<string, string>
  speaker?: string
  duration?: number
  icon?: string
  recap_yesterday?: string
  recap_today?: string
  wrapup_message?: string
}

export interface LocalWorkshopConfig {
  workshop: {
    name: string
    country: string
    location: string
    date?: string
    start_date?: string
    end_date?: string
    facilitators: string
    venue?: string
    contact_email?: string
    website?: string
    objectives?: string
    // Cover slide fields
    title?: string
    subtitle?: string
    // Additional content
    scope_of_work?: string
    expected_outputs?: string
    // Slide style/theme id ('classic' | 'fastr2026' | 'minimal'); unknown
    // values fall back to classic server-side
    theme?: string
    // Deck type
    deckType?: 'workshop' | 'webinar'
    // Webinar-specific fields
    event_name?: string
    time?: string
    duration?: number  // minutes
  }
  schedule: {
    days: number
    day_titles?: Record<number, string>
    day_start_times?: Record<number, string>
    [key: string]: any
  }
  content: {
    modules: number[]
    custom_slides: string[]
  }
}

export interface AIToolCall {
  id: string
  name: string
  input: any
}

export interface LocalAIMessage {
  role: 'user' | 'assistant'
  content: string
  toolCalls?: AIToolCall[]
  actionsTaken?: string[]
}

interface WorkshopStore {
  // State
  workshops: WorkshopInfo[]
  currentWorkshopId: string | null
  currentConfig: LocalWorkshopConfig | null
  contentLibrary: Module[]
  contentLanguage: Language
  isLoading: boolean
  error: string | null
  /**
   * 'saving' while a save is pending (debounced) or in flight; 'saved' after;
   * 'error' on failure; 'conflict' when the server refused the write because
   * the workshop changed elsewhere (auto-save is suspended until the workshop
   * is reloaded via selectWorkshop).
   */
  saveStatus: 'idle' | 'saving' | 'saved' | 'error' | 'conflict'
  lastSaved: Date | null
  /** Version stamp of the open workshop as last seen from the server (ISO). */
  currentUpdatedAt: string | null

  // AI Assistant
  aiMessages: LocalAIMessage[]
  aiLoading: boolean

  // Actions
  loadWorkshops: () => Promise<void>
  selectWorkshop: (workshopId: string) => Promise<void>
  /** Schedule a save of the current config (debounced, trailing). Resolves once that save completes. */
  saveCurrentWorkshop: () => Promise<void>
  /** Run any pending save now and wait for in-flight saves to finish. */
  flushSave: (opts?: { keepalive?: boolean }) => Promise<void>
  createWorkshop: (workshopId: string, config: LocalWorkshopConfig) => Promise<void>
  deleteWorkshop: (workshopId: string) => Promise<void>
  /** True when the open workshop is locked; every mutation is a no-op then. */
  isCurrentLocked: () => boolean
  cloneWorkshop: (srcId: string, newId: string, overrides?: { name?: string; country?: string; location?: string; date?: string }) => Promise<string>
  setWorkshopLocked: (workshopId: string, locked: boolean) => Promise<void>
  loadContentLibrary: (language?: Language) => Promise<void>
  setContentLanguage: (language: Language) => void

  // Config mutations (auto-save)
  updateSession: (dayNum: number, sessionIdx: number, updates: Partial<Session>) => void
  setSlideOverride: (dayNum: number, sessionIdx: number, sourceRef: string, forkRef: string) => void
  removeSlideOverride: (dayNum: number, sessionIdx: number, sourceRef: string) => void
  addSession: (dayNum: number, session: Session) => void
  removeSession: (dayNum: number, sessionIdx: number) => void
  reorderSession: (dayNum: number, fromIdx: number, toIdx: number) => void
  moveSessionToDay: (fromDay: number, fromIdx: number, toDay: number, toIdx: number) => void
  addDay: () => void
  removeDay: (dayNum: number) => void
  updateDayTitle: (dayNum: number, title: string) => void
  updateDayStartTime: (dayNum: number, time: string) => void

  // Workshop settings
  updateWorkshopSettings: (updates: Partial<LocalWorkshopConfig['workshop']>) => void

  // AI Assistant
  sendAIMessage: (message: string) => Promise<void>
  clearAIMessages: () => void

  // Utils
  setError: (error: string | null) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Debounced auto-save
//
// Every mutation calls saveCurrentWorkshop(). Instead of one full PUT per
// keystroke, calls coalesce into a single trailing save SAVE_DEBOUNCE_MS after
// the last one. Only one PUT is in flight at a time; a request arriving while
// one is in flight runs once it finishes (with the latest config).
// ─────────────────────────────────────────────────────────────────────────────
const SAVE_DEBOUNCE_MS = 800
const SAVED_PILL_MS = 2000

let saveTimer: ReturnType<typeof setTimeout> | null = null
let saveInFlight: Promise<void> | null = null
let saveQueued = false
let saveKeepalive = false
let saveWaiters: Array<() => void> = []

function clearSaveTimer() {
  if (saveTimer) {
    clearTimeout(saveTimer)
    saveTimer = null
  }
}

function resolveSaveWaiters() {
  const waiters = saveWaiters
  saveWaiters = []
  waiters.forEach(resolve => resolve())
}

export const useWorkshopStore = create<WorkshopStore>((set, get) => {
  // Perform one PUT with the current config. Never runs two at once.
  const runSave = () => {
    if (saveInFlight) {
      saveQueued = true
      return
    }
    const { currentWorkshopId, currentConfig, currentUpdatedAt } = get()
    if (!currentWorkshopId || !currentConfig) {
      resolveSaveWaiters()
      return
    }
    const id = currentWorkshopId
    const keepalive = saveKeepalive
    saveKeepalive = false

    saveInFlight = (async () => {
      try {
        const { updatedAt } = await api.updateWorkshop(id, currentConfig as any, currentUpdatedAt, { keepalive })
        // Ignore a late response for a workshop we have since navigated away from.
        if (get().currentWorkshopId !== id) return
        const stillPending = saveQueued || saveTimer !== null
        set({
          currentUpdatedAt: updatedAt ?? currentUpdatedAt,
          lastSaved: new Date(),
          ...(stillPending ? {} : { saveStatus: 'saved' as const }),
        })
        if (!stillPending) {
          setTimeout(() => {
            if (get().saveStatus === 'saved') set({ saveStatus: 'idle' })
          }, SAVED_PILL_MS)
        }
      } catch (error: any) {
        if (get().currentWorkshopId !== id) return
        if (error instanceof ApiError && error.status === 409) {
          // Someone else saved a newer version. Stop auto-saving until the
          // user reloads; local edits stay on screen so nothing is lost silently.
          clearSaveTimer()
          saveQueued = false
          set({ saveStatus: 'conflict', error: error.message })
        } else {
          set({ saveStatus: 'error', error: error.message })
        }
      } finally {
        saveInFlight = null
        if (saveQueued) {
          saveQueued = false
          runSave()
        } else {
          resolveSaveWaiters()
        }
      }
    })()
  }

  return ({
  // Initial state
  workshops: [],
  currentWorkshopId: null,
  currentConfig: null,
  contentLibrary: [],
  contentLanguage: 'en' as Language,
  isLoading: false,
  error: null,
  saveStatus: 'idle',
  lastSaved: null,
  currentUpdatedAt: null,
  aiMessages: [],
  aiLoading: false,

  // Load all workshops
  loadWorkshops: async () => {
    set({ isLoading: true, error: null })
    try {
      const workshops = await api.listWorkshops()
      set({ workshops, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Select and load a workshop
  selectWorkshop: async (workshopId: string) => {
    // Land any pending edits on the workshop we are leaving (no-op after a
    // conflict, whose pending save was already dropped).
    await get().flushSave()
    set({ isLoading: true, error: null })
    try {
      const { config, updatedAt } = await api.getWorkshopWithMeta(workshopId)
      set({
        currentWorkshopId: workshopId,
        currentConfig: config as any,
        currentUpdatedAt: updatedAt,
        saveStatus: 'idle',
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Save current workshop config (debounced; see runSave)
  saveCurrentWorkshop: () => {
    const { currentWorkshopId, currentConfig, saveStatus } = get()
    if (!currentWorkshopId || !currentConfig) return Promise.resolve()
    // After a conflict the server would refuse every write; wait for a reload.
    if (saveStatus === 'conflict') return Promise.resolve()

    set({ saveStatus: 'saving' })
    clearSaveTimer()
    saveTimer = setTimeout(() => {
      saveTimer = null
      runSave()
    }, SAVE_DEBOUNCE_MS)
    return new Promise<void>(resolve => saveWaiters.push(resolve))
  },

  flushSave: async (opts) => {
    if (opts?.keepalive) saveKeepalive = true
    if (saveTimer) {
      clearSaveTimer()
      runSave()
    }
    // Wait for the in-flight save and any follow-up it queues.
    while (saveInFlight) {
      await saveInFlight
    }
  },

  // Create new workshop
  createWorkshop: async (workshopId: string, config: LocalWorkshopConfig) => {
    set({ isLoading: true, error: null })
    try {
      await api.createWorkshop(workshopId, config as any)
      await get().loadWorkshops()
      await get().selectWorkshop(workshopId)
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  // Clone workshop — fork the source under a new id and select the clone.
  cloneWorkshop: async (srcId, newId, overrides) => {
    set({ isLoading: true, error: null })
    try {
      await api.cloneWorkshop(srcId, newId, overrides)
      await get().loadWorkshops()
      await get().selectWorkshop(newId)
      return newId
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  // Delete workshop
  deleteWorkshop: async (workshopId: string) => {
    set({ isLoading: true, error: null })
    try {
      await get().flushSave()
      await api.deleteWorkshop(workshopId)
      // If we deleted the current workshop, clear it
      if (get().currentWorkshopId === workshopId) {
        set({ currentWorkshopId: null, currentConfig: null, currentUpdatedAt: null, saveStatus: 'idle' })
      }
      await get().loadWorkshops()
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  isCurrentLocked: () => {
    const { workshops, currentWorkshopId } = get()
    return !!workshops.find(w => w.id === currentWorkshopId)?.locked
  },

  // Lock/unlock workshop
  setWorkshopLocked: async (workshopId: string, locked: boolean) => {
    try {
      await get().flushSave()
      const { updatedAt } = await api.setWorkshopLocked(workshopId, locked)
      // Locking bumps the server-side version; adopt it so our next save is not
      // mistaken for a conflict.
      if (updatedAt && get().currentWorkshopId === workshopId) {
        set({ currentUpdatedAt: updatedAt })
      }
      await get().loadWorkshops()
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  },

  // Load content library
  loadContentLibrary: async (language?: Language) => {
    try {
      const lang = language || get().contentLanguage
      const library = await api.getModules(lang)
      set({ contentLibrary: library, contentLanguage: lang })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  // Set content language (and reload library)
  setContentLanguage: (language: Language) => {
    set({ contentLanguage: language })
    get().loadContentLibrary(language)
  },

  // Update a session
  updateSession: (dayNum: number, sessionIdx: number, updates: Partial<Session>) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return

    const dayKey = `day${dayNum}`
    const sessions = currentConfig.schedule[dayKey] || []

    if (sessionIdx >= 0 && sessionIdx < sessions.length) {
      const newSessions = [...sessions]
      newSessions[sessionIdx] = { ...sessions[sessionIdx], ...updates }

      const newConfig = {
        ...currentConfig,
        schedule: {
          ...currentConfig.schedule,
          [dayKey]: newSessions
        }
      }

      set({ currentConfig: newConfig })
      get().saveCurrentWorkshop()
    }
  },

  // Record a per-workshop slide edit: sourceRef now renders from forkRef
  setSlideOverride: (dayNum: number, sessionIdx: number, sourceRef: string, forkRef: string) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return
    const session: Session | undefined = (currentConfig.schedule[`day${dayNum}`] || [])[sessionIdx]
    if (!session) return
    get().updateSession(dayNum, sessionIdx, {
      slideOverrides: { ...session.slideOverrides, [sourceRef]: forkRef }
    })
  },

  // Drop a per-workshop slide edit (reset to the library version)
  removeSlideOverride: (dayNum: number, sessionIdx: number, sourceRef: string) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return
    const session: Session | undefined = (currentConfig.schedule[`day${dayNum}`] || [])[sessionIdx]
    if (!session?.slideOverrides) return
    const { [sourceRef]: _removed, ...rest } = session.slideOverrides
    get().updateSession(dayNum, sessionIdx, {
      slideOverrides: Object.keys(rest).length > 0 ? rest : undefined
    })
  },

  // Add a session
  addSession: (dayNum: number, session: Session) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return

    const dayKey = `day${dayNum}`
    const existingSessions = currentConfig.schedule[dayKey] || []

    const sessionWithId = {
      ...session,
      _id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    const newConfig = {
      ...currentConfig,
      schedule: {
        ...currentConfig.schedule,
        [dayKey]: [...existingSessions, sessionWithId]
      }
    }

    set({ currentConfig: newConfig })
    get().saveCurrentWorkshop()
  },

  // Remove a session
  removeSession: (dayNum: number, sessionIdx: number) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return

    const dayKey = `day${dayNum}`
    const sessions = currentConfig.schedule[dayKey] || []

    if (sessionIdx >= 0 && sessionIdx < sessions.length) {
      const newSessions = sessions.filter((_: Session, i: number) => i !== sessionIdx)

      const newConfig = {
        ...currentConfig,
        schedule: {
          ...currentConfig.schedule,
          [dayKey]: newSessions
        }
      }

      set({ currentConfig: newConfig })
      get().saveCurrentWorkshop()
    }
  },

  // Reorder a session
  reorderSession: (dayNum: number, fromIdx: number, toIdx: number) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return

    const dayKey = `day${dayNum}`
    const sessions = currentConfig.schedule[dayKey] || []

    if (fromIdx >= 0 && fromIdx < sessions.length && toIdx >= 0 && toIdx < sessions.length) {
      const newSessions = [...sessions]
      const [removed] = newSessions.splice(fromIdx, 1)
      newSessions.splice(toIdx, 0, removed)

      const newConfig = {
        ...currentConfig,
        schedule: {
          ...currentConfig.schedule,
          [dayKey]: newSessions
        }
      }

      set({ currentConfig: newConfig })
      get().saveCurrentWorkshop()
    }
  },

  // Move session between days
  moveSessionToDay: (fromDay: number, fromIdx: number, toDay: number, toIdx: number) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return

    const fromDayKey = `day${fromDay}`
    const toDayKey = `day${toDay}`
    const fromSessions = [...(currentConfig.schedule[fromDayKey] || [])]
    const toSessions = fromDay === toDay ? fromSessions : [...(currentConfig.schedule[toDayKey] || [])]

    if (fromIdx >= 0 && fromIdx < fromSessions.length) {
      const [session] = fromSessions.splice(fromIdx, 1)
      const targetIdx = toIdx >= 0 ? toIdx : toSessions.length
      toSessions.splice(targetIdx, 0, session)

      const newConfig = {
        ...currentConfig,
        schedule: {
          ...currentConfig.schedule,
          [fromDayKey]: fromSessions,
          [toDayKey]: toSessions,
        },
      }

      set({ currentConfig: newConfig })
      get().saveCurrentWorkshop()
    }
  },

  // Add a new day
  addDay: () => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return

    const newDayNum = currentConfig.schedule.days + 1
    const prevDayNum = newDayNum - 1

    const starterSessions: Session[] = [
      {
        _id: `day-title-${newDayNum}-${Date.now()}`,
        session: `Day ${newDayNum}`,
        type: 'day_title',
        slides: ['day_title.md'],
        duration: 0,
        icon: 'calendar',
      },
      {
        _id: `day-recap-${newDayNum}-${Date.now()}`,
        session: `Recap of Day ${prevDayNum}`,
        type: 'day_recap',
        duration: 15,
        icon: 'recap',
      },
      {
        _id: `day-agenda-${newDayNum}-${Date.now()}`,
        session: `Day ${newDayNum} Agenda`,
        type: 'section',
        duration: 5,
        icon: 'list',
      },
      {
        _id: `day-end-${newDayNum}-${Date.now()}`,
        session: `End of Day ${newDayNum}`,
        type: 'day_end',
        slides: ['day_end.md'],
        duration: 5,
        icon: 'sunset',
      },
    ]

    const newSchedule: any = {
      ...currentConfig.schedule,
      days: newDayNum,
      [`day${newDayNum}`]: starterSessions,
    }

    if (!newSchedule.day_start_times) {
      newSchedule.day_start_times = {}
    }
    if (!newSchedule.day_start_times[newDayNum]) {
      newSchedule.day_start_times[newDayNum] = '09:00'
    }

    set({ currentConfig: { ...currentConfig, schedule: newSchedule } })
    get().saveCurrentWorkshop()
  },

  // Remove a day and renumber remaining days
  removeDay: (dayNum: number) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return
    if (currentConfig.schedule.days <= 1) return // Keep at least 1 day

    const totalDays = currentConfig.schedule.days
    const newSchedule: any = {
      ...currentConfig.schedule,
      days: totalDays - 1,
      day_titles: { ...currentConfig.schedule.day_titles },
      day_start_times: { ...currentConfig.schedule.day_start_times },
    }

    // Remove the deleted day key
    delete newSchedule[`day${dayNum}`]
    delete newSchedule.day_titles?.[dayNum]
    delete newSchedule.day_start_times?.[dayNum]

    // Renumber days above the deleted one downward
    for (let d = dayNum + 1; d <= totalDays; d++) {
      const newD = d - 1
      // Sessions
      if (newSchedule[`day${d}`]) {
        newSchedule[`day${newD}`] = newSchedule[`day${d}`]
        delete newSchedule[`day${d}`]
      }
      // Titles
      if (newSchedule.day_titles?.[d] !== undefined) {
        newSchedule.day_titles[newD] = newSchedule.day_titles[d]
        delete newSchedule.day_titles[d]
      }
      // Start times
      if (newSchedule.day_start_times?.[d] !== undefined) {
        newSchedule.day_start_times[newD] = newSchedule.day_start_times[d]
        delete newSchedule.day_start_times[d]
      }
    }

    set({ currentConfig: { ...currentConfig, schedule: newSchedule } })
    get().saveCurrentWorkshop()
  },

  // Update day title
  updateDayTitle: (dayNum: number, title: string) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return

    const newConfig = {
      ...currentConfig,
      schedule: {
        ...currentConfig.schedule,
        day_titles: {
          ...currentConfig.schedule.day_titles,
          [dayNum]: title,
        },
      },
    }
    set({ currentConfig: newConfig })
    get().saveCurrentWorkshop()
  },

  // Update day start time
  updateDayStartTime: (dayNum: number, time: string) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return

    const newConfig = {
      ...currentConfig,
      schedule: {
        ...currentConfig.schedule,
        day_start_times: {
          ...currentConfig.schedule.day_start_times,
          [dayNum]: time,
        },
      },
    }
    set({ currentConfig: newConfig })
    get().saveCurrentWorkshop()
  },

  // Update workshop settings
  updateWorkshopSettings: (updates: Partial<LocalWorkshopConfig['workshop']>) => {
    const { currentConfig } = get()
    if (!currentConfig || get().isCurrentLocked()) return

    const newConfig = {
      ...currentConfig,
      workshop: {
        ...currentConfig.workshop,
        ...updates,
      },
    }
    set({ currentConfig: newConfig })
    get().saveCurrentWorkshop()
  },

  // AI Assistant
  sendAIMessage: async (message: string) => {
    const { aiMessages, currentConfig } = get()

    const userMessage: LocalAIMessage = { role: 'user', content: message }
    set({ aiMessages: [...aiMessages, userMessage], aiLoading: true })

    try {
      const messages: AIMessage[] = [...aiMessages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await api.aiChat(messages, get().currentWorkshopId || undefined, currentConfig as any)

      const actionsTaken: string[] = []

      // Process tool results if any
      if (response.toolResults && response.toolResults.length > 0) {
        for (const result of response.toolResults) {
          actionsTaken.push(`${result.tool}: ${JSON.stringify(result.result)}`)
        }
      }

      // If config was updated by AI, refresh it and save to database
      if (response.updatedConfig) {
        set({ currentConfig: response.updatedConfig as any })
        // Save the updated config to the database
        get().saveCurrentWorkshop()
      }

      set({
        aiMessages: [...get().aiMessages, {
          role: 'assistant',
          content: response.message,
          actionsTaken: actionsTaken.length > 0 ? actionsTaken : undefined,
        }],
        aiLoading: false,
      })
    } catch (error: any) {
      set({
        aiMessages: [
          ...get().aiMessages,
          { role: 'assistant', content: `Error: ${error.message}` },
        ],
        aiLoading: false,
      })
    }
  },

  clearAIMessages: () => {
    set({ aiMessages: [] })
  },

  setError: (error: string | null) => {
    set({ error })
  },
  })
})

// Land pending edits when the tab closes or is backgrounded. keepalive lets the
// PUT outlive the page; both events fire in some browsers, the second is a no-op.
if (typeof window !== 'undefined') {
  const flushOnLeave = () => { void useWorkshopStore.getState().flushSave({ keepalive: true }) }
  window.addEventListener('beforeunload', flushOnLeave)
  window.addEventListener('pagehide', flushOnLeave)
}

export type { Module, Language }
