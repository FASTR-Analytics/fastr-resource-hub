import PptxGenJS from 'pptxgenjs'
import { WorkshopConfig } from '../db/database.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import imageSize from 'image-size'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Different path depth in dev vs prod due to TypeScript compilation
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')

// ═══════════════════════════════════════════════════════════════════════════════
// FASTR BRAND CONSTANTS (from Python tool)
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  deepGreen: '09544F',    // H1
  darkGreen: '0C716B',    // primary
  green: '1F9A9C',
  lime: 'D0CB17',         // accent/underline
  navy: '21568C',         // H2
  blue: '1A90C0',         // H2 underline
  lightBlue: 'CAE6E9',    // table headers
  lightGreen: 'E8F4F3',   // session headers
  gold: 'D8A822',
  purple: '7A1F6E',
  orchid: 'BD5091',
  coral: 'FF6462',
  textDark: '2c3e50',
  darkGray: '333333',
  white: 'FFFFFF',
  // 2026 refresh tokens (mirror fastr-theme.css :root)
  ink: '1A1F1E',          // body text
  ink2: '5A6562',         // secondary
  ink3: '97A09D',         // tertiary / chrome
  paper2: 'F6F5EF',       // warm panel (breaks, callouts)
  green900: '063D39',     // dark slides
  rule: 'E4E7E5',         // hairline
}

const FONTS = {
  // System-safe only: pptxgenjs cannot embed fonts, so a .pptx renders whatever
  // is installed on the opener's machine (SharePoint, fresh laptops…). Both ship
  // with Office on Windows + Mac. Poppins (the brand deck font) is NOT a default
  // Office font and silently fell back — it stays on the Marp/PDF path only.
  family: 'Calibri',
  titleFamily: 'Calibri Light',  // Office theme's default heading font
  h1Size: 36,
  h2Size: 32,
  h3Size: 22,
  bodySize: 18,
  tableSize: 14,
  smallSize: 12,
}

const LAYOUT = {
  width: 13.33,
  height: 7.5,
  marginLeft: 0.75,
  marginRight: 0.75,
  marginTop: 0.6,
  contentWidth: 11.833,
  contentLeft: 0.75,
}

// Clean table borders (mirror the CSS): every cell gets only a hairline bottom
// rule; header cells override with a 2pt green underline. No box, no fills.
const TABLE_BORDER: any = [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 0.5, color: COLORS.rule }, { type: 'none' }]
const TABLE_BORDER_HEADER: any = [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 1.5, color: COLORS.deepGreen }, { type: 'none' }]

// Warnings collected during a single generatePPTX run (e.g. missing images),
// reset at the start of each run and returned to the caller so the UI can surface them.
let buildWarnings: string[] = []

// Every image must carry alt text (accessibility + SharePoint). This wrapper sets a
// safe default and lets callers override via opts.altText for a meaningful description.
function addSlideImage(slide: PptxGenJS.Slide, opts: PptxGenJS.ImageProps): void {
  slide.addImage({ altText: 'FASTR slide graphic', ...opts })
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ParsedSlide {
  raw: string
  headers: Array<{ level: number; text: string }>
  bullets: string[]
  paragraphs: string[]
  content: Array<{ type: 'header' | 'bullet' | 'paragraph'; text: string; level?: number }>
  table: string[][] | null
  images: Array<{ alt: string; path: string; height?: number }>
  columns: { left: string; right: string } | null
  cssClass: string | null
  presenterNotes?: string
  header?: string   // Marp header directive in effect for this slide (kicker · locator)
  footer?: string   // Marp footer directive in effect for this slide
}

type SlideType = 'title' | 'agenda' | 'break' | 'section' | 'two_column' | 'table' | 'image' | 'content'

// ═══════════════════════════════════════════════════════════════════════════════
// MARKDOWN PARSER (ported from Python)
// ═══════════════════════════════════════════════════════════════════════════════

const stripQuotes = (s: string) => s.trim().replace(/^['"]/, '').replace(/['"]$/, '')

function parseMarkdown(content: string): ParsedSlide[] {
  // Strip YAML frontmatter — but first read global header/footer (chrome) from it.
  let currentHeader = ''
  let currentFooter = ''
  const frontmatterMatch = content.match(/^---\n[\s\S]*?\n---\n?/)
  if (frontmatterMatch) {
    const fm = frontmatterMatch[0]
    const gh = fm.match(/^header:\s*(.+?)\s*$/m)
    const gf = fm.match(/^footer:\s*(.+?)\s*$/m)
    if (gh) currentHeader = stripQuotes(gh[1])
    if (gf) currentFooter = stripQuotes(gf[1])
    content = content.slice(fm.length)
  }

  // Strip style blocks
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')

  // Split into slides
  const rawSlides = content.split(/\n---\s*\n/)

  const slides: ParsedSlide[] = []

  for (let raw of rawSlides) {
    raw = raw.trim()
    if (!raw) continue

    // Extract CSS class directive FIRST
    let cssClass: string | null = null
    const classMatch = raw.match(/<!--\s*_class:\s*([\w-]+)\s*-->/)
    if (classMatch) {
      cssClass = classMatch[1]
      raw = raw.replace(/<!--\s*_class:\s*[\w-]+\s*-->/, '')
    }

    // Header/footer directives — persistent (`<!-- header: -->`) carry forward to
    // later slides; local (`<!-- _header: -->`) apply to this slide only. Parse
    // BEFORE the generic comment-strip below removes them.
    const hPersist = raw.match(/<!--\s*header:\s*(.+?)\s*-->/)
    const hLocal = raw.match(/<!--\s*_header:\s*(.+?)\s*-->/)
    const fPersist = raw.match(/<!--\s*footer:\s*(.+?)\s*-->/)
    const fLocal = raw.match(/<!--\s*_footer:\s*(.+?)\s*-->/)
    if (hPersist) currentHeader = stripQuotes(hPersist[1])
    if (fPersist) currentFooter = stripQuotes(fPersist[1])
    const slideHeader = hLocal ? stripQuotes(hLocal[1]) : currentHeader
    const slideFooter = fLocal ? stripQuotes(fLocal[1]) : currentFooter
    raw = raw.replace(/<!--\s*_?header:[\s\S]*?-->/g, '').replace(/<!--\s*_?footer:[\s\S]*?-->/g, '')

    // Extract and remove presenter notes (HTML comments with PRESENTER NOTES)
    // Must happen BEFORE creating slide object so cleaned raw is stored
    let presenterNotes: string | undefined
    const notesRegex = /<!--\s*PRESENTER NOTES:[\s\S]*?-->/gi
    const notesMatch = raw.match(notesRegex)
    if (notesMatch) {
      presenterNotes = notesMatch.map(note =>
        note.replace(/<!--\s*/, '').replace(/\s*-->/, '').replace(/^PRESENTER NOTES:\s*/i, '').trim()
      ).join('\n\n')
    }
    // Remove all presenter notes comments from content
    raw = raw.replace(notesRegex, '')

    // Also remove any other HTML comments that are not directives (multi-line notes without PRESENTER NOTES label)
    raw = raw.replace(/<!--(?!\s*_)[\s\S]*?-->/g, '')

    // Trim again after removing comments
    raw = raw.trim()

    const slide: ParsedSlide = {
      raw,  // Now contains cleaned content without presenter notes
      headers: [],
      bullets: [],
      paragraphs: [],
      content: [],
      table: null,
      images: [],
      columns: null,
      cssClass,
      presenterNotes,
      header: slideHeader,
      footer: slideFooter,
    }

    // Extract headers
    const headerMatches = raw.matchAll(/^(#{1,6})\s+(.+)$/gm)
    for (const match of headerMatches) {
      const level = match[1].length
      let text = match[2].trim()
      // Strip HTML tags
      text = text.replace(/<[^>]+>/g, '').trim()
      slide.headers.push({ level, text })
    }

    // Extract images (markdown and HTML)
    const imgMatches = raw.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)
    for (const match of imgMatches) {
      const altText = match[1]
      const heightMatch = altText.match(/h:(\d+)/)
      const height = heightMatch ? parseInt(heightMatch[1]) : undefined
      slide.images.push({
        alt: altText.replace(/\s*h:\d+/, '').trim(),
        path: match[2].split(/\s/)[0],
        height,
      })
    }

    // Extract HTML images
    const htmlImgMatches = raw.matchAll(/<img\s+[^>]*src=["']([^"']+)["']/g)
    for (const match of htmlImgMatches) {
      slide.images.push({ alt: '', path: match[1] })
    }

    // Extract table
    const tableLines: string[][] = []
    const lines = raw.split('\n')
    let inTable = false

    for (const line of lines) {
      if (line.includes('|') && line.trim().startsWith('|')) {
        inTable = true
        // Skip separator line
        if (/^\|[\s\-:|]+\|$/.test(line.trim())) continue
        const cells = line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim())
        tableLines.push(cells)
      } else if (inTable) {
        break
      }
    }

    if (tableLines.length > 0) {
      slide.table = tableLines
    }

    // Extract columns - match class="columns/split/output-layout/panel-layout" OR style="display: flex"
    let colsMatch = raw.match(/<div\s+class="(?:columns|split|output-layout|panel-layout|columns-text-left|columns-image-right)[^"]*">\s*<div[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<\/div>/)
    if (!colsMatch) {
      // Also match flex layouts: <div style="display: flex..."><div>...</div><div>...</div></div>
      colsMatch = raw.match(/<div\s+style="[^"]*display:\s*flex[^"]*"[^>]*>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<\/div>/)
    }
    if (colsMatch) {
      slide.columns = {
        left: colsMatch[1].trim(),
        right: colsMatch[2].trim(),
      }
    }

    // Extract content in order - with multi-line bullet support
    let currentBullet: string | null = null
    let currentIndentLevel = 0

    for (const line of lines) {
      const stripped = line.trim()
      if (!stripped) {
        // Empty line ends current bullet
        if (currentBullet) {
          slide.bullets.push(currentBullet)
          slide.content.push({ type: 'bullet', text: currentBullet })
          currentBullet = null
        }
        continue
      }

      // Skip lines that are only HTML entities like &nbsp; (used for spacing)
      if (/^(&nbsp;|\s)+$/.test(stripped)) continue

      // H3+ headers in content flow
      const h3Match = stripped.match(/^(#{3,6})\s+(.+)$/)
      if (h3Match) {
        if (currentBullet) {
          slide.bullets.push(currentBullet)
          slide.content.push({ type: 'bullet', text: currentBullet })
          currentBullet = null
        }
        slide.content.push({ type: 'header', text: h3Match[2].trim(), level: h3Match[1].length })
        continue
      }

      // Skip H1/H2, tables, images, divs, comments
      if (stripped.startsWith('#')) continue
      if (stripped.startsWith('|')) continue
      if (stripped.startsWith('![')) continue
      if (stripped.startsWith('<img')) continue
      if (stripped.startsWith('<div') || stripped.startsWith('</div')) continue
      if (stripped.startsWith('<!--')) continue

      // Bullets (-, *, or Unicode bullets like •, ▪, ►)
      const bulletMatch = stripped.match(/^[-*•◦▪►▸‣⁃]\s+(.+)$/)
      if (bulletMatch) {
        // Save previous bullet if any
        if (currentBullet) {
          slide.bullets.push(currentBullet)
          slide.content.push({ type: 'bullet', text: currentBullet })
        }
        currentBullet = bulletMatch[1].trim()
        currentIndentLevel = line.search(/\S/)  // Track indentation
        continue
      }

      // Numbered list
      const numMatch = stripped.match(/^\d+\.\s+(.+)$/)
      if (numMatch) {
        if (currentBullet) {
          slide.bullets.push(currentBullet)
          slide.content.push({ type: 'bullet', text: currentBullet })
        }
        currentBullet = numMatch[1].trim()
        currentIndentLevel = line.search(/\S/)
        continue
      }

      // Check if this is a continuation of a multi-line bullet
      // (indented text following a bullet)
      const lineIndent = line.search(/\S/)
      if (currentBullet && lineIndent > currentIndentLevel) {
        // This is continuation text - append to current bullet with space
        currentBullet += ' ' + stripped
        continue
      }

      // Paragraph - save any pending bullet first
      if (currentBullet) {
        slide.bullets.push(currentBullet)
        slide.content.push({ type: 'bullet', text: currentBullet })
        currentBullet = null
      }

      // Check if this is a bold-only paragraph (acts as sub-header)
      // Match **text** or __text__ that spans the entire line
      const boldMatch = stripped.match(/^\*\*(.+)\*\*$/) || stripped.match(/^__(.+)__$/)
      if (boldMatch) {
        // Treat as a sub-header (level 4)
        slide.content.push({ type: 'header', text: boldMatch[1].trim(), level: 4 })
        continue
      }

      slide.paragraphs.push(stripped)
      slide.content.push({ type: 'paragraph', text: stripped })
    }

    // Don't forget the last bullet if any
    if (currentBullet) {
      slide.bullets.push(currentBullet)
      slide.content.push({ type: 'bullet', text: currentBullet })
    }

    slides.push(slide)
  }

  return slides
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE TYPE DETECTION (ported from Python)
// ═══════════════════════════════════════════════════════════════════════════════

function detectSlideType(slide: ParsedSlide, index: number): SlideType {
  const h1Text = slide.headers[0]?.level === 1 ? slide.headers[0].text : ''

  // Title slide
  if (index === 0) {
    if (slide.cssClass === 'title-cover') return 'title'
    for (const img of slide.images) {
      if (/logo|fastr|cover/i.test(img.path)) return 'title'
    }
  }

  // Agenda
  if (slide.cssClass === 'agenda' || (slide.table && /agenda/i.test(h1Text))) {
    return 'agenda'
  }

  // Break
  if (slide.cssClass === 'break') return 'break'
  const breakEmojis = ['☕', '🍽', '🌙', '🎉', '👋', '⏰']
  if (breakEmojis.some(e => h1Text.includes(e))) return 'break'
  if (/\b(break|lunch|tea)\b/i.test(h1Text)) return 'break'

  // Section
  if (slide.cssClass === 'section-cover' || slide.cssClass === 'section') return 'section'
  const nonIconImages = slide.images.filter(img => !isIconImage(img))
  const hasContent = slide.bullets.length > 0 || slide.paragraphs.length > 0 || nonIconImages.length > 0
  if (slide.headers[0]?.level === 1 && !hasContent) {
    // Recognize "Session X", "Day X", or module titles as section slides
    if (/^(Session|Day|Module)\s+\d+/i.test(h1Text)) return 'section'
  }

  // Two column
  if (slide.columns) return 'two_column'

  // Table
  if (slide.table) return 'table'

  // Image slide: has image but minimal text (less than 2 bullets AND less than 2 paragraphs)
  const hasMinimalText = slide.bullets.length < 2 && slide.paragraphs.length < 2 && slide.content.length < 3
  if (nonIconImages.length > 0 && hasMinimalText) return 'image'

  return 'content'
}

// ═══════════════════════════════════════════════════════════════════════════════
// IMAGE PATH RESOLUTION
// ═══════════════════════════════════════════════════════════════════════════════

function resolveImagePath(imgPath: string): string | null {
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return null
  }

  imgPath = imgPath.replace(/%20/g, ' ')

  // If it's already an absolute path (materialized external image), use directly
  if (path.isAbsolute(imgPath) && fs.existsSync(imgPath)) {
    return imgPath
  }

  // Remove all leading ../ patterns
  const cleanPath = imgPath.replace(/^(\.\.\/)+/, '')

  const pathsToTry = [
    path.join(REPO_ROOT, cleanPath),
    path.join(REPO_ROOT, 'resources', 'logos', path.basename(imgPath)),
    path.join(REPO_ROOT, 'resources', 'diagrams', path.basename(imgPath)),
    path.join(REPO_ROOT, 'resources', 'backgrounds', path.basename(imgPath)),
    path.join(REPO_ROOT, 'resources', 'screenshots', path.basename(imgPath)),
    path.join(REPO_ROOT, 'resources', 'icons', path.basename(imgPath)),
    path.join(REPO_ROOT, 'resources', 'default_outputs', path.basename(imgPath)),
    // External slides data directory
    path.join(REPO_ROOT, 'web-app', 'data', 'external', path.basename(imgPath)),
  ]

  for (const p of pathsToTry) {
    if (fs.existsSync(p)) {
      return p
    }
  }

  console.warn(`[PPTX] Image not found: ${imgPath}`)
  buildWarnings.push(`Image not found: ${imgPath}`)
  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEXT HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function stripHtmlTags(text: string): string {
  text = text.replace(/<em>([^<]+)<\/em>/gi, '*$1*')
  text = text.replace(/<i>([^<]+)<\/i>/gi, '*$1*')
  text = text.replace(/<strong>([^<]+)<\/strong>/gi, '**$1**')
  text = text.replace(/<b>([^<]+)<\/b>/gi, '**$1**')
  text = text.replace(/<img\s+[^>]*\/?>/g, '')
  text = text.replace(/<\/?(?:div|span|p|br|a|small|em|i|strong|b)[^>]*>/g, '')
  return text.trim()
}

function cleanMarkdownText(text: string): string {
  text = stripHtmlTags(text)
  // Convert HTML entities to their characters
  text = text.replace(/&nbsp;/g, ' ')
  text = text.replace(/&amp;/g, '&')
  text = text.replace(/&lt;/g, '<')
  text = text.replace(/&gt;/g, '>')
  text = text.replace(/&quot;/g, '"')
  text = text.replace(/&#39;/g, "'")
  // Remove inline images (icons)
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, '')
  // Remove markdown bold/italic/code formatting
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
  text = text.replace(/\*([^*]+)\*/g, '$1')
  text = text.replace(/`([^`]+)`/g, '$1')
  // Remove Unicode bullet characters that might be in the text
  text = text.replace(/^[\u2022\u2023\u2043\u204C\u204D\u2219\u25AA\u25AB\u25B8\u25B9\u25CF\u25E6\u29BE\u29BF\u2013\u2014►◦•▪▸‣⁃]\s*/gm, '')
  // Normalize newlines to spaces (for multi-line text that should flow)
  text = text.replace(/\n/g, ' ')
  // Normalize multiple spaces to single space
  text = text.replace(/\s+/g, ' ')
  return text.trim()
}

// Parse text with inline formatting (**bold**, *italic*) into formatted runs for pptxgenjs
function parseInlineFormatting(text: string, baseOptions: any): PptxGenJS.TextProps[] {
  const runs: PptxGenJS.TextProps[] = []

  // Combined pattern: **bold** or *italic* (but not ** which is bold)
  // Process bold first, then italic on remaining text
  const boldPattern = /\*\*([^*]+)\*\*/g
  const italicPattern = /(?<!\*)\*([^*]+)\*(?!\*)/g

  // First pass: extract bold segments
  interface Segment {
    start: number
    end: number
    text: string
    bold?: boolean
    italic?: boolean
  }
  const segments: Segment[] = []
  let match

  // Find all bold matches
  while ((match = boldPattern.exec(text)) !== null) {
    segments.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[1],
      bold: true,
    })
  }

  // Find all italic matches (that don't overlap with bold)
  while ((match = italicPattern.exec(text)) !== null) {
    const overlaps = segments.some(s =>
      (match!.index >= s.start && match!.index < s.end) ||
      (match!.index + match![0].length > s.start && match!.index + match![0].length <= s.end)
    )
    if (!overlaps) {
      segments.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
        italic: true,
      })
    }
  }

  // Sort segments by start position
  segments.sort((a, b) => a.start - b.start)

  // Build runs from segments
  let lastIndex = 0
  for (const seg of segments) {
    // Add plain text before this segment
    if (seg.start > lastIndex) {
      const plainText = text.slice(lastIndex, seg.start)
      if (plainText.trim()) {
        // Preserve leading/trailing spaces for inline runs
        const cleaned = cleanMarkdownText(plainText)
        const hasLeadingSpace = plainText.startsWith(' ')
        const hasTrailingSpace = plainText.endsWith(' ')
        runs.push({
          text: (hasLeadingSpace ? ' ' : '') + cleaned + (hasTrailingSpace ? ' ' : ''),
          options: { ...baseOptions },
        })
      }
    }

    // Add formatted segment
    runs.push({
      text: cleanMarkdownText(seg.text),
      options: {
        ...baseOptions,
        bold: seg.bold || baseOptions.bold,
        italic: seg.italic,
      },
    })

    lastIndex = seg.end
  }

  // Add remaining text after last segment
  if (lastIndex < text.length) {
    const afterText = text.slice(lastIndex)
    if (afterText.trim()) {
      // Preserve leading space for text after formatted segments
      const cleaned = cleanMarkdownText(afterText)
      const hasLeadingSpace = afterText.startsWith(' ')
      runs.push({
        text: (hasLeadingSpace ? ' ' : '') + cleaned,
        options: { ...baseOptions },
      })
    }
  }

  // If no formatting was found, return single run with cleaned text
  if (runs.length === 0) {
    runs.push({
      text: cleanMarkdownText(text),
      options: { ...baseOptions },
    })
  }

  // Add breakLine to the last run
  if (runs.length > 0 && runs[runs.length - 1].options) {
    runs[runs.length - 1].options!.breakLine = true
  }

  return runs
}

// Check if an image is a background image (should be skipped in content)
function isBackgroundImage(img: { alt: string; path: string; height?: number }): boolean {
  return img.alt === 'bg'
}

// Check if an image is a decorative icon (should be rendered centered)
function isDecorativeIcon(img: { alt: string; path: string; height?: number }): boolean {
  // Has explicit width or height in alt text (w:120, h:40, etc)
  if (/[wh]:\d+/.test(img.alt)) return true
  // In icons folder
  if (/\/icons\//.test(img.path)) return true
  return false
}

// Legacy function - now only filters backgrounds
function isIconImage(img: { alt: string; path: string; height?: number }): boolean {
  return isBackgroundImage(img)
}

// Get image dimensions and calculate optimal size for slide
interface ImageLayout {
  w: number
  h: number
  x: number
  y: number
  isLandscape: boolean
  aspectRatio: number
}

function getImageLayout(
  imgPath: string,
  maxW: number,
  maxH: number,
  startX: number,
  startY: number
): ImageLayout | null {
  try {
    const dimensions = imageSize(imgPath)
    if (!dimensions.width || !dimensions.height) return null

    const imgW = dimensions.width
    const imgH = dimensions.height
    const aspectRatio = imgW / imgH
    const isLandscape = aspectRatio > 1

    let w: number, h: number

    // Scale to fit within bounds while maintaining aspect ratio
    if (aspectRatio > maxW / maxH) {
      // Image is wider than container - fit to width
      w = maxW
      h = maxW / aspectRatio
    } else {
      // Image is taller than container - fit to height
      h = maxH
      w = maxH * aspectRatio
    }

    // Center within the available space
    const x = startX + (maxW - w) / 2
    const y = startY + (maxH - h) / 2

    return { w, h, x, y, isLandscape, aspectRatio }
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE BUILDERS
// ═══════════════════════════════════════════════════════════════════════════════

// Title width available for the heading (full content width).
const TITLE_W = 12.33
/** Draws the title + lime rule and returns the Y where body content should start
 *  (below the rule) — so long/wrapped titles push content down instead of overlapping. */
function addHeaderBar(slide: PptxGenJS.Slide, title: string): number {
  const clean = cleanMarkdownText(title)

  // Title sits below the kicker chrome (~0.6"), giving it breathing room.
  // Estimate wrapped lines so the lime rule lands just under the LAST line.
  // h2 is 32pt Calibri Light over ~12.3" — line 1 holds ~58-62 chars, so a too-
  // low divisor (e.g. 40) over-counts lines and reserves a phantom blank line
  // below the title (a tall gap that also pushes body content off the slide).
  const titleY = 0.82
  const lineH = 0.55
  const lineCount = Math.max(1, Math.ceil(clean.length / 58))
  const titleH = lineCount * lineH

  slide.addText(clean, {
    x: 0.5, y: titleY, w: TITLE_W, h: titleH,
    fontSize: FONTS.h2Size,
    fontFace: FONTS.titleFamily,
    color: COLORS.deepGreen,
    bold: true,
    valign: 'top',
  })

  // Fixed short lime rule under the title's last line (the brand signature) —
  // never length-scaled, so long/wrapped titles still get a clean short bar.
  slide.addShape('rect', {
    x: 0.52, y: titleY + titleH + 0.04, w: 1.25, h: 0.05,
    fill: { color: COLORS.lime },
    line: { type: 'none' },
  } as any)

  return titleY + titleH + 0.28  // content starts below the lime rule
}

function addFooterBar(slide: PptxGenJS.Slide): void {
  // No footer bar - clean design
}

// Slide chrome (mirrors fastr-theme.css): kicker (topic) top-left with a lime
// dash, locator (Day x/y · Session n) top-right, and a thin footer rule with
// "FASTR · country · date" left + page number right. Driven by the deck's
// header/footer directives. Covers and breaks are self-contained → no chrome.
const CHROME_BARE = new Set(['title', 'title-cover', 'section', 'section-cover', 'break', 'lead'])
function addChrome(slide: PptxGenJS.Slide, data: ParsedSlide, pageNum: number): void {
  if (data.cssClass && CHROME_BARE.has(data.cssClass)) return

  const header = data.header || ''
  const kickMatch = header.match(/<span class="kick">([\s\S]*?)<\/span>/i)
  const locMatch = header.match(/<span class="loc">([\s\S]*?)<\/span>/i)
  const kick = kickMatch ? cleanMarkdownText(kickMatch[1]) : (header.includes('<span') ? '' : cleanMarkdownText(header))
  const loc = locMatch ? cleanMarkdownText(locMatch[1]) : ''

  if (kick) {
    slide.addShape('rect', { x: 0.5, y: 0.43, w: 0.22, h: 0.025, fill: { color: COLORS.lime }, line: { type: 'none' } } as any)
    slide.addText(kick.toUpperCase(), {
      x: 0.8, y: 0.28, w: 8, h: 0.32, fontSize: 10, fontFace: FONTS.family,
      color: COLORS.deepGreen, bold: true, charSpacing: 2, valign: 'middle',
    })
  }
  if (loc) {
    slide.addText(loc.toUpperCase(), {
      x: 5.33, y: 0.28, w: 7.5, h: 0.32, fontSize: 10, fontFace: FONTS.family,
      color: COLORS.ink3, bold: true, charSpacing: 2, align: 'right', valign: 'middle',
    })
  }

  // Footer rule + text + page number.
  slide.addShape('line', { x: 0.5, y: 7.04, w: 12.33, h: 0, line: { color: COLORS.rule, width: 0.75 } } as any)
  const footer = data.footer ? cleanMarkdownText(data.footer) : ''
  if (footer) {
    slide.addText(footer.toUpperCase(), {
      x: 0.5, y: 7.1, w: 9, h: 0.3, fontSize: 9, fontFace: FONTS.family,
      color: COLORS.ink3, charSpacing: 1.5, valign: 'middle',
    })
  }
  slide.addText(String(pageNum), {
    x: 11.5, y: 7.1, w: 1.33, h: 0.3, fontSize: 9, fontFace: FONTS.family,
    color: COLORS.ink3, align: 'right', valign: 'middle',
  })
}

function buildTitleSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()

  // Check for background image
  const bgMatch = data.raw.match(/!\[bg\]\(([^)]+)\)/)
  let hasBgImage = false

  if (bgMatch) {
    const bgPath = resolveImagePath(bgMatch[1].split(/\s/)[0])
    if (bgPath) {
      addSlideImage(slide,{ path: bgPath, x: 0, y: 0, w: LAYOUT.width, h: LAYOUT.height })
      hasBgImage = true
    }
  }

  if (!hasBgImage) {
    slide.background = { color: COLORS.deepGreen }
  }

  const title = data.headers[0]?.text || 'FASTR Workshop'
  const titleColor = hasBgImage ? COLORS.white : COLORS.white
  const titleTop = hasBgImage ? 2.8 : 2.2

  // Main title - Poppins Bold
  slide.addText(cleanMarkdownText(title), {
    x: 0.8, y: titleTop, w: 11.733, h: 1.4,
    fontSize: hasBgImage ? 32 : FONTS.h1Size,
    fontFace: FONTS.titleFamily,
    color: titleColor,
    bold: true,
    align: 'center',
    valign: 'middle',
  })

  // Subtitle - look for **bold text** on its own line (not date format)
  const subtitleMatch = data.raw.match(/^\*\*([^*|]+)\*\*$/m)
  if (subtitleMatch) {
    slide.addText(cleanMarkdownText(subtitleMatch[1]), {
      x: 1, y: titleTop + 1.5, w: 11.333, h: 0.5,
      fontSize: hasBgImage ? 18 : 20,
      fontFace: FONTS.family,
      color: hasBgImage ? 'F5F5F5' : COLORS.lime,
      align: 'center',
    })
  }

  // Location, Country line
  const locationMatch = data.raw.match(/^([^,\n]+),\s*([^\n]+)$/m)
  if (locationMatch) {
    slide.addText(`${locationMatch[1].trim()}, ${locationMatch[2].trim()}`, {
      x: 1, y: titleTop + 2.1, w: 11.333, h: 0.4,
      fontSize: hasBgImage ? 16 : 18,
      fontFace: FONTS.family,
      color: hasBgImage ? 'E8E8E8' : COLORS.white,
      align: 'center',
    })
  }

  // Date line — skip the line already shown as location (it often carries the date too).
  const usedLocation = locationMatch ? locationMatch[0].trim() : ''
  const lines = data.raw.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('!') && !l.startsWith('<!--') && !l.startsWith('**'))
  const dateLine = lines.find(l => l !== usedLocation && /\d/.test(l) && (/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(l) || /\d{4}/.test(l)))
  if (dateLine) {
    slide.addText(cleanMarkdownText(dateLine), {
      x: 1, y: titleTop + 2.5, w: 11.333, h: 0.4,
      fontSize: hasBgImage ? 14 : 16,
      fontFace: FONTS.family,
      color: hasBgImage ? 'D0D0D0' : COLORS.white,
      align: 'center',
    })
  }

  // Lime underline
  slide.addShape('rect', {
    x: 4, y: titleTop + 3.0, w: 5.333, h: 0.04,
    fill: { color: COLORS.lime },
    line: { color: COLORS.lime },
  })

  // Add logos (GFF top-left, FASTR bottom-left) with correct aspect ratios
  for (const img of data.images) {
    if (isBackgroundImage(img)) continue
    const imgPath = resolveImagePath(img.path)
    if (!imgPath) continue
    try {
      const dims = imageSize(imgPath)
      if (!dims.width || !dims.height) continue
      const aspect = dims.width / dims.height
      if (/GFF_Logo/i.test(img.path)) {
        const h = 0.4
        addSlideImage(slide,{ path: imgPath, x: 0.6, y: 0.3, w: h * aspect, h })
      } else if (/FASTR.*White/i.test(img.path)) {
        const h = 0.5
        addSlideImage(slide,{ path: imgPath, x: 0.6, y: 6.85, w: h * aspect, h })
      }
    } catch {}
  }
}

function buildSectionSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()

  // Check for background image
  const bgMatch = data.raw.match(/!\[bg\]\(([^)]+)\)/)
  let hasBgImage = false

  if (bgMatch) {
    const bgPath = resolveImagePath(bgMatch[1].split(/\s/)[0])
    if (bgPath) {
      addSlideImage(slide,{ path: bgPath, x: 0, y: 0, w: LAYOUT.width, h: LAYOUT.height })
      hasBgImage = true
    }
  }

  if (!hasBgImage) {
    slide.background = { color: COLORS.darkGreen }
  }

  const title = data.headers[0]?.text || 'Section'

  // Check for decorative icon
  const decorativeIcon = data.images.find(img => isDecorativeIcon(img))
  const hasIcon = decorativeIcon && !isBackgroundImage(decorativeIcon)

  // Position title higher if there's an icon below
  const titleY = hasIcon ? 2.2 : 2.8

  slide.addText(cleanMarkdownText(title), {
    x: 1, y: titleY, w: 11.333, h: 1.5,
    fontSize: 44,
    fontFace: FONTS.titleFamily,
    color: COLORS.white,
    bold: true,
    align: 'center',
    valign: 'middle',
  })

  // Add decorative icon centered below title
  if (hasIcon && decorativeIcon) {
    const iconPath = resolveImagePath(decorativeIcon.path)
    if (iconPath) {
      // Extract width from alt text if specified (w:120 -> 120px -> ~1.25 inches)
      const widthMatch = decorativeIcon.alt.match(/w:(\d+)/)
      const iconWidth = widthMatch ? parseInt(widthMatch[1]) / 96 : 1.5  // Convert px to inches
      const iconX = (LAYOUT.width - iconWidth) / 2
      addSlideImage(slide,{ path: iconPath, x: iconX, y: 4.0, w: iconWidth })
    }
  }

  // Underline
  slide.addShape('rect', {
    x: 4, y: hasIcon ? 5.5 : 4.5, w: 5.333, h: 0.03,
    fill: { color: COLORS.lime },
    line: { color: COLORS.lime },
  })
}

function buildBreakSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.paper2 }  // warm off-white field

  // New structure: kind label + big duration (h1) + "we resume at" line.
  // Fall back to the old "**N minutes** / resume at HH:MM" prose if present.
  const kindMatch = data.raw.match(/<div class="kind">([\s\S]*?)<\/div>/i)
  const backMatch = data.raw.match(/<div class="back">([\s\S]*?)<\/div>/i)
  let kind = kindMatch ? cleanMarkdownText(kindMatch[1]) : ''
  let big = cleanMarkdownText(data.headers[0]?.text || 'Break')
  let back = backMatch ? cleanMarkdownText(backMatch[1]) : ''

  if (!backMatch) {
    const resumeMatch = data.raw.match(/resume at\s*\**(\d{1,2}:\d{2})/i)
    if (resumeMatch) back = `We resume at ${resumeMatch[1]}`
  }

  if (kind) {
    slide.addText(kind.toUpperCase(), {
      x: 0.5, y: 2.35, w: 12.33, h: 0.5,
      fontSize: 16, fontFace: FONTS.family, color: COLORS.deepGreen,
      bold: true, charSpacing: 3, align: 'center',
    })
  }

  slide.addText(big, {
    x: 0.5, y: 2.75, w: 12.33, h: 2.1,
    fontSize: 130, fontFace: FONTS.titleFamily, color: COLORS.deepGreen,
    bold: true, align: 'center', valign: 'middle',
  })

  if (back) {
    slide.addText(back, {
      x: 0.5, y: 5.1, w: 12.33, h: 0.6,
      fontSize: 24, fontFace: FONTS.family, color: COLORS.ink, align: 'center',
    })
  }
}

function buildAgendaSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  const title = data.headers[0]?.text || 'Workshop Agenda'
  const agendaTop = addHeaderBar(slide, title)

  if (data.table && data.table.length > 0) {
    const rows = data.table.length

    const fontSize = rows > 10 ? FONTS.smallSize : FONTS.tableSize
    const rowHeight = rows > 10 ? 0.28 : 0.35

    // Build simple table - array of arrays of strings
    const tableRows: PptxGenJS.TableRow[] = data.table.map((row, rIdx) => {
      return row.map((cell) => {
        // Check if cell content is wrapped in bold markers
        const isBoldCell = /^\*\*.*\*\*$/.test(cell.trim())
        const cellObj: PptxGenJS.TableCell = {
          text: cleanMarkdownText(cell),
          options: {
            fontSize: fontSize,
            fontFace: FONTS.family,
            color: rIdx === 0 ? COLORS.deepGreen : COLORS.ink,
            bold: rIdx === 0 || isBoldCell,
            valign: 'middle',
            border: rIdx === 0 ? TABLE_BORDER_HEADER : TABLE_BORDER,
          },
        }
        return cellObj
      })
    })

    // Set column widths based on number of columns
    const cols = data.table[0].length
    let colW: number[]
    if (cols === 3) {
      colW = [2.2, 6.8, 2.8]  // Time, Session, Facilitator
    } else {
      colW = [2.5, 9.3]  // Time, Session only
    }

    slide.addTable(tableRows, {
      x: LAYOUT.contentLeft,
      y: agendaTop,
      w: LAYOUT.contentWidth,
      rowH: rowHeight,
      border: TABLE_BORDER,
      colW,
    })
  }

  addFooterBar(slide)
}

function buildTableSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  const title = data.headers[0]?.text || 'Table'
  let tableTop = addHeaderBar(slide, title)

  // Check if there's paragraph content before the table - render it first
  const hasTextContent = data.content.length > 0
  if (hasTextContent) {
    const textItems: PptxGenJS.TextProps[] = []
    for (const item of data.content) {
      if (item.type === 'header' && item.level) {
        textItems.push({
          text: cleanMarkdownText(item.text),
          options: {
            fontSize: FONTS.h3Size,
            fontFace: FONTS.family,
            color: COLORS.darkGreen,
            bold: true,
            breakLine: true,
            paraSpaceAfter: 6,
          },
        })
      } else if (item.type === 'bullet') {
        textItems.push({
          text: cleanMarkdownText(item.text),
          options: {
            fontSize: FONTS.bodySize - 2,
            fontFace: FONTS.family,
            color: COLORS.textDark,
            bullet: true,
            breakLine: true,
            paraSpaceAfter: 4,
          },
        })
      } else if (item.type === 'paragraph') {
        const baseOptions = {
          fontSize: FONTS.bodySize - 2,
          fontFace: FONTS.family,
          color: COLORS.darkGray,
          paraSpaceAfter: 6,
        }
        const runs = parseInlineFormatting(item.text, baseOptions)
        textItems.push(...runs)
      }
    }

    if (textItems.length > 0) {
      // Estimate text height - roughly 0.3 inches per line
      const estimatedTextHeight = Math.min(2, textItems.length * 0.25)
      const textTop = tableTop
      slide.addText(textItems, {
        x: LAYOUT.contentLeft,
        y: textTop,
        w: LAYOUT.contentWidth,
        h: estimatedTextHeight,
        valign: 'top',
        fit: 'shrink',
      })
      tableTop = textTop + estimatedTextHeight + 0.2
    }
  }

  if (data.table && data.table.length > 0) {
    const rows = data.table.length
    const cols = data.table[0].length

    const fontSize = cols > 4 ? FONTS.smallSize : FONTS.tableSize
    const rowHeight = cols > 4 ? 0.3 : 0.35

    const tableData: PptxGenJS.TableRow[] = data.table.map((row, rIdx) => {
      return row.map((cell) => ({
        text: cleanMarkdownText(cell),
        options: {
          fontSize,
          fontFace: FONTS.family,
          color: rIdx === 0 ? COLORS.deepGreen : COLORS.ink,
          bold: rIdx === 0,
          border: rIdx === 0 ? TABLE_BORDER_HEADER : TABLE_BORDER,
        },
      }))
    })

    slide.addTable(tableData, {
      x: LAYOUT.contentLeft,
      y: tableTop,
      w: 12.3,
      rowH: rowHeight,
      border: TABLE_BORDER,
    })

    // Calculate where the table ends for positioning images below
    const tableEndY = tableTop + (rows * rowHeight) + 0.3

    // Add images below the table if present
    const contentImages = data.images.filter(img => !isBackgroundImage(img))
    if (contentImages.length > 0) {
      const availableWidth = LAYOUT.contentWidth
      const availableHeight = 7.0 - tableEndY - 0.3  // Leave margin at bottom

      if (contentImages.length === 1) {
        // Single image - center it
        const imgPath = resolveImagePath(contentImages[0].path)
        if (imgPath) {
          const imgLayout = getImageLayout(imgPath, availableWidth, availableHeight, LAYOUT.contentLeft, tableEndY)
          if (imgLayout) {
            addSlideImage(slide,{ path: imgPath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
          }
        }
      } else {
        // Multiple images - arrange horizontally
        const imgWidth = (availableWidth - (contentImages.length - 1) * 0.3) / contentImages.length
        let imgX = LAYOUT.contentLeft

        for (const img of contentImages) {
          const imgPath = resolveImagePath(img.path)
          if (imgPath) {
            const imgLayout = getImageLayout(imgPath, imgWidth, availableHeight, imgX, tableEndY)
            if (imgLayout) {
              addSlideImage(slide,{ path: imgPath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
            }
            imgX += imgWidth + 0.3
          }
        }
      }
    }
  }

  addFooterBar(slide)
}

function buildTwoColumnSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  const title = data.headers[0]?.text || ''
  const titleBottom = title ? addHeaderBar(slide, title) : 1.6

  if (!data.columns) return

  let contentTop = titleBottom

  // --- Render content BEFORE the columns div (intro text) ---
  // Find text in raw markdown that appears before the columns div
  const colDivPattern = /<div\s+class="(?:columns|split|output-layout|panel-layout|columns-text-left|columns-image-right)/
  const colDivIndex = data.raw.search(colDivPattern)
  if (colDivIndex > 0) {
    // Extract text between h2 heading and columns div
    const beforeCols = data.raw.substring(0, colDivIndex)
    const introLines: string[] = []
    for (const line of beforeCols.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed) continue
      if (trimmed.startsWith('#')) continue
      if (trimmed.startsWith('---')) continue
      if (trimmed.startsWith('<!--')) continue
      if (trimmed.startsWith('<')) continue
      if (trimmed.startsWith('marp:') || trimmed.startsWith('theme:') || trimmed.startsWith('paginate:')) continue
      introLines.push(trimmed)
    }
    if (introLines.length > 0) {
      const introText = introLines.map(l => cleanMarkdownText(l)).join(' ')
      const runs = parseInlineFormatting(introText, {
        fontSize: FONTS.bodySize,
        fontFace: FONTS.family,
        color: COLORS.textDark,
      })
      slide.addText(runs, {
        x: LAYOUT.marginLeft, y: contentTop,
        w: LAYOUT.contentWidth, h: 0.6,
        valign: 'top',
        paraSpaceAfter: 6,
      })
      contentTop += 0.65
    }
  }

  // --- Render content AFTER the columns div (quotes, notes) ---
  // Find text after the last </div> that closes the columns
  const colsEndPattern = /<\/div>\s*<\/div>\s*(?:<\/div>)?\s*$/m
  const afterColsMatch = data.raw.match(/<\/div>\s*<\/div>\s*(?:<\/div>)?\s*\n+([\s\S]+?)(?:<!--|$)/)
  let afterColsText = ''
  if (afterColsMatch) {
    const afterLines: string[] = []
    for (const line of afterColsMatch[1].split('\n')) {
      let trimmed = line.trim()
      if (!trimmed) continue
      if (trimmed.startsWith('<')) continue
      // Strip blockquote prefix
      trimmed = trimmed.replace(/^>\s*/, '')
      if (!trimmed) continue
      afterLines.push(trimmed)
    }
    if (afterLines.length > 0) {
      afterColsText = afterLines.map(l => cleanMarkdownText(l)).join('\n')
    }
  }

  // Determine column widths based on layout class
  // output-layout: 60/40 split (viz takes more space)
  // columns-text-left: 60/40 split (text takes more space)
  // columns-image-right: 40/60 split (image takes more space)
  // default: 50/50 split
  const isOutputLayout = data.raw.includes('class="output-layout"')
  const isImageRight = data.raw.includes('class="columns-image-right"')
  const isTextLeft = data.raw.includes('class="columns-text-left"')
  const leftColWidth = isOutputLayout ? 6.8 : isTextLeft ? 6.8 : isImageRight ? 4.5 : 5.5
  const rightColStart = LAYOUT.marginLeft + leftColWidth + 0.5
  const rightColWidth = LAYOUT.contentWidth - leftColWidth - 0.5

  // Parse column content into text items (bullets, paragraphs, headers, table rows)
  interface ColumnContent {
    type: 'bullet' | 'paragraph' | 'header' | 'table_row'
    text: string
    level?: number
    cells?: string[]
    isHeader?: boolean
  }
  function parseColumnContent(content: string): ColumnContent[] {
    const items: ColumnContent[] = []
    const lines = content.split('\n')
    let tableRowIndex = 0
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) { tableRowIndex = 0; continue }

      // Skip HTML tags like <div>, </div>, <br/> etc
      if (/^<\/?[\w]+[^>]*>$/.test(trimmed)) continue
      if (trimmed === '<br/>' || trimmed === '<br>') continue

      // Skip images
      if (trimmed.startsWith('![')) continue
      if (trimmed.startsWith('<img')) continue

      // Table rows (pipe-delimited)
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        // Skip separator line (|---|---|)
        if (/^\|[\s\-:|]+\|$/.test(trimmed)) { tableRowIndex++; continue }
        const cells = trimmed.replace(/^\||\|$/g, '').split('|').map(c => cleanMarkdownText(c.trim()))
        items.push({ type: 'table_row', text: '', cells, isHeader: tableRowIndex === 0 })
        tableRowIndex++
        continue
      }

      tableRowIndex = 0

      // Check for headers (### Header)
      const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
      if (headerMatch) {
        items.push({ type: 'header', text: cleanMarkdownText(headerMatch[2]), level: headerMatch[1].length })
        continue
      }

      // Check for bold-only line (acts as sub-header)
      const boldMatch = trimmed.match(/^\*\*(.+)\*\*$/)
      if (boldMatch) {
        items.push({ type: 'header', text: cleanMarkdownText(boldMatch[1]), level: 4 })
        continue
      }

      // Check for bullets
      const bulletMatch = trimmed.match(/^[-*•◦▪►▸‣⁃]\s+(.+)$/)
      if (bulletMatch) {
        items.push({ type: 'bullet', text: cleanMarkdownText(bulletMatch[1]) })
        continue
      }

      // Check for numbered list
      const numMatch = trimmed.match(/^\d+\.\s+(.+)$/)
      if (numMatch) {
        items.push({ type: 'bullet', text: cleanMarkdownText(numMatch[1]) })
        continue
      }

      // Plain paragraph text
      items.push({ type: 'paragraph', text: cleanMarkdownText(trimmed) })
    }
    return items
  }

  // Legacy function for backward compatibility
  function parseColumnBullets(content: string): string[] {
    return parseColumnContent(content)
      .filter(item => item.type === 'bullet')
      .map(item => item.text)
  }

  // Check for images
  const leftHasImage = /!\[/.test(data.columns.left) || /<img/.test(data.columns.left)
  const rightHasImage = /!\[/.test(data.columns.right) || /<img/.test(data.columns.right)

  // Helper to render column content (bullets, paragraphs, headers, tables)
  function renderColumnContent(columnContent: string, x: number, y: number, w: number): void {
    const items = parseColumnContent(columnContent)
    if (items.length === 0) return

    // Separate table rows from other content
    const tableRows: ColumnContent[] = []
    const textItems: PptxGenJS.TextProps[] = []
    let currentY = y

    for (const item of items) {
      if (item.type === 'table_row') {
        tableRows.push(item)
        continue
      }

      // If we accumulated table rows, render the table first
      if (tableRows.length > 0) {
        const tableData = tableRows.map(row => {
          return (row.cells || []).map(cell => ({
            text: cell,
            options: {
              fontSize: FONTS.tableSize,
              fontFace: FONTS.family,
              color: row.isHeader ? COLORS.white : COLORS.textDark,
              bold: row.isHeader,
            } as PptxGenJS.TextPropsOptions,
          }))
        })
        if (textItems.length > 0) {
          slide.addText(textItems.splice(0), { x, y: currentY, w, h: 1.5, valign: 'top' })
          currentY += 1.5
        }
        slide.addTable(tableData, {
          x, y: currentY, w,
          fontSize: FONTS.tableSize,
          border: TABLE_BORDER,
          colW: Array(tableData[0]?.length || 2).fill(w / (tableData[0]?.length || 2)),
          rowH: 0.35,
          autoPage: false,
        })
        currentY += (tableRows.length + 0.5) * 0.35
        tableRows.length = 0
      }

      if (item.type === 'header') {
        textItems.push({
          text: item.text,
          options: {
            fontSize: item.level === 4 ? FONTS.bodySize : FONTS.h3Size,
            fontFace: FONTS.family,
            color: item.level === 4 ? COLORS.darkGreen : COLORS.darkGreen,
            bold: true,
            breakLine: true,
            paraSpaceAfter: 8,
          },
        })
      } else if (item.type === 'bullet') {
        textItems.push({
          text: item.text,
          options: {
            fontSize: FONTS.bodySize,
            fontFace: FONTS.family,
            color: COLORS.textDark,
            bullet: true,
            breakLine: true,
            paraSpaceAfter: 6,
          },
        })
      } else if (item.type === 'paragraph') {
        const baseOptions = {
          fontSize: FONTS.bodySize,
          fontFace: FONTS.family,
          color: COLORS.textDark,
          paraSpaceAfter: 10,
        }
        const runs = parseInlineFormatting(item.text, baseOptions)
        textItems.push(...runs)
      }
    }

    // Render any remaining table rows
    if (tableRows.length > 0) {
      if (textItems.length > 0) {
        slide.addText(textItems.splice(0), { x, y: currentY, w, h: 1.5, valign: 'top' })
        currentY += 1.5
      }
      const tableData = tableRows.map(row => {
        return (row.cells || []).map(cell => ({
          text: cell,
          options: {
            fontSize: FONTS.tableSize,
            fontFace: FONTS.family,
            color: row.isHeader ? COLORS.white : COLORS.textDark,
            bold: row.isHeader,
          } as PptxGenJS.TextPropsOptions,
        }))
      })
      slide.addTable(tableData, {
        x, y: currentY, w,
        fontSize: FONTS.tableSize,
        border: TABLE_BORDER,
        colW: Array(tableData[0]?.length || 2).fill(w / (tableData[0]?.length || 2)),
        rowH: 0.35,
        autoPage: false,
      })
      currentY += (tableRows.length + 0.5) * 0.35
    }

    // Render remaining text items
    if (textItems.length > 0) {
      slide.addText(textItems, {
        x, y: currentY, w, h: 5,
        valign: 'top',
        fit: 'shrink',
      })
    }
  }

  // Left column
  if (leftHasImage) {
    const imgMatch = data.columns.left.match(/!\[[^\]]*\]\(([^)]+)\)/)
    if (imgMatch) {
      const imgPath = resolveImagePath(imgMatch[1].split(/\s/)[0])
      if (imgPath) {
        const imgLayout = getImageLayout(imgPath, leftColWidth, 5, LAYOUT.marginLeft, contentTop)
        if (imgLayout) {
          addSlideImage(slide,{ path: imgPath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
        } else {
          addSlideImage(slide,{ path: imgPath, x: LAYOUT.marginLeft, y: contentTop, w: leftColWidth })
        }
      }
    }
  } else {
    renderColumnContent(data.columns.left, LAYOUT.marginLeft, contentTop, leftColWidth)
  }

  // Right column
  if (rightHasImage) {
    const imgMatch = data.columns.right.match(/!\[[^\]]*\]\(([^)]+)\)/)
    if (imgMatch) {
      const imgPath = resolveImagePath(imgMatch[1].split(/\s/)[0])
      if (imgPath) {
        const imgLayout = getImageLayout(imgPath, rightColWidth, 5, rightColStart, contentTop)
        if (imgLayout) {
          addSlideImage(slide,{ path: imgPath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
        } else {
          addSlideImage(slide,{ path: imgPath, x: rightColStart, y: contentTop, w: rightColWidth })
        }
      }
    }
  } else {
    renderColumnContent(data.columns.right, rightColStart, contentTop, rightColWidth)
  }

  // --- Render after-columns content (quotes, notes, footnotes) ---
  if (afterColsText) {
    const isQuote = data.raw.includes('> "') || data.raw.includes('> *"') || data.raw.includes('> —')
    const runs = parseInlineFormatting(afterColsText, {
      fontSize: isQuote ? FONTS.smallSize + 2 : FONTS.bodySize - 2,
      fontFace: FONTS.family,
      color: isQuote ? COLORS.darkGreen : COLORS.textDark,
      italic: isQuote,
    })
    slide.addText(runs, {
      x: LAYOUT.marginLeft,
      y: 6.0,
      w: LAYOUT.contentWidth,
      h: 1.2,
      valign: 'top',
    })
  }

  addFooterBar(slide)
}

function buildImageSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  const title = data.headers[0]?.text || ''
  const imgTop = title ? addHeaderBar(slide, title) : 1.5

  // Find the main image
  let mainImgPath: string | null = null
  for (const img of data.images) {
    if (isIconImage(img)) continue
    mainImgPath = resolveImagePath(img.path)
    if (mainImgPath) break
  }

  if (!mainImgPath) {
    addFooterBar(slide)
    return
  }

  // Get smart layout based on actual image dimensions
  const hasTextContent = data.content.length > 0

  if (hasTextContent) {
    // Try to figure out optimal layout based on image aspect ratio
    const imgLayout = getImageLayout(mainImgPath, 6.5, 5.2, 6.3, 1.5)
    const isWideImage = imgLayout ? imgLayout.isLandscape && imgLayout.aspectRatio > 1.5 : false

    if (isWideImage) {
      // Wide image: stack vertically - text on top, image below
      const textItems: PptxGenJS.TextProps[] = []
      for (const item of data.content) {
        if (item.type === 'header' && item.level) {
          textItems.push({
            text: cleanMarkdownText(item.text),
            options: {
              fontSize: FONTS.h3Size,
              fontFace: FONTS.family,
              color: COLORS.darkGreen,
              bold: true,
              breakLine: true,
              paraSpaceAfter: 6,
            },
          })
        } else if (item.type === 'bullet') {
          textItems.push({
            text: cleanMarkdownText(item.text),
            options: {
              fontSize: FONTS.bodySize - 2,
              fontFace: FONTS.family,
              color: COLORS.textDark,
              bullet: true,
              breakLine: true,
              paraSpaceAfter: 4,
            },
          })
        } else if (item.type === 'paragraph') {
          const baseOptions = {
            fontSize: FONTS.bodySize - 2,
            fontFace: FONTS.family,
            color: COLORS.darkGray,
            paraSpaceAfter: 6,
          }
          const runs = parseInlineFormatting(item.text, baseOptions)
          textItems.push(...runs)
        }
      }

      if (textItems.length > 0) {
        slide.addText(textItems, {
          x: LAYOUT.contentLeft,
          y: imgTop,
          w: LAYOUT.contentWidth,
          h: 2,
          valign: 'top',
          fit: 'shrink',
        })
      }

      // Wide image below text - calculate proper size
      const wideLayout = getImageLayout(mainImgPath, 11, 3.8, 1.15, 3.5)
      if (wideLayout) {
        addSlideImage(slide,{ path: mainImgPath, x: wideLayout.x, y: wideLayout.y, w: wideLayout.w, h: wideLayout.h })
      } else {
        addSlideImage(slide,{ path: mainImgPath, x: 1.15, y: 3.5, w: 11 })
      }
    } else {
      // Normal/tall image: side by side - text left, image right
      const textItems: PptxGenJS.TextProps[] = []
      for (const item of data.content) {
        if (item.type === 'header' && item.level) {
          textItems.push({
            text: cleanMarkdownText(item.text),
            options: {
              fontSize: FONTS.h3Size,
              fontFace: FONTS.family,
              color: COLORS.darkGreen,
              bold: true,
              breakLine: true,
              paraSpaceAfter: 10,
            },
          })
        } else if (item.type === 'bullet') {
          textItems.push({
            text: cleanMarkdownText(item.text),
            options: {
              fontSize: FONTS.bodySize,
              fontFace: FONTS.family,
              color: COLORS.textDark,
              bullet: true,
              breakLine: true,
              paraSpaceAfter: 8,
            },
          })
        } else if (item.type === 'paragraph') {
          const baseOptions = {
            fontSize: FONTS.bodySize,
            fontFace: FONTS.family,
            color: COLORS.darkGray,
            paraSpaceAfter: 14,
          }
          const runs = parseInlineFormatting(item.text, baseOptions)
          textItems.push(...runs)
        }
      }

      if (textItems.length > 0) {
        slide.addText(textItems, {
          x: LAYOUT.contentLeft,
          y: imgTop,
          w: 5.5,
          h: 5.5,
          valign: 'top',
          fit: 'shrink',
        })
      }

      // Image on right - smart sized
      if (imgLayout) {
        addSlideImage(slide,{ path: mainImgPath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
      } else {
        addSlideImage(slide,{ path: mainImgPath, x: 6.3, y: 1.6, w: 6.5 })
      }
    }
  } else {
    // No text - center the image with smart sizing
    const centerLayout = getImageLayout(mainImgPath, 11, 5.5, 1.15, 1.5)
    if (centerLayout) {
      addSlideImage(slide,{ path: mainImgPath, x: centerLayout.x, y: centerLayout.y, w: centerLayout.w, h: centerLayout.h })
    } else {
      addSlideImage(slide,{ path: mainImgPath, x: 1.5, y: 1.6, w: 10 })
    }
  }

  addFooterBar(slide)
}

function buildContentSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  const title = data.headers[0]?.text || ''
  const titleBottom = title ? addHeaderBar(slide, title) : 1.5

  // Separate decorative icons from content images
  const decorativeIcon = data.images.find(img => !isBackgroundImage(img) && isDecorativeIcon(img))
  const contentImages = data.images.filter(img => !isBackgroundImage(img) && !isDecorativeIcon(img))
  const hasContentImage = contentImages.length > 0

  // Calculate layout based on what we have
  let contentWidth = LAYOUT.contentWidth
  let contentTop = titleBottom
  let iconRendered = false

  // If we have a decorative icon, render it below the title
  if (decorativeIcon) {
    const iconPath = resolveImagePath(decorativeIcon.path)
    if (iconPath) {
      // Extract width or height from alt text (w:120, h:40, etc)
      const widthMatch = decorativeIcon.alt.match(/w:(\d+)/)
      const heightMatch = decorativeIcon.alt.match(/h:(\d+)/)

      // Convert pixels to inches (96 dpi)
      const iconWidth = widthMatch ? parseInt(widthMatch[1]) / 96 : undefined
      const iconHeight = heightMatch ? parseInt(heightMatch[1]) / 96 : undefined

      // Check if slide has text content - if so, left-align icon with text
      const hasTextContent = data.content.length > 0

      // Build image options - only set dimensions that are specified to maintain
      // aspect ratio. Anchor below the actual title (titleBottom), not a fixed Y,
      // so 2-line titles don't overlap the icon.
      const imgOpts: any = { path: iconPath, y: titleBottom }

      // Determine icon size
      let iconSize = 1.0  // default
      if (iconWidth && iconHeight) {
        imgOpts.w = iconWidth
        imgOpts.h = iconHeight
        iconSize = iconHeight
      } else if (iconWidth) {
        imgOpts.w = iconWidth
        iconSize = iconWidth
      } else if (iconHeight) {
        imgOpts.h = iconHeight
        iconSize = iconHeight
      } else {
        imgOpts.w = 1.0
      }

      // Position: left-aligned with text if there's content, otherwise centered
      if (hasTextContent) {
        imgOpts.x = LAYOUT.contentLeft
      } else {
        imgOpts.x = (LAYOUT.width - (iconWidth || iconHeight || 1.0)) / 2
      }

      contentTop = titleBottom + iconSize + 0.3
      addSlideImage(slide,imgOpts)
      iconRendered = true
    }
  }

  // Check if content image is wide - if so, use vertical layout instead of side-by-side
  let useVerticalLayout = false
  let contentImagePath: string | null = null
  let contentImageLayout: ImageLayout | null = null

  if (hasContentImage) {
    for (const img of contentImages) {
      contentImagePath = resolveImagePath(img.path)
      if (contentImagePath) {
        contentImageLayout = getImageLayout(contentImagePath, 11, 4, 1, 1)
        // Use vertical layout if image is wide (aspect ratio > 1.5)
        if (contentImageLayout && contentImageLayout.aspectRatio > 1.5) {
          useVerticalLayout = true
        }
        break
      }
    }
    // Only narrow content width for side-by-side layout
    if (!useVerticalLayout) {
      contentWidth = 6
    }
  }

  // Build content text
  const textItems: PptxGenJS.TextProps[] = []

  for (const item of data.content) {
    if (item.type === 'header' && item.level) {
      textItems.push({
        text: cleanMarkdownText(item.text),
        options: {
          fontSize: FONTS.h3Size,
          fontFace: FONTS.family,
          color: COLORS.darkGreen,
          bold: true,
          breakLine: true,
          paraSpaceAfter: 10,
        },
      })
    } else if (item.type === 'bullet') {
      textItems.push({
        text: cleanMarkdownText(item.text),
        options: {
          fontSize: FONTS.bodySize,
          fontFace: FONTS.family,
          color: COLORS.textDark,
          bullet: true,
          breakLine: true,
          paraSpaceAfter: 8,
        },
      })
    } else if (item.type === 'paragraph') {
      // Parse inline bold formatting
      const baseOptions = {
        fontSize: FONTS.bodySize,
        fontFace: FONTS.family,
        color: COLORS.darkGray,
        paraSpaceAfter: 14,
      }
      const runs = parseInlineFormatting(item.text, baseOptions)
      textItems.push(...runs)
    }
  }

  if (textItems.length > 0) {
    // Only center text if we have an icon AND very minimal content (1-2 simple paragraphs, no bullets/headers)
    const hasBullets = data.bullets.length > 0 || data.content.some(c => c.type === 'bullet' || c.type === 'header')
    const hasMultipleParagraphs = data.paragraphs.length > 2
    const hasInlineBold = data.paragraphs.some(p => /\*\*[^*]+\*\*/.test(p))
    const shouldCenter = iconRendered && !hasContentImage && !hasBullets && !hasMultipleParagraphs && !hasInlineBold
    const textAlign = shouldCenter ? 'center' : undefined

    // Calculate text height based on layout
    let textHeight = 5.5 - (contentTop - 1.5)
    if (useVerticalLayout && contentImageLayout) {
      // For vertical layout, limit text height to leave room for image below
      textHeight = Math.min(2.5, textHeight)
    }

    slide.addText(textItems, {
      x: LAYOUT.contentLeft,
      y: contentTop,
      w: contentWidth,
      h: textHeight,
      valign: 'top',
      align: textAlign,
      fit: 'shrink',
    })
  }

  // Add content image if present (not decorative icons) - smart sized based on actual dimensions
  if (hasContentImage && contentImagePath) {
    if (useVerticalLayout && contentImageLayout) {
      // Vertical layout: image below text, centered, using full width
      const imgLayout = getImageLayout(contentImagePath, 11, 3.5, 1.15, 3.8)
      if (imgLayout) {
        addSlideImage(slide,{ path: contentImagePath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
      } else {
        addSlideImage(slide,{ path: contentImagePath, x: 1.15, y: 3.8, w: 11 })
      }
    } else {
      // Side-by-side layout: image on right
      const imgLayout = getImageLayout(contentImagePath, 6, 5, 6.5, 1.6)
      if (imgLayout) {
        addSlideImage(slide,{ path: contentImagePath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
      } else {
        addSlideImage(slide,{ path: contentImagePath, x: 6.5, y: 1.8, w: 6 })
      }
    }
  }

  addFooterBar(slide)
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

export async function generatePPTX(
  markdown: string,
  config: WorkshopConfig,
  outputPath: string
): Promise<{ warnings: string[] }> {
  buildWarnings = []
  const pptx = new PptxGenJS()

  // Set presentation properties
  pptx.author = config.workshop.facilitators || 'FASTR Team'
  pptx.title = config.workshop.name || 'FASTR Workshop'
  pptx.subject = 'FASTR Workshop Presentation'
  pptx.company = 'Global Financing Facility'

  // Set slide size (16:9)
  pptx.defineLayout({ name: 'FASTR', width: LAYOUT.width, height: LAYOUT.height })
  pptx.layout = 'FASTR'

  // Parse markdown
  const slides = parseMarkdown(markdown)

  // Build slides
  const builders: Record<SlideType, (pptx: PptxGenJS, data: ParsedSlide) => void> = {
    title: buildTitleSlide,
    agenda: buildAgendaSlide,
    break: buildBreakSlide,
    section: buildSectionSlide,
    two_column: buildTwoColumnSlide,
    table: buildTableSlide,
    image: buildImageSlide,
    content: buildContentSlide,
  }

  const typeCounts: Record<string, number> = {}

  let pageNum = 0
  for (let i = 0; i < slides.length; i++) {
    const slideType = detectSlideType(slides[i], i)
    typeCounts[slideType] = (typeCounts[slideType] || 0) + 1

    try {
      builders[slideType](pptx, slides[i])

      const pptxSlides = (pptx as any).slides as PptxGenJS.Slide[]
      const currentSlide = pptxSlides[pptxSlides.length - 1]

      // Slide chrome (kicker · locator · footer · page number); content slides only.
      const cls = slides[i].cssClass
      if (!(cls && CHROME_BARE.has(cls))) pageNum++
      addChrome(currentSlide, slides[i], pageNum)

      // Activity-pointer slides get the dot-grid background — mirrors the
      // .activity-pointer style in fastr-theme.css so PPT exports carry the
      // workbook-page look instead of falling back to plain white.
      //
      // We read the PNG to base64 and pass it as `{ data: 'data:image/png;base64,...' }`
      // rather than `{ path }` — the path form writes a brittle slide-relationship XML
      // that PowerPoint sometimes flags as "needs repair". The data form embeds the
      // bytes directly with no relationship.
      if (cls === 'activity-pointer') {
        try {
          const dotGridPath = path.join(REPO_ROOT, 'resources', 'backgrounds', 'activity_dotgrid.png')
          if (fs.existsSync(dotGridPath)) {
            const b64 = fs.readFileSync(dotGridPath).toString('base64')
            currentSlide.background = { data: `data:image/png;base64,${b64}` }
          }
        } catch (e) {
          // If anything goes wrong, leave the builder's default background in place.
          console.warn('activity-pointer dot-grid background failed:', e)
        }
      }

      // Add presenter notes to the slide if present
      if (slides[i].presenterNotes) currentSlide.addNotes(slides[i].presenterNotes!)
    } catch (e) {
      console.warn(`Error building slide ${i + 1} (${slideType}):`, e)
      try {
        buildContentSlide(pptx, slides[i])
      } catch {
        // Skip slide
      }
    }
  }

  // Save
  await pptx.writeFile({ fileName: outputPath })

  return { warnings: buildWarnings }
}
