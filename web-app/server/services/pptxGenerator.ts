import PptxGenJS from 'pptxgenjs'
import { WorkshopConfig } from '../db/database.js'

// FASTR brand colors
const COLORS = {
  primary: '1B365D',      // Dark blue
  secondary: '00A9CE',    // Teal
  accent: 'F7941D',       // Orange
  light: 'E8F4F8',        // Light blue
  text: '333333',         // Dark gray
  white: 'FFFFFF',
}

interface ParsedSlide {
  type: 'title' | 'content' | 'section' | 'break'
  title?: string
  subtitle?: string
  bullets?: string[]
  content?: string
}

/**
 * Generate PPTX from markdown content
 */
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

  // Set default slide size (16:9)
  pptx.defineLayout({ name: 'FASTR', width: 13.33, height: 7.5 })
  pptx.layout = 'FASTR'

  // Parse markdown into slides
  const slides = parseMarkdownSlides(markdown)

  // Create slides
  for (const slideData of slides) {
    createSlide(pptx, slideData)
  }

  // Save the file
  await pptx.writeFile({ fileName: outputPath })
  console.log('PPTX generated:', outputPath)
}

/**
 * Parse markdown content into slide objects
 */
function parseMarkdownSlides(markdown: string): ParsedSlide[] {
  const slides: ParsedSlide[] = []

  // Split by slide separator
  const rawSlides = markdown.split(/^---$/m).filter(s => {
    const trimmed = s.trim()
    return trimmed && !trimmed.startsWith('marp:') && !trimmed.startsWith('theme:')
  })

  for (const raw of rawSlides) {
    const slide = parseSlide(raw.trim())
    if (slide) {
      slides.push(slide)
    }
  }

  return slides
}

/**
 * Parse a single slide's markdown content
 */
function parseSlide(content: string): ParsedSlide | null {
  if (!content) return null

  // Check for section/cover slides
  if (content.includes('_class: section-cover') || content.includes('_class: break')) {
    const titleMatch = content.match(/^#\s+(.+)$/m)
    const isBreak = content.includes('break') || content.toLowerCase().includes('tea') || content.toLowerCase().includes('lunch')

    return {
      type: isBreak ? 'break' : 'section',
      title: titleMatch ? titleMatch[1].replace(/[🍽️☕]/g, '').trim() : 'Section',
    }
  }

  // Check for title slide (# without ##)
  const h1Match = content.match(/^#\s+(.+)$/m)
  const h2Match = content.match(/^##\s+(.+)$/m)

  if (h1Match && !h2Match) {
    // Title slide
    const subtitleMatch = content.match(/\*\*(.+?)\*\*/m)
    return {
      type: 'title',
      title: h1Match[1].trim(),
      subtitle: subtitleMatch ? subtitleMatch[1].trim() : undefined,
    }
  }

  // Content slide
  const title = h2Match ? h2Match[1].trim() : h1Match ? h1Match[1].trim() : 'Slide'

  // Extract bullet points
  const bullets: string[] = []
  const bulletMatches = content.matchAll(/^[-*]\s+(.+)$/gm)
  for (const match of bulletMatches) {
    bullets.push(match[1].trim())
  }

  // Extract any paragraph text
  const paragraphs = content
    .replace(/^#.*$/gm, '')
    .replace(/^[-*].*$/gm, '')
    .replace(/<!--.*?-->/gs, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .split('\n')
    .filter(line => line.trim())
    .join('\n')
    .trim()

  return {
    type: 'content',
    title: title,
    bullets: bullets.length > 0 ? bullets : undefined,
    content: paragraphs || undefined,
  }
}

/**
 * Create a PowerPoint slide from parsed data
 */
function createSlide(pptx: PptxGenJS, data: ParsedSlide): void {
  const slide = pptx.addSlide()

  switch (data.type) {
    case 'title':
      createTitleSlide(slide, data)
      break
    case 'section':
      createSectionSlide(slide, data)
      break
    case 'break':
      createBreakSlide(slide, data)
      break
    case 'content':
    default:
      createContentSlide(slide, data)
      break
  }
}

/**
 * Create a title/cover slide
 */
function createTitleSlide(slide: PptxGenJS.Slide, data: ParsedSlide): void {
  // Background color
  slide.background = { color: COLORS.primary }

  // Title
  slide.addText(data.title || 'FASTR Workshop', {
    x: 0.5,
    y: 2.5,
    w: 12.33,
    h: 1.5,
    fontSize: 44,
    fontFace: 'Arial',
    color: COLORS.white,
    bold: true,
    align: 'center',
  })

  // Subtitle
  if (data.subtitle) {
    slide.addText(data.subtitle, {
      x: 0.5,
      y: 4.2,
      w: 12.33,
      h: 0.8,
      fontSize: 24,
      fontFace: 'Arial',
      color: COLORS.secondary,
      align: 'center',
    })
  }
}

/**
 * Create a section divider slide
 */
function createSectionSlide(slide: PptxGenJS.Slide, data: ParsedSlide): void {
  slide.background = { color: COLORS.primary }

  slide.addText(data.title || 'Section', {
    x: 0.5,
    y: 3,
    w: 12.33,
    h: 1.5,
    fontSize: 40,
    fontFace: 'Arial',
    color: COLORS.white,
    bold: true,
    align: 'center',
  })
}

/**
 * Create a break slide
 */
function createBreakSlide(slide: PptxGenJS.Slide, data: ParsedSlide): void {
  slide.background = { color: COLORS.light }

  const isLunch = data.title?.toLowerCase().includes('lunch')

  slide.addText(isLunch ? '🍽️' : '☕', {
    x: 5.66,
    y: 2,
    w: 2,
    h: 1.5,
    fontSize: 72,
    align: 'center',
  })

  slide.addText(data.title || 'Break', {
    x: 0.5,
    y: 3.5,
    w: 12.33,
    h: 1,
    fontSize: 36,
    fontFace: 'Arial',
    color: COLORS.primary,
    bold: true,
    align: 'center',
  })
}

/**
 * Create a content slide
 */
function createContentSlide(slide: PptxGenJS.Slide, data: ParsedSlide): void {
  // White background
  slide.background = { color: COLORS.white }

  // Header bar
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0,
    y: 0,
    w: 13.33,
    h: 1.2,
    fill: { color: COLORS.primary },
  })

  // Title in header
  slide.addText(data.title || 'Slide', {
    x: 0.5,
    y: 0.3,
    w: 12.33,
    h: 0.7,
    fontSize: 28,
    fontFace: 'Arial',
    color: COLORS.white,
    bold: true,
  })

  // Bullets or content
  let yPos = 1.6

  if (data.bullets && data.bullets.length > 0) {
    const bulletText = data.bullets.map(b => ({
      text: b,
      options: { bullet: true, indentLevel: 0 },
    }))

    slide.addText(bulletText, {
      x: 0.5,
      y: yPos,
      w: 12.33,
      h: 5,
      fontSize: 20,
      fontFace: 'Arial',
      color: COLORS.text,
      valign: 'top',
      bullet: { type: 'bullet' },
    })
  } else if (data.content) {
    slide.addText(data.content, {
      x: 0.5,
      y: yPos,
      w: 12.33,
      h: 5,
      fontSize: 18,
      fontFace: 'Arial',
      color: COLORS.text,
      valign: 'top',
    })
  }

  // Footer accent line
  slide.addShape('rect' as PptxGenJS.ShapeType, {
    x: 0,
    y: 7.3,
    w: 13.33,
    h: 0.2,
    fill: { color: COLORS.secondary },
  })
}
