/**
 * Time Calculator Module
 *
 * Calculates session times automatically based on day start time and durations.
 */

import { Session, WorkshopConfig } from './types'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SessionTime {
  startTime: string  // HH:MM format
  endTime: string    // HH:MM format
  startMinutes: number  // Minutes from midnight
  endMinutes: number    // Minutes from midnight
}

export interface DaySchedule {
  dayNumber: number
  startTime: string
  endTime: string
  sessions: Array<Session & SessionTime>
  totalDuration: number  // Total minutes
  breakDuration: number  // Total break minutes
  contentDuration: number  // Non-break minutes
}

export interface TimeCalculatorInput {
  dayStartTime: string  // HH:MM format
  sessions: Session[]
}

export interface TimeCalculatorOutput {
  sessions: SessionTime[]
  totalDuration: number
  endTime: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT DURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const DEFAULT_DURATIONS: Record<string, number> = {
  // Session types
  'break_tea': 15,
  'break_lunch': 60,
  'break': 15,
  'section': 0,
  'day_recap': 10,
  'day_end': 5,

  // Module defaults (by module number)
  'm0': 60,   // Introduction
  'm1': 90,   // Questions & Indicators
  'm2': 120,  // Data Extraction
  'm3': 180,  // FASTR Platform
  'm4': 120,  // DQA
  'm5': 90,   // DQ Adjustment
  'm6': 240,  // Data Analysis
  'm7': 120,  // Results Communication
  'm8': 180,  // Survey & HFA

  // Defaults
  'module': 60,
  'topic': 30,
  'custom': 15,
  'default': 30,
}

/**
 * Get default duration for a session based on its type/content
 */
export function getDefaultDuration(session: Session): number {
  // Check session type
  if (session.type === 'break') {
    const name = session.session.toLowerCase()
    if (name.includes('lunch')) return DEFAULT_DURATIONS['break_lunch']
    return DEFAULT_DURATIONS['break_tea']
  }

  if (session.type === 'section') return DEFAULT_DURATIONS['section']
  if (session.type === 'day_recap') return DEFAULT_DURATIONS['day_recap']
  if (session.type === 'day_end') return DEFAULT_DURATIONS['day_end']

  // Check module
  if (session.module) {
    const modKey = session.module.toLowerCase()
    if (modKey in DEFAULT_DURATIONS) {
      return DEFAULT_DURATIONS[modKey]
    }
    return DEFAULT_DURATIONS['module']
  }

  // Check topics
  if (session.topics && session.topics.length > 0) {
    return DEFAULT_DURATIONS['topic'] * session.topics.length
  }

  // Check slides
  if (session.slides && session.slides.length > 0) {
    return DEFAULT_DURATIONS['custom']
  }

  return DEFAULT_DURATIONS['default']
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIME PARSING & FORMATTING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parse time string (HH:MM) to minutes from midnight
 */
export function parseTime(timeStr: string): number | null {
  if (!timeStr) return null

  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return null

  const hours = parseInt(match[1], 10)
  const mins = parseInt(match[2], 10)

  if (hours > 23 || mins > 59) return null

  return hours * 60 + mins
}

/**
 * Format minutes from midnight to HH:MM string
 */
export function formatTime(minutes: number): string {
  // Handle overflow past midnight
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(normalizedMinutes / 60)
  const m = normalizedMinutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/**
 * Format duration in minutes to human readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (mins === 0) {
    return `${hours}h`
  }

  return `${hours}h ${mins}m`
}

/**
 * Format time for display (e.g., "9:00 AM")
 */
export function formatTimeDisplay(timeStr: string): string {
  const minutes = parseTime(timeStr)
  if (minutes === null) return timeStr

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours

  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIME CALCULATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculate session times for a list of sessions
 */
export function calculateSessionTimes(input: TimeCalculatorInput): TimeCalculatorOutput {
  const { dayStartTime, sessions } = input

  const times: SessionTime[] = []
  let currentMinutes = parseTime(dayStartTime)

  // If no valid start time, return empty times
  if (currentMinutes === null) {
    return {
      sessions: sessions.map(() => ({
        startTime: '',
        endTime: '',
        startMinutes: 0,
        endMinutes: 0,
      })),
      totalDuration: 0,
      endTime: '',
    }
  }

  let totalDuration = 0

  for (const session of sessions) {
    // Section dividers don't have duration
    if (session.type === 'section') {
      times.push({
        startTime: '',
        endTime: '',
        startMinutes: currentMinutes,
        endMinutes: currentMinutes,
      })
      continue
    }

    // Get duration (use session duration or default)
    const duration = session.duration ?? getDefaultDuration(session)
    const startTime = formatTime(currentMinutes)
    const endMinutes = currentMinutes + duration
    const endTime = formatTime(endMinutes)

    times.push({
      startTime,
      endTime,
      startMinutes: currentMinutes,
      endMinutes,
    })

    currentMinutes = endMinutes
    totalDuration += duration
  }

  return {
    sessions: times,
    totalDuration,
    endTime: formatTime(currentMinutes),
  }
}

/**
 * Calculate full schedule for a day
 */
export function calculateDaySchedule(
  workshopConfig: WorkshopConfig,
  dayNumber: number
): DaySchedule {
  const dayKey = `day${dayNumber}`
  const sessions: Session[] = workshopConfig.schedule[dayKey] || []
  const dayStartTime = workshopConfig.schedule.day_start_times?.[dayNumber] || '09:00'

  const { sessions: sessionTimes, totalDuration, endTime } = calculateSessionTimes({
    dayStartTime,
    sessions,
  })

  // Calculate break vs content duration
  let breakDuration = 0
  let contentDuration = 0

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i]
    const duration = session.duration ?? getDefaultDuration(session)

    if (session.type === 'break') {
      breakDuration += duration
    } else if (session.type !== 'section') {
      contentDuration += duration
    }
  }

  // Merge sessions with their calculated times
  const sessionsWithTimes = sessions.map((session, i) => ({
    ...session,
    ...sessionTimes[i],
  }))

  return {
    dayNumber,
    startTime: dayStartTime,
    endTime,
    sessions: sessionsWithTimes,
    totalDuration,
    breakDuration,
    contentDuration,
  }
}

/**
 * Calculate schedule for all days
 */
export function calculateFullSchedule(workshopConfig: WorkshopConfig): DaySchedule[] {
  const numDays = workshopConfig.schedule.days || 1
  const schedules: DaySchedule[] = []

  for (let day = 1; day <= numDays; day++) {
    schedules.push(calculateDaySchedule(workshopConfig, day))
  }

  return schedules
}

/**
 * Get the return time for a break (when the next session starts)
 */
export function getBreakReturnTime(
  workshopConfig: WorkshopConfig,
  dayNumber: number,
  sessionIndex: number
): string {
  const daySchedule = calculateDaySchedule(workshopConfig, dayNumber)

  if (sessionIndex >= 0 && sessionIndex < daySchedule.sessions.length) {
    const session = daySchedule.sessions[sessionIndex]

    if (session.type === 'break') {
      return session.endTime || ''
    }
  }

  return ''
}

/**
 * Suggest optimal break placement based on content duration
 *
 * Returns suggested indices for tea breaks (every ~90 min of content)
 */
export function suggestBreakPlacements(
  sessions: Session[]
): Array<{ afterIndex: number; type: 'tea' | 'lunch'; reason: string }> {
  const suggestions: Array<{ afterIndex: number; type: 'tea' | 'lunch'; reason: string }> = []

  let contentMinutesSinceBreak = 0
  let totalContentMinutes = 0

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i]
    const duration = session.duration ?? getDefaultDuration(session)

    if (session.type === 'break') {
      contentMinutesSinceBreak = 0
      continue
    }

    if (session.type === 'section') continue

    contentMinutesSinceBreak += duration
    totalContentMinutes += duration

    // Suggest tea break after ~90 minutes of content
    if (contentMinutesSinceBreak >= 90) {
      suggestions.push({
        afterIndex: i,
        type: 'tea',
        reason: `${contentMinutesSinceBreak} minutes since last break`,
      })
      contentMinutesSinceBreak = 0
    }

    // Suggest lunch around the 3-4 hour mark
    if (totalContentMinutes >= 180 && totalContentMinutes <= 240) {
      const hasLunch = suggestions.some(s => s.type === 'lunch')
      if (!hasLunch) {
        suggestions.push({
          afterIndex: i,
          type: 'lunch',
          reason: 'Mid-day break',
        })
      }
    }
  }

  return suggestions
}
