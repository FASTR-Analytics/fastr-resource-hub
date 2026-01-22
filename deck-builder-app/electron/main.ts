import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'
import { spawn } from 'child_process'
import dotenv from 'dotenv'
import * as contentParser from './contentParser'

// Load environment variables from .env file
// Try multiple paths since __dirname changes between dev and production
const envPaths = [
  path.join(__dirname, '..', '.env'),           // dev: dist-electron/../.env
  path.join(__dirname, '..', '..', '.env'),     // packaged app
  path.join(process.cwd(), '.env'),             // current working directory
]

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
    console.log('Loaded .env from:', envPath)
    break
  }
}

// Path to the parent fastr-resource-hub directory
const RESOURCE_HUB_PATH = path.resolve(__dirname, '../..')
const WORKSHOPS_PATH = path.join(RESOURCE_HUB_PATH, 'workshops')
const CORE_CONTENT_PATH = path.join(RESOURCE_HUB_PATH, 'core_content')

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
  })

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
    // DevTools: uncomment to debug
    // mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// FILE WATCHER - Auto-refresh content on changes
// ═══════════════════════════════════════════════════════════════════════════════

let contentWatcher: fs.FSWatcher | null = null

function setupContentWatcher() {
  if (contentWatcher) {
    contentWatcher.close()
  }

  // Watch the core_content directory for changes
  if (fs.existsSync(CORE_CONTENT_PATH)) {
    contentWatcher = fs.watch(CORE_CONTENT_PATH, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith('.md')) {
        console.log(`Content changed: ${filename}`)
        // Invalidate cache - will reload on next request
        contentParser.invalidateCache()

        // Notify renderer of content change
        if (mainWindow) {
          mainWindow.webContents.send('content-changed', { file: filename })
        }
      }
    })

    console.log('Content watcher initialized')
  }
}

app.whenReady().then(() => {
  setupContentWatcher()
})

app.on('before-quit', () => {
  if (contentWatcher) {
    contentWatcher.close()
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - File System Operations
// ═══════════════════════════════════════════════════════════════════════════════

// Get list of workshops
ipcMain.handle('get-workshops', async () => {
  try {
    const workshops: any[] = []

    if (!fs.existsSync(WORKSHOPS_PATH)) {
      return workshops
    }

    const items = fs.readdirSync(WORKSHOPS_PATH)

    for (const item of items) {
      const workshopDir = path.join(WORKSHOPS_PATH, item)
      const yamlPath = path.join(workshopDir, 'workshop.yaml')

      if (fs.statSync(workshopDir).isDirectory() && fs.existsSync(yamlPath)) {
        const content = fs.readFileSync(yamlPath, 'utf-8')
        const config = yaml.load(content) as any

        workshops.push({
          id: item,
          name: config?.workshop?.name || item,
          country: config?.workshop?.country || '',
          location: config?.workshop?.location || '',
          date: config?.workshop?.date || '',
          days: config?.schedule?.days || 1,
        })
      }
    }

    return workshops.sort((a, b) => a.id.localeCompare(b.id))
  } catch (error) {
    console.error('Error getting workshops:', error)
    return []
  }
})

// Load workshop config
ipcMain.handle('load-workshop', async (_event, workshopId: string) => {
  try {
    const yamlPath = path.join(WORKSHOPS_PATH, workshopId, 'workshop.yaml')

    if (!fs.existsSync(yamlPath)) {
      throw new Error(`Workshop not found: ${workshopId}`)
    }

    const content = fs.readFileSync(yamlPath, 'utf-8')
    return yaml.load(content)
  } catch (error) {
    console.error('Error loading workshop:', error)
    throw error
  }
})

// Save workshop config
ipcMain.handle('save-workshop', async (_event, workshopId: string, config: any) => {
  try {
    const workshopDir = path.join(WORKSHOPS_PATH, workshopId)
    const yamlPath = path.join(workshopDir, 'workshop.yaml')

    // Ensure directory exists
    if (!fs.existsSync(workshopDir)) {
      fs.mkdirSync(workshopDir, { recursive: true })
    }

    // Write YAML
    const yamlContent = yaml.dump(config, {
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    })

    fs.writeFileSync(yamlPath, yamlContent, 'utf-8')
    return true
  } catch (error) {
    console.error('Error saving workshop:', error)
    throw error
  }
})

// Create new workshop
ipcMain.handle('create-workshop', async (_event, workshopId: string, config: any) => {
  try {
    const workshopDir = path.join(WORKSHOPS_PATH, workshopId)

    // Create directories
    fs.mkdirSync(workshopDir, { recursive: true })
    fs.mkdirSync(path.join(workshopDir, 'media', 'outputs'), { recursive: true })

    // Save config
    const yamlPath = path.join(workshopDir, 'workshop.yaml')
    const yamlContent = yaml.dump(config, {
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    })
    fs.writeFileSync(yamlPath, yamlContent, 'utf-8')

    return true
  } catch (error) {
    console.error('Error creating workshop:', error)
    throw error
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - Core Content Library
// ═══════════════════════════════════════════════════════════════════════════════

// Module metadata
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

// Get content library (all modules and topics)
ipcMain.handle('get-content-library', async () => {
  try {
    const modules: any[] = []

    if (!fs.existsSync(CORE_CONTENT_PATH)) {
      return modules
    }

    const items = fs.readdirSync(CORE_CONTENT_PATH).sort()

    for (const item of items) {
      const modulePath = path.join(CORE_CONTENT_PATH, item)

      if (fs.statSync(modulePath).isDirectory() && item.startsWith('m') && item.includes('_')) {
        // Extract module number
        const modNumMatch = item.match(/^m(\d+)_/)
        if (!modNumMatch) continue

        const modNum = parseInt(modNumMatch[1])

        // Find all topic files - sort numerically by topic number
        const topics: any[] = []
        const files = fs.readdirSync(modulePath)
          .filter(f => f.endsWith('.md'))
          .sort((a, b) => {
            // Extract topic numbers (e.g., "m6_1" -> 1, "m6_11" -> 11, "m6_2a" -> 2)
            const aMatch = a.match(/^m\d+_(\d+)/)
            const bMatch = b.match(/^m\d+_(\d+)/)
            const aNum = aMatch ? parseInt(aMatch[1]) : 0
            const bNum = bMatch ? parseInt(bMatch[1]) : 0
            if (aNum !== bNum) return aNum - bNum
            // If same number, sort alphabetically (for m6_2a vs m6_2b)
            return a.localeCompare(b)
          })

        for (const file of files) {
          // Extract topic ID (e.g., "m3_1" from "m3_1_overview.md")
          const topicMatch = file.match(/^(m\d+_\d+[a-z]?)_/)
          if (!topicMatch) continue

          const topicId = topicMatch[1]
          const filePath = path.join(modulePath, file)

          // Read file content for preview
          const content = fs.readFileSync(filePath, 'utf-8')

          // Count slides (separated by ---)
          const slides = content.split(/^---$/m).filter(s => s.trim() && !s.trim().startsWith('marp:'))
          const slideCount = slides.length

          // Extract title from first ## heading (Marp uses ## for slide titles)
          const titleMatch = content.match(/^##\s+(.+)$/m)
          let title = titleMatch ? titleMatch[1] : ''

          // Clean up title - remove "Module X" suffix if present
          title = title.replace(/\s*-\s*Module\s*\d+$/i, '').trim()

          // Fallback: derive from filename
          if (!title) {
            title = file.replace('.md', '').replace(/^m\d+_\d+[a-z]?_/, '').replace(/_/g, ' ')
            title = title.charAt(0).toUpperCase() + title.slice(1)
          }

          // Extract all slide titles for preview
          const slideTitles = content.match(/^##\s+(.+)$/gm)?.map(h => h.replace(/^##\s+/, '')) || []

          // Extract key bullet points (bold items or first bullets)
          const keyPoints = content.match(/^\*\*([^*]+)\*\*/gm)?.slice(0, 4).map(b => b.replace(/\*\*/g, '')) ||
                          content.match(/^[-*]\s+(.+)$/gm)?.slice(0, 4).map(b => b.replace(/^[-*]\s+/, '')) || []

          topics.push({
            id: topicId,
            file: file,
            title: title,
            slideCount: slideCount,
            slideTitles: slideTitles.slice(0, 5), // First 5 slide titles
            preview: keyPoints,
            path: filePath,
          })
        }

        // Sort topics numerically by their ID
        const sortedTopics = topics.sort((a, b) => {
          const aMatch = a.id.match(/^m\d+_(\d+)/)
          const bMatch = b.id.match(/^m\d+_(\d+)/)
          const aNum = aMatch ? parseInt(aMatch[1]) : 0
          const bNum = bMatch ? parseInt(bMatch[1]) : 0
          if (aNum !== bNum) return aNum - bNum
          return a.id.localeCompare(b.id)
        })

        modules.push({
          number: modNum,
          id: `m${modNum}`,
          name: MODULE_NAMES[modNum] || `Module ${modNum}`,
          folder: item,
          topics: sortedTopics,
          totalSlides: sortedTopics.reduce((sum, t) => sum + t.slideCount, 0),
        })
      }
    }

    return modules.sort((a, b) => a.number - b.number)
  } catch (error) {
    console.error('Error getting content library:', error)
    return []
  }
})

// Read slide content
ipcMain.handle('read-slide', async (_event, filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }
    return fs.readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.error('Error reading slide:', error)
    throw error
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - Parsed Content (JSON-structured)
// ═══════════════════════════════════════════════════════════════════════════════

// Get all parsed content (modules with structured slides)
ipcMain.handle('get-parsed-content', async () => {
  try {
    const cache = contentParser.loadAllContent(CORE_CONTENT_PATH)
    return {
      modules: cache.modules,
      lastUpdated: cache.lastUpdated,
    }
  } catch (error) {
    console.error('Error getting parsed content:', error)
    return { modules: [], lastUpdated: 0 }
  }
})

// Get a specific parsed module
ipcMain.handle('get-parsed-module', async (_event, moduleId: string) => {
  try {
    return contentParser.getModule(CORE_CONTENT_PATH, moduleId)
  } catch (error) {
    console.error('Error getting parsed module:', error)
    return null
  }
})

// Get a specific parsed topic
ipcMain.handle('get-parsed-topic', async (_event, topicId: string) => {
  try {
    return contentParser.getTopic(CORE_CONTENT_PATH, topicId)
  } catch (error) {
    console.error('Error getting parsed topic:', error)
    return null
  }
})

// Get a specific slide from a topic
ipcMain.handle('get-parsed-slide', async (_event, topicId: string, slideIndex: number) => {
  try {
    return contentParser.getSlide(CORE_CONTENT_PATH, topicId, slideIndex)
  } catch (error) {
    console.error('Error getting parsed slide:', error)
    return null
  }
})

// Force refresh content cache
ipcMain.handle('refresh-content', async () => {
  try {
    contentParser.invalidateCache()
    const cache = contentParser.loadAllContent(CORE_CONTENT_PATH, true)
    return {
      modules: cache.modules,
      lastUpdated: cache.lastUpdated,
    }
  } catch (error) {
    console.error('Error refreshing content:', error)
    return { modules: [], lastUpdated: 0 }
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - Slide Content for Editor
// ═══════════════════════════════════════════════════════════════════════════════

interface SlideContent {
  filename: string
  content: string
  isCustom: boolean
  originalContent: string
}

// Get all slides for a module (with custom overrides)
ipcMain.handle('get-module-slides', async (_event, moduleId: string, workshopId: string): Promise<SlideContent[]> => {
  try {
    const slides: SlideContent[] = []
    const modNum = moduleId.replace('m', '')

    // Find the module folder
    const moduleFolder = fs.readdirSync(CORE_CONTENT_PATH)
      .find(f => f.startsWith(`m${modNum}_`))

    if (!moduleFolder) return slides

    const modulePath = path.join(CORE_CONTENT_PATH, moduleFolder)
    const workshopDir = path.join(WORKSHOPS_PATH, workshopId)
    const customDir = path.join(workshopDir, 'custom_slides')

    // Get all topic files sorted numerically
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
      const originalPath = path.join(modulePath, file)
      const customPath = path.join(customDir, file)
      const originalContent = fs.readFileSync(originalPath, 'utf-8')

      // Check if custom version exists
      const hasCustom = fs.existsSync(customPath)
      const content = hasCustom ? fs.readFileSync(customPath, 'utf-8') : originalContent

      slides.push({
        filename: file,
        content: content,
        isCustom: hasCustom,
        originalContent: originalContent,
      })
    }

    return slides
  } catch (error) {
    console.error('Error getting module slides:', error)
    return []
  }
})

// Get a specific topic slide (with custom override)
ipcMain.handle('get-topic-slide', async (_event, topicId: string, workshopId: string): Promise<SlideContent | null> => {
  try {
    // topicId format: "m0_1", "m3_2", etc.
    const modNumMatch = topicId.match(/^m(\d+)_/)
    if (!modNumMatch) return null

    const modNum = modNumMatch[1]
    const moduleFolder = fs.readdirSync(CORE_CONTENT_PATH)
      .find(f => f.startsWith(`m${modNum}_`))

    if (!moduleFolder) return null

    const modulePath = path.join(CORE_CONTENT_PATH, moduleFolder)
    const workshopDir = path.join(WORKSHOPS_PATH, workshopId)
    const customDir = path.join(workshopDir, 'custom_slides')

    // Find the file that matches this topic ID
    const file = fs.readdirSync(modulePath)
      .find(f => f.startsWith(`${topicId}_`) && f.endsWith('.md'))

    if (!file) return null

    const originalPath = path.join(modulePath, file)
    const customPath = path.join(customDir, file)
    const originalContent = fs.readFileSync(originalPath, 'utf-8')

    const hasCustom = fs.existsSync(customPath)
    const content = hasCustom ? fs.readFileSync(customPath, 'utf-8') : originalContent

    return {
      filename: file,
      content: content,
      isCustom: hasCustom,
      originalContent: originalContent,
    }
  } catch (error) {
    console.error('Error getting topic slide:', error)
    return null
  }
})

// Get template/special slide content
ipcMain.handle('get-slide-content', async (_event, slideId: string, workshopId: string): Promise<SlideContent | null> => {
  try {
    const workshopDir = path.join(WORKSHOPS_PATH, workshopId)
    const customDir = path.join(workshopDir, 'custom_slides')
    const templatesDir = path.join(RESOURCE_HUB_PATH, 'templates')

    // Map slideId to template file
    const templateMap: Record<string, string> = {
      'title': 'title_slide.md',
      'closing': 'closing.md',
      'day_end': 'day_end.md',
      'objectives': 'custom_slides/01_objectives.md',
      'country_overview': 'custom_slides/02_country-overview.md',
      'health_priorities': 'custom_slides/03_health-priorities.md',
      'coverage_results': 'custom_slides/04_coverage-results.md',
      'next_steps': 'custom_slides/99_next-steps.md',
    }

    const templateFile = templateMap[slideId]
    if (!templateFile) {
      // Not a recognized template - might be a custom slide in the workshop
      const customPath = path.join(workshopDir, `${slideId}.md`)
      if (fs.existsSync(customPath)) {
        const content = fs.readFileSync(customPath, 'utf-8')
        return {
          filename: `${slideId}.md`,
          content: content,
          isCustom: true,
          originalContent: content,
        }
      }
      return null
    }

    const originalPath = path.join(templatesDir, templateFile)
    const filename = path.basename(templateFile)
    const customPath = path.join(customDir, filename)

    if (!fs.existsSync(originalPath)) return null

    const originalContent = fs.readFileSync(originalPath, 'utf-8')
    const hasCustom = fs.existsSync(customPath)
    const content = hasCustom ? fs.readFileSync(customPath, 'utf-8') : originalContent

    return {
      filename: filename,
      content: content,
      isCustom: hasCustom,
      originalContent: originalContent,
    }
  } catch (error) {
    console.error('Error getting slide content:', error)
    return null
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - Custom Slides
// ═══════════════════════════════════════════════════════════════════════════════

// Get custom slides for a workshop
ipcMain.handle('get-custom-slides', async (_event, workshopId: string) => {
  try {
    const workshopDir = path.join(WORKSHOPS_PATH, workshopId)

    if (!fs.existsSync(workshopDir)) {
      return []
    }

    const files = fs.readdirSync(workshopDir).filter(f => f.endsWith('.md'))

    return files.map(file => {
      const filePath = path.join(workshopDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const titleMatch = content.match(/^#\s+(.+)$/m)

      return {
        file: file,
        title: titleMatch ? titleMatch[1] : file.replace('.md', ''),
        path: filePath,
      }
    })
  } catch (error) {
    console.error('Error getting custom slides:', error)
    return []
  }
})

// Save custom slide (creates custom_slides folder if needed)
ipcMain.handle('save-custom-slide', async (_event, workshopId: string, filename: string, content: string) => {
  try {
    const workshopDir = path.join(WORKSHOPS_PATH, workshopId)
    const customDir = path.join(workshopDir, 'custom_slides')

    // Create custom_slides folder if it doesn't exist
    if (!fs.existsSync(customDir)) {
      fs.mkdirSync(customDir, { recursive: true })
    }

    const filePath = path.join(customDir, filename)
    fs.writeFileSync(filePath, content, 'utf-8')
    return true
  } catch (error) {
    console.error('Error saving custom slide:', error)
    throw error
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - Templates
// ═══════════════════════════════════════════════════════════════════════════════

// Template definitions with metadata
const TEMPLATE_CATEGORIES = [
  {
    id: 'structure',
    name: 'Structure',
    description: 'Workshop structure slides',
    templates: [
      { id: 'title', file: 'title_slide.md', name: 'Title/Cover Page', icon: 'cover' },
      { id: 'agenda', file: 'agenda', name: 'Agenda', icon: 'list', special: true },
      { id: 'section', file: null, name: 'Section Divider', icon: 'divider', special: true },
      { id: 'closing', file: 'closing.md', name: 'Closing Slide', icon: 'end' },
    ]
  },
  {
    id: 'breaks',
    name: 'Breaks & Transitions',
    description: 'Break and day transition slides',
    templates: [
      { id: 'tea', file: null, name: 'Tea Break', icon: 'coffee', special: true, preview: '15-minute tea/coffee break' },
      { id: 'lunch', file: null, name: 'Lunch Break', icon: 'lunch', special: true, preview: '60-minute lunch break' },
      { id: 'day_end', file: null, name: 'End of Day', icon: 'sunset', special: true, preview: 'Wrap up the day, preview tomorrow. Uses dayN_wrapup.md from workshop folder.' },
      { id: 'day_recap', file: null, name: 'Day Recap', icon: 'recap', special: true, preview: 'Recap previous day, preview today. Uses dayN_recap.md from workshop folder.' },
    ]
  },
  {
    id: 'custom',
    name: 'Custom Slide Templates',
    description: 'Pre-made slide templates to customize',
    templates: [
      { id: 'objectives', file: 'custom_slides/01_objectives.md', name: 'Workshop Objectives', icon: 'target' },
      { id: 'country', file: 'custom_slides/02_country-overview.md', name: 'Country Overview', icon: 'globe' },
      { id: 'priorities', file: 'custom_slides/03_health-priorities.md', name: 'Health Priorities', icon: 'heart' },
      { id: 'results', file: 'custom_slides/04_coverage-results.md', name: 'Coverage Results', icon: 'chart' },
      { id: 'next_steps', file: 'custom_slides/99_next-steps.md', name: 'Next Steps', icon: 'arrow' },
    ]
  }
]

// Get template categories and items
ipcMain.handle('get-templates', async () => {
  const templatesDir = path.join(RESOURCE_HUB_PATH, 'templates')

  return TEMPLATE_CATEGORIES.map(category => ({
    ...category,
    templates: category.templates.map(template => {
      // Use built-in preview for special templates
      let preview = (template as any).preview || ''

      // For file-based templates, read preview from file
      if (template.file && !template.special && !preview) {
        const filePath = path.join(templatesDir, template.file)
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8')
          // Extract first few lines for preview
          const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('---') && !l.startsWith('marp'))
          preview = lines.slice(0, 3).join(' ').substring(0, 100)
        }
      }
      return {
        ...template,
        path: template.file ? path.join(templatesDir, template.file) : null,
        preview
      }
    })
  }))
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - Build Deck
// ═══════════════════════════════════════════════════════════════════════════════

ipcMain.handle('build-deck', async (_event, workshopId: string, skipPdf: boolean = false) => {
  const outputsDir = path.join(RESOURCE_HUB_PATH, 'outputs')
  const mdPath = path.join(outputsDir, `${workshopId}_deck.md`)
  const htmlPath = path.join(outputsDir, `${workshopId}_deck.html`)
  const pdfPath = path.join(outputsDir, `${workshopId}_deck.pdf`)

  // Step 1: Build markdown with Python script
  await new Promise<void>((resolve, reject) => {
    const scriptPath = path.join(RESOURCE_HUB_PATH, 'tools', '02_build_deck.py')
    const venvPython = path.join(RESOURCE_HUB_PATH, '.venv', 'bin', 'python3')
    const pythonPath = fs.existsSync(venvPython) ? venvPython : 'python3'

    const buildProcess = spawn(pythonPath, [scriptPath, '--workshop', workshopId], {
      cwd: RESOURCE_HUB_PATH,
    })

    let stderr = ''

    buildProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    buildProcess.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Markdown build failed: ${stderr}`))
      }
    })

    buildProcess.on('error', reject)
  })

  // Step 2: Generate HTML preview with Marp (fast)
  await new Promise<void>((resolve) => {
    const marpPaths = ['/opt/homebrew/bin/marp', '/usr/local/bin/marp', 'marp']
    let marpPath = 'marp'
    for (const p of marpPaths) {
      if (p === 'marp' || fs.existsSync(p)) {
        marpPath = p
        break
      }
    }

    const themePath = path.join(RESOURCE_HUB_PATH, 'fastr-theme.css')

    const marpProcess = spawn(marpPath, [
      '--no-config',
      '--theme', themePath,
      '--html',
      '--allow-local-files',
      mdPath,
      '-o', htmlPath
    ], {
      cwd: RESOURCE_HUB_PATH,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    marpProcess.stdout.on('data', () => {})
    marpProcess.stderr.on('data', () => {})

    marpProcess.on('close', () => resolve())
    marpProcess.on('error', () => resolve())
  })

  // Step 3: Convert to PDF with Marp (unless skipped)
  if (!skipPdf) {
    await new Promise<void>((resolve, reject) => {
      // Find marp
      const marpPaths = ['/opt/homebrew/bin/marp', '/usr/local/bin/marp', 'marp']
      let marpPath = 'marp'
      for (const p of marpPaths) {
        if (p === 'marp' || fs.existsSync(p)) {
          marpPath = p
          break
        }
      }

      // Find browser (same logic as 04_export_pdf.py)
      const browserPaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
      ]
      let browserPath = ''
      for (const p of browserPaths) {
        if (fs.existsSync(p)) {
          browserPath = p
          break
        }
      }

      const themePath = path.join(RESOURCE_HUB_PATH, 'fastr-theme.css')

      const marpArgs = [
        '--no-config',
        '--theme', themePath,
        '--html',
        '--pdf',
        '--allow-local-files',
        ...(browserPath ? ['--browser-path', browserPath] : []),
        mdPath,
        '-o', pdfPath
      ]

      console.log('Running Marp:', marpPath, marpArgs.join(' '))

      const marpProcess = spawn(marpPath, marpArgs, {
        cwd: RESOURCE_HUB_PATH,
        stdio: ['ignore', 'pipe', 'pipe'], // Prevent stdin from hanging, capture stdout/stderr
        env: { ...process.env, PUPPETEER_EXECUTABLE_PATH: browserPath || undefined },
      })

      let stdout = ''
      let stderr = ''

      // Must consume stdout to prevent buffer from filling and blocking process
      marpProcess.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      marpProcess.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      // Set a timeout to prevent infinite hanging
      const timeout = setTimeout(() => {
        console.error('Marp timed out after 60 seconds')
        marpProcess.kill('SIGTERM')
      }, 60000)

      marpProcess.on('close', (code) => {
        clearTimeout(timeout)
        if (code === 0) {
          console.log('Marp completed successfully')
          resolve()
        } else {
          // PDF conversion failed, but markdown was built - don't fail completely
          console.error('PDF conversion failed:', stderr || stdout)
          resolve() // Still resolve, we have the markdown
        }
      })

      marpProcess.on('error', (error) => {
        clearTimeout(timeout)
        console.error('Marp error:', error)
        resolve() // Still resolve, we have the markdown
      })
    })
  }

  // Return paths
  const hasPdf = fs.existsSync(pdfPath)
  const hasHtml = fs.existsSync(htmlPath)

  return {
    success: true,
    outputPath: hasPdf ? pdfPath : mdPath,
    outputDir: outputsDir,
    mdPath: mdPath,
    htmlPath: hasHtml ? htmlPath : null,
    pdfPath: hasPdf ? pdfPath : null,
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - File System Navigation
// ═══════════════════════════════════════════════════════════════════════════════

// Open file in default application
ipcMain.handle('open-file', async (_event, filePath: string) => {
  try {
    await shell.openPath(filePath)
    return true
  } catch (error) {
    console.error('Error opening file:', error)
    throw error
  }
})

// Open HTML preview in a new window (for proper file:// access)
ipcMain.handle('open-preview-window', async (_event, htmlPath: string) => {
  try {
    const previewWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      title: 'Deck Preview',
      webPreferences: {
        webSecurity: false, // Allow loading local files
      },
    })

    previewWindow.loadFile(htmlPath)
    return true
  } catch (error) {
    console.error('Error opening preview window:', error)
    throw error
  }
})

// Show file in folder (reveal in Finder/Explorer)
ipcMain.handle('show-in-folder', async (_event, filePath: string) => {
  try {
    shell.showItemInFolder(filePath)
    return true
  } catch (error) {
    console.error('Error showing in folder:', error)
    throw error
  }
})

// Read file content (for preview)
ipcMain.handle('read-file-content', async (_event, filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }
    return fs.readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.error('Error reading file:', error)
    throw error
  }
})

// Get outputs folder path
ipcMain.handle('get-outputs-path', async () => {
  return path.join(RESOURCE_HUB_PATH, 'outputs')
})

// List output files for a workshop
ipcMain.handle('get-workshop-outputs', async (_event, workshopId: string) => {
  try {
    const outputsDir = path.join(RESOURCE_HUB_PATH, 'outputs')
    if (!fs.existsSync(outputsDir)) {
      return []
    }

    const files = fs.readdirSync(outputsDir)
    return files
      .filter(f => f.startsWith(workshopId) && (f.endsWith('.md') || f.endsWith('.pdf') || f.endsWith('.pptx')))
      .map(f => ({
        name: f,
        path: path.join(outputsDir, f),
        type: f.endsWith('.pdf') ? 'pdf' : f.endsWith('.pptx') ? 'pptx' : 'md',
        modified: fs.statSync(path.join(outputsDir, f)).mtime,
      }))
      .sort((a, b) => b.modified.getTime() - a.modified.getTime())
  } catch (error) {
    console.error('Error listing outputs:', error)
    return []
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - AI Assistant (Claude API)
// ═══════════════════════════════════════════════════════════════════════════════

// Detailed module descriptions for AI recommendations
const MODULE_DETAILS: Record<number, { name: string; description: string; topics: string[]; duration: string; audience: string }> = {
  0: {
    name: 'Introduction to FASTR',
    description: 'Overview of the FASTR methodology, why rapid-cycle analytics matters for RMNCAH-N programs, and introduction to technical approaches.',
    topics: ['Introduction to FASTR approach', 'RMNCAH-N service use monitoring', 'Why rapid-cycle analytics', 'Technical approaches overview'],
    duration: '45-60 min',
    audience: 'All participants - essential foundation',
  },
  1: {
    name: 'Identify Questions & Indicators',
    description: 'How to identify priority analytical questions, develop data use cases, and prepare indicator frameworks for extraction.',
    topics: ['FASTR gaps and challenges', 'Development of data use case', 'Defining priority questions', 'Preparing for data extraction'],
    duration: '60-90 min',
    audience: 'Program managers, M&E officers',
  },
  2: {
    name: 'Data Extraction',
    description: 'Technical module on extracting data from DHIS2 and other health information systems using various tools.',
    topics: ['Why extract data', 'DHIS2 data structure', 'Data Downloader tool', 'API-based extraction', 'Data validation'],
    duration: '90-120 min',
    audience: 'Data managers, IT staff, technically-oriented participants',
  },
  3: {
    name: 'FASTR Analytics Platform',
    description: 'Hands-on introduction to the FASTR Analytics Platform - accessing, navigating, importing data, and running modules.',
    topics: ['Platform overview', 'Accessing the platform', 'Setting up structure', 'Importing datasets', 'Running analysis modules', 'Creating visualizations', 'Generating reports'],
    duration: '120-180 min',
    audience: 'All data users - hands-on session',
  },
  4: {
    name: 'Data Quality Assessment',
    description: 'Systematic approach to assessing data quality: completeness, outliers, internal consistency, and overall DQA scoring.',
    topics: ['Approach to DQA', 'Indicator completeness', 'Outlier detection', 'Internal consistency checks', 'Overall DQA score interpretation'],
    duration: '90-120 min',
    audience: 'Data managers, M&E officers, program staff',
  },
  5: {
    name: 'Data Quality Adjustment',
    description: 'Methods for adjusting data to account for quality issues before analysis - outlier treatment and completeness adjustment.',
    topics: ['Approach to adjustment', 'Adjustment for outliers', 'Adjustment for completeness'],
    duration: '60-90 min',
    audience: 'Data analysts, M&E officers',
  },
  6: {
    name: 'Data Analysis',
    description: 'Core analytical methods: service utilization trends, year-over-year change, disruption detection, coverage estimation.',
    topics: ['Service utilization analysis', 'Year-over-year change', 'Disruption detection', 'Actual vs expected outputs', 'Coverage introduction', 'Denominator methodology', 'Coverage projections', 'Interpreting outputs'],
    duration: '180-240 min',
    audience: 'All participants - core content',
  },
  7: {
    name: 'Results Communication',
    description: 'How to interpret findings, create effective visualizations, and communicate results to stakeholders for decision-making.',
    topics: ['Analytical thinking', 'Data visualization principles', 'Using data for decisions', 'Stakeholder engagement', 'Quarterly reporting practice'],
    duration: '90-120 min',
    audience: 'Program managers, communications staff',
  },
  8: {
    name: 'Survey & HFA',
    description: 'Supplementary module on health facility assessments and phone surveys to complement routine data analysis.',
    topics: ['HFA and phone survey overview', 'Questionnaire adaptation', 'Structure review', 'Hands-on adaptation', 'HFA priorities and data use'],
    duration: '120-180 min',
    audience: 'Survey specialists, M&E teams planning primary data collection',
  },
}

// Tools the AI can use to modify the deck
const AI_TOOLS = [
  {
    name: 'add_module',
    description: 'Add an entire module to the workshop deck. Use this when the user wants to add all content from a module.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to add the module to (1, 2, 3, etc.)' },
        module_number: { type: 'number', description: 'Module number (0-8). 0=Introduction, 1=Questions & Indicators, 2=Data Extraction, 3=Platform, 4=DQA, 5=DQ Adjustment, 6=Data Analysis, 7=Results Communication, 8=Survey & HFA' },
        duration: { type: 'number', description: 'Duration in minutes (default based on module)' },
      },
      required: ['day', 'module_number'],
    },
  },
  {
    name: 'add_break',
    description: 'Add a break (tea or lunch) to the workshop agenda',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to add the break to' },
        break_type: { type: 'string', enum: ['tea', 'lunch'], description: 'Type of break' },
        duration: { type: 'number', description: 'Duration in minutes (default: 15 for tea, 60 for lunch)' },
      },
      required: ['day', 'break_type'],
    },
  },
  {
    name: 'add_custom_session',
    description: 'Add a custom session like opening remarks, country presentation, group work, etc.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to add the session to' },
        session_name: { type: 'string', description: 'Name of the session' },
        duration: { type: 'number', description: 'Duration in minutes' },
      },
      required: ['day', 'session_name', 'duration'],
    },
  },
  {
    name: 'set_day_start_time',
    description: 'Set the start time for a day. This enables automatic time calculation for all sessions.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day to set the start time for' },
        start_time: { type: 'string', description: 'Start time in HH:MM format (e.g., "08:30")' },
      },
      required: ['day', 'start_time'],
    },
  },
  {
    name: 'update_workshop_settings',
    description: 'Update workshop settings like objectives, scope, outputs, priorities, or basic info. Use this to fill in workshop content based on user context.',
    input_schema: {
      type: 'object' as const,
      properties: {
        objectives: { type: 'string', description: 'Workshop objectives as bullet points (one per line, with or without leading dash)' },
        scope_of_work: { type: 'string', description: 'Scope of work items as bullet points' },
        expected_outputs: { type: 'string', description: 'Expected outputs as bullet points' },
        priorities: { type: 'string', description: 'Key priorities/focus areas as bullet points' },
        facilitators: { type: 'string', description: 'Facilitator names' },
        venue: { type: 'string', description: 'Workshop venue' },
        contact_email: { type: 'string', description: 'Contact email' },
        website: { type: 'string', description: 'Website URL' },
      },
      required: [],
    },
  },
  {
    name: 'move_session',
    description: 'Move a session to a different position within a day. Use this to reorganize the deck order.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day the session is on' },
        from_position: { type: 'number', description: 'Current position of the session (0-indexed)' },
        to_position: { type: 'number', description: 'New position to move it to (0-indexed)' },
      },
      required: ['day', 'from_position', 'to_position'],
    },
  },
  {
    name: 'remove_session',
    description: 'Remove a session from the deck. Use this to clean up or reorganize.',
    input_schema: {
      type: 'object' as const,
      properties: {
        day: { type: 'number', description: 'Which day the session is on' },
        position: { type: 'number', description: 'Position of the session to remove (0-indexed)' },
      },
      required: ['day', 'position'],
    },
  },
  {
    name: 'move_session_to_day',
    description: 'Move a session from one day to another day.',
    input_schema: {
      type: 'object' as const,
      properties: {
        from_day: { type: 'number', description: 'Current day of the session' },
        from_position: { type: 'number', description: 'Position of the session on current day (0-indexed)' },
        to_day: { type: 'number', description: 'Day to move the session to' },
        to_position: { type: 'number', description: 'Position on the new day (0-indexed, optional - defaults to end)', default: -1 },
      },
      required: ['from_day', 'from_position', 'to_day'],
    },
  },
]

ipcMain.handle('ai-chat', async (_event, messages: any[], context: any) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not set. Add it to .env file.')
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey })

    // Build comprehensive system prompt
    const systemPrompt = `You are a FASTR workshop planning assistant. You can DIRECTLY MODIFY the workshop deck using the tools provided.

# ABOUT FASTR
FASTR (Framework for Analytics Strengthening Through Routine data) is a methodology for analyzing health system data, particularly RMNCAH-N (Reproductive, Maternal, Newborn, Child, Adolescent Health and Nutrition) program data from DHIS2.

# AVAILABLE MODULES
${Object.entries(MODULE_DETAILS).map(([num, mod]) => `
## Module ${num}: ${mod.name}
- **Description**: ${mod.description}
- **Topics**: ${mod.topics.join(', ')}
- **Typical Duration**: ${mod.duration}
- **Best for**: ${mod.audience}
`).join('\n')}

# CURRENT WORKSHOP
${JSON.stringify(context, null, 2)}

# YOUR CAPABILITIES
You can use tools to:
1. **add_module** - Add a full module to a specific day
2. **add_break** - Add tea or lunch breaks
3. **add_custom_session** - Add custom sessions (opening remarks, group work, etc.)
4. **set_day_start_time** - Set the start time for a day
5. **update_workshop_settings** - Fill in workshop objectives, scope, outputs, priorities, and other settings
6. **move_session** - Move a session to a different position within a day (reorder)
7. **remove_session** - Remove a session from the deck
8. **move_session_to_day** - Move a session from one day to another

# INSTRUCTIONS
- When the user asks to add content, USE THE TOOLS to actually add it
- After using tools, briefly confirm what you added
- If the user asks a question without wanting changes, just answer without using tools
- Be proactive: if they say "add Data Analysis module", use add_module with module_number=6
- Consider adding appropriate breaks when building a full day agenda
- If asked to fill in settings/objectives/scope, use update_workshop_settings with appropriate content based on the workshop context
- For objectives/scope/outputs, generate practical FASTR-relevant content (e.g., "Configure the analytics platform", "Produce quarterly report", "Train staff on data quality assessment")
- When reorganizing, look at the current schedule and use move_session/remove_session to improve the logical flow
- A good workshop order typically: Opening/Intro → Foundation modules → Hands-on modules → Analysis → Communication → Wrap-up
- Add breaks between long modules (after ~90 min of content)
- IMPORTANT: Complete ALL requested changes in a single response. Don't just describe what you'll do - actually call all the tools needed.
- If asked to "fill in settings AND reorganize", do BOTH in one response using multiple tool calls.
- Always execute the full task, don't split it across multiple messages.`

    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages,
      tools: AI_TOOLS,
    })

    // Process the response - collect tool uses and text
    const toolCalls: any[] = []
    let textContent = ''

    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      } else if (block.type === 'tool_use') {
        toolCalls.push({
          id: block.id,
          name: block.name,
          input: block.input,
        })
      }
    }

    return {
      role: 'assistant',
      content: textContent,
      toolCalls: toolCalls,
      stopReason: response.stop_reason,
    }
  } catch (error: any) {
    console.error('AI chat error:', error)
    throw new Error(error.message || 'AI request failed')
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// Simple AI Text Generation (no tools)
// ═══════════════════════════════════════════════════════════════════════════════

ipcMain.handle('ai-generate-text', async (_event, prompt: string, context?: any) => {
  try {
    const systemPrompt = `You are a helpful assistant for FASTR workshop planning. Generate concise, professional content.

IMPORTANT RULES:
- Output ONLY the requested content as plain text
- One item per line
- No introductions, no explanations, no tool usage
- No markdown formatting, no bullet points, no numbers
- Be specific and actionable
- Keep each item to one sentence

Context: ${context ? JSON.stringify(context) : 'General FASTR workshop'}`

    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      // NO TOOLS - just text generation
    })

    let textContent = ''
    for (const block of response.content) {
      if (block.type === 'text') {
        textContent += block.text
      }
    }

    return textContent
  } catch (error: any) {
    console.error('AI generate error:', error)
    throw new Error(error.message || 'AI request failed')
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - Native TypeScript Build Pipeline
// ═══════════════════════════════════════════════════════════════════════════════

import { assembleMarkdown, assembleJSON, AssembleOptions } from './slideAssembler'
import { calculateDaySchedule, calculateFullSchedule } from './timeCalculator'
import { generateDayRecap, generateDayWrapup, getAutoGeneratedContent } from './autoSlideGenerator'
import { getExportEngine } from './exportEngine'
import type { WorkshopConfig, ParsedModule } from './types'

// Initialize export engine
const exportEngine = getExportEngine(RESOURCE_HUB_PATH)

// Set main window reference when available
app.whenReady().then(() => {
  if (mainWindow) {
    exportEngine.setMainWindow(mainWindow)
  }
})

// Assemble markdown for preview
ipcMain.handle('assemble-markdown', async (_event, workshopId: string) => {
  try {
    const workshopConfig = await loadWorkshopConfig(workshopId)
    if (!workshopConfig) throw new Error('Workshop not found')

    const cache = contentParser.loadAllContent(CORE_CONTENT_PATH)

    const options: AssembleOptions = {
      workshopConfig,
      workshopId,
      contentLibrary: cache.modules,
      coreContentPath: CORE_CONTENT_PATH,
      workshopsPath: WORKSHOPS_PATH,
      templatesPath: path.join(RESOURCE_HUB_PATH, 'templates'),
    }

    return assembleMarkdown(options)
  } catch (error: any) {
    console.error('Error assembling markdown:', error)
    throw error
  }
})

// Assemble JSON for structured preview
ipcMain.handle('assemble-json', async (_event, workshopId: string) => {
  try {
    const workshopConfig = await loadWorkshopConfig(workshopId)
    if (!workshopConfig) throw new Error('Workshop not found')

    const cache = contentParser.loadAllContent(CORE_CONTENT_PATH)

    const options: AssembleOptions = {
      workshopConfig,
      workshopId,
      contentLibrary: cache.modules,
      coreContentPath: CORE_CONTENT_PATH,
      workshopsPath: WORKSHOPS_PATH,
      templatesPath: path.join(RESOURCE_HUB_PATH, 'templates'),
    }

    return assembleJSON(options)
  } catch (error: any) {
    console.error('Error assembling JSON:', error)
    throw error
  }
})

// Calculate times for a specific day
ipcMain.handle('calculate-day-times', async (_event, workshopId: string, dayNumber: number) => {
  try {
    const workshopConfig = await loadWorkshopConfig(workshopId)
    if (!workshopConfig) throw new Error('Workshop not found')

    return calculateDaySchedule(workshopConfig, dayNumber)
  } catch (error: any) {
    console.error('Error calculating day times:', error)
    throw error
  }
})

// Calculate times for all days
ipcMain.handle('calculate-all-times', async (_event, workshopId: string) => {
  try {
    const workshopConfig = await loadWorkshopConfig(workshopId)
    if (!workshopConfig) throw new Error('Workshop not found')

    return calculateFullSchedule(workshopConfig)
  } catch (error: any) {
    console.error('Error calculating all times:', error)
    throw error
  }
})

// Generate day recap content
ipcMain.handle('generate-day-recap', async (_event, workshopId: string, dayNumber: number) => {
  try {
    const workshopConfig = await loadWorkshopConfig(workshopId)
    if (!workshopConfig) throw new Error('Workshop not found')

    const cache = contentParser.loadAllContent(CORE_CONTENT_PATH)

    return generateDayRecap({
      workshopConfig,
      dayNumber,
      contentLibrary: cache.modules,
    })
  } catch (error: any) {
    console.error('Error generating day recap:', error)
    throw error
  }
})

// Generate day wrap-up content
ipcMain.handle('generate-day-wrapup', async (_event, workshopId: string, dayNumber: number) => {
  try {
    const workshopConfig = await loadWorkshopConfig(workshopId)
    if (!workshopConfig) throw new Error('Workshop not found')

    const cache = contentParser.loadAllContent(CORE_CONTENT_PATH)

    return generateDayWrapup({
      workshopConfig,
      dayNumber,
      contentLibrary: cache.modules,
    })
  } catch (error: any) {
    console.error('Error generating day wrapup:', error)
    throw error
  }
})

// Get auto-generated content for a session
ipcMain.handle('get-auto-generated-content', async (_event, workshopId: string, dayNumber: number, sessionType: string) => {
  try {
    const workshopConfig = await loadWorkshopConfig(workshopId)
    if (!workshopConfig) throw new Error('Workshop not found')

    const cache = contentParser.loadAllContent(CORE_CONTENT_PATH)

    // Create a dummy session to get auto-generated content
    const session = { session: '', type: sessionType as 'day_recap' | 'day_end' }

    return getAutoGeneratedContent(session, workshopConfig, dayNumber, cache.modules)
  } catch (error: any) {
    console.error('Error getting auto-generated content:', error)
    throw error
  }
})

// Export deck with progress events
ipcMain.handle('export-deck', async (_event, workshopId: string, format: string) => {
  try {
    const workshopConfig = await loadWorkshopConfig(workshopId)
    if (!workshopConfig) throw new Error('Workshop not found')

    const cache = contentParser.loadAllContent(CORE_CONTENT_PATH)

    // Update main window reference
    if (mainWindow) {
      exportEngine.setMainWindow(mainWindow)
    }

    return await exportEngine.export(
      workshopConfig,
      workshopId,
      cache.modules,
      { format: format as any, workshopId }
    )
  } catch (error: any) {
    console.error('Error exporting deck:', error)
    throw error
  }
})

// Quick build (markdown + HTML only)
ipcMain.handle('quick-build', async (_event, workshopId: string) => {
  try {
    const workshopConfig = await loadWorkshopConfig(workshopId)
    if (!workshopConfig) throw new Error('Workshop not found')

    const cache = contentParser.loadAllContent(CORE_CONTENT_PATH)

    // Update main window reference
    if (mainWindow) {
      exportEngine.setMainWindow(mainWindow)
    }

    return await exportEngine.quickBuild(workshopConfig, workshopId, cache.modules)
  } catch (error: any) {
    console.error('Error in quick build:', error)
    throw error
  }
})

// Cancel ongoing export
ipcMain.handle('cancel-export', async () => {
  exportEngine.cancelExport()
})

// Helper function to load workshop config
async function loadWorkshopConfig(workshopId: string): Promise<WorkshopConfig | null> {
  const yamlPath = path.join(WORKSHOPS_PATH, workshopId, 'workshop.yaml')

  if (!fs.existsSync(yamlPath)) {
    return null
  }

  const content = fs.readFileSync(yamlPath, 'utf-8')
  return yaml.load(content) as WorkshopConfig
}
