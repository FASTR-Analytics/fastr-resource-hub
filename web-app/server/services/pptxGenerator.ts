import PptxGenJS from 'pptxgenjs'
import { WorkshopConfig } from '../db/database.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import imageSize from 'image-size'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REPO_ROOT = path.resolve(__dirname, '../../..')

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
}

const FONTS = {
  family: 'Calibri',
  h1Size: 32,
  h2Size: 26,
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
}

type SlideType = 'title' | 'agenda' | 'break' | 'section' | 'two_column' | 'table' | 'image' | 'content'

// ═══════════════════════════════════════════════════════════════════════════════
// MARKDOWN PARSER (ported from Python)
// ═══════════════════════════════════════════════════════════════════════════════

function parseMarkdown(content: string): ParsedSlide[] {
  // Strip YAML frontmatter
  const frontmatterMatch = content.match(/^---\n[\s\S]*?\n---\n?/)
  if (frontmatterMatch) {
    content = content.slice(frontmatterMatch[0].length)
  }

  // Strip style blocks
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')

  // Split into slides
  const rawSlides = content.split(/\n---\s*\n/)

  const slides: ParsedSlide[] = []

  for (let raw of rawSlides) {
    raw = raw.trim()
    if (!raw) continue

    const slide: ParsedSlide = {
      raw,
      headers: [],
      bullets: [],
      paragraphs: [],
      content: [],
      table: null,
      images: [],
      columns: null,
      cssClass: null,
    }

    // Extract CSS class directive
    const classMatch = raw.match(/<!--\s*_class:\s*(\w+)\s*-->/)
    if (classMatch) {
      slide.cssClass = classMatch[1]
      raw = raw.replace(/<!--\s*_class:\s*\w+\s*-->/, '')
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

    // Extract columns
    const colsMatch = raw.match(/<div\s+class="(?:columns|split)[^"]*">\s*<div[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*>([\s\S]*?)<\/div>\s*<\/div>/)
    if (colsMatch) {
      slide.columns = {
        left: colsMatch[1].trim(),
        right: colsMatch[2].trim(),
      }
    }

    // Extract content in order
    for (const line of lines) {
      const stripped = line.trim()
      if (!stripped) continue

      // H3+ headers in content flow
      const h3Match = stripped.match(/^(#{3,6})\s+(.+)$/)
      if (h3Match) {
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

      // Bullets
      const bulletMatch = stripped.match(/^[-*]\s+(.+)$/)
      if (bulletMatch) {
        slide.bullets.push(bulletMatch[1].trim())
        slide.content.push({ type: 'bullet', text: bulletMatch[1].trim() })
        continue
      }

      // Numbered list
      const numMatch = stripped.match(/^\d+\.\s+(.+)$/)
      if (numMatch) {
        slide.bullets.push(numMatch[1].trim())
        slide.content.push({ type: 'bullet', text: numMatch[1].trim() })
        continue
      }

      // Paragraph
      slide.paragraphs.push(stripped)
      slide.content.push({ type: 'paragraph', text: stripped })
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
  const breakEmojis = ['☕', '🍽', '🌙', '🎉', '👋', '⏰']
  if (breakEmojis.some(e => h1Text.includes(e))) return 'break'
  if (/\b(break|lunch|tea)\b/i.test(h1Text)) return 'break'

  // Section
  if (slide.cssClass === 'section-cover') return 'section'
  const nonIconImages = slide.images.filter(img => !isIconImage(img))
  const hasContent = slide.bullets.length > 0 || slide.paragraphs.length > 0 || nonIconImages.length > 0
  if (slide.headers[0]?.level === 1 && !hasContent) {
    if (/^Session\s+\d+/i.test(h1Text)) return 'section'
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

  const pathsToTry = [
    path.join(REPO_ROOT, imgPath.replace(/^\.\.\/+/, '')),
    path.join(REPO_ROOT, 'resources', 'logos', path.basename(imgPath)),
    path.join(REPO_ROOT, 'resources', 'diagrams', path.basename(imgPath)),
    path.join(REPO_ROOT, 'resources', 'backgrounds', path.basename(imgPath)),
  ]

  if (imgPath.startsWith('../')) {
    pathsToTry.unshift(path.join(REPO_ROOT, imgPath.replace(/^\.\.\//, '')))
  }

  for (const p of pathsToTry) {
    if (fs.existsSync(p)) {
      return p
    }
  }

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
  // Remove inline images (icons)
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, '')
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
  text = text.replace(/\*([^*]+)\*/g, '$1')
  text = text.replace(/`([^`]+)`/g, '$1')
  return text.trim()
}

// Check if an image is a background image (should be skipped in content)
function isBackgroundImage(img: { alt: string; path: string; height?: number }): boolean {
  return img.alt === 'bg'
}

// Check if an image is a decorative icon (should be rendered centered)
function isDecorativeIcon(img: { alt: string; path: string; height?: number }): boolean {
  // Has explicit width in alt text (w:120 etc)
  if (/w:\d+/.test(img.alt)) return true
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

function addHeaderBar(slide: PptxGenJS.Slide, title: string): void {
  // Title in FASTR teal
  slide.addText(cleanMarkdownText(title), {
    x: 0.5, y: 0.35, w: 12.33, h: 0.7,
    fontSize: FONTS.h2Size,
    fontFace: FONTS.family,
    color: COLORS.darkGreen,
    bold: true,
  })

  // Lime accent line - half width, under title
  slide.addShape('rect', {
    x: 0.5, y: 1.05, w: 6, h: 0.06,
    fill: { color: COLORS.lime },
    line: { color: COLORS.lime },
  })
}

function addFooterBar(slide: PptxGenJS.Slide): void {
  // No footer bar - clean design
}

function buildTitleSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()

  // Check for background image
  const bgMatch = data.raw.match(/!\[bg\]\(([^)]+)\)/)
  let hasBgImage = false

  if (bgMatch) {
    const bgPath = resolveImagePath(bgMatch[1].split(/\s/)[0])
    if (bgPath) {
      slide.addImage({ path: bgPath, x: 0, y: 0, w: LAYOUT.width, h: LAYOUT.height })
      hasBgImage = true
    }
  }

  if (!hasBgImage) {
    slide.background = { color: COLORS.deepGreen }
  }

  const title = data.headers[0]?.text || 'FASTR Workshop'
  const titleColor = hasBgImage ? COLORS.white : COLORS.white
  const titleTop = hasBgImage ? 2.8 : 2.2

  // Main title
  slide.addText(cleanMarkdownText(title), {
    x: 0.8, y: titleTop, w: 11.733, h: 1.4,
    fontSize: hasBgImage ? 24 : 28,
    fontFace: FONTS.family,
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

  // Date line
  const lines = data.raw.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#') && !l.startsWith('!') && !l.startsWith('<!--') && !l.startsWith('**'))
  const dateLine = lines.find(l => /\d/.test(l) && (/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i.test(l) || /\d{4}/.test(l)))
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
}

function buildSectionSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()

  // Check for background image
  const bgMatch = data.raw.match(/!\[bg\]\(([^)]+)\)/)
  let hasBgImage = false

  if (bgMatch) {
    const bgPath = resolveImagePath(bgMatch[1].split(/\s/)[0])
    if (bgPath) {
      slide.addImage({ path: bgPath, x: 0, y: 0, w: LAYOUT.width, h: LAYOUT.height })
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
    fontFace: FONTS.family,
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
      slide.addImage({ path: iconPath, x: iconX, y: 4.0, w: iconWidth })
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
  slide.background = { color: COLORS.darkGreen }  // FASTR teal

  const title = data.headers[0]?.text || 'Break'

  slide.addText(cleanMarkdownText(title), {
    x: 1, y: 2.8, w: 11.333, h: 1.5,
    fontSize: 56,
    fontFace: FONTS.family,
    color: COLORS.white,
    bold: true,
    align: 'center',
    valign: 'middle',
  })

  // Time info - extract duration and resume time
  const timeMatch = data.raw.match(/\*\*(\d+)\s*minutes?\*\*/i)
  const resumeMatch = data.raw.match(/resume at \*\*(\d{1,2}:\d{2})\*\*/i)

  const subtitleParts: string[] = []
  if (timeMatch) subtitleParts.push(`${timeMatch[1]} minutes`)
  if (resumeMatch) subtitleParts.push(`Back at ${resumeMatch[1]}`)

  if (subtitleParts.length > 0) {
    slide.addText(subtitleParts.join(' • '), {
      x: 1, y: 4.3, w: 11.333, h: 0.6,
      fontSize: FONTS.h2Size,
      fontFace: FONTS.family,
      color: COLORS.lime,
      align: 'center',
    })
  }
}

function buildAgendaSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  const title = data.headers[0]?.text || 'Workshop Agenda'
  addHeaderBar(slide, title)

  if (data.table && data.table.length > 0) {
    const rows = data.table.length

    const fontSize = rows > 10 ? FONTS.smallSize : FONTS.tableSize
    const rowHeight = rows > 10 ? 0.28 : 0.35

    // Build simple table - array of arrays of strings
    const tableRows: PptxGenJS.TableRow[] = data.table.map((row, rIdx) => {
      return row.map((cell) => {
        const cellObj: PptxGenJS.TableCell = {
          text: cleanMarkdownText(cell),
          options: {
            fontSize: fontSize,
            fontFace: FONTS.family,
            color: rIdx === 0 ? COLORS.navy : COLORS.textDark,
            bold: rIdx === 0,
            valign: 'middle',
          },
        }
        // Add fill for header row
        if (rIdx === 0) {
          cellObj.options!.fill = { color: COLORS.lightBlue }
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
      y: 1.5,
      w: LAYOUT.contentWidth,
      rowH: rowHeight,
      border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
      colW,
    })
  }

  addFooterBar(slide)
}

function buildTableSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  const title = data.headers[0]?.text || 'Table'
  addHeaderBar(slide, title)

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
          color: rIdx === 0 ? COLORS.navy : COLORS.textDark,
          bold: rIdx === 0,
          fill: rIdx === 0 ? { color: COLORS.lightBlue } : undefined,
        },
      }))
    })

    slide.addTable(tableData, {
      x: LAYOUT.contentLeft,
      y: 1.5,
      w: 12.3,
      rowH: rowHeight,
      border: { pt: 0.5, color: 'CCCCCC' },
    })
  }

  addFooterBar(slide)
}

function buildTwoColumnSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  const title = data.headers[0]?.text || ''
  if (title) {
    addHeaderBar(slide, title)
  }

  if (!data.columns) return

  const contentTop = 1.6

  // Parse column content into bullets
  function parseColumnBullets(content: string): string[] {
    const bullets: string[] = []
    const lines = content.split('\n')
    for (const line of lines) {
      const match = line.trim().match(/^[-*]\s+(.+)$/)
      if (match) {
        bullets.push(cleanMarkdownText(match[1]))
      }
    }
    return bullets
  }

  // Check for images
  const leftHasImage = /!\[/.test(data.columns.left) || /<img/.test(data.columns.left)
  const rightHasImage = /!\[/.test(data.columns.right) || /<img/.test(data.columns.right)

  // Left column
  if (leftHasImage) {
    const imgMatch = data.columns.left.match(/!\[[^\]]*\]\(([^)]+)\)/)
    if (imgMatch) {
      const imgPath = resolveImagePath(imgMatch[1].split(/\s/)[0])
      if (imgPath) {
        const imgLayout = getImageLayout(imgPath, 5.5, 5, LAYOUT.marginLeft, contentTop)
        if (imgLayout) {
          slide.addImage({ path: imgPath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
        } else {
          slide.addImage({ path: imgPath, x: LAYOUT.marginLeft, y: contentTop, w: 5.5 })
        }
      }
    }
  } else {
    const bullets = parseColumnBullets(data.columns.left)
    if (bullets.length > 0) {
      slide.addText(bullets.map(b => ({ text: b, options: { bullet: { type: 'bullet' } } })), {
        x: LAYOUT.marginLeft, y: contentTop, w: 5.5, h: 5,
        fontSize: FONTS.bodySize,
        fontFace: FONTS.family,
        color: COLORS.textDark,
        valign: 'top',
      })
    }
  }

  // Right column
  if (rightHasImage) {
    const imgMatch = data.columns.right.match(/!\[[^\]]*\]\(([^)]+)\)/)
    if (imgMatch) {
      const imgPath = resolveImagePath(imgMatch[1].split(/\s/)[0])
      if (imgPath) {
        const imgLayout = getImageLayout(imgPath, 5.5, 5, 7, contentTop)
        if (imgLayout) {
          slide.addImage({ path: imgPath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
        } else {
          slide.addImage({ path: imgPath, x: 7, y: contentTop, w: 5.5 })
        }
      }
    }
  } else {
    const bullets = parseColumnBullets(data.columns.right)
    if (bullets.length > 0) {
      slide.addText(bullets.map(b => ({ text: b, options: { bullet: { type: 'bullet' } } })), {
        x: 7, y: contentTop, w: 5.5, h: 5,
        fontSize: FONTS.bodySize,
        fontFace: FONTS.family,
        color: COLORS.textDark,
        valign: 'top',
      })
    }
  }

  addFooterBar(slide)
}

function buildImageSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  const title = data.headers[0]?.text || ''
  if (title) {
    addHeaderBar(slide, title)
  }

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
              color: COLORS.orchid,
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
              bullet: { type: 'bullet' },
              breakLine: true,
              paraSpaceAfter: 4,
            },
          })
        } else if (item.type === 'paragraph') {
          textItems.push({
            text: cleanMarkdownText(item.text),
            options: {
              fontSize: FONTS.bodySize - 2,
              fontFace: FONTS.family,
              color: COLORS.darkGray,
              breakLine: true,
              paraSpaceAfter: 6,
            },
          })
        }
      }

      if (textItems.length > 0) {
        slide.addText(textItems, {
          x: LAYOUT.contentLeft,
          y: 1.5,
          w: LAYOUT.contentWidth,
          h: 2,
          valign: 'top',
        })
      }

      // Wide image below text - calculate proper size
      const wideLayout = getImageLayout(mainImgPath, 11, 3.8, 1.15, 3.5)
      if (wideLayout) {
        slide.addImage({ path: mainImgPath, x: wideLayout.x, y: wideLayout.y, w: wideLayout.w, h: wideLayout.h })
      } else {
        slide.addImage({ path: mainImgPath, x: 1.15, y: 3.5, w: 11 })
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
              color: COLORS.orchid,
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
              bullet: { type: 'bullet' },
              breakLine: true,
              paraSpaceAfter: 8,
            },
          })
        } else if (item.type === 'paragraph') {
          textItems.push({
            text: cleanMarkdownText(item.text),
            options: {
              fontSize: FONTS.bodySize,
              fontFace: FONTS.family,
              color: COLORS.darkGray,
              breakLine: true,
              paraSpaceAfter: 14,
            },
          })
        }
      }

      if (textItems.length > 0) {
        slide.addText(textItems, {
          x: LAYOUT.contentLeft,
          y: 1.5,
          w: 5.5,
          h: 5.5,
          valign: 'top',
        })
      }

      // Image on right - smart sized
      if (imgLayout) {
        slide.addImage({ path: mainImgPath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
      } else {
        slide.addImage({ path: mainImgPath, x: 6.3, y: 1.6, w: 6.5 })
      }
    }
  } else {
    // No text - center the image with smart sizing
    const centerLayout = getImageLayout(mainImgPath, 11, 5.5, 1.15, 1.5)
    if (centerLayout) {
      slide.addImage({ path: mainImgPath, x: centerLayout.x, y: centerLayout.y, w: centerLayout.w, h: centerLayout.h })
    } else {
      slide.addImage({ path: mainImgPath, x: 1.5, y: 1.6, w: 10 })
    }
  }

  addFooterBar(slide)
}

function buildContentSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()
  slide.background = { color: COLORS.white }

  const title = data.headers[0]?.text || ''
  if (title) {
    addHeaderBar(slide, title)
  }

  // Check for non-icon images
  const hasImage = data.images.some(img => !isIconImage(img))
  const contentWidth = hasImage ? 6 : LAYOUT.contentWidth

  // Build content text
  const textItems: PptxGenJS.TextProps[] = []

  for (const item of data.content) {
    if (item.type === 'header' && item.level) {
      textItems.push({
        text: cleanMarkdownText(item.text),
        options: {
          fontSize: FONTS.h3Size,
          fontFace: FONTS.family,
          color: COLORS.orchid,
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
          bullet: { type: 'bullet' },
          breakLine: true,
          paraSpaceAfter: 8,
        },
      })
    } else if (item.type === 'paragraph') {
      textItems.push({
        text: cleanMarkdownText(item.text),
        options: {
          fontSize: FONTS.bodySize,
          fontFace: FONTS.family,
          color: COLORS.darkGray,
          breakLine: true,
          paraSpaceAfter: 14,
        },
      })
    }
  }

  if (textItems.length > 0) {
    slide.addText(textItems, {
      x: LAYOUT.contentLeft,
      y: 1.5,
      w: contentWidth,
      h: 5.5,
      valign: hasImage ? 'top' : 'middle',
    })
  }

  // Add image if present (skip icons) - smart sized based on actual dimensions
  if (hasImage) {
    for (const img of data.images) {
      if (isIconImage(img)) continue

      const imgPath = resolveImagePath(img.path)
      if (imgPath) {
        const imgLayout = getImageLayout(imgPath, 6, 5, 6.5, 1.6)
        if (imgLayout) {
          slide.addImage({ path: imgPath, x: imgLayout.x, y: imgLayout.y, w: imgLayout.w, h: imgLayout.h })
        } else {
          slide.addImage({ path: imgPath, x: 6.5, y: 1.8, w: 6 })
        }
        break
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
): Promise<void> {
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
  console.log(`Parsed ${slides.length} slides for PPTX`)

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

  for (let i = 0; i < slides.length; i++) {
    const slideType = detectSlideType(slides[i], i)
    typeCounts[slideType] = (typeCounts[slideType] || 0) + 1

    try {
      builders[slideType](pptx, slides[i])
    } catch (e) {
      console.warn(`Error building slide ${i + 1} (${slideType}):`, e)
      try {
        buildContentSlide(pptx, slides[i])
      } catch {
        // Skip slide
      }
    }
  }

  console.log('Slide types:', typeCounts)

  // Save
  await pptx.writeFile({ fileName: outputPath })
  console.log('PPTX generated:', outputPath)
}
