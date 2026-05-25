#!/usr/bin/env node
/**
 * Overflow measurement → density map generator.
 *
 * Marp clips content taller than the 1280×720 box instead of shrinking it, so
 * overpacked slides ship truncated. This renders every core_content slide (EN +
 * FR) with the deck theme, measures the overflow, and — for any slide that
 * overflows — re-renders it with the `.compact` density class to see whether
 * compact alone brings it back inside the box.
 *
 * Output: tools/overflow_map.json, classifying each slide FILE per language as
 *   compact  → compact fixes it (deckBuilder auto-applies it at build time)
 *   split    → still overflows after compact; needs restructuring (tier 2)
 *   flag     → image/diagram-dominated; needs manual attention
 *
 * Source files in core_content are never edited — deckBuilder reads the `compact`
 * lists and applies the same transform when assembling a deck.
 *
 * Usage:
 *   node tools/measure_overflow.mjs [theme-css] [--threshold=8]
 *
 * Re-run after editing slide content or the theme.
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const args = process.argv.slice(2)
const themeCss = args.find(a => !a.startsWith('--')) || 'fastr-theme.css'
const threshold = Number((args.find(a => a.startsWith('--threshold=')) || '--threshold=8').split('=')[1])
const themePath = path.resolve(REPO_ROOT, themeCss)
const themeText = fs.readFileSync(themePath, 'utf8')
const themeName = (themeText.match(/@theme\s+([\w-]+)/) || [])[1]
if (!themeName) { console.error(`No "@theme <name>" declared in ${themeCss}`); process.exit(2) }

const LANGS = [
  { lang: 'en', dir: path.join(REPO_ROOT, 'core_content') },
  { lang: 'fr', dir: path.join(REPO_ROOT, 'core_content_fr') },
]

// Mirror deckBuilder: strip per-file frontmatter, then trim.
const stripFrontmatter = (raw) => raw.replace(/^---[\s\S]*?---\s*/m, '').trim()

// Mirror deckBuilder.applyCompactClass: merge `compact` into an existing local
// _class comment on the slide, or prepend one. MUST stay in sync with deckBuilder.
function applyCompact(body) {
  const m = body.match(/^<!--\s*_class:\s*(.+?)\s*-->/m)
  if (m) {
    const classes = m[1].replace(/['"]/g, '').trim().split(/\s+/)
    if (!classes.includes('compact')) classes.push('compact')
    return body.replace(m[0], `<!-- _class: ${classes.join(' ')} -->`)
  }
  return `<!-- _class: compact -->\n\n${body}`
}

// A slide dominated by an image/diagram (little text) can't be fixed by compact
// or by splitting bullets/tables — flag it for manual attention instead.
function looksLikeMedia(body) {
  const hasMedia = /<svg|!\[bg\]|!\[[^\]]*\]\(/.test(body)
  const text = body.replace(/<[^>]*>/g, '').replace(/[#*|_>`-]/g, '').replace(/\s+/g, ' ').trim()
  const blocks = (body.match(/^[-*] /gm) || []).length + (body.match(/^\|/gm) || []).length
  return hasMedia && text.length < 300 && blocks < 4
}

// Files that are wholly a cover/break never carry flowing content — skip them.
const SKIP_CLASS = /^<!--\s*_class:\s*['"]?(title-cover|section-cover|break|lead|agenda)\b/

const requireWeb = createRequire(path.join(REPO_ROOT, 'web-app', 'package.json'))
const { Marp } = requireWeb('@marp-team/marp-core')
const newMarp = () => { const m = new Marp({ inlineSVG: true }); m.themeSet.add(themeText); return m }
const wrap = (body) => `---\nmarp: true\ntheme: ${themeName}\npaginate: true\n---\n\n${body}`

// Collect per FILE (not per section). A file can render to several slides; we
// let Marp decide the boundaries rather than splitting markdown ourselves.
const files = []  // { lang, file, body, sections }
for (const { lang, dir } of LANGS) {
  if (!fs.existsSync(dir)) continue
  for (const folder of fs.readdirSync(dir)) {
    const folderPath = path.join(dir, folder)
    if (!fs.statSync(folderPath).isDirectory()) continue
    for (const f of fs.readdirSync(folderPath)) {
      if (!f.endsWith('.md')) continue
      const body = stripFrontmatter(fs.readFileSync(path.join(folderPath, f), 'utf8'))
      if (!body || SKIP_CLASS.test(body)) continue
      // Ground-truth section count = how many slide <svg> elements Marp renders
      // (match the opening tag, not CSS references to the attribute).
      const sections = (newMarp().render(wrap(body)).html.match(/<svg[^>]*data-marpit-svg/g) || []).length
      if (sections > 0) files.push({ lang, file: f, body, sections })
    }
  }
}

const pwMod = await import('/tmp/node_modules/playwright/index.js').catch(() => import('playwright'))
const chromium = pwMod.chromium || pwMod.default?.chromium
const browser = await chromium.launch()

/** Render a deck of the given bodies and return per-section overflow (px). */
async function measure(bodies) {
  const { html, css } = newMarp().render(wrap(bodies.join('\n\n---\n\n')))
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  await page.setContent(
    `<!doctype html><html><head><style>${css}</style></head><body>${html}</body></html>`,
    { waitUntil: 'networkidle' }
  )
  await page.waitForTimeout(150)
  const over = await page.$$eval('svg[data-marpit-svg] foreignObject > section', (secs) =>
    secs.map((s) => Math.round(s.scrollHeight - s.clientHeight))
  )
  await page.close()
  return over
}

// Walk the per-section overflow array, attributing `sections` entries to each
// file in order; a file's overflow = its tallest section.
function attribute(perSection) {
  let idx = 0
  return files.map(f => {
    const slice = perSection.slice(idx, idx + f.sections)
    idx += f.sections
    return Math.max(0, ...slice)
  })
}

const totalSections = files.reduce((a, f) => a + f.sections, 0)

// Pass 1: measure as-is.
const baseSections = await measure(files.map(f => f.body))
if (baseSections.length !== totalSections)
  console.warn(`⚠ section count mismatch: marp ${baseSections.length} vs counted ${totalSections} — mapping may drift`)
const baseOver = attribute(baseSections)

// Pass 2: re-render the whole deck with compact applied to the overflowers and
// read the same positions (file-top injection never changes the section count).
const compactBodies = files.map((f, i) => (baseOver[i] > threshold ? applyCompact(f.body) : f.body))
const compactOver = attribute(await measure(compactBodies))
await browser.close()

// Classify each overflowing file.
const map = { generatedAt: new Date().toISOString(), theme: path.basename(themePath), threshold }
for (const { lang } of LANGS) map[lang] = { compact: [], split: [], flag: [] }
const detail = []
files.forEach((f, i) => {
  if (baseOver[i] <= threshold) return
  const co = compactOver[i]
  let verdict
  if (co <= threshold) verdict = 'compact'
  else if (looksLikeMedia(f.body)) verdict = 'flag'
  else verdict = 'split'
  map[f.lang][verdict].push(f.file)
  detail.push({ lang: f.lang, file: f.file, verdict, over: baseOver[i], compactOver: co })
})
for (const { lang } of LANGS) for (const k of ['compact', 'split', 'flag']) map[lang][k].sort()

fs.writeFileSync(path.join(REPO_ROOT, 'tools', 'overflow_map.json'), JSON.stringify(map, null, 2) + '\n')

// Non-silent report.
console.log(`\nmeasured ${files.length} files / ${totalSections} slides · theme ${path.basename(themePath)} · threshold ${threshold}px`)
for (const { lang } of LANGS) {
  const m = map[lang]
  console.log(`[${lang}]  compact ${m.compact.length} · split ${m.split.length} · flag ${m.flag.length}`)
}
const show = (title, v) => {
  const rows = detail.filter(d => d.verdict === v).sort((a, b) => b.over - a.over)
  if (!rows.length) return
  console.log(`\n— ${title} —`)
  for (const d of rows) console.log(`  ${d.lang}  +${String(d.over).padStart(3)}px → +${d.compactOver}px  ${d.file}`)
}
show('compact (auto-applied at build)', 'compact')
show('split (needs restructuring · tier 2)', 'split')
show('flag (image/diagram · manual)', 'flag')
console.log(`\nwrote tools/overflow_map.json\n`)
