import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { WorkshopConfig } from '../db/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const REPO_ROOT = path.resolve(__dirname, '../../..')
const CORE_CONTENT_PATH = path.join(REPO_ROOT, 'core_content')
const TEMPLATES_PATH = path.join(REPO_ROOT, 'templates')

// Module folder names
const MODULE_FOLDERS: Record<string, string> = {
  m0: 'm0_introduction',
  m1: 'm1_questions_indicators',
  m2: 'm2_data_extraction',
  m3: 'm3_platform',
  m4: 'm4_data_quality_assessment',
  m5: 'm5_data_quality_adjustment',
  m6: 'm6_data_analysis',
  m7: 'm7_results_communication',
  m8: 'm8_survey_hfa',
}

interface Session {
  session: string
  module?: string
  slides?: string[]
  type?: string
  duration?: number
  time?: string
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
  // Module content
  if (session.module) {
    return buildModuleSlides(session.module, session.session, sessionNumber)
  }

  // Template slides
  if (session.slides && session.slides.length > 0) {
    const slideContents: string[] = []

    for (const slideFile of session.slides) {
      const content = await loadSlideContent(slideFile, config, dayNumber, session)
      if (content) {
        slideContents.push(content)
      }
    }

    return slideContents.join('\n\n---\n\n')
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
}

/**
 * Load all slides for a module
 */
function buildModuleSlides(moduleId: string, sessionName?: string, sessionNumber?: number): string | null {
  const folderName = MODULE_FOLDERS[moduleId]
  if (!folderName) return null

  const modulePath = path.join(CORE_CONTENT_PATH, folderName)
  if (!fs.existsSync(modulePath)) return null

  const files = fs.readdirSync(modulePath)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => {
      const aMatch = a.match(/^m\d+_(\d+)/)
      const bMatch = b.match(/^m\d+_(\d+)/)
      const aNum = aMatch ? parseInt(aMatch[1]) : 0
      const bNum = bMatch ? parseInt(bMatch[1]) : 0
      return aNum - bNum
    })

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

  for (const s of sessions) {
    // Skip section headers and title slides in agenda
    if (s.type === 'section' || s.type === 'day_title') continue
    if (s.duration === 0) continue  // Skip 0-duration items like title slides

    const name = s.session || ''
    if (!name) continue

    // Use explicit time if provided, otherwise calculate from current position
    let timeStr = s.time || ''
    if (!timeStr && s.duration) {
      const endMinutes = currentMinutes + s.duration
      timeStr = `${formatTime(currentMinutes)}-${formatTime(endMinutes)}`
    }

    const speaker = s.speaker || ''

    if (timeStr) {
      rows.push(`| ${timeStr} | ${name} | ${speaker} |`)
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
    '{{TITLE}}': workshop.title || 'STRENGTHENING HEALTH SYSTEMS AND RMNCAH-N OUTCOMES THROUGH RAPID CYCLE ANALYTICS AND DATA USE',
    '{{SUBTITLE}}': workshop.subtitle || 'Country Workshop: Introduction to FASTR RMNCAH-N Service Use Monitoring',
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
 * Just a simple title slide, facilitator fills in verbally
 */
function buildDayRecapSlide(session: Session, config: WorkshopConfig, dayNumber: number): string {
  const previousDay = dayNumber - 1

  return `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# Day ${previousDay} Recap
`
}

/**
 * Build day end slides
 */
function buildDayEndSlide(session: Session, dayNumber: number): string {
  return `<!-- _class: section-cover -->
![bg](../resources/backgrounds/section_slide.png)

# Key messages and wrap-up

---

<!-- _class: section-cover -->
![bg](../resources/backgrounds/section_slide.png)

# Reflections from Participants
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
