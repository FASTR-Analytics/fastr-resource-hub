import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { getWorkshop, WorkshopConfig } from '../db/database.js'
import { buildMarkdown } from '../services/deckBuilder.js'
import { generatePDF } from '../services/pdfGenerator.js'
import { generatePPTX } from '../services/pptxGenerator.js'
import { renderMarkdown, getThemeCSS, getRepoRoot } from '../services/marpService.js'

const router = Router()

// ─────────────────────────────────────────────────────────────────────────────
// Session render cache for deck preview
// ─────────────────────────────────────────────────────────────────────────────
interface SessionCacheEntry {
  slides: Array<{
    id: string
    sessionId: string
    dayNumber: number
    sessionIndex: number
    slideIndex: number
    sessionName: string
    sessionType: string
    moduleId: string | null
    html: string
  }>
  timestamp: number
}

const sessionRenderCache = new Map<string, SessionCacheEntry>()
const SESSION_CACHE_MAX_SIZE = 200
const SESSION_CACHE_TTL = 30 * 60 * 1000  // 30 minutes

function getSessionCacheKey(sessionMarkdown: string): string {
  return crypto.createHash('md5').update(sessionMarkdown).digest('hex')
}

function cleanupSessionCache() {
  const now = Date.now()
  for (const [key, entry] of sessionRenderCache.entries()) {
    if (now - entry.timestamp > SESSION_CACHE_TTL) {
      sessionRenderCache.delete(key)
    }
  }
  if (sessionRenderCache.size > SESSION_CACHE_MAX_SIZE) {
    const entries = Array.from(sessionRenderCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
    const toRemove = entries.slice(0, entries.length - SESSION_CACHE_MAX_SIZE)
    for (const [key] of toRemove) {
      sessionRenderCache.delete(key)
    }
  }
}

setInterval(cleanupSessionCache, 5 * 60 * 1000)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Repo root path (different in dev vs prod due to TypeScript compilation)
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')

// Output directory for generated files
const OUTPUT_DIR = path.resolve(__dirname, '../../outputs')

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// ─────────────────────────────────────────────────────────────────────────────
// Build Endpoints
// ─────────────────────────────────────────────────────────────────────────────

// Supported languages
type Language = 'en' | 'fr'

// POST /api/export/:id/markdown - Build markdown deck
// Query params: ?language=fr (default: from workshop config or 'en')
router.post('/:id/markdown', async (req, res) => {
  try {
    const workshopId = req.params.id
    const language = (req.query.language as Language) || undefined
    const config = await getWorkshop(workshopId)

    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    const markdown = await buildMarkdown(workshopId, config, language)
    const langSuffix = language && language !== 'en' ? `_${language}` : ''
    const outputPath = path.join(OUTPUT_DIR, `${workshopId}_deck${langSuffix}.md`)
    fs.writeFileSync(outputPath, markdown, 'utf-8')

    res.json({
      success: true,
      markdown: markdown,
      path: outputPath,
    })
  } catch (error: any) {
    console.error('Error building markdown:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/export/:id/slides - Get slides with session metadata (with caching)
// Query params: ?language=fr (default: from workshop config or 'en')
router.post('/:id/slides', async (req, res) => {
  try {
    const workshopId = req.params.id
    const language = (req.query.language as Language) || undefined
    const config = await getWorkshop(workshopId)

    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    // Determine effective language
    const effectiveLang: Language = language || (config.workshop as any).language || 'en'

    // Use shared Marp service (initialized at startup, ~100ms faster)
    const fastrThemeCSS = getThemeCSS()

    // Build slides for each session with metadata
    const slidesData: any[] = []
    const numDays = config.schedule.days || 1
    let cacheHits = 0
    let cacheMisses = 0

    // Track cumulative session number across all days
    let sessionNumber = 0
    const { buildSessionMarkdown } = await import('../services/deckBuilder.js')

    for (let day = 1; day <= numDays; day++) {
      const dayKey = `day${day}`
      const sessions = config.schedule[dayKey] || []

      for (let sessionIdx = 0; sessionIdx < sessions.length; sessionIdx++) {
        const session = sessions[sessionIdx]
        const sessionId = session._id || `day${day}-session${sessionIdx}`

        // Increment session number only for content sessions (modules)
        const isContentSession = !!session.module
        if (isContentSession) {
          sessionNumber++
        }

        // Build markdown for this session
        const sessionMarkdown = await buildSessionMarkdown(session, config, day, isContentSession ? sessionNumber : undefined, effectiveLang)

        if (!sessionMarkdown) continue

        // Check cache for this session's rendered slides
        const cacheKey = getSessionCacheKey(sessionMarkdown + fastrThemeCSS)
        const cached = sessionRenderCache.get(cacheKey)

        if (cached) {
          // Use cached slides, but update metadata (sessionId, dayNumber, etc. may have changed)
          cacheHits++
          for (const cachedSlide of cached.slides) {
            slidesData.push({
              ...cachedSlide,
              id: `${sessionId}-slide${cachedSlide.slideIndex}`,
              sessionId: sessionId,
              dayNumber: day,
              sessionIndex: sessionIdx,
              sessionName: session.session,
              sessionType: session.type || (session.module ? 'module' : 'custom'),
              moduleId: session.module || null,
            })
          }
          cached.timestamp = Date.now()  // Keep it fresh
          continue
        }

        cacheMisses++

        // Render to HTML using shared Marp service
        const fullMarkdown = `---
marp: true
theme: fastr
paginate: true
---

${sessionMarkdown}`

        const { html, css } = renderMarkdown(fullMarkdown)

        // Marp renders slides as SVG elements - extract each one
        const svgRegex = /<svg[^>]*data-marpit-svg[^>]*>[\s\S]*?<\/svg>/g
        let match
        let slideIdx = 0
        const sessionSlides: any[] = []

        while ((match = svgRegex.exec(html)) !== null) {
          // Fix relative image paths to absolute URLs
          let svgHtml = match[0]
          svgHtml = svgHtml.replace(/\.\.\/\.\.\/resources\//g, '/resources/')
          svgHtml = svgHtml.replace(/\.\.\/resources\//g, '/resources/')
          svgHtml = svgHtml.replace(/&quot;\.\.\/\.\.\/resources\//g, '&quot;/resources/')
          svgHtml = svgHtml.replace(/&quot;\.\.\/resources\//g, '&quot;/resources/')

          // Create standalone HTML for this slide
          const slideHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base href="/">
  <style>
    ${css}
    ${fastrThemeCSS}
    html, body {
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: white;
    }
    .marpit {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    svg[data-marpit-svg] {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div class="marpit">${svgHtml}</div>
</body>
</html>`

          const slideData = {
            id: `${sessionId}-slide${slideIdx}`,
            sessionId: sessionId,
            dayNumber: day,
            sessionIndex: sessionIdx,
            slideIndex: slideIdx,
            sessionName: session.session,
            sessionType: session.type || (session.module ? 'module' : 'custom'),
            moduleId: session.module || null,
            html: slideHtml,
          }

          slidesData.push(slideData)
          sessionSlides.push({ slideIndex: slideIdx, html: slideHtml })
          slideIdx++
        }

        // Cache this session's rendered slides
        if (sessionSlides.length > 0) {
          sessionRenderCache.set(cacheKey, {
            slides: sessionSlides,
            timestamp: Date.now()
          })
        }
      }
    }

    res.json({
      success: true,
      slides: slidesData,
      totalSlides: slidesData.length,
      cacheStats: { hits: cacheHits, misses: cacheMisses }
    })
  } catch (error: any) {
    console.error('Error building slides:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/export/:id/html - Build HTML preview
// Query params: ?language=fr (default: from workshop config or 'en')
router.post('/:id/html', async (req, res) => {
  try {
    const workshopId = req.params.id
    const language = (req.query.language as Language) || undefined
    const config = await getWorkshop(workshopId)

    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    // Build markdown first
    const markdown = await buildMarkdown(workshopId, config, language)

    // Convert to HTML using shared Marp service
    const { html, css } = renderMarkdown(markdown)

    // Fix resource paths in the rendered HTML
    let fixedHtml = html
    fixedHtml = fixedHtml.replace(/\.\.\/\.\.\/resources\//g, '/resources/')
    fixedHtml = fixedHtml.replace(/\.\.\/resources\//g, '/resources/')
    fixedHtml = fixedHtml.replace(/&quot;\.\.\/\.\.\/resources\//g, '&quot;/resources/')
    fixedHtml = fixedHtml.replace(/&quot;\.\.\/resources\//g, '&quot;/resources/')

    // Create full HTML document with base tag for resource paths
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base href="/">
  <title>${config.workshop.name}</title>
  <style>${css}</style>
</head>
<body>
${fixedHtml}
</body>
</html>`

    const outputPath = path.join(OUTPUT_DIR, `${workshopId}_deck.html`)
    fs.writeFileSync(outputPath, fullHtml, 'utf-8')

    res.json({
      success: true,
      html: fullHtml,
      path: outputPath,
    })
  } catch (error: any) {
    console.error('Error building HTML:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/export/:id/pdf - Build PDF
// Query params: ?language=fr (default: from workshop config or 'en')
router.post('/:id/pdf', async (req, res) => {
  try {
    const workshopId = req.params.id
    const language = (req.query.language as Language) || undefined
    const config = await getWorkshop(workshopId)

    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    // Build markdown first
    const markdown = await buildMarkdown(workshopId, config, language)
    const langSuffix = language && language !== 'en' ? `_${language}` : ''
    const mdPath = path.join(OUTPUT_DIR, `${workshopId}_deck${langSuffix}.md`)
    fs.writeFileSync(mdPath, markdown, 'utf-8')

    // Generate PDF
    const pdfPath = path.join(OUTPUT_DIR, `${workshopId}_deck${langSuffix}.pdf`)
    await generatePDF(mdPath, pdfPath)

    res.json({
      success: true,
      path: pdfPath,
    })
  } catch (error: any) {
    console.error('Error building PDF:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/export/:id/pptx - Build PowerPoint
// Query params: ?language=fr (default: from workshop config or 'en')
router.post('/:id/pptx', async (req, res) => {
  try {
    const workshopId = req.params.id
    const language = (req.query.language as Language) || undefined
    const config = await getWorkshop(workshopId)

    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    // Build markdown first
    const markdown = await buildMarkdown(workshopId, config, language)

    // Generate PPTX
    const langSuffix = language && language !== 'en' ? `_${language}` : ''
    const pptxPath = path.join(OUTPUT_DIR, `${workshopId}_deck${langSuffix}.pptx`)
    await generatePPTX(markdown, config, pptxPath)

    res.json({
      success: true,
      path: pptxPath,
    })
  } catch (error: any) {
    console.error('Error building PPTX:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Download Endpoints
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/export/:id/download/:format - Download generated file
router.get('/:id/download/:format', (req, res) => {
  try {
    const { id, format } = req.params

    const extensions: Record<string, string> = {
      markdown: 'md',
      md: 'md',
      html: 'html',
      pdf: 'pdf',
      pptx: 'pptx',
    }

    const ext = extensions[format]
    if (!ext) {
      return res.status(400).json({ error: 'Invalid format' })
    }

    const filePath = path.join(OUTPUT_DIR, `${id}_deck.${ext}`)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found. Build it first.' })
    }

    res.download(filePath, `${id}_deck.${ext}`)
  } catch (error: any) {
    console.error('Error downloading file:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/export/:id/outputs - List all generated files for a workshop
router.get('/:id/outputs', (req, res) => {
  try {
    const workshopId = req.params.id
    const outputs: any[] = []

    if (!fs.existsSync(OUTPUT_DIR)) {
      return res.json(outputs)
    }

    const files = fs.readdirSync(OUTPUT_DIR)
    for (const file of files) {
      if (file.startsWith(workshopId)) {
        const filePath = path.join(OUTPUT_DIR, file)
        const stats = fs.statSync(filePath)
        outputs.push({
          name: file,
          format: path.extname(file).replace('.', ''),
          size: stats.size,
          modified: stats.mtime,
        })
      }
    }

    res.json(outputs.sort((a, b) => b.modified.getTime() - a.modified.getTime()))
  } catch (error: any) {
    console.error('Error listing outputs:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
