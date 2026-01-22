/**
 * Slide Assembler Module
 *
 * Assembles slides from content library based on workshop configuration.
 * Handles variable substitution, special slides, and markdown generation.
 */

import fs from 'fs'
import path from 'path'
import {
  Session,
  WorkshopConfig,
  ParsedModule,
  ParsedTopic,
  ParsedSlide,
  AssembledSlide,
  AssembledDeck,
  VariableContext,
  buildVariableContext,
  substituteVariables,
} from './types'
import { generateDayRecap, generateDayWrapup, generateDayAgenda, shouldAutoGenerate } from './autoSlideGenerator'
import { calculateDaySchedule, formatTime, formatTimeDisplay } from './timeCalculator'
import * as contentParser from './contentParser'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface AssembleOptions {
  workshopConfig: WorkshopConfig
  workshopId: string
  contentLibrary: ParsedModule[]
  coreContentPath: string
  workshopsPath: string
  templatesPath: string
  selectedDays?: number[] // If not provided, assemble all days
}

// ═══════════════════════════════════════════════════════════════════════════════
// MARP FRONTMATTER
// ═══════════════════════════════════════════════════════════════════════════════

const MARP_FRONTMATTER = `---
marp: true
theme: fastr
paginate: true
---`

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate title slide markdown
 */
function generateTitleSlide(config: WorkshopConfig): string {
  return `<!-- _class: title -->

# ${config.workshop.name}

## ${config.workshop.location}

**${config.workshop.date}**

Facilitators: ${config.workshop.facilitators}`
}

/**
 * Generate agenda slide for a day
 */
function generateAgendaSlide(
  config: WorkshopConfig,
  dayNumber: number
): string {
  const daySchedule = calculateDaySchedule(config, dayNumber)
  const dayTitle = config.schedule.day_titles?.[dayNumber] || ''

  const lines: string[] = [
    `## Day ${dayNumber}${dayTitle ? `: ${dayTitle}` : ''} - Agenda`,
    '',
  ]

  for (const session of daySchedule.sessions) {
    if (session.type === 'section') continue

    const time = session.startTime || ''
    const name = session.session

    if (session.type === 'break') {
      lines.push(`**${time}** - ☕ ${name}`)
    } else {
      lines.push(`**${time}** - ${name}`)
    }
  }

  return lines.join('\n')
}

/**
 * Generate break slide
 */
function generateBreakSlide(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number,
  sessionIndex: number
): string {
  const daySchedule = calculateDaySchedule(config, dayNumber)
  const sessionWithTime = daySchedule.sessions[sessionIndex]
  const returnTime = sessionWithTime?.endTime || ''

  const isLunch = session.session.toLowerCase().includes('lunch')
  const icon = isLunch ? '🍽️' : '☕'
  const duration = session.duration || (isLunch ? 60 : 15)

  const lines = [
    '<!-- _class: break -->',
    '',
    `# ${icon} ${session.session}`,
    '',
    `**${duration} minutes**`,
    '',
  ]

  if (returnTime) {
    lines.push(`Back at **${formatTimeDisplay(returnTime)}**`)
  }

  return lines.join('\n')
}

/**
 * Generate section divider slide
 */
function generateSectionSlide(session: Session): string {
  return `<!-- _class: section -->

# ${session.session}`
}

/**
 * Generate day recap slide (auto-generated or custom)
 */
function generateDayRecapSlide(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number,
  contentLibrary: ParsedModule[]
): string {
  // Check if we should auto-generate
  if (shouldAutoGenerate(session)) {
    const generated = generateDayRecap({
      workshopConfig: config,
      dayNumber,
      contentLibrary,
    })
    return generated.markdown
  }

  // Use custom content
  const dayTitle = config.schedule.day_titles?.[dayNumber] || ''
  const title = dayTitle ? `Day ${dayNumber}: ${dayTitle}` : `Day ${dayNumber} - Recap`

  const lines = [`## ${title}`, '']

  if (session.recap_yesterday) {
    lines.push('### Yesterday we covered:')
    lines.push('')
    // Parse bullets (each line is a bullet)
    for (const line of session.recap_yesterday.split('\n')) {
      const trimmed = line.trim()
      if (trimmed) {
        // Add bullet if not already present
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          lines.push(trimmed)
        } else {
          lines.push(`- ${trimmed}`)
        }
      }
    }
    lines.push('')
  }

  if (session.recap_today) {
    lines.push("### Today we'll cover:")
    lines.push('')
    for (const line of session.recap_today.split('\n')) {
      const trimmed = line.trim()
      if (trimmed) {
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
          lines.push(trimmed)
        } else {
          lines.push(`- ${trimmed}`)
        }
      }
    }
  }

  return lines.join('\n')
}

/**
 * Generate day end/wrap-up slide
 */
function generateDayEndSlide(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number,
  contentLibrary: ParsedModule[]
): string {
  // Check if we should auto-generate
  if (shouldAutoGenerate(session)) {
    const generated = generateDayWrapup({
      workshopConfig: config,
      dayNumber,
      contentLibrary,
    })
    return generated.markdown
  }

  // Use custom wrapup message
  if (session.wrapup_message) {
    return session.wrapup_message
  }

  // Generate default "See you tomorrow" slide
  const numDays = config.schedule.days || 1
  const isLastDay = dayNumber >= numDays

  if (isLastDay) {
    return `## Workshop Complete!

### Thank you for participating!

Safe travels!`
  }

  const tomorrowStartTime = config.schedule.day_start_times?.[dayNumber + 1] || '09:00'

  return `## End of Day ${dayNumber}

### See you tomorrow!

**${formatTimeDisplay(tomorrowStartTime)}**`
}

/**
 * Generate closing slide
 */
function generateClosingSlide(config: WorkshopConfig): string {
  return `<!-- _class: closing -->

# Thank You!

## ${config.workshop.name}

${config.workshop.location} | ${config.workshop.date}

**Contact:** ${config.workshop.contact_email || config.workshop.facilitators}`
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT LOADING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Load topic content from file
 */
function loadTopicContent(
  topicId: string,
  contentLibrary: ParsedModule[],
  coreContentPath: string,
  workshopId: string,
  workshopsPath: string
): string | null {
  // Find the topic in content library
  let topic: ParsedTopic | null = null
  for (const mod of contentLibrary) {
    const found = mod.topics.find(t => t.id === topicId)
    if (found) {
      topic = found
      break
    }
  }

  if (!topic) return null

  // Check for custom version first
  const customPath = path.join(workshopsPath, workshopId, 'custom_slides', topic.file)
  if (fs.existsSync(customPath)) {
    return fs.readFileSync(customPath, 'utf-8')
  }

  // Read original
  if (fs.existsSync(topic.path)) {
    return fs.readFileSync(topic.path, 'utf-8')
  }

  return null
}

/**
 * Load module content (all topics)
 */
function loadModuleContent(
  moduleId: string,
  contentLibrary: ParsedModule[],
  coreContentPath: string,
  workshopId: string,
  workshopsPath: string
): string[] {
  const modNum = parseInt(moduleId.replace('m', ''))
  const module = contentLibrary.find(m => m.number === modNum)

  if (!module) return []

  const contents: string[] = []
  for (const topic of module.topics) {
    const content = loadTopicContent(
      topic.id,
      contentLibrary,
      coreContentPath,
      workshopId,
      workshopsPath
    )
    if (content) {
      contents.push(content)
    }
  }

  return contents
}

/**
 * Load custom slide content
 */
function loadCustomSlideContent(
  slideFile: string,
  workshopId: string,
  workshopsPath: string,
  templatesPath: string
): string | null {
  // Try workshop custom_slides first
  const customPath = path.join(workshopsPath, workshopId, 'custom_slides', slideFile)
  if (fs.existsSync(customPath)) {
    return fs.readFileSync(customPath, 'utf-8')
  }

  // Try templates
  const templatePath = path.join(templatesPath, slideFile)
  if (fs.existsSync(templatePath)) {
    return fs.readFileSync(templatePath, 'utf-8')
  }

  // Try templates/custom_slides
  const templateCustomPath = path.join(templatesPath, 'custom_slides', slideFile)
  if (fs.existsSync(templateCustomPath)) {
    return fs.readFileSync(templateCustomPath, 'utf-8')
  }

  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ASSEMBLER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Assemble slides for a single session
 */
function assembleSessionSlides(
  session: Session,
  sessionIndex: number,
  dayNumber: number,
  options: AssembleOptions,
  variableContext: VariableContext
): string[] {
  const { workshopConfig, contentLibrary, coreContentPath, workshopId, workshopsPath, templatesPath } = options
  const slides: string[] = []

  // Handle special session types
  if (session.type === 'break') {
    slides.push(generateBreakSlide(session, workshopConfig, dayNumber, sessionIndex))
    return slides
  }

  if (session.type === 'section') {
    slides.push(generateSectionSlide(session))
    return slides
  }

  if (session.type === 'day_recap') {
    slides.push(generateDayRecapSlide(session, workshopConfig, dayNumber, contentLibrary))
    return slides
  }

  if (session.type === 'day_end') {
    slides.push(generateDayEndSlide(session, workshopConfig, dayNumber, contentLibrary))
    return slides
  }

  // Handle module content
  if (session.module) {
    const moduleContents = loadModuleContent(
      session.module,
      contentLibrary,
      coreContentPath,
      workshopId,
      workshopsPath
    )
    for (const content of moduleContents) {
      // Extract slides (split by ---)
      const slideContents = extractSlidesFromMarkdown(content)
      for (const slideContent of slideContents) {
        slides.push(substituteVariables(slideContent, variableContext))
      }
    }
    return slides
  }

  // Handle topic content
  if (session.topics && session.topics.length > 0) {
    for (const topicId of session.topics) {
      const content = loadTopicContent(
        topicId,
        contentLibrary,
        coreContentPath,
        workshopId,
        workshopsPath
      )
      if (content) {
        const slideContents = extractSlidesFromMarkdown(content)
        for (const slideContent of slideContents) {
          slides.push(substituteVariables(slideContent, variableContext))
        }
      }
    }
    return slides
  }

  // Handle custom slides
  if (session.slides && session.slides.length > 0) {
    for (const slideFile of session.slides) {
      // Handle special built-in slides
      if (slideFile === 'title') {
        slides.push(generateTitleSlide(workshopConfig))
        continue
      }
      if (slideFile === 'agenda') {
        slides.push(generateAgendaSlide(workshopConfig, dayNumber))
        continue
      }
      if (slideFile === 'closing' || slideFile === 'closing.md') {
        slides.push(generateClosingSlide(workshopConfig))
        continue
      }

      // Load custom slide content
      const content = loadCustomSlideContent(slideFile, workshopId, workshopsPath, templatesPath)
      if (content) {
        const slideContents = extractSlidesFromMarkdown(content)
        for (const slideContent of slideContents) {
          slides.push(substituteVariables(slideContent, variableContext))
        }
      }
    }
    return slides
  }

  // No content - create placeholder
  slides.push(`## ${session.session}

*No content attached to this session*`)

  return slides
}

/**
 * Extract individual slides from markdown content
 */
function extractSlidesFromMarkdown(content: string): string[] {
  // Remove frontmatter
  let body = content
  const frontmatterMatch = content.match(/^---\n[\s\S]*?\n---\n?/)
  if (frontmatterMatch) {
    body = content.slice(frontmatterMatch[0].length)
  }

  // Split by slide separator
  const slides = body.split(/^---$/m)
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('marp:'))

  return slides
}

/**
 * Assemble full deck markdown
 */
export function assembleMarkdown(options: AssembleOptions): string {
  const { workshopConfig, selectedDays } = options
  const numDays = workshopConfig.schedule.days || 1
  const daysToAssemble = selectedDays || Array.from({ length: numDays }, (_, i) => i + 1)

  const allSlides: string[] = []

  for (const dayNum of daysToAssemble) {
    const dayKey = `day${dayNum}`
    const sessions: Session[] = workshopConfig.schedule[dayKey] || []
    const variableContext = buildVariableContext(workshopConfig, dayNum)

    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i]
      const sessionSlides = assembleSessionSlides(session, i, dayNum, options, variableContext)
      allSlides.push(...sessionSlides)
    }
  }

  // Combine with frontmatter
  return MARP_FRONTMATTER + '\n\n' + allSlides.join('\n\n---\n\n')
}

/**
 * Assemble slides as JSON structure (for preview)
 */
export function assembleJSON(options: AssembleOptions): AssembledDeck {
  const { workshopConfig, workshopId, selectedDays, contentLibrary } = options
  const numDays = workshopConfig.schedule.days || 1
  const daysToAssemble = selectedDays || Array.from({ length: numDays }, (_, i) => i + 1)

  const allSlides: AssembledSlide[] = []
  const days: AssembledDeck['days'] = []

  let globalSlideIndex = 0

  for (const dayNum of daysToAssemble) {
    const dayKey = `day${dayNum}`
    const sessions: Session[] = workshopConfig.schedule[dayKey] || []
    const variableContext = buildVariableContext(workshopConfig, dayNum)
    const daySlides: AssembledSlide[] = []

    for (let sessionIdx = 0; sessionIdx < sessions.length; sessionIdx++) {
      const session = sessions[sessionIdx]
      const sessionId = session._id || `day${dayNum}-session${sessionIdx}`
      const sessionSlides = assembleSessionSlides(session, sessionIdx, dayNum, options, variableContext)

      for (let slideIdx = 0; slideIdx < sessionSlides.length; slideIdx++) {
        const markdown = sessionSlides[slideIdx]
        const slide: AssembledSlide = {
          id: `slide-${globalSlideIndex}`,
          sessionId,
          slideIndex: globalSlideIndex,
          title: extractSlideTitle(markdown),
          markdown,
          elements: [], // Could parse elements if needed
          meta: {
            dayNumber: dayNum,
            sessionName: session.session,
            topicId: session.topics?.[0],
            moduleId: session.module,
            isBreak: session.type === 'break',
            isSection: session.type === 'section',
            isSpecial: session.type === 'day_recap' || session.type === 'day_end',
          },
        }

        allSlides.push(slide)
        daySlides.push(slide)
        globalSlideIndex++
      }
    }

    days.push({
      dayNumber: dayNum,
      title: workshopConfig.schedule.day_titles?.[dayNum],
      slides: daySlides,
    })
  }

  return {
    workshopId,
    workshopConfig,
    slides: allSlides,
    totalSlides: allSlides.length,
    days,
  }
}

/**
 * Extract title from slide markdown
 */
function extractSlideTitle(markdown: string): string {
  // Look for ## heading first (Marp slide title)
  const h2Match = markdown.match(/^##\s+(.+)$/m)
  if (h2Match) return h2Match[1]

  // Look for # heading
  const h1Match = markdown.match(/^#\s+(.+)$/m)
  if (h1Match) return h1Match[1]

  // Look for any heading
  const anyHeading = markdown.match(/^#{1,6}\s+(.+)$/m)
  if (anyHeading) return anyHeading[1]

  return 'Untitled Slide'
}

/**
 * Get preview markdown for a single session
 */
export function getSessionPreviewMarkdown(
  session: Session,
  sessionIndex: number,
  dayNumber: number,
  workshopConfig: WorkshopConfig,
  contentLibrary: ParsedModule[],
  coreContentPath: string,
  workshopId: string,
  workshopsPath: string,
  templatesPath: string
): string {
  const options: AssembleOptions = {
    workshopConfig,
    workshopId,
    contentLibrary,
    coreContentPath,
    workshopsPath,
    templatesPath,
  }

  const variableContext = buildVariableContext(workshopConfig, dayNumber)
  const slides = assembleSessionSlides(session, sessionIndex, dayNumber, options, variableContext)

  return slides.join('\n\n---\n\n')
}
