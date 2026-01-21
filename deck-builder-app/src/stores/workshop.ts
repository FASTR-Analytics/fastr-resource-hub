import { create } from 'zustand'

// Types
export interface Topic {
  id: string
  file: string
  title: string
  preview: string[]
  path: string
}

export interface Module {
  number: number
  id: string
  name: string
  folder: string
  topics: Topic[]
}

export interface Session {
  time?: string
  session: string
  type?: 'break' | 'section'
  module?: string
  topics?: string[]
  slides?: string[]
  speaker?: string
  duration?: number
}

export interface WorkshopConfig {
  workshop: {
    name: string
    country: string
    location: string
    date: string
    facilitators: string
  }
  schedule: {
    days: number
    day_titles?: Record<number, string>
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

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
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
      sessions[sessionIdx] = { ...sessions[sessionIdx], ...updates }
      set({ currentConfig: { ...currentConfig } })
      get().saveCurrentWorkshop()
    }
  },

  // Add a session
  addSession: (dayNum: number, session: Session) => {
    const { currentConfig } = get()
    if (!currentConfig) return

    const dayKey = `day${dayNum}`
    if (!currentConfig.schedule[dayKey]) {
      currentConfig.schedule[dayKey] = []
    }
    currentConfig.schedule[dayKey].push(session)
    set({ currentConfig: { ...currentConfig } })
    get().saveCurrentWorkshop()
  },

  // Remove a session
  removeSession: (dayNum: number, sessionIdx: number) => {
    const { currentConfig } = get()
    if (!currentConfig) return

    const dayKey = `day${dayNum}`
    const sessions = currentConfig.schedule[dayKey] || []

    if (sessionIdx >= 0 && sessionIdx < sessions.length) {
      sessions.splice(sessionIdx, 1)
      set({ currentConfig: { ...currentConfig } })
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
      const [removed] = sessions.splice(fromIdx, 1)
      sessions.splice(toIdx, 0, removed)
      set({ currentConfig: { ...currentConfig } })
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

  // AI Assistant
  sendAIMessage: async (message: string) => {
    const { aiMessages, currentConfig } = get()

    // Add user message
    const userMessage: AIMessage = { role: 'user', content: message }
    set({ aiMessages: [...aiMessages, userMessage], aiLoading: true })

    try {
      // Prepare context
      const context = {
        workshop: currentConfig?.workshop,
        currentDays: currentConfig?.schedule?.days,
      }

      // Call AI
      const messages = [...aiMessages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await window.electronAPI.aiChat(messages, context)

      set({
        aiMessages: [...get().aiMessages, response as AIMessage],
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
