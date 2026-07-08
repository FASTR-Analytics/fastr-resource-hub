import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { WorkshopConfig } from '../db/database.js'
import {
  getModuleFolder,
  getModuleName,
  loadModuleMeta,
} from './moduleRegistry.js'
import { getImportedSlides, getImportedModule, getExternalDeck, getExternalPages, getCustomSlides } from '../db/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths - different in dev vs prod due to TypeScript compilation
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')
const TEMPLATES_PATH = path.join(REPO_ROOT, 'templates')

// Supported languages
export type Language = 'en' | 'fr' | 'pt'

// Get core content path for a specific language
function getCoreContentPath(language: Language = 'en'): string {
  const suffix = language === 'en' ? '' : `_${language}`
  return path.join(REPO_ROOT, `core_content${suffix}`)
}

// ─── Workshop-chrome strings ──────────────────────────────────────────────
// Strings the deck builder writes into agenda/break/recap slides. EN is the
// source of truth; FR + PT are added per language. Keep keys stable — if a
// new key is needed, fill all three languages.
const CHROME_I18N = {
  day:           { en: 'Day',                fr: 'Jour',                       pt: 'Dia' },
  agendaSuffix:  { en: 'Agenda',             fr: 'Agenda',                     pt: 'Agenda' },
  noSessions:    { en: 'No sessions scheduled', fr: 'Aucune session programmée', pt: 'Nenhuma sessão agendada' },
  timeCol:       { en: 'Time',               fr: 'Heure',                      pt: 'Hora' },
  sessionCol:    { en: 'Session',            fr: 'Session',                    pt: 'Sessão' },
  facilitatorCol:{ en: 'Facilitator',        fr: 'Facilitateur',               pt: 'Facilitador' },
  lunchBreak:    { en: 'Lunch break',        fr: 'Pause déjeuner',             pt: 'Pausa para almoço' },
  coffeeBreak:   { en: 'Coffee break',       fr: 'Pause café',                 pt: 'Pausa para café' },
  resumeAt:      { en: 'We resume at',       fr: 'Reprise à',                  pt: 'Retomamos às' },
  dayRecap:      { en: 'Day {n} Recap',      fr: 'Récapitulatif : Jour {n}',   pt: 'Resumo do Dia {n}' },
  presentedBy:   { en: 'Presented by',       fr: 'Présenté par',               pt: 'Apresentado por' },
} as const
type ChromeKey = keyof typeof CHROME_I18N
function t(key: ChromeKey, lang: Language, vars?: Record<string, string | number>): string {
  let s: string = CHROME_I18N[key][lang]
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
  return s
}

// Default to English for backward compatibility
const CORE_CONTENT_PATH = getCoreContentPath('en')

// --- Auto-compact tier -------------------------------------------------------
// tools/measure_overflow.mjs renders every slide and records which ones overflow
// the 720px box but fit once the `.compact` density class is applied. We apply
// that class here at build time so source files in core_content stay untouched.
// Re-run the tool after editing slide content or the theme to refresh the map.
interface OverflowMap { [lang: string]: { compact: string[]; split: string[]; flag: string[] } }
let _compactSets: Record<string, Set<string>> | null = null
function getCompactSet(language: Language): Set<string> {
  if (!_compactSets) {
    _compactSets = {}
    try {
      const raw = fs.readFileSync(path.join(REPO_ROOT, 'tools', 'overflow_map.json'), 'utf-8')
      const map: OverflowMap = JSON.parse(raw)
      for (const lang of Object.keys(map)) {
        if (map[lang]?.compact) _compactSets[lang] = new Set(map[lang].compact)
      }
    } catch {
      // No map yet — auto-compact is simply a no-op.
    }
  }
  return _compactSets[language] || new Set()
}

/** Merge the `compact` class into a slide's local `_class` directive, or add
 *  one. Must stay symmetric with tools/measure_overflow.mjs `applyCompact`. */
function applyCompactClass(body: string): string {
  const m = body.match(/^<!--\s*_class:\s*(.+?)\s*-->/m)
  if (m) {
    const classes = m[1].replace(/['"]/g, '').trim().split(/\s+/)
    if (!classes.includes('compact')) classes.push('compact')
    return body.replace(m[0], `<!-- _class: ${classes.join(' ')} -->`)
  }
  return `<!-- _class: compact -->\n\n${body}`
}

/** Apply the auto-compact tier to a slide's content when the overflow map flags
 *  its file; otherwise return the content unchanged. */
function maybeCompact(filename: string, content: string, language: Language): string {
  if (!getCompactSet(language).has(path.basename(filename))) return content
  return applyCompactClass(content)
}

// Module folder names loaded from modules.yaml via registry
// (replaces hardcoded MODULE_FOLDERS dict)
// Use getModuleFolder(id) for single lookups, getModuleFoldersDict() for bulk

interface Session {
  session: string
  module?: string
  slides?: string[]
  excludedSlides?: string[]  // Slide files to exclude from module content
  slideOverrides?: Record<string, string>  // Source ref → custom_slides/<fork> (per-workshop slide edits)
  type?: string
  duration?: number
  time?: string
  topic_range?: { start: number; end: number } | null  // For splitting modules across sessions
  version?: 'full' | 'condensed'  // Which content version to use
  [key: string]: any
}

/** Where a rendered slide's markdown came from, for the in-app slide editor.
 *  'cover' = the workshop cover, whose content (title, subtitle, date, logos)
 *  is driven by Workshop Settings — editing its raw markdown is a foot-gun, so
 *  the UI routes users to Settings instead. */
export type SlideSourceKind = 'library' | 'template' | 'custom' | 'computed' | 'generated' | 'imported' | 'external' | 'cover'

export interface SlideChunkSource {
  /** The ref to pass to slide-content / slideOverrides — null when not source-backed */
  ref: string | null
  kind: SlideSourceKind
  editable: boolean
  overridden: boolean
}

/** One source unit of a session's markdown (a file, an imported slide, a computed slide).
 *  May render to several slides if the content has internal `---` separators. */
export interface SessionChunk {
  content: string
  source: SlideChunkSource
}

const EDITABLE_KINDS: ReadonlySet<SlideSourceKind> = new Set(['library', 'template', 'custom', 'imported'])

/**
 * How many slides a session chunk renders to: 1 + its internal slide
 * separators. Fence-aware line scan; a `---` directly after a paragraph line
 * is a setext heading (not a separator), so it only counts after a blank
 * line or at the chunk start. Divergence from Marp's tokenizer is caught by
 * the count fail-safe in the slides endpoint.
 */
export function countRenderedSlides(content: string): number {
  let inFence = false
  let prevBlank = true
  let separators = 0
  for (const line of content.split('\n')) {
    if (/^\s*(```|~~~)/.test(line.trimEnd())) {
      inFence = !inFence
      prevBlank = false
      continue
    }
    if (!inFence && /^ {0,3}(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      const isDashes = /^ {0,3}-{3,}\s*$/.test(line)
      if (!isDashes || prevBlank) separators++
    }
    prevBlank = line.trim() === ''
  }
  return separators + 1
}

function chunkSource(ref: string | null, kind: SlideSourceKind, overridden = false): SlideChunkSource {
  return { ref, kind, editable: ref !== null && EDITABLE_KINDS.has(kind), overridden }
}

/**
 * Build the complete markdown deck from a workshop config
 * @param workshopId - Workshop identifier
 * @param config - Workshop configuration
 * @param language - Language for content ('en' or 'fr', defaults to config.workshop.language or 'en')
 */

/** Calendar date of a given workshop day (1-based). Day 1 of a 20-23 May
 *  workshop → "20 May 2026". Empty string if no start date. */
function formatDayDate(startDate: string | undefined, dayNumber: number, locale: string): string {
  if (!startDate) return ''
  try {
    const d = new Date(startDate)
    d.setDate(d.getDate() + (dayNumber - 1))
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

/** Dynamic per-slide chrome for a session, as Marp persistent directives:
 *  kicker (topic, top-left) + locator (Day x/y · Session n, top-right) + footer
 *  (FASTR · country · the date of this day). Persists until the next session
 *  overrides it; covers suppress it via CSS. */
function sessionChrome(
  session: Session,
  day: number,
  numDays: number,
  sessionNumber: number | undefined,
  config: WorkshopConfig,
  lang: Language,
  withHeader: boolean,
): string {
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'pt' ? 'pt-PT' : 'en-US'
  const esc = (s: string) => (s || '').replace(/'/g, '’').trim()
  // Strip a leading "Module 04 ·" or "Session 02 ·" — the kicker is just the
  // topic; the locator already carries the session number.
  const kicker = esc(
    (session.session || '')
      .replace(/^\s*module\s+\d+\s*[—\-·:.]*\s*/i, '')
      .replace(/^\s*session\s+\d+\s*[—\-·:.]*\s*/i, '')
  )
  const dayWord = t('day', lang)
  const locator = `${dayWord} ${day}/${numDays}` + (sessionNumber ? ` · Session ${sessionNumber}` : '')
  // Smart per-day date when start_date is set; otherwise fall back to the
  // workshop's free-text date so the footer still carries a date.
  const date = formatDayDate((config.workshop as any).start_date, day, locale)
    || (config.workshop as any).date || ''
  const footer = esc(['FASTR', (config.workshop as any).country, date].filter(Boolean).join(' · '))
  // Header only for content (module) sessions — on standalone slides (agenda,
  // icebreaker, break…) the kicker just repeats the slide title. Empty header
  // clears any persisted kicker from the previous session.
  const header = withHeader ? `<span class="kick">${kicker}</span><span class="loc">${locator}</span>` : ''
  return `<!-- header: '${header}' -->\n<!-- footer: '${footer}' -->\n\n`
}

export async function buildMarkdown(workshopId: string, config: WorkshopConfig, language?: Language): Promise<string> {
  // Use provided language, or fall back to workshop config, or default to English
  const lang: Language = language || (config.workshop as any).language || 'en'
  const slides: string[] = []

  // Frontmatter is prepended (not joined as a slide) so the first real slide
  // follows it directly — joining it would insert a `---` separator and produce
  // an empty leading slide (a blank first page).
  const frontmatter = `---
marp: true
theme: fastr
paginate: true
---

`

  const numDays = config.schedule.days || 1

  // Pre-fetch this workshop's custom slides from the DB so `loadSlideContent`
  // can resolve `custom_slides/{filename}` references without per-slide queries.
  const customSlideRows = await getCustomSlides(workshopId)
  const customSlideMap = new Map<string, string>(
    customSlideRows.map(r => [r.filename, r.content])
  )

  // A session counts as "content" (gets the kicker · locator chrome + a
  // session number) when it references a module OR its title starts with an
  // explicit "Session N:" prefix. Welcome / icebreaker / agenda template
  // sessions stay non-content even if they have a speaker, so they don't
  // inflate the count.
  const SESSION_PREFIX_RE = /^\s*Session\s+(\d+)\s*[:.\-—·]/i
  let sessionNumber = 0

  // Build each day
  for (let day = 1; day <= numDays; day++) {
    const dayKey = `day${day}`
    const sessions: Session[] = config.schedule[dayKey] || []

    for (const session of sessions) {
      const prefixMatch = (session.session || '').match(SESSION_PREFIX_RE)
      const isContentSession = !!session.module || !!prefixMatch

      // Honour an explicit "Session N:" prefix in the title — keep manual
      // numbering aligned with what the user wrote. Otherwise auto-increment.
      let currentNum: number | undefined
      if (isContentSession) {
        if (prefixMatch) {
          sessionNumber = parseInt(prefixMatch[1], 10)
        } else {
          sessionNumber++
        }
        currentNum = sessionNumber
      }

      const slideContent = await buildSessionSlides(session, config, day, currentNum, lang, customSlideMap)
      if (slideContent) {
        // Prepend the dynamic chrome (kicker · locator · footer). As Marp
        // persistent directives, they carry through the session's slides until
        // the next session overrides them.
        const chrome = sessionChrome(session, day, numDays, currentNum, config, lang, isContentSession)
        slides.push(chrome + slideContent)
      }
    }
  }

  return frontmatter + slides.join('\n\n---\n\n')
}

/**
 * Build slides for a single session (exported for use by slides endpoint)
 */
export async function buildSessionMarkdown(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number,
  sessionNumber?: number,
  language?: Language,
  /** Custom slide content keyed by filename, pre-fetched from the DB by the caller. */
  customSlideMap?: Map<string, string>,
): Promise<string | null> {
  const lang: Language = language || (config.workshop as any).language || 'en'
  return buildSessionSlides(session, config, dayNumber, sessionNumber, lang, customSlideMap)
}

/**
 * Like buildSessionMarkdown, but also returns per-chunk source provenance so
 * the slides endpoint can tell the client which slides are editable and where
 * their markdown lives.
 */
export async function buildSessionMarkdownWithSources(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number,
  sessionNumber?: number,
  language?: Language,
  customSlideMap?: Map<string, string>,
): Promise<{ markdown: string; chunks: SessionChunk[] } | null> {
  const lang: Language = language || (config.workshop as any).language || 'en'
  const chunks = await buildSessionChunks(session, config, dayNumber, sessionNumber, lang, customSlideMap)
  if (!chunks) return null
  return { markdown: chunks.map(c => c.content).join('\n\n---\n\n'), chunks }
}

/**
 * Build slides for a single session
 */
async function buildSessionSlides(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number,
  sessionNumber?: number,
  language: Language = 'en',
  customSlideMap?: Map<string, string>,
): Promise<string | null> {
  const chunks = await buildSessionChunks(session, config, dayNumber, sessionNumber, language, customSlideMap)
  if (!chunks) return null
  return chunks.map(c => c.content).join('\n\n---\n\n')
}

/** Classify a `session.slides[]` ref without loading it. */
function classifySlideRef(ref: string, sessionType?: string): SlideSourceKind {
  if (/^day\d+_(agenda|recap)$/.test(ref)) return 'computed'
  if (ref.startsWith('custom_slides/')) return 'custom'
  // The workshop cover: its content is driven by Workshop Settings (title,
  // subtitle, date, logos), so it's not editable as raw markdown — the UI
  // routes users to Settings instead.
  if (sessionType === 'day_title') return 'cover'
  return 'library'
}

async function buildSessionChunks(
  session: Session,
  config: WorkshopConfig,
  dayNumber: number,
  sessionNumber?: number,
  language: Language = 'en',
  customSlideMap?: Map<string, string>,
): Promise<SessionChunk[] | null> {
  const chunks: SessionChunk[] = []
  const coreContentPath = getCoreContentPath(language)
  const overrides = session.slideOverrides

  // Strip frontmatter + trailing separator and substitute variables — the
  // treatment override (forked) content gets in the module/topics paths.
  const prepareOverrideContent = (raw: string): string => {
    let content = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '')
    content = content.replace(/\n---\s*$/, '')
    return substituteVariables(content, config, dayNumber, session, language).trim()
  }

  /** Resolve an override ref (custom_slides/<file>) to prepared content, or null. */
  const loadOverride = (sourceRef: string): string | null => {
    const forkRef = overrides?.[sourceRef]
    if (!forkRef || !forkRef.startsWith('custom_slides/')) return null
    const content = customSlideMap?.get(forkRef.slice('custom_slides/'.length))
    if (content === undefined) return null
    const prepared = prepareOverrideContent(content)
    return prepared || null
  }

  // PREFIX SLIDES (from slides array) - load FIRST
  // This allows adding intro slides before module content
  // e.g., Add m4_0_fastr_methods_overview.md before condensed content
  if (session.slides && session.slides.length > 0) {
    for (const slideFile of session.slides) {
      const kind = classifySlideRef(slideFile, session.type)
      const overrideContent = (kind === 'computed' || kind === 'cover') ? null : loadOverride(slideFile)
      const content = overrideContent
        ?? await loadSlideContent(slideFile, config, dayNumber, session, language, customSlideMap)
      if (content) {
        chunks.push({ content, source: chunkSource(slideFile, kind, overrideContent !== null) })
      }
    }
  }

  // MODULE CONTENT - load SECOND
  // Uses full or condensed version based on session.version
  if (session.module) {
    const moduleChunks = await buildModuleSlides(
      session.module, session.session, sessionNumber, session.topic_range,
      session.excludedSlides, session.version, language, session.speaker,
      overrides, loadOverride,
    )
    if (moduleChunks) {
      chunks.push(...moduleChunks)
    }
  }

  // TOPICS ARRAY - load THIRD
  // Individual topic files like m4_s1, m4_s2, etc.
  // Useful for cherry-picking specific topics without loading entire module
  if (session.topics && Array.isArray(session.topics) && session.topics.length > 0) {
    // Add section cover slide if no module already generated one
    if (!session.module && session.session) {
      const presenter = session.speaker
        ? `\n\n*${t('presentedBy', language)} ${session.speaker}*`
        : ''
      const titleSlide = `<!-- _class: section-cover -->\n![bg](../../resources/backgrounds/section_slide.png)\n\n# ${session.session}${presenter}`
      chunks.push({ content: titleSlide, source: chunkSource(null, 'generated') })
    }
    const loadedFiles = new Set<string>()
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
            // Find files that start with the topic ID
            const files = fs.readdirSync(modulePath).filter(f => f.startsWith(topicId) && f.endsWith('.md'))
            for (const file of files) {
              if (loadedFiles.has(file)) continue
              loadedFiles.add(file)
              const overrideContent = loadOverride(file)
              let content = overrideContent
              if (content === null) {
                content = fs.readFileSync(path.join(modulePath, file), 'utf-8')
                // Remove frontmatter (anchored to the string start — a multiline
                // `^` would eat the content between two internal `---` separators)
                content = content.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '')
                content = content.replace(/\n---\s*$/, '')
                content = substituteVariables(content, config, dayNumber, session, language).trim()
              }
              if (content) {
                chunks.push({ content, source: chunkSource(file, 'library', overrideContent !== null) })
              }
            }
          }
        }
      }
    }
  }

  // If we have any content, return it
  if (chunks.length > 0) {
    return chunks
  }

  const computed = (content: string | null): SessionChunk[] | null =>
    content ? [{ content, source: chunkSource(null, 'computed') }] : null

  // Break slides
  if (session.type === 'break') {
    return computed(buildBreakSlide(session, language))
  }

  // Day recap
  if (session.type === 'day_recap') {
    return computed(buildDayRecapSlide(session, config, dayNumber, language))
  }

  // Day end
  if (session.type === 'day_end') {
    return computed(buildDayEndSlide(session, dayNumber, language))
  }

  // Section/Agenda - check if this is an agenda section
  if (session.type === 'section') {
    // If session name contains "Agenda" and a day number, generate agenda table
    // Supports both English "Day 1 Agenda" and French "Agenda Jour 1"
    const agendaMatch = session.session.match(/Day\s*(\d+)\s*Agenda/i)
      || session.session.match(/Agenda\s*(?:Jour|Day)\s*(\d+)/i)
    if (agendaMatch) {
      const agendaDay = parseInt(agendaMatch[1])
      return computed(buildDayAgendaSlide(config, agendaDay, language))
    }
    // For sections with duration, add a placeholder slide after the cover
    if (session.duration && session.duration > 0) {
      return computed(buildSectionSlide(session, language) + '\n---\n\n' + buildGenericSessionSlide(session))
    }
    return computed(buildSectionSlide(session, language))
  }

  // Generic session (no specific slides)
  return computed(buildGenericSessionSlide(session))
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
  language: Language = 'en',
  speaker?: string,
  overrides?: Record<string, string>,
  /** Resolves a source ref to prepared per-workshop override content, or null. */
  loadOverride?: (sourceRef: string) => string | null,
): Promise<SessionChunk[] | null> {
  // Handle imported modules (stored in database, not filesystem)
  if (moduleId.startsWith('imported_')) {
    return await buildImportedModuleSlides(moduleId, sessionName, sessionNumber, language, speaker, loadOverride)
  }

  // Handle external decks (PDF pages stored as images)
  if (moduleId.startsWith('external_')) {
    return await buildExternalDeckSlides(moduleId, sessionName, sessionNumber, language, speaker)
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
  const presenter = speaker
    ? `\n\n*${t('presentedBy', language)} ${speaker}*`
    : ''
  const titleSlide = `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# ${displayName}${presenter}`

  const chunks: SessionChunk[] = [{ content: titleSlide, source: chunkSource(null, 'generated') }]
  for (const file of files) {
    const overrideContent = loadOverride?.(file) ?? null
    if (overrideContent !== null) {
      // Per-workshop edited copy: already stripped/substituted; skip the
      // auto-compact tier so the editor stays WYSIWYG.
      chunks.push({ content: overrideContent, source: chunkSource(file, 'library', true) })
      continue
    }
    let content = fs.readFileSync(path.join(modulePath, file), 'utf-8')
    // Remove frontmatter from module files (we have our own); anchored to the
    // string start — a multiline `^` would eat content between internal `---`s
    content = content.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '')
    chunks.push({ content: maybeCompact(file, content.trim(), language), source: chunkSource(file, 'library') })
  }

  return chunks
}

/**
 * Build slides for an imported module (from database)
 */
async function buildImportedModuleSlides(
  moduleId: string,
  sessionName?: string,
  sessionNumber?: number,
  language: Language = 'en',
  speaker?: string,
  loadOverride?: (sourceRef: string) => string | null,
): Promise<SessionChunk[] | null> {
  const dbId = moduleId.replace(/^imported_/, '')
  const mod = await getImportedModule(dbId)
  if (!mod) return null

  const slides = await getImportedSlides(dbId)
  if (slides.length === 0) return null

  const displayName = sessionName || mod.name
  const sessionLabel = sessionNumber ? `Session ${sessionNumber}` : 'Session'
  const presenter = speaker
    ? `\n\n*${t('presentedBy', language)} ${speaker}*`
    : ''
  const titleSlide = `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# ${sessionLabel}: ${displayName}${presenter}`

  const chunks: SessionChunk[] = [{ content: titleSlide, source: chunkSource(null, 'generated') }]
  for (const slide of slides) {
    const ref = `imported:${dbId}:${slide.id}`
    const overrideContent = loadOverride?.(ref) ?? null
    const content = overrideContent ?? slide.markdown.trim()
    if (content) {
      chunks.push({ content, source: chunkSource(ref, 'imported', overrideContent !== null) })
    }
  }

  return chunks
}

/**
 * Build slides for an external deck (PDF pages stored as images)
 */
async function buildExternalDeckSlides(
  moduleId: string,
  sessionName?: string,
  sessionNumber?: number,
  language: Language = 'en',
  speaker?: string
): Promise<SessionChunk[] | null> {
  const dbId = moduleId.replace(/^external_/, '')
  const deck = await getExternalDeck(dbId)
  if (!deck) return null

  const pages = await getExternalPages(dbId)
  if (pages.length === 0) return null

  const displayName = sessionName || deck.name
  const sessionLabel = sessionNumber ? `Session ${sessionNumber}` : 'Session'
  const presenter = speaker
    ? `\n\n*${t('presentedBy', language)} ${speaker}*`
    : ''
  const titleSlide = `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# ${sessionLabel}: ${displayName}${presenter}`

  const chunks: SessionChunk[] = [{ content: titleSlide, source: chunkSource(null, 'generated') }]
  for (const page of pages) {
    chunks.push({
      content: `<!-- _class: external-slide -->
![bg contain](/api/import/external/${dbId}/pages/${page.page_number})`,
      source: chunkSource(null, 'external'),
    })
  }

  return chunks
}

/**
 * Materialize external page images from API URLs to filesystem paths.
 * This is needed for PDF/PPTX export which can't fetch localhost URLs.
 * Returns the rewritten markdown and a cleanup function.
 */
export function materializeExternalImages(markdown: string): { markdown: string; tempDir: string | null } {
  const DATA_DIR = path.resolve(__dirname, '../../data')
  const EXTERNAL_DIR = path.join(DATA_DIR, 'external')
  const IMPORTS_DIR = path.join(DATA_DIR, 'imports')

  let hasMatches = false

  // Rewrite external deck page images
  const externalRegex = /!\[bg contain\]\(\/api\/import\/external\/([^/]+)\/pages\/(\d+)\)/g
  let rewritten = markdown.replace(externalRegex, (_match, deckId, pageNum) => {
    hasMatches = true
    const imageFilename = `${deckId}_page_${pageNum}.png`
    const imagePath = path.join(EXTERNAL_DIR, imageFilename)
    if (fs.existsSync(imagePath)) {
      return `![bg contain](${imagePath})`
    }
    return _match
  })

  // Rewrite imported module images (any Marp image syntax)
  const importRegex = /!\[([^\]]*)\]\(\/api\/import\/modules\/([^/]+)\/images\/([^)]+)\)/g
  rewritten = rewritten.replace(importRegex, (_match, alt, moduleId, filename) => {
    hasMatches = true
    const safeModuleId = path.basename(moduleId)
    const safeFilename = path.basename(filename)
    const imagePath = path.join(IMPORTS_DIR, safeModuleId, safeFilename)
    if (fs.existsSync(imagePath)) {
      return `![${alt}](${imagePath})`
    }
    return _match
  })

  // Rewrite per-workshop uploaded assets (inserted by the slide editors as
  // /api/assets/<workshopId>/file/<name>) — Marp CLI and PptxGenJS read from
  // disk and can't fetch server routes.
  const assetRegex = /!\[([^\]]*)\]\(\/api\/assets\/([^/)]+)\/file\/([^)]+)\)/g
  rewritten = rewritten.replace(assetRegex, (_match, alt, workshopId, filename) => {
    const imagePath = path.join(
      REPO_ROOT, 'workshops',
      path.basename(decodeURIComponent(workshopId)), 'assets',
      path.basename(decodeURIComponent(filename)),
    )
    if (fs.existsSync(imagePath)) {
      hasMatches = true
      return `![${alt}](${imagePath})`
    }
    return _match
  })

  // Rewrite root-absolute /resources/... URLs (shared asset library) the same way
  const resourceRegex = /!\[([^\]]*)\]\((\/resources\/[^)]+)\)/g
  rewritten = rewritten.replace(resourceRegex, (_match, alt, urlPath) => {
    const imagePath = path.join(REPO_ROOT, decodeURIComponent(urlPath))
    if (fs.existsSync(imagePath)) {
      hasMatches = true
      return `![${alt}](${imagePath})`
    }
    return _match
  })

  return { markdown: rewritten, tempDir: hasMatches ? DATA_DIR : null }
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
 * Resolve a slide reference to its raw markdown content (no variable substitution,
 * no frontmatter stripping). Use this when you want the on-disk / in-db source of
 * a slide — e.g., to populate an editor with the current content. Returns null
 * for dynamic computed refs like `day1_agenda` (those aren't editable source).
 *
 * Resolution order matches `loadSlideContent`:
 *   1. `custom_slides/<file>` → look up in customSlideMap
 *   2. templates_<lang>/ → templates/ → templates/custom_slides/
 *   3. core_content<_lang>/<moduleFolder>/<file>, with English fallback
 */
export function resolveLibrarySlideContent(
  ref: string,
  language: Language = 'en',
  customSlideMap?: Map<string, string>,
): { content: string; filename: string; source: 'custom' | 'template' | 'library' } | null {
  // Dynamic computed slides are not source-backed — not forkable as raw markdown.
  if (/^day\d+_(agenda|recap)$/.test(ref)) return null

  if (ref.startsWith('custom_slides/')) {
    const filename = ref.slice('custom_slides/'.length)
    const content = customSlideMap?.get(filename)
    if (content !== undefined) {
      return { content, filename, source: 'custom' }
    }
    return null
  }

  // Templates (language-specific first, then English, then custom_slides subfolder)
  const templatesPathForLang = language !== 'en'
    ? path.join(REPO_ROOT, `templates_${language}`)
    : TEMPLATES_PATH
  const candidates: string[] = [
    path.join(templatesPathForLang, ref),
    path.join(TEMPLATES_PATH, ref),
    path.join(TEMPLATES_PATH, 'custom_slides', ref),
  ]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return { content: fs.readFileSync(candidate, 'utf-8'), filename: ref, source: 'template' }
    }
  }

  // core_content<_lang>/<moduleFolder>/<file>
  const moduleMatch = ref.match(/^(m\d+[a-z]?|m[a-z]+)_/)
  if (moduleMatch) {
    const moduleId = moduleMatch[1]
    const folderName = getModuleFolder(moduleId)
    if (folderName) {
      const langPath = path.join(getCoreContentPath(language), folderName, ref)
      if (fs.existsSync(langPath)) {
        return { content: fs.readFileSync(langPath, 'utf-8'), filename: ref, source: 'library' }
      }
      if (language !== 'en') {
        const enPath = path.join(getCoreContentPath('en'), folderName, ref)
        if (fs.existsSync(enPath)) {
          return { content: fs.readFileSync(enPath, 'utf-8'), filename: ref, source: 'library' }
        }
      }
    }
  }

  return null
}

/** Frontmatter strip used for fork source hashing — must match the strip the
 *  editor applies so capture and comparison hash the same bytes. */
function stripFrontmatterForHash(content: string): string {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '').trim()
}

/**
 * Hash the CURRENT library source for a slide ref, for stale-fork detection.
 * Resolves the ref (library/template on disk, or an imported: DB slide) and
 * returns an md5 of the frontmatter-stripped content, or null if the ref isn't
 * source-backed (computed slides, missing files). `imported:<dbId>:<slideId>`
 * refs are read from the imported_slides table.
 */
export async function hashLibrarySource(
  ref: string,
  language: Language = 'en',
): Promise<string | null> {
  let content: string | null = null

  const importedMatch = ref.match(/^imported:([^:]+):(\d+)$/)
  if (importedMatch) {
    const slides = await getImportedSlides(importedMatch[1])
    content = slides.find(s => String(s.id) === importedMatch[2])?.markdown ?? null
  } else {
    // Library/template refs resolve from disk; custom_slides refs aren't a
    // "library source" so they're excluded (no map passed).
    content = resolveLibrarySlideContent(ref, language)?.content ?? null
  }

  if (content === null) return null
  return crypto.createHash('md5').update(stripFrontmatterForHash(content)).digest('hex')
}

/**
 * Load a slide template and substitute variables
 */
async function loadSlideContent(
  slideFile: string,
  config: WorkshopConfig,
  dayNumber: number,
  session: Session,
  language: Language = 'en',
  customSlideMap?: Map<string, string>,
): Promise<string | null> {
  // Check for dynamic agenda slides (day1_agenda, day2_agenda, etc.)
  const agendaMatch = slideFile.match(/^day(\d+)_agenda$/)
  if (agendaMatch) {
    const agendaDay = parseInt(agendaMatch[1])
    return buildDayAgendaSlide(config, agendaDay)
  }

  const resolved = resolveLibrarySlideContent(slideFile, language, customSlideMap)
  if (!resolved) {
    console.warn(`Slide file not found: ${slideFile}`)
    return null
  }

  // Strip frontmatter and trailing separator so the slide composes cleanly
  // with the deck's outer frontmatter and `---` joiners. Anchored to the string
  // start — a multiline `^` would eat content between internal `---` separators.
  let content = resolved.content.replace(/^---\r?\n[\s\S]*?\r?\n---\s*/, '')
  content = content.replace(/\n---\s*$/, '')

  content = substituteVariables(content, config, dayNumber, session, language)

  return maybeCompact(slideFile, content.trim(), language)
}

/**
 * Build a day agenda slide with schedule table
 */
function buildDayAgendaSlide(config: WorkshopConfig, dayNumber: number, language: Language = 'en'): string {
  const dayKey = `day${dayNumber}` as keyof typeof config.schedule
  const sessions = config.schedule[dayKey] as Session[] | undefined
  const dayTitle = config.schedule.day_titles?.[dayNumber] || `${t('day', language)} ${dayNumber}`

  if (!sessions || sessions.length === 0) {
    return `# ${t('day', language)} ${dayNumber} - ${t('agendaSuffix', language)}

*${t('noSessions', language)}*
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
  rows.push(`| ${t('timeCol', language)} | ${t('sessionCol', language)} | ${t('facilitatorCol', language)} |`)
  rows.push('|------|---------|-------------|')

  let sessionNumber = 1
  const breakTypes = ['tea_break', 'lunch_break', 'break']
  const skipNumberTypes = ['day_start', 'day_end', 'day_recap', 'opening', 'closing']

  for (const s of sessions) {
    // Skip title slides and 0-duration items (like agenda placeholders)
    if (s.type === 'day_title') continue
    if (!s.duration || s.duration === 0) continue

    const rawName = s.session || ''
    if (!rawName) continue

    // Use explicit time if provided, otherwise calculate from current position
    let timeStr = s.time || ''
    if (!timeStr && s.duration) {
      const endMinutes = currentMinutes + s.duration
      timeStr = `${formatTime(currentMinutes)}-${formatTime(endMinutes)}`
    }

    const speaker = s.speaker || ''

    // Use session name directly (session names already include numbering if desired)
    let displayName = rawName
    const isBreak = breakTypes.includes(s.type || '')
    const isAdmin = skipNumberTypes.includes(s.type || '')
    const isContentSession = !isBreak && !isAdmin

    if (timeStr) {
      // Only make module sessions bold, not breaks or admin items
      const formattedName = isContentSession ? `**${displayName}**` : displayName
      rows.push(`| ${timeStr} | ${formattedName} | ${speaker} |`)
    }

    // Advance current time by duration
    if (s.duration) {
      currentMinutes += s.duration
    }
  }

  return `<!-- _class: agenda -->

# ${t('day', language)} ${dayNumber} - ${t('agendaSuffix', language)}

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
  const locale = language === 'fr' ? 'fr-FR' : language === 'pt' ? 'pt-PT' : 'en-US'
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

  // Custom variables from workshop config (e.g., custom_vars: { INTERPRETATION_NOTE: "..." })
  if (workshop.custom_vars && typeof workshop.custom_vars === 'object') {
    for (const [key, value] of Object.entries(workshop.custom_vars)) {
      vars[`{{${key}}}`] = String(value || '')
    }
  }

  for (const [key, value] of Object.entries(vars)) {
    content = content.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value)
  }

  // Clean up any remaining unreplaced custom variables (leave them empty)
  content = content.replace(/\{\{[A-Z_]+\}\}/g, '')

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
  const lunchPattern = /lunch|déjeuner|dejeuner|dîner|diner|midi|almoço|almoco/i
  const isLunch = lunchPattern.test(session.session)
  const duration = session.duration || (isLunch ? 60 : 15)
  const resumeTime = calculateResumeTime(session)

  const kind = isLunch ? t('lunchBreak', language) : t('coffeeBreak', language)

  const back = resumeTime
    ? `<div class="back">${t('resumeAt', language)} <b>${resumeTime}</b></div>`
    : ''

  // Design-style break: warm field, kind label, big duration, resume line — no emoji.
  return `<!-- _class: break -->

<div class="kind">${kind}</div>

# ${duration} min

${back}
`
}

/**
 * Build a day recap slide - recaps the PREVIOUS day
 * Simple slide with thought icon, facilitator fills in verbally
 */
function buildDayRecapSlide(session: Session, config: WorkshopConfig, dayNumber: number, language: Language = 'en'): string {
  const previousDay = dayNumber - 1

  return `## ${t('dayRecap', language, { n: previousDay })}

<div style="display: flex; justify-content: center; align-items: center; height: 60%;">

![w:200](../../resources/icons/thought.svg)

</div>
`
}

/**
 * Build day end slides
 */
function buildDayEndSlide(session: Session, dayNumber: number, language: Language = 'en'): string {
  const keyMessages = { en: 'Key messages and wrap-up', fr: 'Messages clés et conclusion', pt: 'Mensagens-chave e conclusão' }[language]
  const reflections = { en: 'Reflections from Participants', fr: 'Réflexions des participants', pt: 'Reflexões dos participantes' }[language]

  return `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# ${keyMessages}

---

## ${reflections}

<div style="display: flex; justify-content: center; align-items: center; height: 60%;">

![w:200](../../resources/icons/communication.svg)

</div>
`
}

/**
 * Build a section/agenda slide
 */
function buildSectionSlide(session: Session, language: Language = 'en'): string {
  const presenter = session.speaker
    ? `\n*${t('presentedBy', language)} ${session.speaker}*\n`
    : ''
  return `<!-- _class: section-cover -->
![bg](../../resources/backgrounds/section_slide.png)

# ${session.session}
${presenter}`
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
