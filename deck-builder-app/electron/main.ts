import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'
import { spawn } from 'child_process'

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
    mainWindow.webContents.openDevTools()
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

        // Find all topic files
        const topics: any[] = []
        const files = fs.readdirSync(modulePath).filter(f => f.endsWith('.md')).sort()

        for (const file of files) {
          // Extract topic ID (e.g., "m3_1" from "m3_1_overview.md")
          const topicMatch = file.match(/^(m\d+_\d+[a-z]?)_/)
          if (!topicMatch) continue

          const topicId = topicMatch[1]
          const filePath = path.join(modulePath, file)

          // Read file content for preview
          const content = fs.readFileSync(filePath, 'utf-8')

          // Extract title from content (first # heading)
          const titleMatch = content.match(/^#\s+(.+)$/m)
          const title = titleMatch ? titleMatch[1] : file.replace('.md', '').replace(/_/g, ' ')

          // Extract first few bullet points for preview
          const bullets = content.match(/^[-*]\s+(.+)$/gm)?.slice(0, 3) || []

          topics.push({
            id: topicId,
            file: file,
            title: title,
            preview: bullets.map(b => b.replace(/^[-*]\s+/, '')),
            path: filePath,
          })
        }

        modules.push({
          number: modNum,
          id: `m${modNum}`,
          name: MODULE_NAMES[modNum] || `Module ${modNum}`,
          folder: item,
          topics: topics,
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

// Save custom slide
ipcMain.handle('save-custom-slide', async (_event, workshopId: string, filename: string, content: string) => {
  try {
    const filePath = path.join(WORKSHOPS_PATH, workshopId, filename)
    fs.writeFileSync(filePath, content, 'utf-8')
    return true
  } catch (error) {
    console.error('Error saving custom slide:', error)
    throw error
  }
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - Build Deck
// ═══════════════════════════════════════════════════════════════════════════════

ipcMain.handle('build-deck', async (_event, workshopId: string) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(RESOURCE_HUB_PATH, 'tools', '02_build_deck.py')
    const venvPython = path.join(RESOURCE_HUB_PATH, '.venv', 'bin', 'python3')
    const pythonPath = fs.existsSync(venvPython) ? venvPython : 'python3'

    const process = spawn(pythonPath, [scriptPath, '--workshop', workshopId], {
      cwd: RESOURCE_HUB_PATH,
    })

    let stdout = ''
    let stderr = ''

    process.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    process.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    process.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, output: stdout })
      } else {
        reject(new Error(`Build failed: ${stderr || stdout}`))
      }
    })

    process.on('error', (error) => {
      reject(error)
    })
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// IPC HANDLERS - AI Assistant (Claude API)
// ═══════════════════════════════════════════════════════════════════════════════

ipcMain.handle('ai-chat', async (_event, messages: any[], context: any) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not set. Add it to your environment variables.')
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey })

    // Build system prompt with context
    const systemPrompt = `You are an AI assistant helping build FASTR workshop decks.

FASTR (Framework for Analytics Strengthening Through Routine data) is a methodology for analyzing health system data.

Available modules:
${Object.entries(MODULE_NAMES).map(([num, name]) => `- Module ${num}: ${name}`).join('\n')}

Current workshop context:
${JSON.stringify(context, null, 2)}

Help the user:
- Suggest which modules to include based on their workshop goals
- Generate custom slide content in markdown format
- Recommend agenda structure and timing
- Answer questions about FASTR methodology

When generating slides, use this format:
\`\`\`markdown
# Slide Title

- Bullet point 1
- Bullet point 2
- Bullet point 3
\`\`\`
`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages,
    })

    return {
      role: 'assistant',
      content: response.content[0].type === 'text' ? response.content[0].text : '',
    }
  } catch (error: any) {
    console.error('AI chat error:', error)
    throw new Error(error.message || 'AI request failed')
  }
})
