import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths to content directories (relative to web-app folder, up to repo root)
const REPO_ROOT = path.resolve(__dirname, '../../..')
const CORE_CONTENT_PATH = path.join(REPO_ROOT, 'core_content')
const TEMPLATES_PATH = path.join(REPO_ROOT, 'templates')

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
}

// ─────────────────────────────────────────────────────────────────────────────
// Content Library
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/content/modules - Get all modules and topics
router.get('/modules', (_req, res) => {
  try {
    const modules: any[] = []

    if (!fs.existsSync(CORE_CONTENT_PATH)) {
      return res.json(modules)
    }

    const items = fs.readdirSync(CORE_CONTENT_PATH).sort()

    for (const item of items) {
      const modulePath = path.join(CORE_CONTENT_PATH, item)

      if (fs.statSync(modulePath).isDirectory() && item.startsWith('m') && item.includes('_')) {
        const modNumMatch = item.match(/^m(\d+)_/)
        if (!modNumMatch) continue

        const modNum = parseInt(modNumMatch[1])
        const topics: any[] = []

        const files = fs.readdirSync(modulePath)
          .filter(f => f.endsWith('.md'))
          .sort((a, b) => {
            const aMatch = a.match(/^m\d+_(\d+)/)
            const bMatch = b.match(/^m\d+_(\d+)/)
            const aNum = aMatch ? parseInt(aMatch[1]) : 0
            const bNum = bMatch ? parseInt(bMatch[1]) : 0
            if (aNum !== bNum) return aNum - bNum
            return a.localeCompare(b)
          })

        for (const file of files) {
          const topicMatch = file.match(/^(m\d+_\d+[a-z]?)_/)
          if (!topicMatch) continue

          const topicId = topicMatch[1]
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
            title = file.replace('.md', '').replace(/^m\d+_\d+[a-z]?_/, '').replace(/_/g, ' ')
            title = title.charAt(0).toUpperCase() + title.slice(1)
          }

          // Extract slide titles
          const slideTitles = content.match(/^##\s+(.+)$/gm)?.map(h => h.replace(/^##\s+/, '')) || []

          // Extract key points
          const keyPoints = content.match(/^\*\*([^*]+)\*\*/gm)?.slice(0, 4).map(b => b.replace(/\*\*/g, '')) ||
                          content.match(/^[-*]\s+(.+)$/gm)?.slice(0, 4).map(b => b.replace(/^[-*]\s+/, '')) || []

          topics.push({
            id: topicId,
            file: file,
            title: title,
            slideCount: slideCount,
            slideTitles: slideTitles.slice(0, 5),
            preview: keyPoints,
          })
        }

        modules.push({
          number: modNum,
          id: `m${modNum}`,
          name: MODULE_NAMES[modNum] || `Module ${modNum}`,
          folder: item,
          topics: topics,
          totalSlides: topics.reduce((sum, t) => sum + t.slideCount, 0),
        })
      }
    }

    res.json(modules.sort((a, b) => a.number - b.number))
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
router.get('/topic/:id', (req, res) => {
  try {
    const topicId = req.params.id
    const modNumMatch = topicId.match(/^m(\d+)_/)
    if (!modNumMatch) {
      return res.status(400).json({ error: 'Invalid topic ID' })
    }

    const modNum = modNumMatch[1]
    const moduleFolder = fs.readdirSync(CORE_CONTENT_PATH)
      .find(f => f.startsWith(`m${modNum}_`))

    if (!moduleFolder) {
      return res.status(404).json({ error: 'Module not found' })
    }

    const modulePath = path.join(CORE_CONTENT_PATH, moduleFolder)
    const file = fs.readdirSync(modulePath)
      .find(f => f.startsWith(`${topicId}_`) && f.endsWith('.md'))

    if (!file) {
      return res.status(404).json({ error: 'Topic not found' })
    }

    const content = fs.readFileSync(path.join(modulePath, file), 'utf-8')
    res.json({ filename: file, content })
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
      { id: 'day_recap', file: null, name: 'Day Recap', icon: 'recap', special: true, preview: 'Day 2+ only - Recap previous day, preview today' },
    ]
  },
  {
    id: 'activities',
    name: 'Activities & Demos',
    description: 'Interactive session slides',
    templates: [
      { id: 'expectations', file: 'expectations_slide.md', name: 'Expectations', icon: 'sticky', preview: 'Sticky note activity for participant expectations' },
      { id: 'demo_platform', file: 'demo_platform_slide.md', name: 'Platform Demo', icon: 'demo', preview: 'FASTR Analytics Platform demonstration' },
    ]
  },
  {
    id: 'custom',
    name: 'Workshop Content',
    description: 'Workshop-specific content slides',
    templates: [
      { id: 'objectives', file: 'custom_slides/01_objectives.md', name: 'Workshop Objectives', icon: 'target', preview: 'Day 1 - Workshop learning objectives' },
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
    const relativePath = req.params[0]

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

export default router
