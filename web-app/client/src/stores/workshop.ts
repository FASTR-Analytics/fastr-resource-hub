import { create } from 'zustand'
import api, { WorkshopInfo, Module, AIMessage, Language } from '../../lib/api'

// Types matching the backend
export interface Session {
  _id?: string
  time?: string
  session: string
  type?: 'break' | 'section' | 'day_recap' | 'day_end' | 'day_title'
  module?: string
  topics?: string[]
  slides?: string[]
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
    // Slide theme
    theme?: 'classic' | 'clean' | 'bold'
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
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: Date | null

  // AI Assistant
  aiMessages: LocalAIMessage[]
  aiLoading: boolean

  // Actions
  loadWorkshops: () => Promise<void>
  selectWorkshop: (workshopId: string) => Promise<void>
  saveCurrentWorkshop: () => Promise<void>
  createWorkshop: (workshopId: string, config: LocalWorkshopConfig) => Promise<void>
  deleteWorkshop: (workshopId: string) => Promise<void>
  cloneWorkshop: (srcId: string, newId: string, overrides?: { name?: string; country?: string; location?: string; date?: string }) => Promise<string>
  setWorkshopLocked: (workshopId: string, locked: boolean) => Promise<void>
  loadContentLibrary: (language?: Language) => Promise<void>
  setContentLanguage: (language: Language) => void

  // Config mutations (auto-save)
  updateSession: (dayNum: number, sessionIdx: number, updates: Partial<Session>) => void
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

export const useWorkshopStore = create<WorkshopStore>((set, get) => ({
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
    set({ isLoading: true, error: null })
    try {
      const config = await api.getWorkshop(workshopId) as any
      set({
        currentWorkshopId: workshopId,
        currentConfig: config,
        isLoading: false,
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Save current workshop config
  saveCurrentWorkshop: async () => {
    const { currentWorkshopId, currentConfig } = get()
    if (!currentWorkshopId || !currentConfig) return

    set({ saveStatus: 'saving' })

    try {
      await api.updateWorkshop(currentWorkshopId, currentConfig as any)
      set({ saveStatus: 'saved', lastSaved: new Date() })

      setTimeout(() => {
        set({ saveStatus: 'idle' })
      }, 2000)
    } catch (error: any) {
      set({ error: error.message, saveStatus: 'error' })
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
      await api.deleteWorkshop(workshopId)
      // If we deleted the current workshop, clear it
      if (get().currentWorkshopId === workshopId) {
        set({ currentWorkshopId: null, currentConfig: null })
      }
      await get().loadWorkshops()
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  // Lock/unlock workshop
  setWorkshopLocked: async (workshopId: string, locked: boolean) => {
    try {
      await api.setWorkshopLocked(workshopId, locked)
      await get().loadWorkshops()
    } catch (error: any) {
      set({ error: error.message })
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
    if (!currentConfig) return

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

  // Add a session
  addSession: (dayNum: number, session: Session) => {
    const { currentConfig } = get()
    if (!currentConfig) return

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
    if (!currentConfig) return

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
    if (!currentConfig) return

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
    if (!currentConfig) return

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
    if (!currentConfig) return

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
    if (!currentConfig) return
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
    if (!currentConfig) return

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
    if (!currentConfig) return

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
    if (!currentConfig) return

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
}))

export type { Module, Language }
