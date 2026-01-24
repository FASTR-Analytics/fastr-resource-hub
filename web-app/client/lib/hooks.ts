/**
 * React hooks for FASTR Deck Builder API
 */

import { useState, useEffect, useCallback } from 'react'
import api, {
  WorkshopConfig,
  WorkshopInfo,
  Module,
  TemplateCategory,
  AIMessage,
} from './api'

// ─────────────────────────────────────────────────────────────────────────────
// Generic fetch hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseQueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

function useQuery<T>(
  fetcher: () => Promise<T>,
  deps: any[] = []
): UseQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetcher()
      setData(result)
    } catch (e: any) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

// ─────────────────────────────────────────────────────────────────────────────
// Workshop hooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * List all workshops
 */
export function useWorkshops() {
  return useQuery<WorkshopInfo[]>(() => api.listWorkshops())
}

/**
 * Get a specific workshop
 */
export function useWorkshop(workshopId: string | null) {
  const result = useQuery<WorkshopConfig | null>(
    () => (workshopId ? api.getWorkshop(workshopId) : Promise.resolve(null)),
    [workshopId]
  )

  const updateWorkshop = useCallback(
    async (config: WorkshopConfig) => {
      if (!workshopId) return
      await api.updateWorkshop(workshopId, config)
      await result.refetch()
    },
    [workshopId, result.refetch]
  )

  return {
    ...result,
    updateWorkshop,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Content library hooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all modules and topics
 */
export function useModules() {
  return useQuery<Module[]>(() => api.getModules())
}

/**
 * Get all template categories
 */
export function useTemplates() {
  return useQuery<TemplateCategory[]>(() => api.getTemplates())
}

/**
 * Get a specific topic's content
 */
export function useTopicContent(topicId: string | null) {
  return useQuery(
    () =>
      topicId
        ? api.getTopicContent(topicId)
        : Promise.resolve(null),
    [topicId]
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Assistant hooks
// ─────────────────────────────────────────────────────────────────────────────

interface UseAIChatResult {
  messages: AIMessage[]
  loading: boolean
  error: Error | null
  sendMessage: (content: string) => Promise<void>
  clearHistory: () => void
}

/**
 * AI chat with message history
 */
export function useAIChat(
  workshopId?: string,
  workshopConfig?: WorkshopConfig
): UseAIChatResult {
  const [messages, setMessages] = useState<AIMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: AIMessage = { role: 'user', content }
      const newMessages = [...messages, userMessage]
      setMessages(newMessages)
      setLoading(true)
      setError(null)

      try {
        const response = await api.aiChat(newMessages, workshopId, workshopConfig)
        const assistantMessage: AIMessage = {
          role: 'assistant',
          content: response.message,
        }
        setMessages([...newMessages, assistantMessage])
      } catch (e: any) {
        setError(e)
      } finally {
        setLoading(false)
      }
    },
    [messages, workshopId, workshopConfig]
  )

  const clearHistory = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, sendMessage, clearHistory }
}

// ─────────────────────────────────────────────────────────────────────────────
// Export hooks
// ─────────────────────────────────────────────────────────────────────────────

interface UseExportResult {
  building: boolean
  error: Error | null
  buildMarkdown: () => Promise<string | null>
  buildHTML: () => Promise<string | null>
  buildPDF: () => Promise<void>
  buildPPTX: () => Promise<void>
  downloadURL: (format: 'md' | 'html' | 'pdf' | 'pptx') => string
}

/**
 * Export workshop to various formats
 */
export function useExport(workshopId: string | null): UseExportResult {
  const [building, setBuilding] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const buildMarkdown = useCallback(async () => {
    if (!workshopId) return null
    setBuilding(true)
    setError(null)
    try {
      const result = await api.buildMarkdown(workshopId)
      return result.markdown
    } catch (e: any) {
      setError(e)
      return null
    } finally {
      setBuilding(false)
    }
  }, [workshopId])

  const buildHTML = useCallback(async () => {
    if (!workshopId) return null
    setBuilding(true)
    setError(null)
    try {
      const result = await api.buildHTML(workshopId)
      return result.html
    } catch (e: any) {
      setError(e)
      return null
    } finally {
      setBuilding(false)
    }
  }, [workshopId])

  const buildPDF = useCallback(async () => {
    if (!workshopId) return
    setBuilding(true)
    setError(null)
    try {
      await api.buildPDF(workshopId)
    } catch (e: any) {
      setError(e)
    } finally {
      setBuilding(false)
    }
  }, [workshopId])

  const buildPPTX = useCallback(async () => {
    if (!workshopId) return
    setBuilding(true)
    setError(null)
    try {
      await api.buildPPTX(workshopId)
    } catch (e: any) {
      setError(e)
    } finally {
      setBuilding(false)
    }
  }, [workshopId])

  const downloadURL = useCallback(
    (format: 'md' | 'html' | 'pdf' | 'pptx') => {
      if (!workshopId) return ''
      return api.getDownloadURL(workshopId, format)
    },
    [workshopId]
  )

  return {
    building,
    error,
    buildMarkdown,
    buildHTML,
    buildPDF,
    buildPPTX,
    downloadURL,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview hooks
// ─────────────────────────────────────────────────────────────────────────────

interface UsePreviewResult {
  html: string | null
  css: string | null
  loading: boolean
  error: Error | null
  render: (markdown: string) => Promise<void>
}

/**
 * Render markdown slides for preview
 */
export function usePreview(): UsePreviewResult {
  const [html, setHtml] = useState<string | null>(null)
  const [css, setCss] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Initialize Marp on mount
  useEffect(() => {
    api.initMarp().catch(console.error)
  }, [])

  const render = useCallback(async (markdown: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await api.renderMarkdown(markdown)
      setHtml(result.html)
      setCss(result.css)
    } catch (e: any) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [])

  return { html, css, loading, error, render }
}
