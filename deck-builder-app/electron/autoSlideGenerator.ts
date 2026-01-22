/**
 * Auto Slide Generator
 *
 * Automatically generates recap, wrap-up, and other special slides
 * based on the workshop schedule.
 */

import { Session, WorkshopConfig } from './types'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface GeneratedSlideContent {
  markdown: string
  title: string
  bullets: string[]
}

export interface AutoSlideOptions {
  workshopConfig: WorkshopConfig
  dayNumber: number
  contentLibrary?: ParsedModule[]
}

interface ParsedModule {
  number: number
  id: string
  name: string
  topics: Array<{ id: string; title: string }>
}

// Module name lookup
const MODULE_NAMES: Record<number, string> = {
  0: 'Introduction to FASTR',
  1: 'Identify Questions & Indicators',
  2: 'Data Extraction',
  3: 'FASTR Analytics Platform',
  4: 'Data Quality Assessment',
  5: 'Data Quality Adjustment',
  6: 'Data Analysis',
  7: 'Results Communication',
  8: 'Survey & HFA',
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract session name for display in recap
 */
function getSessionDisplayName(session: Session, contentLibrary?: ParsedModule[]): string {
  // If it has a module, get module name
  if (session.module) {
    const modNum = parseInt(session.module.replace('m', ''))
    if (contentLibrary) {
      const mod = contentLibrary.find(m => m.number === modNum)
      if (mod) return mod.name
    }
    return MODULE_NAMES[modNum] || session.session
  }

  // If it has topics, list them
  if (session.topics && session.topics.length > 0) {
    // Just return the session name which should be descriptive
    return session.session
  }

  // Return session name for custom sessions
  return session.session
}

/**
 * Filter sessions to get only content sessions (not breaks/sections)
 */
function getContentSessions(sessions: Session[]): Session[] {
  return sessions.filter(s =>
    s.type !== 'break' &&
    s.type !== 'section' &&
    s.type !== 'day_recap' &&
    s.type !== 'day_end'
  )
}

/**
 * Get sessions for a specific day from config
 */
function getDaySessions(config: WorkshopConfig, dayNum: number): Session[] {
  const dayKey = `day${dayNum}`
  return config.schedule[dayKey] || []
}

/**
 * Format time from HH:MM to human readable
 */
function formatTimeForDisplay(time: string): string {
  if (!time) return ''
  const [hours, mins] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate "Day Recap" slide content for the start of a day
 *
 * Shows what was covered yesterday and what will be covered today
 */
export function generateDayRecap(options: AutoSlideOptions): GeneratedSlideContent {
  const { workshopConfig, dayNumber, contentLibrary } = options

  // Get previous day's sessions
  const prevDaySessions = dayNumber > 1
    ? getContentSessions(getDaySessions(workshopConfig, dayNumber - 1))
    : []

  // Get today's sessions
  const todaySessions = getContentSessions(getDaySessions(workshopConfig, dayNumber))

  // Build "Yesterday" section
  const yesterdayBullets: string[] = []
  if (dayNumber > 1 && prevDaySessions.length > 0) {
    for (const session of prevDaySessions) {
      const name = getSessionDisplayName(session, contentLibrary)
      if (name && !yesterdayBullets.includes(name)) {
        yesterdayBullets.push(name)
      }
    }
  }

  // Build "Today" section
  const todayBullets: string[] = []
  for (const session of todaySessions) {
    const name = getSessionDisplayName(session, contentLibrary)
    if (name && !todayBullets.includes(name)) {
      todayBullets.push(name)
    }
  }

  // Get day title if available
  const dayTitle = workshopConfig.schedule.day_titles?.[dayNumber] || ''
  const title = dayTitle ? `Day ${dayNumber}: ${dayTitle}` : `Day ${dayNumber} - Recap`

  // Generate markdown
  const markdownLines: string[] = [
    `## ${title}`,
    '',
  ]

  if (dayNumber > 1 && yesterdayBullets.length > 0) {
    markdownLines.push('### Yesterday we covered:')
    markdownLines.push('')
    for (const bullet of yesterdayBullets) {
      markdownLines.push(`- ${bullet}`)
    }
    markdownLines.push('')
  }

  if (todayBullets.length > 0) {
    markdownLines.push("### Today we'll cover:")
    markdownLines.push('')
    for (const bullet of todayBullets) {
      markdownLines.push(`- ${bullet}`)
    }
  }

  return {
    markdown: markdownLines.join('\n'),
    title,
    bullets: [...yesterdayBullets, ...todayBullets],
  }
}

/**
 * Generate "Day Wrap-up" slide content for the end of a day
 *
 * Shows what was covered today and previews tomorrow (if applicable)
 */
export function generateDayWrapup(options: AutoSlideOptions): GeneratedSlideContent {
  const { workshopConfig, dayNumber, contentLibrary } = options
  const numDays = workshopConfig.schedule.days || 1
  const isLastDay = dayNumber >= numDays

  // Get today's sessions
  const todaySessions = getContentSessions(getDaySessions(workshopConfig, dayNumber))

  // Get tomorrow's sessions if not last day
  const tomorrowSessions = !isLastDay
    ? getContentSessions(getDaySessions(workshopConfig, dayNumber + 1))
    : []

  // Build "Today" section
  const todayBullets: string[] = []
  for (const session of todaySessions) {
    const name = getSessionDisplayName(session, contentLibrary)
    if (name && !todayBullets.includes(name)) {
      todayBullets.push(name)
    }
  }

  // Build "Tomorrow" section
  const tomorrowBullets: string[] = []
  for (const session of tomorrowSessions) {
    const name = getSessionDisplayName(session, contentLibrary)
    if (name && !tomorrowBullets.includes(name)) {
      tomorrowBullets.push(name)
    }
  }

  // Get tomorrow's start time
  const tomorrowStartTime = !isLastDay
    ? workshopConfig.schedule.day_start_times?.[dayNumber + 1] || '09:00'
    : ''

  // Generate title
  const title = isLastDay ? 'Workshop Complete!' : `End of Day ${dayNumber}`

  // Generate markdown
  const markdownLines: string[] = [
    `## ${title}`,
    '',
  ]

  if (todayBullets.length > 0) {
    markdownLines.push('### Today we covered:')
    markdownLines.push('')
    for (const bullet of todayBullets) {
      markdownLines.push(`- ${bullet}`)
    }
    markdownLines.push('')
  }

  if (!isLastDay) {
    if (tomorrowBullets.length > 0) {
      markdownLines.push("### Tomorrow we'll cover:")
      markdownLines.push('')
      for (const bullet of tomorrowBullets) {
        markdownLines.push(`- ${bullet}`)
      }
      markdownLines.push('')
    }

    if (tomorrowStartTime) {
      markdownLines.push(`**See you tomorrow at ${formatTimeForDisplay(tomorrowStartTime)}!**`)
    } else {
      markdownLines.push('**See you tomorrow!**')
    }
  } else {
    markdownLines.push('### Thank you for participating!')
    markdownLines.push('')
    markdownLines.push('Safe travels!')
  }

  return {
    markdown: markdownLines.join('\n'),
    title,
    bullets: [...todayBullets, ...tomorrowBullets],
  }
}

/**
 * Generate workshop closing slide
 */
export function generateWorkshopClose(options: AutoSlideOptions): GeneratedSlideContent {
  const { workshopConfig, contentLibrary } = options
  const numDays = workshopConfig.schedule.days || 1

  // Collect all modules covered across all days
  const allModules: Set<string> = new Set()

  for (let day = 1; day <= numDays; day++) {
    const sessions = getContentSessions(getDaySessions(workshopConfig, day))
    for (const session of sessions) {
      const name = getSessionDisplayName(session, contentLibrary)
      if (name) {
        allModules.add(name)
      }
    }
  }

  const moduleBullets = Array.from(allModules)

  const title = 'Workshop Complete!'

  const markdownLines: string[] = [
    `## ${title}`,
    '',
    `### ${workshopConfig.workshop.name}`,
    '',
    `**${workshopConfig.workshop.location}** | ${workshopConfig.workshop.date}`,
    '',
  ]

  if (moduleBullets.length > 0) {
    markdownLines.push('### Topics covered:')
    markdownLines.push('')
    for (const bullet of moduleBullets) {
      markdownLines.push(`- ${bullet}`)
    }
    markdownLines.push('')
  }

  markdownLines.push('### Thank you for participating!')
  markdownLines.push('')
  markdownLines.push('Safe travels and good luck with your FASTR implementation!')

  return {
    markdown: markdownLines.join('\n'),
    title,
    bullets: moduleBullets,
  }
}

/**
 * Generate agenda slide for a specific day
 */
export function generateDayAgenda(options: AutoSlideOptions): GeneratedSlideContent {
  const { workshopConfig, dayNumber } = options

  const sessions = getDaySessions(workshopConfig, dayNumber)
  const dayStartTime = workshopConfig.schedule.day_start_times?.[dayNumber] || '09:00'
  const dayTitle = workshopConfig.schedule.day_titles?.[dayNumber] || ''

  // Calculate times for each session
  let currentMinutes = parseTimeToMinutes(dayStartTime)
  const agendaItems: Array<{ time: string; name: string; duration: number }> = []

  for (const session of sessions) {
    if (session.type === 'section') continue

    const duration = session.duration || 0
    const startTime = formatMinutesToTime(currentMinutes)

    agendaItems.push({
      time: startTime,
      name: session.session,
      duration,
    })

    currentMinutes += duration
  }

  // Generate title
  const title = dayTitle
    ? `Day ${dayNumber}: ${dayTitle}`
    : `Day ${dayNumber} Agenda`

  // Generate markdown
  const markdownLines: string[] = [
    `## ${title}`,
    '',
    '| Time | Session |',
    '|------|---------|',
  ]

  for (const item of agendaItems) {
    markdownLines.push(`| ${item.time} | ${item.name} |`)
  }

  return {
    markdown: markdownLines.join('\n'),
    title,
    bullets: agendaItems.map(i => `${i.time} - ${i.name}`),
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function parseTimeToMinutes(time: string): number {
  const [hours, mins] = time.split(':').map(Number)
  return hours * 60 + mins
}

function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/**
 * Check if auto-generation should be used for a session
 * Returns true if the session has empty content fields
 */
export function shouldAutoGenerate(session: Session): boolean {
  if (session.type === 'day_recap') {
    return !session.recap_yesterday && !session.recap_today
  }
  if (session.type === 'day_end') {
    return !session.wrapup_message
  }
  return false
}

/**
 * Get auto-generated content for a session if applicable
 */
export function getAutoGeneratedContent(
  session: Session,
  workshopConfig: WorkshopConfig,
  dayNumber: number,
  contentLibrary?: ParsedModule[]
): { recap_yesterday?: string; recap_today?: string; wrapup_message?: string } | null {
  const options: AutoSlideOptions = { workshopConfig, dayNumber, contentLibrary }

  if (session.type === 'day_recap' && shouldAutoGenerate(session)) {
    const generated = generateDayRecap(options)

    // Extract yesterday and today sections from the generated content
    const prevDaySessions = dayNumber > 1
      ? getContentSessions(getDaySessions(workshopConfig, dayNumber - 1))
      : []
    const todaySessions = getContentSessions(getDaySessions(workshopConfig, dayNumber))

    const yesterdayBullets = prevDaySessions
      .map(s => getSessionDisplayName(s, contentLibrary))
      .filter((name, idx, arr) => name && arr.indexOf(name) === idx)
      .map(name => `- ${name}`)
      .join('\n')

    const todayBullets = todaySessions
      .map(s => getSessionDisplayName(s, contentLibrary))
      .filter((name, idx, arr) => name && arr.indexOf(name) === idx)
      .map(name => `- ${name}`)
      .join('\n')

    return {
      recap_yesterday: yesterdayBullets,
      recap_today: todayBullets,
    }
  }

  if (session.type === 'day_end' && shouldAutoGenerate(session)) {
    const generated = generateDayWrapup(options)
    return {
      wrapup_message: generated.markdown,
    }
  }

  return null
}
