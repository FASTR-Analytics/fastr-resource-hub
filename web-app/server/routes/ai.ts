import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  loadModulesRegistry,
  loadModuleMeta,
  type ActivityContext,
} from '../services/moduleRegistry.js'
import { generateDiagram, type DiagramRequest } from '../services/diagramTemplates.js'
import { saveCustomSlide } from '../db/database.js'

/** Canonical Claude model used across this route. */
const AI_MODEL = 'claude-sonnet-4-6'

/** Curated Lucide icon ids the AI may reference for diagram items.
 * Mirrors `client/src/lib/diagramIcons.ts` + `server/services/diagramIcons.ts`. */
const DIAGRAM_ICON_IDS = [
  'chart-bar', 'chart-line', 'chart-pie', 'database', 'search', 'table', 'calculator', 'file-spreadsheet',
  'hospital', 'heart-pulse', 'stethoscope', 'baby', 'pill', 'syringe', 'activity',
  'message-circle', 'megaphone', 'mail', 'mic', 'phone', 'send',
  'circle-check', 'triangle-alert', 'target', 'lightbulb', 'refresh-cw', 'key-round', 'arrow-right',
  'users', 'hand', 'graduation-cap',
] as const

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..')

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
function getModuleDetailsDict(language: 'en' | 'fr' | 'pt' = 'en'): Record<string, { name: string; description: string; topics: string[]; duration: string; activity?: ActivityContext }> {
  const modules = loadModulesRegistry()
  const dict: Record<string, { name: string; description: string; topics: string[]; duration: string; activity?: ActivityContext }> = {}
  for (const mod of modules) {
    if (mod.deprecated) continue  // Skip deprecated modules — never expose them to the AI
    if (!mod.ai_context) continue  // Skip modules without AI context
    const ai = mod.ai_context
    dict[mod.number] = {
      name: mod.name[language] || mod.name.en,
      description: ai?.description || '',
      topics: ai?.topics || [],
      duration: ai?.duration || '',
      activity: ai?.activity,
    }
  }
  return dict
}

// Detect if a prompt is for a French workshop
function detectLanguage(text: string): 'en' | 'fr' | 'pt' {
  const frenchPattern = /fran[cç]ais|atelier\s+FASTR|francophone|en\s+fran[cç]ais/i
  const francophoneCountries = /\b(Sénégal|Senegal|Burkina|Congo|Cameroun|Mali|Guinée|Guinee|Niger[^i]|Tchad|Chad|Bénin|Benin|Togo|Madagascar|Haïti|Haiti|Côte d'Ivoire|Cote d'Ivoire|Ivory Coast|Mauritani[ea]|Comor[eo]s|Djibouti|Gabon|Burundi|Rwanda)\b/i
  // Check if the prompt itself is in French (common French words)
  const frenchWords = /\b(jour|jours|journée|journées|pause|déjeuner|condensé|complet|créer|utiliser|inclure|pratique|théorique)\b/i
  if (frenchPattern.test(text) || francophoneCountries.test(text) || frenchWords.test(text)) {
    return 'fr'
  }
  return 'en'
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

// Per-day budget info returned by computeTimeBudget
interface DayBudget {
  day: number
  startTime: string
  endTime: string
  totalMinutes: number
  overheadMinutes: number
  availableMinutes: number
}

// Compute time budget: available time vs requested content (per-day resolution)
function computeTimeBudget(params: {
  days: number
  dayStartTime?: string
  dayEndTime?: string
  dayStartTimes?: Record<number, string>
  dayEndTimes?: Record<number, string>
  lunchDuration?: number
  requestedModules?: string[]
  moduleVersion?: 'full' | 'condensed'
}): { totalAvailableMinutes: number; requestedContentMinutes: number; overflowMinutes: number; perDayAvailable: number; perDayBudgets: DayBudget[]; budgetSummary: string } {
  const {
    days,
    dayStartTime = '09:00',
    dayEndTime = '17:00',
    dayStartTimes = {},
    dayEndTimes = {},
    lunchDuration = 60,
    requestedModules = [],
    moduleVersion = 'full',
  } = params

  const teaBreakOverhead = 30 // 2 x 15min tea breaks per day

  // Build per-day budgets
  const perDayBudgets: DayBudget[] = []
  let totalAvailableMinutes = 0

  for (let d = 1; d <= days; d++) {
    const start = dayStartTimes[d] || dayStartTime
    const end = dayEndTimes[d] || dayEndTime
    const dayLengthMinutes = timeToMinutes(end) - timeToMinutes(start)

    // Day 1: lunch + tea + welcome (~15min). Anything beyond a welcome (intros,
    // agenda, objectives, expectations, expected outputs) is up to the user to
    // request explicitly; do not pre-budget for them.
    // Day 2+: lunch + tea + recap/agenda ~20min
    const overhead = d === 1
      ? lunchDuration + teaBreakOverhead + 15
      : lunchDuration + teaBreakOverhead + 20

    const available = Math.max(0, dayLengthMinutes - overhead)
    totalAvailableMinutes += available

    perDayBudgets.push({
      day: d,
      startTime: start,
      endTime: end,
      totalMinutes: dayLengthMinutes,
      overheadMinutes: overhead,
      availableMinutes: available,
    })
  }

  const perDayAvailable = days === 1 ? perDayBudgets[0].availableMinutes : Math.round(totalAvailableMinutes / days)

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

  // Build per-day budget summary lines
  const dayLines = perDayBudgets.map(db =>
    `  Day ${db.day} (${db.startTime}–${db.endTime}): ${db.availableMinutes} min content available` +
    (db.day === 1 ? ' (after opening ceremonies + breaks)' : ' (after recap + breaks)')
  )

  const budgetSummary = [
    `Workshop: ${days} day(s)`,
    `Available content time: ${totalAvailableMinutes} min (~${Math.round(totalAvailableMinutes / 60)}h)`,
    ...dayLines,
    `Requested content: ${requestedContentMinutes} min (~${Math.round(requestedContentMinutes / 60)}h)`,
    ...moduleBreakdown,
    overflowMinutes > 0
      ? `⚠ OVERFLOW: ${overflowMinutes} min (~${Math.round(overflowMinutes / 60)}h) over budget. Must condense or remove modules.`
      : `✓ Content fits within available time (${totalAvailableMinutes - requestedContentMinutes} min buffer).`,
    `Average content per day: ~${perDayAvailable} min`,
  ].join('\n')

  return { totalAvailableMinutes, requestedContentMinutes, overflowMinutes, perDayAvailable, perDayBudgets, budgetSummary }
}

// AI Tools for modifying the deck
const AI_TOOLS: Anthropic.Tool[] = [
  {
    name: 'add_module',
    description: 'Add a module (or part of a module) to the workshop deck. Most modules have a "full" version only; the methodology theory modules (m4, m5, m6, m8) also have a "condensed" version. You can split a module across multiple sessions by specifying different topic ranges.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to add the module to (1, 2, 3, etc.)' },
        module_number: { type: 'string', description: 'Module number/ID. Theory: "0", "1", "2", "3" (Platform), "3b" (AI Assistant), "4" (DQA), "5" (DQ Adjustment), "6" (Data Analysis), "8" (Survey & HFA). Results communication: "7a" (Analytical thinking), "7b" (Data viz), "7c" (Audience), "7d" (Storytelling), "7e" (Linking to actions), "7f" (Roadmap). Hands-on activities: "9a" (Instance Setup), "9b" (Getting Started), "9c" (Visualizations), "9d" (Slide Decks), "9e" (Disruption Report), "9f" (Prompting), "9g" (Quiz), "9h" (Platform Demo).' },
        version: { type: 'string', enum: ['full', 'condensed'], description: 'Which version: "full" or "condensed". MUST be specified.' },
        duration: { type: 'number', description: 'Duration in minutes' },
        session_title: { type: 'string', description: 'Custom title for this session (e.g., "Data Quality Part 1"). If not specified, uses module name.' },
        presenter: { type: 'string', description: 'Name(s) of the facilitator/presenter for this session (e.g., "Claire Boulange" or "Kirsten Sebold, Daniel Kamara"). Shown in the agenda Facilitator column and on the section cover slide. REQUIRED whenever the user has named a presenter/facilitator for this session — never drop it.' },
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
        presenter: { type: 'string', description: 'Name(s) of the facilitator/presenter for this session. Shown in the agenda Facilitator column. REQUIRED whenever the user has named a presenter/facilitator for this session — never drop it.' },
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
        module_number: { type: 'string', description: 'Module number/ID. Theory: "0"–"6", "8", "3b" (AI). Results communication sub-modules: "7a"–"7f". Activities: "9a"–"9h".' },
        topic_number: { type: 'number', description: 'Topic number within the module (1-indexed)' },
        version: { type: 'string', enum: ['full', 'condensed'], description: 'Which version: "full" or "condensed"' },
      },
      required: ['day', 'session_position', 'module_number', 'topic_number', 'version'],
    },
  },
  {
    name: 'add_custom_slide',
    description: 'Add a freeform content slide with an H1 title and bullets (or body paragraph). Use this for country-specific framings, discussion prompts, quotes, or anything that doesn\'t fit an existing module. The result is an editable session on the chosen day.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Day number (1-indexed)' },
        title: { type: 'string', description: 'Slide title (becomes the H1)' },
        bullets: {
          type: 'array',
          items: { type: 'string' },
          description: 'Optional list of bullet points. Each bullet should be a single sentence or short phrase.',
        },
        body: {
          type: 'string',
          description: 'Optional body paragraph (used when bullets are not provided, or to introduce them).',
        },
        duration: { type: 'number', description: 'Duration in minutes. Default 10.' },
      },
      required: ['day', 'title'],
    },
  },
  {
    name: 'add_diagram',
    description: `Create a diagram using a pre-built template and insert it as a content slide on a day. The diagram is rendered server-side to SVG and shows up as a slide with the title as H1 and the diagram below.

Pick the template that fits the content:
- stepper: numbered vertical steps (workflow phases)
- chevron: horizontal colored bars (progressive stages)
- cards: side-by-side cards with icon + title + body (comparison of options)
- comparison: two-panel side-by-side (do/don't, before/after) — uses cards-style input
- flow: horizontal arrows between boxes (linear process)
- layers: nested rectangles (concentric levels of an idea)
- hub: central concept with radiating spokes (one idea + facets)
- timeline: horizontal milestones (events over time)

For diagram items that support an icon, use a Lucide id from the curated catalog (see catalog list in the system prompt). Plain text labels are also fine; the diagram renderer will show them.`,
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Day number (1-indexed)' },
        template: {
          type: 'string',
          enum: ['stepper', 'chevron', 'cards', 'comparison', 'flow', 'layers', 'hub', 'timeline'],
          description: 'Diagram template type',
        },
        slide_title: { type: 'string', description: 'Slide title (becomes the H1 above the diagram)' },
        items: {
          type: 'array',
          description: 'Diagram items. Shape varies slightly by template. For stepper/flow: {title, description}. For chevron: {line1, line2, icon}. For cards/comparison: {title, body, icon, footer}. For layers: {label}. For hub: {label, description, icon}. For timeline: {label, date, description}.',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              label: { type: 'string' },
              line1: { type: 'string' },
              line2: { type: 'string' },
              description: { type: 'string' },
              body: { type: 'array', items: { type: 'string' } },
              question: { type: 'string' },
              footer: { type: 'string' },
              quote: { type: 'string' },
              items: { type: 'string' },
              symbol: { type: 'string' },
              date: { type: 'string' },
              icon: {
                type: 'string',
                description: 'Optional Lucide icon id from the curated catalog. Use one of: ' + DIAGRAM_ICON_IDS.join(', '),
              },
            },
          },
        },
        center: {
          type: 'object',
          description: 'For the hub template only — the central node. {label, description, icon}.',
          properties: {
            label: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
          },
        },
        duration: { type: 'number', description: 'Duration in minutes. Default 5.' },
      },
      required: ['day', 'template', 'slide_title'],
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
  const { day, version, duration, session_title, topic_range, presenter } = input
  const module_number = String(input.module_number)  // Normalize to string
  const dayKey = `day${day}`

  if (!config.schedule[dayKey]) {
    config.schedule[dayKey] = []
  }

  const moduleInfo = getModuleDetailsDict()[module_number]
  if (!moduleInfo) {
    // Map common stale references to their replacements so the AI can recover.
    if (module_number === '7') {
      return {
        success: false,
        message: `Module 7 was split into six sub-modules: 7a Analytical thinking, 7b Data visualization, 7c Understanding audience, 7d Storytelling, 7e Linking results to actions, 7f Roadmap. Call add_module again with one of "7a"–"7f".`,
      }
    }
    if (module_number === '9i') {
      return {
        success: false,
        message: `Module 9i (Standard FASTR Reports) was retired and its content merged into Module 9e (Disruption Report). Call add_module again with "9e".`,
      }
    }
    const validIds = Object.keys(getModuleDetailsDict()).sort()
    return {
      success: false,
      message: `Module ${module_number} not found. Valid module numbers: ${validIds.join(', ')}.`,
    }
  }

  // Build module ID: "m" + number (e.g., "m0", "m9a", "m3b")
  const moduleId = `m${module_number}`

  // Guard: condensed is only available for m4, m5, m6, m8. For everything
  // else, force the version back to "full" — there is no condensed deck.
  const MODULES_WITH_CONDENSED = new Set(['4', '5', '6', '8'])
  let effectiveVersion: 'full' | 'condensed' = version
  if (version === 'condensed' && !MODULES_WITH_CONDENSED.has(module_number)) {
    effectiveVersion = 'full'
  }

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

  const sessionDuration = duration || (effectiveVersion === 'condensed' ? 45 : 90)

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
    version: effectiveVersion,
    topic_range: topic_range || null,  // null means all topics
    duration: sessionDuration,
    ...(presenter ? { speaker: presenter } : {}),
  })

  const rangeMsg = topic_range ? ` (topics ${topic_range.start}-${topic_range.end})` : ''
  const presenterMsg = presenter ? ` (presenter: ${presenter})` : ''
  const downgradeMsg = (version === 'condensed' && effectiveVersion === 'full')
    ? ` (note: condensed not available for m${module_number} — using full)` : ''
  return { success: true, message: `Added ${effectiveVersion} version of Module ${module_number}: ${moduleInfo.name}${rangeMsg}${presenterMsg}${downgradeMsg} to Day ${day}` }
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
  const { day, session_name, duration, presenter } = input
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
    ...(presenter ? { speaker: presenter } : {}),
  })

  const presenterMsg = presenter ? ` (presenter: ${presenter})` : ''
  return { success: true, message: `Added "${session_name}" (${duration}min)${presenterMsg} to Day ${day}` }
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

// ─────────────────────────────────────────────────────────────────────────────
// Async executors (custom slide + diagram) — these write to disk + DB
// ─────────────────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'slide'
}

async function executeAddCustomSlide(
  config: any,
  input: any,
  workshopId: string,
): Promise<{ success: boolean; message: string }> {
  if (!workshopId) {
    return { success: false, message: 'No workshop is currently open (workshopId missing).' }
  }
  const { day, title, bullets, body, duration } = input
  const dayKey = `day${day}`
  if (!config.schedule[dayKey]) config.schedule[dayKey] = []

  const dur = typeof duration === 'number' ? duration : 10
  const fit = validateSessionFits(config, day, dur)
  if (!fit.fits) return { success: false, message: fit.message! }

  // Build Marp markdown. H1 + optional body + optional bullets.
  const parts: string[] = ['---', 'marp: true', 'theme: fastr', 'paginate: true', '---', '', `# ${title}`, '']
  if (body) parts.push(body, '')
  if (Array.isArray(bullets) && bullets.length > 0) {
    for (const b of bullets) parts.push(`- ${b}`)
    parts.push('')
  }
  const markdown = parts.join('\n')
  const filename = `custom_${slugify(title)}_${Date.now()}.md`

  try {
    await saveCustomSlide(workshopId, filename, markdown)
  } catch (err: any) {
    return { success: false, message: `Failed to save slide: ${err.message}` }
  }

  addSessionToDay(config, dayKey, {
    _id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    session: title,
    // No `type` — keep the session editable (not a locked compulsory).
    slides: [`custom_slides/${filename}`],
    duration: dur,
  })

  return { success: true, message: `Added custom slide "${title}" (${dur}min) to Day ${day}` }
}

/**
 * Adapt the AI's normalized item array (where each item may carry any of
 * `title | label | line1 | line2 | description | body | icon | …`) to the
 * per-template DiagramRequest shape that `generateDiagram` expects.
 *
 * Key mapping: the AI passes `icon` (Lucide id from the curated catalog) but
 * the diagram templates' internal field is still called `emoji` for backwards
 * compat with legacy data. We rename `icon` → `emoji` here.
 */
function adaptDiagramRequest(template: string, items: any[], center: any): any {
  const safeItems = Array.isArray(items) ? items : []
  // Helper: pick the first defined string from a field list
  const pick = (obj: any, ...keys: string[]): string | undefined => {
    for (const k of keys) {
      if (typeof obj?.[k] === 'string' && obj[k].trim()) return obj[k]
    }
    return undefined
  }
  const iconOf = (obj: any) => obj?.icon || obj?.emoji

  switch (template) {
    case 'stepper':
      return {
        template,
        items: safeItems.map(i => ({
          title: pick(i, 'title', 'label', 'line1') || '',
          description: pick(i, 'description', 'body', 'line2') || '',
        })),
      }
    case 'chevron':
      return {
        template,
        items: safeItems.map(i => ({
          line1: pick(i, 'line1', 'title', 'label') || '',
          line2: pick(i, 'line2', 'description', 'body'),
          emoji: iconOf(i),
        })),
      }
    case 'cards':
      return {
        template,
        cards: safeItems.map(i => ({
          emoji: iconOf(i) || '',
          title: pick(i, 'title', 'label') || '',
          question: pick(i, 'question'),
          body: Array.isArray(i.body) ? i.body : i.description ? [i.description] : [],
          footer: pick(i, 'footer'),
        })),
      }
    case 'comparison': {
      const [leftRaw, rightRaw] = safeItems
      const buildSide = (r: any) => ({
        title: pick(r, 'title', 'label') || '',
        symbol: pick(r, 'symbol'),
        quote: pick(r, 'quote'),
        items: Array.isArray(r?.body) ? r.body : Array.isArray(r?.items) ? r.items : r?.description ? [r.description] : [],
        footer: pick(r, 'footer'),
      })
      return { template, left: buildSide(leftRaw || {}), right: buildSide(rightRaw || {}) }
    }
    case 'flow':
      return {
        template,
        nodes: safeItems.map(i => ({
          emoji: iconOf(i),
          title: pick(i, 'title', 'label') || '',
          description: Array.isArray(i.body) ? i.body : i.description ? [i.description] : [],
        })),
      }
    case 'layers':
      return {
        template,
        layers: safeItems.map(i => ({
          label: pick(i, 'label', 'title') || '',
          subtitle: pick(i, 'subtitle', 'description'),
          question: pick(i, 'question'),
          frequency: pick(i, 'frequency'),
        })),
      }
    case 'hub':
      return {
        template,
        center: {
          label: pick(center || {}, 'label', 'title') || '',
          description: pick(center || {}, 'description'),
          emoji: iconOf(center || {}),
        },
        spokes: safeItems.map(i => ({
          label: pick(i, 'label', 'title') || '',
          description: pick(i, 'description'),
          emoji: iconOf(i),
        })),
      }
    case 'timeline':
      return {
        template,
        steps: safeItems.map(i => ({
          title: Array.isArray(i.title) ? i.title : i.title ? [i.title] : i.label ? [i.label] : [],
          description: Array.isArray(i.description) ? i.description : i.description ? [i.description] : [],
        })),
      }
    default:
      return { template, items: safeItems }
  }
}

async function executeAddDiagram(
  config: any,
  input: any,
  workshopId: string,
): Promise<{ success: boolean; message: string }> {
  if (!workshopId) {
    return { success: false, message: 'No workshop is currently open (workshopId missing).' }
  }
  const { day, template, slide_title, items, center, duration } = input
  const dayKey = `day${day}`
  if (!config.schedule[dayKey]) config.schedule[dayKey] = []

  const dur = typeof duration === 'number' ? duration : 5
  const fit = validateSessionFits(config, day, dur)
  if (!fit.fits) return { success: false, message: fit.message! }

  // Adapt the AI's normalized item array to the per-template DiagramRequest
  // shape, mapping `icon` → `emoji` so the curated Lucide ids reach the
  // rendering layer.
  const diagramReq = adaptDiagramRequest(template, items, center) as DiagramRequest

  let svg: string
  try {
    svg = generateDiagram(diagramReq)
  } catch (err: any) {
    return { success: false, message: `Diagram generation failed: ${err.message}` }
  }

  // Save SVG to disk
  const slug = slugify(slide_title)
  const svgName = `${slug}_${Date.now()}.svg`
  const svgDir = path.join(REPO_ROOT, 'resources/diagrams')
  fs.mkdirSync(svgDir, { recursive: true })
  fs.writeFileSync(path.join(svgDir, svgName), svg, 'utf-8')
  const svgRelPath = `resources/diagrams/${svgName}`

  // Build slide markdown wrapping the SVG inline (same shape as the manual flow)
  const markdown = [
    '---',
    'marp: true',
    'theme: fastr',
    'paginate: true',
    '---',
    '',
    `# ${slide_title}`,
    '',
    `![h:500](../../${svgRelPath})`,
    '',
  ].join('\n')
  const slideFilename = `diagram_${slug}_${Date.now()}.md`
  try {
    await saveCustomSlide(workshopId, slideFilename, markdown)
  } catch (err: any) {
    return { success: false, message: `Failed to save diagram slide: ${err.message}` }
  }

  addSessionToDay(config, dayKey, {
    _id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    session: slide_title,
    slides: [`custom_slides/${slideFilename}`],
    duration: dur,
  })

  return { success: true, message: `Added diagram "${slide_title}" (${template}) to Day ${day}` }
}

async function executeTool(
  toolName: string,
  input: any,
  config: any,
  workshopId: string,
): Promise<{ success: boolean; message: string }> {
  switch (toolName) {
    case 'add_module':
      return executeAddModule(config, input)
    case 'add_break':
      return executeAddBreak(config, input)
    case 'add_custom_session':
      return executeAddCustomSession(config, input)
    case 'add_custom_slide':
      return await executeAddCustomSlide(config, input, workshopId)
    case 'add_diagram':
      return await executeAddDiagram(config, input, workshopId)
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
    const { messages, workshopConfig, workshopId } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' })
    }

    if (!workshopConfig) {
      return res.status(400).json({ error: 'Workshop config required - please select a workshop first' })
    }

    if (!workshopId || typeof workshopId !== 'string') {
      return res.status(400).json({ error: 'workshopId required for tools that save slides to this workshop' })
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
FASTR (Frequent Assessments and System Tools for Resilience) is the GFF approach to rapid-cycle analytics and data use, supporting country-led efforts to improve the timely use of RMNCAH-N program data from DHIS2.

# MODULE TYPES
There are two categories of modules:

## Theory Modules
Conceptual/methodological content:
- **Modules 4, 5, 6, 8** (methodology): have BOTH a "full" version (60-180 min, all slides) and a "condensed" version (30-60 min, key points).
- **Modules 0, 1, 2, 3, 3b** and **7a–7f**: "full" version ONLY. There is no condensed deck for these — calling add_module with version: "condensed" on any of them will be downgraded to full. Shorten by dropping topics or whole modules instead.

## Activity Modules (9a–9h)
Hands-on platform activities and exercises. Only have FULL version (use version: "full").
These are CRITICAL for practical workshops — always pair theory with activities.

## Retired / renamed modules — IMPORTANT
- **Module 7** was split into six sub-modules: 7a (Analytical thinking & interpretation), 7b (Data visualization), 7c (Understanding your audience), 7d (Storytelling with data), 7e (Linking results to actions), 7f (Roadmap for sustained use). If the user says "Module 7", clarify which sub-module(s) they want.
- **Module 9i** (Standard FASTR Reports) was retired. Its unique content was merged into **Module 9e** (Disruption Report) — including the report-structure overview, title-as-finding rule, and report-settings reference. If the user asks for 9i, offer 9e instead.

**RULES:**
1. NEVER add both full and condensed versions of the same module
2. If user does not specify version for theory modules, ASK before adding
3. "quick overview" or "high-level" → use condensed FOR MODULES 4/5/6/8 ONLY. Other modules stay "full" — shorten by dropping topics or whole modules, never by flipping their version to "condensed" (they don't have one).
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
${mod.activity ? `- **Activity covers**: ${mod.activity.covers}` +
  (mod.activity.outcomes?.length ? `\n- **Outcomes**: ${mod.activity.outcomes.join('; ')}` : '') +
  (mod.activity.order ? `\n- **Sequence order**: ${mod.activity.order}` : '') +
  (mod.activity.prerequisites?.length ? `\n- **Prerequisites**: ${mod.activity.prerequisites.join(', ')}` : '') +
  (mod.activity.ai_notes ? `\n- **Facilitation notes**: ${mod.activity.ai_notes}` : '') + '\n' : ''}${/^[4568]$/.test(num) ? '- **Has condensed version**: yes (~30-50% of full)' : /^9/.test(num) ? '- **Type**: Hands-on activity (full only)' : '- **Has condensed version**: no (full only)'}
`).join('\n')}

# CURRENT WORKSHOP
${JSON.stringify(workingConfig, null, 2)}

# YOUR CAPABILITIES
You can use tools to:
1. **add_module** - Add a module (must specify version: "full" or "condensed"). Can use topic_range to split.
2. **add_break** - Add tea or lunch breaks
3. **add_custom_session** - Add a placeholder session by name + duration (no slides attached). Use for opening remarks, country presentations, group discussions — anything that lives outside the slide deck.
4. **add_custom_slide** - Add a freeform content slide (H1 + bullets and/or body paragraph). Use this when the user wants a quick text slide that doesn't fit an existing module.
5. **add_diagram** - Create a diagram (stepper, chevron, cards, comparison, flow, layers, hub, timeline) and insert it as a content slide. The diagram is rendered server-side to SVG and embedded under the slide title.
6. **update_workshop_settings** - Fill in workshop objectives and settings
7. **move_session** - Move a session within a day (reorder)
8. **move_session_to_day** - Move a session from one day to another
9. **remove_session** - Remove a session from the deck
10. **restructure_schedule** - Change the number of days (e.g., compress 4 days to 3)
11. **remove_day** - Remove an entire day (subsequent days shift down)
12. **add_topic_to_session** - Add one specific topic from a module to an existing session (use when extending a session, not creating a new one)

# DIAGRAM ICON CATALOG
When using \`add_diagram\` with templates that take icons on items (chevron, cards, hub, timeline), use a Lucide icon id from this curated set — never an emoji and never an arbitrary string. The renderer maps the id to an inline Lucide SVG in FASTR deep green.

Available icon ids, grouped by theme:
- **Data**: chart-bar, chart-line, chart-pie, database, search, table, calculator, file-spreadsheet
- **Health**: hospital, heart-pulse, stethoscope, baby, pill, syringe, activity
- **Communication**: message-circle, megaphone, mail, mic, phone, send
- **Actions / status**: circle-check, triangle-alert, target, lightbulb, refresh-cw, key-round, arrow-right
- **People / process**: users, hand, graduation-cap

Pick the icon that best matches the item's meaning. For "Completeness check" use \`circle-check\`; for "Outliers" use \`triangle-alert\`; for "Coverage rate" use \`chart-line\`. If nothing fits, leave \`icon\` out — a text-only diagram is fine.

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
- **Follow the user's session list exactly.** When the user provides a numbered list of sessions (e.g., "1. Welcome, 2. Module X, 3. Break, ..."), build exactly that list and nothing else. Do NOT add framing sessions the user did not ask for: no separate "Introductions", "Day 1 Agenda", "Workshop Objectives", "Expectations", "Expected Outputs", "End of Day", "Logistics", "Opening Remarks", or generic recap/closing sessions. The user's Welcome session IS the opening; the user's wrap-up session IS the close. If you find yourself about to add a session that is NOT in the user's numbered list, STOP — re-read the list and add only what is there.
- **Do NOT collapse separate module sessions into a single combined session.** If the user names "FASTR overview (m0)", "DQA (m4)", "DQ adjustment (m5)", and "Service utilization (m6)" as four distinct rows, you MUST issue four separate \`add_module\` calls — one per module — never one custom session named "FASTR Introduction & HMIS Methods Recap" that conflates them.
- **Presenters/facilitators are mandatory when the user lists them.** When the user provides a "Presenter" or "Facilitator" column in their agenda, or names presenters per session, you MUST pass the \`presenter\` parameter on EVERY \`add_module\` and \`add_custom_session\` call. Map each session to its presenter from the user's table. If a session is a break, no presenter is needed. If the user lists multiple presenters for one session (e.g., "Kirsten Sebold, Daniel Kamara, Rachel Neill"), pass the full comma-separated string. Do not silently drop the presenter argument.

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
        model: AI_MODEL,
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

          // Execute the tool (some are async — write SVGs to disk + DB)
          const result = await executeTool(block.name, block.input, workingConfig, workshopId)
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
      model: AI_MODEL,
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
      model: AI_MODEL,
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
- Day 1 starts with a single Welcome session (~15 min). Do not add separate Introductions, Day 1 Agenda, Workshop Objectives, Expectations, Expected Outputs sessions unless the user has explicitly asked for them.
- Include tea breaks (15min) mid-morning and mid-afternoon
- Include lunch break (60min) around 12:30-13:30
- End each day at the user's specified end time
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
      model: AI_MODEL,
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

// ─────────────────────────────────────────────────────────────────────────────
// Shared post-processing for AI-generated workshop configs
// ─────────────────────────────────────────────────────────────────────────────
function postProcessWorkshopConfig(
  workshopConfig: any,
  workshopLanguage: 'en' | 'fr' | 'pt',
  fallbackStartTime: string = '09:00',
  fallbackEndTime: string = '17:00',
  fallbackDayStartTimes: Record<number, string> = {},
  fallbackDayEndTimes: Record<number, string> = {},
): void {
  if (!workshopConfig.schedule) return

  // Pass 0: Force version='full' on any session whose module has no condensed
  // variant. The model occasionally ignores the system-prompt rule and stamps
  // "condensed" everywhere; this guard makes the result correct regardless.
  // Modules that DO have a condensed deck: m4, m5, m6, m8.
  const MODULES_WITH_CONDENSED = new Set(['m4', 'm5', 'm6', 'm8'])
  for (const dayKey of Object.keys(workshopConfig.schedule)) {
    if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
    for (const session of workshopConfig.schedule[dayKey]) {
      if (session?.module && session?.version === 'condensed' && !MODULES_WITH_CONDENSED.has(session.module)) {
        session.version = 'full'
      }
    }
  }

  // Pass 1-2: Remove duplicate modules
  const seenModules = new Set<string>()
  for (const dayKey of Object.keys(workshopConfig.schedule)) {
    if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
    const sessions = workshopConfig.schedule[dayKey]
    const toRemove = new Set<number>()
    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i]
      if (!session.module) continue
      const moduleKey = session.module
      if (seenModules.has(moduleKey)) {
        toRemove.add(i)
      } else {
        seenModules.add(moduleKey)
      }
    }
    workshopConfig.schedule[dayKey] = sessions.filter((_: any, i: number) => !toRemove.has(i))

    // Helpers
    const lunchPattern = /lunch|déjeuner|dejeuner|dîner|diner|midi/i
    const isLunch = (s: any) => s?.type === 'break' && lunchPattern.test(s?.session || '')
    const isTeaBreak = (s: any) => s?.type === 'break' && !lunchPattern.test(s?.session || '')

    // Pass 3: Remove consecutive tea breaks
    const cleaned: any[] = []
    for (const session of workshopConfig.schedule[dayKey]) {
      const lastSession = cleaned[cleaned.length - 1]
      if (isTeaBreak(session) && lastSession?.type === 'break') continue
      cleaned.push(session)
    }
    workshopConfig.schedule[dayKey] = cleaned

    // Pass 4: Remove trailing tea breaks
    while (workshopConfig.schedule[dayKey].length > 0) {
      const lastSession = workshopConfig.schedule[dayKey][workshopConfig.schedule[dayKey].length - 1]
      if (isTeaBreak(lastSession)) {
        workshopConfig.schedule[dayKey].pop()
      } else {
        break
      }
    }

    // Pass 5: Ensure each day has a lunch break
    const hasLunch = workshopConfig.schedule[dayKey].some((s: any) => isLunch(s))
    if (!hasLunch && workshopConfig.schedule[dayKey].length > 0) {
      const sess = workshopConfig.schedule[dayKey]
      const middleIndex = Math.floor(sess.length / 2)
      sess.splice(middleIndex, 0, {
        session: workshopLanguage === 'fr' ? 'Pause déjeuner' : 'Lunch Break',
        type: 'break',
        duration: workshopConfig.lunch_duration || 60
      })
    }
  }

  // Pass 6: Ensure no non-optional sessions appear after day_end
  for (const dayKey of Object.keys(workshopConfig.schedule)) {
    if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
    const sessions = workshopConfig.schedule[dayKey]
    const dayEndIndex = sessions.findIndex((s: any) => s.type === 'day_end')
    if (dayEndIndex >= 0 && dayEndIndex < sessions.length - 1) {
      const afterEnd = sessions.slice(dayEndIndex + 1)
      const optionalSessions = afterEnd.filter((s: any) => s.optional)
      sessions.splice(dayEndIndex + 1)
      if (optionalSessions.length > 0) {
        sessions.push(...optionalSessions)
      }
    }
  }

  // Pass 7: Ensure no breaks at the very start of a day
  for (const dayKey of Object.keys(workshopConfig.schedule)) {
    if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
    const sessions = workshopConfig.schedule[dayKey]
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
      if (isLunchBreak(session)) {
        lunchCount++
        if (lunchCount > 1) continue
      }
      if (isNonLunchBreak(session) && prev && isNonLunchBreak(prev)) continue
      cleaned.push(session)
    }
    workshopConfig.schedule[dayKey] = cleaned
  }

  // Pass 9: Per-day overflow detection and auto-condensing
  const warnings: string[] = []
  for (const dayKey of Object.keys(workshopConfig.schedule)) {
    if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
    const dayNum = parseInt(dayKey.replace('day', ''))
    const sessions = workshopConfig.schedule[dayKey]

    const thisDayStart = workshopConfig.day_start_times?.[dayNum] || workshopConfig.day_start_times?.[String(dayNum)] ||
      workshopConfig.day_start_time || fallbackDayStartTimes[dayNum] || fallbackStartTime
    const thisDayEnd = workshopConfig.day_end_times?.[dayNum] || workshopConfig.day_end_times?.[String(dayNum)] ||
      workshopConfig.day_end_time || fallbackDayEndTimes[dayNum] || fallbackEndTime
    const maxDayMinutes = timeToMinutes(thisDayEnd) - timeToMinutes(thisDayStart)

    let totalMinutes = sessions
      .filter((s: any) => !s.optional)
      .reduce((sum: number, s: any) => sum + (s.duration || 0), 0)

    if (totalMinutes > maxDayMinutes) {
      const moduleDetailsMap = getModuleDetailsDict()
      // Auto-condensing only works for modules that actually have a condensed
      // deck (the methodology modules). For everything else, the overflow is
      // resolved by dropping topics or whole modules upstream — never by
      // setting "condensed" on a module that doesn't have one.
      const HAS_CONDENSED_DECK = new Set(['4', '5', '6', '8'])
      for (let i = sessions.length - 1; i >= 0 && totalMinutes > maxDayMinutes; i--) {
        const s = sessions[i]
        if (!s.module) continue
        const modNum = s.module.replace(/^m/, '')
        if (!HAS_CONDENSED_DECK.has(modNum)) continue
        if (s.version === 'condensed') continue
        if (s.type === 'break' || s.type === 'custom') continue
        const mod = moduleDetailsMap[modNum]
        if (!mod) continue
        const range = parseDurationRange(mod.duration)
        const fullDuration = s.duration || Math.round((range.lower + range.upper) / 2)
        const condensedDuration = Math.round(range.lower * 0.7)
        const saved = fullDuration - condensedDuration
        sessions[i] = { ...s, version: 'condensed', duration: condensedDuration }
        totalMinutes -= saved
      }

      // Still over after condensing (e.g. activity-heavy days, where m9
      // activities can't be compressed) → drop the lowest-priority TRAILING
      // module sessions until it fits. Keep breaks and custom placeholders
      // (opening reflection, way-forward, country presentations).
      if (totalMinutes > maxDayMinutes) {
        const dropped: string[] = []
        for (let i = sessions.length - 1; i >= 0 && totalMinutes > maxDayMinutes; i--) {
          const s = sessions[i]
          if (!s.module || s.type === 'break' || s.type === 'custom') continue
          totalMinutes -= (s.duration || 0)
          dropped.unshift(s.session || `Module ${s.module}`)
          sessions.splice(i, 1)
        }
        if (dropped.length) {
          if (workshopLanguage === 'fr') {
            warnings.push(`Jour ${dayNum} : ${dropped.length} session(s) retirée(s) pour tenir dans l'horaire — ${dropped.join(', ')}. Rajoutez-les au besoin.`)
          } else {
            warnings.push(`Day ${dayNum}: dropped ${dropped.length} session(s) to fit the schedule — ${dropped.join(', ')}. Re-add any you need.`)
          }
        }
        if (totalMinutes > maxDayMinutes) {
          const overBy = totalMinutes - maxDayMinutes
          if (workshopLanguage === 'fr') {
            warnings.push(`Jour ${dayNum} dépasse encore l'horaire de ~${overBy} minutes.`)
          } else {
            warnings.push(`Day ${dayNum} still runs ~${overBy} minutes over after trimming.`)
          }
        }
      }
    }
  }

  if (warnings.length > 0) {
    workshopConfig._warnings = warnings
  }

  // Build modules array from what's actually scheduled
  const scheduledModules = new Set<string>()
  for (const dayKey of Object.keys(workshopConfig.schedule)) {
    if (!dayKey.startsWith('day') || !Array.isArray(workshopConfig.schedule[dayKey])) continue
    for (const s of workshopConfig.schedule[dayKey]) {
      if (s.module) scheduledModules.add(s.module.replace(/^m/, ''))
    }
  }
  workshopConfig.modules = Array.from(scheduledModules).sort((a, b) => {
    const aNum = parseInt(a) || 0
    const bNum = parseInt(b) || 0
    if (aNum !== bNum) return aNum - bNum
    return a.localeCompare(b)
  })

  // Convert start_date/end_date to formatted date string
  if (workshopConfig.start_date && workshopConfig.end_date) {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr)
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December']
      return { month: months[date.getMonth()], day: date.getDate(), year: date.getFullYear() }
    }
    const start = formatDate(workshopConfig.start_date)
    const end = formatDate(workshopConfig.end_date)
    if (start.month === end.month && start.year === end.year) {
      workshopConfig.date = `${start.month} ${start.day}-${end.day}, ${start.year}`
    } else {
      workshopConfig.date = `${start.month} ${start.day} - ${end.month} ${end.day}, ${end.year}`
    }
  }

  workshopConfig.language = workshopLanguage
}

// POST /api/ai/generate-workshop - Generate complete workshop config from natural language
router.post('/generate-workshop', async (req, res) => {
  try {
    const { prompt, clarifications } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const client = getClient()

    // Detect workshop language from prompt + clarifications
    const allText = clarifications
      ? `${prompt} ${clarifications.map((c: any) => `${c.question} ${c.answer}`).join(' ')}`
      : prompt
    const workshopLanguage = detectLanguage(allText)

    const moduleList = Object.entries(getModuleDetailsDict(workshopLanguage))
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
        model: AI_MODEL,
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
- If the user requests modules whose total duration clearly exceeds the available time, you MUST include a question warning them: "You've requested approximately Xh of content but only have ~Yh available. Would you like to: (a) use condensed versions for the methodology modules (4/5/6/8) that have one, (b) prioritize certain modules and drop others, or (c) add more days?"
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
    const daysMatch = enrichedPrompt.match(/(\d+)\s*[-–]?\s*days?/i) || enrichedPrompt.match(/(\d+)\s*jours?/i)
    const extractedDays = daysMatch ? parseInt(daysMatch[1]) : 3
    const startTimeMatch = enrichedPrompt.match(/start\s*(?:at\s*)?(\d{1,2}[:.]\d{2})/i)
    const endTimeMatch = enrichedPrompt.match(/end\s*(?:at\s*|by\s*)?(\d{1,2}[:.]\d{2})/i)
    const extractedStartTime = startTimeMatch ? startTimeMatch[1].replace('.', ':') : '09:00'
    const extractedEndTime = endTimeMatch ? endTimeMatch[1].replace('.', ':') : '17:00'
    const isCondensed = /condensed|quick|overview|high-level|shorter|introductory/i.test(enrichedPrompt)

    // Extract per-day start/end times from prompt
    // Patterns: "Day 1: 08:30-17:00", "Jour 1: 08:30", "Day 1 starts at 08:30", "Jour 2 commence à 09:00"
    const extractedDayStartTimes: Record<number, string> = {}
    const extractedDayEndTimes: Record<number, string> = {}

    // Pattern: "Day/Jour N: HH:MM-HH:MM" or "Day/Jour N: HH:MM–HH:MM"
    const dayRangePattern = /(?:day|jour)\s*(\d+)\s*[:：]\s*(\d{1,2}[:.]\d{2})\s*[-–]\s*(\d{1,2}[:.]\d{2})/gi
    let dayRangeMatch
    while ((dayRangeMatch = dayRangePattern.exec(enrichedPrompt)) !== null) {
      const dayNum = parseInt(dayRangeMatch[1])
      extractedDayStartTimes[dayNum] = dayRangeMatch[2].replace('.', ':')
      extractedDayEndTimes[dayNum] = dayRangeMatch[3].replace('.', ':')
    }

    // Pattern: "Day/Jour N starts at HH:MM" / "Jour N commence à HH:MM"
    const dayStartPattern = /(?:day|jour)\s*(\d+)\s*(?:starts?\s*(?:at\s*)?|commence\s*[àa]\s*)(\d{1,2}[:.]\d{2})/gi
    let dayStartMatch
    while ((dayStartMatch = dayStartPattern.exec(enrichedPrompt)) !== null) {
      const dayNum = parseInt(dayStartMatch[1])
      if (!extractedDayStartTimes[dayNum]) {
        extractedDayStartTimes[dayNum] = dayStartMatch[2].replace('.', ':')
      }
    }

    // Pattern: "Day/Jour N ends at HH:MM" / "Jour N finit à HH:MM" / "Jour N termine à HH:MM"
    const dayEndPattern = /(?:day|jour)\s*(\d+)\s*(?:ends?\s*(?:at\s*|by\s*)?|(?:se\s*)?(?:finit|termine)\s*[àa]\s*)(\d{1,2}[:.]\d{2})/gi
    let dayEndMatch
    while ((dayEndMatch = dayEndPattern.exec(enrichedPrompt)) !== null) {
      const dayNum = parseInt(dayEndMatch[1])
      if (!extractedDayEndTimes[dayNum]) {
        extractedDayEndTimes[dayNum] = dayEndMatch[2].replace('.', ':')
      }
    }

    // Pattern: "Day/Jour N: HH:MM" (start time only, no range)
    const daySingleTimePattern = /(?:day|jour)\s*(\d+)\s*[:：]\s*(\d{1,2}[:.]\d{2})(?!\s*[-–])/gi
    let daySingleMatch
    while ((daySingleMatch = daySingleTimePattern.exec(enrichedPrompt)) !== null) {
      const dayNum = parseInt(daySingleMatch[1])
      if (!extractedDayStartTimes[dayNum]) {
        extractedDayStartTimes[dayNum] = daySingleMatch[2].replace('.', ':')
      }
    }

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
      dayStartTimes: extractedDayStartTimes,
      dayEndTimes: extractedDayEndTimes,
      requestedModules: modulesForBudget,
      moduleVersion: isCondensed ? 'condensed' : 'full',
    })

    const response = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 4000,
      system: `You are an expert workshop planner for FASTR (Frequent Assessments and System Tools for Resilience) workshops focused on RMNCAH-N health data analysis.

Given a user's description of their workshop needs, generate a COMPLETE workshop configuration including the full schedule.

Available FASTR modules:
${moduleList}

TIME BUDGET (calculated):
${timeBudget.budgetSummary}

HARD SCHEDULING RULES:
- Each day MUST end by its own end time. NO EXCEPTIONS.
${timeBudget.perDayBudgets.map(db => `- Day ${db.day} (${db.startTime}–${db.endTime}): max ${db.totalMinutes} min total, ~${db.availableMinutes} min for content`).join('\n')}
- BEFORE generating each day, note its budget. As you add sessions, subtract durations. STOP adding content when remaining budget < 30 min.
- Activity modules (9a-9h) MUST keep their full duration. Never compress.
- If content doesn't fit: use condensed for modules 4/5/6/8 ONLY, or drop lower-priority modules. Never set condensed on any other module — it has no condensed deck.

IMPORTANT - MODULE TYPES:

Methodology theory modules (4, 5, 6, 8) have TWO versions:
- "full": Complete content with all slides (longer duration)
- "condensed": Key points only (shorter duration, ~30-50% of full)

Other theory modules (0, 1, 2, 3, 3b, 7a–7f) have a "full" version only.

The old Module 7 (Results Communication) is split into six sub-modules: 7a Analytical thinking, 7b Data visualization, 7c Understanding audience, 7d Storytelling, 7e Linking results to actions, 7f Roadmap for sustained use. Each is a standalone session.

Activity modules (9a–9h) are hands-on platform exercises. Only have "full" version.
These are CRITICAL for practical workshops. Always pair theory with relevant activities.

Typical pairings:
- Module 3 (Platform) → 9a (Instance Setup) + 9b (Getting Started) + 9h (Platform Demo)
- Module 4-5 (Data Quality) → 9c (Visualizations & Interpretation)
- Module 6 (Data Analysis) → 9c (Visualizations) + 9d (Slide Decks)
- Modules 7a–7f (Results communication) → 9d (Slide Decks) + 9e (Disruption Report)
- Module 3b (AI Assistant) → 9f (Prompting Techniques)

Version choice:
- "condensed" is ONLY available for modules 4, 5, 6, 8. NEVER set "version": "condensed" for any other module — there is no condensed deck for them and the build will fail.
- For modules 0, 1, 2, 3, 3b, 7a–7f, 9a–9h: ALWAYS "full". Even if the user asks for a "quick" or "high-level" workshop, the version stays "full" for these modules — shorten by dropping topics or whole modules instead.
- For modules 4, 5, 6, 8: "quick"/"overview"/"high-level" or short days → "condensed". "detailed"/"comprehensive"/"full training" → "full".

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
  "day_start_times": {"1": "08:30", "2": "09:00"},
  "day_end_times": {"1": "17:00", "2": "17:00"},
  "lunch_duration": 60,
  "module_version": "full",
  "objectives": "- Objective 1\\n- Objective 2\\n- Objective 3",
  "expected_outputs": "- Output 1\\n- Output 2\\n- Output 3",
  "modules": ["0", "1", "2", "4", "5", "6", "7e", "7f", "9a", "9c"],
  "schedule": {
    "day1": [
      {"session": "Introduction to FASTR", "module": "m0", "version": "full", "duration": 60},
      {"session": "Tea Break", "type": "break", "duration": 15},
      {"session": "Identify Questions & Indicators", "module": "m1", "version": "full", "duration": 90},
      {"session": "Lunch Break", "type": "break", "duration": 60},
      {"session": "Instance Setup", "module": "m9a", "version": "full", "duration": 90},
      {"session": "Registration", "type": "custom", "duration": 30},
      {"session": "Optional: Data Extraction", "module": "m2", "version": "full", "duration": 60, "optional": true}
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
1b. The "condensed" version exists ONLY for modules 4, 5, 6, 8. For every other module (including 0, 1, 2, 3, 3b, 7a–7f, 9a–9h), use "version": "full" — there is no condensed deck for them. Setting "version": "condensed" on any other module is a build error.
2. Select modules that match the workshop focus
3. Spread modules logically across days with breaks
4. Day 1 should typically include Module 0 (Introduction) FIRST
5. Add tea breaks (15min) mid-morning and mid-afternoon
6. Add lunch break around midday (default 60min, or as specified by user)
7. Calculate total daily content to fit within start and end times
8. FOUR session types are allowed:
   - Module sessions: {"session": "Name", "module": "m0", "version": "full", "duration": 60}
   - Break sessions: {"session": "Tea Break", "type": "break", "duration": 15}
   - Custom sessions: {"session": "Country Presentations", "type": "custom", "duration": 60}
   - Optional after-hours sessions: {"session": "Name", "module": "m4", "version": "condensed", "duration": 60, "optional": true}
9. Use custom sessions ONLY for non-module activities (registration, opening remarks, country presentations, group discussion, action planning)
10. PREFER activity modules (9a-9h) over custom sessions for hands-on platform work
21. OPTIONAL AFTER-HOURS SESSIONS: If a session is marked as optional or after-hours in the user's request, set "optional": true on that session. These sessions are placed AFTER the day_end marker and do NOT count toward the day's time budget. Use this for bonus/supplementary content that participants can attend voluntarily.
11. objectives and expected_outputs should be strings with "- " bullets separated by newlines
12. Extract day_start_time and day_end_time from user prompt. If different days have different times, also populate day_start_times and day_end_times maps (keys are day numbers as strings)
13. Extract start_date and end_date from user prompt in YYYY-MM-DD format
14. Extract lunch_duration from user prompt (default 60 minutes if not specified)
15. Generate a concise title (for cover slide) and subtitle
16. Use the workshop name provided by user for the "name" field
17. NEVER DUPLICATE A MODULE - each module can only appear ONCE in the entire schedule
18. EVERY module in the "modules" array MUST appear in the schedule — do NOT list a module without scheduling it. If it doesn't fit, remove it from the "modules" array too.
19. ONE lunch break per day, maximum. Use consistent break names: ${workshopLanguage === 'fr' ? '"Pause café" for tea breaks and "Pause déjeuner" for lunch breaks.' : '"Tea Break" for tea breaks and "Lunch Break" for lunch breaks.'}
20. A good workshop BALANCES theory and practice — don't stack all theory on one day

WORKSHOP LANGUAGE: ${workshopLanguage === 'fr' ? 'FRENCH — All session names, objectives, expected_outputs, title, subtitle, and name MUST be in French. Use the French module names provided above for session names. Custom session names must also be in French (e.g., "Remarques d\'ouverture", "Présentations pays", "Planification d\'actions").' : 'ENGLISH — Use English for all text content.'}

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

    // Run shared post-processing (dedup, overflow, modules array sync)
    postProcessWorkshopConfig(
      workshopConfig, workshopLanguage,
      extractedStartTime, extractedEndTime,
      extractedDayStartTimes, extractedDayEndTimes,
    )

    res.json(workshopConfig)
  } catch (error: any) {
    console.error('AI generate-workshop error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/ai/parse-agenda - Parse an uploaded agenda file or pasted text
// ─────────────────────────────────────────────────────────────────────────────
const agendaUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and Word (.docx) files are supported'))
    }
  },
})

router.post('/parse-agenda', agendaUpload.single('file'), async (req, res) => {
  try {
    let agendaText = ''

    if (req.file) {
      // Extract text from uploaded file
      if (req.file.mimetype === 'application/pdf') {
        const { PDFParse } = await import('pdf-parse')
        const parser = new PDFParse({ data: new Uint8Array(req.file.buffer) })
        const result = await parser.getText()
        agendaText = result.text
      } else {
        // Word .docx
        const mammoth = await import('mammoth')
        const result = await mammoth.extractRawText({ buffer: req.file.buffer })
        agendaText = result.value
      }
    } else if (req.body?.text) {
      agendaText = req.body.text
    } else {
      return res.status(400).json({ error: 'No file or text provided' })
    }

    if (!agendaText.trim()) {
      return res.status(400).json({ error: 'Could not extract any text from the file' })
    }

    const client = getClient()
    const workshopLanguage = detectLanguage(agendaText)

    const moduleList = Object.entries(getModuleDetailsDict(workshopLanguage))
      .map(([num, m]) => `  Module ${num}: ${m.name} - ${m.description} (${m.duration})`)
      .join('\n')

    const response = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 4000,
      system: `You are an expert at parsing workshop agendas and converting them into structured FASTR workshop configurations.

Given the text of a workshop agenda (extracted from PDF, Word, or pasted text), parse it into a complete workshop configuration JSON.

Available FASTR modules (match agenda sessions to these where the topic aligns):
${moduleList}

YOUR TASK:
1. Identify the day structure (Day 1, Day 2, etc.)
2. Extract times, session names, breaks, and durations
3. Match sessions to FASTR modules where the topic clearly aligns (use fuzzy matching on topic names)
4. Keep non-FASTR sessions as type: "custom"
5. Preserve the original timing from the agenda
6. Detect the agenda language (English or French)

MATCHING RULES:
- Match agenda sessions to FASTR modules based on topic similarity (e.g., "Data Quality Assessment" → Module 4, "Qualité des données" → Module 4)
- If a session clearly maps to a FASTR module, use the module reference with "module": "m4", "version": "full"
- If unsure whether a session matches a module, keep it as "type": "custom"
- Activity/hands-on sessions about the FASTR platform should map to modules 9a-9h
- Use "condensed" version ONLY for modules 4, 5, 6, 8 — and only if the agenda allocates significantly less time than the full duration. All other modules MUST use "version": "full" because they have no condensed deck.

Generate a JSON object with this structure:
{
  "name": "Workshop Name from agenda",
  "title": "Workshop Title",
  "subtitle": "Subtitle if found",
  "country": "Country if mentioned",
  "location": "City if mentioned",
  "start_date": "YYYY-MM-DD if found",
  "end_date": "YYYY-MM-DD if found",
  "days": 3,
  "day_start_time": "09:00",
  "day_end_time": "17:00",
  "day_start_times": {},
  "day_end_times": {},
  "lunch_duration": 60,
  "module_version": "full",
  "objectives": "- Objective 1\\n- Objective 2",
  "expected_outputs": "",
  "modules": ["0", "1", "4"],
  "schedule": {
    "day1": [
      {"session": "Introduction to FASTR", "module": "m0", "version": "full", "duration": 60},
      {"session": "Tea Break", "type": "break", "duration": 15},
      {"session": "Country Presentations", "type": "custom", "duration": 60},
      {"session": "Lunch Break", "type": "break", "duration": 60}
    ]
  }
}

RULES:
1. Session types: module sessions (with "module" + "version"), breaks ("type": "break"), custom ("type": "custom")
2. Use ${workshopLanguage === 'fr' ? '"Pause café" for tea breaks and "Pause déjeuner" for lunch breaks' : '"Tea Break" for tea breaks and "Lunch Break" for lunch breaks'}
3. Preserve original session names from the agenda where possible
4. If the agenda has times like "09:00 - 10:30", calculate the duration (90 min)
5. Each module can only appear ONCE in the schedule
6. WORKSHOP LANGUAGE: ${workshopLanguage === 'fr' ? 'FRENCH — Keep all session names in French as they appear in the agenda. Use French for any generated text.' : 'ENGLISH — Use English for all text.'}

Return ONLY valid JSON, no explanation.`,
      messages: [{ role: 'user', content: `Parse this workshop agenda:\n\n${agendaText}` }],
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') textContent += block.text
    }

    let jsonContent = textContent.trim()
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    }

    const workshopConfig = JSON.parse(jsonContent)

    // Run shared post-processing
    const defaultStart = workshopConfig.day_start_time || '09:00'
    const defaultEnd = workshopConfig.day_end_time || '17:00'
    postProcessWorkshopConfig(workshopConfig, workshopLanguage, defaultStart, defaultEnd)

    res.json(workshopConfig)
  } catch (error: any) {
    console.error('AI parse-agenda error:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Webinar generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a slide-level catalog of all available content for webinar generation.
 * Returns module info with individual slide titles + available engagement templates.
 */
function getSlidesCatalog(language: 'en' | 'fr' | 'pt' = 'en'): string {
  const modules = loadModulesRegistry()
  const contentPath = language === 'fr'
    ? path.join(REPO_ROOT, 'core_content_fr')
    : path.join(REPO_ROOT, 'core_content')

  const lines: string[] = ['AVAILABLE SLIDE CONTENT:']
  for (const mod of modules) {
    const meta = loadModuleMeta(contentPath, mod.folder)
    if (!meta?.slides?.length) continue
    const modName = mod.name[language] || mod.name.en
    lines.push(`\n  Module ${mod.id} — ${modName}:`)
    for (const slide of meta.slides) {
      lines.push(`    - file: "${slide.file}", title: "${slide.title}", variant: ${slide.variant}`)
    }
  }

  // Engagement templates
  lines.push('\nENGAGEMENT TEMPLATES (for interaction moments):')
  const engagementTemplates = [
    { file: 'webinar_icebreaker.md', name: 'Icebreaker' },
    { file: 'webinar_poll.md', name: 'Poll' },
    { file: 'webinar_chat_prompt.md', name: 'Chat Prompt' },
    { file: 'webinar_qa.md', name: 'Q&A Moment' },
    { file: 'webinar_discussion.md', name: 'Discussion / Breakout' },
    { file: 'webinar_reflection.md', name: 'Reflection Pause' },
    { file: 'webinar_transition.md', name: 'Section Transition' },
    { file: 'webinar_closing_cta.md', name: 'Closing & Next Steps' },
    { file: 'webinar_logistics.md', name: 'Virtual Meeting Logistics' },
    { file: 'webinar_next_steps.md', name: 'Next Steps' },
    { file: 'learning_exchange_overview.md', name: 'Learning Exchange Overview' },
  ]
  for (const t of engagementTemplates) {
    lines.push(`    - file: "${t.file}", name: "${t.name}"`)
  }

  // Structural templates
  lines.push('\nSTRUCTURAL TEMPLATES:')
  const structuralTemplates = [
    { file: 'title_slide.md', name: 'Title / Cover Slide' },
    { file: 'section_divider.md', name: 'Section Divider' },
    { file: 'closing.md', name: 'Closing / Contact Info' },
  ]
  for (const t of structuralTemplates) {
    lines.push(`    - file: "${t.file}", name: "${t.name}"`)
  }

  return lines.join('\n')
}

/**
 * Post-process webinar AI output: validate files, add _id fields, check engagement pacing.
 */
function postProcessWebinarConfig(
  config: any,
  language: 'en' | 'fr' | 'pt',
): void {
  const contentPath = language === 'fr'
    ? path.join(REPO_ROOT, 'core_content_fr')
    : path.join(REPO_ROOT, 'core_content')
  const templatesPath = language === 'fr'
    ? path.join(REPO_ROOT, 'templates_fr')
    : path.join(REPO_ROOT, 'templates')

  if (!Array.isArray(config.slides)) return

  const ts = Date.now()
  const validatedSlides: any[] = []

  for (let i = 0; i < config.slides.length; i++) {
    const slide = config.slides[i]
    slide._id = `webinar-${i}-${ts}`

    // Validate file exists
    if (slide.file) {
      // Check templates first, then module folders
      const templatePath = path.join(templatesPath, slide.file)
      if (fs.existsSync(templatePath)) {
        slide.slides = [slide.file]
        slide.isTemplate = true
        validatedSlides.push(slide)
        continue
      }

      // Check in module folders
      let found = false
      if (slide.module) {
        const modules = loadModulesRegistry()
        const mod = modules.find(m => m.id === slide.module || `m${m.number}` === slide.module)
        if (mod) {
          const filePath = path.join(contentPath, mod.folder, slide.file)
          if (fs.existsSync(filePath)) {
            slide.slides = [slide.file]
            found = true
          }
        }
      }

      // Search all module folders if not found via module hint
      if (!found) {
        const modules = loadModulesRegistry()
        for (const mod of modules) {
          const filePath = path.join(contentPath, mod.folder, slide.file)
          if (fs.existsSync(filePath)) {
            slide.slides = [slide.file]
            slide.module = mod.id
            found = true
            break
          }
        }
      }

      if (!found) {
        // Skip slides with invalid files
        console.warn(`[webinar] Skipping slide with missing file: ${slide.file}`)
        continue
      }
    }

    validatedSlides.push(slide)
  }

  config.slides = validatedSlides
  config.language = language
}

// POST /api/ai/generate-webinar - Generate webinar config from natural language
router.post('/generate-webinar', async (req, res) => {
  try {
    const { prompt, clarifications } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const client = getClient()

    // Detect language
    const allText = clarifications
      ? `${prompt} ${clarifications.map((c: any) => `${c.question} ${c.answer}`).join(' ')}`
      : prompt
    const webinarLanguage = detectLanguage(allText)

    const slidesCatalog = getSlidesCatalog(webinarLanguage)

    // ── Phase 1: Check if clarification is needed ──
    if (!clarifications) {
      const clarifyResponse = await client.messages.create({
        model: AI_MODEL,
        max_tokens: 1024,
        system: `You evaluate webinar descriptions to determine if there is enough information to build a good FASTR webinar.

You MUST have clarity on these key items:
1. Duration (30-120 minutes)
2. Topic focus (which FASTR areas to cover)
3. Audience (who is attending — program managers, data analysts, ministry officials, etc.)

Nice to have (do NOT ask if missing, just use defaults):
- Country, date
- Context (standalone, pre-workshop, follow-up)
- Language — if the prompt is in French or mentions a francophone country, assume French and do NOT ask

RULES:
- If ALL required items are clear from the description, return exactly: {"ready": true}
- If any key item is unclear, return a JSON array of 2-3 short, specific questions to ask. Each question should be a plain string.
- Do NOT ask about things already stated in the prompt
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
          return res.json({ needsClarification: true, questions: parsed })
        }
      } catch {
        // Proceed with generation
      }
    }

    // ── Phase 2: Generate webinar ──
    let enrichedPrompt = prompt
    if (clarifications && Array.isArray(clarifications)) {
      const qaBlock = clarifications
        .map((c: { question: string; answer: string }) => `Q: ${c.question}\nA: ${c.answer}`)
        .join('\n\n')
      enrichedPrompt = `${prompt}\n\nAdditional details:\n${qaBlock}`
    }

    // Extract duration from prompt
    const durationMatch = enrichedPrompt.match(/(\d+)\s*[-–]?\s*min/i) ||
      enrichedPrompt.match(/(\d+)\s*minutes?/i)
    const requestedDuration = durationMatch ? parseInt(durationMatch[1]) : 90

    const response = await client.messages.create({
      model: AI_MODEL,
      max_tokens: 4000,
      system: `You are an expert at planning FASTR webinars — short virtual events (30-120 minutes) focused on RMNCAH-N health data analysis.

Given a description, generate a webinar as a flat list of slides with engagement moments.

${slidesCatalog}

WEBINAR BEST PRACTICES:
- Engagement break every 10-15 minutes (poll, Q&A, chat prompt, reflection)
- Remote audiences lose focus quickly — vary interaction types
- Prefer visual, concise slides from the "mw" (webinar) module over text-heavy module slides
- Use module slides (m0, m1, etc.) when deeper content is needed, but prefer condensed/visual versions

STRUCTURE for a ${requestedDuration}-min webinar:
1. Title slide (title_slide.md)
2. Virtual logistics (webinar_logistics.md)
3. Icebreaker (webinar_icebreaker.md)
4. Content blocks with engagement moments every 10-15 min
5. Q&A (webinar_qa.md)
6. Closing & next steps (webinar_closing_cta.md)

DURATION GUIDE:
- 30 min: 5-8 content slides + 2-3 engagement
- 60 min: 12-15 content slides + 4-5 engagement
- 90 min: 18-22 content slides + 6-7 engagement
- 120 min: 25-30 content slides + 8-10 engagement

Generate a JSON object:
{
  "name": "Webinar title",
  "country": "Country if mentioned",
  "duration": ${requestedDuration},
  "slides": [
    {"session": "Title", "file": "title_slide.md", "duration": 0, "type": "structural"},
    {"session": "Virtual Logistics", "file": "webinar_logistics.md", "duration": 3, "type": "structural"},
    {"session": "Icebreaker", "file": "webinar_icebreaker.md", "duration": 3, "type": "engagement"},
    {"session": "FASTR Overview", "file": "mw_1_fastr_at_a_glance.md", "module": "mw", "duration": 5, "type": "content"},
    {"session": "Poll: Your experience", "file": "webinar_poll.md", "duration": 3, "type": "engagement"},
    {"session": "Data Quality", "file": "mw_4_data_quality_snapshot.md", "module": "mw", "duration": 5, "type": "content"},
    {"session": "Q&A", "file": "webinar_qa.md", "duration": 5, "type": "engagement"},
    {"session": "Closing", "file": "webinar_closing_cta.md", "duration": 3, "type": "structural"}
  ]
}

CRITICAL RULES:
1. ONLY use files from the slide catalog above — every "file" value must be an exact filename from the catalog
2. For module content slides, include "module" with the module id (e.g., "mw", "m0", "m3b")
3. For templates (engagement/structural), do NOT include "module"
4. Total duration should be within 10% of the requested ${requestedDuration} minutes
5. Engagement moments should be spaced every 10-15 minutes of content
6. Prefer "mw" (webinar) module slides for visual overviews
7. Use other module slides (m0, m1, etc.) for specific deep-dive topics
8. Each slide appears at most ONCE

WEBINAR LANGUAGE: ${webinarLanguage === 'fr' ? 'FRENCH — All session names, title must be in French.' : 'ENGLISH — Use English for all text.'}

Return ONLY valid JSON, no explanation.`,
      messages: [{ role: 'user', content: enrichedPrompt }],
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') textContent += block.text
    }

    let jsonContent = textContent.trim()
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
    }

    const webinarConfig = JSON.parse(jsonContent)
    postProcessWebinarConfig(webinarConfig, webinarLanguage)

    res.json(webinarConfig)
  } catch (error: any) {
    console.error('AI generate-webinar error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
