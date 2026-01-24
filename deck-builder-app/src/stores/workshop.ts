import { create } from 'zustand'

// Types
export interface Topic {
  id: string
  file: string
  title: string
  slideCount: number
  slideTitles: string[]
  preview: string[]
  path: string
}

export interface Module {
  number: number
  id: string
  name: string
  folder: string
  topics: Topic[]
  totalSlides: number
}

export interface Session {
  _id?: string
  time?: string
  session: string
  type?: 'break' | 'section' | 'day_recap' | 'day_end'
  module?: string
  topics?: string[]
  slides?: string[]
  speaker?: string
  duration?: number
  icon?: string
  // Day recap content
  recap_yesterday?: string  // What we covered yesterday (bullet points, one per line)
  recap_today?: string      // What we'll cover today (bullet points, one per line)
  // Day end content
  wrapup_message?: string   // Custom wrap-up message (optional, auto-generates if empty)
}

export interface WorkshopConfig {
  workshop: {
    name: string
    country: string
    location: string
    date: string
    facilitators: string
    venue?: string
    contact_email?: string
    website?: string
    // Workshop content for slides
    objectives?: string      // Bullet points, one per line
  }
  schedule: {
    days: number
    day_titles?: Record<number, string>
    day_start_times?: Record<number, string>
    [key: string]: any // day1, day2, etc.
  }
  content: {
    modules: number[]
    custom_slides: string[]
  }
}

export interface WorkshopSummary {
  id: string
  name: string
  country: string
  location: string
  date: string
  days: number
}

export interface CustomSlide {
  file: string
  title: string
  path: string
}

export interface AIToolCall {
  id: string
  name: string
  input: any
}

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
  toolCalls?: AIToolCall[]
  actionsTaken?: string[]
}

interface WorkshopStore {
  // State
  workshops: WorkshopSummary[]
  currentWorkshopId: string | null
  currentConfig: WorkshopConfig | null
  contentLibrary: Module[]
  customSlides: CustomSlide[]
  isLoading: boolean
  error: string | null
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  lastSaved: Date | null

  // AI Assistant
  aiMessages: AIMessage[]
  aiLoading: boolean

  // Actions
  loadWorkshops: () => Promise<void>
  selectWorkshop: (workshopId: string) => Promise<void>
  saveCurrentWorkshop: () => Promise<void>
  createWorkshop: (workshopId: string, config: WorkshopConfig) => Promise<void>
  loadContentLibrary: () => Promise<void>
  loadCustomSlides: () => Promise<void>

  // Config mutations (auto-save)
  updateSession: (dayNum: number, sessionIdx: number, updates: Partial<Session>) => void
  addSession: (dayNum: number, session: Session) => void
  removeSession: (dayNum: number, sessionIdx: number) => void
  reorderSession: (dayNum: number, fromIdx: number, toIdx: number) => void
  moveSessionToDay: (fromDay: number, fromIdx: number, toDay: number, toIdx: number) => void
  addDay: () => void
  updateDayTitle: (dayNum: number, title: string) => void
  updateDayStartTime: (dayNum: number, time: string) => void

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
  customSlides: [],
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
      const workshops = await window.electronAPI.getWorkshops()
      set({ workshops, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Select and load a workshop
  selectWorkshop: async (workshopId: string) => {
    set({ isLoading: true, error: null })
    try {
      const config = await window.electronAPI.loadWorkshop(workshopId)
      set({
        currentWorkshopId: workshopId,
        currentConfig: config,
        isLoading: false,
      })
      // Also load custom slides for this workshop
      get().loadCustomSlides()
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
      await window.electronAPI.saveWorkshop(currentWorkshopId, currentConfig)
      set({ saveStatus: 'saved', lastSaved: new Date() })

      // Reset to idle after showing "saved" status briefly
      setTimeout(() => {
        set({ saveStatus: 'idle' })
      }, 2000)
    } catch (error: any) {
      set({ error: error.message, saveStatus: 'error' })
    }
  },

  // Create new workshop
  createWorkshop: async (workshopId: string, config: WorkshopConfig) => {
    set({ isLoading: true, error: null })
    try {
      await window.electronAPI.createWorkshop(workshopId, config)
      await get().loadWorkshops()
      await get().selectWorkshop(workshopId)
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  // Load content library
  loadContentLibrary: async () => {
    try {
      const library = await window.electronAPI.getContentLibrary()
      set({ contentLibrary: library })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  // Load custom slides for current workshop
  loadCustomSlides: async () => {
    const { currentWorkshopId } = get()
    if (!currentWorkshopId) return

    try {
      const slides = await window.electronAPI.getCustomSlides(currentWorkshopId)
      set({ customSlides: slides })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  // Update a session
  updateSession: (dayNum: number, sessionIdx: number, updates: Partial<Session>) => {
    const { currentConfig } = get()
    if (!currentConfig) return

    const dayKey = `day${dayNum}`
    const sessions = currentConfig.schedule[dayKey] || []

    if (sessionIdx >= 0 && sessionIdx < sessions.length) {
      // Create new array with updated session to trigger React re-render
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

    // Add unique ID to session for React key stability
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

  // Reorder a session (drag and drop)
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

  // Move a session between days (cross-day drag and drop)
  moveSessionToDay: (fromDay: number, fromIdx: number, toDay: number, toIdx: number) => {
    const { currentConfig } = get()
    if (!currentConfig) return

    const fromDayKey = `day${fromDay}`
    const toDayKey = `day${toDay}`
    const fromSessions = [...(currentConfig.schedule[fromDayKey] || [])]
    const toSessions = fromDay === toDay ? fromSessions : [...(currentConfig.schedule[toDayKey] || [])]

    if (fromIdx >= 0 && fromIdx < fromSessions.length) {
      // Remove from source day
      const [session] = fromSessions.splice(fromIdx, 1)

      // Add to target day at specified position (or end if -1)
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

  // Add a new day (Day 2+ structure)
  addDay: () => {
    const { currentConfig } = get()
    if (!currentConfig) return

    const newDayNum = currentConfig.schedule.days + 1
    const prevDayNum = newDayNum - 1

    // Create starter sessions for the new day (Day 2+ skeleton)
    const starterSessions: Session[] = [
      // Day Title slide
      {
        _id: `day-title-${newDayNum}-${Date.now()}`,
        session: `Day ${newDayNum}`,
        type: 'day_title',
        slides: ['day_title.md'],
        duration: 0,
        icon: 'calendar',
      },
      // Recap of previous day
      {
        _id: `day-recap-${newDayNum}-${Date.now()}`,
        session: `Recap of Day ${prevDayNum}`,
        type: 'day_recap',
        duration: 15,
        icon: 'recap',
        recap_yesterday: '',
        recap_today: '',
      },
      // Day agenda
      {
        _id: `day-agenda-${newDayNum}-${Date.now()}`,
        session: `Day ${newDayNum} Agenda`,
        type: 'section',
        duration: 5,
        icon: 'list',
      },
      // End of Day (placeholder for content to go before this)
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

    // Set default start time if not exists
    if (!newSchedule.day_start_times) {
      newSchedule.day_start_times = {}
    }
    if (!newSchedule.day_start_times[newDayNum]) {
      newSchedule.day_start_times[newDayNum] = '09:00'
    }

    set({ currentConfig: { ...currentConfig, schedule: newSchedule } })
    get().saveCurrentWorkshop()
  },

  // Update day title
  updateDayTitle: (dayNum: number, title: string) => {
    const { currentConfig } = get()
    if (!currentConfig) return

    if (!currentConfig.schedule.day_titles) {
      currentConfig.schedule.day_titles = {}
    }
    currentConfig.schedule.day_titles[dayNum] = title
    set({ currentConfig: { ...currentConfig } })
    get().saveCurrentWorkshop()
  },

  // Update day start time
  updateDayStartTime: (dayNum: number, time: string) => {
    const { currentConfig } = get()
    if (!currentConfig) return

    if (!currentConfig.schedule.day_start_times) {
      currentConfig.schedule.day_start_times = {}
    }
    currentConfig.schedule.day_start_times[dayNum] = time
    set({ currentConfig: { ...currentConfig } })
    get().saveCurrentWorkshop()
  },

  // AI Assistant
  sendAIMessage: async (message: string) => {
    const { aiMessages, currentConfig, contentLibrary, addSession, updateSession } = get()

    // Add user message
    const userMessage: AIMessage = { role: 'user', content: message }
    set({ aiMessages: [...aiMessages, userMessage], aiLoading: true })

    try {
      // Prepare context - include current schedule
      const context = {
        workshop: currentConfig?.workshop,
        currentDays: currentConfig?.schedule?.days,
        schedule: currentConfig?.schedule,
      }

      // Call AI
      const messages = [...aiMessages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await window.electronAPI.aiChat(messages, context)

      // Process tool calls if any
      const actionsTaken: string[] = []

      if (response.toolCalls && response.toolCalls.length > 0) {
        for (const tool of response.toolCalls) {
          const input = tool.input

          if (tool.name === 'add_module') {
            const moduleNum = input.module_number
            const day = input.day
            const module = contentLibrary.find(m => m.number === moduleNum)
            const moduleName = module?.name || `Module ${moduleNum}`

            // Default durations for each module
            const defaultDurations: Record<number, number> = {
              0: 60, 1: 90, 2: 120, 3: 180, 4: 120, 5: 90, 6: 240, 7: 120, 8: 180
            }
            const duration = input.duration || defaultDurations[moduleNum] || 60

            addSession(day, {
              session: moduleName,
              module: `m${moduleNum}`,
              duration: duration,
            })
            actionsTaken.push(`Added "${moduleName}" to Day ${day}`)
          }

          else if (tool.name === 'add_break') {
            const day = input.day
            const breakType = input.break_type
            const duration = input.duration || (breakType === 'lunch' ? 60 : 15)
            const breakName = breakType === 'lunch' ? 'Lunch Break' : 'Tea Break'

            addSession(day, {
              session: breakName,
              type: 'break',
              duration: duration,
            })
            actionsTaken.push(`Added ${breakName} to Day ${day}`)
          }

          else if (tool.name === 'add_custom_session') {
            const day = input.day
            addSession(day, {
              session: input.session_name,
              duration: input.duration,
            })
            actionsTaken.push(`Added "${input.session_name}" to Day ${day}`)
          }

          else if (tool.name === 'set_day_start_time') {
            const day = input.day
            const dayKey = `day${day}`
            const sessions = currentConfig?.schedule?.[dayKey] || []

            if (sessions.length > 0) {
              updateSession(day, 0, { time: input.start_time })
              actionsTaken.push(`Set Day ${day} start time to ${input.start_time}`)
            }
          }

          else if (tool.name === 'update_workshop_settings') {
            // Update workshop settings (objectives, etc.)
            if (currentConfig) {
              const updates: string[] = []
              const workshopUpdates: Partial<typeof currentConfig.workshop> = {}

              if (input.objectives) {
                workshopUpdates.objectives = input.objectives
                updates.push('objectives')
              }
              if (input.facilitators) {
                workshopUpdates.facilitators = input.facilitators
                updates.push('facilitators')
              }
              if (input.venue) {
                workshopUpdates.venue = input.venue
                updates.push('venue')
              }
              if (input.contact_email) {
                workshopUpdates.contact_email = input.contact_email
                updates.push('contact email')
              }
              if (input.website) {
                workshopUpdates.website = input.website
                updates.push('website')
              }

              if (updates.length > 0) {
                const newConfig = {
                  ...currentConfig,
                  workshop: {
                    ...currentConfig.workshop,
                    ...workshopUpdates,
                  },
                }
                set({ currentConfig: newConfig })
                get().saveCurrentWorkshop()
                actionsTaken.push(`Updated ${updates.join(', ')}`)
              }
            }
          }

          else if (tool.name === 'move_session') {
            const { reorderSession } = get()
            reorderSession(input.day, input.from_position, input.to_position)
            actionsTaken.push(`Moved session from position ${input.from_position} to ${input.to_position} on Day ${input.day}`)
          }

          else if (tool.name === 'remove_session') {
            const { removeSession } = get()
            const dayKey = `day${input.day}`
            const sessions = currentConfig?.schedule?.[dayKey] || []
            const sessionName = sessions[input.position]?.session || `position ${input.position}`
            removeSession(input.day, input.position)
            actionsTaken.push(`Removed "${sessionName}" from Day ${input.day}`)
          }

          else if (tool.name === 'move_session_to_day') {
            // Move session between days
            if (currentConfig) {
              const fromDayKey = `day${input.from_day}`
              const toDayKey = `day${input.to_day}`
              const fromSessions = [...(currentConfig.schedule[fromDayKey] || [])]
              const toSessions = [...(currentConfig.schedule[toDayKey] || [])]

              if (input.from_position >= 0 && input.from_position < fromSessions.length) {
                const [session] = fromSessions.splice(input.from_position, 1)
                const toPos = input.to_position >= 0 ? input.to_position : toSessions.length
                toSessions.splice(toPos, 0, session)

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
                actionsTaken.push(`Moved "${session.session}" from Day ${input.from_day} to Day ${input.to_day}`)
              }
            }
          }

          else if (tool.name === 'set_workshop_days') {
            // Change number of days
            if (currentConfig) {
              const oldDays = currentConfig.schedule.days
              const newDays = input.num_days

              const newSchedule: any = { ...currentConfig.schedule, days: newDays }

              // If reducing days and redistribute is true, move sessions to remaining days
              if (newDays < oldDays && input.redistribute) {
                const sessionsToRedistribute: Session[] = []
                for (let d = newDays + 1; d <= oldDays; d++) {
                  const sessions = (currentConfig.schedule as any)[`day${d}`] || []
                  sessionsToRedistribute.push(...sessions.filter((s: Session) => s.type !== 'break'))
                  delete newSchedule[`day${d}`]
                }
                // Add to last day
                if (sessionsToRedistribute.length > 0) {
                  const lastDayKey = `day${newDays}`
                  newSchedule[lastDayKey] = [
                    ...(newSchedule[lastDayKey] || []),
                    ...sessionsToRedistribute,
                  ]
                }
              } else if (newDays < oldDays) {
                // Just delete sessions from removed days
                for (let d = newDays + 1; d <= oldDays; d++) {
                  delete newSchedule[`day${d}`]
                }
              } else if (newDays > oldDays) {
                // Add empty days
                for (let d = oldDays + 1; d <= newDays; d++) {
                  newSchedule[`day${d}`] = []
                }
              }

              const newConfig = { ...currentConfig, schedule: newSchedule }
              set({ currentConfig: newConfig })
              get().saveCurrentWorkshop()
              actionsTaken.push(`Changed workshop from ${oldDays} days to ${newDays} days`)
            }
          }

          else if (tool.name === 'clear_day') {
            // Clear all sessions from a day
            if (currentConfig) {
              const dayKey = `day${input.day}`
              const sessionCount = (currentConfig.schedule[dayKey] || []).length

              const newConfig = {
                ...currentConfig,
                schedule: {
                  ...currentConfig.schedule,
                  [dayKey]: [],
                },
              }
              set({ currentConfig: newConfig })
              get().saveCurrentWorkshop()
              actionsTaken.push(`Cleared ${sessionCount} sessions from Day ${input.day}`)
            }
          }

          else if (tool.name === 'swap_days') {
            // Swap content of two days
            if (currentConfig) {
              const day1Key = `day${input.day1}`
              const day2Key = `day${input.day2}`
              const schedule = currentConfig.schedule as any
              const day1Sessions = schedule[day1Key] || []
              const day2Sessions = schedule[day2Key] || []
              const day1Title = currentConfig.schedule.day_titles?.[input.day1] || ''
              const day2Title = currentConfig.schedule.day_titles?.[input.day2] || ''

              const newSchedule: any = {
                ...currentConfig.schedule,
                [day1Key]: day2Sessions,
                [day2Key]: day1Sessions,
                day_titles: {
                  ...currentConfig.schedule.day_titles,
                  [input.day1]: day2Title,
                  [input.day2]: day1Title,
                },
              }
              const newConfig = { ...currentConfig, schedule: newSchedule }
              set({ currentConfig: newConfig })
              get().saveCurrentWorkshop()
              actionsTaken.push(`Swapped Day ${input.day1} and Day ${input.day2}`)
            }
          }

          else if (tool.name === 'restructure_schedule') {
            // Major schedule restructure
            if (currentConfig) {
              const oldDays = currentConfig.schedule.days
              const newDays = input.new_num_days
              const strategy = input.strategy || 'redistribute'

              // Collect all sessions, filtering out day-specific and structural content
              const contentSessions: Session[] = []
              const seenModules = new Set<string>() // Track modules to avoid duplicates
              const seenSessionNames = new Set<string>() // Track session names to avoid duplicates

              // Structural slides to filter out (by slides array content)
              const structuralSlides = [
                'title_slide.md', 'day_title.md', 'welcome_slide.md',
                'introductions_slide.md', 'closing.md', 'day_end.md',
                'breaks.md', 'expectations_slide.md', 'custom_slides/01_objectives.md',
                'title', 'agenda'
              ]

              // Structural session names to filter out (be specific to avoid filtering real content)
              const structuralNames = [
                'title slide', 'cover slide', 'cover page',
                'welcome and opening', 'opening remarks', 'opening & welcome',
                'introductions', 'participant introductions',
                'workshop objectives', 'objectives',
                'expectations',
                'agenda', 'day 1 agenda', 'day 2 agenda', 'day 3 agenda', 'day 4 agenda', 'day 5 agenda',
                'closing', 'contact information', 'contact info',
                'end of day', 'day wrap-up', 'day wrap up', 'day wrapup',
                'recap of day', 'day recap',
                'key messages and wrap-up', 'reflections from participants'
              ]

              for (let d = 1; d <= oldDays; d++) {
                const sessions = (currentConfig.schedule as any)[`day${d}`] || []
                for (const s of sessions) {
                  // Skip by type
                  if (s.type === 'break') continue
                  if (s.type === 'day_recap') continue
                  if (s.type === 'day_end') continue
                  if (s.type === 'day_title') continue
                  if (s.type === 'section') continue

                  // Skip structural slides (by slides array)
                  if (s.slides?.some((slide: string) => structuralSlides.includes(slide))) continue

                  // Skip structural sessions (by name)
                  const sessionNameLower = (s.session || '').toLowerCase()
                  if (structuralNames.some(name => sessionNameLower.includes(name))) continue

                  // Skip duplicate modules
                  if (s.module) {
                    if (seenModules.has(s.module)) continue
                    seenModules.add(s.module)
                  }

                  // Skip duplicate session names (for non-module content)
                  if (!s.module) {
                    if (seenSessionNames.has(sessionNameLower)) continue
                    seenSessionNames.add(sessionNameLower)
                  }

                  // Keep actual content sessions
                  contentSessions.push(s)
                }
              }

              // Build new schedule
              const newSchedule: any = {
                days: newDays,
                day_titles: {},
                day_start_times: {},
              }

              // Copy start times for existing days
              for (let d = 1; d <= newDays; d++) {
                newSchedule.day_start_times[d] = currentConfig.schedule.day_start_times?.[d] || '09:00'
              }

              if (strategy === 'redistribute' || strategy === 'compress') {
                // Distribute sessions evenly across new days
                const sessionsPerDay = Math.ceil(contentSessions.length / newDays)

                for (let d = 1; d <= newDays; d++) {
                  const isFirstDay = d === 1
                  const isLastDay = d === newDays
                  const startIdx = (d - 1) * sessionsPerDay
                  const endIdx = Math.min(startIdx + sessionsPerDay, contentSessions.length)
                  const daySessions = contentSessions.slice(startIdx, endIdx)

                  const finalDaySessions: Session[] = []

                  if (isFirstDay) {
                    // Day 1: Title/Cover slide first
                    finalDaySessions.push({
                      _id: `title-slide-${Date.now()}`,
                      session: currentConfig.workshop?.name || 'Workshop',
                      slides: ['title_slide.md'],
                      duration: 0,
                      icon: 'cover',
                    })

                    // Welcome and Opening Remarks (Day 1 only)
                    finalDaySessions.push({
                      _id: `welcome-${Date.now()}`,
                      session: 'Welcome and Opening Remarks',
                      slides: ['welcome_slide.md'],
                      duration: 10,
                      icon: 'welcome',
                    })

                    // Introductions (Day 1 only)
                    finalDaySessions.push({
                      _id: `introductions-${Date.now()}`,
                      session: 'Introductions',
                      slides: ['introductions_slide.md'],
                      duration: 15,
                      icon: 'people',
                    })

                    // Workshop Objectives (Day 1 only)
                    finalDaySessions.push({
                      _id: `objectives-${Date.now()}`,
                      session: 'Workshop Objectives',
                      slides: ['custom_slides/01_objectives.md'],
                      duration: 10,
                      icon: 'target',
                    })

                    // Expectations (Day 1 only)
                    finalDaySessions.push({
                      _id: `expectations-${Date.now()}`,
                      session: 'Expectations',
                      slides: ['expectations_slide.md'],
                      duration: 15,
                      icon: 'sticky',
                    })

                    // Day 1 Agenda
                    finalDaySessions.push({
                      _id: `day-agenda-${d}-${Date.now()}`,
                      session: `Day ${d} Agenda`,
                      type: 'section',
                      duration: 5,
                      icon: 'list',
                    })
                  } else {
                    // Day 2+: Day Title slide
                    finalDaySessions.push({
                      _id: `day-title-${d}-${Date.now()}`,
                      session: `Day ${d}`,
                      type: 'day_title',
                      slides: ['day_title.md'],
                      duration: 0,
                      icon: 'calendar',
                    })

                    // Recap of previous day
                    finalDaySessions.push({
                      _id: `day-recap-${d}-${Date.now()}`,
                      session: `Recap of Day ${d - 1}`,
                      type: 'day_recap',
                      duration: 15,
                      icon: 'recap',
                      recap_yesterday: '',
                      recap_today: '',
                    })

                    // Day N Agenda
                    finalDaySessions.push({
                      _id: `day-agenda-${d}-${Date.now()}`,
                      session: `Day ${d} Agenda`,
                      type: 'section',
                      duration: 5,
                      icon: 'list',
                    })
                  }

                  // Add content sessions with clock-based break insertion
                  // Break windows (in minutes from midnight):
                  // - Morning tea: 10:00-11:00 (600-660 min)
                  // - Lunch: 12:00-13:30 (720-810 min)
                  // - Afternoon tea: 14:30-15:30 (870-930 min)
                  const dayStartTime = newSchedule.day_start_times?.[d] || '09:00'
                  const [startHour, startMin] = dayStartTime.split(':').map(Number)
                  let currentTimeMinutes = startHour * 60 + startMin // Minutes from midnight

                  let morningTeaAdded = false
                  let lunchAdded = false
                  let afternoonTeaAdded = false

                  const MORNING_TEA_WINDOW = { start: 600, end: 660 }   // 10:00-11:00
                  const LUNCH_WINDOW = { start: 720, end: 810 }         // 12:00-13:30
                  const AFTERNOON_TEA_WINDOW = { start: 870, end: 930 } // 14:30-15:30

                  for (let i = 0; i < daySessions.length; i++) {
                    finalDaySessions.push(daySessions[i])
                    currentTimeMinutes += daySessions[i].duration || 0

                    // Don't add break after last content session
                    if (i >= daySessions.length - 1) continue

                    // Check if we should add morning tea
                    if (!morningTeaAdded && currentTimeMinutes >= MORNING_TEA_WINDOW.start && currentTimeMinutes <= MORNING_TEA_WINDOW.end) {
                      finalDaySessions.push({
                        _id: `break-tea-morning-${d}-${Date.now()}`,
                        session: 'Tea Break',
                        type: 'break',
                        duration: 15,
                      })
                      morningTeaAdded = true
                      currentTimeMinutes += 15
                    }
                    // Check if we should add lunch
                    else if (!lunchAdded && currentTimeMinutes >= LUNCH_WINDOW.start && currentTimeMinutes <= LUNCH_WINDOW.end) {
                      finalDaySessions.push({
                        _id: `break-lunch-${d}-${Date.now()}`,
                        session: 'Lunch Break',
                        type: 'break',
                        duration: 60,
                      })
                      lunchAdded = true
                      currentTimeMinutes += 60
                    }
                    // Check if we should add afternoon tea
                    else if (!afternoonTeaAdded && currentTimeMinutes >= AFTERNOON_TEA_WINDOW.start && currentTimeMinutes <= AFTERNOON_TEA_WINDOW.end) {
                      finalDaySessions.push({
                        _id: `break-tea-afternoon-${d}-${Date.now()}`,
                        session: 'Tea Break',
                        type: 'break',
                        duration: 15,
                      })
                      afternoonTeaAdded = true
                      currentTimeMinutes += 15
                    }
                  }

                  // Add Day End at the end
                  finalDaySessions.push({
                    _id: `day-end-${d}-${Date.now()}`,
                    session: `End of Day ${d}`,
                    type: 'day_end',
                    slides: ['day_end.md'],
                    duration: 5,
                    icon: 'sunset',
                  })

                  // Add Closing slide (contact info) on last day only
                  if (isLastDay) {
                    finalDaySessions.push({
                      _id: `closing-${Date.now()}`,
                      session: 'Contact Information',
                      slides: ['closing.md'],
                      duration: 0,
                      icon: 'contact',
                    })
                  }

                  newSchedule[`day${d}`] = finalDaySessions
                }
              }

              const newConfig = { ...currentConfig, schedule: newSchedule }
              set({ currentConfig: newConfig })
              get().saveCurrentWorkshop()
              actionsTaken.push(`Restructured workshop from ${oldDays} to ${newDays} days (${strategy} strategy)`)
            }
          }
        }
      }

      // Build response message
      let responseContent = response.content || ''
      if (actionsTaken.length > 0 && !responseContent) {
        responseContent = 'Done!'
      }

      set({
        aiMessages: [...get().aiMessages, {
          role: 'assistant',
          content: responseContent,
          toolCalls: response.toolCalls,
          actionsTaken: actionsTaken,
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

  // Set error
  setError: (error: string | null) => {
    set({ error })
  },
}))
