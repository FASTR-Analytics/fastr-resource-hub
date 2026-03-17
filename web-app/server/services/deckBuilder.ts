import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { WorkshopConfig } from '../db/database.js'
import {
  getModuleFolder,
  getModuleName,
  loadModuleMeta,
} from './moduleRegistry.js'
import { getImportedSlides, getImportedModule, getExternalDeck, getExternalPages } from '../db/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths - different in dev vs prod due to TypeScript compilation
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')
const TEMPLATES_PATH = path.join(REPO_ROOT, 'templates')

// Supported languages
export type Language = 'en' | 'fr'

// Get core content path for a specific language
function getCoreContentPath(language: Language = 'en'): string {
  const suffix = language === 'en' ? '' : `_${language}`
  return path.join(REPO_ROOT, `core_content${suffix}`)
}

// Default to English for backward compatibility
const CORE_CONTENT_PATH = getCoreContentPath('en')

// Module folder names loaded from modules.yaml via registry
// (replaces hardcoded MODULE_FOLDERS dict)
// Use getModuleFolder(id) for single lookups, getModuleFoldersDict() for bulk

interface Session {
  session: string
  module?: string
  slides?: string[]
  excludedSlides?: string[]  // Slide files to exclude from module content
  type?: string
  duration?: number
  time?: string
  topic_range?: { start: number; end: number } | null  // For splitting modules across sessions
  version?: 'full' | 'condensed'  // Which content version to use
  [key: string]: any
}

/**
 * Build the complete markdown deck from a workshop config
 * @param workshopId - Workshop identifier
 * @param config - Workshop configuration
 * @param language - Language for content ('en' or 'fr', defaults to config.workshop.language or 'en')
 */
export async function buildMarkdown(workshopId: string, config: WorkshopConfig, language?: Language): Promise<string> {
  // Use provided language, or fall back to workshop config, or default to English
  const lang: Language = language || (config.workshop as any).language || 'en'
  const slides: string[] = []

  // Marp frontmatter — select theme based on workshop config
  const themeSetting = (config.workshop as any).theme || 'classic'
  const marpTheme = themeSetting === 'clean' ? 'fastr-clean'
    : themeSetting === 'bold' ? 'fastr-bold' : 'fastr'

  slides.push(`---
marp: true
theme: ${marpTheme}
paginate: true
---
`)

  const numDays = config.schedule.days || 1

  // Track cumulative session number across all days (only count content sessions, not breaks/structure)
  let sessionNumber = 0

  // Build each day
  for (let day = 1; day <= numDays; day++) {
    const dayKey = `day${day}`
    const sessions: Session[] = config.schedule[dayKey] || []

    for (const session of sessions) {
      // Increment session number only for content sessions (modules)
      const isContentSession = !!session.module
      if (isContentSession) {
        sessionNumber++
      }

      const slideContent = await buildSessionSlides(session, config, day, isContentSession ? sessionNumber : undefined, lang)
      if (slideContent) {
        slides.push(slideContent)
      }
    }
  }

  return slides.join('\n\n---\n\n')
}

/**
 * Build slides for a single session (exported for use by slides endpoint)
 */
export async function buildSessionMarkdown(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number,
  sessionNumber?: number,
  language?: Language
): Promise<string | null> {
  const lang: Language = language || (config.workshop as any).language || 'en'
  return buildSessionSlides(session, config, dayNumber, sessionNumber, lang)
}

/**
 * Build slides for a single session
 */
async function buildSessionSlides(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number,
  sessionNumber?: number,
  language: Language = 'en'
): Promise<string | null> {
  const allSlideContents: string[] = []
  const coreContentPath = getCoreContentPath(language)

  // PREFIX SLIDES (from slides array) - load FIRST
  // This allows adding intro slides before module content
  // e.g., Add m4_0_fastr_methods_overview.md before condensed content
  if (session.slides && session.slides.length > 0) {
    for (const slideFile of session.slides) {
      const content = await loadSlideContent(slideFile, config, dayNumber, session, language)
      if (content) {
        allSlideContents.push(content)
      }
    }
  }

  // MODULE CONTENT - load SECOND
  // Uses full or condensed version based on session.version
  if (session.module) {
    const moduleSlides = await buildModuleSlides(session.module, session.session, sessionNumber, session.topic_range, session.excludedSlides, session.version, language)
    if (moduleSlides) {
      allSlideContents.push(moduleSlides)
    }
  }

  // TOPICS ARRAY - load THIRD
  // Individual topic files like m4_s1, m4_s2, etc.
  // Useful for cherry-picking specific topics without loading entire module
  if (session.topics && Array.isArray(session.topics) && session.topics.length > 0) {
    for (const topicId of session.topics) {
      // Topic IDs like "m4_s1", "m9c_3" need to be converted to file names
      // Try to find the matching file in core_content
      const moduleMatch = topicId.match(/^(m\d+[a-z]?)_/)
      if (moduleMatch) {
        const moduleId = moduleMatch[1]
        const folderName = getModuleFolder(moduleId)
        if (folderName) {
          const modulePath = path.join(coreContentPath, folderName)
          if (fs.existsSync(modulePath)) {
            // Find file that starts with the topic ID
            const files = fs.readdirSync(modulePath).filter(f => f.startsWith(topicId) && f.endsWith('.md'))
            for (const file of files) {
              let content = fs.readFileSync(path.join(modulePath, file), 'utf-8')
              // Remove frontmatter
              content = content.replace(/^---[\s\S]*?---\s*/m, '')
              content = content.replace(/\n---\s*$/, '')
              content = substituteVariables(content, config, dayNumber, session, language)
              if (content.trim()) {
                allSlideContents.push(content.trim())
              }
            }
          }
        }
      }
    }
  }

  // If we have any content, return it
  if (allSlideContents.length > 0) {
    return allSlideContents.join('\n\n---\n\n')
  }

  // Break slides
  if (session.type === 'break') {
    return buildBreakSlide(session, language)
  }

  // Day recap
  if (session.type === 'day_recap') {
    return buildDayRecapSlide(session, config, dayNumber, language)
  }

  // Day end
  if (session.type === 'day_end') {
    return buildDayEndSlide(session, dayNumber, language)
  }

  // Section/Agenda - check if this is an agenda section
  if (session.type === 'section') {
    // If session name contains "Agenda" and a day number, generate agenda table
    // Supports both English "Day 1 Agenda" and French "Agenda Jour 1"
    const agendaMatch = session.session.match(/Day\s*(\d+)\s*Agenda/i)
      || session.session.match(/Agenda\s*(?:Jour|Day)\s*(\d+)/i)
    if (agendaMatch) {
      const agendaDay = parseInt(agendaMatch[1])
      return buildDayAgendaSlide(config, agendaDay, language)
    }
    return buildSectionSlide(session)
  }

  // Generic session (no specific slides)
  return buildGenericSessionSlide(session)
}

// Module names loaded from modules.yaml via registry
// (replaces hardcoded MODULE_NAMES dict)

/**
 * Load slides for a module, optionally filtered by topic range or excluded slides
 * Topics are numbered based on their file names (e.g., m4_1_xxx.md = topic 1, m4_2_xxx.md = topic 2)
 * Files like m4_1a_xxx.md are considered sub-topics and grouped with topic 1
 *
 * Content versions:
 * - "full": Uses files like m4_0_*, m4_1_*, m4_1a_*, m4_2_* (numbered, no _s prefix)
 * - "condensed": Uses files like m4_s1_*, m4_s2_*, m4_s3_* (with _s prefix)
 */
async function buildModuleSlides(
  moduleId: string,
  sessionName?: string,
  sessionNumber?: number,
  topicRange?: { start: number; end: number } | null,
  excludedSlides?: string[],
  version?: 'full' | 'condensed',
  language: Language = 'en'
): Promise<string | null> {
  // Handle imported modules (stored in database, not filesystem)
  if (moduleId.startsWith('imported_')) {
    return await buildImportedModuleSlides(moduleId, sessionName, sessionNumber)
  }

  // Handle external decks (PDF pages stored as images)
  if (moduleId.startsWith('external_')) {
    return await buildExternalDeckSlides(moduleId, sessionName, sessionNumber)
  }

  const folderName = getModuleFolder(moduleId)
  if (!folderName) return null

  const coreContentPath = getCoreContentPath(language)
  const modulePath = path.join(coreContentPath, folderName)
  if (!fs.existsSync(modulePath)) return null

  const effectiveVersion = version || 'full'

  // Try _meta.yaml for ordering, fall back to regex
  const meta = loadModuleMeta(coreContentPath, folderName)
  let files: string[]

  if (meta?.slides) {
    // Metadata-driven: filter by variant + sort by order
    files = meta.slides
      .filter(entry => {
        if (moduleId === 'overview') return true
        return effectiveVersion === 'condensed'
          ? entry.variant === 'condensed'
          : entry.variant !== 'condensed'
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(entry => entry.file)
      .filter(f => fs.existsSync(path.join(modulePath, f)))
  } else {
    // Fallback: filesystem scan with regex sorting
    files = fs.readdirSync(modulePath).filter(f => f.endsWith('.md'))

    if (moduleId !== 'overview') {
      if (effectiveVersion === 'condensed') {
        files = files.filter(f => f.match(/^m\d+[a-z]?_s\d+/) !== null)
      } else {
        files = files.filter(f => f.match(/^m\d+[a-z]?_s\d+/) === null)
      }
    }

    files = files.sort((a, b) => {
      const aMatch = a.match(/^(?:m\d+[a-z]?_s?|mai_)?(\d+)/)
      const bMatch = b.match(/^(?:m\d+[a-z]?_s?|mai_)?(\d+)/)
      const aNum = aMatch ? parseInt(aMatch[1]) : 0
      const bNum = bMatch ? parseInt(bMatch[1]) : 0
      if (aNum !== bNum) return aNum - bNum
      return a.localeCompare(b)
    })
  }

  // Filter by topic range if specified
  // Works for both full (m4_1_*) and condensed (m4_s1_*) files
  if (topicRange) {
    files = files.filter(f => {
      // Try condensed pattern first (m4_s1, m4_s2, etc.)
      const condensedMatch = f.match(/^m\d+[a-z]?_s(\d+)/)
      if (condensedMatch) {
        const topicNum = parseInt(condensedMatch[1])
        return topicNum >= topicRange.start && topicNum <= topicRange.end
      }
      // Try full pattern (m4_0, m4_1, m4_1a, m9c_3, etc.)
      const fullMatch = f.match(/^m\d+[a-z]?_(\d+)/)
      if (fullMatch) {
        const topicNum = parseInt(fullMatch[1])
        return topicNum >= topicRange.start && topicNum <= topicRange.end
      }
      return false
    })
  }

  // Filter out excluded slides
  if (excludedSlides && excludedSlides.length > 0) {
    files = files.filter(f => !excludedSlides.includes(f))
  }

  // Fall back to full variant if condensed has no slides
  if (files.length === 0 && effectiveVersion === 'condensed') {
    console.warn(`No condensed slides for ${moduleId}, falling back to full variant`)
    // Re-run with full variant
    if (meta?.slides) {
      files = meta.slides
        .filter(entry => moduleId === 'overview' || entry.variant !== 'condensed')
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map(entry => entry.file)
        .filter(f => fs.existsSync(path.join(modulePath, f)))
    } else {
      files = fs.readdirSync(modulePath).filter(f => f.endsWith('.md'))
      if (moduleId !== 'overview') {
        files = files.filter(f => f.match(/^m\d+[a-z]?_s\d+/) === null)
      }
      files = files.sort((a, b) => {
        const aMatch = a.match(/^(?:m\d+[a-z]?_s?|mai_)?(\d+)/)
        const bMatch = b.match(/^(?:m\d+[a-z]?_s?|mai_)?(\d+)/)
        const aNum = aMatch ? parseInt(aMatch[1]) : 0
        const bNum = bMatch ? parseInt(bMatch[1]) : 0
        if (aNum !== bNum) return aNum - bNum
        return a.localeCompare(b)
      })
    }
  }

  if (files.length === 0) {
    return null
  }

  // Start with a session title slide
  const moduleName = getModuleName(moduleId) || sessionName || 'Session'
  const displayName = sessionName || moduleName
  const sessionLabel = sessionNumber ? `Session ${sessionNumber}` : 'Session'
  const titleSlide = `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# ${sessionLabel}: ${displayName}`

  const contents: string[] = [titleSlide]
  for (const file of files) {
    let content = fs.readFileSync(path.join(modulePath, file), 'utf-8')
    // Remove frontmatter from module files (we have our own)
    content = content.replace(/^---[\s\S]*?---\s*/m, '')
    contents.push(content.trim())
  }

  return contents.join('\n\n---\n\n')
}

/**
 * Build slides for an imported module (from database)
 */
async function buildImportedModuleSlides(
  moduleId: string,
  sessionName?: string,
  sessionNumber?: number
): Promise<string | null> {
  const dbId = moduleId.replace(/^imported_/, '')
  const mod = await getImportedModule(dbId)
  if (!mod) return null

  const slides = await getImportedSlides(dbId)
  if (slides.length === 0) return null

  const displayName = sessionName || mod.name
  const sessionLabel = sessionNumber ? `Session ${sessionNumber}` : 'Session'
  const titleSlide = `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# ${sessionLabel}: ${displayName}`

  const contents: string[] = [titleSlide]
  for (const slide of slides) {
    if (slide.markdown.trim()) {
      contents.push(slide.markdown.trim())
    }
  }

  return contents.join('\n\n---\n\n')
}

/**
 * Build slides for an external deck (PDF pages stored as images)
 */
async function buildExternalDeckSlides(
  moduleId: string,
  sessionName?: string,
  sessionNumber?: number
): Promise<string | null> {
  const dbId = moduleId.replace(/^external_/, '')
  const deck = await getExternalDeck(dbId)
  if (!deck) return null

  const pages = await getExternalPages(dbId)
  if (pages.length === 0) return null

  const displayName = sessionName || deck.name
  const sessionLabel = sessionNumber ? `Session ${sessionNumber}` : 'Session'
  const titleSlide = `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# ${sessionLabel}: ${displayName}`

  const contents: string[] = [titleSlide]
  for (const page of pages) {
    contents.push(`<!-- _class: external-slide -->
![bg contain](/api/import/external/${dbId}/pages/${page.page_number})`)
  }

  return contents.join('\n\n---\n\n')
}

/**
 * Materialize external page images from API URLs to filesystem paths.
 * This is needed for PDF/PPTX export which can't fetch localhost URLs.
 * Returns the rewritten markdown and a cleanup function.
 */
export function materializeExternalImages(markdown: string): { markdown: string; tempDir: string | null } {
  const EXTERNAL_DIR = path.join(path.resolve(__dirname, '../../data'), 'external')
  const regex = /!\[bg contain\]\(\/api\/import\/external\/([^/]+)\/pages\/(\d+)\)/g

  let hasMatches = false
  const rewritten = markdown.replace(regex, (_match, deckId, pageNum) => {
    hasMatches = true
    const imageFilename = `${deckId}_page_${pageNum}.png`
    const imagePath = path.join(EXTERNAL_DIR, imageFilename)
    if (fs.existsSync(imagePath)) {
      return `![bg contain](${imagePath})`
    }
    return _match // Keep original if file not found
  })

  return { markdown: rewritten, tempDir: hasMatches ? EXTERNAL_DIR : null }
}

/**
 * Get list of all slide files for a module (for UI to display)
 * @param moduleId - Module ID (e.g., "m4")
 * @param version - Optional version filter ("full" or "condensed")
 * @param language - Language code ('en' or 'fr')
 */
export function getModuleSlideFiles(moduleId: string, version?: 'full' | 'condensed', language: Language = 'en'): string[] {
  const folderName = getModuleFolder(moduleId)
  if (!folderName) return []

  const coreContentPath = getCoreContentPath(language)
  const modulePath = path.join(coreContentPath, folderName)
  if (!fs.existsSync(modulePath)) return []

  // Try _meta.yaml for ordering, fall back to regex
  const meta = loadModuleMeta(coreContentPath, folderName)

  if (meta?.slides) {
    const effectiveVersion = version || 'full'
    return meta.slides
      .filter(entry => {
        if (moduleId === 'overview') return true
        return effectiveVersion === 'condensed'
          ? entry.variant === 'condensed'
          : entry.variant !== 'condensed'
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(entry => entry.file)
      .filter(f => fs.existsSync(path.join(modulePath, f)))
  }

  // Fallback: filesystem scan with regex sorting
  let files = fs.readdirSync(modulePath).filter(f => f.endsWith('.md'))

  if (moduleId !== 'overview') {
    const effectiveVersion = version || 'full'
    if (effectiveVersion === 'condensed') {
      files = files.filter(f => f.match(/^m\d+[a-z]?_s\d+/) !== null)
    } else {
      files = files.filter(f => f.match(/^m\d+[a-z]?_s\d+/) === null)
    }
  }

  return files.sort((a, b) => {
    const aMatch = a.match(/^(?:m\d+[a-z]?_s?|mai_)?(\d+)/)
    const bMatch = b.match(/^(?:m\d+[a-z]?_s?|mai_)?(\d+)/)
    const aNum = aMatch ? parseInt(aMatch[1]) : 0
    const bNum = bMatch ? parseInt(bMatch[1]) : 0
    if (aNum !== bNum) return aNum - bNum
    return a.localeCompare(b)
  })
}

/**
 * Load a slide template and substitute variables
 */
async function loadSlideContent(
  slideFile: string,
  config: WorkshopConfig,
  dayNumber: number,
  session: Session,
  language: Language = 'en'
): Promise<string | null> {
  // Check for dynamic agenda slides (day1_agenda, day2_agenda, etc.)
  const agendaMatch = slideFile.match(/^day(\d+)_agenda$/)
  if (agendaMatch) {
    const agendaDay = parseInt(agendaMatch[1])
    return buildDayAgendaSlide(config, agendaDay)
  }

  const coreContentPath = getCoreContentPath(language)

  // Try language-specific templates folder first, then fall back to English
  const templatesPathForLang = language !== 'en'
    ? path.join(REPO_ROOT, `templates_${language}`)
    : TEMPLATES_PATH
  let filePath = path.join(templatesPathForLang, slideFile)
  if (!fs.existsSync(filePath) && language !== 'en') {
    // Fall back to English templates
    filePath = path.join(TEMPLATES_PATH, slideFile)
  }
  if (!fs.existsSync(filePath)) {
    // Try custom_slides subfolder
    filePath = path.join(TEMPLATES_PATH, 'custom_slides', slideFile)
  }

  // Try core_content folders (for topic files like m4_01_approach.md)
  if (!fs.existsSync(filePath)) {
    const moduleMatch = slideFile.match(/^(m\d+[a-z]?)_/)
    if (moduleMatch) {
      const moduleId = moduleMatch[1]
      const folderName = getModuleFolder(moduleId)
      if (folderName) {
        filePath = path.join(coreContentPath, folderName, slideFile)
      }
    }
  }

  // Fallback to English if French file not found
  if (!fs.existsSync(filePath) && language !== 'en') {
    const englishPath = getCoreContentPath('en')
    const moduleMatch = slideFile.match(/^(m\d+[a-z]?)_/)
    if (moduleMatch) {
      const moduleId = moduleMatch[1]
      const folderName = getModuleFolder(moduleId)
      if (folderName) {
        const fallbackPath = path.join(englishPath, folderName, slideFile)
        if (fs.existsSync(fallbackPath)) {
          console.warn(`French file not found for ${slideFile}, using English fallback`)
          filePath = fallbackPath
        }
      }
    }
  }

  if (!fs.existsSync(filePath)) {
    console.warn(`Slide file not found: ${slideFile}`)
    return null
  }

  let content = fs.readFileSync(filePath, 'utf-8')

  // Remove frontmatter
  content = content.replace(/^---[\s\S]*?---\s*/m, '')

  // Remove trailing slide separator (prevents double ---)
  content = content.replace(/\n---\s*$/, '')

  // Substitute variables
  content = substituteVariables(content, config, dayNumber, session, language)

  return content.trim()
}

/**
 * Build a day agenda slide with schedule table
 */
function buildDayAgendaSlide(config: WorkshopConfig, dayNumber: number, language: Language = 'en'): string {
  const isFr = language === 'fr'
  const dayKey = `day${dayNumber}` as keyof typeof config.schedule
  const sessions = config.schedule[dayKey] as Session[] | undefined
  const dayTitle = config.schedule.day_titles?.[dayNumber] || (isFr ? `Jour ${dayNumber}` : `Day ${dayNumber}`)

  if (!sessions || sessions.length === 0) {
    return `# ${isFr ? `Jour ${dayNumber} - Agenda` : `Day ${dayNumber} - Agenda`}

*${isFr ? 'Aucune session programmée' : 'No sessions scheduled'}*
`
  }

  // Get day start time
  const dayStartTime = config.schedule.day_start_times?.[dayNumber] || '09:00'
  const [startHours, startMinutes] = dayStartTime.split(':').map(Number)
  let currentMinutes = startHours * 60 + startMinutes

  // Helper to format time
  const formatTime = (mins: number): string => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  // Build table rows with Time, Session, and Facilitator columns
  const rows: string[] = []
  rows.push(isFr
    ? '| Heure | Session | Facilitateur |'
    : '| Time | Session | Facilitator |')
  rows.push('|------|---------|-------------|')

  let sessionNumber = 1
  const breakTypes = ['tea_break', 'lunch_break', 'break']
  const skipNumberTypes = ['day_start', 'day_end', 'day_recap', 'opening', 'closing']

  for (const s of sessions) {
    // Skip section headers and title slides in agenda
    if (s.type === 'section' || s.type === 'day_title') continue
    if (s.duration === 0) continue  // Skip 0-duration items like title slides

    const rawName = s.session || ''
    if (!rawName) continue

    // Use explicit time if provided, otherwise calculate from current position
    let timeStr = s.time || ''
    if (!timeStr && s.duration) {
      const endMinutes = currentMinutes + s.duration
      timeStr = `${formatTime(currentMinutes)}-${formatTime(endMinutes)}`
    }

    const speaker = s.speaker || ''

    // Add session number for main sessions (not breaks or admin items)
    let displayName = rawName
    const isBreak = breakTypes.includes(s.type || '')
    const isAdmin = skipNumberTypes.includes(s.type || '')
    const isModuleSession = !isBreak && !isAdmin && s.module
    if (isModuleSession) {
      displayName = `Session ${sessionNumber}: ${rawName}`
      sessionNumber++
    }

    if (timeStr) {
      // Only make module sessions bold, not breaks or admin items
      const formattedName = isModuleSession ? `**${displayName}**` : displayName
      rows.push(`| ${timeStr} | ${formattedName} | ${speaker} |`)
    }

    // Advance current time by duration
    if (s.duration) {
      currentMinutes += s.duration
    }
  }

  return `<!-- _class: agenda -->

# ${isFr ? `Jour ${dayNumber} - Agenda` : `Day ${dayNumber} - Agenda`}

**${dayTitle}**

${rows.join('\n')}
`
}

/**
 * Substitute template variables
 */
function substituteVariables(
  content: string,
  config: WorkshopConfig,
  dayNumber: number,
  session: Session,
  language: Language = 'en'
): string {
  // Cast to any to access optional properties
  const workshop = config.workshop as any

  // Format dates nicely
  const locale = language === 'fr' ? 'fr-FR' : 'en-US'
  const formatDateRange = (startDate?: string, endDate?: string): string => {
    if (!startDate) return ''
    try {
      const start = new Date(startDate)
      const end = endDate ? new Date(endDate) : null
      const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }

      if (!end || startDate === endDate) {
        return start.toLocaleDateString(locale, options)
      }

      // Same month and year
      if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${start.toLocaleDateString(locale, { month: 'long', day: 'numeric' })}-${end.getDate()}, ${end.getFullYear()}`
      }

      // Different months
      return `${start.toLocaleDateString(locale, options)} - ${end.toLocaleDateString(locale, options)}`
    } catch {
      return startDate || ''
    }
  }

  const vars: Record<string, string> = {
    '{{WORKSHOP_NAME}}': config.workshop.name || 'FASTR Workshop',
    '{{COUNTRY}}': config.workshop.country || '',
    '{{LOCATION}}': config.workshop.location || '',
    '{{DATE}}': formatDateRange(workshop.start_date, workshop.end_date) || workshop.date || '',
    '{{START_DATE}}': workshop.start_date || '',
    '{{END_DATE}}': workshop.end_date || '',
    '{{VENUE}}': config.workshop.venue || '',
    '{{FACILITATORS}}': config.workshop.facilitators || '',
    '{{CONTACT_EMAIL}}': config.workshop.contact_email || '',
    '{{WEBSITE}}': config.workshop.website || '',
    '{{DAY_NUMBER}}': String(dayNumber),
    '{{DAY_TITLE}}': config.schedule.day_titles?.[dayNumber] || `Day ${dayNumber}`,
    '{{SESSION_NAME}}': session.session || '',
    '{{RESUME_TIME}}': calculateResumeTime(session),
    '{{LAST_DAY}}': String(config.schedule.days || 1),
    // Cover slide fields
    '{{TITLE}}': workshop.title || config.workshop.name || 'FASTR Workshop',
    '{{SUBTITLE}}': workshop.subtitle || `${config.workshop.country || ''} Workshop`.trim() || '',
  }

  // Objectives as bullet list
  if (config.workshop.objectives) {
    const objectives = config.workshop.objectives
      .split('\n')
      .filter(line => line.trim())
      .map(line => `- ${line.trim().replace(/^[-•*]\s*/, '')}`)
      .join('\n')
    vars['{{OBJECTIVES}}'] = objectives
  } else {
    vars['{{OBJECTIVES}}'] = '- Objectives to be defined'
  }

  // Scope of work as bullet list
  if (workshop.scope_of_work) {
    const scope = workshop.scope_of_work
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => `- ${line.trim().replace(/^[-•*]\s*/, '')}`)
      .join('\n')
    vars['{{SCOPE_OF_WORK}}'] = scope
  } else {
    vars['{{SCOPE_OF_WORK}}'] = ''
  }

  // Expected outputs as bullet list
  if (workshop.expected_outputs) {
    const outputs = workshop.expected_outputs
      .split('\n')
      .filter((line: string) => line.trim())
      .map((line: string) => `- ${line.trim().replace(/^[-•*]\s*/, '')}`)
      .join('\n')
    vars['{{EXPECTED_OUTPUTS}}'] = outputs
  } else {
    vars['{{EXPECTED_OUTPUTS}}'] = ''
  }

  for (const [key, value] of Object.entries(vars)) {
    content = content.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value)
  }

  return content
}

/**
 * Calculate resume time after a break
 */
function calculateResumeTime(session: Session): string {
  if (!session.time) return ''

  // Time format is "HH:MM-HH:MM" (start-end range)
  // The end time IS the resume time
  const timeMatch = session.time.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/)
  if (timeMatch) {
    return timeMatch[2] // Return end time as resume time
  }

  // Fallback: if only start time provided, calculate from duration
  if (session.duration) {
    const startMatch = session.time.match(/^(\d{1,2}):(\d{2})/)
    if (startMatch) {
      const hours = parseInt(startMatch[1])
      const minutes = parseInt(startMatch[2])
      const totalMinutes = hours * 60 + minutes + session.duration
      const resumeHours = Math.floor(totalMinutes / 60)
      const resumeMinutes = totalMinutes % 60
      return `${resumeHours.toString().padStart(2, '0')}:${resumeMinutes.toString().padStart(2, '0')}`
    }
  }

  return ''
}

/**
 * Build a break slide
 */
function buildBreakSlide(session: Session, language: Language = 'en'): string {
  const isFr = language === 'fr'
  const lunchPattern = /lunch|déjeuner|dejeuner|dîner|diner|midi/i
  const isLunch = lunchPattern.test(session.session)
  const duration = session.duration || (isLunch ? 60 : 15)
  const resumeTime = calculateResumeTime(session)

  const title = isLunch
    ? (isFr ? '🍽️ Pause déjeuner' : '🍽️ Lunch Break')
    : (isFr ? '☕ Pause café' : '☕ Tea Break')

  const durationLabel = isFr ? `**${duration} minutes**` : `**${duration} minutes**`
  const resumeLabel = resumeTime
    ? (isFr ? `Reprise à **${resumeTime}**` : `We resume at **${resumeTime}**`)
    : ''

  return `<!-- _class: break -->
![bg](../resources/backgrounds/break_slide.png)

# ${title}

${durationLabel}

${resumeLabel}
`
}

/**
 * Build a day recap slide - recaps the PREVIOUS day
 * Simple slide with thought icon, facilitator fills in verbally
 */
function buildDayRecapSlide(session: Session, config: WorkshopConfig, dayNumber: number, language: Language = 'en'): string {
  const isFr = language === 'fr'
  const previousDay = dayNumber - 1

  return `## ${isFr ? `Récapitulatif : Jour ${previousDay}` : `Day ${previousDay} Recap`}

<div style="display: flex; justify-content: center; align-items: center; height: 60%;">

![w:200](../../resources/icons/thought.png)

</div>
`
}

/**
 * Build day end slides
 */
function buildDayEndSlide(session: Session, dayNumber: number, language: Language = 'en'): string {
  const isFr = language === 'fr'

  return `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# ${isFr ? 'Messages clés et conclusion' : 'Key messages and wrap-up'}

---

## ${isFr ? 'Réflexions des participants' : 'Reflections from Participants'}

<div style="display: flex; justify-content: center; align-items: center; height: 60%;">

![w:200](../../resources/icons/communication.png)

</div>
`
}

/**
 * Build a section/agenda slide
 */
function buildSectionSlide(session: Session): string {
  return `<!-- _class: section-cover -->
![bg](../resources/backgrounds/section_slide.png)

# ${session.session}
`
}

/**
 * Build a generic session slide
 */
function buildGenericSessionSlide(session: Session): string {
  return `## ${session.session}

<div style="display: flex; justify-content: center; align-items: center; height: 65%; opacity: 0.15;">
<div style="text-align: center;">
<p style="font-size: 3em; font-weight: 700; letter-spacing: 0.15em; color: #09544F;">PLACEHOLDER</p>
</div>
</div>

${session.duration ? `*${session.duration} minutes*` : ''}
`
}
