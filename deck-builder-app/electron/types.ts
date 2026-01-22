/**
 * Shared TypeScript types for the deck-builder-app
 *
 * These types are shared between the main process (electron) and
 * can be imported where needed.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SESSION & WORKSHOP TYPES
// ═══════════════════════════════════════════════════════════════════════════════

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
  // Auto-generation flag
  autoGenerate?: boolean    // If true, content is auto-generated from schedule
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

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SlideElement {
  type: 'heading' | 'text' | 'bullet' | 'numbered' | 'image' | 'code' | 'directive'
  content: string
  level?: number // For headings (1-6) and bullets (nesting level)
  alt?: string // For images
  src?: string // For images
  language?: string // For code blocks
}

export interface ParsedSlide {
  index: number
  title: string
  elements: SlideElement[]
  rawContent: string
  layout?: string // From marp directives like <!-- _class: lead -->
}

export interface ParsedTopic {
  id: string
  file: string
  title: string
  path: string
  slides: ParsedSlide[]
  frontmatter: Record<string, any>
  slideCount: number
  lastModified: number
}

export interface ParsedModule {
  number: number
  id: string
  name: string
  folder: string
  topics: ParsedTopic[]
  totalSlides: number
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASSEMBLED SLIDE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface AssembledSlide {
  id: string
  sessionId: string
  slideIndex: number
  title: string
  markdown: string
  elements: SlideElement[]
  layout?: string
  meta: {
    dayNumber: number
    sessionName: string
    topicId?: string
    moduleId?: string
    isBreak?: boolean
    isSection?: boolean
    isSpecial?: boolean
  }
}

export interface AssembledDeck {
  workshopId: string
  workshopConfig: WorkshopConfig
  slides: AssembledSlide[]
  totalSlides: number
  days: Array<{
    dayNumber: number
    title?: string
    slides: AssembledSlide[]
  }>
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ExportFormat = 'html' | 'pdf' | 'pptx' | 'md'

export interface ExportOptions {
  format: ExportFormat
  workshopId: string
  outputPath?: string
  includeNotes?: boolean
  theme?: string
}

export interface ExportProgress {
  stage: 'preparing' | 'assembling' | 'rendering' | 'converting' | 'complete' | 'error'
  progress: number  // 0-100
  currentSlide?: number
  totalSlides?: number
  message?: string
  error?: string
}

export interface ExportResult {
  success: boolean
  outputPath: string
  format: ExportFormat
  fileSize?: number
  slideCount?: number
  duration?: number  // Build time in ms
  error?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// VARIABLE SUBSTITUTION
// ═══════════════════════════════════════════════════════════════════════════════

export interface VariableContext {
  // Workshop variables
  WORKSHOP_NAME: string
  WORKSHOP_COUNTRY: string
  WORKSHOP_LOCATION: string
  WORKSHOP_DATE: string
  WORKSHOP_FACILITATORS: string
  WORKSHOP_VENUE?: string
  WORKSHOP_EMAIL?: string
  WORKSHOP_WEBSITE?: string

  // Day-specific variables
  DAY_NUMBER?: number
  DAY_TITLE?: string
  DAY_START_TIME?: string

  // Country data (dynamic)
  [key: string]: string | number | undefined
}

/**
 * Build variable context from workshop config
 */
export function buildVariableContext(
  config: WorkshopConfig,
  dayNumber?: number
): VariableContext {
  const context: VariableContext = {
    WORKSHOP_NAME: config.workshop.name,
    WORKSHOP_COUNTRY: config.workshop.country,
    WORKSHOP_LOCATION: config.workshop.location,
    WORKSHOP_DATE: config.workshop.date,
    WORKSHOP_FACILITATORS: config.workshop.facilitators,
    WORKSHOP_VENUE: config.workshop.venue,
    WORKSHOP_EMAIL: config.workshop.contact_email,
    WORKSHOP_WEBSITE: config.workshop.website,
  }

  // Add country data
  if (config.country_data) {
    for (const [key, value] of Object.entries(config.country_data)) {
      context[key.toUpperCase()] = value
    }
  }

  // Add day-specific context
  if (dayNumber) {
    context.DAY_NUMBER = dayNumber
    context.DAY_TITLE = config.schedule.day_titles?.[dayNumber]
    context.DAY_START_TIME = config.schedule.day_start_times?.[dayNumber]
  }

  return context
}

/**
 * Substitute variables in markdown content
 */
export function substituteVariables(
  content: string,
  context: VariableContext
): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    const value = context[varName]
    if (value !== undefined) {
      return String(value)
    }
    // Return original if variable not found
    return match
  })
}
