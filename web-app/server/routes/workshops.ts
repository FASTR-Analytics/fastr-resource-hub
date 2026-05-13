import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import {
  getAllWorkshops,
  getWorkshop,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  setWorkshopLocked,
  getCustomSlides,
  saveCustomSlide,
  deleteCustomSlide,
  WorkshopConfig
} from '../db/database.js'
import { resolveLibrarySlideContent, type Language } from '../services/deckBuilder.js'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// In dev: __dirname is web-app/server/routes, go up 3 levels
// In prod: __dirname is web-app/dist/server/routes, go up 4 levels
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')
const WORKSHOPS_PATH = path.join(REPO_ROOT, 'workshops')

// ─────────────────────────────────────────────────────────────────────────────
// Import from file system
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/workshops/import - Import workshops from file system
router.post('/import', async (_req, res) => {
  try {
    if (!fs.existsSync(WORKSHOPS_PATH)) {
      return res.status(404).json({ error: 'Workshops folder not found' })
    }

    const imported: string[] = []
    const skipped: string[] = []

    const folders = fs.readdirSync(WORKSHOPS_PATH)
    for (const folder of folders) {
      const workshopPath = path.join(WORKSHOPS_PATH, folder)
      const yamlPath = path.join(workshopPath, 'workshop.yaml')

      if (!fs.statSync(workshopPath).isDirectory()) continue
      if (!fs.existsSync(yamlPath)) continue

      // Check if already exists
      const existing = await getWorkshop(folder)
      if (existing) {
        skipped.push(folder)
        continue
      }

      // Read and parse YAML
      const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
      const config = yaml.load(yamlContent) as WorkshopConfig

      // Import into database
      await createWorkshop(folder, config)
      imported.push(folder)
    }

    res.json({
      success: true,
      imported,
      skipped,
      message: `Imported ${imported.length} workshop(s), skipped ${skipped.length} existing`
    })
  } catch (error: any) {
    console.error('Error importing workshops:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Workshop CRUD
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/workshops - List all workshops
router.get('/', async (_req, res) => {
  try {
    const workshops = await getAllWorkshops()
    res.json(workshops)
  } catch (error: any) {
    console.error('Error listing workshops:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/workshops/:id - Get workshop config
router.get('/:id', async (req, res) => {
  try {
    const config = await getWorkshop(req.params.id)
    if (!config) {
      return res.status(404).json({ error: 'Workshop not found' })
    }
    res.json(config)
  } catch (error: any) {
    console.error('Error getting workshop:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/workshops - Create new workshop
router.post('/', async (req, res) => {
  try {
    const { id, config } = req.body as { id: string; config: WorkshopConfig }

    if (!id || !config) {
      return res.status(400).json({ error: 'Missing id or config' })
    }

    // Check if workshop already exists
    const existing = await getWorkshop(id)
    if (existing) {
      return res.status(409).json({ error: 'Workshop already exists' })
    }

    await createWorkshop(id, config)
    res.status(201).json({ success: true, id })
  } catch (error: any) {
    console.error('Error creating workshop:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/workshops/:id - Update workshop config
router.put('/:id', async (req, res) => {
  try {
    const config = req.body as WorkshopConfig

    // Check if workshop exists
    const existing = await getWorkshop(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    await updateWorkshop(req.params.id, config)
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error updating workshop:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/workshops/:id - Delete workshop
router.delete('/:id', async (req, res) => {
  try {
    const existing = await getWorkshop(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    const deleted = await deleteWorkshop(req.params.id)
    if (!deleted) {
      return res.status(403).json({ error: 'Workshop is locked and cannot be deleted' })
    }
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting workshop:', error)
    res.status(500).json({ error: error.message })
  }
})

// PATCH /api/workshops/:id/lock - Lock or unlock workshop
router.patch('/:id/lock', async (req, res) => {
  try {
    const { locked } = req.body
    const existing = await getWorkshop(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    await setWorkshopLocked(req.params.id, !!locked)
    res.json({ success: true, locked: !!locked })
  } catch (error: any) {
    console.error('Error updating workshop lock:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Custom Slides
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/workshops/:id/custom-slides - List custom slides
router.get('/:id/custom-slides', async (req, res) => {
  try {
    const slides = await getCustomSlides(req.params.id)
    res.json(slides)
  } catch (error: any) {
    console.error('Error getting custom slides:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/workshops/:id/custom-slides - Save custom slide
router.post('/:id/custom-slides', async (req, res) => {
  try {
    const { filename, content } = req.body

    if (!filename || !content) {
      return res.status(400).json({ error: 'Missing filename or content' })
    }

    await saveCustomSlide(req.params.id, filename, content)
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error saving custom slide:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/workshops/:id/custom-slides/:filename - Delete custom slide
router.delete('/:id/custom-slides/:filename', async (req, res) => {
  try {
    await deleteCustomSlide(req.params.id, req.params.filename)
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting custom slide:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Slide content (read-only) — resolves a session.slides[] ref to its raw
// markdown source. Used by EditSessionModal to pre-populate the editor when
// forking a library slide.
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/workshops/:id/slide-content?ref=...&language=en|fr
router.get('/:id/slide-content', async (req, res) => {
  try {
    const ref = String(req.query.ref || '')
    if (!ref) return res.status(400).json({ error: 'Missing ref' })

    const config = await getWorkshop(req.params.id)
    if (!config) return res.status(404).json({ error: 'Workshop not found' })

    const queryLang = req.query.language ? String(req.query.language) : null
    const configLang = (config.workshop as any).language
    const language: Language = (queryLang === 'fr' || queryLang === 'en')
      ? queryLang
      : (configLang === 'fr' ? 'fr' : 'en')

    // For `custom_slides/...` refs, pre-build the lookup map from DB.
    let customSlideMap: Map<string, string> | undefined
    if (ref.startsWith('custom_slides/')) {
      const slides = await getCustomSlides(req.params.id)
      customSlideMap = new Map(slides.map(s => [s.filename, s.content]))
    }

    const resolved = resolveLibrarySlideContent(ref, language, customSlideMap)
    if (!resolved) return res.status(404).json({ error: 'Slide not resolvable' })

    res.json({ ref, ...resolved })
  } catch (error: any) {
    console.error('Error reading slide content:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
