import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { generatePDF } from '../services/pdfGenerator.js'
import { generatePPTX } from '../services/pptxGenerator.js'
import { renderMarkdown, getThemeCSS } from '../services/marpService.js'

const router = Router()

// ─────────────────────────────────────────────────────────────────────────────
// Server-side Marp render cache
// ─────────────────────────────────────────────────────────────────────────────
interface CacheEntry {
  html: string
  presenterNotes: string[]
  timestamp: number
}

const renderCache = new Map<string, CacheEntry>()
const CACHE_MAX_SIZE = 500  // Max number of cached renders
const CACHE_TTL = 60 * 60 * 1000  // 1 hour TTL

function getCacheKey(markdown: string): string {
  return crypto.createHash('md5').update(markdown).digest('hex')
}

function cleanupCache() {
  const now = Date.now()
  // Remove expired entries
  for (const [key, entry] of renderCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL) {
      renderCache.delete(key)
    }
  }
  // If still too large, remove oldest entries
  if (renderCache.size > CACHE_MAX_SIZE) {
    const entries = Array.from(renderCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
    const toRemove = entries.slice(0, entries.length - CACHE_MAX_SIZE)
    for (const [key] of toRemove) {
      renderCache.delete(key)
    }
  }
}

// Clean cache periodically
setInterval(cleanupCache, 5 * 60 * 1000)  // Every 5 minutes

// ─────────────────────────────────────────────────────────────────────────────
// Content library metadata cache (avoids scanning files on every request)
// ─────────────────────────────────────────────────────────────────────────────
interface ModulesCache {
  data: any[]
  timestamp: number
}

// modulesCache moved to modulesCacheByLang in /modules endpoint
const MODULES_CACHE_TTL = 5 * 60 * 1000  // 5 minutes - content rarely changes

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Output directory for generated files
const OUTPUT_DIR = path.resolve(__dirname, '../../outputs')

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Paths to content directories (relative to web-app folder, up to repo root)
// In dev: __dirname is web-app/server/routes, go up 3 levels
// In prod: __dirname is web-app/dist/server/routes, go up 4 levels
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')
const TEMPLATES_PATH = path.join(REPO_ROOT, 'templates')

// Supported languages
type Language = 'en' | 'fr'

// Get core content path for a specific language
function getCoreContentPath(language: Language = 'en'): string {
  const suffix = language === 'en' ? '' : `_${language}`
  return path.join(REPO_ROOT, `core_content${suffix}`)
}

// Default English path for backward compatibility
const CORE_CONTENT_PATH = getCoreContentPath('en')

// Module names
const MODULE_NAMES: Record<number, string> = {
  0: 'Introduction to FASTR',
  1: 'Identify Questions & Indicators',
  2: 'Data Extraction',
  3: 'FASTR Analytics Platform',
  4: 'Data Quality Assessment',
  5: 'Data Quality Adjustment',
  6: 'Data Analysis',
  7: 'Results Communication',
  8: 'Survey & HFA',
  9: 'Workshop Activities',
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Library
// ─────────────────────────────────────────────────────────────────────────────

// Cache per language
const modulesCacheByLang: Record<string, ModulesCache> = {}

// GET /api/content/modules - Get all modules and topics (with caching)
// Query params: ?language=fr (default: en)
router.get('/modules', (req, res) => {
  try {
    const language = (req.query.language as Language) || 'en'
    const coreContentPath = getCoreContentPath(language)
    const cacheKey = language

    // Return cached data if still valid
    if (modulesCacheByLang[cacheKey] && Date.now() - modulesCacheByLang[cacheKey].timestamp < MODULES_CACHE_TTL) {
      return res.json(modulesCacheByLang[cacheKey].data)
    }

    const modules: any[] = []

    if (!fs.existsSync(coreContentPath)) {
      // Fallback to English if requested language not available
      if (language !== 'en' && fs.existsSync(CORE_CONTENT_PATH)) {
        console.warn(`Content for language '${language}' not found, falling back to English`)
        return res.redirect(`/api/content/modules?language=en`)
      }
      return res.json(modules)
    }

    const items = fs.readdirSync(coreContentPath).sort()

    for (const item of items) {
      const modulePath = path.join(coreContentPath, item)

      if (fs.statSync(modulePath).isDirectory() && item.startsWith('m') && item.includes('_')) {
        const modNumMatch = item.match(/^m(\d+)_/)
        if (!modNumMatch) continue

        const modNum = parseInt(modNumMatch[1])
        const fullTopics: any[] = []
        const condensedTopics: any[] = []

        const files = fs.readdirSync(modulePath)
          .filter(f => f.endsWith('.md'))
          .sort((a, b) => {
            // Sort by number, handling both m4_1 and m4_s1 formats
            const aMatch = a.match(/^m\d+_s?(\d+)/)
            const bMatch = b.match(/^m\d+_s?(\d+)/)
            const aNum = aMatch ? parseInt(aMatch[1]) : 0
            const bNum = bMatch ? parseInt(bMatch[1]) : 0
            if (aNum !== bNum) return aNum - bNum
            return a.localeCompare(b)
          })

        for (const file of files) {
          // Match both regular (m4_1_..., m4_1a_..., m4_1a2_...) and condensed (m4_s1_...) formats
          const topicMatch = file.match(/^(m\d+_s?\d+[a-z]*\d*)_/)
          if (!topicMatch) continue

          const topicId = topicMatch[1]
          const isCondensed = topicId.includes('_s')
          const filePath = path.join(modulePath, file)
          const content = fs.readFileSync(filePath, 'utf-8')

          // Count slides
          const slides = content.split(/^---$/m).filter(s => s.trim() && !s.trim().startsWith('marp:'))
          const slideCount = slides.length

          // Extract title
          const titleMatch = content.match(/^##\s+(.+)$/m)
          let title = titleMatch ? titleMatch[1] : ''
          title = title.replace(/\s*-\s*Module\s*\d+$/i, '').trim()

          if (!title) {
            title = file.replace('.md', '').replace(/^m\d+_s?\d+[a-z]*\d*_/, '').replace(/_/g, ' ')
            title = title.charAt(0).toUpperCase() + title.slice(1)
          }

          // Extract slide titles
          const slideTitles = content.match(/^##\s+(.+)$/gm)?.map(h => h.replace(/^##\s+/, '')) || []

          // Extract key points
          const keyPoints = content.match(/^\*\*([^*]+)\*\*/gm)?.slice(0, 4).map(b => b.replace(/\*\*/g, '')) ||
                          content.match(/^[-*]\s+(.+)$/gm)?.slice(0, 4).map(b => b.replace(/^[-*]\s+/, '')) || []

          const topic = {
            id: topicId,
            file: file,
            title: title,
            slideCount: slideCount,
            slideTitles: slideTitles.slice(0, 5),
            preview: keyPoints,
            isCondensed: isCondensed,
          }

          if (isCondensed) {
            condensedTopics.push(topic)
          } else {
            fullTopics.push(topic)
          }
        }

        // Combine topics for backward compatibility, but also provide separated lists
        const allTopics = [...fullTopics, ...condensedTopics]

        modules.push({
          number: modNum,
          id: `m${modNum}`,
          name: MODULE_NAMES[modNum] || `Module ${modNum}`,
          folder: item,
          topics: allTopics, // All topics for backward compatibility
          fullTopics: fullTopics,
          condensedTopics: condensedTopics,
          totalSlides: allTopics.reduce((sum, t) => sum + t.slideCount, 0),
          fullSlides: fullTopics.reduce((sum, t) => sum + t.slideCount, 0),
          condensedSlides: condensedTopics.reduce((sum, t) => sum + t.slideCount, 0),
        })
      }
    }

    const sortedModules = modules.sort((a, b) => a.number - b.number)

    // Cache the result per language
    modulesCacheByLang[cacheKey] = {
      data: sortedModules,
      timestamp: Date.now()
    }

    res.json(sortedModules)
  } catch (error: any) {
    console.error('Error getting modules:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/content/modules/:id - Get specific module content
router.get('/modules/:id', (req, res) => {
  try {
    const modNum = req.params.id.replace('m', '')
    const moduleFolder = fs.readdirSync(CORE_CONTENT_PATH)
      .find(f => f.startsWith(`m${modNum}_`))

    if (!moduleFolder) {
      return res.status(404).json({ error: 'Module not found' })
    }

    const modulePath = path.join(CORE_CONTENT_PATH, moduleFolder)
    const files = fs.readdirSync(modulePath).filter(f => f.endsWith('.md'))

    const slides: any[] = []
    for (const file of files) {
      const content = fs.readFileSync(path.join(modulePath, file), 'utf-8')
      slides.push({
        filename: file,
        content: content,
      })
    }

    res.json({ folder: moduleFolder, slides })
  } catch (error: any) {
    console.error('Error getting module:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/content/topic/:id - Get specific topic content
// Query params: ?language=fr (default: en)
router.get('/topic/:id', (req, res) => {
  try {
    const topicId = req.params.id
    const language = (req.query.language as Language) || 'en'
    const coreContentPath = getCoreContentPath(language)

    const modNumMatch = topicId.match(/^m(\d+)_/)
    if (!modNumMatch) {
      return res.status(400).json({ error: 'Invalid topic ID' })
    }

    const modNum = modNumMatch[1]

    // Try requested language first, fallback to English
    let contentPath = coreContentPath
    if (!fs.existsSync(contentPath)) {
      contentPath = CORE_CONTENT_PATH
    }

    const moduleFolder = fs.readdirSync(contentPath)
      .find(f => f.startsWith(`m${modNum}_`))

    if (!moduleFolder) {
      // Fallback to English if module not found in requested language
      if (language !== 'en') {
        const enModuleFolder = fs.readdirSync(CORE_CONTENT_PATH)
          .find(f => f.startsWith(`m${modNum}_`))
        if (enModuleFolder) {
          contentPath = CORE_CONTENT_PATH
        } else {
          return res.status(404).json({ error: 'Module not found' })
        }
      } else {
        return res.status(404).json({ error: 'Module not found' })
      }
    }

    const modulePath = path.join(contentPath, moduleFolder || fs.readdirSync(contentPath).find(f => f.startsWith(`m${modNum}_`))!)
    const file = fs.readdirSync(modulePath)
      .find(f => f.startsWith(`${topicId}_`) && f.endsWith('.md'))

    if (!file) {
      return res.status(404).json({ error: 'Topic not found' })
    }

    let content = fs.readFileSync(path.join(modulePath, file), 'utf-8')

    // For French, rewrite diagram paths to French versions if they exist
    if (language === 'fr') {
      const diagramsFrPath = path.join(REPO_ROOT, 'resources', 'diagrams_fr')
      content = content.replace(
        /(\(\.\.\/\.\.\/resources\/diagrams\/|\/resources\/diagrams\/)([^)]+\.svg)/g,
        (match, prefix, filename) => {
          // Check if French version exists
          const frDiagramPath = path.join(diagramsFrPath, filename)
          if (fs.existsSync(frDiagramPath)) {
            // Rewrite to French diagram path
            return prefix.replace('/diagrams/', '/diagrams_fr/')  + filename
          }
          // Keep English version if French doesn't exist
          return match
        }
      )
    }

    res.json({ filename: file, content, language })
  } catch (error: any) {
    console.error('Error getting topic:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATE_CATEGORIES = [
  {
    id: 'structure',
    name: 'Structure',
    description: 'Workshop structure slides',
    templates: [
      { id: 'title', file: 'title_slide.md', name: 'Title/Cover Page', icon: 'cover', preview: 'Workshop cover slide with title, country, dates' },
      { id: 'welcome', file: 'welcome_slide.md', name: 'Welcome & Opening', icon: 'welcome', preview: 'Day 1 only - Welcome and opening remarks' },
      { id: 'introductions', file: 'introductions_slide.md', name: 'Introductions', icon: 'people', preview: 'Day 1 only - Participant introductions' },
      { id: 'day_title', file: 'day_title.md', name: 'Day Title Page', icon: 'calendar', preview: 'Day 2+ intro slide with day number, title and date' },
      { id: 'section', file: null, name: 'Section Divider', icon: 'divider', special: true },
      { id: 'day_end', file: 'day_end.md', name: 'End of Day', icon: 'sunset', preview: 'Key messages, wrap-up, and participant reflections' },
      { id: 'closing', file: 'closing.md', name: 'Closing/Contact Info', icon: 'end', preview: 'Last slide of workshop - contact information' },
    ]
  },
  {
    id: 'breaks',
    name: 'Breaks',
    description: 'Break slides',
    templates: [
      { id: 'tea', file: 'breaks.md', name: 'Tea Break', icon: 'coffee', preview: '15-minute tea/coffee break with resume time' },
      { id: 'lunch', file: 'breaks.md', name: 'Lunch Break', icon: 'lunch', preview: '60-minute lunch break with resume time' },
    ]
  },
  {
    id: 'day_transitions',
    name: 'Day Transitions',
    description: 'Day recap and preview slides',
    templates: [
      { id: 'day_recap', file: 'day_recap.md', name: 'Day Recap', icon: 'recap', preview: 'Day 2+ only - Recap previous day, preview today' },
    ]
  },
  {
    id: 'activities',
    name: 'Activities & Demos',
    description: 'Interactive session slides',
    templates: [
      { id: 'demo_platform', file: 'demo_platform_slide.md', name: 'Platform Demo', icon: 'demo', preview: 'FASTR Analytics Platform demonstration' },
    ]
  },
  {
    id: 'custom',
    name: 'Workshop Content',
    description: 'Workshop-specific content slides',
    templates: [
      { id: 'objectives', file: 'objectives_slide.md', name: 'Workshop Objectives', icon: 'target', preview: 'Day 1 - Workshop learning objectives (from Settings)' },
      { id: 'expected_outputs', file: 'expected_outputs_slide.md', name: 'Expected Outputs', icon: 'output', preview: 'Day 1 - Workshop deliverables (from Settings)' },
    ]
  }
]

// GET /api/content/templates - Get all templates
router.get('/templates', (_req, res) => {
  try {
    const result = TEMPLATE_CATEGORIES.map(category => ({
      ...category,
      templates: category.templates.map(template => {
        let filePath = null
        if (template.file) {
          filePath = path.join(TEMPLATES_PATH, template.file)
        }

        return {
          ...template,
          path: template.file ? template.file : null,
        }
      })
    }))

    res.json(result)
  } catch (error: any) {
    console.error('Error getting templates:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/content/templates/:id - Get template content
router.get('/templates/:id', (req, res) => {
  try {
    const templateId = req.params.id

    // Find template in categories
    let templateFile: string | null = null
    for (const category of TEMPLATE_CATEGORIES) {
      const template = category.templates.find(t => t.id === templateId)
      if (template?.file) {
        templateFile = template.file
        break
      }
    }

    if (!templateFile) {
      return res.status(404).json({ error: 'Template not found' })
    }

    const filePath = path.join(TEMPLATES_PATH, templateFile)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Template file not found' })
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    res.json({ filename: templateFile, content })
  } catch (error: any) {
    console.error('Error getting template:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/content/slide/:path - Read any slide file by relative path
router.get('/slide/*', (req, res) => {
  try {
    const relativePath = (req.params as unknown as string[])[0]

    // Try core_content first, then templates
    let filePath = path.join(CORE_CONTENT_PATH, relativePath)
    if (!fs.existsSync(filePath)) {
      filePath = path.join(TEMPLATES_PATH, relativePath)
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    res.json({ path: relativePath, content })
  } catch (error: any) {
    console.error('Error reading slide:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Render markdown to HTML
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/content/render - Render markdown to HTML (with caching)
router.post('/render', async (req, res) => {
  try {
    let { markdown } = req.body

    if (!markdown) {
      return res.status(400).json({ error: 'Markdown content required' })
    }

    // Check cache first
    const cacheKey = getCacheKey(markdown)
    const cached = renderCache.get(cacheKey)
    if (cached) {
      // Update timestamp to keep frequently used items fresh
      cached.timestamp = Date.now()
      return res.json({ html: cached.html, presenterNotes: cached.presenterNotes, cached: true })
    }

    // Extract presenter notes from HTML comments (before modifying markdown)
    // Match comments that contain "PRESENTER NOTES:" - handles newlines after <!--
    const notesRegex = /<!--[\s\n]*(PRESENTER NOTES:[\s\S]*?)-->/gi
    const notesMatches = markdown.match(notesRegex) || []
    const presenterNotes = notesMatches.map((note: string) =>
      note.replace(/<!--[\s\n]*/, '').replace(/\s*-->/, '').trim()
    )

    // Rewrite relative image paths to absolute URLs
    // ../../resources/... -> /resources/...
    // ../resources/... -> /resources/...
    markdown = markdown.replace(/\(\.\.\/\.\.\/resources\//g, '(/resources/')
    markdown = markdown.replace(/\(\.\.\/resources\//g, '(/resources/')
    markdown = markdown.replace(/\(resources\//g, '(/resources/')

    // Use shared Marp service (initialized at startup, ~100ms faster per request)
    const { html, css } = renderMarkdown(markdown)

    // Create full HTML document
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>${css}</style>
  <style>
    body { margin: 0; }
    section { margin: 0 auto; }
  </style>
</head>
<body>
${html}
</body>
</html>`

    // Store in cache
    renderCache.set(cacheKey, {
      html: fullHtml,
      presenterNotes,
      timestamp: Date.now()
    })

    res.json({ html: fullHtml, presenterNotes, cached: false })
  } catch (error: any) {
    console.error('Error rendering markdown:', error)
    res.status(500).json({ error: error.message })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Export Endpoints (for Library and Quick Session modes)
// ─────────────────────────────────────────────────────────────────────────────

// Helper to build Marp-compatible markdown from topic files
function buildExportMarkdown(topicContents: string[], title: string): string {
  const frontmatter = `---
marp: true
theme: fastr
paginate: true
---

`

  // Create a title slide
  const titleSlide = `<!-- _class: title -->
![bg](../../resources/backgrounds/title_slide.png)

# ${title}

FASTR Resource Hub Export

---

`

  // Process each topic's content
  const processedContent = topicContents.map(content => {
    // Remove any existing frontmatter
    let processed = content.replace(/^---[\s\S]*?---\n*/m, '')
    // Fix image paths
    processed = processed.replace(/\(\.\.\/\.\.\/resources\//g, '(/resources/')
    processed = processed.replace(/\(\.\.\/resources\//g, '(/resources/')
    return processed.trim()
  }).join('\n\n---\n\n')

  return frontmatter + titleSlide + processedContent
}

// POST /api/content/export/module/:id - Export a single module
router.post('/export/module/:id', async (req, res) => {
  try {
    const { format = 'markdown' } = req.body
    const modNum = req.params.id.replace('m', '')

    // Find module folder
    const moduleFolder = fs.readdirSync(CORE_CONTENT_PATH)
      .find(f => f.startsWith(`m${modNum}_`))

    if (!moduleFolder) {
      return res.status(404).json({ error: 'Module not found' })
    }

    const modulePath = path.join(CORE_CONTENT_PATH, moduleFolder)
    const moduleName = MODULE_NAMES[parseInt(modNum)] || `Module ${modNum}`

    // Read all topic files in the module
    const files = fs.readdirSync(modulePath)
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => {
        const aMatch = a.match(/^m\d+_(\d+)/)
        const bMatch = b.match(/^m\d+_(\d+)/)
        const aNum = aMatch ? parseInt(aMatch[1]) : 0
        const bNum = bMatch ? parseInt(bMatch[1]) : 0
        return aNum - bNum
      })

    const topicContents: string[] = []
    for (const file of files) {
      const content = fs.readFileSync(path.join(modulePath, file), 'utf-8')
      topicContents.push(content)
    }

    // Build the combined markdown
    const markdown = buildExportMarkdown(topicContents, moduleName)
    const outputBaseName = `module_${modNum}_${moduleFolder.replace(`m${modNum}_`, '')}`

    if (format === 'markdown' || format === 'md') {
      const outputPath = path.join(OUTPUT_DIR, `${outputBaseName}.md`)
      fs.writeFileSync(outputPath, markdown, 'utf-8')

      res.json({
        success: true,
        markdown,
        path: outputPath,
        filename: `${outputBaseName}.md`,
        downloadUrl: `/api/content/export/download/${outputBaseName}.md`,
      })
    } else if (format === 'html') {
      // Render to HTML using shared Marp service
      const { html, css } = renderMarkdown(markdown)
      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${moduleName}</title>
  <style>${css}</style>
</head>
<body>
${html}
</body>
</html>`

      const outputPath = path.join(OUTPUT_DIR, `${outputBaseName}.html`)
      fs.writeFileSync(outputPath, fullHtml, 'utf-8')

      res.json({
        success: true,
        html: fullHtml,
        path: outputPath,
        filename: `${outputBaseName}.html`,
        downloadUrl: `/api/content/export/download/${outputBaseName}.html`,
      })
    } else if (format === 'pdf') {
      // Save markdown first, then generate PDF
      const mdPath = path.join(OUTPUT_DIR, `${outputBaseName}.md`)
      fs.writeFileSync(mdPath, markdown, 'utf-8')

      const pdfPath = path.join(OUTPUT_DIR, `${outputBaseName}.pdf`)
      await generatePDF(mdPath, pdfPath)

      res.json({
        success: true,
        path: pdfPath,
        filename: `${outputBaseName}.pdf`,
        downloadUrl: `/api/content/export/download/${outputBaseName}.pdf`,
      })
    } else {
      return res.status(400).json({ error: 'Invalid format. Use markdown, html, or pdf.' })
    }
  } catch (error: any) {
    console.error('Error exporting module:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST /api/content/export/selection - Export selected topics and templates
router.post('/export/selection', async (req, res) => {
  try {
    const { topicIds = [], templateFiles = [], format = 'markdown', title = 'FASTR Selection', language = 'en' } = req.body
    const coreContentPath = getCoreContentPath(language as Language)

    if ((!topicIds || topicIds.length === 0) && (!templateFiles || templateFiles.length === 0)) {
      return res.status(400).json({ error: 'topicIds or templateFiles array is required' })
    }

    // Read content for each topic
    const topicContents: string[] = []

    // Load template files first
    for (const templateFile of templateFiles) {
      const filePath = path.join(TEMPLATES_PATH, templateFile)
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        topicContents.push(content)
      }
    }

    // Then load topic content (use requested language, fallback to English)
    for (const topicId of topicIds) {
      const modNumMatch = topicId.match(/^m(\d+)_/)
      if (!modNumMatch) continue

      const modNum = modNumMatch[1]

      // Try requested language first, fallback to English
      let contentPath = fs.existsSync(coreContentPath) ? coreContentPath : CORE_CONTENT_PATH
      let moduleFolder = fs.readdirSync(contentPath)
        .find(f => f.startsWith(`m${modNum}_`))

      // Fallback to English if not found
      if (!moduleFolder && contentPath !== CORE_CONTENT_PATH) {
        contentPath = CORE_CONTENT_PATH
        moduleFolder = fs.readdirSync(contentPath)
          .find(f => f.startsWith(`m${modNum}_`))
      }

      if (!moduleFolder) continue

      const modulePath = path.join(contentPath, moduleFolder)
      const file = fs.readdirSync(modulePath)
        .find(f => f.startsWith(`${topicId}_`) && f.endsWith('.md'))

      if (!file) continue

      const content = fs.readFileSync(path.join(modulePath, file), 'utf-8')
      topicContents.push(content)
    }

    if (topicContents.length === 0) {
      return res.status(404).json({ error: 'No valid content found' })
    }

    // Build the combined markdown
    const markdown = buildExportMarkdown(topicContents, title)

    // Generate filename from title
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const outputBaseName = `selection_${safeTitle}_${timestamp}`

    if (format === 'markdown' || format === 'md') {
      const outputPath = path.join(OUTPUT_DIR, `${outputBaseName}.md`)
      fs.writeFileSync(outputPath, markdown, 'utf-8')

      res.json({
        success: true,
        markdown,
        path: outputPath,
        filename: `${outputBaseName}.md`,
        downloadUrl: `/api/content/export/download/${outputBaseName}.md`,
        topicsExported: topicContents.length,
      })
    } else if (format === 'html') {
      // Render to HTML using shared Marp service
      const { html, css } = renderMarkdown(markdown)
      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>${css}</style>
</head>
<body>
${html}
</body>
</html>`

      const outputPath = path.join(OUTPUT_DIR, `${outputBaseName}.html`)
      fs.writeFileSync(outputPath, fullHtml, 'utf-8')

      res.json({
        success: true,
        html: fullHtml,
        path: outputPath,
        filename: `${outputBaseName}.html`,
        downloadUrl: `/api/content/export/download/${outputBaseName}.html`,
        topicsExported: topicContents.length,
      })
    } else if (format === 'pdf') {
      const mdPath = path.join(OUTPUT_DIR, `${outputBaseName}.md`)
      fs.writeFileSync(mdPath, markdown, 'utf-8')

      const pdfPath = path.join(OUTPUT_DIR, `${outputBaseName}.pdf`)
      await generatePDF(mdPath, pdfPath)

      res.json({
        success: true,
        path: pdfPath,
        filename: `${outputBaseName}.pdf`,
        downloadUrl: `/api/content/export/download/${outputBaseName}.pdf`,
        topicsExported: topicContents.length,
      })
    } else if (format === 'pptx') {
      // Create a minimal config for PPTX generation
      const minimalConfig = {
        workshop: {
          name: title,
          country: '',
          location: '',
          facilitators: 'FASTR Team',
        },
        schedule: { days: 1 },
        content: { modules: [], custom_slides: [] },
      }

      const pptxPath = path.join(OUTPUT_DIR, `${outputBaseName}.pptx`)
      await generatePPTX(markdown, minimalConfig as any, pptxPath)

      res.json({
        success: true,
        path: pptxPath,
        filename: `${outputBaseName}.pptx`,
        downloadUrl: `/api/content/export/download/${outputBaseName}.pptx`,
        topicsExported: topicContents.length,
      })
    } else {
      return res.status(400).json({ error: 'Invalid format. Use markdown, html, pdf, or pptx.' })
    }
  } catch (error: any) {
    console.error('Error exporting selection:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/content/export/download/:filename - Download exported file
router.get('/export/download/:filename', (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(OUTPUT_DIR, filename)

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    res.download(filePath, filename)
  } catch (error: any) {
    console.error('Error downloading file:', error)
    res.status(500).json({ error: error.message })
  }
})

// GET /api/content/cache/stats - Get render cache statistics
router.get('/cache/stats', (_req, res) => {
  res.json({
    size: renderCache.size,
    maxSize: CACHE_MAX_SIZE,
    ttlMs: CACHE_TTL
  })
})

// POST /api/content/cache/clear - Clear render cache
router.post('/cache/clear', (_req, res) => {
  renderCache.clear()
  res.json({ success: true, message: 'Cache cleared' })
})

// ─────────────────────────────────────────────────────────────────────────────
// Content Rebuild Endpoint
// ─────────────────────────────────────────────────────────────────────────────

// POST /api/content/rebuild - Re-extract slides from methodology files
// Query params: ?language=fr or ?language=en,fr (default: en)
router.post('/rebuild', async (req, res) => {
  const { exec } = await import('child_process')
  const { promisify } = await import('util')
  const execAsync = promisify(exec)

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const REPO_ROOT = process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../../../..')
    : path.resolve(__dirname, '../../..')

  const scriptPath = path.join(REPO_ROOT, 'tools', '00_extract_slides.py')

  // Parse languages from query param (comma-separated or repeated)
  let languages: string[] = ['en']
  if (req.query.language) {
    const langParam = Array.isArray(req.query.language)
      ? req.query.language.join(',')
      : req.query.language as string
    languages = langParam.split(',').filter(l => ['en', 'fr'].includes(l))
    if (languages.length === 0) languages = ['en']
  }

  // Check if script exists
  if (!fs.existsSync(scriptPath)) {
    return res.status(404).json({
      error: 'Extract script not found',
      path: scriptPath
    })
  }

  try {
    console.log(`Running content extraction script for languages: ${languages.join(', ')}...`)
    const startTime = Date.now()

    // Build command with language args
    const langArgs = languages.map(l => `--lang ${l}`).join(' ')
    const { stdout, stderr } = await execAsync(`python3 "${scriptPath}" ${langArgs}`, {
      cwd: REPO_ROOT,
      timeout: 120000  // 2 minute timeout
    })

    const duration = Date.now() - startTime

    // Clear the modules cache for all languages so new content is picked up
    for (const lang of languages) {
      delete modulesCacheByLang[lang]
    }

    // Also clear render cache
    renderCache.clear()

    console.log('Content extraction complete in', duration, 'ms')

    res.json({
      success: true,
      message: `Content rebuilt successfully for ${languages.join(', ')}`,
      languages: languages,
      duration: duration,
      output: stdout,
      warnings: stderr || undefined
    })
  } catch (error: any) {
    console.error('Content rebuild error:', error)
    res.status(500).json({
      error: 'Failed to rebuild content',
      message: error.message,
      stderr: error.stderr
    })
  }
})

export default router
