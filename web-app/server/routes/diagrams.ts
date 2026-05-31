import { Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { generateDiagram, type DiagramRequest } from '../services/diagramTemplates.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

// Repo root — matches every other route (`../../../..` in prod after compile,
// `../../..` in dev). Pre-fix: only used `../..` here, which put SVGs in
// `web-app/resources/` instead of `<repo>/resources/` and broke the image refs
// in the generated slide markdown.
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')

// POST /api/diagrams/preview — generate SVG for live preview
router.post('/preview', (req, res) => {
  try {
    const request = req.body as DiagramRequest
    if (!request.template) {
      return res.status(400).json({ error: 'Missing template type' })
    }
    const svg = generateDiagram(request)
    res.json({ svg })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// POST /api/diagrams/save — generate and save SVG to disk
router.post('/save', (req, res) => {
  try {
    const { config, filename, language } = req.body as {
      config: DiagramRequest
      filename: string
      language: 'en' | 'fr' | 'pt' | 'both'
    }

    if (!config || !filename) {
      return res.status(400).json({ error: 'Missing config or filename' })
    }

    // Sanitize filename
    const safeName = filename.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/\.svg$/, '') + '.svg'

    const svg = generateDiagram(config)
    const paths: string[] = []

    if (language === 'en' || language === 'both') {
      const enPath = path.join(REPO_ROOT, 'resources/diagrams', safeName)
      fs.mkdirSync(path.dirname(enPath), { recursive: true })
      fs.writeFileSync(enPath, svg, 'utf-8')
      paths.push(`resources/diagrams/${safeName}`)
    }

    if (language === 'fr' || language === 'both') {
      const frPath = path.join(REPO_ROOT, 'resources/diagrams_fr', safeName)
      fs.mkdirSync(path.dirname(frPath), { recursive: true })
      fs.writeFileSync(frPath, svg, 'utf-8')
      paths.push(`resources/diagrams_fr/${safeName}`)
    }

    res.json({ paths, filename: safeName })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// GET /api/diagrams/templates — return template metadata for UI
router.get('/templates', (_req, res) => {
  res.json({
    templates: [
      { id: 'stepper', name: 'Numbered Stepper', description: 'Vertical numbered list with descriptions', minItems: 2, maxItems: 8 },
      { id: 'chevron', name: 'Chevron Rows', description: 'Horizontal colored bars with icons', minItems: 2, maxItems: 8 },
      { id: 'cards', name: 'Card Grid', description: 'Side-by-side cards with icons and text', minItems: 2, maxItems: 4 },
      { id: 'comparison', name: 'Comparison', description: 'Side-by-side do/don\'t or before/after', minItems: 0, maxItems: 0 },
      { id: 'flow', name: 'Horizontal Flow', description: 'Process steps connected by arrows', minItems: 2, maxItems: 6 },
      { id: 'layers', name: 'Concentric Layers', description: 'Nested rectangles from outer to inner', minItems: 2, maxItems: 5 },
      { id: 'hub', name: 'Hub & Spokes', description: 'Central concept with radiating branches', minItems: 0, maxItems: 0 },
      { id: 'timeline', name: 'Timeline', description: 'Horizontal milestones with descriptions', minItems: 3, maxItems: 6 },
    ]
  })
})

export default router
