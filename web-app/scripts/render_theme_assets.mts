// Render the FASTR 2026 theme background assets: the official FASTR waves
// pattern (waves_for_dark_themes.png — white line-waves with alpha) composited
// over the deep-green field, for the dark covers and section dividers.
// One-time generation; PNGs are committed. Re-run to regenerate:
//   cd web-app && npx tsx scripts/render_theme_assets.mts
import puppeteer from 'puppeteer'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BG_DIR = path.resolve(__dirname, '../../resources/backgrounds')
// Inline the waves as a data URI — a file:// <img> doesn't reliably load in the
// headless render.
const WAVES = 'data:image/png;base64,' +
  fs.readFileSync(path.join(BG_DIR, 'waves_for_dark_themes.png')).toString('base64')
const DEEP_GREEN = '#09544F'

// The waves are subtle; the same field works for both the cover and the section
// divider (different slide types, different text, so no repetition problem).
const field = (extra = '') => `
  <div style="width:2560px;height:1440px;background:${DEEP_GREEN};position:relative;overflow:hidden;">
    ${extra}
    <img src="${WAVES}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
  </div>`

const pages: Record<string, string> = {
  'section_slide_2026.png': field(),
  // Cover: a soft darker sweep top-right for depth, then the waves on top.
  'cover_slide_2026.png': field(
    `<div style="position:absolute;top:-400px;right:-400px;width:1400px;height:1400px;border-radius:50%;background:#063D39;opacity:.5;"></div>`,
  ),
}

const browser = await puppeteer.launch({
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 2560, height: 1440 })

for (const [file, body] of Object.entries(pages)) {
  await page.setContent(`<!DOCTYPE html><html><body style="margin:0">${body}</body></html>`)
  const out = path.join(BG_DIR, file)
  await page.screenshot({ path: out as `${string}.png`, clip: { x: 0, y: 0, width: 2560, height: 1440 } })
  console.log('✓', out)
}

await browser.close()
