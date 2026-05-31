import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import yaml from 'js-yaml'
import { fileURLToPath } from 'url'
import { generatePDF } from '../services/pdfGenerator.js'
import { generatePPTX } from '../services/pptxGenerator.js'
import { renderMarkdown, getThemeCSS } from '../services/marpService.js'
import {
  loadModulesRegistry,
  loadModuleMeta,
  loadThemesRegistry,
  getModuleNamesDict,
  getModuleFolder,
  invalidateRegistryCache,
  loadImportedModules,
} from '../services/moduleRegistry.js'
import { getAllExternalDecks } from '../db/database.js'

const router = Router()

/** Deduplicate topic arrays by id, keeping first occurrence */
function dedupeById<T extends { id: string }>(arr: T[]): T[] {
  const seen = new Set<string>()
  return arr.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

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
const TEMPLATES_FR_PATH = path.join(REPO_ROOT, 'templates_fr')

// Get templates path for a specific language
function getTemplatesPath(language: Language = 'en'): string {
  if (language === 'fr' && fs.existsSync(TEMPLATES_FR_PATH)) {
    return TEMPLATES_FR_PATH
  }
  return TEMPLATES_PATH
}

// Supported languages
type Language = 'en' | 'fr' | 'pt' | 'pt'

// Get core content path for a specific language
function getCoreContentPath(language: Language = 'en'): string {
  const suffix = language === 'en' ? '' : `_${language}`
  return path.join(REPO_ROOT, `core_content${suffix}`)
}

// Default English path for backward compatibility
const CORE_CONTENT_PATH = getCoreContentPath('en')

// Module names loaded from modules.yaml via registry
// (replaces hardcoded MODULE_NAMES dict)

// ─────────────────────────────────────────────────────────────────────────────
// Content Library
// ─────────────────────────────────────────────────────────────────────────────

// Cache per language
const modulesCacheByLang: Record<string, ModulesCache> = {}

// GET /api/content/modules - Get all modules and topics (with caching)
// Query params: ?language=fr (default: en)
router.get('/modules', async (req, res) => {
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

    // Load module definitions from registry (modules.yaml)
    const registryModules = loadModulesRegistry()
    const moduleNames = getModuleNamesDict(language)

    for (const regMod of registryModules) {
      if (regMod.deprecated) continue   // hidden from the export picker
      const modulePath = path.join(coreContentPath, regMod.folder)
      if (!fs.existsSync(modulePath) || !fs.statSync(modulePath).isDirectory()) continue

      const modNum: number | string = /^\d+$/.test(regMod.number) ? parseInt(regMod.number) : regMod.number
      const modId = regMod.id

      const fullTopics: any[] = []
      const condensedTopics: any[] = []

      // Try _meta.yaml first for slide ordering
      const meta = loadModuleMeta(coreContentPath, regMod.folder)

      if (meta?.slides) {
        // Use metadata-driven discovery, sorted by order field
        const sortedSlides = [...meta.slides].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        for (const entry of sortedSlides) {
          const file = entry.file
          const filePath = path.join(modulePath, file)
          if (!fs.existsSync(filePath)) continue

          const content = fs.readFileSync(filePath, 'utf-8')

          // Filter out activity-pointer slides — they're placeholders that point
          // to handouts; users find them through the Handouts tab now.
          if (content.includes('_class: activity-pointer')) continue

          // Count slides
          const slides = content.split(/^---$/m).filter(s => s.trim() && !s.trim().startsWith('marp:'))
          const slideCount = slides.length

          // Use title from meta, fall back to file parsing
          let title = entry.title || ''
          if (!title) {
            const titleMatch = content.match(/^##\s+(.+)$/m)
            title = titleMatch ? titleMatch[1].replace(/\s*-\s*Module\s*\d+$/i, '').trim() : ''
          }
          if (!title) {
            title = file.replace('.md', '').replace(/^m\d+[a-z]?_s?\d+[a-z]*\d*_/, '').replace(/^mai_\d+[a-z]?_/, '').replace(/^\d+[a-z]?_/, '').replace(/_/g, ' ')
            title = title.charAt(0).toUpperCase() + title.slice(1)
          }

          // Topic ID = full filename stem (unique). Using a truncated prefix
          // here caused prefix-colliding files (e.g. m4_1b_*, m4_1c_*) to share
          // an ID and get silently dropped by dedupeById.
          const topicId = file.replace(/\.md$/, '')

          // Extract slide titles
          const slideTitles = content.match(/^##\s+(.+)$/gm)?.map(h => h.replace(/^##\s+/, '')) || []

          // Extract key points
          const keyPoints = content.match(/^\*\*([^*]+)\*\*/gm)?.slice(0, 4).map(b => b.replace(/\*\*/g, '')) ||
                          content.match(/^[-*]\s+(.+)$/gm)?.slice(0, 4).map(b => b.replace(/^[-*]\s+/, '')) || []

          const isCondensed = entry.variant === 'condensed'

          const topic = {
            id: topicId,
            file: file,
            title: title,
            slideCount: slideCount,
            slideTitles: slideTitles.slice(0, 5),
            preview: keyPoints,
            isCondensed: isCondensed,
            status: entry.status || undefined,
          }

          if (isCondensed) {
            condensedTopics.push(topic)
          } else {
            fullTopics.push(topic)
          }
        }
      } else {
        // Fallback: regex-based discovery (safety net if _meta.yaml missing)
        const files = fs.readdirSync(modulePath)
          .filter(f => f.endsWith('.md'))
          .sort((a, b) => {
            const aMatch = a.match(/^(?:m\d+[a-z]?_s?)?(\d+)/)
            const bMatch = b.match(/^(?:m\d+[a-z]?_s?)?(\d+)/)
            const aNum = aMatch ? parseInt(aMatch[1]) : 0
            const bNum = bMatch ? parseInt(bMatch[1]) : 0
            if (aNum !== bNum) return aNum - bNum
            return a.localeCompare(b)
          })

        for (const file of files) {
          let topicMatch = file.match(/^(m\d+[a-z]?_s?\d+[a-z]*\d*)_/) || file.match(/^(mai_\d+[a-z]?)_/)
          if (!topicMatch) continue
          // Topic ID = full filename stem (unique); condensed detected from the prefix.
          const topicId = file.replace(/\.md$/, '')
          const isCondensed = topicMatch[1].includes('_s')
          const filePath = path.join(modulePath, file)
          const content = fs.readFileSync(filePath, 'utf-8')

          if (content.includes('_class: activity-pointer')) continue

          const slides = content.split(/^---$/m).filter(s => s.trim() && !s.trim().startsWith('marp:'))
          const slideCount = slides.length

          const titleMatch = content.match(/^##\s+(.+)$/m)
          let title = titleMatch ? titleMatch[1] : ''
          title = title.replace(/\s*-\s*Module\s*\d+$/i, '').trim()

          if (!title) {
            title = file.replace('.md', '').replace(/^m\d+[a-z]?_s?\d+[a-z]*\d*_/, '').replace(/_/g, ' ')
            title = title.charAt(0).toUpperCase() + title.slice(1)
          }

          const slideTitles = content.match(/^##\s+(.+)$/gm)?.map(h => h.replace(/^##\s+/, '')) || []
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
      }

      // Combine topics for backward compatibility, but also provide separated lists
      const allTopics = [...fullTopics, ...condensedTopics]

      modules.push({
        number: modNum,
        id: modId,
        name: regMod.name[language] || regMod.name.en || `Module ${modNum}`,
        folder: regMod.folder,
        theme: regMod.theme,
        topics: dedupeById(allTopics),
        fullTopics: dedupeById(fullTopics),
        condensedTopics: dedupeById(condensedTopics),
        totalSlides: allTopics.reduce((sum, t) => sum + t.slideCount, 0),
        fullSlides: fullTopics.reduce((sum, t) => sum + t.slideCount, 0),
        condensedSlides: condensedTopics.reduce((sum, t) => sum + t.slideCount, 0),
      })
    }

    // Modules are already in correct order from modules.yaml
    const sortedModules = modules

    // Append imported modules from database
    try {
      const imported = await loadImportedModules()
      for (const imp of imported) {
        sortedModules.push({
          number: imp.id,
          id: imp.id,
          name: imp.name,
          folder: '',
          topics: [],
          fullTopics: [],
          condensedTopics: [],
          totalSlides: imp.slideCount,
          fullSlides: imp.slideCount,
          condensedSlides: 0,
          isImported: true,
          sourceFilename: imp.sourceFilename,
        })
      }
    } catch (e) {
      // Don't fail the entire request if imported modules can't be loaded
      console.warn('Failed to load imported modules:', e)
    }

    // Append external decks (PDF pages as images)
    try {
      const externalDecks = await getAllExternalDecks()
      for (const deck of externalDecks) {
        sortedModules.push({
          number: `ext_${deck.id}`,
          id: `external_${deck.id}`,
          name: deck.name,
          folder: '',
          topics: [],
          fullTopics: [],
          condensedTopics: [],
          totalSlides: deck.page_count,
          fullSlides: deck.page_count,
          condensedSlides: 0,
          isExternal: true,
          pageCount: deck.page_count,
          sourceFilename: deck.source_filename,
        })
      }
    } catch (e) {
      console.warn('Failed to load external decks:', e)
    }

    // Cache the result per language
    modulesCacheByLang[cacheKey] = {
      data: sortedModules,
      timestamp: Date.now()
    }

    res.json(sortedModules)
  } catch (error: any) {
    console.error('Error getting modules:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/content/themes - Get theme definitions for grouping modules in UI
// Query params: ?language=fr (default: en)
router.get('/themes', (req, res) => {
  try {
    const language = ((req.query.language as Language) || 'en') as 'en' | 'fr' | 'pt' | 'pt'
    const themes = loadThemesRegistry()
    res.json(themes.map(t => ({
      id: t.id,
      name: t.name[language] || t.name.en,
    })))
  } catch (error: any) {
    console.error('Error getting themes:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/content/modules/:id - Get specific module content
router.get('/modules/:id', (req, res) => {
  try {
    const modId = req.params.id
    const moduleFolder = getModuleFolder(modId)

    if (!moduleFolder) {
      return res.status(404).json({ error: 'Module not found' })
    }

    const modulePath = path.join(CORE_CONTENT_PATH, moduleFolder)
    if (!fs.existsSync(modulePath)) {
      return res.status(404).json({ error: 'Module folder not found' })
    }
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
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/content/topic/:id - Get specific topic content
// Query params: ?language=fr (default: en)
router.get('/topic/:id', (req, res) => {
  try {
    const topicId = req.params.id
    const language = (req.query.language as Language) || 'en'
    const coreContentPath = getCoreContentPath(language)

    let contentPath = coreContentPath
    if (!fs.existsSync(contentPath)) {
      contentPath = CORE_CONTENT_PATH
    }

    let moduleFolder: string | undefined
    let filePrefix: string

    // Determine module ID from topic ID. topicId is the full filename stem
    // (e.g. mai_3_capabilities, m4_1_overview) or a legacy prefix (mai_3, m4_1).
    const aiMatch = /^mai_/.test(topicId)
    const modNumMatch = topicId.match(/^m(\d+[a-z]?)_/)

    if (aiMatch) {
      // AI module — lookup folder from registry
      moduleFolder = getModuleFolder('mai') || undefined
      if (!moduleFolder) {
        // Fallback to filesystem scan
        moduleFolder = fs.readdirSync(contentPath).find(f => f.startsWith('mai_'))
      }

      // Check folder exists in requested language, fallback to English
      if (moduleFolder && !fs.existsSync(path.join(contentPath, moduleFolder)) && language !== 'en') {
        if (fs.existsSync(path.join(CORE_CONTENT_PATH, moduleFolder))) {
          contentPath = CORE_CONTENT_PATH
        }
      }
    } else if (modNumMatch) {
      const modNum = modNumMatch[1]
      const modId = `m${modNum}`

      // Lookup folder from registry
      moduleFolder = getModuleFolder(modId) || undefined
      if (!moduleFolder) {
        // Fallback to filesystem scan
        moduleFolder = fs.readdirSync(contentPath).find(f => f.startsWith(`m${modNum}_`))
      }

      // Check folder exists in requested language, fallback to English
      if (moduleFolder && !fs.existsSync(path.join(contentPath, moduleFolder))) {
        if (language !== 'en' && fs.existsSync(path.join(CORE_CONTENT_PATH, moduleFolder))) {
          contentPath = CORE_CONTENT_PATH
        }
      }
    } else {
      return res.status(400).json({ error: 'Invalid topic ID' })
    }

    if (!moduleFolder) {
      return res.status(404).json({ error: 'Module not found' })
    }

    // startsWith handles both forms: a stem matches its own file exactly;
    // a legacy prefix matches the first file under it.
    filePrefix = topicId
    const modulePath = path.join(contentPath, moduleFolder)
    if (!fs.existsSync(modulePath)) {
      return res.status(404).json({ error: 'Module folder not found' })
    }

    const file = fs.readdirSync(modulePath)
      .find(f => f.startsWith(filePrefix) && f.endsWith('.md'))

    if (!file) {
      return res.status(404).json({ error: 'Topic not found' })
    }

    let content = fs.readFileSync(path.join(modulePath, file), 'utf-8')

    // For French, rewrite diagram paths to French versions if they exist
    if (language === 'fr') {
      const diagramsFrPath = path.join(REPO_ROOT, 'resources', 'diagrams_fr')
      content = content.replace(
        /(\(\.\.\/\.\.\/resources\/diagrams\/|\/resources\/diagrams\/)([^)]+\.(svg|png))/g,
        (match, prefix, filename) => {
          // Check if French version exists (exact match or SVG version of PNG)
          const frDiagramPath = path.join(diagramsFrPath, filename)
          if (fs.existsSync(frDiagramPath)) {
            return prefix.replace('/diagrams/', '/diagrams_fr/') + filename
          }
          // Check if SVG version exists in FR (e.g., EN has .png, FR has .svg)
          const svgFilename = filename.replace(/\.png$/, '.svg')
          const frSvgPath = path.join(diagramsFrPath, svgFilename)
          if (svgFilename !== filename && fs.existsSync(frSvgPath)) {
            return prefix.replace('/diagrams/', '/diagrams_fr/') + svgFilename
          }
          // Keep English version if French doesn't exist
          return match
        }
      )
    }

    res.json({ filename: file, content, language })
  } catch (error: any) {
    console.error('Error getting topic:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Templates
// ─────────────────────────────────────────────────────────────────────────────

// EN + FR have curated template categories. PT reuses EN as a fallback until
// translated descriptions are added (the file references resolve via the
// templates_pt/ folder, so PT users see the right template content).
const TEMPLATE_CATEGORIES_BASE: Partial<Record<Language, any[]>> = {
  en: [
    {
      id: 'structure',
      name: 'Structure',
      description: 'Workshop structure and content slides',
      templates: [
        { id: 'title', file: 'title_slide.md', name: 'Title/Cover Page', icon: 'cover', preview: 'Cover slide with title, country, dates' },
        { id: 'welcome', file: 'welcome_slide.md', name: 'Welcome & Opening', icon: 'welcome', preview: 'Welcome and opening remarks' },
        { id: 'introductions', file: 'introductions_slide.md', name: 'Introductions', icon: 'people', preview: 'Participant introductions' },
        { id: 'objectives', file: 'objectives_slide.md', name: 'Workshop Objectives', icon: 'target', preview: 'Learning objectives (from Settings)' },
        { id: 'expected_outputs', file: 'expected_outputs_slide.md', name: 'Expected Outputs', icon: 'output', preview: 'Workshop deliverables (from Settings)' },
        { id: 'meeting_norms', file: 'meeting_norms.md', name: 'Meeting Norms', icon: 'people', preview: 'Ground rules and safe space' },
        { id: 'section', file: 'section_divider.md', name: 'Section Divider', icon: 'divider', special: true, preview: 'Section divider with title' },
        { id: 'activity', file: 'activity_divider.md', name: 'Activity', icon: 'demo', preview: 'Signpost a hands-on activity (see handout)' },
        { id: 'day_title', file: 'day_title.md', name: 'Day Title Page', icon: 'calendar', preview: 'Day intro slide with number, title, date' },
        { id: 'day_recap', file: 'day_recap.md', name: 'Day Recap', icon: 'recap', preview: 'Recap previous day, preview today' },
        { id: 'day_end', file: 'day_end.md', name: 'End of Day', icon: 'sunset', preview: 'Wrap-up and participant reflections' },
        { id: 'closing', file: 'closing.md', name: 'Closing/Contact Info', icon: 'end', preview: 'Last slide - contact information' },
      ]
    },
    {
      id: 'breaks',
      name: 'Breaks',
      description: 'Break slides',
      templates: [
        { id: 'tea', file: 'tea_break.md', name: 'Tea Break', icon: 'coffee', preview: '15-minute tea/coffee break' },
        { id: 'lunch', file: 'lunch_break.md', name: 'Lunch Break', icon: 'lunch', preview: '60-minute lunch break' },
      ]
    },
    {
      id: 'webinar',
      name: 'Webinar & Engagement',
      description: 'Interactive engagement slides for webinars',
      templates: [
        { id: 'webinar_icebreaker', file: 'webinar_icebreaker.md', name: 'Icebreaker', icon: 'people', preview: 'Opening engagement activity' },
        { id: 'webinar_poll', file: 'webinar_poll.md', name: 'Poll', icon: 'target', preview: 'Poll with placeholder question' },
        { id: 'webinar_chat_prompt', file: 'webinar_chat_prompt.md', name: 'Chat Prompt', icon: 'demo', preview: '"Share in the chat..." prompt' },
        { id: 'webinar_qa', file: 'webinar_qa.md', name: 'Q&A Moment', icon: 'demo', preview: 'Dedicated Q&A pause' },
        { id: 'webinar_discussion', file: 'webinar_discussion.md', name: 'Discussion', icon: 'demo', preview: 'Open discussion or breakout prompt' },
        { id: 'webinar_reflection', file: 'webinar_reflection.md', name: 'Reflection', icon: 'demo', preview: 'Pause for individual reflection' },
        { id: 'webinar_transition', file: 'webinar_transition.md', name: 'Section Transition', icon: 'divider', preview: 'Recap + preview between sections' },
        { id: 'webinar_closing_cta', file: 'webinar_closing_cta.md', name: 'Closing & Next Steps', icon: 'end', preview: 'Closing with action items' },
        { id: 'webinar_logistics', file: 'webinar_logistics.md', name: 'Virtual Logistics', icon: 'target', preview: 'Meeting setup and participation rules' },
        { id: 'webinar_next_steps', file: 'webinar_next_steps.md', name: 'Next Steps', icon: 'end', preview: 'Follow-up actions and resources' },
        { id: 'learning_exchange', file: 'learning_exchange_overview.md', name: 'Learning Exchange', icon: 'demo', preview: 'Learning exchange overview' },
      ]
    }
  ],
  fr: [
    {
      id: 'structure',
      name: 'Structure',
      description: 'Diapositives de structure et contenu',
      templates: [
        { id: 'title', file: 'title_slide.md', name: 'Page de titre', icon: 'cover', preview: 'Couverture avec titre, pays, dates' },
        { id: 'welcome', file: 'welcome_slide.md', name: 'Bienvenue & Ouverture', icon: 'welcome', preview: 'Bienvenue et remarques d\'ouverture' },
        { id: 'introductions', file: 'introductions_slide.md', name: 'Présentations', icon: 'people', preview: 'Présentations des participants' },
        { id: 'objectives', file: 'objectives_slide.md', name: 'Objectifs de l\'atelier', icon: 'target', preview: 'Objectifs d\'apprentissage (depuis Paramètres)' },
        { id: 'expected_outputs', file: 'expected_outputs_slide.md', name: 'Résultats attendus', icon: 'output', preview: 'Livrables de l\'atelier (depuis Paramètres)' },
        { id: 'meeting_norms', file: 'meeting_norms.md', name: 'Normes de la rencontre', icon: 'people', preview: 'Règles et espace sûr' },
        { id: 'section', file: 'section_divider.md', name: 'Séparateur de section', icon: 'divider', special: true, preview: 'Séparateur avec titre' },
        { id: 'activity', file: 'activity_divider.md', name: 'Activité', icon: 'demo', preview: 'Signaler une activité pratique (voir document)' },
        { id: 'day_title', file: 'day_title.md', name: 'Page de titre du jour', icon: 'calendar', preview: 'Intro du jour avec numéro, titre, date' },
        { id: 'day_recap', file: 'day_recap.md', name: 'Récapitulatif du jour', icon: 'recap', preview: 'Récap de la veille, aperçu du jour' },
        { id: 'day_end', file: 'day_end.md', name: 'Fin de journée', icon: 'sunset', preview: 'Conclusion et réflexions' },
        { id: 'closing', file: 'closing.md', name: 'Clôture/Coordonnées', icon: 'end', preview: 'Dernière diapositive - coordonnées' },
      ]
    },
    {
      id: 'breaks',
      name: 'Pauses',
      description: 'Diapositives de pause',
      templates: [
        { id: 'tea', file: 'tea_break.md', name: 'Pause café', icon: 'coffee', preview: 'Pause café/thé de 15 minutes' },
        { id: 'lunch', file: 'lunch_break.md', name: 'Pause déjeuner', icon: 'lunch', preview: 'Pause déjeuner de 60 minutes' },
      ]
    },
    {
      id: 'webinar',
      name: 'Webinaire & Engagement',
      description: 'Diapositives interactives pour webinaires',
      templates: [
        { id: 'webinar_icebreaker', file: 'webinar_icebreaker.md', name: 'Brise-glace', icon: 'people', preview: 'Activité d\'ouverture engageante' },
        { id: 'webinar_poll', file: 'webinar_poll.md', name: 'Sondage', icon: 'target', preview: 'Sondage avec question' },
        { id: 'webinar_chat_prompt', file: 'webinar_chat_prompt.md', name: 'Prompt chat', icon: 'demo', preview: '"Partagez dans le chat..." prompt' },
        { id: 'webinar_qa', file: 'webinar_qa.md', name: 'Questions & réponses', icon: 'demo', preview: 'Pause Q&R dédiée' },
        { id: 'webinar_discussion', file: 'webinar_discussion.md', name: 'Discussion', icon: 'demo', preview: 'Discussion ouverte ou sous-groupes' },
        { id: 'webinar_reflection', file: 'webinar_reflection.md', name: 'Réflexion', icon: 'demo', preview: 'Pause pour réflexion individuelle' },
        { id: 'webinar_transition', file: 'webinar_transition.md', name: 'Transition de section', icon: 'divider', preview: 'Récap + aperçu entre sections' },
        { id: 'webinar_closing_cta', file: 'webinar_closing_cta.md', name: 'Clôture & Prochaines étapes', icon: 'end', preview: 'Clôture avec actions à suivre' },
        { id: 'webinar_logistics', file: 'webinar_logistics.md', name: 'Logistique virtuelle', icon: 'target', preview: 'Configuration et règles de participation' },
        { id: 'webinar_next_steps', file: 'webinar_next_steps.md', name: 'Prochaines étapes', icon: 'end', preview: 'Actions de suivi et ressources' },
        { id: 'learning_exchange', file: 'learning_exchange_overview.md', name: 'Échange d\'apprentissage', icon: 'demo', preview: 'Vue d\'ensemble de l\'échange' },
      ]
    }
  ]
}

// EN is the source of truth for template categories. FR has translated labels.
// PT falls back to EN labels until the catalog is translated (file references
// still resolve through templates_pt/, so the actual slide content is PT).
const TEMPLATE_CATEGORIES: Record<Language, any[]> = {
  en: TEMPLATE_CATEGORIES_BASE.en!,
  fr: TEMPLATE_CATEGORIES_BASE.fr!,
  pt: TEMPLATE_CATEGORIES_BASE.en!,
}

// GET /api/content/templates - Get all templates
// Query params: ?language=fr (default: en)
router.get('/templates', (req, res) => {
  try {
    const language = (req.query.language as Language) || 'en'
    const templatesPath = getTemplatesPath(language)
    const categories = TEMPLATE_CATEGORIES[language] || TEMPLATE_CATEGORIES['en']

    const result = categories.map((category: any) => ({
      ...category,
      templates: category.templates.map((template: any) => {
        let filePath = null
        if (template.file) {
          filePath = path.join(templatesPath, template.file)
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
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/content/templates/:id - Get template content
// Query params: ?language=fr (default: en)
router.get('/templates/:id', (req, res) => {
  try {
    const templateId = req.params.id
    const language = (req.query.language as Language) || 'en'
    const templatesPath = getTemplatesPath(language)
    const categories = TEMPLATE_CATEGORIES[language] || TEMPLATE_CATEGORIES['en']

    // Find template in categories
    let templateFile: string | null = null
    for (const category of categories) {
      const template = category.templates.find((t: any) => t.id === templateId)
      if (template?.file) {
        templateFile = template.file
        break
      }
    }

    if (!templateFile) {
      return res.status(404).json({ error: 'Template not found' })
    }

    // Try language-specific path, fallback to English
    let filePath = path.join(templatesPath, templateFile)
    if (!fs.existsSync(filePath)) {
      filePath = path.join(TEMPLATES_PATH, templateFile)
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Template file not found' })
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    res.json({ filename: templateFile, content, language })
  } catch (error: any) {
    console.error('Error getting template:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// Handouts
// ─────────────────────────────────────────────────────────────────────────────

const HANDOUTS_ROOT = path.join(REPO_ROOT, 'handouts')
const HANDOUTS_OUT = path.join(HANDOUTS_ROOT, '_out')
const HANDOUTS_ORDER_FILE = path.join(HANDOUTS_ROOT, '_order.yaml')

// Cache handout order spec — re-read if file mtime changes
let handoutOrderCache: { order: Record<string, string[]>; mtime: number } | null = null
function loadHandoutOrder(): Record<string, string[]> {
  if (!fs.existsSync(HANDOUTS_ORDER_FILE)) return {}
  const stat = fs.statSync(HANDOUTS_ORDER_FILE)
  if (handoutOrderCache && handoutOrderCache.mtime === stat.mtimeMs) {
    return handoutOrderCache.order
  }
  try {
    const raw = fs.readFileSync(HANDOUTS_ORDER_FILE, 'utf-8')
    const parsed = (yaml.load(raw) || {}) as Record<string, string[]>
    handoutOrderCache = { order: parsed, mtime: stat.mtimeMs }
    return parsed
  } catch (e) {
    console.warn('Failed to parse handouts/_order.yaml:', e)
    return {}
  }
}

type HandoutType = 'participant' | 'facilitator'

interface HandoutEntry {
  id: string
  file: string
  moduleId: string
  title: string
  type: HandoutType
  duration: string | null
  footer: string | null
  pdfUrl: string | null
  markdownUrl: string
}

interface HandoutGroup {
  moduleId: string
  moduleName: string
  themeId: string | null
  themeName: string | null
  handouts: HandoutEntry[]
}

const handoutsCacheByLang: Record<string, { data: HandoutGroup[]; timestamp: number }> = {}
const HANDOUTS_CACHE_TTL = 5 * 60 * 1000

function classifyHandout(content: string): HandoutType {
  // Frontmatter `class: facilitator` (applied globally to all pages — used
  // by per-module facilitator guides and the demo handouts).
  const fmMatch = content.match(/^---[\s\S]*?^---/m)
  if (fmMatch && /^class:\s*[^\n]*\bfacilitator\b/m.test(fmMatch[0])) {
    return 'facilitator'
  }
  // Marp per-slide `<!-- _class: facilitator -->` HTML directive (legacy).
  if (/_class:\s*facilitator/.test(content)) {
    return 'facilitator'
  }
  // Meta-line markers (EN + FR): "Demo", "Démo", "Facilitator notes",
  // "Facilitator guide", "Notes du facilitateur", "Guide du facilitateur".
  // The "facilitat" stem covers both EN ("facilitator") and FR ("facilitateur").
  const metaMatch = content.match(/<p\s+class=["']meta-line["'][^>]*>([\s\S]*?)<\/p>/i)
  const meta = metaMatch ? metaMatch[1].toLowerCase() : ''
  if (/\bdemo\b|\bdémo\b|facilitat/.test(meta)) {
    return 'facilitator'
  }
  // Everything else lands on every participant's table
  return 'participant'
}

function extractDuration(content: string): string | null {
  const metaMatch = content.match(/<p\s+class=["']meta-line["'][^>]*>([\s\S]*?)<\/p>/i)
  if (!metaMatch) return null
  const m = metaMatch[1].match(/~?\s*\d+\s*(?:-\s*\d+\s*)?min/i)
  return m ? m[0].replace(/\s+/g, ' ').trim() : null
}

function extractTitle(content: string): string {
  const h1 = content.match(/^#\s+(.+)$/m)
  return h1 ? h1[1].trim() : ''
}

function extractFooter(content: string): string | null {
  const fm = content.match(/^---[\s\S]*?^---/m)
  if (!fm) return null
  const f = fm[0].match(/^footer:\s*["']?([^"'\n]+)["']?/m)
  return f ? f[1].trim() : null
}

// URL-encode each path segment so spaces and special characters in folder
// names (e.g. "Results Communication", "Facilitator") survive the round trip
// to /handouts-pdf.
function encodeRelPath(rel: string): string {
  return rel.split(path.sep).map(encodeURIComponent).join('/')
}

// Locate a PDF within a single, known module folder.
function findPdfInModuleDir(moduleDir: string, short: string): string | null {
  if (!fs.existsSync(moduleDir)) return null
  const suffix = `_${short}.pdf`
  const match = fs.readdirSync(moduleDir).find(f => f.endsWith(suffix))
  return match ? path.join(moduleDir, match) : null
}

// Resolve a handout's PDF URL in the booklet layout:
//   _out/<lang>/<Module Name>/NN_<short>.pdf              (participant)
//   _out/<lang>/Facilitator/<Module Name>/NN_<short>.pdf  (facilitator)
//
// Critically, we *scope by module folder* — multiple modules can produce
// files with the same short name (e.g., every per-module facilitator guide
// is "01_facilitator_guide.pdf"), so a global glob would pick the wrong one.
function resolvePdfUrl(
  stem: string,
  language: 'en' | 'fr' | 'pt' | 'pt',
  moduleId: string,
  type: HandoutType,
  moduleName: string | null
): string | null {
  if (!fs.existsSync(HANDOUTS_OUT)) return null

  const langDir = path.join(HANDOUTS_OUT, language)
  if (fs.existsSync(langDir) && moduleName) {
    const short = stem.replace(/^h_m[a-z0-9]+_/, '')
    const participantDir = path.join(langDir, moduleName)
    const facilitatorDir = path.join(langDir, 'Facilitator', moduleName)

    // Search the bucket that matches the handout's tagged type first; fall
    // back to the other bucket only if nothing is found (defensive — should
    // never happen if the build script and the classifier agree).
    const primary = type === 'facilitator' ? facilitatorDir : participantDir
    const fallback = type === 'facilitator' ? participantDir : facilitatorDir

    const found = findPdfInModuleDir(primary, short) ?? findPdfInModuleDir(fallback, short)
    if (found) {
      const rel = path.relative(HANDOUTS_OUT, found)
      return `/handouts-pdf/${encodeRelPath(rel)}`
    }
  }

  // Legacy flat layout (pre-restructure) — kept as a fallback in case an
  // older _out/ is mounted.
  const canonical = `${stem}_${language}.pdf`
  if (fs.existsSync(path.join(HANDOUTS_OUT, canonical))) {
    return `/handouts-pdf/${canonical}`
  }
  const stripped = stem.replace(/^h_m[a-z0-9]+_/, '')
  const legacy = `${stripped}_${language}.pdf`
  if (fs.existsSync(path.join(HANDOUTS_OUT, legacy))) {
    return `/handouts-pdf/${legacy}`
  }
  return null
}

// GET /api/content/handouts - Get all handouts grouped by module
// Query params: ?language=fr (default: en)
router.get('/handouts', (req, res) => {
  try {
    const language = ((req.query.language as Language) || 'en') as 'en' | 'fr' | 'pt' | 'pt'
    const cacheKey = language

    // Bust cache when _order.yaml or _out/ changes (so rebuilt PDFs surface).
    const orderMtime = fs.existsSync(HANDOUTS_ORDER_FILE) ? fs.statSync(HANDOUTS_ORDER_FILE).mtimeMs : 0
    const outMtime = fs.existsSync(HANDOUTS_OUT) ? fs.statSync(HANDOUTS_OUT).mtimeMs : 0
    const cached = handoutsCacheByLang[cacheKey]
    if (
      cached &&
      Date.now() - cached.timestamp < HANDOUTS_CACHE_TTL &&
      (cached as any).orderMtime === orderMtime &&
      (cached as any).outMtime === outMtime
    ) {
      return res.json(cached.data)
    }

    const langPath = path.join(HANDOUTS_ROOT, language)
    const groups: HandoutGroup[] = []

    if (!fs.existsSync(langPath)) {
      return res.json(groups)
    }

    const moduleNames = getModuleNamesDict(language)
    const orderSpec = loadHandoutOrder()
    const registryModules = loadModulesRegistry()
    const themes = loadThemesRegistry()
    const themeNameById = new Map(themes.map(t => [t.id, t.name[language] || t.name.en]))
    const moduleThemeById = new Map(registryModules.map(m => [m.id, m.theme || null]))
    // Internal/non-workshop folders that live under handouts/ but should not
    // appear in the Content Library's Handouts tab.
    const EXCLUDED_HANDOUT_DIRS = new Set(['onboarding'])
    const moduleDirs = fs.readdirSync(langPath)
      .filter(d => {
        const full = path.join(langPath, d)
        return fs.statSync(full).isDirectory() && !d.startsWith('_') && !d.startsWith('.') && !EXCLUDED_HANDOUT_DIRS.has(d)
      })
      .sort()

    for (const moduleId of moduleDirs) {
      const moduleDir = path.join(langPath, moduleId)
      const present = fs.readdirSync(moduleDir)
        .filter(f => f.startsWith('h_') && f.endsWith('.md'))
      const desiredOrder = orderSpec[moduleId] || []
      // First: files listed in _order.yaml, in that order, if present on disk.
      const ordered = desiredOrder.filter(f => present.includes(f))
      // Then: any extras not in the spec, sorted alphabetically.
      const extras = present.filter(f => !desiredOrder.includes(f)).sort()
      const files = [...ordered, ...extras]

      if (files.length === 0) continue

      // Resolve the localised module display name UP FRONT — resolvePdfUrl
      // needs it to scope the PDF lookup to the right module folder
      // (collisions: every facilitator guide is "01_facilitator_guide.pdf").
      const shortId = moduleId.replace(/^m/, '')
      const moduleName =
        moduleNames[moduleId] ||
        moduleNames[shortId] ||
        moduleNames[/^\d+$/.test(shortId) ? parseInt(shortId) : shortId] ||
        `Module ${shortId.toUpperCase()}`

      const handouts: HandoutEntry[] = []
      for (const file of files) {
        const content = fs.readFileSync(path.join(moduleDir, file), 'utf-8')
        const stem = file.replace(/\.md$/, '')
        const type = classifyHandout(content)
        handouts.push({
          id: stem,
          file,
          moduleId,
          title: extractTitle(content) || stem,
          type,
          duration: extractDuration(content),
          footer: extractFooter(content),
          pdfUrl: resolvePdfUrl(stem, language, moduleId, type, moduleName),
          markdownUrl: `/api/content/handouts/source/${encodeURIComponent(moduleId)}/${encodeURIComponent(file)}?language=${language}`,
        })
      }

      const themeId = moduleThemeById.get(moduleId) || null
      const themeName = themeId ? (themeNameById.get(themeId) || null) : null
      groups.push({ moduleId, moduleName, themeId, themeName, handouts })
    }

    // Sort groups by theme order (foundations → data → analysis → communication → platform → workshop)
    const themeOrder = new Map(themes.map((t, i) => [t.id, i]))
    groups.sort((a, b) => {
      const ai = a.themeId ? (themeOrder.get(a.themeId) ?? 999) : 999
      const bi = b.themeId ? (themeOrder.get(b.themeId) ?? 999) : 999
      if (ai !== bi) return ai - bi
      return a.moduleId.localeCompare(b.moduleId)
    })

    handoutsCacheByLang[cacheKey] = { data: groups, timestamp: Date.now(), orderMtime, outMtime } as any
    res.json(groups)
  } catch (error: any) {
    console.error('Error getting handouts:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/content/handouts/source/:moduleId/:file - Read handout markdown source
router.get('/handouts/source/:moduleId/:file', (req, res) => {
  try {
    const language = ((req.query.language as Language) || 'en') as 'en' | 'fr' | 'pt' | 'pt'
    const moduleId = req.params.moduleId
    const file = req.params.file

    // Guard against path traversal
    if (!/^m[a-z0-9]+$/i.test(moduleId) || !/^h_[a-z0-9_]+\.md$/i.test(file)) {
      return res.status(400).json({ error: 'Invalid path' })
    }

    const filePath = path.join(HANDOUTS_ROOT, language, moduleId, file)
    const safeRoot = path.resolve(HANDOUTS_ROOT)
    if (!path.resolve(filePath).startsWith(safeRoot)) {
      return res.status(403).json({ error: 'Invalid path' })
    }

    if (!fs.existsSync(filePath)) {
      // Fallback to English
      if (language !== 'en') {
        const enPath = path.join(HANDOUTS_ROOT, 'en', moduleId, file)
        if (fs.existsSync(enPath)) {
          const content = fs.readFileSync(enPath, 'utf-8')
          return res.json({ filename: file, content, language: 'en' })
        }
      }
      return res.status(404).json({ error: 'Handout not found' })
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    res.json({ filename: file, content, language })
  } catch (error: any) {
    console.error('Error reading handout source:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/content/slide/:path - Read any slide file by relative path
router.get('/slide/*', (req, res) => {
  try {
    const relativePath = (req.params as unknown as string[])[0]

    // Prevent path traversal
    const normalizedRelative = path.normalize(relativePath)
    if (normalizedRelative.startsWith('..') || path.isAbsolute(normalizedRelative)) {
      return res.status(403).json({ error: 'Invalid path' })
    }

    // Try core_content first, then templates
    let filePath = path.resolve(CORE_CONTENT_PATH, normalizedRelative)
    if (!filePath.startsWith(path.resolve(CORE_CONTENT_PATH))) {
      return res.status(403).json({ error: 'Invalid path' })
    }

    if (!fs.existsSync(filePath)) {
      filePath = path.resolve(TEMPLATES_PATH, normalizedRelative)
      if (!filePath.startsWith(path.resolve(TEMPLATES_PATH))) {
        return res.status(403).json({ error: 'Invalid path' })
      }
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    res.json({ path: relativePath, content })
  } catch (error: any) {
    console.error('Error reading slide:', error)
    res.status(500).json({ error: 'Failed to read slide' })
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

    // Extract presenter notes per slide — map each note to its slide index
    // Split markdown into slides by '---' separator (skip frontmatter)
    const slideChunks = markdown.split(/\n---\n/)
    // First chunk is frontmatter, rest are slides (slide 0 = first content after frontmatter)
    const presenterNotes: string[] = []
    const notesRegex = /<!--[\s\n]*(PRESENTER NOTES:[\s\S]*?)-->/gi
    for (let i = 1; i < slideChunks.length; i++) {
      const slideNotes = slideChunks[i].match(notesRegex)
      if (slideNotes && slideNotes.length > 0) {
        presenterNotes[i - 1] = slideNotes[0]
          .replace(/<!--[\s\n]*/, '').replace(/\s*-->/, '').trim()
      }
    }

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
    res.status(500).json({ error: 'Internal server error' })
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
    // Strip trailing slide separator to avoid blank slides
    processed = processed.replace(/\n---\s*$/, '')
    return processed.trim()
  }).join('\n\n---\n\n')

  return frontmatter + titleSlide + processedContent
}

// POST /api/content/export/module/:id - Export a single module
router.post('/export/module/:id', async (req, res) => {
  try {
    const { format = 'markdown' } = req.body
    const modId = req.params.id

    // Find module folder via registry
    const moduleFolder = getModuleFolder(modId)

    if (!moduleFolder) {
      return res.status(404).json({ error: 'Module not found' })
    }

    const modulePath = path.join(CORE_CONTENT_PATH, moduleFolder)
    const moduleNames = getModuleNamesDict('en')
    const modNum = modId.replace('m', '')
    const modKey = /[a-z]/.test(modNum) ? modNum : parseInt(modNum)
    const moduleName = moduleNames[modKey] || `Module ${modNum}`

    // Read all topic files in the module
    const files = fs.readdirSync(modulePath)
      .filter(f => f.endsWith('.md'))
      .sort((a, b) => {
        const aMatch = a.match(/^m\d+[a-z]?_(\d+)/)
        const bMatch = b.match(/^m\d+[a-z]?_(\d+)/)
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
    res.status(500).json({ error: 'Internal server error' })
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

    // Load template files first (use language-specific templates if available)
    const templatesPath = getTemplatesPath(language as Language)
    for (const templateFile of templateFiles) {
      let filePath = path.join(templatesPath, templateFile)
      // Fallback to English if French template doesn't exist
      if (!fs.existsSync(filePath)) {
        filePath = path.join(TEMPLATES_PATH, templateFile)
      }
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        topicContents.push(content)
      }
    }

    // Then load topic content (use requested language, fallback to English)
    for (const topicId of topicIds) {
      let contentPath = fs.existsSync(coreContentPath) ? coreContentPath : CORE_CONTENT_PATH
      let moduleFolder: string | undefined
      let filePrefix: string

      // Handle mai_ prefix (AI assistant module)
      // topicId is the full filename stem (new) or a legacy prefix (old saved
      // selections). startsWith handles both: a stem matches its own file
      // exactly; a prefix matches the first file under it.
      if (topicId.startsWith('mai_')) {
        moduleFolder = getModuleFolder('m3b') || getModuleFolder('mai') || 'mai_ai_assistant'
        filePrefix = topicId
      } else {
        // Standard module topic (m4_1_..., m4_s1_..., m9a_1_..., etc.)
        const modNumMatch = topicId.match(/^m(\d+[a-z]?)_/)
        if (!modNumMatch) continue

        const modId = `m${modNumMatch[1]}`
        moduleFolder = getModuleFolder(modId) || undefined

        // Fallback to English if not found in requested language path
        if (!moduleFolder && contentPath !== CORE_CONTENT_PATH) {
          contentPath = CORE_CONTENT_PATH
        }

        filePrefix = topicId
      }

      if (!moduleFolder) continue

      const modulePath = path.join(contentPath, moduleFolder)
      if (!fs.existsSync(modulePath)) continue

      const file = fs.readdirSync(modulePath)
        .find(f => f.startsWith(filePrefix) && f.endsWith('.md'))

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
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/content/export/download/:filename - Download exported file
router.get('/export/download/:filename', (req, res) => {
  try {
    const { filename } = req.params

    // Prevent path traversal — strip directory components
    const safeFilename = path.basename(filename)
    const filePath = path.resolve(OUTPUT_DIR, safeFilename)

    if (!filePath.startsWith(path.resolve(OUTPUT_DIR))) {
      return res.status(403).json({ error: 'Invalid filename' })
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
  const { execFile } = await import('child_process')
  const { promisify } = await import('util')
  const execFileAsync = promisify(execFile)

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
      error: 'Extract script not found'
    })
  }

  try {
    const startTime = Date.now()

    // Build command args as array (no shell injection risk)
    const args = languages.flatMap(l => ['--lang', l])
    const { stdout, stderr } = await execFileAsync('python3', [scriptPath, ...args], {
      cwd: REPO_ROOT,
      timeout: 120000  // 2 minute timeout
    })

    const duration = Date.now() - startTime

    // Clear the modules cache for all languages so new content is picked up
    for (const lang of languages) {
      delete modulesCacheByLang[lang]
    }

    // Clear registry cache (modules.yaml / _meta.yaml)
    invalidateRegistryCache()

    // Also clear render cache
    renderCache.clear()

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
      error: 'Failed to rebuild content'
    })
  }
})

export default router
