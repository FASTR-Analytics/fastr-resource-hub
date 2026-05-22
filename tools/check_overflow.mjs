#!/usr/bin/env node
/**
 * Slide overflow linter.
 *
 * Marp clips content that exceeds the 1280×720 slide box instead of shrinking
 * it, so an overpacked slide ships silently truncated. This renders a deck (or
 * any multi-slide markdown file) with a given theme and reports every slide
 * whose content is taller than the slide box, with the overflow amount.
 *
 * Usage:
 *   node tools/check_overflow.mjs <file.md> [theme-css] [--threshold=4]
 * Example:
 *   node tools/check_overflow.mjs samples/fastr-workshop-sample.md fastr-workshop.css
 *
 * Exit code: 0 = all slides fit, 1 = one or more overflow (CI-friendly).
 */
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

const REPO_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')

const args = process.argv.slice(2)
const positional = args.filter(a => !a.startsWith('--'))
const file = positional[0]
const themeCss = positional[1] || 'fastr-workshop.css'
const threshold = Number((args.find(a => a.startsWith('--threshold=')) || '--threshold=4').split('=')[1])

if (!file) {
  console.error('usage: node tools/check_overflow.mjs <file.md> [theme-css] [--threshold=N]')
  process.exit(2)
}

const mdPath = path.resolve(file)
const themePath = path.resolve(REPO_ROOT, themeCss)
const raw = fs.readFileSync(mdPath, 'utf8')

// Render with marp-core (resolved from web-app's deps), inline-SVG so every
// slide is a static <section> sized to the slide box — measurable, all visible.
const requireWeb = createRequire(path.join(REPO_ROOT, 'web-app', 'package.json'))
const { Marp } = requireWeb('@marp-team/marp-core')
const marp = new Marp({ inlineSVG: true })
marp.themeSet.add(fs.readFileSync(themePath, 'utf8'))
const { html, css } = marp.render(raw)

const pwMod = await import('/tmp/node_modules/playwright/index.js').catch(() => import('playwright'))
const chromium = pwMod.chromium || pwMod.default?.chromium

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
await page.setContent(`<!doctype html><html><head><style>${css}</style></head><body>${html}</body></html>`, { waitUntil: 'networkidle' })
await page.waitForTimeout(150)

const slides = await page.$$eval('svg[data-marpit-svg] foreignObject > section', (secs) =>
  secs.map((s) => ({ over: Math.round(s.scrollHeight - s.clientHeight), h: s.clientHeight }))
)
await browser.close()

// Pair each overflowing slide with its source heading for context.
const body = raw.replace(/^---\n[\s\S]*?\n---\n?/, '')
const headings = body.split(/\n---\s*\n/).map(block => {
  const h = block.match(/^#{1,3}\s+(.+)$/m)
  return h ? h[1].replace(/<[^>]+>/g, '').replace(/[*_`]/g, '').trim() : '(no heading)'
})

const overflows = slides
  .map((s, i) => ({ n: i + 1, over: s.over, heading: headings[i] || '(?)' }))
  .filter(s => s.over > threshold)

console.log(`\n${path.relative(REPO_ROOT, mdPath)} · theme ${path.basename(themePath)} · ${slides.length} slides`)
if (overflows.length === 0) {
  console.log(`✓ all slides fit within the 720px box (threshold ${threshold}px)\n`)
  process.exit(0)
}
console.log(`✗ ${overflows.length} slide(s) overflow:\n`)
for (const o of overflows) console.log(`  slide ${String(o.n).padStart(3)} · +${o.over}px · ${o.heading}`)
console.log('')
process.exit(1)
