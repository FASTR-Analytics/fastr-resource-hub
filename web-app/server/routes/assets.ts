import { Router } from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Workshops directory (where assets are stored per workshop)
const WORKSHOPS_DIR = path.resolve(__dirname, '../../../workshops')

// Resources directory (built-in FASTR assets)
const RESOURCES_DIR = path.resolve(__dirname, '../../../resources')

// Shared custom assets directory
const SHARED_ASSETS_DIR = path.resolve(__dirname, '../../../resources/custom')

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Configure multer for memory storage (we'll write files ourselves)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`))
    }
  },
})

// Helper to get assets directory for a workshop
function getAssetsDir(workshopId: string): string {
  return path.join(WORKSHOPS_DIR, workshopId, 'assets')
}

// Helper to ensure assets directory exists
function ensureAssetsDir(workshopId: string): string {
  const assetsDir = getAssetsDir(workshopId)
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true })
  }
  return assetsDir
}

// Helper to sanitize filename
function sanitizeFilename(filename: string): string {
  // Remove path separators and other dangerous characters
  return filename
    .replace(/[/\\:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .toLowerCase()
}

// ─────────────────────────────────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/assets/:workshopId - List all assets for a workshop
router.get('/:workshopId', (req, res) => {
  try {
    const { workshopId } = req.params
    const assetsDir = getAssetsDir(workshopId)

    if (!fs.existsSync(assetsDir)) {
      return res.json({ assets: [] })
    }

    const files = fs.readdirSync(assetsDir)
    const assets = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)
      })
      .map(file => {
        const filePath = path.join(assetsDir, file)
        const stats = fs.statSync(filePath)
        return {
          filename: file,
          path: `assets/${file}`,
          url: `/api/assets/${workshopId}/file/${file}`,
          size: stats.size,
          modified: stats.mtime,
          markdown: `![${file}](assets/${file})`,
        }
      })
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())

    res.json({ assets })
  } catch (error: any) {
    console.error('Error listing assets:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/assets/:workshopId/file/:filename - Serve an asset file
router.get('/:workshopId/file/:filename', (req, res) => {
  try {
    const { workshopId, filename } = req.params
    const filePath = path.join(getAssetsDir(workshopId), filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Asset not found' })
    }

    res.sendFile(filePath)
  } catch (error: any) {
    console.error('Error serving asset:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/assets/:workshopId - Upload an asset
router.post('/:workshopId', upload.single('file'), (req, res) => {
  try {
    const workshopId = req.params.workshopId as string
    const file = req.file

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const assetsDir = ensureAssetsDir(workshopId)

    // Sanitize filename
    let filename = sanitizeFilename(file.originalname)

    // Handle duplicate filenames
    let finalFilename = filename
    let counter = 1
    while (fs.existsSync(path.join(assetsDir, finalFilename))) {
      const ext = path.extname(filename)
      const base = path.basename(filename, ext)
      finalFilename = `${base}_${counter}${ext}`
      counter++
    }

    // Write file
    const filePath = path.join(assetsDir, finalFilename)
    fs.writeFileSync(filePath, file.buffer)

    res.json({
      success: true,
      asset: {
        filename: finalFilename,
        path: `assets/${finalFilename}`,
        url: `/api/assets/${workshopId}/file/${finalFilename}`,
        size: file.size,
        markdown: `![${finalFilename}](assets/${finalFilename})`,
      },
    })
  } catch (error: any) {
    console.error('Error uploading asset:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/assets/:workshopId/:filename - Delete an asset
router.delete('/:workshopId/:filename', (req, res) => {
  try {
    const { workshopId, filename } = req.params
    const filePath = path.join(getAssetsDir(workshopId), filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Asset not found' })
    }

    fs.unlinkSync(filePath)

    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting asset:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Library Assets (Built-in FASTR resources + user uploads)
// ─────────────────────────────────────────────────────────────────────────────

interface LibraryAsset {
  filename: string
  category: string
  path: string
  url: string
  isCustom: boolean
}

// Helper to scan a directory for images
function scanDirectory(dir: string, category: string, urlPrefix: string, isCustom: boolean): LibraryAsset[] {
  if (!fs.existsSync(dir)) return []

  const assets: LibraryAsset[] = []
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase()
      if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
        assets.push({
          filename: file,
          category,
          path: `${urlPrefix}/${file}`,
          url: `/resources/${urlPrefix}/${file}`,
          isCustom,
        })
      }
    }
  }

  return assets
}

// GET /api/assets/library - List all library assets (built-in + custom)
router.get('/library', (_req, res) => {
  try {
    const library: Record<string, LibraryAsset[]> = {}

    // Built-in categories
    const categories = [
      { name: 'icons', label: 'Icons', dir: path.join(RESOURCES_DIR, 'icons') },
      { name: 'diagrams', label: 'Diagrams', dir: path.join(RESOURCES_DIR, 'diagrams') },
      { name: 'logos', label: 'Logos', dir: path.join(RESOURCES_DIR, 'logos') },
      { name: 'backgrounds', label: 'Backgrounds', dir: path.join(RESOURCES_DIR, 'backgrounds') },
      { name: 'default_outputs', label: 'Example Outputs', dir: path.join(RESOURCES_DIR, 'default_outputs') },
    ]

    for (const cat of categories) {
      const assets = scanDirectory(cat.dir, cat.label, cat.name, false)
      if (assets.length > 0) {
        library[cat.name] = assets
      }
    }

    // Custom user uploads (shared)
    if (fs.existsSync(SHARED_ASSETS_DIR)) {
      const customAssets = scanDirectory(SHARED_ASSETS_DIR, 'Custom', 'custom', true)
      if (customAssets.length > 0) {
        library['custom'] = customAssets
      }
    }

    res.json({ library })
  } catch (error: any) {
    console.error('Error listing library assets:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/assets/library/:category/:filename - Serve a library asset
router.get('/library/:category/:filename', (req, res) => {
  try {
    const { category, filename } = req.params

    let filePath: string
    if (category === 'custom') {
      filePath = path.join(SHARED_ASSETS_DIR, filename)
    } else {
      filePath = path.join(RESOURCES_DIR, category, filename)
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Asset not found' })
    }

    res.sendFile(filePath)
  } catch (error: any) {
    console.error('Error serving library asset:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/assets/library - Upload a custom asset to the shared library
router.post('/library', upload.single('file'), (req, res) => {
  try {
    const file = req.file

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Ensure custom assets directory exists
    if (!fs.existsSync(SHARED_ASSETS_DIR)) {
      fs.mkdirSync(SHARED_ASSETS_DIR, { recursive: true })
    }

    // Sanitize filename
    let filename = sanitizeFilename(file.originalname)

    // Handle duplicate filenames
    let finalFilename = filename
    let counter = 1
    while (fs.existsSync(path.join(SHARED_ASSETS_DIR, finalFilename))) {
      const ext = path.extname(filename)
      const base = path.basename(filename, ext)
      finalFilename = `${base}_${counter}${ext}`
      counter++
    }

    // Write file
    const filePath = path.join(SHARED_ASSETS_DIR, finalFilename)
    fs.writeFileSync(filePath, file.buffer)

    res.json({
      success: true,
      asset: {
        filename: finalFilename,
        category: 'Custom',
        path: `custom/${finalFilename}`,
        url: `/resources/custom/${finalFilename}`,
        isCustom: true,
      },
    })
  } catch (error: any) {
    console.error('Error uploading library asset:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE /api/assets/library/:filename - Delete a custom asset from the shared library
router.delete('/library/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(SHARED_ASSETS_DIR, filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Asset not found' })
    }

    fs.unlinkSync(filePath)

    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting library asset:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
