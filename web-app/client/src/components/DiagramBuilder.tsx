import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, Plus, Trash2, Loader2, Save, Eye } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface DiagramBuilderProps {
  isOpen: boolean
  onClose: () => void
  /** Called after the SVG saves. `title` is the user-entered slide title; the
   * caller uses it as the slide's H1 and (when undefined) falls back to a
   * placeholder derived from the filename. */
  onSaved?: (paths: string[], title?: string) => void
  language: 'en' | 'fr'
}

type TemplateType =
  | 'stepper'
  | 'chevron'
  | 'cards'
  | 'comparison'
  | 'flow'
  | 'layers'
  | 'hub'
  | 'timeline'

interface TemplateOption {
  type: TemplateType
  name: { en: string; fr: string }
  thumbnail: JSX.Element
}

// ── Form data types ──

interface StepperItem {
  title: string
  description: string
}

interface ChevronItem {
  line1: string
  line2: string
  emoji: string
}

interface CardItem {
  emoji: string
  title: string
  question: string
  body: string
  footer: string
}

interface ComparisonPanel {
  title: string
  symbol: string
  quote: string
  items: string
  footer: string
}

interface ComparisonData {
  left: ComparisonPanel
  right: ComparisonPanel
}

interface FlowNode {
  emoji: string
  title: string
  description: string
}

interface LayerItem {
  label: string
  subtitle: string
  question: string
  frequency: string
}

interface HubSpoke {
  emoji: string
  label: string
  description: string
}

interface HubData {
  center: { emoji: string; label: string; description: string }
  spokes: HubSpoke[]
}

interface TimelineStep {
  title: string
  description: string
}

type FormData =
  | { type: 'stepper'; items: StepperItem[] }
  | { type: 'chevron'; items: ChevronItem[] }
  | { type: 'cards'; cards: CardItem[] }
  | { type: 'comparison'; data: ComparisonData }
  | { type: 'flow'; nodes: FlowNode[] }
  | { type: 'layers'; layers: LayerItem[] }
  | { type: 'hub'; data: HubData }
  | { type: 'timeline'; steps: TimelineStep[] }

// ─────────────────────────────────────────────────────────────────────────────
// API helpers
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = '/api'

async function previewDiagram(config: any): Promise<string> {
  const res = await fetch(`${API_BASE}/diagrams/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(config),
  })
  if (!res.ok) throw new Error('Preview failed')
  const data = await res.json()
  return data.svg
}

async function saveDiagram(
  config: any,
  filename: string,
  language: string
): Promise<{ paths: string[]; filename: string }> {
  const res = await fetch(`${API_BASE}/diagrams/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ config, filename, language }),
  })
  if (!res.ok) throw new Error('Save failed')
  return res.json()
}

// ─────────────────────────────────────────────────────────────────────────────
// Template thumbnails (small inline SVGs)
// ─────────────────────────────────────────────────────────────────────────────

const TEAL = '#09544F'
const TEAL_LIGHT = '#E8F4F3'
const GRAY = '#9CA3AF'

function StepperThumb() {
  return (
    <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
      <line x1="20" y1="10" x2="20" y2="40" stroke={TEAL} strokeWidth="2" />
      <circle cx="20" cy="10" r="4" fill={TEAL} />
      <circle cx="20" cy="25" r="4" fill={TEAL} />
      <circle cx="20" cy="40" r="4" fill={TEAL} />
      <rect x="30" y="6" width="40" height="8" rx="2" fill={TEAL_LIGHT} />
      <rect x="30" y="21" width="40" height="8" rx="2" fill={TEAL_LIGHT} />
      <rect x="30" y="36" width="40" height="8" rx="2" fill={TEAL_LIGHT} />
    </svg>
  )
}

function ChevronThumb() {
  return (
    <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
      <rect x="5" y="5" width="70" height="10" rx="3" fill={TEAL} opacity="0.8" />
      <rect x="5" y="20" width="70" height="10" rx="3" fill={TEAL} opacity="0.6" />
      <rect x="5" y="35" width="70" height="10" rx="3" fill={TEAL} opacity="0.4" />
    </svg>
  )
}

function CardsThumb() {
  return (
    <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
      <rect x="3" y="5" width="22" height="40" rx="3" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="1" />
      <rect x="29" y="5" width="22" height="40" rx="3" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="1" />
      <rect x="55" y="5" width="22" height="40" rx="3" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="1" />
    </svg>
  )
}

function ComparisonThumb() {
  return (
    <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
      <rect x="5" y="5" width="28" height="40" rx="3" fill="#FDE8E8" stroke="#C53030" strokeWidth="1" />
      <rect x="47" y="5" width="28" height="40" rx="3" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="1" />
      <polyline points="36,20 42,25 36,30" stroke={GRAY} strokeWidth="2" fill="none" />
    </svg>
  )
}

function FlowThumb() {
  return (
    <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
      <circle cx="15" cy="25" r="8" fill={TEAL} />
      <circle cx="40" cy="25" r="8" fill={TEAL} opacity="0.7" />
      <circle cx="65" cy="25" r="8" fill={TEAL} opacity="0.4" />
      <polyline points="24,25 30,25" stroke={GRAY} strokeWidth="1.5" />
      <polyline points="49,25 55,25" stroke={GRAY} strokeWidth="1.5" />
    </svg>
  )
}

function LayersThumb() {
  return (
    <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
      <rect x="10" y="5" width="60" height="40" rx="4" fill={TEAL} opacity="0.2" />
      <rect x="18" y="12" width="44" height="26" rx="3" fill={TEAL} opacity="0.4" />
      <rect x="26" y="19" width="28" height="12" rx="2" fill={TEAL} opacity="0.7" />
    </svg>
  )
}

function HubThumb() {
  return (
    <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
      <circle cx="40" cy="25" r="8" fill={TEAL} />
      <circle cx="15" cy="10" r="5" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="1" />
      <circle cx="65" cy="10" r="5" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="1" />
      <circle cx="15" cy="40" r="5" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="1" />
      <circle cx="65" cy="40" r="5" fill={TEAL_LIGHT} stroke={TEAL} strokeWidth="1" />
      <line x1="34" y1="20" x2="19" y2="13" stroke={GRAY} strokeWidth="1" />
      <line x1="46" y1="20" x2="61" y2="13" stroke={GRAY} strokeWidth="1" />
      <line x1="34" y1="30" x2="19" y2="37" stroke={GRAY} strokeWidth="1" />
      <line x1="46" y1="30" x2="61" y2="37" stroke={GRAY} strokeWidth="1" />
    </svg>
  )
}

function TimelineThumb() {
  return (
    <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
      <line x1="10" y1="30" x2="70" y2="30" stroke={TEAL} strokeWidth="2" />
      <circle cx="15" cy="30" r="3" fill={TEAL} />
      <circle cx="40" cy="30" r="3" fill={TEAL} />
      <circle cx="65" cy="30" r="3" fill={TEAL} />
      <rect x="5" y="10" width="20" height="14" rx="2" fill={TEAL_LIGHT} />
      <rect x="30" y="10" width="20" height="14" rx="2" fill={TEAL_LIGHT} />
      <rect x="55" y="10" width="20" height="14" rx="2" fill={TEAL_LIGHT} />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Template definitions
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATES: TemplateOption[] = [
  { type: 'stepper', name: { en: 'Stepper', fr: 'Stepper' }, thumbnail: <StepperThumb /> },
  { type: 'chevron', name: { en: 'Chevron Rows', fr: 'Rangees chevrons' }, thumbnail: <ChevronThumb /> },
  { type: 'cards', name: { en: 'Card Grid', fr: 'Grille de cartes' }, thumbnail: <CardsThumb /> },
  { type: 'comparison', name: { en: 'Comparison', fr: 'Comparaison' }, thumbnail: <ComparisonThumb /> },
  { type: 'flow', name: { en: 'Horizontal Flow', fr: 'Flux horizontal' }, thumbnail: <FlowThumb /> },
  { type: 'layers', name: { en: 'Concentric Layers', fr: 'Couches concentriques' }, thumbnail: <LayersThumb /> },
  { type: 'hub', name: { en: 'Hub & Spokes', fr: 'Moyeu et rayons' }, thumbnail: <HubThumb /> },
  { type: 'timeline', name: { en: 'Timeline', fr: 'Chronologie' }, thumbnail: <TimelineThumb /> },
]

// ─────────────────────────────────────────────────────────────────────────────
// Default form data
// ─────────────────────────────────────────────────────────────────────────────

function getDefaultFormData(type: TemplateType): FormData {
  switch (type) {
    case 'stepper':
      return {
        type: 'stepper',
        items: [
          { title: 'Step 1', description: 'First step description' },
          { title: 'Step 2', description: 'Second step description' },
          { title: 'Step 3', description: 'Third step description' },
        ],
      }
    case 'chevron':
      return {
        type: 'chevron',
        items: [
          { line1: 'First objective', line2: '', emoji: '\u{1F4CA}' },
          { line1: 'Second objective', line2: '', emoji: '\u{1F527}' },
          { line1: 'Third objective', line2: '', emoji: '\u{2705}' },
        ],
      }
    case 'cards':
      return {
        type: 'cards',
        cards: [
          { emoji: '\u{1F50D}', title: 'Card 1', question: '', body: 'Description line 1', footer: '' },
          { emoji: '\u{1F4DD}', title: 'Card 2', question: '', body: 'Description line 1', footer: '' },
          { emoji: '\u{1F4C8}', title: 'Card 3', question: '', body: 'Description line 1', footer: '' },
        ],
      }
    case 'comparison':
      return {
        type: 'comparison',
        data: {
          left: { title: 'Before', symbol: '\u2717', quote: '', items: 'Item 1\nItem 2', footer: '' },
          right: { title: 'After', symbol: '\u2713', quote: '', items: 'Item 1\nItem 2', footer: '' },
        },
      }
    case 'flow':
      return {
        type: 'flow',
        nodes: [
          { emoji: '\u{1F4E5}', title: 'Input', description: 'Data entry' },
          { emoji: '\u2699\uFE0F', title: 'Process', description: 'Transform data' },
          { emoji: '\u{1F4E4}', title: 'Output', description: 'Generate results' },
        ],
      }
    case 'layers':
      return {
        type: 'layers',
        layers: [
          { label: 'Layer 1', subtitle: 'Outer layer', question: '', frequency: '' },
          { label: 'Layer 2', subtitle: 'Middle layer', question: '', frequency: '' },
          { label: 'Layer 3', subtitle: 'Inner layer', question: '', frequency: '' },
        ],
      }
    case 'hub':
      return {
        type: 'hub',
        data: {
          center: { emoji: '\u2B50', label: 'Core', description: '' },
          spokes: [
            { emoji: '\u{1F4CA}', label: 'Spoke 1', description: '' },
            { emoji: '\u{1F527}', label: 'Spoke 2', description: '' },
            { emoji: '\u{1F4DD}', label: 'Spoke 3', description: '' },
          ],
        },
      }
    case 'timeline':
      return {
        type: 'timeline',
        steps: [
          { title: 'Phase 1', description: 'First phase' },
          { title: 'Phase 2', description: 'Second phase' },
          { title: 'Phase 3', description: 'Third phase' },
        ],
      }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Build API config from form data
// ─────────────────────────────────────────────────────────────────────────────

function buildConfig(formData: FormData): Record<string, unknown> {
  switch (formData.type) {
    case 'stepper':
      return { template: 'stepper', items: formData.items }
    case 'chevron':
      return { template: 'chevron', items: formData.items }
    case 'cards':
      return {
        template: 'cards',
        cards: formData.cards.map((c) => ({
          ...c,
          body: c.body.split('\n').filter((l) => l.trim()),
        })),
      }
    case 'comparison':
      return {
        template: 'comparison',
        left: {
          ...formData.data.left,
          items: formData.data.left.items.split('\n').filter((l) => l.trim()),
        },
        right: {
          ...formData.data.right,
          items: formData.data.right.items.split('\n').filter((l) => l.trim()),
        },
      }
    case 'flow':
      return {
        template: 'flow',
        nodes: formData.nodes.map((n) => ({
          ...n,
          description: n.description.split('\n').filter((l) => l.trim()),
        })),
      }
    case 'layers':
      return { template: 'layers', layers: formData.layers }
    case 'hub':
      return { template: 'hub', center: formData.data.center, spokes: formData.data.spokes }
    case 'timeline':
      return {
        template: 'timeline',
        steps: formData.steps.map((s) => ({
          title: s.title.split('\n').filter((l) => l.trim()),
          description: s.description.split('\n').filter((l) => l.trim()),
        })),
      }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared input class
// ─────────────────────────────────────────────────────────────────────────────

const INPUT_CLS =
  'w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'
const EMOJI_CLS =
  'px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500'

// ── Emoji Picker ──────────────────────────────────────────────────────────

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  { label: 'Data', emojis: ['📊', '📈', '📉', '📋', '🔍', '🔬', '📐', '🧮', '💾', '🗂️'] },
  { label: 'Health', emojis: ['🏥', '🤰', '👶', '💊', '🩺', '❤️', '🧬', '💉', '🏠', '👨‍👩‍👧'] },
  { label: 'Communication', emojis: ['📞', '💬', '📧', '🗣️', '📢', '🎤', '📝', '✏️', '📎', '🔗'] },
  { label: 'Actions', emojis: ['✅', '⚠️', '❓', '❌', '🎯', '💡', '⭐', '🔄', '➡️', '🔑'] },
  { label: 'People', emojis: ['👥', '🧑‍💻', '👋', '🤝', '🌍', '🏛️', '🎓', '📚', '🛠️', '⚙️'] },
  { label: 'Charts', emojis: ['📥', '📤', '🔗', '🔒', '📦', '🗺️', '📑', '🏷️', '💰', '🕐'] },
]

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<'emoji' | 'text'>(() => {
    // If the value is non-empty and NOT a common emoji (i.e. longer than 2 chars or plain ASCII), default to text mode
    if (!value) return 'emoji'
    // Emoji are typically 1-2 code points; plain text labels are ASCII/longer
    const isLikelyText = value.length > 2 && /^[a-zA-Z0-9\s.,!?&\-\/]+$/.test(value)
    return isLikelyText ? 'text' : 'emoji'
  })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  if (mode === 'text') {
    return (
      <div className="flex gap-1 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Text..."
          className="w-20 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
          maxLength={12}
        />
        <button
          type="button"
          onClick={() => { setMode('emoji'); onChange('') }}
          className="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap"
          title="Switch to emoji"
        >
          😀
        </button>
      </div>
    )
  }

  return (
    <div className="relative flex gap-1 items-center" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-9 flex items-center justify-center text-lg border border-gray-200 rounded hover:border-gray-400 transition-colors bg-white"
        title="Pick emoji"
      >
        {value || '😀'}
      </button>
      <button
        type="button"
        onClick={() => { setMode('text'); onChange('') }}
        className="text-xs text-gray-400 hover:text-gray-600 whitespace-nowrap"
        title="Switch to text"
      >
        Aa
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-2 w-64">
          {EMOJI_CATEGORIES.map((cat) => (
            <div key={cat.label} className="mb-1.5">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5 px-0.5">{cat.label}</div>
              <div className="flex flex-wrap gap-0.5">
                {cat.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => { onChange(emoji); setIsOpen(false) }}
                    className={`w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-base transition-colors ${value === emoji ? 'bg-[#E8F4F3] ring-1 ring-[#09544F]' : ''}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-1 mt-1">
            <button
              type="button"
              onClick={() => { onChange(''); setIsOpen(false) }}
              className="text-xs text-gray-400 hover:text-gray-600 px-1"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function DiagramBuilder({ isOpen, onClose, onSaved, language }: DiagramBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  /** Slide title — used as the H1 on the generated slide AND (slugified) as the SVG filename. */
  const [slideTitle, setSlideTitle] = useState('')
  const [svgPreview, setSvgPreview] = useState<string>('')
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const L = useCallback(
    (en: string, fr: string) => (language === 'fr' ? fr : en),
    [language]
  )

  // ── Select template ──

  const handleSelectTemplate = useCallback(
    (type: TemplateType) => {
      setSelectedTemplate(type)
      setFormData(getDefaultFormData(type))
      setSlideTitle('')
      setSvgPreview('')
      setPreviewError(null)
      setSaveError(null)
    },
    []
  )

  // ── Debounced preview ──

  useEffect(() => {
    if (!formData) return

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      setIsLoadingPreview(true)
      setPreviewError(null)
      try {
        const config = buildConfig(formData)
        const svg = await previewDiagram(config)
        setSvgPreview(svg)
      } catch (err: any) {
        console.error('Diagram preview error:', err)
        setPreviewError(err.message || 'Preview failed')
      } finally {
        setIsLoadingPreview(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [formData])

  // ── Save handler ──
  // The user enters a slide title (e.g. "ANC4 trends"); we use it both as the
  // slide H1 and — slugified — as the SVG filename on disk. The user never
  // sees the filename; the title is what shows up as the slide heading.

  const handleSave = useCallback(async () => {
    if (!formData || !slideTitle.trim()) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const config = buildConfig(formData)
      // Slugify: lowercase, replace non-alphanumeric with underscore, trim.
      const slug = slideTitle
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'diagram'
      // Suffix with timestamp so two diagrams with the same title don't clash.
      const filename = `${slug}_${Date.now()}`
      const result = await saveDiagram(config, filename, language)
      if (onSaved) onSaved(result.paths, slideTitle.trim())
    } catch {
      setSaveError(L('Save failed. Please try again.', 'Erreur lors de la sauvegarde. Veuillez réessayer.'))
    } finally {
      setIsSaving(false)
    }
  }, [formData, slideTitle, language, onSaved, L])

  // ── Close handler ──

  const handleClose = useCallback(() => {
    setSelectedTemplate(null)
    setFormData(null)
    setSlideTitle('')
    setSvgPreview('')
    setPreviewError(null)
    setSaveError(null)
    onClose()
  }, [onClose])

  if (!isOpen) return null

  // ── Form renderers ──

  function renderFormFields() {
    if (!formData) return null

    switch (formData.type) {
      case 'stepper':
        return renderStepperForm(formData.items)
      case 'chevron':
        return renderChevronForm(formData.items)
      case 'cards':
        return renderCardsForm(formData.cards)
      case 'comparison':
        return renderComparisonForm(formData.data)
      case 'flow':
        return renderFlowForm(formData.nodes)
      case 'layers':
        return renderLayersForm(formData.layers)
      case 'hub':
        return renderHubForm(formData.data)
      case 'timeline':
        return renderTimelineForm(formData.steps)
    }
  }

  // ── Helper: update list item ──

  function updateItem<T>(list: T[], index: number, patch: Partial<T>): T[] {
    return list.map((item, i) => (i === index ? { ...item, ...patch } : item))
  }

  function removeItem<T>(list: T[], index: number): T[] {
    return list.filter((_, i) => i !== index)
  }

  // ── Item header with remove button ──

  function ItemHeader({ label, index, onRemove }: { label: string; index: number; onRemove: () => void }) {
    return (
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label} {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title={L('Remove', 'Supprimer')}
        >
          <Trash2 size={14} />
        </button>
      </div>
    )
  }

  // ── Add item button ──

  function AddButton({ onClick }: { onClick: () => void }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 text-sm text-teal-700 hover:text-teal-900 transition-colors mt-2"
      >
        <Plus size={14} />
        {L('Add item', 'Ajouter')}
      </button>
    )
  }

  // ── Stepper form ──

  function renderStepperForm(items: StepperItem[]) {
    const setItems = (newItems: StepperItem[]) =>
      setFormData({ type: 'stepper', items: newItems })

    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded-lg space-y-1.5">
            <ItemHeader
              label={L('Step', 'Etape')}
              index={i}
              onRemove={() => setItems(removeItem(items, i))}
            />
            <input
              className={INPUT_CLS}
              placeholder={L('Title', 'Titre')}
              value={item.title}
              onChange={(e) => setItems(updateItem(items, i, { title: e.target.value }))}
            />
            <input
              className={INPUT_CLS}
              placeholder="Description"
              value={item.description}
              onChange={(e) => setItems(updateItem(items, i, { description: e.target.value }))}
            />
          </div>
        ))}
        <AddButton onClick={() => setItems([...items, { title: '', description: '' }])} />
      </div>
    )
  }

  // ── Chevron form ──

  function renderChevronForm(items: ChevronItem[]) {
    const setItems = (newItems: ChevronItem[]) =>
      setFormData({ type: 'chevron', items: newItems })

    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded-lg space-y-1.5">
            <ItemHeader
              label={L('Row', 'Ligne')}
              index={i}
              onRemove={() => setItems(removeItem(items, i))}
            />
            <div className="flex gap-2 items-start">
              <IconPicker
                value={item.emoji}
                onChange={(emoji) => setItems(updateItem(items, i, { emoji }))}
              />
              <input
                className={INPUT_CLS}
                placeholder={L('Line 1', 'Ligne 1')}
                value={item.line1}
                onChange={(e) => setItems(updateItem(items, i, { line1: e.target.value }))}
              />
            </div>
            <input
              className={INPUT_CLS}
              placeholder={L('Line 2 (optional)', 'Ligne 2 (optionnel)')}
              value={item.line2}
              onChange={(e) => setItems(updateItem(items, i, { line2: e.target.value }))}
            />
          </div>
        ))}
        <AddButton onClick={() => setItems([...items, { line1: '', line2: '', emoji: '' }])} />
      </div>
    )
  }

  // ── Cards form ──

  function renderCardsForm(cards: CardItem[]) {
    const setCards = (newCards: CardItem[]) =>
      setFormData({ type: 'cards', cards: newCards })

    return (
      <div className="space-y-3">
        {cards.map((card, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded-lg space-y-1.5">
            <ItemHeader
              label={L('Card', 'Carte')}
              index={i}
              onRemove={() => setCards(removeItem(cards, i))}
            />
            <div className="flex gap-2 items-start">
              <IconPicker
                value={card.emoji}
                onChange={(emoji) => setCards(updateItem(cards, i, { emoji }))}
              />
              <input
                className={INPUT_CLS}
                placeholder={L('Title', 'Titre')}
                value={card.title}
                onChange={(e) => setCards(updateItem(cards, i, { title: e.target.value }))}
              />
            </div>
            <input
              className={INPUT_CLS}
              placeholder={L('Question (optional)', 'Question (optionnel)')}
              value={card.question}
              onChange={(e) => setCards(updateItem(cards, i, { question: e.target.value }))}
            />
            <textarea
              className={INPUT_CLS}
              rows={3}
              placeholder={L('Body (one item per line)', 'Contenu (un element par ligne)')}
              value={card.body}
              onChange={(e) => setCards(updateItem(cards, i, { body: e.target.value }))}
            />
            <input
              className={INPUT_CLS}
              placeholder={L('Footer (optional)', 'Pied (optionnel)')}
              value={card.footer}
              onChange={(e) => setCards(updateItem(cards, i, { footer: e.target.value }))}
            />
          </div>
        ))}
        <AddButton onClick={() => setCards([...cards, { emoji: '', title: '', question: '', body: '', footer: '' }])} />
      </div>
    )
  }

  // ── Comparison form ──

  function renderComparisonForm(data: ComparisonData) {
    const setData = (newData: ComparisonData) =>
      setFormData({ type: 'comparison', data: newData })

    function renderPanel(side: 'left' | 'right', panel: ComparisonPanel) {
      const label = side === 'left' ? L('Left panel', 'Panneau gauche') : L('Right panel', 'Panneau droit')
      const updatePanel = (patch: Partial<ComparisonPanel>) =>
        setData({ ...data, [side]: { ...panel, ...patch } })

      return (
        <div className="p-2 bg-gray-50 rounded-lg space-y-1.5">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
          <div className="flex gap-2">
            <input
              className={EMOJI_CLS}
              style={{ width: '3rem' }}
              placeholder={L('Symbol', 'Symbole')}
              value={panel.symbol}
              onChange={(e) => updatePanel({ symbol: e.target.value })}
            />
            <input
              className={INPUT_CLS}
              placeholder={L('Title', 'Titre')}
              value={panel.title}
              onChange={(e) => updatePanel({ title: e.target.value })}
            />
          </div>
          <input
            className={INPUT_CLS}
            placeholder={L('Quote (optional)', 'Citation (optionnel)')}
            value={panel.quote}
            onChange={(e) => updatePanel({ quote: e.target.value })}
          />
          <textarea
            className={INPUT_CLS}
            rows={3}
            placeholder={L('Items (one per line)', 'Elements (un par ligne)')}
            value={panel.items}
            onChange={(e) => updatePanel({ items: e.target.value })}
          />
          <input
            className={INPUT_CLS}
            placeholder={L('Footer (optional)', 'Pied (optionnel)')}
            value={panel.footer}
            onChange={(e) => updatePanel({ footer: e.target.value })}
          />
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {renderPanel('left', data.left)}
        {renderPanel('right', data.right)}
      </div>
    )
  }

  // ── Flow form ──

  function renderFlowForm(nodes: FlowNode[]) {
    const setNodes = (newNodes: FlowNode[]) =>
      setFormData({ type: 'flow', nodes: newNodes })

    return (
      <div className="space-y-3">
        {nodes.map((node, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded-lg space-y-1.5">
            <ItemHeader
              label={L('Node', 'Noeud')}
              index={i}
              onRemove={() => setNodes(removeItem(nodes, i))}
            />
            <div className="flex gap-2 items-start">
              <IconPicker
                value={node.emoji}
                onChange={(emoji) => setNodes(updateItem(nodes, i, { emoji }))}
              />
              <input
                className={INPUT_CLS}
                placeholder={L('Title', 'Titre')}
                value={node.title}
                onChange={(e) => setNodes(updateItem(nodes, i, { title: e.target.value }))}
              />
            </div>
            <textarea
              className={INPUT_CLS}
              rows={2}
              placeholder={L('Description (one item per line)', 'Description (un element par ligne)')}
              value={node.description}
              onChange={(e) => setNodes(updateItem(nodes, i, { description: e.target.value }))}
            />
          </div>
        ))}
        <AddButton onClick={() => setNodes([...nodes, { emoji: '', title: '', description: '' }])} />
      </div>
    )
  }

  // ── Layers form ──

  function renderLayersForm(layers: LayerItem[]) {
    const setLayers = (newLayers: LayerItem[]) =>
      setFormData({ type: 'layers', layers: newLayers })

    return (
      <div className="space-y-3">
        {layers.map((layer, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded-lg space-y-1.5">
            <ItemHeader
              label={L('Layer', 'Couche')}
              index={i}
              onRemove={() => setLayers(removeItem(layers, i))}
            />
            <input
              className={INPUT_CLS}
              placeholder={L('Label', 'Libelle')}
              value={layer.label}
              onChange={(e) => setLayers(updateItem(layers, i, { label: e.target.value }))}
            />
            <input
              className={INPUT_CLS}
              placeholder={L('Subtitle (optional)', 'Sous-titre (optionnel)')}
              value={layer.subtitle}
              onChange={(e) => setLayers(updateItem(layers, i, { subtitle: e.target.value }))}
            />
            <input
              className={INPUT_CLS}
              placeholder={L('Question (optional)', 'Question (optionnel)')}
              value={layer.question}
              onChange={(e) => setLayers(updateItem(layers, i, { question: e.target.value }))}
            />
            <input
              className={INPUT_CLS}
              placeholder={L('Frequency (optional)', 'Frequence (optionnel)')}
              value={layer.frequency}
              onChange={(e) => setLayers(updateItem(layers, i, { frequency: e.target.value }))}
            />
          </div>
        ))}
        <AddButton onClick={() => setLayers([...layers, { label: '', subtitle: '', question: '', frequency: '' }])} />
      </div>
    )
  }

  // ── Hub form ──

  function renderHubForm(data: HubData) {
    const setData = (newData: HubData) =>
      setFormData({ type: 'hub', data: newData })

    const updateCenter = (patch: Partial<HubData['center']>) =>
      setData({ ...data, center: { ...data.center, ...patch } })

    const setSpokes = (newSpokes: HubSpoke[]) =>
      setData({ ...data, spokes: newSpokes })

    return (
      <div className="space-y-3">
        {/* Center */}
        <div className="p-2 bg-gray-50 rounded-lg space-y-1.5">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {L('Center', 'Centre')}
          </span>
          <div className="flex gap-2 items-start">
            <IconPicker
              value={data.center.emoji}
              onChange={(emoji) => updateCenter({ emoji })}
            />
            <input
              className={INPUT_CLS}
              placeholder={L('Label', 'Libelle')}
              value={data.center.label}
              onChange={(e) => updateCenter({ label: e.target.value })}
            />
          </div>
          <input
            className={INPUT_CLS}
            placeholder={L('Description (optional)', 'Description (optionnel)')}
            value={data.center.description}
            onChange={(e) => updateCenter({ description: e.target.value })}
          />
        </div>

        {/* Spokes */}
        {data.spokes.map((spoke, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded-lg space-y-1.5">
            <ItemHeader
              label={L('Spoke', 'Rayon')}
              index={i}
              onRemove={() => setSpokes(removeItem(data.spokes, i))}
            />
            <div className="flex gap-2 items-start">
              <IconPicker
                value={spoke.emoji}
                onChange={(emoji) => setSpokes(updateItem(data.spokes, i, { emoji }))}
              />
              <input
                className={INPUT_CLS}
                placeholder={L('Label', 'Libelle')}
                value={spoke.label}
                onChange={(e) => setSpokes(updateItem(data.spokes, i, { label: e.target.value }))}
              />
            </div>
            <input
              className={INPUT_CLS}
              placeholder={L('Description (optional)', 'Description (optionnel)')}
              value={spoke.description}
              onChange={(e) => setSpokes(updateItem(data.spokes, i, { description: e.target.value }))}
            />
          </div>
        ))}
        <AddButton onClick={() => setSpokes([...data.spokes, { emoji: '', label: '', description: '' }])} />
      </div>
    )
  }

  // ── Timeline form ──

  function renderTimelineForm(steps: TimelineStep[]) {
    const setSteps = (newSteps: TimelineStep[]) =>
      setFormData({ type: 'timeline', steps: newSteps })

    return (
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="p-2 bg-gray-50 rounded-lg space-y-1.5">
            <ItemHeader
              label={L('Step', 'Etape')}
              index={i}
              onRemove={() => setSteps(removeItem(steps, i))}
            />
            <textarea
              className={INPUT_CLS}
              rows={2}
              placeholder={L('Title (1-2 lines)', 'Titre (1-2 lignes)')}
              value={step.title}
              onChange={(e) => setSteps(updateItem(steps, i, { title: e.target.value }))}
            />
            <textarea
              className={INPUT_CLS}
              rows={3}
              placeholder={L('Description (1-3 lines)', 'Description (1-3 lignes)')}
              value={step.description}
              onChange={(e) => setSteps(updateItem(steps, i, { description: e.target.value }))}
            />
          </div>
        ))}
        <AddButton onClick={() => setSteps([...steps, { title: '', description: '' }])} />
      </div>
    )
  }

  // ─── Render ───

  const modal = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-6xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {L('Create Diagram', 'Creer un diagramme')}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar */}
          <div className="w-72 border-r border-gray-200 flex flex-col overflow-y-auto p-4">
            {/* Template picker */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {L('Template', 'Modele')}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.type}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl.type)}
                    className={`flex flex-col items-center p-2 rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedTemplate === tmpl.type
                        ? 'border-[#09544F] bg-[#E8F4F3]'
                        : 'border-gray-100 bg-white hover:border-gray-300'
                    }`}
                  >
                    {tmpl.thumbnail}
                    <span className="text-xs text-gray-600 mt-1 text-center leading-tight">
                      {tmpl.name[language]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slide title — the user-facing label that becomes the slide H1 */}
            {formData && (
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                  {L('Slide title', 'Titre de la diapositive')}
                </label>
                <input
                  className={INPUT_CLS}
                  placeholder={L('e.g. ANC4 trends, Data quality steps', 'p. ex. Tendances ANC4, Étapes de qualité')}
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  autoFocus
                />
              </div>
            )}

            {/* Config form */}
            {formData && (
              <div className="flex-1 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  {L('Configuration', 'Configuration')}
                </h3>
                {renderFormFields()}
              </div>
            )}

            {/* Action — one click adds the diagram as a content slide on the day */}
            {formData && (
              <div className="border-t border-gray-200 pt-4 mt-auto space-y-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !slideTitle.trim()}
                  className="w-full px-4 py-2 bg-[#09544F] text-white rounded-lg hover:bg-[#0C716B] transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {L('Adding…', 'Ajout…')}
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {L('Add diagram slide', 'Ajouter la diapositive')}
                    </>
                  )}
                </button>

                {saveError && (
                  <div className="text-sm text-red-700 bg-red-50 rounded-lg p-2">
                    {saveError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right preview */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-auto relative">
            {isLoadingPreview && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-50/60">
                <Loader2 size={32} className="animate-spin text-[#09544F]" />
              </div>
            )}
            {previewError ? (
              <div className="text-center text-red-500">
                <p className="text-sm font-medium mb-1">{L('Preview error', 'Erreur d\'apercu')}</p>
                <p className="text-xs text-red-400">{previewError}</p>
              </div>
            ) : svgPreview ? (
              <div
                className="w-full max-w-3xl [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[65vh]"
                dangerouslySetInnerHTML={{ __html: svgPreview }}
              />
            ) : (
              <div className="text-center text-gray-400">
                <Eye size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">
                  {L(
                    'Select a template to see a preview',
                    'Selectionnez un modele pour voir un apercu'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
