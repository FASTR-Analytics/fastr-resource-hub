/**
 * API Client for FASTR Deck Builder Web App
 * Replaces window.electronAPI calls from the Electron version
 */

const API_BASE = '/api'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkshopInfo {
  id: string
  name: string
  country: string
  location?: string
  start_date?: string
  end_date?: string
  facilitators?: string
  locked?: boolean
}

export interface DaySchedule {
  day_number: number
  title: string
  date?: string
  start_time: string
  end_time: string
  sessions: Session[]
}

export interface Session {
  id: string
  type: 'module' | 'break' | 'template' | 'custom'
  name: string
  start_time: string
  duration: number
  speaker?: string
  slides?: string[]
  module_id?: string
  topic_id?: string
  template_id?: string
  content?: string
}

export interface WorkshopConfig {
  workshop: WorkshopInfo
  days: DaySchedule[]
  objectives?: string[]
  selected_modules?: string[]
}

export interface Module {
  number: number
  id: string
  name: string
  folder: string
  topics: Topic[]
  totalSlides: number
}

export interface Topic {
  id: string
  file: string
  title: string
  slideCount: number
  slideTitles: string[]
  preview: string[]
  isShort?: boolean
}

export interface Template {
  id: string
  name: string
  category: string
  content?: string
}

export interface TemplateCategory {
  category: string
  templates: Template[]
}

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AIToolResult {
  tool: string
  result: any
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// Workshop API
// ─────────────────────────────────────────────────────────────────────────────

export const workshopAPI = {
  /**
   * List all workshops
   */
  async list(): Promise<WorkshopInfo[]> {
    return fetchJSON('/workshops')
  },

  /**
   * Get a specific workshop configuration
   */
  async get(id: string): Promise<WorkshopConfig> {
    return fetchJSON(`/workshops/${id}`)
  },

  /**
   * Create a new workshop
   */
  async create(id: string, config: WorkshopConfig): Promise<{ id: string }> {
    return fetchJSON('/workshops', {
      method: 'POST',
      body: JSON.stringify({ id, config }),
    })
  },

  /**
   * Update an existing workshop
   */
  async update(id: string, config: WorkshopConfig): Promise<void> {
    await fetchJSON(`/workshops/${id}`, {
      method: 'PUT',
      body: JSON.stringify(config),
    })
  },

  /**
   * Delete a workshop
   */
  async delete(id: string): Promise<void> {
    await fetchJSON(`/workshops/${id}`, {
      method: 'DELETE',
    })
  },

  /**
   * Lock or unlock a workshop
   */
  async setLocked(id: string, locked: boolean): Promise<void> {
    await fetchJSON(`/workshops/${id}/lock`, {
      method: 'PATCH',
      body: JSON.stringify({ locked }),
    })
  },

  /**
   * Save custom slide content
   */
  async saveCustomSlide(workshopId: string, slideId: string, content: string): Promise<void> {
    await fetchJSON(`/workshops/${workshopId}/slides/${slideId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    })
  },

  /**
   * Get custom slide content
   */
  async getCustomSlide(workshopId: string, slideId: string): Promise<{ content: string }> {
    return fetchJSON(`/workshops/${workshopId}/slides/${slideId}`)
  },

  /**
   * Delete a custom slide
   */
  async deleteCustomSlide(workshopId: string, slideId: string): Promise<void> {
    await fetchJSON(`/workshops/${workshopId}/slides/${slideId}`, {
      method: 'DELETE',
    })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Library API
// ─────────────────────────────────────────────────────────────────────────────

export const contentAPI = {
  /**
   * Get all modules and their topics
   */
  async getModules(): Promise<Module[]> {
    return fetchJSON('/content/modules')
  },

  /**
   * Get template categories
   */
  async getTemplates(): Promise<TemplateCategory[]> {
    return fetchJSON('/content/templates')
  },

  /**
   * Get a specific topic's slide content
   */
  async getTopic(topicId: string): Promise<{ id: string; title: string; content: string; slides: string[] }> {
    return fetchJSON(`/content/topic/${topicId}`)
  },

  /**
   * Get a specific template's content
   */
  async getTemplate(templateId: string): Promise<{ id: string; name: string; content: string }> {
    return fetchJSON(`/content/template/${templateId}`)
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Assistant API
// ─────────────────────────────────────────────────────────────────────────────

export const aiAPI = {
  /**
   * Chat with AI assistant (supports tools for deck modification)
   */
  async chat(
    messages: AIMessage[],
    workshopId?: string,
    workshopConfig?: WorkshopConfig
  ): Promise<{
    message: string
    toolResults?: AIToolResult[]
    updatedConfig?: WorkshopConfig
  }> {
    return fetchJSON('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages,
        workshopId,
        workshopConfig,
      }),
    })
  },

  /**
   * Simple text generation (no tools)
   */
  async generate(prompt: string, systemPrompt?: string): Promise<{ text: string }> {
    return fetchJSON('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        systemPrompt,
      }),
    })
  },

  /**
   * Generate workshop objectives
   */
  async generateObjectives(context: {
    country: string
    modules: string[]
    duration: number
  }): Promise<{ objectives: string[] }> {
    return fetchJSON('/ai/objectives', {
      method: 'POST',
      body: JSON.stringify(context),
    })
  },

  /**
   * Generate suggested schedule
   */
  async generateSchedule(context: {
    workshopConfig: WorkshopConfig
    modules: string[]
  }): Promise<{ days: DaySchedule[] }> {
    return fetchJSON('/ai/schedule', {
      method: 'POST',
      body: JSON.stringify(context),
    })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Export API
// ─────────────────────────────────────────────────────────────────────────────

export const exportAPI = {
  /**
   * Build markdown deck
   */
  async buildMarkdown(workshopId: string): Promise<{ markdown: string; path: string }> {
    return fetchJSON(`/export/${workshopId}/markdown`, {
      method: 'POST',
    })
  },

  /**
   * Build HTML preview
   */
  async buildHTML(workshopId: string): Promise<{ html: string; path: string }> {
    return fetchJSON(`/export/${workshopId}/html`, {
      method: 'POST',
    })
  },

  /**
   * Build PDF
   */
  async buildPDF(workshopId: string): Promise<{ path: string }> {
    return fetchJSON(`/export/${workshopId}/pdf`, {
      method: 'POST',
    })
  },

  /**
   * Build PowerPoint
   */
  async buildPPTX(workshopId: string): Promise<{ path: string }> {
    return fetchJSON(`/export/${workshopId}/pptx`, {
      method: 'POST',
    })
  },

  /**
   * Get download URL for a generated file
   */
  getDownloadURL(workshopId: string, format: 'md' | 'html' | 'pdf' | 'pptx'): string {
    return `${API_BASE}/export/${workshopId}/download/${format}`
  },

  /**
   * List generated outputs for a workshop
   */
  async listOutputs(workshopId: string): Promise<
    Array<{
      name: string
      format: string
      size: number
      modified: string
    }>
  > {
    return fetchJSON(`/export/${workshopId}/outputs`)
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Assets API
// ─────────────────────────────────────────────────────────────────────────────

export interface Asset {
  filename: string
  path: string
  url: string
  size: number
  modified: string
  markdown: string
}

export const assetsAPI = {
  /**
   * List all assets for a workshop
   */
  async list(workshopId: string): Promise<Asset[]> {
    const response = await fetchJSON<{ assets: Asset[] }>(`/assets/${workshopId}`)
    return response.assets
  },

  /**
   * Upload an asset
   */
  async upload(workshopId: string, file: File): Promise<Asset> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE}/assets/${workshopId}`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    const result = await response.json()
    return result.asset
  },

  /**
   * Delete an asset
   */
  async delete(workshopId: string, filename: string): Promise<void> {
    await fetchJSON(`/assets/${workshopId}/${filename}`, {
      method: 'DELETE',
    })
  },

  /**
   * Get the full URL for an asset
   */
  getURL(workshopId: string, filename: string): string {
    return `${API_BASE}/assets/${workshopId}/file/${filename}`
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview API (browser-based Marp rendering)
// ─────────────────────────────────────────────────────────────────────────────

let marpInstance: any = null

export const previewAPI = {
  /**
   * Initialize Marp for browser-based rendering
   */
  async initMarp(): Promise<void> {
    if (marpInstance) return

    // Dynamic import of Marp for browser
    const MarpModule = await import('@marp-team/marp-core/browser')
    const Marp = (MarpModule as any).Marp || (MarpModule as any).default
    marpInstance = new Marp({ html: true })

    // Load FASTR theme
    try {
      const themeResponse = await fetch('/fastr-theme.css')
      if (themeResponse.ok) {
        const themeCSS = await themeResponse.text()
        marpInstance.themeSet.add(themeCSS)
      }
    } catch (e) {
      console.warn('Could not load FASTR theme:', e)
    }
  },

  /**
   * Render markdown to HTML for preview
   */
  async renderMarkdown(markdown: string): Promise<{ html: string; css: string }> {
    await this.initMarp()
    return marpInstance.render(markdown)
  },

  /**
   * Render a single slide
   */
  async renderSlide(slideMarkdown: string): Promise<string> {
    const { html, css } = await this.renderMarkdown(slideMarkdown)
    return `<style>${css}</style>${html}`
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Export - Combined API (matches window.electronAPI interface)
// ─────────────────────────────────────────────────────────────────────────────

const api = {
  // Workshop operations
  listWorkshops: workshopAPI.list,
  getWorkshop: workshopAPI.get,
  createWorkshop: workshopAPI.create,
  updateWorkshop: workshopAPI.update,
  deleteWorkshop: workshopAPI.delete,
  setWorkshopLocked: workshopAPI.setLocked,
  saveCustomSlide: workshopAPI.saveCustomSlide,
  getCustomSlide: workshopAPI.getCustomSlide,

  // Content library
  getModules: contentAPI.getModules,
  getTemplates: contentAPI.getTemplates,
  getTopicContent: contentAPI.getTopic,
  getTemplateContent: contentAPI.getTemplate,

  // AI
  aiChat: aiAPI.chat,
  aiGenerate: aiAPI.generate,
  generateObjectives: aiAPI.generateObjectives,
  generateSchedule: aiAPI.generateSchedule,

  // Export
  buildMarkdown: exportAPI.buildMarkdown,
  buildHTML: exportAPI.buildHTML,
  buildPDF: exportAPI.buildPDF,
  buildPPTX: exportAPI.buildPPTX,
  getDownloadURL: exportAPI.getDownloadURL,
  listOutputs: exportAPI.listOutputs,

  // Preview
  initMarp: previewAPI.initMarp,
  renderMarkdown: previewAPI.renderMarkdown,
  renderSlide: previewAPI.renderSlide,

  // Assets
  listAssets: assetsAPI.list,
  uploadAsset: assetsAPI.upload,
  deleteAsset: assetsAPI.delete,
  getAssetURL: assetsAPI.getURL,
}

export default api
