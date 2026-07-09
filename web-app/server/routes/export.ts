import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { getWorkshop, getCustomSlides, WorkshopConfig } from '../db/database.js'
import { buildMarkdown, materializeExternalImages, countRenderedSlides, hashLibrarySource, SlideChunkSource } from '../services/deckBuilder.js'
import { generatePDF } from '../services/pdfGenerator.js'
import { generatePPTX } from '../services/pptxGenerator.js'
import { renderMarkdown, getThemeCSS, getThemeCSSByName, getRepoRoot } from '../services/marpService.js'
import { getThemeSpec } from '../services/themeTokens.js'

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

const UNKNOWN_SOURCE: SlideChunkSource = { ref: null, kind: 'generated', editable: false, overridden: false }

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
type Language = 'en' | 'fr' | 'pt'

// POST /api/export/:id/preflight - Deck health check (run before export)
router.post('/:id/preflight', async (req, res) => {
  try {
    const language = (req.query.language as Language) || undefined
    const config = await getWorkshop(req.params.id)
    if (!config) return res.status(404).json({ error: 'Workshop not found' })

    const { runPreflight } = await import('../services/deckPreflight.js')
    const result = await runPreflight(req.params.id, config, language)
    res.json(result)
  } catch (error: any) {
    console.error('Error running preflight:', error)
    res.status(500).json({ error: error.message })
  }
})

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
    // Select theme based on workshop config; the raw theme CSS is injected
    // after Marp's resolved CSS (overrides win) and salts the render cache.
    const themeSpec = getThemeSpec((config.workshop as any).theme)
    const fastrThemeCSS = getThemeCSSByName(themeSpec.id)

    // Build slides for each session with metadata
    const slidesData: any[] = []
    const numDays = config.schedule.days || 1
    let cacheHits = 0
    let cacheMisses = 0

    // Track cumulative session number across all days
    let sessionNumber = 0
    const { buildSessionMarkdownWithSources } = await import('../services/deckBuilder.js')

    // Pre-fetch workshop-scoped custom slides so each per-session build can
    // resolve `custom_slides/{filename}` refs without per-slide DB queries.
    const customSlideRows = await getCustomSlides(workshopId)
    const customSlideMap = new Map<string, string>(
      customSlideRows.map(r => [r.filename, r.content])
    )

    // Stale-fork detection: for each fork that recorded its source hash, compare
    // against the current library source. A differing hash means the library
    // slide changed since it was forked. Keyed by the original source ref.
    const staleByRef = new Map<string, boolean>()
    for (const row of customSlideRows) {
      if (row.source_ref && row.source_hash) {
        const current = await hashLibrarySource(row.source_ref, effectiveLang)
        if (current !== null) staleByRef.set(row.source_ref, current !== row.source_hash)
      }
    }

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

        // Build markdown for this session (with per-chunk source provenance)
        const built = await buildSessionMarkdownWithSources(session, config, day, isContentSession ? sessionNumber : undefined, effectiveLang, customSlideMap)

        if (!built) continue
        const { markdown: sessionMarkdown, chunks } = built

        // One provenance entry per expected rendered slide. If the expected
        // count disagrees with what Marp actually renders, mark the whole
        // session non-editable rather than risk targeting the wrong source.
        const flatSources: SlideChunkSource[] = []
        for (const chunk of chunks) {
          const n = countRenderedSlides(chunk.content)
          for (let i = 0; i < n; i++) flatSources.push(chunk.source)
        }
        const sourceForSlide = (slideIndex: number, totalSlides: number): SlideChunkSource => {
          if (flatSources.length !== totalSlides) {
            if (slideIndex === 0) {
              console.warn(`Slide/source count mismatch for session "${session.session}" (expected ${flatSources.length}, rendered ${totalSlides}) — marking non-editable`)
            }
            return UNKNOWN_SOURCE
          }
          return flatSources[slideIndex] ?? UNKNOWN_SOURCE
        }
        // A fork is stale only if it's overridden AND its source ref recorded a
        // now-differing hash (unknown/null-hash forks are never stale).
        const staleForSource = (source: SlideChunkSource): boolean =>
          !!(source.overridden && source.ref && staleByRef.get(source.ref))

        // Check cache for this session's rendered slides
        const cacheKey = getSessionCacheKey(sessionMarkdown + fastrThemeCSS)
        const cached = sessionRenderCache.get(cacheKey)

        if (cached) {
          // Use cached slides, but update metadata (sessionId, dayNumber, etc. may have changed)
          cacheHits++
          for (const cachedSlide of cached.slides) {
            const source = sourceForSlide(cachedSlide.slideIndex, cached.slides.length)
            slidesData.push({
              ...cachedSlide,
              id: `${sessionId}-slide${cachedSlide.slideIndex}`,
              sessionId: sessionId,
              dayNumber: day,
              sessionIndex: sessionIdx,
              sessionName: session.session,
              sessionType: session.type || (session.module ? 'module' : 'custom'),
              moduleId: session.module || null,
              sourceRef: source.ref,
              sourceKind: source.kind,
              editable: source.editable,
              overridden: source.overridden,
              stale: staleForSource(source),
            })
          }
          cached.timestamp = Date.now()  // Keep it fresh
          continue
        }

        cacheMisses++

        // Render to HTML using shared Marp service
        const fullMarkdown = `---
marp: true
theme: ${themeSpec.marpTheme}
paginate: true
---

${sessionMarkdown}`

        const { html, css } = renderMarkdown(fullMarkdown)

        // Marp renders slides as SVG elements - extract each one
        const svgRegex = /<svg[^>]*data-marpit-svg[^>]*>[\s\S]*?<\/svg>/g
        const svgMatches = html.match(svgRegex) || []
        let slideIdx = 0
        const sessionSlides: any[] = []

        for (const svgMatch of svgMatches) {
          // Fix relative image paths to absolute URLs
          let svgHtml = svgMatch
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

          const source = sourceForSlide(slideIdx, svgMatches.length)
          const slideData = {
            id: `${sessionId}-slide${slideIdx}`,
            sessionId: sessionId,
            dayNumber: day,
            sessionIndex: sessionIdx,
            slideIndex: slideIdx,
            sessionName: session.session,
            sessionType: session.type || (session.module ? 'module' : 'custom'),
            moduleId: session.module || null,
            sourceRef: source.ref,
            sourceKind: source.kind,
            editable: source.editable,
            overridden: source.overridden,
            stale: staleForSource(source),
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
    let markdown = await buildMarkdown(workshopId, config, language)

    // Materialize external slide images (API URLs → filesystem paths)
    const materialized = materializeExternalImages(markdown)
    markdown = materialized.markdown

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
    let markdown = await buildMarkdown(workshopId, config, language)

    // Materialize external slide images (API URLs → filesystem paths)
    const materialized = materializeExternalImages(markdown)
    markdown = materialized.markdown

    // Generate PPTX
    const langSuffix = language && language !== 'en' ? `_${language}` : ''
    const pptxPath = path.join(OUTPUT_DIR, `${workshopId}_deck${langSuffix}.pptx`)
    const { warnings } = await generatePPTX(markdown, config, pptxPath)

    res.json({
      success: true,
      path: pptxPath,
      warnings,
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

// ─────────────────────────────────────────────────────────────────────────────
// Storage Management Endpoints
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/export/storage - List ALL output files with sizes
router.get('/storage', (_req, res) => {
  try {
    const outputs: Array<{ name: string; format: string; size: number; modified: string }> = []

    if (!fs.existsSync(OUTPUT_DIR)) {
      return res.json({ files: outputs, totalSize: 0 })
    }

    const files = fs.readdirSync(OUTPUT_DIR)
    let totalSize = 0

    for (const file of files) {
      const filePath = path.join(OUTPUT_DIR, file)
      const stats = fs.statSync(filePath)
      if (!stats.isFile()) continue
      totalSize += stats.size
      outputs.push({
        name: file,
        format: path.extname(file).replace('.', ''),
        size: stats.size,
        modified: stats.mtime.toISOString(),
      })
    }

    outputs.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
    res.json({ files: outputs, totalSize })
  } catch (error: any) {
    console.error('Error listing storage:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/export/outputs/:filename - Delete a single output file
router.delete('/outputs/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    // Prevent path traversal
    if (filename.includes('/') || filename.includes('..')) {
      return res.status(400).json({ error: 'Invalid filename' })
    }
    const filePath = path.join(OUTPUT_DIR, filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    fs.unlinkSync(filePath)
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting output:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/export/outputs - Delete all output files
router.delete('/outputs', (_req, res) => {
  try {
    if (!fs.existsSync(OUTPUT_DIR)) {
      return res.json({ success: true, deleted: 0 })
    }

    const files = fs.readdirSync(OUTPUT_DIR)
    let deleted = 0
    for (const file of files) {
      const filePath = path.join(OUTPUT_DIR, file)
      const stats = fs.statSync(filePath)
      if (stats.isFile()) {
        fs.unlinkSync(filePath)
        deleted++
      }
    }

    res.json({ success: true, deleted })
  } catch (error: any) {
    console.error('Error clearing outputs:', error)
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
