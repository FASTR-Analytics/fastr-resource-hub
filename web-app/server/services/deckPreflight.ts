import { WorkshopConfig, getCustomSlides } from '../db/database.js'
import {
  buildSessionMarkdownWithSources,
  findMissingImages,
  getOverflowFlags,
  hashLibrarySource,
  type Language,
} from './deckBuilder.js'

// A deck health check run before export: surfaces things that would embarrass a
// deck on a projector (placeholder slides, unfilled variables, broken images)
// and softer signals (overflow-flagged slides, stale forks). Matter-of-fact,
// attributed to a day/session so the user can find and fix each one.

export type PreflightCode =
  | 'placeholder'
  | 'unsubstituted-var'
  | 'missing-image'
  | 'overflow'
  | 'stale-fork'

export interface PreflightFinding {
  severity: 'error' | 'warning'
  code: PreflightCode
  message: string
  dayNumber?: number
  sessionName?: string
  detail?: string   // the offending token / image url / filename
}

export interface PreflightResult {
  findings: PreflightFinding[]
  slideCount: number
}

// Marker the generic (empty) session slide emits — see buildGenericSessionSlide.
const PLACEHOLDER_RE = />PLACEHOLDER</
// A template token that survived substitution and renders as literal braces on
// the slide. (substituteVariables only strips /\{\{[A-Z_]+\}\}/, so tokens with
// digits/lowercase — e.g. {{DAY_1}}, {{Venue}} — leak through and are exactly
// what's worth catching. All-caps unknowns get blanked and can't be detected
// post-build.)
const UNSUBSTITUTED_RE = /\{\{[^}\s]+\}\}/g

export async function runPreflight(
  workshopId: string,
  config: WorkshopConfig,
  language?: Language,
): Promise<PreflightResult> {
  const lang: Language = language || (config.workshop as any).language || 'en'
  const findings: PreflightFinding[] = []
  const numDays = config.schedule.days || 1
  let slideCount = 0

  const overflow = getOverflowFlags(lang)

  const customSlideRows = await getCustomSlides(workshopId)
  const customSlideMap = new Map<string, string>(customSlideRows.map(r => [r.filename, r.content]))

  // Stale-fork map (shared logic with the /slides endpoint): a fork is stale
  // when its recorded source hash differs from the current library source.
  const staleByRef = new Map<string, boolean>()
  for (const row of customSlideRows) {
    if (row.source_ref && row.source_hash) {
      const current = await hashLibrarySource(row.source_ref, lang)
      if (current !== null) staleByRef.set(row.source_ref, current !== row.source_hash)
    }
  }

  let sessionNumber = 0
  for (let day = 1; day <= numDays; day++) {
    const sessions = (config.schedule[`day${day}`] || []) as any[]
    for (const session of sessions) {
      const isContentSession = !!session.module
      if (isContentSession) sessionNumber++

      const built = await buildSessionMarkdownWithSources(
        session, config, day, isContentSession ? sessionNumber : undefined, lang, customSlideMap,
      )
      if (!built) continue

      const where = { dayNumber: day, sessionName: session.session as string }

      for (const chunk of built.chunks) {
        slideCount += 1

        if (PLACEHOLDER_RE.test(chunk.content)) {
          findings.push({ severity: 'error', code: 'placeholder', message: 'placeholder', ...where })
        }

        for (const vm of chunk.content.matchAll(UNSUBSTITUTED_RE)) {
          findings.push({ severity: 'error', code: 'unsubstituted-var', message: 'unsubstituted-var', detail: vm[0], ...where })
        }
        // Objectives left unfilled surface as the builder's fallback line.
        if (chunk.content.includes('- Objectives to be defined')) {
          findings.push({ severity: 'warning', code: 'unsubstituted-var', message: 'unfilled-objectives', ...where })
        }

        for (const url of findMissingImages(chunk.content)) {
          findings.push({ severity: 'warning', code: 'missing-image', message: 'missing-image', detail: url, ...where })
        }

        // Overflow signals key off the source filename (basename of the ref).
        const ref = chunk.source.ref
        if (ref && !ref.startsWith('custom_slides/')) {
          const base = ref.split('/').pop()!
          if (overflow.split.has(base)) {
            findings.push({ severity: 'warning', code: 'overflow', message: 'overflow-split', detail: base, ...where })
          } else if (overflow.flag.has(base)) {
            findings.push({ severity: 'warning', code: 'overflow', message: 'overflow-flag', detail: base, ...where })
          }
        }

        if (chunk.source.overridden && ref && staleByRef.get(ref)) {
          findings.push({ severity: 'warning', code: 'stale-fork', message: 'stale-fork', detail: ref, ...where })
        }
      }
    }
  }

  return { findings, slideCount }
}
