import { Router } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import multer from 'multer'
import JSZip from 'jszip'
// @ts-ignore — mammoth has no type definitions
import mammoth from 'mammoth'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generatePPTX } from '../services/pptxGenerator.js'
import {
  getAllImportedModules,
  getImportedModule,
  createImportedModule,
  deleteImportedModule,
  getImportedSlides,
  saveImportedSlides,
  updateImportedSlide,
  createExternalDeck,
  getAllExternalDecks,
  getExternalDeck,
  deleteExternalDeck,
  getExternalPages,
} from '../db/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

// Initialize Anthropic client (same pattern as ai.ts)
const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY not set')
  }
  return new Anthropic({ apiKey })
}

// External images directory
const DATA_DIR = path.resolve(__dirname, '../../data')
const EXTERNAL_DIR = path.join(DATA_DIR, 'external')
const IMPORTS_DIR = path.join(DATA_DIR, 'imports')
const PENDING_DIR = path.join(IMPORTS_DIR, '_pending')

// Ensure directories exist
for (const dir of [EXTERNAL_DIR, IMPORTS_DIR, PENDING_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Generate a unique session ID for pending imports
function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// Clean up stale pending directories (older than 1 hour)
setInterval(() => {
  try {
    if (!fs.existsSync(PENDING_DIR)) return
    const entries = fs.readdirSync(PENDING_DIR)
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    for (const entry of entries) {
      const entryPath = path.join(PENDING_DIR, entry)
      try {
        const stat = fs.statSync(entryPath)
        if (stat.isDirectory() && stat.mtimeMs < oneHourAgo) {
          fs.rmSync(entryPath, { recursive: true })
          console.log(`Cleaned up stale pending import: ${entry}`)
        }
      } catch {
        // Skip entries that can't be stat'd
      }
    }
  } catch {
    // Ignore cleanup errors
  }
}, 15 * 60 * 1000) // Every 15 minutes

// ─────────────────────────────────────────────────────────────────────────────
// Multer configuration
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for external PDF uploads
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, PPTX, DOCX'))
    }
  },
})

// Separate upload for external (PDF only)
const uploadExternal = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only PDF is accepted for external slides.'))
    }
  },
})

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface SlideImage {
  filename: string
  base64: string
  contentType: string
}

interface PersistedSlideImage {
  filename: string
  contentType: string
  url: string
}

interface ExtractedSlide {
  index: number
  text: string
  wordCount: number
  images?: SlideImage[]
}

interface PersistedExtractedSlide {
  index: number
  text: string
  wordCount: number
  images?: PersistedSlideImage[]
}

// ─────────────────────────────────────────────────────────────────────────────
// PPTX text + image extraction
// ─────────────────────────────────────────────────────────────────────────────

async function extractPPTXSlides(buffer: Buffer): Promise<ExtractedSlide[]> {
  const zip = await JSZip.loadAsync(buffer)
  const slides: ExtractedSlide[] = []

  // Find all slide XML files (ppt/slides/slide1.xml, slide2.xml, etc.)
  const slideFiles = Object.keys(zip.files)
    .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0')
      const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0')
      return numA - numB
    })

  for (let i = 0; i < slideFiles.length; i++) {
    const slideFile = slideFiles[i]
    const xml = await zip.files[slideFile].async('string')
    const text = extractTextFromSlideXML(xml)

    // Extract images from slide relationships
    const slideNum = slideFile.match(/slide(\d+)/)?.[1] || ''
    const relsPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`
    const images = await extractSlideImages(zip, relsPath)

    slides.push({
      index: i,
      text: text.trim(),
      wordCount: text.trim().split(/\s+/).filter(Boolean).length,
      images: images.length > 0 ? images : undefined,
    })
  }

  return slides
}

/**
 * Extract PPTX slides with images persisted to disk instead of base64.
 */
async function extractPPTXSlidesPersisted(buffer: Buffer, sessionId: string): Promise<PersistedExtractedSlide[]> {
  const zip = await JSZip.loadAsync(buffer)
  const slides: PersistedExtractedSlide[] = []

  const sessionDir = path.join(PENDING_DIR, sessionId)
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true })
  }

  const slideFiles = Object.keys(zip.files)
    .filter(name => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0')
      const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0')
      return numA - numB
    })

  for (let i = 0; i < slideFiles.length; i++) {
    const slideFile = slideFiles[i]
    const xml = await zip.files[slideFile].async('string')
    const text = extractTextFromSlideXML(xml)

    const slideNum = slideFile.match(/slide(\d+)/)?.[1] || ''
    const relsPath = `ppt/slides/_rels/slide${slideNum}.xml.rels`
    const images = await extractAndPersistSlideImages(zip, relsPath, sessionDir, sessionId)

    slides.push({
      index: i,
      text: text.trim(),
      wordCount: text.trim().split(/\s+/).filter(Boolean).length,
      images: images.length > 0 ? images : undefined,
    })
  }

  return slides
}

function extractTextFromSlideXML(xml: string): string {
  const paragraphs: string[] = []
  // Match <a:p>...</a:p> paragraph blocks
  const pRegex = /<a:p\b[^>]*>([\s\S]*?)<\/a:p>/g
  let pMatch
  while ((pMatch = pRegex.exec(xml)) !== null) {
    const pContent = pMatch[1]
    // Extract all <a:t> text elements within this paragraph
    const texts: string[] = []
    const tRegex = /<a:t>([\s\S]*?)<\/a:t>/g
    let tMatch
    while ((tMatch = tRegex.exec(pContent)) !== null) {
      texts.push(tMatch[1])
    }
    if (texts.length > 0) {
      paragraphs.push(texts.join(''))
    }
  }
  return paragraphs.join('\n')
}

/**
 * Extract images referenced by a slide from its .rels file
 */
async function extractSlideImages(zip: JSZip, relsPath: string): Promise<SlideImage[]> {
  const relsFile = zip.files[relsPath]
  if (!relsFile) return []

  const relsXml = await relsFile.async('string')
  const images: SlideImage[] = []

  // Find <Relationship Type="...image" Target="../media/imageN.xxx" />
  const relRegex = /<Relationship[^>]*Type="[^"]*\/image"[^>]*Target="([^"]+)"/g
  let match
  while ((match = relRegex.exec(relsXml)) !== null) {
    let target = match[1]
    // Resolve relative path (../media/image1.png -> ppt/media/image1.png)
    if (target.startsWith('../')) {
      target = 'ppt/' + target.slice(3)
    } else if (!target.startsWith('ppt/')) {
      target = 'ppt/slides/' + target
    }

    const mediaFile = zip.files[target]
    if (!mediaFile) continue

    // Determine content type from extension
    const ext = path.extname(target).toLowerCase()
    const contentTypeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.svg': 'image/svg+xml',
      '.tiff': 'image/tiff',
      '.tif': 'image/tiff',
      '.emf': 'image/x-emf',
      '.wmf': 'image/x-wmf',
    }

    const contentType = contentTypeMap[ext]
    // Skip non-standard image formats that Claude can't process
    if (!contentType || contentType === 'image/x-emf' || contentType === 'image/x-wmf') continue

    try {
      const base64 = await mediaFile.async('base64')
      // Skip very small images (likely 1x1 placeholders) and very large ones
      if (base64.length < 100 || base64.length > 10_000_000) continue

      images.push({
        filename: path.basename(target),
        base64,
        contentType,
      })
    } catch {
      // Skip images that fail to extract
    }
  }

  return images
}

/**
 * Extract images referenced by a slide and persist them to disk.
 * Returns metadata (no base64) — images are served via API endpoint.
 */
async function extractAndPersistSlideImages(
  zip: JSZip,
  relsPath: string,
  sessionDir: string,
  sessionId: string,
): Promise<PersistedSlideImage[]> {
  const relsFile = zip.files[relsPath]
  if (!relsFile) return []

  const relsXml = await relsFile.async('string')
  const images: PersistedSlideImage[] = []

  const relRegex = /<Relationship[^>]*Type="[^"]*\/image"[^>]*Target="([^"]+)"/g
  let match
  while ((match = relRegex.exec(relsXml)) !== null) {
    let target = match[1]
    if (target.startsWith('../')) {
      target = 'ppt/' + target.slice(3)
    } else if (!target.startsWith('ppt/')) {
      target = 'ppt/slides/' + target
    }

    const mediaFile = zip.files[target]
    if (!mediaFile) continue

    const ext = path.extname(target).toLowerCase()
    const contentTypeMap: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.bmp': 'image/bmp',
      '.svg': 'image/svg+xml',
      '.tiff': 'image/tiff',
      '.tif': 'image/tiff',
      '.emf': 'image/x-emf',
      '.wmf': 'image/x-wmf',
    }

    const contentType = contentTypeMap[ext]
    if (!contentType || contentType === 'image/x-emf' || contentType === 'image/x-wmf') continue

    try {
      const buffer = await mediaFile.async('nodebuffer')
      // Skip very small images (likely 1x1 placeholders) and very large ones
      if (buffer.length < 75 || buffer.length > 10_000_000) continue

      const filename = path.basename(target)
      const filePath = path.join(sessionDir, filename)

      // Write only if not already written (same image referenced by multiple slides)
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, buffer)
      }

      images.push({
        filename,
        contentType,
        url: `/api/import/pending/${sessionId}/images/${filename}`,
      })
    } catch {
      // Skip images that fail to extract
    }
  }

  return images
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCX extraction (split by headings)
// ─────────────────────────────────────────────────────────────────────────────

async function extractDocxSlides(buffer: Buffer): Promise<ExtractedSlide[]> {
  const result = await (mammoth as any).convertToMarkdown({ buffer })
  const markdown = result.value

  // Split by ## headings — each heading starts a new "slide"
  const sections: string[] = []
  const lines = markdown.split('\n')
  let currentSection = ''

  for (const line of lines) {
    if (line.match(/^#{1,3}\s/) && currentSection.trim()) {
      sections.push(currentSection.trim())
      currentSection = line + '\n'
    } else {
      currentSection += line + '\n'
    }
  }
  if (currentSection.trim()) {
    sections.push(currentSection.trim())
  }

  // If no headings found, treat entire document as one slide
  if (sections.length === 0 && markdown.trim()) {
    sections.push(markdown.trim())
  }

  return sections.map((text, index) => ({
    index,
    text,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  }))
}

// ─────────────────────────────────────────────────────────────────────────────
// PDF text extraction
// ─────────────────────────────────────────────────────────────────────────────

async function extractPDFSlides(buffer: Buffer): Promise<ExtractedSlide[]> {
  const { PDFParse } = await import('pdf-parse')
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  const result = await parser.getText()

  // Split by page — pdf-parse separates pages with form feed character
  const pages = result.text.split(/\f/)
  return pages.map((text: string, index: number) => ({
    index,
    text: text.trim(),
    wordCount: text.trim().split(/\s+/).filter(Boolean).length,
  })).filter((s: ExtractedSlide) => s.text.length > 0)
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/import/parse — Upload and extract text per slide
// ─────────────────────────────────────────────────────────────────────────────

router.post('/parse', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    let slides: ExtractedSlide[] | PersistedExtractedSlide[]
    let sessionId: string | undefined

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      // PPTX: persist images to disk instead of sending base64
      sessionId = generateSessionId()
      slides = await extractPPTXSlidesPersisted(file.buffer, sessionId)
    } else if (file.mimetype === 'application/pdf') {
      slides = await extractPDFSlides(file.buffer)
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      slides = await extractDocxSlides(file.buffer)
    } else {
      return res.status(400).json({ error: 'Unsupported file type' })
    }

    res.json({
      slides,
      sourceFilename: file.originalname,
      totalSlides: slides.length,
      ...(sessionId && { sessionId }),
    })
  } catch (error: any) {
    console.error('Error parsing file:', error)
    res.status(500).json({ error: error.message || 'Failed to parse file' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/import/convert — AI conversion of extracted text to Marp markdown
// ─────────────────────────────────────────────────────────────────────────────

router.post('/convert', async (req, res) => {
  try {
    const { slides, moduleName, sessionId, moduleId } = req.body as {
      slides: Array<{ index: number; text: string; imageFilenames?: string[] }>
      moduleName: string
      sessionId?: string
      moduleId?: string
    }

    if (!slides || slides.length === 0) {
      return res.status(400).json({ error: 'No slides provided' })
    }

    const client = getClient()

    // Check if any slides have images on disk (persisted mode)
    const hasPersistedImages = sessionId && slides.some(s => s.imageFilenames && s.imageFilenames.length > 0)

    if (hasPersistedImages) {
      // Read images from disk for Claude vision API
      const sessionDir = path.join(PENDING_DIR, path.basename(sessionId))
      const contentBlocks: Anthropic.MessageParam['content'] = []

      // Build the final image URL base for Claude to reference
      const imageUrlBase = moduleId
        ? `/api/import/modules/${moduleId}/images`
        : `/api/import/pending/${sessionId}/images`

      for (let i = 0; i < slides.length; i++) {
        const s = slides[i]
        contentBlocks.push({
          type: 'text' as const,
          text: `--- SLIDE ${i + 1} ---\nExtracted text:\n${s.text}\n`,
        })

        if (s.imageFilenames && s.imageFilenames.length > 0) {
          for (const filename of s.imageFilenames) {
            const safeName = path.basename(filename)
            const imagePath = path.join(sessionDir, safeName)
            if (!fs.existsSync(imagePath)) continue

            const ext = path.extname(safeName).toLowerCase()
            const mediaType = ext === '.png' ? 'image/png'
              : ext === '.gif' ? 'image/gif'
              : 'image/jpeg'

            if (!['image/png', 'image/jpeg', 'image/gif'].includes(mediaType)) continue

            const base64 = fs.readFileSync(imagePath).toString('base64')
            contentBlocks.push({
              type: 'image' as const,
              source: {
                type: 'base64' as const,
                media_type: mediaType as 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp',
                data: base64,
              },
            })
            contentBlocks.push({
              type: 'text' as const,
              text: `(This image is available at: ${imageUrlBase}/${safeName})`,
            })
          }
        }
      }

      contentBlocks.push({
        type: 'text' as const,
        text: `\nConvert these ${slides.length} slides from "${moduleName}" into Marp markdown. For slides with images, include image references using the provided URLs with Marp image syntax (e.g., \`![bg right](url)\` for diagrams on the right, \`![bg contain](url)\` for full-slide diagrams). Return ONLY the markdown, no explanation.`,
      })

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: `You are a slide converter for the FASTR health data analysis platform.
Convert presentation slides into clean Marp markdown slides using both the extracted text AND the visual content of images.

Rules:
- Use ## for slide titles (h2 headings)
- Use bullet lists with bold key terms where appropriate
- Use sentence case for headings (only capitalize first word and proper nouns)
- Do NOT include Marp frontmatter (no --- marp: true --- block)
- Separate each slide with --- on its own line
- Keep content concise — slides should not be walls of text
- Preserve the original meaning and structure
- For slides with images: include the image using the provided URL with Marp image syntax like ![bg right](url) or ![bg contain](url)
- If a slide is primarily visual (chart, diagram, infographic), describe what it shows in text AND include the image reference
- If a slide has very little text (just a title), still include it as a slide with the title`,
        messages: [{
          role: 'user',
          content: contentBlocks as any,
        }],
      })

      const fullMarkdown = response.content
        .filter(block => block.type === 'text')
        .map(block => (block as any).text)
        .join('')

      const slideMarkdowns = fullMarkdown.split(/\n---\n/).map(s => s.trim()).filter(Boolean)

      const result = slideMarkdowns.map((md, i) => {
        const titleMatch = md.match(/^##\s+(.+)$/m)
        return {
          index: i,
          title: titleMatch ? titleMatch[1].trim() : `Slide ${i + 1}`,
          markdown: md,
        }
      })

      return res.json({ slides: result })
    }

    // Text-only conversion (original path — PDF, DOCX, or PPTX without images)
    const slideTexts = slides.map((s, i) =>
      `--- SLIDE ${i + 1} ---\n${s.text}`
    ).join('\n\n')

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: `You are a slide converter for the FASTR health data analysis platform.
Convert the extracted text from presentation slides into clean Marp markdown slides.

Rules:
- Use ## for slide titles (h2 headings)
- Use bullet lists with bold key terms where appropriate
- Use sentence case for headings (only capitalize first word and proper nouns)
- Do NOT include Marp frontmatter (no --- marp: true --- block)
- Separate each slide with --- on its own line
- Keep content concise — slides should not be walls of text
- Preserve the original meaning and structure
- If a slide has very little text (just a title), still include it as a slide with the title`,
      messages: [{
        role: 'user',
        content: `Convert these ${slides.length} slides from "${moduleName}" into Marp markdown. Return ONLY the markdown, no explanation.\n\n${slideTexts}`,
      }],
    })

    const fullMarkdown = response.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('')

    const slideMarkdowns = fullMarkdown.split(/\n---\n/).map(s => s.trim()).filter(Boolean)

    const result = slideMarkdowns.map((md, i) => {
      const titleMatch = md.match(/^##\s+(.+)$/m)
      return {
        index: i,
        title: titleMatch ? titleMatch[1].trim() : `Slide ${i + 1}`,
        markdown: md,
      }
    })

    res.json({ slides: result })
  } catch (error: any) {
    console.error('Error converting slides:', error)
    res.status(500).json({ error: error.message || 'Failed to convert slides' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/import/save — Save as imported module
// ─────────────────────────────────────────────────────────────────────────────

router.post('/save', async (req, res) => {
  try {
    const { id, name, sourceFilename, slides, sessionId } = req.body as {
      id: string
      name: string
      sourceFilename: string | null
      slides: Array<{ order: number; originalText: string | null; markdown: string; title: string | null }>
      sessionId?: string
    }

    if (!id || !name || !slides || slides.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Validate ID format: only lowercase letters, numbers, underscores
    if (!/^[a-z0-9_]+$/.test(id)) {
      return res.status(400).json({ error: 'ID must contain only lowercase letters, numbers, and underscores' })
    }

    // Check uniqueness
    const existing = await getImportedModule(id)
    if (existing) {
      return res.status(409).json({ error: 'A module with this ID already exists' })
    }

    // Rewrite pending image URLs to permanent before saving
    const rewrittenSlides = sessionId
      ? slides.map(s => ({
          ...s,
          markdown: s.markdown.replace(
            new RegExp(`/api/import/pending/${sessionId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/images/`, 'g'),
            `/api/import/modules/${id}/images/`
          ),
        }))
      : slides

    await createImportedModule(id, name, sourceFilename, rewrittenSlides.length)
    await saveImportedSlides(id, rewrittenSlides)

    // Move pending images to permanent location
    if (sessionId) {
      const pendingPath = path.join(PENDING_DIR, path.basename(sessionId))
      const permanentPath = path.join(IMPORTS_DIR, path.basename(id))
      if (fs.existsSync(pendingPath)) {
        fs.renameSync(pendingPath, permanentPath)
      }
    }

    res.json({ success: true, id })
  } catch (error: any) {
    console.error('Error saving imported module:', error)
    res.status(500).json({ error: error.message || 'Failed to save module' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/import/modules — List all imported modules
// ─────────────────────────────────────────────────────────────────────────────

router.get('/modules', async (_req, res) => {
  try {
    const modules = await getAllImportedModules()
    res.json(modules)
  } catch (error: any) {
    console.error('Error listing imported modules:', error)
    res.status(500).json({ error: 'Failed to list modules' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/import/modules/:id — Get module + slides
// ─────────────────────────────────────────────────────────────────────────────

router.get('/modules/:id', async (req, res) => {
  try {
    const mod = await getImportedModule(req.params.id)
    if (!mod) {
      return res.status(404).json({ error: 'Module not found' })
    }
    const slides = await getImportedSlides(req.params.id)
    res.json({ ...mod, slides })
  } catch (error: any) {
    console.error('Error getting imported module:', error)
    res.status(500).json({ error: 'Failed to get module' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/import/modules/:id — Delete module (cascade)
// ─────────────────────────────────────────────────────────────────────────────

router.delete('/modules/:id', async (req, res) => {
  try {
    const mod = await getImportedModule(req.params.id)
    if (!mod) {
      return res.status(404).json({ error: 'Module not found' })
    }
    await deleteImportedModule(req.params.id)

    // Clean up persisted images
    const imagesDir = path.join(IMPORTS_DIR, path.basename(req.params.id))
    if (fs.existsSync(imagesDir)) {
      fs.rmSync(imagesDir, { recursive: true })
    }

    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting imported module:', error)
    res.status(500).json({ error: 'Failed to delete module' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/import/modules/:id/slides/:slideId — Update single slide markdown
// ─────────────────────────────────────────────────────────────────────────────

router.put('/modules/:id/slides/:slideId', async (req, res) => {
  try {
    const { markdown } = req.body
    if (!markdown) {
      return res.status(400).json({ error: 'Markdown content required' })
    }
    await updateImportedSlide(parseInt(req.params.slideId), markdown)
    res.json({ success: true })
  } catch (error: any) {
    console.error('Error updating slide:', error)
    res.status(500).json({ error: 'Failed to update slide' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/import/pending/:sessionId/images/:filename — Serve pending image
// ─────────────────────────────────────────────────────────────────────────────

router.get('/pending/:sessionId/images/:filename', (req, res) => {
  const safeSession = path.basename(req.params.sessionId)
  const safeFilename = path.basename(req.params.filename)
  const imagePath = path.join(PENDING_DIR, safeSession, safeFilename)

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Image not found' })
  }

  const ext = path.extname(safeFilename).toLowerCase()
  const contentTypes: Record<string, string> = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.bmp': 'image/bmp', '.svg': 'image/svg+xml',
  }

  res.set({
    'Content-Type': contentTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'public, max-age=3600',
  })
  res.sendFile(imagePath)
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/import/modules/:id/images/:filename — Serve permanent import image
// ─────────────────────────────────────────────────────────────────────────────

router.get('/modules/:id/images/:filename', (req, res) => {
  const safeId = path.basename(req.params.id)
  const safeFilename = path.basename(req.params.filename)
  const imagePath = path.join(IMPORTS_DIR, safeId, safeFilename)

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Image not found' })
  }

  const ext = path.extname(safeFilename).toLowerCase()
  const contentTypes: Record<string, string> = {
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.gif': 'image/gif', '.bmp': 'image/bmp', '.svg': 'image/svg+xml',
  }

  res.set({
    'Content-Type': contentTypes[ext] || 'application/octet-stream',
    'Cache-Control': 'public, max-age=86400',
  })
  res.sendFile(imagePath)
})

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/import/export-pptx — Download converted slides as FASTR-styled PPTX
// ─────────────────────────────────────────────────────────────────────────────

const OUTPUT_DIR = path.resolve(__dirname, '../../outputs')
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

router.post('/export-pptx', async (req, res) => {
  try {
    const { slides, moduleName } = req.body as {
      slides: Array<{ markdown: string; title?: string }>
      moduleName: string
    }

    if (!slides || slides.length === 0) {
      return res.status(400).json({ error: 'No slides provided' })
    }

    // Build a complete Marp markdown document
    const frontmatter = `---\nmarp: true\ntheme: fastr\npaginate: true\n---\n\n`
    const slideMarkdown = slides.map(s => s.markdown).join('\n\n---\n\n')
    const fullMarkdown = frontmatter + slideMarkdown

    // Create a minimal workshop config for PPTX generation
    const minimalConfig = {
      workshop: {
        name: moduleName || 'Imported Slides',
        country: '',
        location: '',
        facilitators: '',
      },
      schedule: { days: 1 },
      content: { modules: [], custom_slides: [] },
    }

    const safeFilename = moduleName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'imported_slides'
    const pptxFilename = `${safeFilename}.pptx`
    const pptxPath = path.join(OUTPUT_DIR, pptxFilename)

    await generatePPTX(fullMarkdown, minimalConfig as any, pptxPath)

    res.json({
      success: true,
      filename: pptxFilename,
      downloadUrl: `/api/import/download/${pptxFilename}`,
    })
  } catch (error: any) {
    console.error('Error exporting PPTX:', error)
    res.status(500).json({ error: error.message || 'Failed to export PPTX' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/import/download/:filename — Download exported file
// ─────────────────────────────────────────────────────────────────────────────

router.get('/download/:filename', (req, res) => {
  try {
    const safeFilename = path.basename(req.params.filename)
    const filePath = path.resolve(OUTPUT_DIR, safeFilename)

    if (!filePath.startsWith(OUTPUT_DIR)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    res.download(filePath, safeFilename)
  } catch (error: any) {
    console.error('Error downloading file:', error)
    res.status(500).json({ error: 'Failed to download file' })
  }
})

// ═════════════════════════════════════════════════════════════════════════════
// EXTERNAL SLIDES — Upload PDF, convert pages to images, store as deck
// ═════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/import/external — Upload PDF, convert pages to PNG images
// ─────────────────────────────────────────────────────────────────────────────

router.post('/external', uploadExternal.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const deckName = req.body.name || file.originalname.replace(/\.pdf$/i, '')
    const deckId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6)

    // Convert PDF pages to PNG images
    const { pdf } = await import('pdf-to-img')
    const pages: Array<{ pageNumber: number; width: number; height: number; imageFilename: string }> = []
    let pageNum = 0

    const pdfDoc = await pdf(file.buffer, { scale: 2.0 })
    for await (const image of pdfDoc) {
      pageNum++
      const imageFilename = `${deckId}_page_${pageNum}.png`
      const imagePath = path.join(EXTERNAL_DIR, imageFilename)

      // image is a Buffer (PNG)
      fs.writeFileSync(imagePath, image)

      pages.push({
        pageNumber: pageNum,
        width: 0, // We don't have dimensions easily without reading back
        height: 0,
        imageFilename,
      })
    }

    if (pages.length === 0) {
      return res.status(400).json({ error: 'No pages could be extracted from the PDF' })
    }

    // Save to database
    await createExternalDeck(deckId, deckName, file.originalname, pages)

    res.json({
      id: deckId,
      name: deckName,
      pageCount: pages.length,
      sourceFilename: file.originalname,
      pages: pages.map(p => ({ pageNumber: p.pageNumber, width: p.width, height: p.height })),
    })
  } catch (error: any) {
    console.error('Error processing external PDF:', error)
    res.status(500).json({ error: error.message || 'Failed to process PDF' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/import/external — List all external decks
// ─────────────────────────────────────────────────────────────────────────────

router.get('/external', async (_req, res) => {
  try {
    const decks = await getAllExternalDecks()
    res.json(decks)
  } catch (error: any) {
    console.error('Error listing external decks:', error)
    res.status(500).json({ error: 'Failed to list external decks' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/import/external/:id — Get deck metadata + page list
// ─────────────────────────────────────────────────────────────────────────────

router.get('/external/:id', async (req, res) => {
  try {
    const deck = await getExternalDeck(req.params.id)
    if (!deck) {
      return res.status(404).json({ error: 'External deck not found' })
    }
    const pages = await getExternalPages(req.params.id)
    res.json({ ...deck, pages })
  } catch (error: any) {
    console.error('Error getting external deck:', error)
    res.status(500).json({ error: 'Failed to get external deck' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/import/external/:deckId/pages/:pageNum — Serve page image (PNG)
// ─────────────────────────────────────────────────────────────────────────────

router.get('/external/:deckId/pages/:pageNum', async (req, res) => {
  try {
    const { deckId, pageNum } = req.params
    const pages = await getExternalPages(deckId)
    const page = pages.find(p => p.page_number === parseInt(pageNum))

    if (!page) {
      return res.status(404).json({ error: 'Page not found' })
    }

    const imagePath = path.join(EXTERNAL_DIR, page.image_filename)
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image file not found' })
    }

    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400', // Cache for 24h
    })
    res.sendFile(imagePath)
  } catch (error: any) {
    console.error('Error serving page image:', error)
    res.status(500).json({ error: 'Failed to serve page image' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/import/external/:id — Delete deck + images from disk
// ─────────────────────────────────────────────────────────────────────────────

router.delete('/external/:id', async (req, res) => {
  try {
    const deck = await getExternalDeck(req.params.id)
    if (!deck) {
      return res.status(404).json({ error: 'External deck not found' })
    }

    // Delete image files from disk
    const pages = await getExternalPages(req.params.id)
    for (const page of pages) {
      const imagePath = path.join(EXTERNAL_DIR, page.image_filename)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    // Delete from database
    await deleteExternalDeck(req.params.id)

    res.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting external deck:', error)
    res.status(500).json({ error: 'Failed to delete external deck' })
  }
})

export default router
