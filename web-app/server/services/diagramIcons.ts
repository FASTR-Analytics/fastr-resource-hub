import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Server-side companion to `client/src/lib/diagramIcons.ts`.
 *
 * Resolves a curated Lucide icon id (e.g. "chart-bar") to the inline SVG path
 * elements drawn from `lucide-static`, and emits a positioned `<g>` block that
 * can be embedded in a larger diagram SVG.
 *
 * Keep the id list in sync with the client catalog so a picked icon round-trips.
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// In dev tsx watches from `web-app/server/services/...`, so node_modules is two
// levels up. In compiled prod (dist/server/services/...) the path is the same
// relative to web-app.
const LUCIDE_STATIC_ROOT = path.resolve(
  __dirname,
  process.env.NODE_ENV === 'production' ? '../../../node_modules/lucide-static/icons' : '../../node_modules/lucide-static/icons',
)

/** Curated set — matches the client `DIAGRAM_ICONS` ids exactly. */
export const DIAGRAM_ICON_IDS = new Set<string>([
  // Data
  'chart-bar', 'chart-line', 'chart-pie', 'database', 'search', 'table', 'calculator', 'file-spreadsheet',
  // Health
  'hospital', 'heart-pulse', 'stethoscope', 'baby', 'pill', 'syringe', 'activity',
  // Communication
  'message-circle', 'megaphone', 'mail', 'mic', 'phone', 'send',
  // Actions / status
  'circle-check', 'triangle-alert', 'target', 'lightbulb', 'refresh-cw', 'key-round', 'arrow-right',
  // People / process
  'users', 'hand', 'graduation-cap',
])

export function isDiagramIconId(value: string | undefined): boolean {
  return !!value && DIAGRAM_ICON_IDS.has(value)
}

// Cache extracted inner-SVG paths so we don't hit the filesystem per render.
const innerCache = new Map<string, string | null>()

/** Reads `lucide-static/icons/{id}.svg` and returns the inner element string
 * (paths/lines/circles) — the `<svg>` wrapper is stripped because we re-wrap
 * with our own transform. Returns null if the icon isn't found. */
function getInnerSvg(iconId: string): string | null {
  if (innerCache.has(iconId)) return innerCache.get(iconId) || null
  const fp = path.join(LUCIDE_STATIC_ROOT, `${iconId}.svg`)
  if (!fs.existsSync(fp)) {
    innerCache.set(iconId, null)
    return null
  }
  const raw = fs.readFileSync(fp, 'utf-8')
  // Strip <svg ...> open + </svg> close, keep inner contents.
  const inner = raw
    .replace(/^<\?xml[\s\S]*?\?>\s*/i, '')
    .replace(/^<svg[^>]*>\s*/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim()
  innerCache.set(iconId, inner)
  return inner
}

/** Emit an SVG `<g>` group that renders the icon centred on (cx, cy) with the
 * given radius (≈ half-height), using FASTR deep green at the requested stroke
 * width. Returns empty string if the icon id isn't recognised. */
export function renderIconGroup(
  iconId: string,
  cx: number,
  cy: number,
  /** Half the visible height of the icon in user units. The 24×24 Lucide
   * viewBox is scaled to fit a (2r × 2r) square centred on (cx, cy). */
  r: number,
  /** Override stroke colour. Defaults to FASTR deep green. */
  stroke = '#09544F',
  strokeWidth = 2.4,
): string {
  const inner = getInnerSvg(iconId)
  if (!inner) return ''
  // Lucide viewBox is 0 0 24 24, so size 24. We want height 2r → scale = 2r/24
  const scale = (2 * r) / 24
  const tx = cx - r
  const ty = cy - r
  return `<g transform="translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${scale.toFixed(4)})" stroke="${stroke}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`
}
