import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'

const router = Router()

// Initialize Anthropic client
const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set')
  }
  return new Anthropic({ apiKey })
}

// Module details for AI context
const MODULE_DETAILS: Record<number, { name: string; description: string; topics: string[]; duration: string }> = {
  0: {
    name: 'Introduction to FASTR',
    description: 'Overview of the FASTR methodology, why rapid-cycle analytics matters for RMNCAH-N programs.',
    topics: ['Introduction to FASTR approach', 'RMNCAH-N service use monitoring', 'Why rapid-cycle analytics'],
    duration: '45-60 min',
  },
  1: {
    name: 'Identify Questions & Indicators',
    description: 'How to identify priority analytical questions, develop data use cases, and prepare indicator frameworks.',
    topics: ['FASTR gaps and challenges', 'Development of data use case', 'Defining priority questions'],
    duration: '60-90 min',
  },
  2: {
    name: 'Data Extraction',
    description: 'Technical module on extracting data from DHIS2 and other health information systems.',
    topics: ['Why extract data', 'DHIS2 data structure', 'Data Downloader tool', 'API-based extraction'],
    duration: '90-120 min',
  },
  3: {
    name: 'FASTR Analytics Platform',
    description: 'Hands-on introduction to the FASTR Analytics Platform.',
    topics: ['Platform overview', 'Accessing the platform', 'Importing datasets', 'Running analysis modules'],
    duration: '120-180 min',
  },
  4: {
    name: 'Data Quality Assessment',
    description: 'Systematic approach to assessing data quality: completeness, outliers, internal consistency.',
    topics: ['Approach to DQA', 'Indicator completeness', 'Outlier detection', 'Internal consistency checks'],
    duration: '90-120 min',
  },
  5: {
    name: 'Data Quality Adjustment',
    description: 'Methods for adjusting data to account for quality issues before analysis.',
    topics: ['Approach to adjustment', 'Adjustment for outliers', 'Adjustment for completeness'],
    duration: '60-90 min',
  },
  6: {
    name: 'Data Analysis',
    description: 'Core analytical methods: service utilization trends, coverage estimation.',
    topics: ['Service utilization analysis', 'Year-over-year change', 'Coverage introduction', 'Interpreting outputs'],
    duration: '180-240 min',
  },
  7: {
    name: 'Results Communication',
    description: 'How to interpret findings, create visualizations, and communicate results.',
    topics: ['Analytical thinking', 'Data visualization principles', 'Using data for decisions'],
    duration: '90-120 min',
  },
  8: {
    name: 'Survey & HFA',
    description: 'Integration of survey data and health facility assessments with routine data.',
    topics: ['Survey data integration', 'Health facility assessments', 'Triangulating data sources'],
    duration: '60-90 min',
  },
  9: {
    name: 'Workshop Activities',
    description: 'Hands-on activities and exercises for workshop participants.',
    topics: ['Group exercises', 'Data interpretation activities', 'Country-specific work'],
    duration: '60-120 min',
  },
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
        module_number: { type: 'number', description: 'Module number (0-9)' },
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
    const availableMinutes = dayEnd - currentEnd
    return {
      fits: false,
      message: `Session would end at ${minutesToTime(newEnd)}, but day ends at ${minutesToTime(dayEnd)}. Only ${availableMinutes} minutes available. Consider adding to a different day or reducing duration.`
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
  const { day, module_number, version, duration, session_title, topic_range } = input
  const dayKey = `day${day}`

  if (!config.schedule[dayKey]) {
    config.schedule[dayKey] = []
  }

  const moduleInfo = MODULE_DETAILS[module_number]
  if (!moduleInfo) {
    return { success: false, message: `Module ${module_number} not found` }
  }

  // Check for overlapping topic ranges if this module already exists
  const existingRanges: Array<{start: number, end: number, day: string}> = []
  for (const d of Object.keys(config.schedule)) {
    if (!d.match(/^day\d+$/)) continue
    const sessions = config.schedule[d]
    if (!Array.isArray(sessions)) continue
    for (const s of sessions) {
      if (s.module === `m${module_number}`) {
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
    module: `m${module_number}`,
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

# CRITICAL: MODULE VERSIONS
Each module has TWO versions available:
- **FULL version**: Complete content with all slides and details. Takes 60-180 minutes depending on module.
- **CONDENSED version**: Key points only, shorter slides. Takes 30-60 minutes.

**RULES:**
1. NEVER add both versions of the same module - only ONE version per module
2. If user does not specify which version they want, ASK THEM before adding: "Would you like the full version (complete content, ~X minutes) or condensed version (key points only, ~Y minutes)?"
3. If user says "quick overview" or "high-level" → use condensed
4. If user says "detailed" or "comprehensive" or "full training" → use full
5. If unclear, default to asking

# AVAILABLE MODULES
${Object.entries(MODULE_DETAILS).map(([num, mod]) => `
## Module ${num}: ${mod.name}
- **Description**: ${mod.description}
- **Topics**: ${mod.topics.join(', ')}
- **Full duration**: ${mod.duration}
- **Condensed duration**: ~30-50% of full
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
- If you need to add a break in the middle of content, add the module ONCE, then add a break as a separate session`

    let currentMessages = messages
    let finalTextContent = ''
    const toolResults: Array<{ tool: string; result: any }> = []

    // Tool use loop - keep going until AI stops calling tools
    let maxIterations = 5
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

          console.log(`AI Tool: ${block.name}`, block.input, '→', result)

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

    const moduleNames = modules.map((m: number) => MODULE_DETAILS[m]?.name || `Module ${m}`).join(', ')

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
      const mod = MODULE_DETAILS[m]
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
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const client = getClient()

    const moduleList = Object.entries(MODULE_DETAILS)
      .map(([num, m]) => `  Module ${num}: ${m.name} - ${m.description} (${m.duration})`)
      .join('\n')

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: `You are an expert workshop planner for FASTR (Framework for Analytics of Service use Trends and Results) workshops focused on RMNCAH-N health data analysis.

Given a user's description of their workshop needs, generate a COMPLETE workshop configuration including the full schedule.

Available FASTR modules:
${moduleList}

IMPORTANT - MODULE VERSIONS:
Each module has TWO versions:
- "full": Complete content with all slides (longer duration)
- "condensed": Key points only (shorter duration, ~30-50% of full)

You MUST choose ONE version per module - NEVER include both versions of the same module.

How to decide:
- If user says "quick", "overview", "high-level", "introductory" → use "condensed"
- If user says "detailed", "comprehensive", "full training", "in-depth" → use "full"
- If user specifies short days (e.g., ends at 3:30pm) → prefer "condensed" to fit content
- If user has many days or long days → can use "full"
- Default to "full" if not specified and time permits

Generate a JSON object with this structure:
{
  "name": "FASTR Workshop - [Country]",
  "country": "Country name",
  "location": "City if mentioned, otherwise empty string",
  "days": 3,
  "day_start_time": "09:00",
  "day_end_time": "17:00",
  "module_version": "full",
  "objectives": "- Objective 1\\n- Objective 2\\n- Objective 3",
  "expected_outputs": "- Output 1\\n- Output 2\\n- Output 3",
  "modules": [0, 1, 2, 4, 5, 6, 7],
  "schedule": {
    "day1": [
      {"session": "Introduction to FASTR", "module": "m0", "version": "full", "duration": 60},
      {"session": "Tea Break", "type": "break", "duration": 15},
      {"session": "Identify Questions & Indicators", "module": "m1", "version": "full", "duration": 90}
    ],
    "day2": [
      {"session": "Data Extraction", "module": "m2", "version": "full", "duration": 90},
      {"session": "Lunch Break", "type": "break", "duration": 60}
    ]
  }
}

CRITICAL RULES:
1. NEVER include both "full" and "condensed" versions of the same module
2. All modules in a workshop should typically use the SAME version (all full OR all condensed)
3. Select modules that match the workshop focus (e.g., "data quality focus" = emphasize modules 4, 5)
4. Spread modules logically across days with breaks
5. Day 1 should include Module 0 (Introduction) FIRST
6. Add tea breaks (15min) mid-morning and mid-afternoon
7. Add lunch break around midday (default 60min, or as specified by user)
8. Calculate total daily content to fit within user-specified start and end times
9. ONLY two session types are allowed:
   - Module sessions: {"session": "Name", "module": "m0", "version": "full", "duration": 60}
   - Break sessions: {"session": "Tea Break", "type": "break", "duration": 15}
10. Do NOT use any other types like "discussion", "custom", etc.
11. objectives and expected_outputs should be strings with "- " bullets separated by newlines
12. Extract day_start_time and day_end_time from user prompt (e.g., "9am" = "09:00", "3:30pm" = "15:30")

Return ONLY valid JSON, no explanation.`,
      messages: [
        {
          role: 'user',
          content: prompt,
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
    res.json(workshopConfig)
  } catch (error: any) {
    console.error('AI generate-workshop error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
