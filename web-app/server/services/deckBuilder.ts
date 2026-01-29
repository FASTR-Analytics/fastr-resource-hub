import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { WorkshopConfig } from '../db/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths - different in dev vs prod due to TypeScript compilation
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')
const CORE_CONTENT_PATH = path.join(REPO_ROOT, 'core_content')
const TEMPLATES_PATH = path.join(REPO_ROOT, 'templates')

// Module folder names - must match actual folder names in core_content/
const MODULE_FOLDERS: Record<string, string> = {
  m0: 'm0_introduction',
  m1: 'm1_identify_questions_indicators',
  m2: 'm2_data_extraction',
  m3: 'm3_fastr_analytics_platform',
  m4: 'm4_data_quality_assessment',
  m5: 'm5_data_quality_adjustment',
  m6: 'm6_data_analysis',
  m7: 'm7_results_communication',
  m8: 'm8_survey_hfa',
  m9: 'm9_workshop_activities',
}

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
 */
export async function buildMarkdown(workshopId: string, config: WorkshopConfig): Promise<string> {
  const slides: string[] = []

  // Marp frontmatter
  slides.push(`---
marp: true
theme: fastr
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

      const slideContent = await buildSessionSlides(session, config, day, isContentSession ? sessionNumber : undefined)
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
  sessionNumber?: number
): Promise<string | null> {
  return buildSessionSlides(session, config, dayNumber, sessionNumber)
}

/**
 * Build slides for a single session
 */
async function buildSessionSlides(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number,
  sessionNumber?: number
): Promise<string | null> {
  const allSlideContents: string[] = []

  // PREFIX SLIDES (from slides array) - load FIRST
  // This allows adding intro slides before module content
  // e.g., Add m4_0_fastr_methods_overview.md before condensed content
  if (session.slides && session.slides.length > 0) {
    for (const slideFile of session.slides) {
      const content = await loadSlideContent(slideFile, config, dayNumber, session)
      if (content) {
        allSlideContents.push(content)
      }
    }
  }

  // MODULE CONTENT - load SECOND
  // Uses full or condensed version based on session.version
  if (session.module) {
    const moduleSlides = buildModuleSlides(session.module, session.session, sessionNumber, session.topic_range, session.excludedSlides, session.version)
    if (moduleSlides) {
      allSlideContents.push(moduleSlides)
    }
  }

  // TOPICS ARRAY - load THIRD
  // Individual topic files like m4_s1, m4_s2, etc.
  // Useful for cherry-picking specific topics without loading entire module
  if (session.topics && Array.isArray(session.topics) && session.topics.length > 0) {
    for (const topicId of session.topics) {
      // Topic IDs like "m4_s1" need to be converted to file names
      // Try to find the matching file in core_content
      const moduleMatch = topicId.match(/^(m\d+)_/)
      if (moduleMatch) {
        const moduleId = moduleMatch[1]
        const folderName = MODULE_FOLDERS[moduleId]
        if (folderName) {
          const modulePath = path.join(CORE_CONTENT_PATH, folderName)
          if (fs.existsSync(modulePath)) {
            // Find file that starts with the topic ID
            const files = fs.readdirSync(modulePath).filter(f => f.startsWith(topicId) && f.endsWith('.md'))
            for (const file of files) {
              let content = fs.readFileSync(path.join(modulePath, file), 'utf-8')
              // Remove frontmatter
              content = content.replace(/^---[\s\S]*?---\s*/m, '')
              content = content.replace(/\n---\s*$/, '')
              content = substituteVariables(content, config, dayNumber, session)
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
    return buildBreakSlide(session)
  }

  // Day recap
  if (session.type === 'day_recap') {
    return buildDayRecapSlide(session, config, dayNumber)
  }

  // Day end
  if (session.type === 'day_end') {
    return buildDayEndSlide(session, dayNumber)
  }

  // Section/Agenda - check if this is an agenda section
  if (session.type === 'section') {
    // If session name contains "Agenda" and a day number, generate agenda table
    const agendaMatch = session.session.match(/Day\s*(\d+)\s*Agenda/i)
    if (agendaMatch) {
      const agendaDay = parseInt(agendaMatch[1])
      return buildDayAgendaSlide(config, agendaDay)
    }
    return buildSectionSlide(session)
  }

  // Generic session (no specific slides)
  return buildGenericSessionSlide(session)
}

// Module names for title slides
const MODULE_NAMES: Record<string, string> = {
  m0: 'Introduction to FASTR',
  m1: 'Identify Questions & Indicators',
  m2: 'Data Extraction',
  m3: 'FASTR Analytics Platform',
  m4: 'Data Quality Assessment',
  m5: 'Data Quality Adjustment',
  m6: 'Data Analysis',
  m7: 'Results Communication',
  m8: 'Survey & HFA',
  m9: 'Workshop Activities',
}

/**
 * Load slides for a module, optionally filtered by topic range or excluded slides
 * Topics are numbered based on their file names (e.g., m4_1_xxx.md = topic 1, m4_2_xxx.md = topic 2)
 * Files like m4_1a_xxx.md are considered sub-topics and grouped with topic 1
 *
 * Content versions:
 * - "full": Uses files like m4_0_*, m4_1_*, m4_1a_*, m4_2_* (numbered, no _s prefix)
 * - "condensed": Uses files like m4_s1_*, m4_s2_*, m4_s3_* (with _s prefix)
 */
function buildModuleSlides(
  moduleId: string,
  sessionName?: string,
  sessionNumber?: number,
  topicRange?: { start: number; end: number } | null,
  excludedSlides?: string[],
  version?: 'full' | 'condensed'
): string | null {
  const folderName = MODULE_FOLDERS[moduleId]
  if (!folderName) return null

  const modulePath = path.join(CORE_CONTENT_PATH, folderName)
  if (!fs.existsSync(modulePath)) return null

  // Get all .md files
  let files = fs.readdirSync(modulePath).filter(f => f.endsWith('.md'))

  // Filter by version (full vs condensed)
  // Full version: files like m4_0_*, m4_1_*, m4_1a_* (NO _s after module ID)
  // Condensed version: files like m4_s1_*, m4_s2_* (WITH _s after module ID)
  // Default to "full" if not specified
  const effectiveVersion = version || 'full'

  if (effectiveVersion === 'condensed') {
    // Condensed: only include files with _s pattern (e.g., m4_s1_*, m4_s2_*)
    files = files.filter(f => {
      const match = f.match(/^m\d+_s\d+/)
      return match !== null
    })
  } else {
    // Full (default): exclude files with _s pattern, keep only numbered files (m4_0_*, m4_1_*, m4_1a_*)
    files = files.filter(f => {
      const match = f.match(/^m\d+_s\d+/)
      return match === null  // NOT a condensed file
    })
  }

  // Sort files by topic number
  files = files.sort((a, b) => {
      // Handle condensed files (m4_s1, m4_s2, etc.)
      const aCondensedMatch = a.match(/^m\d+_s(\d+)/)
      const bCondensedMatch = b.match(/^m\d+_s(\d+)/)

      // Handle full files (m4_0, m4_1, m4_1a, etc.)
      const aFullMatch = a.match(/^m\d+_(\d+)/)
      const bFullMatch = b.match(/^m\d+_(\d+)/)

      // Get numbers for sorting
      const aNum = aCondensedMatch ? parseInt(aCondensedMatch[1]) : (aFullMatch ? parseInt(aFullMatch[1]) : 0)
      const bNum = bCondensedMatch ? parseInt(bCondensedMatch[1]) : (bFullMatch ? parseInt(bFullMatch[1]) : 0)

      if (aNum !== bNum) return aNum - bNum
      // If same topic number, sort alphabetically (e.g., m4_1 before m4_1a before m4_1b)
      return a.localeCompare(b)
    })

  // Filter by topic range if specified
  // Works for both full (m4_1_*) and condensed (m4_s1_*) files
  if (topicRange) {
    files = files.filter(f => {
      // Try condensed pattern first (m4_s1, m4_s2, etc.)
      const condensedMatch = f.match(/^m\d+_s(\d+)/)
      if (condensedMatch) {
        const topicNum = parseInt(condensedMatch[1])
        return topicNum >= topicRange.start && topicNum <= topicRange.end
      }
      // Try full pattern (m4_0, m4_1, m4_1a, etc.)
      const fullMatch = f.match(/^m\d+_(\d+)/)
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

  if (files.length === 0) {
    return null
  }

  // Start with a session title slide
  const moduleName = MODULE_NAMES[moduleId] || sessionName || 'Session'
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
 * Get list of all slide files for a module (for UI to display)
 * @param moduleId - Module ID (e.g., "m4")
 * @param version - Optional version filter ("full" or "condensed")
 */
export function getModuleSlideFiles(moduleId: string, version?: 'full' | 'condensed'): string[] {
  const folderName = MODULE_FOLDERS[moduleId]
  if (!folderName) return []

  const modulePath = path.join(CORE_CONTENT_PATH, folderName)
  if (!fs.existsSync(modulePath)) return []

  let files = fs.readdirSync(modulePath).filter(f => f.endsWith('.md'))

  // Filter by version (default to "full" if not specified)
  const effectiveVersion = version || 'full'
  if (effectiveVersion === 'condensed') {
    files = files.filter(f => f.match(/^m\d+_s\d+/) !== null)
  } else {
    // Full (default): exclude condensed files
    files = files.filter(f => f.match(/^m\d+_s\d+/) === null)
  }

  return files.sort((a, b) => {
      // Handle condensed files (m4_s1, m4_s2, etc.)
      const aCondensedMatch = a.match(/^m\d+_s(\d+)/)
      const bCondensedMatch = b.match(/^m\d+_s(\d+)/)

      // Handle full files (m4_0, m4_1, m4_1a, etc.)
      const aFullMatch = a.match(/^m\d+_(\d+)/)
      const bFullMatch = b.match(/^m\d+_(\d+)/)

      // Get numbers for sorting
      const aNum = aCondensedMatch ? parseInt(aCondensedMatch[1]) : (aFullMatch ? parseInt(aFullMatch[1]) : 0)
      const bNum = bCondensedMatch ? parseInt(bCondensedMatch[1]) : (bFullMatch ? parseInt(bFullMatch[1]) : 0)

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
  session: Session
): Promise<string | null> {
  // Check for dynamic agenda slides (day1_agenda, day2_agenda, etc.)
  const agendaMatch = slideFile.match(/^day(\d+)_agenda$/)
  if (agendaMatch) {
    const agendaDay = parseInt(agendaMatch[1])
    return buildDayAgendaSlide(config, agendaDay)
  }

  // Try templates folder first
  let filePath = path.join(TEMPLATES_PATH, slideFile)
  if (!fs.existsSync(filePath)) {
    // Try custom_slides subfolder
    filePath = path.join(TEMPLATES_PATH, 'custom_slides', slideFile)
  }

  // Try core_content folders (for topic files like m4_01_approach.md)
  if (!fs.existsSync(filePath)) {
    const moduleMatch = slideFile.match(/^(m\d+)_/)
    if (moduleMatch) {
      const moduleId = moduleMatch[1]
      const folderName = MODULE_FOLDERS[moduleId]
      if (folderName) {
        filePath = path.join(CORE_CONTENT_PATH, folderName, slideFile)
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
  content = substituteVariables(content, config, dayNumber, session)

  return content.trim()
}

/**
 * Build a day agenda slide with schedule table
 */
function buildDayAgendaSlide(config: WorkshopConfig, dayNumber: number): string {
  const dayKey = `day${dayNumber}` as keyof typeof config.schedule
  const sessions = config.schedule[dayKey] as Session[] | undefined
  const dayTitle = config.schedule.day_titles?.[dayNumber] || `Day ${dayNumber}`

  if (!sessions || sessions.length === 0) {
    return `# Day ${dayNumber} - Agenda

*No sessions scheduled*
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
  rows.push('| Time | Session | Facilitator |')
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

# Day ${dayNumber} - Agenda

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
  session: Session
): string {
  // Cast to any to access optional properties
  const workshop = config.workshop as any

  // Format dates nicely
  const formatDateRange = (startDate?: string, endDate?: string): string => {
    if (!startDate) return ''
    try {
      const start = new Date(startDate)
      const end = endDate ? new Date(endDate) : null
      const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }

      if (!end || startDate === endDate) {
        return start.toLocaleDateString('en-US', options)
      }

      // Same month and year
      if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}-${end.getDate()}, ${end.getFullYear()}`
      }

      // Different months
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
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
function buildBreakSlide(session: Session): string {
  const isLunch = session.session.toLowerCase().includes('lunch')
  const duration = session.duration || (isLunch ? 60 : 15)
  const resumeTime = calculateResumeTime(session)

  return `<!-- _class: break -->
![bg](../resources/backgrounds/break_slide.png)

# ${isLunch ? '🍽️ Lunch Break' : '☕ Tea Break'}

**${duration} minutes**

${resumeTime ? `We resume at **${resumeTime}**` : ''}
`
}

/**
 * Build a day recap slide - recaps the PREVIOUS day
 * Simple slide with thought icon, facilitator fills in verbally
 */
function buildDayRecapSlide(session: Session, config: WorkshopConfig, dayNumber: number): string {
  const previousDay = dayNumber - 1

  return `## Day ${previousDay} Recap

<div style="display: flex; justify-content: center; align-items: center; height: 60%;">

![w:200](../../resources/icons/thought.png)

</div>
`
}

/**
 * Build day end slides
 */
function buildDayEndSlide(session: Session, dayNumber: number): string {
  return `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# Key messages and wrap-up

---

## Reflections from Participants

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

${session.duration ? `*Duration: ${session.duration} minutes*` : ''}
`
}
