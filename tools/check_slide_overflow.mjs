#!/usr/bin/env node

/**
 * Slide Overflow Detector
 *
 * Uses Puppeteer + Marp to render every slide in core_content/ and
 * core_content_fr/, then checks whether any <section> element's
 * scrollHeight exceeds its clientHeight (pixel-accurate overflow).
 *
 * Usage:  node tools/check_slide_overflow.mjs [--verbose]
 * Requires: npm packages installed in web-app/ (puppeteer, @marp-team/marp-core)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { createRequire } from 'module'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '..')

// Resolve packages from web-app/node_modules
const webAppDir = path.join(REPO_ROOT, 'web-app')
const require = createRequire(path.join(webAppDir, 'package.json'))

let Marp, puppeteer
try {
  Marp = require('@marp-team/marp-core').Marp
  // Puppeteer has ESM exports — use dynamic import with file URL
  const puppeteerPath = require.resolve('puppeteer')
  const esmPath = puppeteerPath.replace('/lib/cjs/', '/lib/esm/')
  puppeteer = (await import(pathToFileURL(esmPath).href)).default
} catch (e) {
  console.error('ERROR: Cannot load dependencies from web-app/node_modules/')
  console.error('Run: cd web-app && npm install')
  console.error(e.message)
  process.exit(1)
}

const VERBOSE = process.argv.includes('--verbose')

// ---------------------------------------------------------------------------
// 1. Initialize Marp with FASTR theme
// ---------------------------------------------------------------------------
const marp = new Marp({ html: true })

const themePath = path.join(REPO_ROOT, 'fastr-theme.css')
if (fs.existsSync(themePath)) {
  const themeCSS = fs.readFileSync(themePath, 'utf-8')
  marp.themeSet.add(themeCSS)
} else {
  console.error('WARNING: fastr-theme.css not found at repo root — using default theme')
}

// ---------------------------------------------------------------------------
// 2. Collect all .md slide files
// ---------------------------------------------------------------------------
function collectSlideFiles(dir) {
  const files = []
  if (!fs.existsSync(dir)) return files

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...collectSlideFiles(fullPath))
    } else if (entry.name.endsWith('.md') && !entry.name.startsWith('_')) {
      // Read first few lines to check for marp frontmatter
      const head = fs.readFileSync(fullPath, 'utf-8').slice(0, 200)
      if (head.includes('marp: true')) {
        files.push(fullPath)
      }
    }
  }
  return files
}

const contentDirs = [
  path.join(REPO_ROOT, 'core_content'),
  path.join(REPO_ROOT, 'core_content_fr'),
]

console.log('')
console.log('FASTR Slide Overflow Check')
console.log('==========================')
console.log('')

const slideFiles = []
for (const dir of contentDirs) {
  const relDir = path.relative(REPO_ROOT, dir)
  if (fs.existsSync(dir)) {
    const found = collectSlideFiles(dir)
    slideFiles.push(...found)
    console.log(`Scanning ${relDir}/ ... ${found.length} files`)
  } else {
    console.log(`Scanning ${relDir}/ ... not found, skipping`)
  }
}

console.log(`\nFound ${slideFiles.length} slide files.`)
console.log('\nRendering and checking overflow...\n')

// ---------------------------------------------------------------------------
// 3. Launch Puppeteer (one browser, one page)
// ---------------------------------------------------------------------------
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 720 })

// ---------------------------------------------------------------------------
// 4. Check each file for overflow
// ---------------------------------------------------------------------------
const overflows = []
let filesChecked = 0

for (const filePath of slideFiles) {
  const markdown = fs.readFileSync(filePath, 'utf-8')
  const relPath = path.relative(REPO_ROOT, filePath)
  filesChecked++

  // Render through Marp
  const { html, css } = marp.render(markdown)

  // Build a full HTML document with base href for images
  const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <base href="file://${REPO_ROOT}/">
  <style>${css}</style>
</head>
<body>
${html}
</body>
</html>`

  await page.setContent(fullHTML, { waitUntil: 'load' })

  // Wait briefly for images/SVGs to render
  await page.evaluate(() => new Promise(r => setTimeout(r, 50)))

  // Check every <section> for overflow
  const results = await page.evaluate(() => {
    const sections = document.querySelectorAll('section')
    const items = []
    sections.forEach((s, i) => {
      const scrollH = s.scrollHeight
      const clientH = s.clientHeight
      if (scrollH > clientH) {
        // Extract slide title from first heading
        const heading = s.querySelector('h1, h2, h3, h4')
        const title = heading ? heading.textContent.trim() : '(no heading)'
        items.push({
          index: i + 1,
          title,
          overflow: scrollH - clientH,
          scrollH,
          clientH,
        })
      }
    })
    return items
  })

  if (results.length > 0) {
    for (const r of results) {
      overflows.push({ file: relPath, ...r })
      console.log(`OVERFLOW  ${relPath}`)
      console.log(`          Slide ${r.index}: "${r.title}" — overflows by ${r.overflow}px`)
    }
  } else if (VERBOSE) {
    console.log(`  OK      ${relPath}`)
  }
}

// ---------------------------------------------------------------------------
// 5. Summary
// ---------------------------------------------------------------------------
await browser.close()

console.log('')
console.log('==========================')
if (overflows.length === 0) {
  console.log(`No overflowing slides found in ${filesChecked} files.`)
} else {
  console.log(`${overflows.length} overflowing slide${overflows.length === 1 ? '' : 's'} found in ${filesChecked} files.`)
}
console.log('')

process.exit(overflows.length > 0 ? 1 : 0)
