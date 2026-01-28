import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getWorkshop, WorkshopConfig } from '../db/database.js'
import { buildMarkdown } from '../services/deckBuilder.js'
import { generatePDF } from '../services/pdfGenerator.js'
import { generatePPTX } from '../services/pptxGenerator.js'

const router = Router()

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

// POST /api/export/:id/markdown - Build markdown deck
router.post('/:id/markdown', async (req, res) => {
  try {
    const workshopId = req.params.id
    const config = getWorkshop(workshopId)

    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    const markdown = await buildMarkdown(workshopId, config)
    const outputPath = path.join(OUTPUT_DIR, `${workshopId}_deck.md`)
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

// POST /api/export/:id/slides - Get slides with session metadata
router.post('/:id/slides', async (req, res) => {
  try {
    const workshopId = req.params.id
    const config = getWorkshop(workshopId)

    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    // Import dependencies
    const MarpModule = await import('@marp-team/marp-core')
    const Marp = MarpModule.default || MarpModule.Marp || MarpModule
    const marp = new Marp({ html: true })

    // Load FASTR theme
    const themePath = path.join(REPO_ROOT, 'fastr-theme.css')
    let fastrThemeCSS = ''
    if (fs.existsSync(themePath)) {
      fastrThemeCSS = fs.readFileSync(themePath, 'utf-8')
      marp.themeSet.add(fastrThemeCSS)
    }

    // Build slides for each session with metadata
    const slidesData: any[] = []
    const numDays = config.schedule.days || 1

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
        const sessionMarkdown = await buildSessionMarkdown(session, config, day, isContentSession ? sessionNumber : undefined)

        if (!sessionMarkdown) continue

        // Render to HTML
        const fullMarkdown = `---
marp: true
theme: fastr
paginate: true
---

${sessionMarkdown}`

        const { html, css } = marp.render(fullMarkdown)

        // Marp renders slides as SVG elements - extract each one
        // Structure: <div class="marpit"><svg>...</svg><svg>...</svg>...</div>
        const svgRegex = /<svg[^>]*data-marpit-svg[^>]*>[\s\S]*?<\/svg>/g
        let match
        let slideIdx = 0

        while ((match = svgRegex.exec(html)) !== null) {
          // Fix relative image paths to absolute URLs
          let svgHtml = match[0]
          svgHtml = svgHtml.replace(/\.\.\/\.\.\/resources\//g, '/resources/')
          svgHtml = svgHtml.replace(/\.\.\/resources\//g, '/resources/')
          svgHtml = svgHtml.replace(/&quot;\.\.\/\.\.\/resources\//g, '&quot;/resources/')
          svgHtml = svgHtml.replace(/&quot;\.\.\/resources\//g, '&quot;/resources/')

          // Create standalone HTML for this slide
          // Include both Marp CSS and FASTR theme CSS
          // Add base tag so relative URLs resolve correctly in srcDoc iframe
          const baseUrl = `http://localhost:${process.env.PORT || 3001}`
          const slideHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base href="${baseUrl}/">
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

          slidesData.push({
            id: `${sessionId}-slide${slideIdx}`,
            sessionId: sessionId,
            dayNumber: day,
            sessionIndex: sessionIdx,
            slideIndex: slideIdx,
            sessionName: session.session,
            sessionType: session.type || (session.module ? 'module' : 'custom'),
            moduleId: session.module || null,
            html: slideHtml,
          })

          slideIdx++
        }
      }
    }

    res.json({
      success: true,
      slides: slidesData,
      totalSlides: slidesData.length,
    })
  } catch (error: any) {
    console.error('Error building slides:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/export/:id/html - Build HTML preview
router.post('/:id/html', async (req, res) => {
  try {
    const workshopId = req.params.id
    const config = getWorkshop(workshopId)

    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    // Build markdown first
    const markdown = await buildMarkdown(workshopId, config)

    // Convert to HTML using Marp
    const MarpModule = await import('@marp-team/marp-core')
    const Marp = MarpModule.default || MarpModule.Marp || MarpModule
    const marp = new Marp({ html: true })

    // Load FASTR theme if it exists
    const themePath = path.join(REPO_ROOT, 'fastr-theme.css')
    if (fs.existsSync(themePath)) {
      const themeCSS = fs.readFileSync(themePath, 'utf-8')
      marp.themeSet.add(themeCSS)
    }

    const { html, css } = marp.render(markdown)

    // Create full HTML document
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${config.workshop.name}</title>
  <style>${css}</style>
</head>
<body>
${html}
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
router.post('/:id/pdf', async (req, res) => {
  try {
    const workshopId = req.params.id
    const config = getWorkshop(workshopId)

    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    // Build markdown first
    const markdown = await buildMarkdown(workshopId, config)
    const mdPath = path.join(OUTPUT_DIR, `${workshopId}_deck.md`)
    fs.writeFileSync(mdPath, markdown, 'utf-8')

    // Generate PDF
    const pdfPath = path.join(OUTPUT_DIR, `${workshopId}_deck.pdf`)
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
router.post('/:id/pptx', async (req, res) => {
  try {
    const workshopId = req.params.id
    const config = getWorkshop(workshopId)

    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    // Build markdown first
    const markdown = await buildMarkdown(workshopId, config)

    // Generate PPTX
    const pptxPath = path.join(OUTPUT_DIR, `${workshopId}_deck.pptx`)
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
