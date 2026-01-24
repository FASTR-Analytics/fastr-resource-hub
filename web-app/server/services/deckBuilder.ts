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

  // Build each day
  for (let day = 1; day <= numDays; day++) {
    const dayKey = `day${day}`
    const sessions: Session[] = config.schedule[dayKey] || []

    for (const session of sessions) {
      const slideContent = await buildSessionSlides(session, config, day)
      if (slideContent) {
        slides.push(slideContent)
      }
    }
  }

  return slides.join('\n\n---\n\n')
}

/**
 * Build slides for a single session
 */
async function buildSessionSlides(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number
): Promise<string | null> {
  // Module content
  if (session.module) {
    return buildModuleSlides(session.module)
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

  // Section/Agenda
  if (session.type === 'section') {
    return buildSectionSlide(session)
  }

  // Generic session (no specific slides)
  return buildGenericSessionSlide(session)
}

/**
 * Load all slides for a module
 */
function buildModuleSlides(moduleId: string): string | null {
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

  const contents: string[] = []
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
  // Try templates folder first
  let filePath = path.join(TEMPLATES_PATH, slideFile)
  if (!fs.existsSync(filePath)) {
    // Try custom_slides subfolder
    filePath = path.join(TEMPLATES_PATH, slideFile)
  }

  if (!fs.existsSync(filePath)) {
    console.warn(`Slide file not found: ${slideFile}`)
    return null
  }

  let content = fs.readFileSync(filePath, 'utf-8')

  // Remove frontmatter
  content = content.replace(/^---[\s\S]*?---\s*/m, '')

  // Substitute variables
  content = substituteVariables(content, config, dayNumber, session)

  return content.trim()
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
  const vars: Record<string, string> = {
    '{{WORKSHOP_NAME}}': config.workshop.name || 'FASTR Workshop',
    '{{COUNTRY}}': config.workshop.country || '',
    '{{LOCATION}}': config.workshop.location || '',
    '{{DATE}}': config.workshop.date || '',
    '{{VENUE}}': config.workshop.venue || '',
    '{{FACILITATORS}}': config.workshop.facilitators || '',
    '{{CONTACT_EMAIL}}': config.workshop.contact_email || '',
    '{{WEBSITE}}': config.workshop.website || '',
    '{{DAY_NUMBER}}': String(dayNumber),
    '{{DAY_TITLE}}': config.schedule.day_titles?.[dayNumber] || `Day ${dayNumber}`,
    '{{SESSION_NAME}}': session.session || '',
    '{{RESUME_TIME}}': calculateResumeTime(session),
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

  for (const [key, value] of Object.entries(vars)) {
    content = content.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value)
  }

  return content
}

/**
 * Calculate resume time after a break
 */
function calculateResumeTime(session: Session): string {
  if (!session.time || !session.duration) return ''

  const [hours, minutes] = session.time.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + session.duration
  const resumeHours = Math.floor(totalMinutes / 60)
  const resumeMinutes = totalMinutes % 60

  return `${resumeHours.toString().padStart(2, '0')}:${resumeMinutes.toString().padStart(2, '0')}`
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
 * Build a day recap slide
 */
function buildDayRecapSlide(session: Session, config: WorkshopConfig, dayNumber: number): string {
  const yesterday = session.recap_yesterday || 'Previous day content'
  const today = session.recap_today || 'Today\'s planned content'

  return `<!-- _class: section-cover -->
![bg](../resources/backgrounds/section_slide.png)

# Day ${dayNumber} - Recap & Preview

---

## Yesterday We Covered

${yesterday.split('\n').map(line => `- ${line.trim()}`).join('\n')}

---

## Today We Will Cover

${today.split('\n').map(line => `- ${line.trim()}`).join('\n')}
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
