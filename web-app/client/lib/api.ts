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
  number: number | string
  id: string
  name: string
  folder: string
  topics: Topic[]
  fullTopics?: Topic[]
  condensedTopics?: Topic[]
  totalSlides: number
  fullSlides?: number
  condensedSlides?: number
}

export interface Topic {
  id: string
  file: string
  title: string
  slideCount: number
  slideTitles: string[]
  preview: string[]
  isShort?: boolean
  status?: 'new' | 'updated'
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

async function fetchJSON<T>(url: string, options?: RequestInit & { timeout?: number }): Promise<T> {
  const { timeout = 60000, ...fetchOptions } = options || {}

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(`${API_BASE}${url}`, {
      credentials: 'include',  // Send session cookie with requests
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions?.headers,
      },
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out - please try again')
    }
    throw error
  }
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
   * Clone a workshop: fork the source under a new id, optionally overriding
   * top-level workshop fields (name, country, location, date). Custom slides
   * are copied; the clone starts unlocked.
   */
  async clone(
    srcId: string,
    newId: string,
    overrides?: { name?: string; country?: string; location?: string; date?: string }
  ): Promise<{ id: string; config: WorkshopConfig }> {
    return fetchJSON(`/workshops/${srcId}/clone`, {
      method: 'POST',
      body: JSON.stringify({ newId, ...overrides }),
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
   * Save custom slide content. Pass sourceRef when forking a library slide so
   * the server can record a hash of the source (in the workshop's language) for
   * stale-fork detection.
   */
  async saveCustomSlide(
    workshopId: string,
    filename: string,
    content: string,
    sourceRef?: string,
  ): Promise<void> {
    await fetchJSON(`/workshops/${workshopId}/custom-slides`, {
      method: 'POST',
      body: JSON.stringify({ filename, content, sourceRef }),
    })
  },

  /**
   * Get custom slides for a workshop
   */
  async getCustomSlides(workshopId: string): Promise<any[]> {
    return fetchJSON(`/workshops/${workshopId}/custom-slides`)
  },

  /**
   * Delete a custom slide
   */
  async deleteCustomSlide(workshopId: string, filename: string): Promise<void> {
    await fetchJSON(`/workshops/${workshopId}/custom-slides/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    })
  },

  /**
   * Read the raw markdown source for a session.slides[] reference. Resolves
   * library, template, and custom_slides refs. Used by EditSessionModal to
   * pre-populate the editor when forking a library slide.
   */
  async getSlideContent(
    workshopId: string,
    ref: string,
    language?: 'en' | 'fr' | 'pt',
  ): Promise<{ ref: string; filename: string; content: string; source: 'custom' | 'template' | 'library' | 'imported' }> {
    const params = new URLSearchParams({ ref })
    if (language) params.set('language', language)
    return fetchJSON(`/workshops/${workshopId}/slide-content?${params.toString()}`)
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Library API
// ─────────────────────────────────────────────────────────────────────────────

// Supported languages
export type Language = 'en' | 'fr' | 'pt'

export const contentAPI = {
  /**
   * Get all modules and their topics
   * @param language - Language code ('en' or 'fr')
   */
  async getModules(language: Language = 'en'): Promise<Module[]> {
    return fetchJSON(`/content/modules?language=${language}`)
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
    return fetchJSON(`/content/templates/${templateId}`)
  },

  /**
   * Rebuild content from methodology files
   */
  async rebuild(): Promise<{ success: boolean; message: string; duration: number; output?: string }> {
    return fetchJSON('/content/rebuild', {
      method: 'POST',
      timeout: 180000,  // 3 minute timeout for rebuild
    })
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
      timeout: 120000,  // 2 minute timeout for AI responses
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

export interface PreflightFinding {
  severity: 'error' | 'warning'
  code: 'placeholder' | 'unsubstituted-var' | 'missing-image' | 'overflow' | 'stale-fork'
  message: string
  dayNumber?: number
  sessionName?: string
  detail?: string
}
export interface PreflightResult {
  findings: PreflightFinding[]
  slideCount: number
}

export const exportAPI = {
  /**
   * Deck health check — run before an export to surface placeholder slides,
   * unfilled variables, missing images, overflow-flagged and stale slides.
   */
  async preflight(workshopId: string, language?: Language): Promise<PreflightResult> {
    const langParam = language ? `?language=${language}` : ''
    return fetchJSON(`/export/${workshopId}/preflight${langParam}`, {
      method: 'POST',
    })
  },

  /**
   * Build markdown deck
   * @param language - Optional language override
   */
  async buildMarkdown(workshopId: string, language?: Language): Promise<{ markdown: string; path: string }> {
    const langParam = language ? `?language=${language}` : ''
    return fetchJSON(`/export/${workshopId}/markdown${langParam}`, {
      method: 'POST',
    })
  },

  /**
   * Build HTML preview
   * @param language - Optional language override
   */
  async buildHTML(workshopId: string, language?: Language): Promise<{ html: string; path: string }> {
    const langParam = language ? `?language=${language}` : ''
    return fetchJSON(`/export/${workshopId}/html${langParam}`, {
      method: 'POST',
    })
  },

  /**
   * Build PDF
   * @param language - Optional language override
   */
  async buildPDF(workshopId: string, language?: Language): Promise<{ path: string }> {
    const langParam = language ? `?language=${language}` : ''
    return fetchJSON(`/export/${workshopId}/pdf${langParam}`, {
      method: 'POST',
    })
  },

  /**
   * Build PowerPoint
   * @param language - Optional language override
   */
  async buildPPTX(workshopId: string, language?: Language): Promise<{ path: string }> {
    const langParam = language ? `?language=${language}` : ''
    return fetchJSON(`/export/${workshopId}/pptx${langParam}`, {
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
      credentials: 'include',
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
// Import API (Slide Import)
// ─────────────────────────────────────────────────────────────────────────────

export interface SlideImage {
  filename: string
  contentType: string
  url: string
}

export interface ParsedSlide {
  index: number
  text: string
  wordCount: number
  images?: SlideImage[]
}

export interface ConvertedSlide {
  index: number
  title: string
  markdown: string
}

export interface ImportedModule {
  id: string
  name: string
  source_filename: string | null
  slide_count: number
  created_at: string
  updated_at: string
}

export interface ExternalDeck {
  id: string
  name: string
  source_filename: string | null
  page_count: number
  created_at: string
}

export interface ExternalPage {
  pageNumber: number
  width: number
  height: number
}

export const importAPI = {
  async parse(file: File): Promise<{ slides: ParsedSlide[]; sourceFilename: string; totalSlides: number; sessionId?: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE}/import/parse`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  },

  async convert(
    slides: Array<{ index: number; text: string; imageFilenames?: string[] }>,
    moduleName: string,
    sessionId?: string,
    moduleId?: string,
  ): Promise<{ slides: ConvertedSlide[] }> {
    return fetchJSON('/import/convert', {
      method: 'POST',
      timeout: 120000,
      body: JSON.stringify({ slides, moduleName, sessionId, moduleId }),
    })
  },

  async save(data: {
    id: string
    name: string
    sourceFilename: string | null
    slides: Array<{ order: number; originalText: string | null; markdown: string; title: string | null }>
    sessionId?: string
  }): Promise<{ success: boolean; id: string }> {
    return fetchJSON('/import/save', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async listModules(): Promise<ImportedModule[]> {
    return fetchJSON('/import/modules')
  },

  async getModule(id: string): Promise<ImportedModule & { slides: any[] }> {
    return fetchJSON(`/import/modules/${id}`)
  },

  async deleteModule(id: string): Promise<void> {
    await fetchJSON(`/import/modules/${id}`, { method: 'DELETE' })
  },

  async updateSlide(moduleId: string, slideId: number, markdown: string): Promise<void> {
    await fetchJSON(`/import/modules/${moduleId}/slides/${slideId}`, {
      method: 'PUT',
      body: JSON.stringify({ markdown }),
    })
  },

  // Export converted slides as PPTX
  async exportPPTX(slides: Array<{ markdown: string; title?: string }>, moduleName: string): Promise<{ downloadUrl: string; filename: string }> {
    return fetchJSON('/import/export-pptx', {
      method: 'POST',
      timeout: 120000,
      body: JSON.stringify({ slides, moduleName }),
    })
  },

  // External decks
  async uploadExternal(file: File, name?: string): Promise<{ id: string; name: string; pageCount: number; pages: ExternalPage[] }> {
    const formData = new FormData()
    formData.append('file', file)
    if (name) formData.append('name', name)

    const response = await fetch(`${API_BASE}/import/external`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  },

  async listExternalDecks(): Promise<ExternalDeck[]> {
    return fetchJSON('/import/external')
  },

  async getExternalDeck(id: string): Promise<ExternalDeck & { pages: ExternalPage[] }> {
    return fetchJSON(`/import/external/${id}`)
  },

  async deleteExternalDeck(id: string): Promise<void> {
    await fetchJSON(`/import/external/${id}`, { method: 'DELETE' })
  },

  getExternalPageURL(deckId: string, pageNum: number): string {
    return `${API_BASE}/import/external/${deckId}/pages/${pageNum}`
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Storage API (cross-category storage management)
// ─────────────────────────────────────────────────────────────────────────────

export const storageAPI = {
  async listOutputs(): Promise<{ files: Array<{ name: string; format: string; size: number; modified: string }>; totalSize: number }> {
    return fetchJSON('/export/storage')
  },

  async deleteOutput(filename: string): Promise<{ success: boolean }> {
    return fetchJSON(`/export/outputs/${encodeURIComponent(filename)}`, { method: 'DELETE' })
  },

  async clearOutputs(): Promise<{ success: boolean; deleted: number }> {
    return fetchJSON('/export/outputs', { method: 'DELETE' })
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Diagram Builder API
// ─────────────────────────────────────────────────────────────────────────────

export const diagramAPI = {
  async preview(config: any): Promise<{ svg: string }> {
    return fetchJSON('/diagrams/preview', {
      method: 'POST',
      body: JSON.stringify(config),
    })
  },

  async save(config: any, filename: string, language: 'en' | 'fr' | 'pt' | 'both'): Promise<{ paths: string[]; filename: string }> {
    return fetchJSON('/diagrams/save', {
      method: 'POST',
      body: JSON.stringify({ config, filename, language }),
    })
  },

  async getTemplates(): Promise<{ templates: Array<{ id: string; name: string; description: string; minItems: number; maxItems: number }> }> {
    return fetchJSON('/diagrams/templates')
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
  cloneWorkshop: workshopAPI.clone,
  setWorkshopLocked: workshopAPI.setLocked,
  saveCustomSlide: workshopAPI.saveCustomSlide,
  getCustomSlides: workshopAPI.getCustomSlides,

  // Content library (with language support)
  getModules: contentAPI.getModules,
  getTemplates: contentAPI.getTemplates,
  getTopicContent: contentAPI.getTopic,
  getTemplateContent: contentAPI.getTemplate,

  // AI
  aiChat: aiAPI.chat,
  aiGenerate: aiAPI.generate,
  generateObjectives: aiAPI.generateObjectives,
  generateSchedule: aiAPI.generateSchedule,

  // Export (with language support)
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

  // Content rebuild
  rebuildContent: contentAPI.rebuild,

  // Diagrams
  diagramPreview: diagramAPI.preview,
  diagramSave: diagramAPI.save,
  diagramTemplates: diagramAPI.getTemplates,

  // Assets
  listAssets: assetsAPI.list,
  uploadAsset: assetsAPI.upload,
  deleteAsset: assetsAPI.delete,
  getAssetURL: assetsAPI.getURL,
}

export default api
