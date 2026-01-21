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
    scope_of_work?: string   // Bullet points, one per line
    expected_outputs?: string // Bullet points, one per line
    priorities?: string      // Bullet points, one per line
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
  country_data: Record<string, string>
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

    try {
      await window.electronAPI.saveWorkshop(currentWorkshopId, currentConfig)
    } catch (error: any) {
      set({ error: error.message })
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

  // Add a new day
  addDay: () => {
    const { currentConfig } = get()
    if (!currentConfig) return

    const numDays = currentConfig.schedule.days + 1
    currentConfig.schedule.days = numDays
    currentConfig.schedule[`day${numDays}`] = []
    set({ currentConfig: { ...currentConfig } })
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
            // Update workshop settings (objectives, scope, etc.)
            if (currentConfig) {
              const updates: string[] = []
              const workshopUpdates: Partial<typeof currentConfig.workshop> = {}

              if (input.objectives) {
                workshopUpdates.objectives = input.objectives
                updates.push('objectives')
              }
              if (input.scope_of_work) {
                workshopUpdates.scope_of_work = input.scope_of_work
                updates.push('scope of work')
              }
              if (input.expected_outputs) {
                workshopUpdates.expected_outputs = input.expected_outputs
                updates.push('expected outputs')
              }
              if (input.priorities) {
                workshopUpdates.priorities = input.priorities
                updates.push('priorities')
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
