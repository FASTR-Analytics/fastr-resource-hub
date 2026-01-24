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
  getCustomSlides,
  saveCustomSlide,
  deleteCustomSlide,
  WorkshopConfig
} from '../db/database.js'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '../../..')
const WORKSHOPS_PATH = path.join(REPO_ROOT, 'workshops')

// ─────────────────────────────────────────────────────────────────────────────
// Import from file system
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/workshops/import - Import workshops from file system
router.post('/import', (_req, res) => {
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
      const existing = getWorkshop(folder)
      if (existing) {
        skipped.push(folder)
        continue
      }

      // Read and parse YAML
      const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
      const config = yaml.load(yamlContent) as WorkshopConfig

      // Import into database
      createWorkshop(folder, config)
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
router.get('/', (_req, res) => {
  try {
    const workshops = getAllWorkshops()
    res.json(workshops)
  } catch (error: any) {
    console.error('Error listing workshops:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/workshops/:id - Get workshop config
router.get('/:id', (req, res) => {
  try {
    const config = getWorkshop(req.params.id)
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
router.post('/', (req, res) => {
  try {
    const { id, config } = req.body as { id: string; config: WorkshopConfig }

    if (!id || !config) {
      return res.status(400).json({ error: 'Missing id or config' })
    }

    // Check if workshop already exists
    const existing = getWorkshop(id)
    if (existing) {
      return res.status(409).json({ error: 'Workshop already exists' })
    }

    createWorkshop(id, config)
    res.status(201).json({ success: true, id })
  } catch (error: any) {
    console.error('Error creating workshop:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT /api/workshops/:id - Update workshop config
router.put('/:id', (req, res) => {
  try {
    const config = req.body as WorkshopConfig

    // Check if workshop exists
    const existing = getWorkshop(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    updateWorkshop(req.params.id, config)
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error updating workshop:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/workshops/:id - Delete workshop
router.delete('/:id', (req, res) => {
  try {
    const existing = getWorkshop(req.params.id)
    if (!existing) {
      return res.status(404).json({ error: 'Workshop not found' })
    }

    deleteWorkshop(req.params.id)
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting workshop:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Custom Slides
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/workshops/:id/custom-slides - List custom slides
router.get('/:id/custom-slides', (req, res) => {
  try {
    const slides = getCustomSlides(req.params.id)
    res.json(slides)
  } catch (error: any) {
    console.error('Error getting custom slides:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/workshops/:id/custom-slides - Save custom slide
router.post('/:id/custom-slides', (req, res) => {
  try {
    const { filename, content } = req.body

    if (!filename || !content) {
      return res.status(400).json({ error: 'Missing filename or content' })
    }

    saveCustomSlide(req.params.id, filename, content)
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error saving custom slide:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/workshops/:id/custom-slides/:filename - Delete custom slide
router.delete('/:id/custom-slides/:filename', (req, res) => {
  try {
    deleteCustomSlide(req.params.id, req.params.filename)
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting custom slide:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
