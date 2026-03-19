// Diagram template SVG generators for the FASTR Deck Builder
// Generates structured SVG diagrams from typed configuration objects

// ── Types ──────────────────────────────────────────────────────────────────

export interface StepperItem { title: string; description: string }
export interface ChevronItem { line1: string; line2?: string; color?: string; emoji?: string }
export interface CardItem { emoji: string; title: string; question?: string; body: string[]; footer?: string; color?: string }
export interface ComparisonSide { title: string; symbol?: string; quote?: string; items: string[]; footer?: string }
export interface FlowNode { emoji?: string; title: string; description: string[] }
export interface LayerItem { label: string; subtitle?: string; question?: string; frequency?: string; color?: string }
export interface HubSpoke { emoji?: string; label: string; description?: string }
export interface TimelineStep { title: string[]; description: string[]; color?: string }

export type DiagramRequest =
  | { template: 'stepper'; items: StepperItem[] }
  | { template: 'chevron'; items: ChevronItem[] }
  | { template: 'cards'; cards: CardItem[] }
  | { template: 'comparison'; left: ComparisonSide; right: ComparisonSide }
  | { template: 'flow'; nodes: FlowNode[] }
  | { template: 'layers'; layers: LayerItem[] }
  | { template: 'hub'; center: HubSpoke; spokes: HubSpoke[] }
  | { template: 'timeline'; steps: TimelineStep[] }

// ── Constants ──────────────────────────────────────────────────────────────

// FASTR brand palette
const BRAND = {
  deepGreen: '#09544F',
  darkGreen: '#0C716B',
  green: '#1F9A9C',
  lime: '#D0CB17',
  navy: '#21568C',
  blue: '#1A90C0',
  lightBlue: '#CAE6E9',
  gold: '#D8A822',
  purple: '#7A1F6E',
  orchid: '#BD5091',
  coral: '#FF6462',
  // Semantic aliases
  dark: '#09544F',
  medium: '#0C716B',
  light: '#1F9A9C',
  bg: '#E8F4F3',
  accent: '#CAE6E9',
  text: '#555',
  textLight: '#777',
  red: '#FF6462',
  redBg: '#FFF0F0',
  redAccent: '#FFD4D3',
}

const CHEVRON_COLORS = ['#09544F', '#0C716B', '#1F9A9C', '#1A90C0', '#21568C', '#D8A822', '#BD5091', '#7A1F6E']

const CARD_COLORS = ['#09544F', '#0C716B', '#1F9A9C', '#1A90C0', '#21568C', '#D8A822']

const TIMELINE_COLORS = ['#09544F', '#0C716B', '#1F9A9C', '#1A90C0', '#21568C', '#D8A822']

const LAYER_DEFAULT_COLORS = ['#09544F', '#0C716B', '#1F9A9C', '#CAE6E9', '#E8F4F3']

const CHEVRON_CIRCLE_STYLES: Record<string, { bg: string; stroke: string }> = {
  '#09544F': { bg: '#E8F4F3', stroke: '#CAE6E9' },
  '#0C716B': { bg: '#E6F5F0', stroke: '#B0DDD0' },
  '#1F9A9C': { bg: '#E4F5F5', stroke: '#B5E0E0' },
  '#1A90C0': { bg: '#E6F2FA', stroke: '#B0D8EE' },
  '#21568C': { bg: '#EBF0F7', stroke: '#C0D0E4' },
  '#D8A822': { bg: '#FBF6E6', stroke: '#EDD99A' },
  '#BD5091': { bg: '#F9ECF4', stroke: '#E4B5D3' },
  '#7A1F6E': { bg: '#F5EAF4', stroke: '#D4ADD0' },
}

const SHADOW_FILTER = '<defs><filter id="shadow"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-opacity="0.08"/></filter></defs>'

// ── Helpers ────────────────────────────────────────────────────────────────

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function getChevronCircleStyle(color: string): { bg: string; stroke: string } {
  return CHEVRON_CIRCLE_STYLES[color] || { bg: '#f0f0f0', stroke: '#d0d0d0' }
}

// ── 1. Stepper ─────────────────────────────────────────────────────────────

function generateStepper(items: StepperItem[]): string {
  if (!items || items.length === 0) {
    items = [{ title: 'Step 1', description: 'Description' }]
  }

  const H = items.length * 64 + 40
  const n = items.length

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${H}" font-family="Inter, Arial, sans-serif">\n`

  // Vertical connector line
  if (n > 1) {
    const y1 = 38 + 18
    const y2 = 38 + (n - 1) * 64 - 18
    svg += `  <line x1="30" y1="${y1}" x2="30" y2="${y2}" stroke="${BRAND.accent}" stroke-width="2"/>\n`
  }

  // Column divider
  svg += `  <line x1="260" y1="16" x2="260" y2="${H - 20}" stroke="${BRAND.bg}" stroke-width="1.5"/>\n`

  for (let i = 0; i < n; i++) {
    const item = items[i]
    const y = 38 + i * 64

    // Circle
    svg += `  <circle cx="30" cy="${y}" r="18" fill="${BRAND.dark}"/>\n`
    // Number
    svg += `  <text x="30" y="${y}" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="14" font-weight="bold">${i + 1}</text>\n`
    // Title
    svg += `  <text x="62" y="${y}" dominant-baseline="central" fill="${BRAND.dark}" font-size="14" font-weight="bold">${esc(item.title)}</text>\n`
    // Description
    svg += `  <text x="276" y="${y}" dominant-baseline="central" fill="${BRAND.text}" font-size="12.5">${esc(item.description)}</text>\n`
  }

  svg += '</svg>'
  return svg
}

// ── 2. Chevron ─────────────────────────────────────────────────────────────

function generateChevron(items: ChevronItem[]): string {
  if (!items || items.length === 0) {
    items = [{ line1: 'Step 1' }]
  }

  const H = items.length * 86 - 4

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${H}" font-family="Arial, sans-serif">\n`
  svg += '  <defs>\n'

  // Define clipPaths for each row
  for (let i = 0; i < items.length; i++) {
    svg += `    <clipPath id="cc${i}"><polygon points="0,0 736,0 766,40 736,80 0,80"/></clipPath>\n`
  }
  svg += '  </defs>\n'

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const color = item.color || CHEVRON_COLORS[i % CHEVRON_COLORS.length]
    const circleStyle = getChevronCircleStyle(color)

    svg += `  <g transform="translate(0, ${i * 86})">\n`
    // Chevron bar
    svg += `    <rect x="56" y="4" width="744" height="72" fill="${esc(color)}" clip-path="url(#cc${i})"/>\n`
    // Icon circle
    svg += `    <circle cx="56" cy="40" r="34" fill="${circleStyle.bg}" stroke="${circleStyle.stroke}" stroke-width="1"/>\n`
    // Emoji
    if (item.emoji) {
      svg += `    <text x="56" y="40" text-anchor="middle" dominant-baseline="central" font-size="22">${esc(item.emoji)}</text>\n`
    }
    // Line 1
    svg += `    <text x="100" y="36" font-size="14.5" fill="white">${esc(item.line1)}</text>\n`
    // Line 2
    if (item.line2) {
      svg += `    <text x="100" y="56" font-size="14.5" fill="white">${esc(item.line2)}</text>\n`
    }
    svg += '  </g>\n'
  }

  svg += '</svg>'
  return svg
}

// ── 3. Cards ───────────────────────────────────────────────────────────────

function generateCards(cards: CardItem[]): string {
  if (!cards || cards.length === 0) {
    cards = [{ emoji: '?', title: 'Card', body: ['Content'] }]
  }

  const W = cards.length * 170 + 10

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 320" font-family="Inter, sans-serif">\n`
  svg += `  ${SHADOW_FILTER}\n`

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i]
    const color = card.color || CARD_COLORS[i % CARD_COLORS.length]

    svg += `  <g transform="translate(${15 + i * 170}, 15)">\n`
    // Card background
    svg += `    <rect width="155" height="260" rx="10" fill="${BRAND.bg}" filter="url(#shadow)"/>\n`
    // Header circle
    svg += `    <circle cx="78" cy="40" r="22" fill="${esc(color)}"/>\n`
    // Emoji
    svg += `    <text x="78" y="40" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="18">${esc(card.emoji)}</text>\n`
    // Title
    svg += `    <text x="78" y="80" text-anchor="middle" fill="${BRAND.dark}" font-size="13" font-weight="700">${esc(card.title)}</text>\n`
    // Divider
    svg += `    <line x1="20" y1="95" x2="135" y2="95" stroke="${BRAND.accent}" stroke-width="1.5"/>\n`

    let bodyStartY = 115
    // Question
    if (card.question) {
      svg += `    <text x="78" y="115" text-anchor="middle" fill="${BRAND.dark}" font-size="10" font-weight="600">${esc(card.question)}</text>\n`
      bodyStartY = 135
    }

    // Body lines
    const bodyLines = card.body || []
    for (let j = 0; j < bodyLines.length; j++) {
      const lineY = bodyStartY + j * 15
      svg += `    <text x="20" y="${lineY}" fill="${BRAND.text}" font-size="9">${esc(bodyLines[j])}</text>\n`
    }

    // Second divider
    svg += `    <line x1="20" y1="198" x2="135" y2="198" stroke="${BRAND.accent}" stroke-width="1.5"/>\n`

    // Footer
    if (card.footer) {
      svg += `    <text x="78" y="218" text-anchor="middle" fill="${BRAND.textLight}" font-size="8.5" font-style="italic">${esc(card.footer)}</text>\n`
    }

    svg += '  </g>\n'
  }

  svg += '</svg>'
  return svg
}

// ── 4. Comparison ──────────────────────────────────────────────────────────

function generateComparison(left: ComparisonSide, right: ComparisonSide): string {
  if (!left) left = { title: 'Before', items: [] }
  if (!right) right = { title: 'After', items: [] }

  const leftSymbol = left.symbol || '\u2717'
  const rightSymbol = right.symbol || '\u2713'

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 340" font-family="Inter, sans-serif">\n`
  svg += `  ${SHADOW_FILTER}\n`

  // ── Left card ──
  svg += '  <g transform="translate(20, 15)">\n'
  svg += `    <rect width="200" height="270" rx="10" fill="${BRAND.redBg}" filter="url(#shadow)"/>\n`
  svg += `    <circle cx="100" cy="40" r="22" fill="${BRAND.red}"/>\n`
  svg += `    <text x="100" y="40" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="16">${esc(leftSymbol)}</text>\n`
  svg += `    <text x="100" y="75" text-anchor="middle" fill="${BRAND.red}" font-size="13" font-weight="700">${esc(left.title)}</text>\n`
  svg += `    <line x1="20" y1="90" x2="180" y2="90" stroke="${BRAND.redAccent}" stroke-width="1.5"/>\n`

  let leftItemStartY = 130
  if (left.quote) {
    svg += `    <text x="100" y="110" text-anchor="middle" fill="${BRAND.text}" font-size="11" font-style="italic">${esc(left.quote)}</text>\n`
    leftItemStartY = 130
  }

  const leftItems = left.items || []
  for (let i = 0; i < leftItems.length; i++) {
    const y = leftItemStartY + i * 20
    svg += `    <text x="20" y="${y}" fill="${BRAND.text}" font-size="9">\u2022 ${esc(leftItems[i])}</text>\n`
  }

  if (left.footer) {
    svg += `    <text x="100" y="250" text-anchor="middle" fill="${BRAND.red}" font-size="9.5" font-weight="600">${esc(left.footer)}</text>\n`
  }
  svg += '  </g>\n'

  // ── Arrow between cards ──
  svg += `  <line x1="230" y1="155" x2="255" y2="155" stroke="${BRAND.dark}" stroke-width="2.5"/>\n`
  svg += `  <polyline points="250,148 260,155 250,162" fill="${BRAND.dark}"/>\n`

  // ── Right card ──
  svg += '  <g transform="translate(270, 15)">\n'
  svg += `    <rect width="410" height="270" rx="10" fill="${BRAND.bg}" filter="url(#shadow)"/>\n`
  svg += `    <circle cx="205" cy="40" r="22" fill="${BRAND.dark}"/>\n`
  svg += `    <text x="205" y="40" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="16">${esc(rightSymbol)}</text>\n`
  svg += `    <text x="205" y="75" text-anchor="middle" fill="${BRAND.dark}" font-size="13" font-weight="700">${esc(right.title)}</text>\n`
  svg += `    <line x1="20" y1="90" x2="390" y2="90" stroke="${BRAND.accent}" stroke-width="1.5"/>\n`

  let rightItemStartY = 130
  if (right.quote) {
    svg += `    <text x="205" y="110" text-anchor="middle" fill="${BRAND.text}" font-size="11" font-style="italic">${esc(right.quote)}</text>\n`
    rightItemStartY = 130
  }

  const rightItems = right.items || []
  for (let i = 0; i < rightItems.length; i++) {
    const y = rightItemStartY + i * 20
    svg += `    <text x="20" y="${y}" fill="${BRAND.text}" font-size="9.5">\u2022 ${esc(rightItems[i])}</text>\n`
  }

  if (right.footer) {
    svg += `    <text x="205" y="250" text-anchor="middle" fill="${BRAND.dark}" font-size="9.5" font-weight="600">${esc(right.footer)}</text>\n`
  }
  svg += '  </g>\n'

  svg += '</svg>'
  return svg
}

// ── 5. Flow ────────────────────────────────────────────────────────────────

function generateFlow(nodes: FlowNode[]): string {
  if (!nodes || nodes.length === 0) {
    nodes = [{ title: 'Start', description: [] }]
  }

  // Calculate per-node radius: if no emoji, size circle to fit text
  const nodeRadii = nodes.map(node => {
    if (node.emoji) return 44
    // Estimate text width: ~7px per char at font-size 11, plus padding
    const textLen = node.title.length
    return Math.max(44, Math.min(70, textLen * 4 + 20))
  })
  const maxRadius = Math.max(...nodeRadii)

  // Spacing based on largest circle
  const spacing = Math.max(192, maxRadius * 2 + 60)
  const W = nodes.length * spacing
  const cy = maxRadius + 10

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${cy * 2 + 160}" font-family="Inter, sans-serif">\n`
  svg += `  ${SHADOW_FILTER}\n`

  // Dashed connecting line
  if (nodes.length > 1) {
    svg += `  <line x1="${spacing / 2}" y1="${cy + 5}" x2="${W - spacing / 2}" y2="${cy + 5}" stroke="${BRAND.accent}" stroke-width="3" stroke-dasharray="8,4"/>\n`
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const nodeCx = spacing / 2 + i * spacing
    const r = nodeRadii[i]

    // Arrow between nodes
    if (i > 0) {
      const prevR = nodeRadii[i - 1]
      const prevCx = spacing / 2 + (i - 1) * spacing
      const arrowX = prevCx + prevR + (nodeCx - r - prevCx - prevR) / 2
      svg += `  <polygon points="${arrowX - 5},${cy} ${arrowX + 5},${cy + 5} ${arrowX - 5},${cy + 10}" fill="${BRAND.light}"/>\n`
    }

    // Circle
    svg += `  <circle cx="${nodeCx}" cy="${cy + 5}" r="${r}" fill="${BRAND.bg}" filter="url(#shadow)"/>\n`

    // Content inside circle: emoji or text
    if (node.emoji) {
      svg += `  <text x="${nodeCx}" y="${cy + 5}" text-anchor="middle" dominant-baseline="central" font-size="28">${esc(node.emoji)}</text>\n`
    } else if (node.title) {
      // Render title text inside the circle, wrapped if needed
      const words = node.title.split(' ')
      const fontSize = r > 50 ? 12 : 11
      if (words.length <= 2 || node.title.length <= 12) {
        svg += `  <text x="${nodeCx}" y="${cy + 5}" text-anchor="middle" dominant-baseline="central" fill="${BRAND.dark}" font-size="${fontSize}" font-weight="700">${esc(node.title)}</text>\n`
      } else {
        // Split into 2 lines
        const mid = Math.ceil(words.length / 2)
        const line1 = words.slice(0, mid).join(' ')
        const line2 = words.slice(mid).join(' ')
        svg += `  <text x="${nodeCx}" y="${cy - 2}" text-anchor="middle" dominant-baseline="central" fill="${BRAND.dark}" font-size="${fontSize}" font-weight="700">${esc(line1)}</text>\n`
        svg += `  <text x="${nodeCx}" y="${cy + 14}" text-anchor="middle" dominant-baseline="central" fill="${BRAND.dark}" font-size="${fontSize}" font-weight="700">${esc(line2)}</text>\n`
      }
    }

    // Title below circle (only when emoji is used — otherwise title is inside)
    if (node.emoji) {
      svg += `  <text x="${nodeCx}" y="${cy + r + 25}" text-anchor="middle" fill="${BRAND.dark}" font-size="12" font-weight="700">${esc(node.title)}</text>\n`
    }

    // Description lines
    const desc = node.description || []
    const descStartY = node.emoji ? cy + r + 45 : cy + r + 25
    for (let j = 0; j < desc.length; j++) {
      svg += `  <text x="${nodeCx}" y="${descStartY + j * 15}" text-anchor="middle" fill="${BRAND.text}" font-size="9.5">${esc(desc[j])}</text>\n`
    }
  }

  svg += '</svg>'
  return svg
}

// ── 6. Layers ──────────────────────────────────────────────────────────────

function generateLayers(layers: LayerItem[]): string {
  if (!layers || layers.length === 0) {
    layers = [{ label: 'Layer 1' }]
  }

  const H = layers.length * 98 + 24

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 ${H}" font-family="Inter, sans-serif">\n`

  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i]
    const x = 20 + i * 30
    const y = 20 + i * 98
    const w = 740 - i * 60
    const h = 82
    const fill = layer.color || LAYER_DEFAULT_COLORS[i % LAYER_DEFAULT_COLORS.length]

    // Determine stroke color: next color in palette or slightly lighter
    const strokeColor = LAYER_DEFAULT_COLORS[(i + 1) % LAYER_DEFAULT_COLORS.length]

    // Dark layers (first 3) get white text, light layers get dark text
    const isDark = i < 3
    const textFill = isDark ? 'rgba(255,255,255,0.9)' : '#333'
    const freqFill = isDark ? 'rgba(255,255,255,0.7)' : '#888'

    svg += `  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${esc(fill)}" stroke="${strokeColor}" stroke-width="2"/>\n`

    // Label
    svg += `  <text x="${x + 20}" y="${y + 28}" fill="${textFill}" font-size="15" font-weight="700">${esc(layer.label)}</text>\n`

    // Subtitle
    if (layer.subtitle) {
      svg += `  <text x="${x + 20}" y="${y + 48}" fill="${textFill}" font-size="11.5">${esc(layer.subtitle)}</text>\n`
    }

    // Question
    if (layer.question) {
      svg += `  <text x="${x + 20}" y="${y + 66}" fill="${textFill}" font-size="11" font-style="italic">${esc(layer.question)}</text>\n`
    }

    // Frequency (right-aligned)
    if (layer.frequency) {
      svg += `  <text x="${x + w - 30}" y="${y + 28}" text-anchor="end" fill="${freqFill}" font-size="10" font-style="italic">${esc(layer.frequency)}</text>\n`
    }
  }

  svg += '</svg>'
  return svg
}

// ── 7. Hub & Spokes ────────────────────────────────────────────────────────

function generateHub(center: HubSpoke, spokes: HubSpoke[]): string {
  if (!center) center = { label: 'Center' }
  if (!spokes || spokes.length === 0) {
    spokes = [{ label: 'Spoke 1' }]
  }

  const n = spokes.length
  const W = Math.max(800, n * 160 + 80)
  const cx = W / 2

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 360" font-family="Inter, sans-serif">\n`
  svg += `  ${SHADOW_FILTER}\n`

  // Lines from center to spokes (draw first so they appear behind circles)
  for (let i = 0; i < n; i++) {
    const spokeX = W / (n + 1) * (i + 1)
    svg += `  <line x1="${cx}" y1="${80 + 44}" x2="${spokeX}" y2="${240 - 36}" stroke="${BRAND.accent}" stroke-width="2"/>\n`
  }

  // Center node
  svg += `  <circle cx="${cx}" cy="80" r="44" fill="${BRAND.bg}" stroke="${BRAND.dark}" stroke-width="2" filter="url(#shadow)"/>\n`
  if (center.emoji) {
    svg += `  <text x="${cx}" y="80" text-anchor="middle" dominant-baseline="central" font-size="26">${esc(center.emoji)}</text>\n`
  }
  svg += `  <text x="${cx}" y="140" text-anchor="middle" fill="${BRAND.dark}" font-size="14" font-weight="700">${esc(center.label)}</text>\n`
  if (center.description) {
    svg += `  <text x="${cx}" y="158" text-anchor="middle" fill="${BRAND.text}" font-size="10">${esc(center.description)}</text>\n`
  }

  // Spoke nodes
  for (let i = 0; i < n; i++) {
    const spoke = spokes[i]
    const spokeX = W / (n + 1) * (i + 1)

    svg += `  <circle cx="${spokeX}" cy="240" r="36" fill="${BRAND.bg}" stroke="${BRAND.medium}" stroke-width="1.5" filter="url(#shadow)"/>\n`
    if (spoke.emoji) {
      svg += `  <text x="${spokeX}" y="240" text-anchor="middle" dominant-baseline="central" font-size="22">${esc(spoke.emoji)}</text>\n`
    }
    svg += `  <text x="${spokeX}" y="290" text-anchor="middle" fill="${BRAND.dark}" font-size="11" font-weight="700">${esc(spoke.label)}</text>\n`
    if (spoke.description) {
      svg += `  <text x="${spokeX}" y="308" text-anchor="middle" fill="${BRAND.text}" font-size="9">${esc(spoke.description)}</text>\n`
    }
  }

  svg += '</svg>'
  return svg
}

// ── 8. Timeline ────────────────────────────────────────────────────────────

function generateTimeline(steps: TimelineStep[]): string {
  if (!steps || steps.length === 0) {
    steps = [{ title: ['Step 1'], description: ['Description'] }]
  }

  const W = steps.length * 230 + 30

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 320" font-family="Inter, Arial, sans-serif">\n`
  svg += `  ${SHADOW_FILTER}\n`

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const color = step.color || TIMELINE_COLORS[i % TIMELINE_COLORS.length]
    const cardX = 30 + i * 230

    // Connecting arrow from previous card
    if (i > 0) {
      const prevCardX = 30 + (i - 1) * 230
      const lineX1 = prevCardX + 200 + 5
      const lineX2 = cardX - 5
      svg += `  <line x1="${lineX1}" y1="155" x2="${lineX2}" y2="155" stroke="${BRAND.light}" stroke-width="2"/>\n`
      svg += `  <polygon points="${lineX2 - 8},150 ${lineX2},155 ${lineX2 - 8},160" fill="${BRAND.light}"/>\n`
    }

    // Card
    svg += `  <rect x="${cardX}" y="50" width="200" height="200" rx="16" fill="#fff" stroke="${esc(color)}" stroke-width="2.5" filter="url(#shadow)"/>\n`

    // Step number circle
    svg += `  <circle cx="${cardX + 100}" cy="90" r="16" fill="${esc(color)}"/>\n`
    svg += `  <text x="${cardX + 100}" y="90" text-anchor="middle" dominant-baseline="central" fill="#fff" font-size="15" font-weight="bold">${i + 1}</text>\n`

    // Title lines
    const titleLines = step.title || []
    for (let j = 0; j < titleLines.length; j++) {
      const titleY = 120 + j * 17
      svg += `  <text x="${cardX + 100}" y="${titleY}" text-anchor="middle" fill="${BRAND.dark}" font-size="14" font-weight="bold">${esc(titleLines[j])}</text>\n`
    }

    // Divider
    svg += `  <line x1="${cardX + 50}" y1="158" x2="${cardX + 150}" y2="158" stroke="${BRAND.accent}" stroke-width="1.5"/>\n`

    // Description lines
    const descLines = step.description || []
    for (let j = 0; j < descLines.length; j++) {
      const descY = 176 + j * 15
      svg += `  <text x="${cardX + 100}" y="${descY}" text-anchor="middle" fill="#444" font-size="11">${esc(descLines[j])}</text>\n`
    }
  }

  svg += '</svg>'
  return svg
}

// ── Main Export ────────────────────────────────────────────────────────────

export function generateDiagram(request: DiagramRequest): string {
  switch (request.template) {
    case 'stepper':
      return generateStepper(request.items)
    case 'chevron':
      return generateChevron(request.items)
    case 'cards':
      return generateCards(request.cards)
    case 'comparison':
      return generateComparison(request.left, request.right)
    case 'flow':
      return generateFlow(request.nodes)
    case 'layers':
      return generateLayers(request.layers)
    case 'hub':
      return generateHub(request.center, request.spokes)
    case 'timeline':
      return generateTimeline(request.steps)
    default:
      throw new Error(`Unknown template: ${(request as any).template}`)
  }
}
