import fs from 'fs'
import path from 'path'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SlideElement {
  type: 'heading' | 'text' | 'bullet' | 'numbered' | 'image' | 'code' | 'directive'
  content: string
  level?: number // For headings (1-6) and bullets (nesting level)
  alt?: string // For images
  src?: string // For images
  language?: string // For code blocks
}

export interface ParsedSlide {
  index: number
  title: string
  elements: SlideElement[]
  rawContent: string
  layout?: string // From marp directives like <!-- _class: lead -->
}

export interface ParsedTopic {
  id: string
  file: string
  title: string
  path: string
  slides: ParsedSlide[]
  frontmatter: Record<string, any>
  slideCount: number
  lastModified: number
}

export interface ParsedModule {
  number: number
  id: string
  name: string
  folder: string
  topics: ParsedTopic[]
  totalSlides: number
}

export interface ContentCache {
  modules: ParsedModule[]
  lastUpdated: number
  fileTimestamps: Record<string, number> // path -> mtime
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT CACHE
// ═══════════════════════════════════════════════════════════════════════════════

let contentCache: ContentCache | null = null

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

// ═══════════════════════════════════════════════════════════════════════════════
// PARSING FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n?/)

  if (!frontmatterMatch) {
    return { frontmatter: {}, body: content }
  }

  const frontmatterStr = frontmatterMatch[1]
  const body = content.slice(frontmatterMatch[0].length)

  // Simple YAML-like parsing (key: value)
  const frontmatter: Record<string, any> = {}
  for (const line of frontmatterStr.split('\n')) {
    const match = line.match(/^(\w+):\s*(.*)$/)
    if (match) {
      const [, key, value] = match
      // Handle booleans
      if (value === 'true') frontmatter[key] = true
      else if (value === 'false') frontmatter[key] = false
      else frontmatter[key] = value
    }
  }

  return { frontmatter, body }
}

/**
 * Parse a single slide's content into structured elements
 */
function parseSlideContent(content: string): SlideElement[] {
  const elements: SlideElement[] = []
  const lines = content.split('\n')

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      i++
      continue
    }

    // HTML comments (directives)
    if (trimmed.startsWith('<!--') && trimmed.endsWith('-->')) {
      elements.push({
        type: 'directive',
        content: trimmed.replace(/<!--\s*|\s*-->/g, ''),
      })
      i++
      continue
    }

    // Headings
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      elements.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2],
      })
      i++
      continue
    }

    // Images
    const imageMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
    if (imageMatch) {
      elements.push({
        type: 'image',
        alt: imageMatch[1],
        src: imageMatch[2],
        content: trimmed,
      })
      i++
      continue
    }

    // Bullet points (including nested)
    const bulletMatch = trimmed.match(/^([-*])\s+(.+)$/)
    if (bulletMatch) {
      // Calculate nesting level from leading spaces
      const leadingSpaces = line.match(/^(\s*)/)?.[1].length || 0
      const level = Math.floor(leadingSpaces / 2)

      elements.push({
        type: 'bullet',
        level,
        content: bulletMatch[2],
      })
      i++
      continue
    }

    // Numbered lists
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/)
    if (numberedMatch) {
      const leadingSpaces = line.match(/^(\s*)/)?.[1].length || 0
      const level = Math.floor(leadingSpaces / 2)

      elements.push({
        type: 'numbered',
        level,
        content: numberedMatch[2],
      })
      i++
      continue
    }

    // Code blocks
    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim()
      const codeLines: string[] = []
      i++

      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }

      elements.push({
        type: 'code',
        language: language || undefined,
        content: codeLines.join('\n'),
      })
      i++ // Skip closing ```
      continue
    }

    // Regular text (paragraph)
    // Collect consecutive non-empty, non-special lines
    const textLines: string[] = [trimmed]
    i++

    while (i < lines.length) {
      const nextLine = lines[i].trim()
      if (!nextLine ||
          nextLine.startsWith('#') ||
          nextLine.startsWith('-') ||
          nextLine.startsWith('*') ||
          nextLine.match(/^\d+\./) ||
          nextLine.startsWith('```') ||
          nextLine.startsWith('![') ||
          nextLine.startsWith('<!--')) {
        break
      }
      textLines.push(nextLine)
      i++
    }

    elements.push({
      type: 'text',
      content: textLines.join(' '),
    })
  }

  return elements
}

/**
 * Parse markdown file into structured slides
 */
function parseMarkdownFile(filePath: string): ParsedTopic | null {
  try {
    if (!fs.existsSync(filePath)) return null

    const content = fs.readFileSync(filePath, 'utf-8')
    const stats = fs.statSync(filePath)

    // Parse frontmatter
    const { frontmatter, body } = parseFrontmatter(content)

    // Split into slides (by ---)
    const slideContents = body.split(/^---$/m)
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('marp:'))

    // Parse each slide
    const slides: ParsedSlide[] = slideContents.map((slideContent, index) => {
      const elements = parseSlideContent(slideContent)

      // Extract title from first heading
      const titleElement = elements.find(e => e.type === 'heading')
      const title = titleElement?.content || `Slide ${index + 1}`

      // Extract layout from directives
      const layoutDirective = elements.find(e =>
        e.type === 'directive' && e.content.includes('_class:')
      )
      const layout = layoutDirective?.content.match(/_class:\s*(\w+)/)?.[1]

      return {
        index,
        title,
        elements,
        rawContent: slideContent,
        layout,
      }
    })

    // Extract topic ID from filename
    const filename = path.basename(filePath)
    const topicMatch = filename.match(/^(m\d+_\d+[a-z]?)_/)
    const topicId = topicMatch ? topicMatch[1] : filename.replace('.md', '')

    // Extract overall title
    const firstSlide = slides[0]
    const mainTitle = firstSlide?.title || filename.replace('.md', '').replace(/^m\d+_\d+[a-z]?_/, '').replace(/_/g, ' ')

    return {
      id: topicId,
      file: filename,
      title: mainTitle.replace(/\s*-\s*Module\s*\d+$/i, '').trim(),
      path: filePath,
      slides,
      frontmatter,
      slideCount: slides.length,
      lastModified: stats.mtimeMs,
    }
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error)
    return null
  }
}

/**
 * Check if cache is valid (all files haven't been modified)
 */
function isCacheValid(coreContentPath: string): boolean {
  if (!contentCache) return false

  // Check if any tracked file has been modified
  for (const [filePath, cachedMtime] of Object.entries(contentCache.fileTimestamps)) {
    try {
      if (!fs.existsSync(filePath)) return false
      const stats = fs.statSync(filePath)
      if (stats.mtimeMs !== cachedMtime) return false
    } catch {
      return false
    }
  }

  // Also check if any new files were added
  const items = fs.readdirSync(coreContentPath)
  for (const item of items) {
    const modulePath = path.join(coreContentPath, item)
    if (!fs.statSync(modulePath).isDirectory()) continue
    if (!item.startsWith('m') || !item.includes('_')) continue

    const files = fs.readdirSync(modulePath).filter(f => f.endsWith('.md'))
    for (const file of files) {
      const filePath = path.join(modulePath, file)
      if (!(filePath in contentCache.fileTimestamps)) return false
    }
  }

  return true
}

/**
 * Load and parse all content from core_content directory
 */
export function loadAllContent(coreContentPath: string, forceReload = false): ContentCache {
  // Return cached content if valid
  if (!forceReload && isCacheValid(coreContentPath)) {
    return contentCache!
  }

  console.log('Parsing content library...')
  const startTime = Date.now()

  const modules: ParsedModule[] = []
  const fileTimestamps: Record<string, number> = {}

  if (!fs.existsSync(coreContentPath)) {
    contentCache = { modules: [], lastUpdated: Date.now(), fileTimestamps: {} }
    return contentCache
  }

  const items = fs.readdirSync(coreContentPath).sort()

  for (const item of items) {
    const modulePath = path.join(coreContentPath, item)

    if (!fs.statSync(modulePath).isDirectory()) continue
    if (!item.startsWith('m') || !item.includes('_')) continue

    // Extract module number
    const modNumMatch = item.match(/^m(\d+)_/)
    if (!modNumMatch) continue

    const modNum = parseInt(modNumMatch[1])

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

    const topics: ParsedTopic[] = []

    for (const file of files) {
      const filePath = path.join(modulePath, file)
      const parsed = parseMarkdownFile(filePath)

      if (parsed) {
        topics.push(parsed)
        fileTimestamps[filePath] = parsed.lastModified
      }
    }

    modules.push({
      number: modNum,
      id: `m${modNum}`,
      name: MODULE_NAMES[modNum] || `Module ${modNum}`,
      folder: item,
      topics,
      totalSlides: topics.reduce((sum, t) => sum + t.slideCount, 0),
    })
  }

  // Sort modules by number
  modules.sort((a, b) => a.number - b.number)

  contentCache = {
    modules,
    lastUpdated: Date.now(),
    fileTimestamps,
  }

  console.log(`Content parsed in ${Date.now() - startTime}ms: ${modules.length} modules, ${modules.reduce((s, m) => s + m.topics.length, 0)} topics`)

  return contentCache
}

/**
 * Get a specific topic by ID
 */
export function getTopic(coreContentPath: string, topicId: string): ParsedTopic | null {
  const cache = loadAllContent(coreContentPath)

  for (const module of cache.modules) {
    const topic = module.topics.find(t => t.id === topicId)
    if (topic) return topic
  }

  return null
}

/**
 * Get a specific module by ID
 */
export function getModule(coreContentPath: string, moduleId: string): ParsedModule | null {
  const cache = loadAllContent(coreContentPath)
  return cache.modules.find(m => m.id === moduleId) || null
}

/**
 * Get a specific slide from a topic
 */
export function getSlide(coreContentPath: string, topicId: string, slideIndex: number): ParsedSlide | null {
  const topic = getTopic(coreContentPath, topicId)
  if (!topic) return null
  return topic.slides[slideIndex] || null
}

/**
 * Invalidate cache (force reload on next access)
 */
export function invalidateCache(): void {
  contentCache = null
}

/**
 * Check if a file has been modified since last parse
 */
export function isFileModified(filePath: string): boolean {
  if (!contentCache) return true

  const cachedMtime = contentCache.fileTimestamps[filePath]
  if (!cachedMtime) return true

  try {
    const stats = fs.statSync(filePath)
    return stats.mtimeMs !== cachedMtime
  } catch {
    return true
  }
}

/**
 * Update a single topic in the cache (for efficient refresh)
 */
export function updateTopic(coreContentPath: string, topicId: string): ParsedTopic | null {
  if (!contentCache) {
    loadAllContent(coreContentPath)
    return getTopic(coreContentPath, topicId)
  }

  // Find the topic's file path
  for (const module of contentCache.modules) {
    const topicIndex = module.topics.findIndex(t => t.id === topicId)
    if (topicIndex !== -1) {
      const oldTopic = module.topics[topicIndex]
      const newTopic = parseMarkdownFile(oldTopic.path)

      if (newTopic) {
        module.topics[topicIndex] = newTopic
        contentCache.fileTimestamps[oldTopic.path] = newTopic.lastModified

        // Recalculate module total slides
        module.totalSlides = module.topics.reduce((sum, t) => sum + t.slideCount, 0)

        return newTopic
      }
    }
  }

  return null
}
