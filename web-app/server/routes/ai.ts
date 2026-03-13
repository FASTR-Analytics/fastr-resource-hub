import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import {
  loadModulesRegistry,
} from '../services/moduleRegistry.js'

const router = Router()

// Initialize Anthropic client
const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set')
  }
  return new Anthropic({ apiKey })
}

// Module details loaded from modules.yaml via registry
// Helper to build a MODULE_DETAILS dict on demand from registry (includes all modules with ai_context)
function getModuleDetailsDict(): Record<string, { name: string; description: string; topics: string[]; duration: string }> {
  const modules = loadModulesRegistry()
  const dict: Record<string, { name: string; description: string; topics: string[]; duration: string }> = {}
  for (const mod of modules) {
    if (!mod.ai_context) continue  // Skip modules without AI context
    const ai = mod.ai_context
    dict[mod.number] = {
      name: mod.name.en,
      description: ai?.description || '',
      topics: ai?.topics || [],
      duration: ai?.duration || '',
    }
  }
  return dict
}

// Helper: Parse a duration string like "90-120 min" into { lower, upper } in minutes
function parseDurationRange(duration: string): { lower: number; upper: number } {
  const match = duration.match(/(\d+)\s*[-–]\s*(\d+)/)
  if (match) return { lower: parseInt(match[1]), upper: parseInt(match[2]) }
  const single = duration.match(/(\d+)/)
  if (single) {
    const val = parseInt(single[1])
    return { lower: val, upper: val }
  }
  return { lower: 60, upper: 90 } // fallback
}

// Compute time budget: available time vs requested content
function computeTimeBudget(params: {
  days: number
  dayStartTime?: string
  dayEndTime?: string
  lunchDuration?: number
  requestedModules?: string[]
  moduleVersion?: 'full' | 'condensed'
}): { totalAvailableMinutes: number; requestedContentMinutes: number; overflowMinutes: number; perDayAvailable: number; budgetSummary: string } {
  const {
    days,
    dayStartTime = '09:00',
    dayEndTime = '17:00',
    lunchDuration = 60,
    requestedModules = [],
    moduleVersion = 'full',
  } = params

  const dayLengthMinutes = timeToMinutes(dayEndTime) - timeToMinutes(dayStartTime)
  const teaBreakOverhead = 30 // 2 x 15min tea breaks per day

  // Day 1: lunch + tea + opening sessions (welcome, intros, agenda, objectives, expectations, outputs) ~55min
  const day1Overhead = lunchDuration + teaBreakOverhead + 55
  // Day 2+: lunch + tea + recap/agenda ~20min
  const day2PlusOverhead = lunchDuration + teaBreakOverhead + 20

  const day1Available = Math.max(0, dayLengthMinutes - day1Overhead)
  const day2PlusAvailable = Math.max(0, dayLengthMinutes - day2PlusOverhead)

  const totalAvailableMinutes = day1Available + (days > 1 ? (days - 1) * day2PlusAvailable : 0)
  const perDayAvailable = days === 1 ? day1Available : Math.round(totalAvailableMinutes / days)

  // Calculate requested content duration
  const moduleDetails = getModuleDetailsDict()
  let requestedContentMinutes = 0
  const moduleBreakdown: string[] = []

  for (const modNum of requestedModules) {
    const mod = moduleDetails[modNum]
    if (!mod) continue

    const range = parseDurationRange(mod.duration)
    const isActivity = modNum.startsWith('9')
    let estimated: number

    if (isActivity) {
      // Activities: use upper bound (can't compress hands-on work)
      estimated = range.upper
    } else if (moduleVersion === 'condensed') {
      // Condensed theory: ~70% of lower bound
      estimated = Math.round(range.lower * 0.7)
    } else {
      // Full theory: midpoint of range
      estimated = Math.round((range.lower + range.upper) / 2)
    }

    requestedContentMinutes += estimated
    moduleBreakdown.push(`  Module ${modNum} (${mod.name}): ~${estimated} min${isActivity ? ' [activity]' : ''}`)
  }

  const overflowMinutes = Math.max(0, requestedContentMinutes - totalAvailableMinutes)

  const budgetSummary = [
    `Workshop: ${days} day(s), ${dayStartTime}–${dayEndTime}`,
    `Available content time: ${totalAvailableMinutes} min (~${Math.round(totalAvailableMinutes / 60)}h)`,
    `  Day 1: ${day1Available} min (after opening ceremonies + breaks)`,
    ...(days > 1 ? [`  Days 2-${days}: ${day2PlusAvailable} min each (after recap + breaks)`] : []),
    `Requested content: ${requestedContentMinutes} min (~${Math.round(requestedContentMinutes / 60)}h)`,
    ...moduleBreakdown,
    overflowMinutes > 0
      ? `⚠ OVERFLOW: ${overflowMinutes} min (~${Math.round(overflowMinutes / 60)}h) over budget. Must condense or remove modules.`
      : `✓ Content fits within available time (${totalAvailableMinutes - requestedContentMinutes} min buffer).`,
    `Max content per day: ~${perDayAvailable} min`,
  ].join('\n')

  return { totalAvailableMinutes, requestedContentMinutes, overflowMinutes, perDayAvailable, budgetSummary }
}

// AI Tools for modifying the deck
const AI_TOOLS: Anthropic.Tool[] = [
  {
    name: 'add_module',
    description: 'Add a module (or part of a module) to the workshop deck. Each module has "full" and "condensed" versions. You can split a module across multiple sessions by specifying different topic ranges.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to add the module to (1, 2, 3, etc.)' },
        module_number: { type: 'string', description: 'Module number/ID: "0" through "8" for theory modules, "3b" for AI Assistant, "9a" through "9h" for hands-on activity modules' },
        version: { type: 'string', enum: ['full', 'condensed'], description: 'Which version: "full" or "condensed". MUST be specified.' },
        duration: { type: 'number', description: 'Duration in minutes' },
        session_title: { type: 'string', description: 'Custom title for this session (e.g., "Data Quality Part 1"). If not specified, uses module name.' },
        topic_range: {
          type: 'object',
          properties: {
            start: { type: 'number', description: 'Start topic number (1-based, e.g., 1 for first topic)' },
            end: { type: 'number', description: 'End topic number (inclusive, e.g., 3 for topics 1-3)' },
          },
          description: 'Optional: specify which topics to include. Use this to split a module across sessions (e.g., topics 1-3 before break, 4-6 after).'
        },
      },
      required: ['day', 'module_number', 'version'],
    },
  },
  {
    name: 'add_break',
    description: 'Add a break (tea or lunch) to the workshop agenda',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to add the break to' },
        break_type: { type: 'string', enum: ['tea', 'lunch'], description: 'Type of break' },
        duration: { type: 'number', description: 'Duration in minutes' },
      },
      required: ['day', 'break_type'],
    },
  },
  {
    name: 'add_custom_session',
    description: 'Add a custom session like opening remarks, country presentation, group work, etc.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to add the session to' },
        session_name: { type: 'string', description: 'Name of the session' },
        duration: { type: 'number', description: 'Duration in minutes' },
      },
      required: ['day', 'session_name', 'duration'],
    },
  },
  {
    name: 'update_workshop_settings',
    description: 'Update workshop settings like objectives or basic info.',
    input_schema: {
      type: 'object' as const,
      properties: {
        objectives: { type: 'string', description: 'Workshop objectives as bullet points' },
        facilitators: { type: 'string', description: 'Facilitator names' },
        venue: { type: 'string', description: 'Workshop venue' },
        contact_email: { type: 'string', description: 'Contact email' },
        website: { type: 'string', description: 'Website URL' },
      },
      required: [],
    },
  },
  {
    name: 'move_session',
    description: 'Move a session to a different position within a day.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day the session is on' },
        from_position: { type: 'number', description: 'Current position (0-indexed)' },
        to_position: { type: 'number', description: 'New position (0-indexed)' },
      },
      required: ['day', 'from_position', 'to_position'],
    },
  },
  {
    name: 'remove_session',
    description: 'Remove a session from the deck.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day the session is on' },
        position: { type: 'number', description: 'Position of the session (0-indexed)' },
      },
      required: ['day', 'position'],
    },
  },
  {
    name: 'restructure_schedule',
    description: 'Change the number of days in the workshop. If reducing days, excess days are removed.',
    input_schema: {
      type: 'object' as const,
      properties: {
        new_num_days: { type: 'number', description: 'New number of days' },
      },
      required: ['new_num_days'],
    },
  },
  {
    name: 'remove_day',
    description: 'Remove an entire day from the workshop. Subsequent days are shifted down (Day 4 becomes Day 3, etc.).',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to remove (1-indexed)' },
      },
      required: ['day'],
    },
  },
  {
    name: 'move_session_to_day',
    description: 'Move a session from one day to another day.',
    input_schema: {
      type: 'object' as const,
      properties: {
        from_day: { type: 'number', description: 'Source day (1-indexed)' },
        from_position: { type: 'number', description: 'Position in source day (0-indexed)' },
        to_day: { type: 'number', description: 'Destination day (1-indexed)' },
        to_position: { type: 'number', description: 'Position in destination day (0-indexed, optional - defaults to end)' },
      },
      required: ['from_day', 'from_position', 'to_day'],
    },
  },
  {
    name: 'add_topic_to_session',
    description: 'Add a topic/slide from the content library to an existing session. Use this when the user wants to add more content to an existing session rather than creating a new one.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Day number (1-indexed)' },
        session_position: { type: 'number', description: 'Position of the session in the day (0-indexed)' },
        module_number: { type: 'string', description: 'Module number/ID (e.g., "0" through "8", "3b", "9a" through "9h")' },
        topic_number: { type: 'number', description: 'Topic number within the module (1-indexed)' },
        version: { type: 'string', enum: ['full', 'condensed'], description: 'Which version: "full" or "condensed"' },
      },
      required: ['day', 'session_position', 'module_number', 'topic_number', 'version'],
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Tool Execution Functions
// ─────────────────────────────────────────────────────────────────────────────

// Helper: Convert time string "HH:MM" to minutes since midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Helper: Convert minutes since midnight to "HH:MM" format
function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

// Helper: Calculate the current end time of all sessions in a day
function getDayCurrentEndTime(config: any, dayNum: number): number {
  const dayKey = `day${dayNum}`
  const sessions = config.schedule[dayKey] || []
  const dayStart = config.schedule.day_start_times?.[dayNum] || '09:00'

  let currentTime = timeToMinutes(dayStart)
  for (const session of sessions) {
    if (session.duration) {
      currentTime += session.duration
    }
  }
  return currentTime
}

// Helper: Get day end time in minutes
function getDayEndTime(config: any, dayNum: number): number {
  const dayEnd = config.schedule.day_end_times?.[dayNum] || config.workshop?.day_end_time || '17:00'
  return timeToMinutes(dayEnd)
}

// Helper: Validate that adding a session won't exceed day end time
function validateSessionFits(config: any, dayNum: number, duration: number): { fits: boolean; message?: string } {
  const currentEnd = getDayCurrentEndTime(config, dayNum)
  const dayEnd = getDayEndTime(config, dayNum)
  const newEnd = currentEnd + duration

  if (newEnd > dayEnd) {
    const overflowMinutes = newEnd - dayEnd
    return {
      fits: true,
      message: `Note: Day will run ${overflowMinutes} minutes past scheduled end (${minutesToTime(dayEnd)} → ${minutesToTime(newEnd)}). Session added anyway.`
    }
  }
  return { fits: true }
}

// Helper: Add a session before any day_end/section placeholders
function addSessionToDay(config: any, dayKey: string, session: any): void {
  const sessions = config.schedule[dayKey]

  // Find the position of any day_end or closing sessions
  let insertIndex = sessions.length
  for (let i = sessions.length - 1; i >= 0; i--) {
    const s = sessions[i]
    // Check for end-of-day type sessions
    if (s.type === 'day_end' ||
        s.type === 'section' && (s.session?.toLowerCase().includes('wrap') || s.session?.toLowerCase().includes('closing')) ||
        s.session?.toLowerCase().includes('key messages') ||
        s.session?.toLowerCase().includes('reflections')) {
      insertIndex = i
    } else {
      // Stop looking once we hit a regular session
      break
    }
  }

  // Insert at the correct position
  sessions.splice(insertIndex, 0, session)
}

function executeAddModule(config: any, input: any): { success: boolean; message: string } {
  const { day, version, duration, session_title, topic_range } = input
  const module_number = String(input.module_number)  // Normalize to string
  const dayKey = `day${day}`

  if (!config.schedule[dayKey]) {
    config.schedule[dayKey] = []
  }

  const moduleInfo = getModuleDetailsDict()[module_number]
  if (!moduleInfo) {
    return { success: false, message: `Module ${module_number} not found` }
  }

  // Build module ID: "m" + number (e.g., "m0", "m9a", "m3b")
  const moduleId = `m${module_number}`

  // Check for overlapping topic ranges if this module already exists
  const existingRanges: Array<{start: number, end: number, day: string}> = []
  for (const d of Object.keys(config.schedule)) {
    if (!d.match(/^day\d+$/)) continue
    const sessions = config.schedule[d]
    if (!Array.isArray(sessions)) continue
    for (const s of sessions) {
      if (s.module === moduleId) {
        if (s.topic_range) {
          existingRanges.push({ ...s.topic_range, day: d })
        } else {
          // Module exists without topic_range = ALL topics are used
          return {
            success: false,
            message: `Module ${module_number} (${moduleInfo.name}) already exists in full on ${d}. Cannot add again.`
          }
        }
      }
    }
  }

  // If adding with topic_range, check for overlaps
  if (topic_range && existingRanges.length > 0) {
    for (const existing of existingRanges) {
      // Check if ranges overlap
      if (!(topic_range.end < existing.start || topic_range.start > existing.end)) {
        return {
          success: false,
          message: `Topic range ${topic_range.start}-${topic_range.end} overlaps with existing range ${existing.start}-${existing.end} on ${existing.day}. Use non-overlapping ranges to split a module.`
        }
      }
    }
  }

  // If adding without topic_range but module already has partial ranges, reject
  if (!topic_range && existingRanges.length > 0) {
    return {
      success: false,
      message: `Module ${module_number} already has partial sessions. Specify a topic_range to add more parts.`
    }
  }

  // Build session name
  const sessionName = session_title || (topic_range
    ? `${moduleInfo.name} (Topics ${topic_range.start}-${topic_range.end})`
    : moduleInfo.name)

  const sessionDuration = duration || (version === 'condensed' ? 45 : 90)

  // Validate session fits within day
  const validation = validateSessionFits(config, day, sessionDuration)
  if (!validation.fits) {
    return { success: false, message: validation.message! }
  }

  // Add session before any day_end placeholders
  addSessionToDay(config, dayKey, {
    _id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    session: sessionName,
    module: moduleId,
    version: version,
    topic_range: topic_range || null,  // null means all topics
    duration: sessionDuration,
  })

  const rangeMsg = topic_range ? ` (topics ${topic_range.start}-${topic_range.end})` : ''
  return { success: true, message: `Added ${version} version of Module ${module_number}: ${moduleInfo.name}${rangeMsg} to Day ${day}` }
}

function executeAddBreak(config: any, input: any): { success: boolean; message: string } {
  const { day, break_type, duration } = input
  const dayKey = `day${day}`

  if (!config.schedule[dayKey]) {
    config.schedule[dayKey] = []
  }

  const breakDuration = duration || (break_type === 'lunch' ? 60 : 15)
  const breakName = break_type === 'lunch' ? 'Lunch Break' : 'Tea Break'

  // Validate break fits within day
  const validation = validateSessionFits(config, day, breakDuration)
  if (!validation.fits) {
    return { success: false, message: validation.message! }
  }

  // Add break before any day_end placeholders
  addSessionToDay(config, dayKey, {
    _id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    session: breakName,
    type: 'break',
    duration: breakDuration,
  })

  return { success: true, message: `Added ${breakName} (${breakDuration}min) to Day ${day}` }
}

function executeAddCustomSession(config: any, input: any): { success: boolean; message: string } {
  const { day, session_name, duration } = input
  const dayKey = `day${day}`

  if (!config.schedule[dayKey]) {
    config.schedule[dayKey] = []
  }

  // Validate session fits within day
  const validation = validateSessionFits(config, day, duration)
  if (!validation.fits) {
    return { success: false, message: validation.message! }
  }

  // Add session before any day_end placeholders
  addSessionToDay(config, dayKey, {
    _id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    session: session_name,
    type: 'custom',
    duration: duration,
  })

  return { success: true, message: `Added "${session_name}" (${duration}min) to Day ${day}` }
}

function executeUpdateSettings(config: any, input: any): { success: boolean; message: string } {
  const updates: string[] = []

  if (input.objectives) {
    config.workshop.objectives = input.objectives
    updates.push('objectives')
  }
  if (input.facilitators) {
    config.workshop.facilitators = input.facilitators
    updates.push('facilitators')
  }
  if (input.venue) {
    config.workshop.venue = input.venue
    updates.push('venue')
  }
  if (input.contact_email) {
    config.workshop.contact_email = input.contact_email
    updates.push('contact email')
  }
  if (input.website) {
    config.workshop.website = input.website
    updates.push('website')
  }

  return { success: true, message: `Updated: ${updates.join(', ')}` }
}

function executeMoveSession(config: any, input: any): { success: boolean; message: string } {
  const { day, from_position, to_position } = input
  const dayKey = `day${day}`

  if (!config.schedule[dayKey] || config.schedule[dayKey].length === 0) {
    return { success: false, message: `Day ${day} has no sessions` }
  }

  const sessions = config.schedule[dayKey]
  if (from_position < 0 || from_position >= sessions.length) {
    return { success: false, message: `Invalid from_position: ${from_position}` }
  }

  const [session] = sessions.splice(from_position, 1)
  sessions.splice(to_position, 0, session)

  return { success: true, message: `Moved "${session.session}" from position ${from_position} to ${to_position}` }
}

function executeRemoveSession(config: any, input: any): { success: boolean; message: string } {
  const { day, position } = input
  const dayKey = `day${day}`

  if (!config.schedule[dayKey] || config.schedule[dayKey].length === 0) {
    return { success: false, message: `Day ${day} has no sessions` }
  }

  const sessions = config.schedule[dayKey]
  if (position < 0 || position >= sessions.length) {
    return { success: false, message: `Invalid position: ${position}` }
  }

  const [removed] = sessions.splice(position, 1)
  return { success: true, message: `Removed "${removed.session}" from Day ${day}` }
}

function executeRestructureSchedule(config: any, input: any): { success: boolean; message: string } {
  const { new_num_days } = input
  const currentDays = config.schedule.days || 1

  if (new_num_days < 1) {
    return { success: false, message: 'Workshop must have at least 1 day' }
  }

  // If reducing days, remove excess days
  if (new_num_days < currentDays) {
    for (let d = new_num_days + 1; d <= currentDays; d++) {
      delete config.schedule[`day${d}`]
      if (config.schedule.day_titles) delete config.schedule.day_titles[d]
      if (config.schedule.day_start_times) delete config.schedule.day_start_times[d]
    }
  }

  // If adding days, create empty arrays
  if (new_num_days > currentDays) {
    for (let d = currentDays + 1; d <= new_num_days; d++) {
      config.schedule[`day${d}`] = []
    }
  }

  config.schedule.days = new_num_days

  return { success: true, message: `Restructured workshop from ${currentDays} to ${new_num_days} days` }
}

function executeRemoveDay(config: any, input: any): { success: boolean; message: string } {
  const { day } = input
  const currentDays = config.schedule.days || 1

  if (day < 1 || day > currentDays) {
    return { success: false, message: `Invalid day: ${day}. Workshop has ${currentDays} days.` }
  }

  // Remove the day
  delete config.schedule[`day${day}`]
  if (config.schedule.day_titles) delete config.schedule.day_titles[day]
  if (config.schedule.day_start_times) delete config.schedule.day_start_times[day]

  // Shift subsequent days down
  for (let d = day + 1; d <= currentDays; d++) {
    config.schedule[`day${d - 1}`] = config.schedule[`day${d}`] || []
    delete config.schedule[`day${d}`]

    if (config.schedule.day_titles && config.schedule.day_titles[d]) {
      config.schedule.day_titles[d - 1] = config.schedule.day_titles[d]
      delete config.schedule.day_titles[d]
    }
    if (config.schedule.day_start_times && config.schedule.day_start_times[d]) {
      config.schedule.day_start_times[d - 1] = config.schedule.day_start_times[d]
      delete config.schedule.day_start_times[d]
    }
  }

  config.schedule.days = currentDays - 1

  return { success: true, message: `Removed Day ${day} and shifted subsequent days. Workshop now has ${currentDays - 1} days.` }
}

function executeMoveSessionToDay(config: any, input: any): { success: boolean; message: string } {
  const { from_day, from_position, to_day, to_position } = input
  const fromDayKey = `day${from_day}`
  const toDayKey = `day${to_day}`

  // Validate source day and position
  if (!config.schedule[fromDayKey] || !Array.isArray(config.schedule[fromDayKey])) {
    return { success: false, message: `Day ${from_day} does not exist or has no sessions` }
  }
  const fromSessions = config.schedule[fromDayKey]
  if (from_position < 0 || from_position >= fromSessions.length) {
    return { success: false, message: `Invalid position ${from_position} in Day ${from_day} (has ${fromSessions.length} sessions)` }
  }

  // Validate destination day
  if (!config.schedule[toDayKey]) {
    config.schedule[toDayKey] = []
  }

  // Get the session to move
  const [session] = fromSessions.splice(from_position, 1)

  // Validate session fits in destination day
  const validation = validateSessionFits(config, to_day, session.duration || 0)
  if (!validation.fits) {
    // Put it back if it doesn't fit
    fromSessions.splice(from_position, 0, session)
    return { success: false, message: `Cannot move to Day ${to_day}: ${validation.message}` }
  }

  // Add to destination day
  const toSessions = config.schedule[toDayKey]
  if (to_position !== undefined && to_position >= 0 && to_position <= toSessions.length) {
    toSessions.splice(to_position, 0, session)
  } else {
    // Add before day_end placeholders
    addSessionToDay(config, toDayKey, session)
  }

  return { success: true, message: `Moved "${session.session}" from Day ${from_day} to Day ${to_day}` }
}

function executeAddTopicToSession(config: any, input: any): { success: boolean; message: string } {
  const { day, session_position, topic_number, version } = input
  const module_number = String(input.module_number)  // Normalize to string
  const dayKey = `day${day}`

  // Validate day exists
  if (!config.schedule[dayKey] || !Array.isArray(config.schedule[dayKey])) {
    return { success: false, message: `Day ${day} does not exist` }
  }

  const sessions = config.schedule[dayKey]
  if (session_position < 0 || session_position >= sessions.length) {
    return { success: false, message: `Invalid session position ${session_position} in Day ${day}` }
  }

  const session = sessions[session_position]

  // Build the topic file path
  const moduleId = `m${module_number}`
  const topicId = `${moduleId}_${topic_number}`
  const suffix = version === 'condensed' ? '_condensed' : ''
  const topicFile = `${moduleId}_${String(topic_number).padStart(2, '0')}${suffix}.md`

  // Check if topic already exists in session
  if (session.slides?.includes(topicFile)) {
    return { success: false, message: `Topic ${topicFile} already exists in this session` }
  }

  // Add topic to session
  if (!session.topics) session.topics = []
  if (!session.slides) session.slides = []

  session.topics.push(topicId)
  session.slides.push(topicFile)
  session.duration = (session.duration || 0) + 15 // Add default topic duration

  return { success: true, message: `Added topic ${topicFile} to session "${session.session}"` }
}

function executeTool(toolName: string, input: any, config: any): { success: boolean; message: string } {
  switch (toolName) {
    case 'add_module':
      return executeAddModule(config, input)
    case 'add_break':
      return executeAddBreak(config, input)
    case 'add_custom_session':
      return executeAddCustomSession(config, input)
    case 'update_workshop_settings':
      return executeUpdateSettings(config, input)
    case 'move_session':
      return executeMoveSession(config, input)
    case 'remove_session':
      return executeRemoveSession(config, input)
    case 'restructure_schedule':
      return executeRestructureSchedule(config, input)
    case 'remove_day':
      return executeRemoveDay(config, input)
    case 'move_session_to_day':
      return executeMoveSessionToDay(config, input)
    case 'add_topic_to_session':
      return executeAddTopicToSession(config, input)
    default:
      return { success: false, message: `Unknown tool: ${toolName}` }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Chat Endpoint
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/chat - Chat with AI assistant (with tools)
router.post('/chat', async (req, res) => {
  try {
    const { messages, workshopConfig } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' })
    }

    if (!workshopConfig) {
      return res.status(400).json({ error: 'Workshop config required - please select a workshop first' })
    }

    const client = getClient()

    // Deep clone the config so we can modify it
    let workingConfig = JSON.parse(JSON.stringify(workshopConfig))

    // Ensure schedule exists
    if (!workingConfig.schedule) {
      workingConfig.schedule = {}
    }

    // Build system prompt
    const systemPrompt = `You are a FASTR workshop planning assistant. You can DIRECTLY MODIFY the workshop deck using the tools provided.

# ABOUT FASTR
FASTR (Framework for Analytics Strengthening Through Routine data) is a methodology for analyzing health system data, particularly RMNCAH-N program data from DHIS2.

# MODULE TYPES
There are two categories of modules:

## Theory Modules (0-8, 3b)
Conceptual/methodological content. Each has TWO versions:
- **FULL version**: Complete content with all slides. Takes 60-180 minutes.
- **CONDENSED version**: Key points only. Takes 30-60 minutes.

## Activity Modules (9a-9h)
Hands-on platform activities and exercises. Only have FULL version (use version: "full").
These are CRITICAL for practical workshops — always pair theory with activities.

**RULES:**
1. NEVER add both full and condensed versions of the same module
2. If user does not specify version for theory modules, ASK before adding
3. "quick overview" or "high-level" → use condensed
4. "detailed" or "comprehensive" or "full training" → use full
5. Activity modules (9a-9h) only have full version — always use "full"
6. For practical workshops, PREFER activity modules over custom sessions for hands-on work
7. A good workshop balances theory and practice — don't stack all theory together

# AVAILABLE MODULES
${Object.entries(getModuleDetailsDict()).map(([num, mod]) => `
## Module ${num}: ${mod.name}
- **Description**: ${mod.description}
- **Topics**: ${mod.topics.join(', ')}
- **Duration**: ${mod.duration}
${/^\d+$/.test(num) ? '- **Has condensed version**: yes (~30-50% of full)' : /^9/.test(num) ? '- **Type**: Hands-on activity (full only)' : '- **Has condensed version**: yes'}
`).join('\n')}

# CURRENT WORKSHOP
${JSON.stringify(workingConfig, null, 2)}

# YOUR CAPABILITIES
You can use tools to:
1. **add_module** - Add a module (must specify version: "full" or "condensed"). Can use topic_range to split.
2. **add_break** - Add tea or lunch breaks
3. **add_custom_session** - Add custom sessions
4. **update_workshop_settings** - Fill in workshop objectives and settings
5. **move_session** - Move a session within a day (reorder)
6. **move_session_to_day** - Move a session from one day to another
7. **remove_session** - Remove a session from the deck
8. **restructure_schedule** - Change the number of days (e.g., compress 4 days to 3)
9. **remove_day** - Remove an entire day (subsequent days shift down)

# SPLITTING MODULES ACROSS SESSIONS
If a module is too long and needs a break in the middle, you CAN split it:
1. Add the first part with topic_range: {start: 1, end: 3} (topics 1-3)
2. Add a break session
3. Add the second part with topic_range: {start: 4, end: 6} (topics 4-6)

CRITICAL RULES:
- Topic ranges must NOT overlap - each topic can only appear ONCE
- The slides will follow the correct order from the chapter
- Use session_title to name the parts (e.g., "Data Quality Part 1", "Data Quality Part 2")
- If you don't specify topic_range, ALL topics are included (cannot split after that)

# INSTRUCTIONS
- When adding modules, ALWAYS specify the version parameter
- If user doesn't specify full vs condensed, ASK before adding
- When the user asks to add content, USE THE TOOLS to actually add it
- After using tools, briefly confirm what you added
- If the user asks a question without wanting changes, just answer without using tools
- ALWAYS actually execute the changes - don't just describe what you would do
- If you need to add a break in the middle of content, add the module ONCE, then add a break as a separate session

# STRUCTURAL RULES
- Day title slide is ALWAYS first in each day — never move or add sessions before it
- End of day slide is ALWAYS last — never add sessions after it
- Recap of previous day should follow day title (Day 2+)
- Breaks go BETWEEN content sessions, never at the start or end of a day
- No consecutive breaks (except a tea break immediately before lunch is ok)
- Each full day should have a lunch break
- Module 0 (Introduction) belongs on Day 1
- Activity modules (9a-9h) should follow their paired theory module

# WHEN TO ASK FOR CLARIFICATION
Before making large changes, ask when:
- User says "add content" but doesn't specify which module → ask which topic area
- User says "reorganize" without specifics → ask what the goal is
- User wants to add many modules but the day is already full → warn and ask how to handle
- Any request that would significantly change the workshop structure → confirm first`

    let currentMessages = messages
    let finalTextContent = ''
    const toolResults: Array<{ tool: string; result: any }> = []

    // Tool use loop - keep going until AI stops calling tools
    let maxIterations = 15
    while (maxIterations > 0) {
      maxIterations--

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: systemPrompt,
        messages: currentMessages,
        tools: AI_TOOLS,
      })

      // Process response
      let hasToolUse = false
      const toolUseResults: Anthropic.ToolResultBlockParam[] = []

      for (const block of response.content) {
        if (block.type === 'text') {
          finalTextContent += block.text
        } else if (block.type === 'tool_use') {
          hasToolUse = true

          // Execute the tool
          const result = executeTool(block.name, block.input, workingConfig)
          toolResults.push({ tool: block.name, result })

          toolUseResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: JSON.stringify(result),
          })
        }
      }

      // If no tools were called, we're done
      if (!hasToolUse || response.stop_reason === 'end_turn') {
        break
      }

      // Continue conversation with tool results
      currentMessages = [
        ...currentMessages,
        { role: 'assistant' as const, content: response.content },
        { role: 'user' as const, content: toolUseResults },
      ]
    }

    res.json({
      role: 'assistant',
      message: finalTextContent,
      toolResults: toolResults,
      updatedConfig: workingConfig,
    })
  } catch (error: any) {
    console.error('AI chat error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// AI Generate Text Endpoint
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/generate - Simple text generation (no tools)
router.post('/generate', async (req, res) => {
  try {
    const { prompt, context } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt required' })
    }

    const client = getClient()

    const systemPrompt = `You are a helpful assistant for FASTR workshop planning. Generate concise, professional content.

IMPORTANT RULES:
- Output ONLY the requested content as plain text
- One item per line
- No introductions, no explanations
- No markdown formatting, no bullet points, no numbers
- Be specific and actionable

Context: ${context ? JSON.stringify(context) : 'General FASTR workshop'}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      }
    }

    res.json({ content: textContent })
  } catch (error: any) {
    console.error('AI generate error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// AI Generate Objectives Endpoint
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/objectives - Generate workshop objectives
router.post('/objectives', async (req, res) => {
  try {
    const { country, modules, duration } = req.body

    if (!country || !modules || !Array.isArray(modules)) {
      return res.status(400).json({ error: 'Country and modules array required' })
    }

    const client = getClient()

    const moduleNames = modules.map((m: number) => getModuleDetailsDict()[m]?.name || `Module ${m}`).join(', ')

    const prompt = `Generate 4-6 specific learning objectives for a ${duration || 3}-day FASTR workshop in ${country}.

The workshop includes: ${moduleNames}

REQUIREMENTS:
- Start each objective with an action verb (Understand, Identify, Apply, Analyze, etc.)
- Be specific to RMNCAH-N health data analytics
- Focus on practical skills participants will gain
- One objective per line
- No numbering or bullets

OUTPUT FORMAT:
Objective 1
Objective 2
Objective 3
...`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: 'You generate specific, actionable learning objectives for health data analytics workshops. Output only the objectives, one per line.',
      messages: [{ role: 'user', content: prompt }],
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      }
    }

    // Parse objectives from response
    const objectives = textContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'))

    res.json({ objectives })
  } catch (error: any) {
    console.error('AI objectives error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// AI Generate Schedule Endpoint
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/ai/schedule - Generate suggested schedule
router.post('/schedule', async (req, res) => {
  try {
    const { workshopConfig, modules } = req.body

    if (!workshopConfig || !modules || !Array.isArray(modules)) {
      return res.status(400).json({ error: 'Workshop config and modules array required' })
    }

    const numDays = workshopConfig.days?.length || 3
    const country = workshopConfig.workshop?.country || 'the country'

    const client = getClient()

    const moduleDescriptions = modules.map((m: number) => {
      const mod = getModuleDetailsDict()[m]
      return mod ? `Module ${m} (${mod.name}): ${mod.duration}` : `Module ${m}`
    }).join('\n')

    const prompt = `Create a ${numDays}-day schedule for a FASTR workshop in ${country}.

SELECTED MODULES:
${moduleDescriptions}

REQUIREMENTS:
- Day 1 morning: Opening, Introductions, Expectations, then start content
- Include tea breaks (15min) mid-morning and mid-afternoon
- Include lunch break (60min) around 12:30-13:30
- End each day by 17:00
- Logical flow: Introduction first, then extraction, then platform, then analysis modules
- Day 2+: Start with brief recap of previous day

OUTPUT AS JSON:
{
  "days": [
    {
      "day_number": 1,
      "title": "Day theme/title",
      "sessions": [
        {"type": "template", "name": "Welcome", "duration": 15},
        {"type": "module", "module_id": 0, "name": "Introduction to FASTR", "duration": 60},
        {"type": "break", "name": "Tea Break", "duration": 15},
        ...
      ]
    },
    ...
  ]
}

ONLY output valid JSON, nothing else.`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: 'You are a workshop scheduler. Output only valid JSON, no markdown formatting.',
      messages: [{ role: 'user', content: prompt }],
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      }
    }

    // Parse JSON from response (handle potential markdown code blocks)
    let jsonContent = textContent.trim()
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    }

    const schedule = JSON.parse(jsonContent)
    res.json(schedule)
  } catch (error: any) {
    console.error('AI schedule error:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/ai/generate-workshop - Generate complete workshop config from natural language
router.post('/generate-workshop', async (req, res) => {
  try {
    const { prompt, clarifications } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const client = getClient()

    const moduleList = Object.entries(getModuleDetailsDict())
      .map(([num, m]) => `  Module ${num}: ${m.name} - ${m.description} (${m.duration})`)
      .join('\n')

    // ── Phase 1: Check if clarification is needed ──────────────────────────
    if (!clarifications) {
      // Pre-compute a rough time budget to include in clarification context
      // Try to extract days and modules from the raw prompt for feasibility check
      const roughDaysMatch = prompt.match(/(\d+)\s*[-–]?\s*days?/i)
      const roughDays = roughDaysMatch ? parseInt(roughDaysMatch[1]) : 3
      const roughBudget = computeTimeBudget({ days: roughDays })

      const clarifyResponse = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: `You evaluate workshop descriptions to determine if there is enough information to build a good FASTR workshop.

Available modules (with durations):
${moduleList}

You MUST have clarity on these key items:
1. Number of days (e.g., "3-day workshop")
2. Workshop focus or which modules to include (e.g., "focus on data quality" or "full FASTR training")
3. Audience level (e.g., "first time", "refresher", "advanced")
4. Workshop language (English or French) — if the prompt is in French or mentions a francophone country (Senegal, Burkina Faso, DRC, Cameroon, Mali, Guinea, Niger, Chad, Benin, Togo, Côte d'Ivoire, Madagascar, Haiti, etc.), assume French and do NOT ask

Nice to have (do NOT ask if missing, just use defaults):
- Country, dates, city
- Full vs condensed preference
- Start/end times

TIME BUDGET AWARENESS:
- A ${roughDays}-day workshop has roughly ${roughBudget.totalAvailableMinutes} minutes (~${Math.round(roughBudget.totalAvailableMinutes / 60)}h) of available content time (after breaks, opening ceremonies, recaps)
- If the user requests modules whose total duration clearly exceeds the available time, you MUST include a question warning them: "You've requested approximately Xh of content but only have ~Yh available. Would you like to: (a) use condensed/shorter versions for theory modules, (b) prioritize certain modules and drop others, or (c) add more days?"
- Module durations are listed above — sum them to check feasibility

RULES:
- If ALL required items are clear from the description, return exactly: {"ready": true}
- If any key item is unclear, return a JSON array of 2-4 short, specific questions to ask. Each question should be a plain string.
- Do NOT ask about things already stated in the prompt
- Do NOT ask about language if the prompt is in French or mentions a francophone country
- Keep questions concise and practical
- Return ONLY valid JSON, no explanation`,
        messages: [{ role: 'user', content: prompt }],
      })

      let clarifyText = ''
      for (const block of clarifyResponse.content) {
        if (block.type === 'text') clarifyText += block.text
      }

      let clarifyJson = clarifyText.trim()
      if (clarifyJson.startsWith('```')) {
        clarifyJson = clarifyJson.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
      }

      try {
        const parsed = JSON.parse(clarifyJson)
        if (parsed.ready !== true && Array.isArray(parsed)) {
          // Needs clarification — return questions to frontend
          return res.json({ needsClarification: true, questions: parsed })
        }
        // If parsed is {"ready": true} or any non-array, fall through to generation
      } catch {
        // If parsing fails, just proceed with generation
      }
    }

    // ── Phase 2: Generate workshop ─────────────────────────────────────────
    // Build enriched prompt if clarifications were provided
    let enrichedPrompt = prompt
    if (clarifications && Array.isArray(clarifications)) {
      const qaBlock = clarifications
        .map((c: { question: string; answer: string }) => `Q: ${c.question}\nA: ${c.answer}`)
        .join('\n\n')
      enrichedPrompt = `${prompt}\n\nAdditional details:\n${qaBlock}`
    }

    // Extract parameters from enriched prompt for time budget calculation
    const daysMatch = enrichedPrompt.match(/(\d+)\s*[-–]?\s*days?/i)
    const extractedDays = daysMatch ? parseInt(daysMatch[1]) : 3
    const startTimeMatch = enrichedPrompt.match(/start\s*(?:at\s*)?(\d{1,2}[:.]\d{2})/i)
    const endTimeMatch = enrichedPrompt.match(/end\s*(?:at\s*|by\s*)?(\d{1,2}[:.]\d{2})/i)
    const extractedStartTime = startTimeMatch ? startTimeMatch[1].replace('.', ':') : '09:00'
    const extractedEndTime = endTimeMatch ? endTimeMatch[1].replace('.', ':') : '17:00'
    const isCondensed = /condensed|quick|overview|high-level|shorter|introductory/i.test(enrichedPrompt)

    // Try to identify requested modules from the enriched prompt
    const moduleDetails = getModuleDetailsDict()
    const allModuleNums = Object.keys(moduleDetails)
    const detectedModules: string[] = []
    // Check for explicit module references or topic keywords
    for (const num of allModuleNums) {
      const mod = moduleDetails[num]
      const nameWords = mod.name.toLowerCase().split(/\s+/)
      const hasModuleRef = new RegExp(`module\\s*${num.replace(/([a-z])/g, '$1?')}\\b`, 'i').test(enrichedPrompt)
      const hasTopicRef = nameWords.some(w => w.length > 4 && enrichedPrompt.toLowerCase().includes(w))
      if (hasModuleRef || hasTopicRef) detectedModules.push(num)
    }
    // If "full training" or no specific modules, assume most modules
    const modulesForBudget = detectedModules.length > 0 ? detectedModules : allModuleNums.filter(n => !n.startsWith('9'))

    const timeBudget = computeTimeBudget({
      days: extractedDays,
      dayStartTime: extractedStartTime,
      dayEndTime: extractedEndTime,
      requestedModules: modulesForBudget,
      moduleVersion: isCondensed ? 'condensed' : 'full',
    })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: `You are an expert workshop planner for FASTR (Framework for Analytics of Service use Trends and Results) workshops focused on RMNCAH-N health data analysis.

Given a user's description of their workshop needs, generate a COMPLETE workshop configuration including the full schedule.

Available FASTR modules:
${moduleList}

TIME BUDGET (calculated):
${timeBudget.budgetSummary}

HARD SCHEDULING RULES:
- Each day MUST end by the day_end_time. NO EXCEPTIONS.
- Sum all session durations per day (including breaks). Total must NOT exceed ${timeToMinutes(extractedEndTime) - timeToMinutes(extractedStartTime)} minutes.
- Day 1 available content time: ~${timeBudget.totalAvailableMinutes > 0 ? Math.round(timeBudget.totalAvailableMinutes / extractedDays) : 300} min (after opening ceremonies + breaks).
- Activity modules (9a-9h) MUST keep their full duration. Never compress.
- If content doesn't fit: use condensed for theory modules, or drop lower-priority modules.
- Maximum ~${timeBudget.perDayAvailable} minutes of content sessions per day.

IMPORTANT - MODULE TYPES:

Theory modules (0-8, 3b) have TWO versions:
- "full": Complete content with all slides (longer duration)
- "condensed": Key points only (shorter duration, ~30-50% of full)

Activity modules (9a-9h) are hands-on platform exercises. Only have "full" version.
These are CRITICAL for practical workshops. Always pair theory with relevant activities.

Typical pairings:
- Module 3 (Platform) → 9a (Instance Setup) + 9b (Getting Started) + 9h (Platform Demo)
- Module 4-5 (Data Quality) → 9c (Visualizations & Interpretation)
- Module 6 (Data Analysis) → 9c (Visualizations) + 9d (Slide Decks)
- Module 7 (Results Communication) → 9d (Slide Decks) + 9e (Disruption Report)
- Module 3b (AI Assistant) → 9f (Prompting Techniques)

Version choice:
- "quick", "overview", "high-level" → use "condensed" for theory
- "detailed", "comprehensive", "full training" → use "full"
- Short days → prefer "condensed" for theory
- Activity modules → always use "full"

Generate a JSON object with this structure:
{
  "name": "FASTR Workshop - [Country]",
  "title": "FASTR RMNCAH-N Data Use Workshop",
  "subtitle": "Country Workshop: [Country]",
  "country": "Country name",
  "location": "City if mentioned, otherwise empty string",
  "start_date": "2026-03-10",
  "end_date": "2026-03-12",
  "days": 3,
  "day_start_time": "09:00",
  "day_end_time": "17:00",
  "lunch_duration": 60,
  "module_version": "full",
  "objectives": "- Objective 1\\n- Objective 2\\n- Objective 3",
  "expected_outputs": "- Output 1\\n- Output 2\\n- Output 3",
  "modules": ["0", "1", "2", "4", "5", "6", "7", "9a", "9c"],
  "schedule": {
    "day1": [
      {"session": "Introduction to FASTR", "module": "m0", "version": "full", "duration": 60},
      {"session": "Tea Break", "type": "break", "duration": 15},
      {"session": "Identify Questions & Indicators", "module": "m1", "version": "full", "duration": 90},
      {"session": "Lunch Break", "type": "break", "duration": 60},
      {"session": "Instance Setup", "module": "m9a", "version": "full", "duration": 90},
      {"session": "Registration", "type": "custom", "duration": 30}
    ],
    "day2": [
      {"session": "Data Quality Assessment", "module": "m4", "version": "condensed", "duration": 45},
      {"session": "Lunch Break", "type": "break", "duration": 60},
      {"session": "Visualizations & Interpretation", "module": "m9c", "version": "full", "duration": 120}
    ]
  }
}

CRITICAL RULES:
1. NEVER include both "full" and "condensed" versions of the same theory module
2. Select modules that match the workshop focus
3. Spread modules logically across days with breaks
4. Day 1 should typically include Module 0 (Introduction) FIRST
5. Add tea breaks (15min) mid-morning and mid-afternoon
6. Add lunch break around midday (default 60min, or as specified by user)
7. Calculate total daily content to fit within start and end times
8. THREE session types are allowed:
   - Module sessions: {"session": "Name", "module": "m0", "version": "full", "duration": 60}
   - Break sessions: {"session": "Tea Break", "type": "break", "duration": 15}
   - Custom sessions: {"session": "Country Presentations", "type": "custom", "duration": 60}
9. Use custom sessions ONLY for non-module activities (registration, opening remarks, country presentations, group discussion, action planning)
10. PREFER activity modules (9a-9h) over custom sessions for hands-on platform work
11. objectives and expected_outputs should be strings with "- " bullets separated by newlines
12. Extract day_start_time and day_end_time from user prompt
13. Extract start_date and end_date from user prompt in YYYY-MM-DD format
14. Extract lunch_duration from user prompt (default 60 minutes if not specified)
15. Generate a concise title (for cover slide) and subtitle
16. Use the workshop name provided by user for the "name" field
17. NEVER DUPLICATE A MODULE - each module can only appear ONCE in the entire schedule
18. EVERY module in the "modules" array MUST appear in the schedule — do NOT list a module without scheduling it. If it doesn't fit, remove it from the "modules" array too.
19. Use ONLY these break names: "Tea Break" and "Lunch Break" (never translate break names, even for French workshops). ONE lunch break per day, maximum.
18. A good workshop BALANCES theory and practice — don't stack all theory on one day

Return ONLY valid JSON, no explanation.`,
      messages: [
        {
          role: 'user',
          content: enrichedPrompt,
        },
      ],
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      }
    }

    // Parse JSON from response
    let jsonContent = textContent.trim()
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    }

    const workshopConfig = JSON.parse(jsonContent)

    // POST-PROCESSING: Remove duplicate modules and clean up schedule
    // The AI sometimes creates "Part 1" and "Part 2" with the same module content
    if (workshopConfig.schedule) {
      const seenModules = new Set<string>()
      let removedCount = 0

      for (const dayKey of Object.keys(workshopConfig.schedule)) {
        if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue

        const sessions = workshopConfig.schedule[dayKey]

        // Pass 1: Mark duplicates and combine durations
        const toRemove = new Set<number>()
        for (let i = 0; i < sessions.length; i++) {
          const session = sessions[i]
          if (!session.module) continue

          const moduleKey = session.module
          if (seenModules.has(moduleKey)) {
            toRemove.add(i)
            removedCount++
          } else {
            seenModules.add(moduleKey)
          }
        }

        // Pass 2: Remove duplicates
        workshopConfig.schedule[dayKey] = sessions.filter((_: any, i: number) => !toRemove.has(i))

        // Helper to check if a session is a lunch break (bilingual: EN + FR)
        const lunchPattern = /lunch|déjeuner|dejeuner|dîner|diner|midi/i
        const isLunch = (s: any) => s?.type === 'break' && lunchPattern.test(s?.session || '')
        const isTeaBreak = (s: any) => s?.type === 'break' && !lunchPattern.test(s?.session || '')

        // Pass 3: Remove consecutive tea breaks (if duplicate removal left two breaks in a row)
        // Always keep lunch breaks
        const cleaned: any[] = []
        for (const session of workshopConfig.schedule[dayKey]) {
          const lastSession = cleaned[cleaned.length - 1]
          // Skip if this is a tea break and the previous one was also a break
          if (isTeaBreak(session) && lastSession?.type === 'break') {
            continue
          }
          cleaned.push(session)
        }
        workshopConfig.schedule[dayKey] = cleaned

        // Pass 4: Remove trailing tea breaks at end of day (keep lunch if it's there)
        while (workshopConfig.schedule[dayKey].length > 0) {
          const lastSession = workshopConfig.schedule[dayKey][workshopConfig.schedule[dayKey].length - 1]
          if (isTeaBreak(lastSession)) {
            workshopConfig.schedule[dayKey].pop()
          } else {
            break
          }
        }

        // Pass 5: Ensure each day has a lunch break (add one if missing)
        const hasLunch = workshopConfig.schedule[dayKey].some((s: any) => isLunch(s))
        if (!hasLunch && workshopConfig.schedule[dayKey].length > 0) {
          // Find middle of sessions to insert lunch
          const sessions = workshopConfig.schedule[dayKey]
          const middleIndex = Math.floor(sessions.length / 2)
          sessions.splice(middleIndex, 0, {
            session: 'Lunch Break',
            type: 'break',
            duration: workshopConfig.lunch_duration || 60
          })
        }
      }

      // Pass 6: Ensure no sessions appear after a day_end type
      for (const dayKey of Object.keys(workshopConfig.schedule)) {
        if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
        const sessions = workshopConfig.schedule[dayKey]
        const dayEndIndex = sessions.findIndex((s: any) => s.type === 'day_end')
        if (dayEndIndex >= 0 && dayEndIndex < sessions.length - 1) {
          const removed = sessions.splice(dayEndIndex + 1)
        }
      }

      // Pass 7: Ensure no breaks at the very start of a day (before first content session)
      for (const dayKey of Object.keys(workshopConfig.schedule)) {
        if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
        const sessions = workshopConfig.schedule[dayKey]
        // Find first non-structural session (skip day_title, section, day_recap)
        while (sessions.length > 0) {
          const first = sessions[0]
          if (first.type === 'day_title' || first.type === 'section' || first.type === 'day_recap') break
          if (first.type === 'break') {
            sessions.shift()
          } else {
            break
          }
        }
      }

      // Pass 8: Remove consecutive non-lunch breaks and duplicate lunch breaks
      const lunchPatternGlobal = /lunch|déjeuner|dejeuner|dîner|diner|midi/i
      for (const dayKey of Object.keys(workshopConfig.schedule)) {
        if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
        const sessions = workshopConfig.schedule[dayKey]
        const isLunchBreak = (s: any) => s?.type === 'break' && lunchPatternGlobal.test(s?.session || '')
        const isNonLunchBreak = (s: any) => s?.type === 'break' && !lunchPatternGlobal.test(s?.session || '')
        const cleaned: any[] = []
        let lunchCount = 0
        for (const session of sessions) {
          const prev = cleaned[cleaned.length - 1]
          // Remove duplicate lunch breaks (keep only the first one per day)
          if (isLunchBreak(session)) {
            lunchCount++
            if (lunchCount > 1) continue
          }
          // Allow tea break immediately before lunch, but not two tea breaks in a row
          if (isNonLunchBreak(session) && prev && isNonLunchBreak(prev)) {
            continue
          }
          cleaned.push(session)
        }
        workshopConfig.schedule[dayKey] = cleaned
      }

      // Pass 9: Overflow detection and auto-condensing
      const dayStartMin = timeToMinutes(workshopConfig.day_start_time || extractedStartTime)
      const dayEndMin = timeToMinutes(workshopConfig.day_end_time || extractedEndTime)
      const maxDayMinutes = dayEndMin - dayStartMin
      const warnings: string[] = []

      for (const dayKey of Object.keys(workshopConfig.schedule)) {
        if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
        const sessions = workshopConfig.schedule[dayKey]

        // Sum all durations
        let totalMinutes = sessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0)

        if (totalMinutes > maxDayMinutes) {
          // Try to condense theory modules (from last to first) to reduce overflow
          const moduleDetailsMap = getModuleDetailsDict()
          for (let i = sessions.length - 1; i >= 0 && totalMinutes > maxDayMinutes; i--) {
            const s = sessions[i]
            if (!s.module) continue
            // Skip activity modules (9a-9h) — can't compress
            const modNum = s.module.replace(/^m/, '')
            if (modNum.startsWith('9')) continue
            // Skip already condensed
            if (s.version === 'condensed') continue
            // Skip breaks/custom
            if (s.type === 'break' || s.type === 'custom') continue

            const mod = moduleDetailsMap[modNum]
            if (!mod) continue

            const range = parseDurationRange(mod.duration)
            const fullDuration = s.duration || Math.round((range.lower + range.upper) / 2)
            const condensedDuration = Math.round(range.lower * 0.7)

            // Switch to condensed
            const saved = fullDuration - condensedDuration
            sessions[i] = { ...s, version: 'condensed', duration: condensedDuration }
            totalMinutes -= saved
          }

          // If still overflowing after condensing, add a warning
          if (totalMinutes > maxDayMinutes) {
            const overBy = totalMinutes - maxDayMinutes
            const dayNum = dayKey.replace('day', '')
            warnings.push(`Day ${dayNum} runs ~${overBy} minutes over schedule. Consider removing a session.`)
          }
        }
      }

      if (warnings.length > 0) {
        workshopConfig._warnings = warnings
      }

    }

    // POST-PROCESSING: Sync modules array with what's actually scheduled
    if (workshopConfig.schedule && Array.isArray(workshopConfig.modules)) {
      const scheduledModules = new Set<string>()
      for (const dayKey of Object.keys(workshopConfig.schedule)) {
        if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
        for (const s of workshopConfig.schedule[dayKey]) {
          if (s.module) scheduledModules.add(s.module.replace(/^m/, ''))
        }
      }
      workshopConfig.modules = workshopConfig.modules.filter((m: string) => scheduledModules.has(m))
    }

    // POST-PROCESSING: Convert start_date/end_date to formatted date string
    if (workshopConfig.start_date && workshopConfig.end_date) {
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December']
        return { month: months[date.getMonth()], day: date.getDate(), year: date.getFullYear() }
      }
      const start = formatDate(workshopConfig.start_date)
      const end = formatDate(workshopConfig.end_date)

      // Format as "Month Day-Day, Year" or "Month Day - Month Day, Year"
      if (start.month === end.month && start.year === end.year) {
        workshopConfig.date = `${start.month} ${start.day}-${end.day}, ${start.year}`
      } else {
        workshopConfig.date = `${start.month} ${start.day} - ${end.month} ${end.day}, ${end.year}`
      }
    }

    res.json(workshopConfig)
  } catch (error: any) {
    console.error('AI generate-workshop error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
