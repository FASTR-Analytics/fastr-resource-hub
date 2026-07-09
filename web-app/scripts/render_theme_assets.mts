// Render the FASTR 2026 theme background assets (deep green + lime concentric
// arcs, per the Kenya Deck Redesign mockups) to resources/backgrounds/.
// One-time generation; PNGs are committed. Re-run to regenerate:
//   cd web-app && npx tsx scripts/render_theme_assets.mts
import puppeteer from 'puppeteer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../../resources/backgrounds')

const DEEP_GREEN = '#09544F'
const LIME = '#D0CB17'

/** Concentric arc quarter-rings anchored at a corner (the brand motif). */
function arcs(cx: number, cy: number, count: number, gap: number, r0: number, opacity: number) {
  let circles = ''
  for (let i = 0; i < count; i++) {
    circles += `<circle cx="${cx}" cy="${cy}" r="${r0 + i * gap}"/>`
  }
  return `<g fill="none" stroke="${LIME}" stroke-width="8" opacity="${opacity}">${circles}</g>`
}

const pages: Record<string, string> = {
  // Section divider: deep green field, lime arc motif bottom-right (mockup 1b)
  'section_slide_2026.png': `
    <div style="width:2560px;height:1440px;background:${DEEP_GREEN};position:relative;overflow:hidden;">
      <svg viewBox="0 0 2560 1440" style="position:absolute;inset:0;width:100%;height:100%;">
        ${arcs(2560, 1440, 9, 90, 180, 0.16)}
        ${arcs(0, 0, 5, 90, 160, 0.05)}
      </svg>
    </div>`,
  // Cover: same family, larger sweep + a soft darker quarter for depth (mockup 1a/1f)
  'cover_slide_2026.png': `
    <div style="width:2560px;height:1440px;background:${DEEP_GREEN};position:relative;overflow:hidden;">
      <svg viewBox="0 0 2560 1440" style="position:absolute;inset:0;width:100%;height:100%;">
        <circle cx="2560" cy="0" r="900" fill="#063D39" opacity="0.55"/>
        ${arcs(2560, 0, 11, 85, 200, 0.14)}
        ${arcs(760, 1440, 6, 80, 120, 0.06)}
      </svg>
    </div>`,
}

const browser = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 2560, height: 1440 })

for (const [file, body] of Object.entries(pages)) {
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0">${body}</body></html>`)
  const out = path.join(OUT_DIR, file)
  await page.screenshot({ path: out as `${string}.png`, clip: { x: 0, y: 0, width: 2560, height: 1440 } })
  console.log('✓', out)
}

await browser.close()
