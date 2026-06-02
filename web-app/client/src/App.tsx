import React, { useEffect, useState, useRef } from 'react'
import { useWorkshopStore, Session } from './stores/workshop'
import type { WorkshopInfo } from '../lib/api'
import { t } from './i18n/translations'
import { useToast } from './components/Toast'
import { SlideSorter } from './components/SlideSorter'
import { AIAssistant } from './components/AIAssistant'
import { SlideImportWizard } from './components/SlideImportWizard'
import { GuidedTour, type GuidedTourHandle } from './components/GuidedTour'
import { HelpButton } from './components/HelpButton'
import { HelpPanel } from './components/HelpPanel'
import { HandoutsPanel } from './components/HandoutsPanel'
import {
  Layers,
  BookOpen,
  Sparkles,
  Settings,
  Eye,
  Download,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  RefreshCw,
  FileText,
  Presentation,
  Lock,
  Unlock,
  Plus,
  Copy,
  Trash2,
  ArrowLeft,
  Folder,
  FolderOpen,
  KeyRound,
  Search,
  AlertTriangle,
  Upload,
  Monitor,
  Square,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  CollisionDetection,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Module as LibraryModule, Topic as LibraryTopic } from './components/ContentLibrary'
import { SortableSessionCard, DroppableDayColumn } from './features/workshop-builder/SessionCard'
import { EditSessionModal } from './features/workshop-builder/EditSessionModal'
import { Modal } from './components/ui/Modal'
import { AddContentDrawer } from './features/workshop-builder/AddContentDrawer'
import { SettingsPage } from './features/settings/SettingsPage'
import { AppShell, type SidebarNavId } from './features/app-shell/AppShell'

// SortableSessionCard, DroppableDayColumn, isSessionLocked, and session type
// chrome live in `features/workshop-builder/SessionCard.tsx`.

// EditSessionModal extracted to `features/workshop-builder/EditSessionModal.tsx`.


// ─────────────────────────────────────────────────────────────────────────────
// App Modes
// ─────────────────────────────────────────────────────────────────────────────
type AppMode = 'select' | 'workshop' | 'library' | 'import' | 'settings'

function mapModeToNav(mode: AppMode): SidebarNavId {
  if (mode === 'library') return 'library'
  if (mode === 'settings') return 'settings'
  // select / workshop / import are the workshop authoring flow
  return 'workshops'
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick Export Mode - Select modules and download
// ─────────────────────────────────────────────────────────────────────────────
// Slide Preview with prev/next navigation — shows one slide at a time
// ─────────────────────────────────────────────────────────────────────────────
function SlidePreview({ html, notes, contentLanguage }: { html: string; notes: string[]; contentLanguage: 'en' | 'fr' | 'pt' }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideCount, setSlideCount] = useState(0)

  // Count slides and set up single-slide display whenever html changes
  useEffect(() => {
    setCurrentSlide(0)
    // Marp generates multiple <section> tags per slide (background/content/pseudo layers)
    // Only sections with an id="" attribute are actual content slides
    const idCount = (html.match(/<section id="/g) || []).length
    // Fallback: use pagination-total attribute, then raw section count
    const paginationMatch = html.match(/data-marpit-pagination-total="(\d+)"/)
    const count = idCount || (paginationMatch ? parseInt(paginationMatch[1]) : 1)
    setSlideCount(count || 1)
  }, [html])

  // Navigate to a specific slide by scrolling the section into view
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const tryScroll = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (!doc) return
      // Only target content sections (those with an id), not Marp bg/pseudo layers
      const sections = doc.querySelectorAll('section[id]')
      if (sections.length === 0) {
        // Fallback for slides without bg images (no advanced background layers)
        const allSections = doc.querySelectorAll('section')
        if (allSections[currentSlide]) {
          allSections[currentSlide].scrollIntoView({ behavior: 'auto', block: 'start' })
        }
        return
      }
      if (sections[currentSlide]) {
        sections[currentSlide].scrollIntoView({ behavior: 'auto', block: 'start' })
      }
    }
    // Try immediately and also after iframe loads
    tryScroll()
    iframe.addEventListener('load', tryScroll)
    return () => iframe.removeEventListener('load', tryScroll)
  }, [currentSlide, html])

  // Inject CSS to ensure slide scales to fit inside iframe
  const enhancedHtml = html.replace('</head>', `<style>
    html, body { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; }
    section { scroll-margin-top: 0; }
    svg[data-marpit-svg] { display: block; width: 100%; height: 100%; }
  </style></head>`)

  const goToSlide = (idx: number) => {
    if (idx >= 0 && idx < slideCount) setCurrentSlide(idx)
  }

  // Current slide's presenter notes (notes array is per-slide from Marp)
  const currentNotes = notes[currentSlide] || ''

  // Explicit heights in vh — no flex sizing ambiguity
  const slideHeight = currentNotes ? 'calc(85vh - 64px - 28px - 180px)' : 'calc(85vh - 64px - 28px)'

  return (
    <div>
      {/* Slide area with nav arrows */}
      <div className="flex items-center gap-2 px-2" style={{ height: slideHeight }}>
        {/* Prev button */}
        <button
          onClick={() => goToSlide(currentSlide - 1)}
          disabled={currentSlide === 0}
          aria-label="Previous slide"
          className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Iframe */}
        <div className="h-full flex-1 flex items-center justify-center py-2">
          <iframe
            ref={iframeRef}
            srcDoc={enhancedHtml}
            className="bg-white rounded-lg shadow-2xl"
            style={{ aspectRatio: '16/9', maxWidth: '100%', maxHeight: '100%' }}
            title="Slide Preview"
          />
        </div>

        {/* Next button */}
        <button
          onClick={() => goToSlide(currentSlide + 1)}
          disabled={currentSlide >= slideCount - 1}
          aria-label="Next slide"
          className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-20 flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Slide counter */}
      <div className="text-center" style={{ height: '28px', lineHeight: '28px' }}>
        <span className="text-sm text-white/60 tabular-nums">{currentSlide + 1} / {slideCount}</span>
      </div>

      {/* Presenter notes — fixed height box, scrolls internally */}
      {currentNotes && (
        <div className="border-t border-gray-700 px-6 py-3" style={{ height: '180px', overflowY: 'scroll' }}>
          <h4 className="text-amber-400 text-xs font-semibold mb-1.5">{t('presenterNotes', contentLanguage)}</h4>
          <div className="text-white/80 text-sm whitespace-pre-wrap">
            {currentNotes.replace(/^PRESENTER NOTES:\s*/i, '')}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Library Mode Component - Browse and preview content (two-panel with search)
// ─────────────────────────────────────────────────────────────────────────────
function LibraryMode() {
  const { contentLibrary, loadContentLibrary, contentLanguage } = useWorkshopStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [themes, setThemes] = useState<Array<{ id: string; name: string }>>([])
  const [collapsedThemes, setCollapsedThemes] = useState<Set<string>>(new Set())
  const [previewTopic, setPreviewTopic] = useState<any | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [presenterNotes, setPresenterNotes] = useState<string[]>([])
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const { showToast } = useToast()
  // Slide selection for download — slides keyed by topic id, templates by file.
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set())
  const [templates, setTemplates] = useState<any[]>([])
  const [isExporting, setIsExporting] = useState(false)
  // Templates that depend on workshop settings — only meaningful in the workshop builder.
  const workshopOnlyTemplates = new Set(['objectives', 'expected_outputs'])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleTemplate = (file: string) => {
    setSelectedTemplates(prev => {
      const next = new Set(prev)
      if (next.has(file)) next.delete(file)
      else next.add(file)
      return next
    })
  }

  const selectedCount = selected.size + selectedTemplates.size

  const exportSelection = async (format: 'pptx' | 'pdf') => {
    if (selectedCount === 0) return
    setIsExporting(true)
    try {
      const res = await fetch('/api/content/export/selection', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicIds: Array.from(selected),
          templateFiles: Array.from(selectedTemplates),
          format,
          title: 'Slide selection',
          language: contentLanguage,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.downloadUrl) window.open(data.downloadUrl, '_blank')
      } else {
        showToast(contentLanguage === 'fr' ? "Échec de l'export. Réessayez." : 'Export failed. Please try again.', 'error')
      }
    } catch (err) {
      console.error('Export failed:', err)
      showToast(contentLanguage === 'fr' ? "Échec de l'export. Réessayez." : 'Export failed. Please try again.', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  useEffect(() => {
    fetch(`/api/content/themes?language=${contentLanguage}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then((data) => {
        setThemes(data)
        // Start with theme sections collapsed — show just the headers, expand on demand.
        setCollapsedThemes(new Set([...data.map((t: any) => t.id), '_other']))
      })
      .catch(err => console.warn('Failed to load themes:', err))
  }, [contentLanguage])

  useEffect(() => {
    fetch(`/api/content/templates?language=${contentLanguage}`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(setTemplates)
      .catch(err => console.warn('Failed to load templates:', err))
  }, [contentLanguage])

  const previewCache = useRef<Map<string, { html: string; notes: string[] }>>(new Map())
  const searchInputRef = useRef<HTMLInputElement>(null)

  const loadTemplatePreview = async (tmpl: any) => {
    const synthetic = { id: `template-${tmpl.id}`, title: tmpl.name, slideCount: 1, _isTemplate: true }
    setPreviewTopic(synthetic)
    const cacheKey = `template_${tmpl.id}_${contentLanguage}`
    const cached = previewCache.current.get(cacheKey)
    if (cached) {
      setPreviewHtml(cached.html)
      setPresenterNotes(cached.notes)
      return
    }
    setPreviewHtml(null)
    setPresenterNotes([])
    setIsLoadingPreview(true)
    try {
      const response = await fetch(`/api/content/templates/${tmpl.id}?language=${contentLanguage}`, { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        const markdown = data.content.replace(/\n---\s*$/, '')
        const renderResponse = await fetch('/api/content/render', {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown }),
        })
        if (renderResponse.ok) {
          const renderData = await renderResponse.json()
          previewCache.current.set(cacheKey, { html: renderData.html, notes: renderData.presenterNotes || [] })
          setPreviewHtml(renderData.html)
          setPresenterNotes(renderData.presenterNotes || [])
        }
      }
    } catch (err) {
      console.error('Failed to load template preview:', err)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  useEffect(() => {
    if (contentLibrary.length === 0) {
      loadContentLibrary()
    }
  }, [contentLibrary.length, loadContentLibrary])

  const loadPreview = async (topic: any) => {
    setPreviewTopic(topic)

    const cacheKey = `${topic.id}_${contentLanguage}`
    const cached = previewCache.current.get(cacheKey)
    if (cached) {
      setPreviewHtml(cached.html)
      setPresenterNotes(cached.notes)
      return
    }

    setPreviewHtml(null)
    setIsLoadingPreview(true)
    setPresenterNotes([])
    try {
      const response = await fetch(`/api/content/topic/${topic.id}?language=${contentLanguage}`, { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        const renderResponse = await fetch('/api/content/render', {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown: data.content })
        })
        if (renderResponse.ok) {
          const renderData = await renderResponse.json()
          previewCache.current.set(cacheKey, {
            html: renderData.html,
            notes: renderData.presenterNotes || []
          })
          setPreviewHtml(renderData.html)
          setPresenterNotes(renderData.presenterNotes || [])
        }
      }
    } catch (err) {
      console.error('Failed to load preview:', err)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  // Preview an entire module — fetches all topics in the chosen variant,
  // concatenates them into a single Marp doc, renders once.
  const loadModulePreview = async (module: any, variant: 'full' | 'condensed') => {
    const topics =
      variant === 'full'
        ? (module.fullTopics?.length ? module.fullTopics : module.topics) || []
        : module.condensedTopics || []
    if (!topics.length) return

    const totalSlides = topics.reduce((sum: number, tp: any) => sum + (tp.slideCount || 0), 0)

    // Synthetic "topic" so the existing preview-pane render path works
    const syntheticTopic = {
      id: `module-${module.id}-${variant}`,
      title: module.name,
      slideCount: totalSlides,
      _isModule: true,
      _variant: variant,
    }
    setPreviewTopic(syntheticTopic)

    const cacheKey = `${syntheticTopic.id}_${contentLanguage}`
    const cached = previewCache.current.get(cacheKey)
    if (cached) {
      setPreviewHtml(cached.html)
      setPresenterNotes(cached.notes)
      return
    }

    setPreviewHtml(null)
    setPresenterNotes([])
    setIsLoadingPreview(true)
    try {
      const contents = await Promise.all(
        topics.map((tp: any) =>
          fetch(`/api/content/topic/${tp.id}?language=${contentLanguage}`, { credentials: 'include' })
            .then(res => (res.ok ? res.json() : null))
        ),
      )
      const parts: string[] = []
      for (const data of contents) {
        if (!data?.content) continue
        let content = data.content.replace(/^---[\s\S]*?---\s*/, '')
        content = content.replace(/\n---\s*$/, '').trim()
        if (content) parts.push(content)
      }
      const combined = '---\nmarp: true\ntheme: fastr\npaginate: true\n---\n\n' + parts.join('\n\n---\n\n')
      const renderRes = await fetch('/api/content/render', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: combined }),
      })
      if (renderRes.ok) {
        const data = await renderRes.json()
        previewCache.current.set(cacheKey, {
          html: data.html,
          notes: data.presenterNotes || [],
        })
        setPreviewHtml(data.html)
        setPresenterNotes(data.presenterNotes || [])
      }
    } catch (err) {
      console.error('Failed to load module preview:', err)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  useEffect(() => {
    setPreviewTopic(null)
    setPreviewHtml(null)
    setPresenterNotes([])
  }, [contentLanguage])

  // Build a flat list of all topics with their module info, then filter by search
  const allTopics = React.useMemo(() => {
    const items: Array<{ topic: any; module: any; variant: 'full' | 'condensed' | null }> = []
    for (const module of contentLibrary) {
      const full = module.fullTopics || []
      const condensed = module.condensedTopics || []
      const fallback = !full.length && !condensed.length ? (module.topics || []) : []
      for (const topic of full) items.push({ topic, module, variant: full.length && condensed.length ? 'full' : null })
      for (const topic of condensed) items.push({ topic, module, variant: 'condensed' })
      for (const topic of fallback) items.push({ topic, module, variant: null })
    }
    return items
  }, [contentLibrary])

  const filteredTopics = React.useMemo(() => {
    if (!searchQuery.trim()) return allTopics
    const q = searchQuery.toLowerCase()
    return allTopics.filter(item =>
      item.topic.title.toLowerCase().includes(q) ||
      item.module.name.toLowerCase().includes(q)
    )
  }, [allTopics, searchQuery])

  // Group filtered topics by module for display
  const groupedByModule = React.useMemo(() => {
    const groups: Array<{ module: any; items: typeof filteredTopics }> = []
    const moduleMap = new Map<string, typeof filteredTopics>()
    for (const item of filteredTopics) {
      if (!moduleMap.has(item.module.id)) {
        moduleMap.set(item.module.id, [])
      }
      moduleMap.get(item.module.id)!.push(item)
    }
    for (const module of contentLibrary) {
      const items = moduleMap.get(module.id)
      if (items && items.length > 0) {
        groups.push({ module, items })
      }
    }
    return groups
  }, [filteredTopics, contentLibrary])

  // Group modules under themes. Modules without a theme (imported/external) bucket under '_other'.
  const themedGroups = React.useMemo(() => {
    type ModuleGroup = { module: any; items: typeof filteredTopics }
    const themeOrder: Array<{ id: string; name: string }> = [
      ...themes,
      { id: '_other', name: contentLanguage === 'fr' ? 'Autre contenu' : 'Other content' },
    ]
    const byTheme = new Map<string, ModuleGroup[]>()
    for (const g of groupedByModule) {
      const tid = (g.module as any).theme || '_other'
      if (!byTheme.has(tid)) byTheme.set(tid, [])
      byTheme.get(tid)!.push(g)
    }
    return themeOrder
      .map(t => ({
        id: t.id,
        name: t.name,
        modules: byTheme.get(t.id) || [],
        totalSlides: (byTheme.get(t.id) || []).reduce(
          (sum, mg) => sum + (mg.module.totalSlides || 0), 0
        ),
      }))
      .filter(t => t.modules.length > 0)
  }, [groupedByModule, themes, contentLanguage])

  if (contentLibrary.length === 0) {
    // Skeleton — left panel module rows, right panel empty hint
    return (
      <div className="h-full flex bg-slate-50 min-h-0">
        <div className="w-96 bg-white border-r border-slate-200 p-4 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 py-2 animate-pulse">
              <div className="w-3.5 h-3.5 bg-slate-200 rounded" />
              <div className="h-3 bg-slate-200 rounded flex-1" style={{ width: `${50 + (i % 4) * 12}%` }} />
              <div className="h-3 w-6 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center bg-slate-100">
          <div className="text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            <p className="text-body-sm">{t('loadingContentLibrary', contentLanguage)}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex bg-slate-50 min-h-0">
      {/* Left panel — search + module/topic list */}
      <div className="w-96 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        {/* Search bar */}
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={contentLanguage === 'fr' ? 'Rechercher des sujets…' : 'Search topics…'}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-body-sm placeholder-slate-400 focus:outline-none focus:border-fastr-secondary focus:ring-2 focus:ring-fastr-secondary/20"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); searchInputRef.current?.focus() }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-caption text-slate-500 mt-2">
              {filteredTopics.length} {filteredTopics.length === 1 ? t('result', contentLanguage) : t('results', contentLanguage)}
            </p>
          )}
        </div>

        {/* Module/topic list */}
        <div className="flex-1 overflow-y-auto py-2">
          {groupedByModule.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-body-sm">
              {t('noResultsFound', contentLanguage)}
            </div>
          ) : (
            themedGroups.map((themeGroup) => {
              const isSearching = searchQuery.trim().length > 0
              const themeOpen = isSearching || !collapsedThemes.has(themeGroup.id)
              return (
                <div key={themeGroup.id} className="mb-1">
                  <button
                    onClick={() => {
                      const next = new Set(collapsedThemes)
                      if (next.has(themeGroup.id)) next.delete(themeGroup.id)
                      else next.add(themeGroup.id)
                      setCollapsedThemes(next)
                    }}
                    className="w-full text-left px-4 py-1.5 flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors border-y border-slate-200 focus-ring"
                  >
                    {themeOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    )}
                    <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-600 flex-1">
                      {themeGroup.name}
                    </span>
                    <span className="text-caption text-slate-400">
                      {themeGroup.modules.length} · {themeGroup.totalSlides}
                    </span>
                  </button>
                  {themeOpen && themeGroup.modules.map(({ module, items }) => {
              const isSearching = searchQuery.trim().length > 0
              const isExpanded = isSearching || expandedModules.has(module.id)
              const hasFull = (module.fullTopics?.length || module.topics?.length || 0) > 0
              const hasCondensed = (module.condensedTopics?.length || 0) > 0
              const moduleId = `module-${module.id}-full`
              const moduleCondId = `module-${module.id}-condensed`
              const isModulePreviewing = previewTopic?.id === moduleId || previewTopic?.id === moduleCondId
              // Module pack = the full variant (fall back to the only variant present).
              const packIds: string[] = ((module.fullTopics?.length ? module.fullTopics : module.topics) || []).map((tp: any) => tp.id)
              const packAll = packIds.length > 0 && packIds.every(id => selected.has(id))
              const packSome = !packAll && packIds.some(id => selected.has(id))
              const togglePack = () => setSelected(prev => {
                const next = new Set(prev)
                if (packAll) packIds.forEach(id => next.delete(id))
                else packIds.forEach(id => next.add(id))
                return next
              })
              return (
                <div key={module.id} className="mb-0.5 group">
                  <div className={`w-full flex items-center gap-1 pr-2 ${isModulePreviewing ? 'bg-fastr-light' : ''}`}>
                    <button
                      onClick={togglePack}
                      aria-pressed={packAll}
                      title={contentLanguage === 'fr' ? 'Sélectionner le module complet' : 'Select full module'}
                      aria-label={contentLanguage === 'fr' ? 'Sélectionner le module complet' : 'Select full module'}
                      className="flex-shrink-0 pl-3 pr-0.5 py-2 text-slate-400 hover:text-fastr-primary focus-ring"
                    >
                      {packAll
                        ? <Check className="w-4 h-4 text-fastr-primary" />
                        : packSome
                          ? <Check className="w-4 h-4 text-fastr-primary/40" />
                          : <Square className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        const next = new Set(expandedModules)
                        if (next.has(module.id)) next.delete(module.id)
                        else next.add(module.id)
                        setExpandedModules(next)
                      }}
                      className={`flex-1 text-left px-4 py-2 flex items-center gap-2 transition-colors focus-ring ${
                        isModulePreviewing ? 'text-fastr-primary' : 'hover:bg-slate-50'
                      }`}
                    >
                      <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} aria-hidden />
                      <span className="text-body-sm font-semibold text-slate-800 flex-1 truncate">{module.name}</span>
                      <span className="text-caption text-slate-400">{items.length}</span>
                    </button>
                    {hasFull && hasCondensed ? (
                      <>
                        <button
                          onClick={() => loadModulePreview(module, 'full')}
                          title={t('previewFullModule', contentLanguage)}
                          aria-label={t('previewFullModule', contentLanguage)}
                          className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide transition-colors focus-ring ${
                            previewTopic?.id === moduleId
                              ? 'bg-fastr-primary text-white'
                              : 'bg-fastr-light text-fastr-primary hover:bg-fastr-primary hover:text-white'
                          }`}
                        >
                          {contentLanguage === 'fr' ? 'Complet' : contentLanguage === 'pt' ? 'Completo' : 'Full'}
                        </button>
                        <button
                          onClick={() => loadModulePreview(module, 'condensed')}
                          title={t('previewCondensedModule', contentLanguage)}
                          aria-label={t('previewCondensedModule', contentLanguage)}
                          className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide transition-colors focus-ring ${
                            previewTopic?.id === moduleCondId
                              ? 'bg-amber-500 text-white'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white'
                          }`}
                        >
                          {contentLanguage === 'fr' ? 'Condensé' : contentLanguage === 'pt' ? 'Condensado' : 'Condensed'}
                        </button>
                      </>
                    ) : hasFull ? (
                      <button
                        onClick={() => loadModulePreview(module, 'full')}
                        title={t('previewFullModule', contentLanguage)}
                        aria-label={t('previewFullModule', contentLanguage)}
                        className={`flex-shrink-0 p-1.5 rounded-md transition-colors focus-ring ${
                          previewTopic?.id === moduleId
                            ? 'bg-fastr-primary text-white'
                            : 'text-slate-400 hover:text-fastr-primary hover:bg-white opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                  {isExpanded && (() => {
                    const isActivityTopic = (topic: any) =>
                      /^(activity|activité|atividade)\s*:/i.test(topic.title || '')
                    const activities = items.filter(it => isActivityTopic(it.topic))
                    const contentItems = items.filter(it => !isActivityTopic(it.topic))
                    const showHeaders = activities.length > 0 && contentItems.length > 0
                    const headerActivities = contentLanguage === 'fr' ? 'Activités'
                      : contentLanguage === 'pt' ? 'Atividades' : 'Activities'
                    const headerContent = contentLanguage === 'fr' ? 'Contenu'
                      : contentLanguage === 'pt' ? 'Conteúdo' : 'Content'
                    const renderRow = ({ topic, variant }: typeof items[number]) => {
                      const isChecked = selected.has(topic.id)
                      return (
                        <div
                          key={topic.id}
                          className={`w-full flex items-center transition-colors ${
                            previewTopic?.id === topic.id
                              ? 'bg-fastr-light border-l-2 border-l-fastr-primary'
                              : 'hover:bg-slate-50 border-l-2 border-l-transparent'
                          }`}
                        >
                          <button
                            onClick={() => toggleSelect(topic.id)}
                            aria-pressed={isChecked}
                            aria-label={contentLanguage === 'fr' ? 'Sélectionner la diapositive' : 'Select slide'}
                            className="flex-shrink-0 pl-5 pr-1 py-2 text-slate-400 hover:text-fastr-primary focus-ring"
                          >
                            {isChecked
                              ? <Check className="w-4 h-4 text-fastr-primary" />
                              : <Square className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => loadPreview(topic)}
                            className={`flex-1 min-w-0 text-left pl-1 pr-4 py-2 flex items-center gap-3 focus-ring ${
                              previewTopic?.id === topic.id ? 'text-fastr-primary' : ''
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-body-sm text-slate-800 truncate">{topic.title}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-caption text-slate-500">{topic.slideCount} {t('slides', contentLanguage)}</span>
                                {variant === 'condensed' && (
                                  <span className="inline-flex items-center rounded-pill px-2 py-0 text-[10px] font-semibold uppercase tracking-wide bg-amber-50 text-amber-700">{t('condensed', contentLanguage)}</span>
                                )}
                              </div>
                            </div>
                            <Eye className="w-4 h-4 text-slate-300 flex-shrink-0" aria-hidden />
                          </button>
                        </div>
                      )
                    }
                    return (
                      <div className="pb-1">
                        {showHeaders ? (
                          <>
                            <div className="pl-8 pr-4 pt-1.5 pb-0.5 text-[10px] uppercase tracking-wide font-semibold text-slate-400">{headerActivities}</div>
                            {activities.map(renderRow)}
                            <div className="pl-8 pr-4 pt-2 pb-0.5 text-[10px] uppercase tracking-wide font-semibold text-slate-400">{headerContent}</div>
                            {contentItems.map(renderRow)}
                          </>
                        ) : (
                          items.map(renderRow)
                        )}
                      </div>
                    )
                  })()}
                </div>
              )
            })}
                </div>
              )
            })
          )}

          {/* Templates & structure — consolidated from the old export page */}
          {templates.length > 0 && (() => {
            const tplOpen = searchQuery.trim().length > 0 || !collapsedThemes.has('_templates')
            return (
              <div className="mb-1">
                <button
                  onClick={() => {
                    const next = new Set(collapsedThemes)
                    if (next.has('_templates')) next.delete('_templates')
                    else next.add('_templates')
                    setCollapsedThemes(next)
                  }}
                  className="w-full text-left px-4 py-1.5 flex items-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors border-y border-slate-200 focus-ring"
                >
                  {tplOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  )}
                  <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-600 flex-1">
                    {contentLanguage === 'fr' ? 'Modèles et structure' : 'Templates & structure'}
                  </span>
                </button>
                {tplOpen && templates.map((category: any) => {
                  const tpls = (category.templates || []).filter((tp: any) => !workshopOnlyTemplates.has(tp.id))
                  if (!tpls.length) return null
                  return (
                    <div key={category.id} className="mb-0.5">
                      <div className="px-4 pl-8 py-1.5 text-[11px] uppercase tracking-wide font-semibold text-slate-400">{category.name}</div>
                      {tpls.map((tmpl: any) => {
                        const isChecked = selectedTemplates.has(tmpl.file)
                        const tplPreviewId = `template-${tmpl.id}`
                        return (
                          <div
                            key={tmpl.id}
                            className={`w-full flex items-center transition-colors ${
                              previewTopic?.id === tplPreviewId
                                ? 'bg-fastr-light border-l-2 border-l-fastr-primary'
                                : 'hover:bg-slate-50 border-l-2 border-l-transparent'
                            }`}
                          >
                            <button
                              onClick={() => toggleTemplate(tmpl.file)}
                              aria-pressed={isChecked}
                              aria-label={contentLanguage === 'fr' ? 'Sélectionner le modèle' : 'Select template'}
                              className="flex-shrink-0 pl-5 pr-1 py-2 text-slate-400 hover:text-fastr-primary focus-ring"
                            >
                              {isChecked
                                ? <Check className="w-4 h-4 text-fastr-primary" />
                                : <Square className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => loadTemplatePreview(tmpl)}
                              className={`flex-1 min-w-0 text-left pl-1 pr-4 py-2 flex items-center gap-3 focus-ring ${
                                previewTopic?.id === tplPreviewId ? 'text-fastr-primary' : ''
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-body-sm text-slate-800 truncate">{tmpl.name}</div>
                                {tmpl.preview && <div className="text-caption text-slate-500 truncate mt-0.5">{tmpl.preview}</div>}
                              </div>
                              <Eye className="w-4 h-4 text-slate-300 flex-shrink-0" aria-hidden />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>

        {/* Selection footer — download the ticked slides */}
        {selectedCount > 0 && (
          <div className="border-t border-slate-200 bg-white px-4 py-3 flex-shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-semibold text-slate-800">
                {selectedCount} {contentLanguage === 'fr' ? 'sélectionné(s)' : 'selected'}
              </span>
              <button
                onClick={() => { setSelected(new Set()); setSelectedTemplates(new Set()) }}
                className="text-caption text-slate-500 hover:text-slate-800 focus-ring rounded"
              >
                {contentLanguage === 'fr' ? 'Effacer' : 'Clear'}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => exportSelection('pptx')}
                disabled={isExporting}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-fastr-primary text-white text-body-sm font-semibold hover:bg-fastr-primary/90 disabled:opacity-50 focus-ring"
              >
                {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                PPTX
              </button>
              <button
                onClick={() => exportSelection('pdf')}
                disabled={isExporting}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-slate-300 text-slate-700 text-body-sm font-semibold hover:bg-slate-50 disabled:opacity-50 focus-ring"
              >
                PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right panel — slide preview */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {isLoadingPreview ? (
          <div className="flex-1 flex items-center justify-center bg-slate-900 text-white/70">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="text-body-sm">{t('loadingPreview', contentLanguage)}</p>
            </div>
          </div>
        ) : previewHtml ? (
          <>
            <div className="px-6 py-3 border-b border-slate-200 bg-white flex-shrink-0 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-body font-semibold text-slate-900 m-0 truncate">{previewTopic?.title}</h3>
                  {previewTopic?._isModule && (
                    <span className="inline-flex items-center rounded-pill px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-fastr-light text-fastr-primary">
                      {previewTopic._variant === 'condensed' ? t('condensed', contentLanguage) : t('fullModule', contentLanguage)}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-caption text-slate-500">{previewTopic?.slideCount} {t('slides', contentLanguage)}</span>
            </div>
            <div className="flex-1 min-h-0 bg-slate-900">
              <SlidePreview html={previewHtml} notes={presenterNotes} contentLanguage={contentLanguage} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-100 text-center">
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-slate-200 ring-1 ring-black/5 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-slate-400" aria-hidden />
              </div>
              <p className="text-body-sm text-slate-500">{t('clickToPreview', contentLanguage)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const {
    currentWorkshopId,
    currentConfig,
    workshops,
    loadWorkshops,
    loadContentLibrary,
    contentLanguage,
    setContentLanguage,
    addSession,
    selectWorkshop,
    isLoading,
    error,
    setError,
    saveStatus,
  } = useWorkshopStore()
  const { showToast } = useToast()

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/status', { credentials: 'include' })
        const data = await res.json()
        setIsAuthenticated(data.authenticated)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [])

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: loginPassword }),
      })
      if (res.ok) {
        setIsAuthenticated(true)
        setLoginPassword('')
      } else {
        setLoginError(t('invalidPassword', contentLanguage))
      }
    } catch {
      setLoginError(t('failedToConnect', contentLanguage))
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // Ignore
    }
    setIsAuthenticated(false)
  }

  // App mode - starts with mode selector
  const [appMode, setAppMode] = useState<AppMode>('select')
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set())

  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [addContentDrawerOpen, setAddContentDrawerOpen] = useState(false)
  const [addContentDayNum, setAddContentDayNum] = useState<number | undefined>(undefined)
  const [libraryView, setLibraryView] = useState<'browse' | 'handouts'>('browse')
  const [showWorkshopSelector, setShowWorkshopSelector] = useState(false)
  const [cloneSource, setCloneSource] = useState<WorkshopInfo | null>(null)
  const [cloneForm, setCloneForm] = useState({ newId: '', name: '', country: '', date: '' })
  const [cloneBusy, setCloneBusy] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showNewDeckMenu, setShowNewDeckMenu] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)
  const [editingSession, setEditingSession] = useState<{
    session: Session
    dayNum: number
    index: number
  } | null>(null)
  const [activeDragData, setActiveDragData] = useState<{ id: string; data: any } | null>(null)
  const landingTourRef = useRef<GuidedTourHandle>(null)
  const builderTourRef = useRef<GuidedTourHandle>(null)
  const libraryTourRef = useRef<GuidedTourHandle>(null)
  const settingsTourRef = useRef<GuidedTourHandle>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showCreateWorkshop, setShowCreateWorkshop] = useState(false)
  const [pendingDeckType, setPendingDeckType] = useState<'workshop' | 'webinar'>('workshop')
  const [createMode, setCreateMode] = useState<'manual' | 'ai' | 'upload'>('manual')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiQuestions, setAiQuestions] = useState<string[]>([])
  const [aiAnswers, setAiAnswers] = useState<Record<number, string>>({})
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadText, setUploadText] = useState('')
  const [uploadDragOver, setUploadDragOver] = useState(false)
  const [newWorkshop, setNewWorkshop] = useState({
    name: '',
    country: '',
    location: '',
    days: 3,
    // Webinar-specific
    date: '',
    time: '10:00',
    duration: 90,
  })

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Get store actions
  const { reorderSession, updateSession, removeSession, moveSessionToDay, createWorkshop, deleteWorkshop, cloneWorkshop, setWorkshopLocked, updateWorkshopSettings } = useWorkshopStore()

  // Load data only after authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadWorkshops()
      loadContentLibrary()
    }
  }, [isAuthenticated])

  // Show workshop selector if no workshop is selected (only in workshop mode)
  // Skip while loading — selectWorkshop is async and currentWorkshopId is still null during fetch
  // For webinars: skip the selector list and go straight to the create form
  useEffect(() => {
    if (appMode === 'workshop' && !currentWorkshopId && !isLoading && workshops.length > 0) {
      if (pendingDeckType === 'webinar') {
        setShowWorkshopSelector(true)
        setShowCreateWorkshop(true)
        setCreateMode('manual')
      } else {
        setShowWorkshopSelector(true)
      }
    }
  }, [currentWorkshopId, workshops, appMode, isLoading, pendingDeckType])

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowExportMenu(false)
    if (showExportMenu) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [showExportMenu])

  // Close new-deck menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowNewDeckMenu(false)
    if (showNewDeckMenu) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [showNewDeckMenu])

  // Custom collision detection: library items only target day-column droppables; session items use closestCenter
  const customCollisionDetection: CollisionDetection = (args) => {
    const activeData = args.active.data.current
    if (activeData?.type === 'library-module' || activeData?.type === 'library-topic') {
      // Filter to only day-column droppables (exclude sortable session cards)
      const dayContainers = args.droppableContainers.filter(
        container => container.data.current?.type === 'day-column'
      )
      return rectIntersection({ ...args, droppableContainers: dayContainers })
    }
    return closestCenter(args)
  }

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragData({
      id: event.active.id as string,
      data: event.active.data.current,
    })
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragData(null)
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current
    const overData = over.data.current

    // Case 1: Library module dropped on day column
    if (activeData?.type === 'library-module' && overData?.type === 'day-column') {
      const module = activeData.module as LibraryModule
      const dayNum = overData.dayNum as number
      const allTopics = [...(module.fullTopics || module.topics || [])]
      addSession(dayNum, {
        session: module.name,
        module: module.id,
        topics: allTopics.map((t: any) => t.id),
        slides: allTopics.map((t: any) => t.file),
        duration: allTopics.reduce((sum: number, t: any) => sum + Math.max(15, (t.slideCount || 3) * 3), 0),
      })
      showToast(`${t('addedToDay', contentLanguage)} ${dayNum}: ${module.name}`, 'success')
      return
    }

    // Case 2: Library topic dropped on day column
    if (activeData?.type === 'library-topic' && overData?.type === 'day-column') {
      const topic = activeData.topic as LibraryTopic
      const module = activeData.module as LibraryModule
      const dayNum = overData.dayNum as number
      addSession(dayNum, {
        session: topic.title,
        module: module.id,
        topics: [topic.id],
        slides: [topic.file],
        duration: Math.max(15, (topic.slideCount || 3) * 3),
      })
      showToast(`${t('addedToDay', contentLanguage)} ${dayNum}: ${topic.title}`, 'success')
      return
    }

    // Case 3: Session reorder within a day
    if (active.id === over.id) return
    for (let day = 1; day <= (currentConfig?.schedule?.days || 0); day++) {
      const dayKey = `day${day}`
      const sessions = currentConfig?.schedule?.[dayKey] || []
      const fromIndex = sessions.findIndex((s: any) => s._id === active.id)
      const toIndex = sessions.findIndex((s: any) => s._id === over.id)

      if (fromIndex !== -1 && toIndex !== -1) {
        reorderSession(day, fromIndex, toIndex)
        break
      }
    }
  }

  // Handle move session to another day (quick action)
  const handleMoveToDay = (fromDay: number, fromIdx: number, toDay: number) => {
    moveSessionToDay(fromDay, fromIdx, toDay, -1)
    showToast(`${t('moveToDay', contentLanguage)} ${toDay}`, 'success')
  }

  // Handle edit session
  const handleEditSession = (session: Session, dayNum: number, index: number) => {
    setEditingSession({ session, dayNum, index })
  }

  // Handle save session
  const handleSaveSession = (updates: Partial<Session>) => {
    if (editingSession) {
      updateSession(editingSession.dayNum, editingSession.index, updates)
    }
  }

  // Handle delete session
  const handleDeleteSession = () => {
    if (editingSession) {
      removeSession(editingSession.dayNum, editingSession.index)
    }
  }

  // Shared: convert AI response → config + create workshop
  const buildWorkshopFromAIResponse = async (data: any) => {
    const year = new Date().getFullYear()
    const countrySlug = (data.country || 'workshop').toLowerCase().replace(/\s+/g, '-')
    const workshopId = `${year}-${countrySlug}`
    const isFr = data.language === 'fr'

    const ts = Date.now()
    const schedule: any = {
      days: data.days || 3,
      day_titles: {},
      day_start_times: {},
      day_end_times: {},
    }

    const aiDayStartTimes: Record<string, string> = data.day_start_times || {}
    const aiDayEndTimes: Record<string, string> = data.day_end_times || {}
    const defaultStartTime = data.day_start_time || '09:00'
    const defaultEndTime = data.day_end_time || '17:00'

    for (let d = 1; d <= (data.days || 3); d++) {
      schedule.day_start_times[d] = aiDayStartTimes[d] || aiDayStartTimes[String(d)] || defaultStartTime
      schedule.day_end_times[d] = aiDayEndTimes[d] || aiDayEndTimes[String(d)] || defaultEndTime
      schedule.day_titles[d] = ''

      const aiDaySessions = data.schedule?.[`day${d}`] || []
      const sessions: any[] = []
      let sessionNum = 1

      if (d === 1) {
        sessions.push(
          { _id: `title-${ts}`, session: data.name || (isFr ? 'Atelier FASTR' : 'FASTR Workshop'), type: 'day_title', slides: ['title_slide.md'], duration: 0 },
          { _id: `welcome-${ts}`, session: isFr ? 'Remarques d\'ouverture' : 'Welcome and Opening Remarks', slides: ['welcome_slide.md'], duration: 10 },
          { _id: `intro-${ts}`, session: isFr ? 'Présentations' : 'Introductions', slides: ['introductions_slide.md'], duration: 15 },
          { _id: `agenda1-${ts}`, session: isFr ? 'Agenda Jour 1' : 'Day 1 Agenda', type: 'section', duration: 5 },
          { _id: `obj-${ts}`, session: isFr ? 'Objectifs de l\'atelier' : 'Workshop Objectives', slides: ['objectives_slide.md'], duration: 5 },
          { _id: `exp-${ts}`, session: isFr ? 'Attentes' : 'Expectations', slides: ['expectations_slide.md'], duration: 15 },
          { _id: `outputs-${ts}`, session: isFr ? 'Résultats attendus' : 'Expected Outputs', slides: ['expected_outputs_slide.md'], duration: 5 }
        )
      } else {
        sessions.push(
          { _id: `daytitle-${d}-${ts}`, session: isFr ? `Jour ${d}` : `Day ${d}`, type: 'day_title', slides: ['day_title.md'], duration: 0 },
          { _id: `recap-${d}-${ts}`, session: isFr ? `Récapitulatif : Jour ${d - 1}` : `Recap: Day ${d - 1}`, type: 'day_recap', duration: 10 },
          { _id: `agenda-${d}-${ts}`, session: isFr ? `Agenda Jour ${d}` : `Day ${d} Agenda`, type: 'section', duration: 5 }
        )
      }

      const optionalSessions: any[] = []
      for (const aiSession of aiDaySessions) {
        const sessionObj: any = {
          _id: `session-${d}-${sessionNum++}-${ts}`,
          session: aiSession.session,
          duration: aiSession.duration || 60,
        }

        if (aiSession.module) {
          sessionObj.module = aiSession.module
          sessionObj.version = aiSession.version
        } else if (aiSession.type === 'break') {
          sessionObj._id = `break-${d}-${sessionNum}-${ts}`
          sessionObj.type = 'break'
          sessionObj.duration = aiSession.duration || 15
        } else if (aiSession.type === 'custom') {
          sessionObj._id = `custom-${d}-${sessionNum}-${ts}`
          sessionObj.type = 'custom'
          sessionObj.duration = aiSession.duration || 30
        }

        if (aiSession.optional) {
          sessionObj.optional = true
          optionalSessions.push(sessionObj)
        } else {
          sessions.push(sessionObj)
        }
      }

      sessions.push({
        _id: `dayend-${d}-${ts}`,
        session: isFr ? `Fin du Jour ${d}` : `End of Day ${d}`,
        type: 'day_end',
        slides: ['day_end.md'],
        duration: 5,
      })

      if (optionalSessions.length > 0) {
        sessions.push(...optionalSessions)
      }

      schedule[`day${d}`] = sessions
    }

    const config = {
      workshop: {
        name: data.name || 'FASTR Workshop',
        title: data.title || '',
        subtitle: data.subtitle || '',
        country: data.country || '',
        location: data.location || '',
        date: data.date || '',
        start_date: data.start_date || '',
        end_date: data.end_date || '',
        facilitators: data.facilitators || '',
        objectives: data.objectives || '',
        expected_outputs: data.expected_outputs || '',
        language: data.language || 'en',
      },
      schedule,
      content: {
        modules: data.modules || [],
        custom_slides: [],
      },
    }

    if (data.language === 'fr' || data.language === 'french') {
      setContentLanguage('fr')
    }

    if (data._warnings && Array.isArray(data._warnings) && data._warnings.length > 0) {
      setTimeout(() => {
        showToast(t('scheduleOverflowWarning', contentLanguage), 'info')
      }, 500)
    }

    await createWorkshop(workshopId, config)
    setShowCreateWorkshop(false)
    setShowWorkshopSelector(false)
  }

  // Build webinar deck from AI response
  const buildWebinarFromAIResponse = async (data: any) => {
    const year = new Date().getFullYear()
    const nameSlug = (data.name || 'webinar').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const workshopId = `${year}-${nameSlug}-webinar`

    const ts = Date.now()
    const sessions: any[] = []

    if (Array.isArray(data.slides)) {
      for (let i = 0; i < data.slides.length; i++) {
        const slide = data.slides[i]
        const sessionObj: any = {
          _id: slide._id || `webinar-${i}-${ts}`,
          session: slide.session || slide.name || '',
          slides: slide.slides || (slide.file ? [slide.file] : []),
          duration: slide.duration || 5,
        }
        // Don't set module — webinar sessions reference individual slides via the slides array.
        // Setting module would cause deckBuilder to load ALL slides from that module.
        if (slide.type === 'engagement') {
          sessionObj.icon = 'demo'
        }
        sessions.push(sessionObj)
      }
    }

    const schedule: any = {
      days: 1,
      day_start_times: { 1: '10:00' },
      day1: sessions,
    }

    const config = {
      workshop: {
        name: data.name || 'Webinar',
        country: data.country || '',
        location: '',
        date: '',
        facilitators: '',
        deckType: 'webinar' as const,
        time: '10:00',
        duration: data.duration || 90,
        language: data.language || 'en',
      },
      schedule,
      content: {
        modules: [],
        custom_slides: [],
      },
    }

    if (data.language === 'fr') {
      setContentLanguage('fr')
    }

    await createWorkshop(workshopId, config)
    setShowCreateWorkshop(false)
    setShowWorkshopSelector(false)
  }

  // Handle AI workshop generation - creates workshop directly
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError(pendingDeckType === 'webinar' ? t('describeWebinar', contentLanguage) : t('pleaseDescribeWorkshop', contentLanguage))
      return
    }

    setAiGenerating(true)
    try {
      // Build request body — include clarifications if answering questions
      const body: any = { prompt: aiPrompt }
      if (aiQuestions.length > 0) {
        body.clarifications = aiQuestions.map((q, i) => ({
          question: q,
          answer: aiAnswers[i] || '',
        }))
      }

      // Use different endpoint for webinars vs workshops
      const endpoint = pendingDeckType === 'webinar' ? '/api/ai/generate-webinar' : '/api/ai/generate-workshop'

      const response = await fetch(endpoint, { credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error(pendingDeckType === 'webinar' ? 'Failed to generate webinar' : 'Failed to generate workshop')

      const data = await response.json()

      // Phase 1: AI needs more info — show questions
      if (data.needsClarification && data.questions) {
        setAiQuestions(data.questions)
        setAiAnswers({})
        setAiGenerating(false)
        return
      }

      // Use appropriate builder
      if (pendingDeckType === 'webinar') {
        await buildWebinarFromAIResponse(data)
      } else {
        await buildWorkshopFromAIResponse(data)
      }
      setAiPrompt('')
      setAiQuestions([])
      setAiAnswers({})
    } catch (err: any) {
      setError(err.message)
    } finally {
      setAiGenerating(false)
    }
  }

  // Handle upload agenda → parse → create workshop
  const handleUploadAgenda = async () => {
    if (!uploadFile && !uploadText.trim()) {
      setError(contentLanguage === 'fr' ? 'Veuillez importer un fichier ou coller votre agenda' : 'Please upload a file or paste your agenda')
      return
    }

    setAiGenerating(true)
    try {
      let response: Response

      if (uploadFile) {
        const formData = new FormData()
        formData.append('file', uploadFile)
        response = await fetch('/api/ai/parse-agenda', {
          credentials: 'include',
          method: 'POST',
          body: formData,
        })
      } else {
        response = await fetch('/api/ai/parse-agenda', {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: uploadText }),
        })
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Failed to parse agenda' }))
        throw new Error(err.error || 'Failed to parse agenda')
      }

      const data = await response.json()
      await buildWorkshopFromAIResponse(data)
      setUploadFile(null)
      setUploadText('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setAiGenerating(false)
    }
  }

  // Handle create new workshop
  const handleCreateWorkshop = async () => {
    if (!newWorkshop.name || !newWorkshop.country) {
      setError(t('pleaseCompleteRequired', contentLanguage))
      return
    }

    const isWebinar = pendingDeckType === 'webinar'

    // Generate workshop ID from year and name slug
    const year = new Date().getFullYear()
    const nameSlug = newWorkshop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const workshopId = isWebinar
      ? `${year}-${nameSlug}-webinar`
      : `${year}-${newWorkshop.country.toLowerCase().replace(/\s+/g, '-')}`

    const ts = Date.now()

    if (isWebinar) {
      // ── Webinar creation: flat single-day with just a title slide ──
      const schedule: any = {
        days: 1,
        day_start_times: { 1: newWorkshop.time || '10:00' },
        day1: [
          {
            _id: `title-slide-${ts}`,
            session: newWorkshop.name || 'Webinar',
            slides: ['title_slide.md'],
            duration: 0,
            icon: 'cover',
          },
        ],
      }

      const config = {
        workshop: {
          name: newWorkshop.name,
          country: newWorkshop.country,
          location: newWorkshop.location,
          date: newWorkshop.date || '',
          facilitators: '',
          deckType: 'webinar' as const,
          time: newWorkshop.time || '10:00',
          duration: newWorkshop.duration || 90,
        },
        schedule,
        content: {
          modules: [],
          custom_slides: [],
        },
      }

      await createWorkshop(workshopId, config)
    } else {
      // ── Workshop creation (existing logic) ──
      // Create initial schedule with empty days
      const schedule: any = {
        days: newWorkshop.days,
        day_titles: {},
        day_start_times: {},
        day_end_times: {},
      }

      // Add starter sessions for each day
      for (let d = 1; d <= newWorkshop.days; d++) {
        schedule.day_start_times[d] = '09:00'
        schedule.day_end_times[d] = '17:00'
        schedule.day_titles[d] = ''

        if (d === 1) {
          // Day 1 has required opening sequence
          schedule[`day${d}`] = [
            {
              _id: `title-slide-${ts}`,
              session: newWorkshop.name || 'FASTR Workshop',
              type: 'day_title',
              slides: ['title_slide.md'],
              duration: 0,
              icon: 'cover',
            },
            {
              _id: `welcome-${ts}`,
              session: 'Welcome and Opening Remarks',
              slides: ['welcome_slide.md'],
              duration: 10,
              icon: 'welcome',
            },
            {
              _id: `introductions-${ts}`,
              session: 'Introductions',
              slides: ['introductions_slide.md'],
              duration: 15,
              icon: 'people',
            },
            {
              _id: `day-agenda-1-${ts}`,
              session: 'Day 1 Agenda',
              type: 'section',
              duration: 5,
              icon: 'list',
            },
            {
              _id: `objectives-${ts}`,
              session: 'Workshop Objectives',
              slides: ['objectives_slide.md'],
              duration: 10,
              icon: 'target',
            },
            {
              _id: `expectations-${ts}`,
              session: 'Expectations',
              slides: ['expectations_slide.md'],
              duration: 10,
              icon: 'clipboard',
            },
            {
              _id: `expected-outputs-${ts}`,
              session: 'Expected Outputs',
              slides: ['expected_outputs_slide.md'],
              duration: 10,
              icon: 'output',
            },
            {
              _id: `session-1-${ts}`,
              session: 'Session 1',
              duration: 60,
              icon: 'presentation',
            },
            {
              _id: `break-tea-morning-1-${ts}`,
              session: 'Tea Break',
              type: 'break',
              duration: 15,
            },
            {
              _id: `lunch-1-${ts}`,
              session: 'Lunch Break',
              type: 'break',
              duration: 60,
            },
            {
              _id: `day-end-1-${ts}`,
              session: 'End of Day 1',
              type: 'day_end',
              slides: ['day_end.md'],
              duration: 5,
            },
          ]
        } else {
          // Day 2+ has recap and standard structure
          schedule[`day${d}`] = [
            {
              _id: `day-title-${d}-${ts}`,
              session: `Day ${d}`,
              type: 'day_title',
              slides: ['day_title.md'],
              duration: 0,
            },
            {
              _id: `day-recap-${d}-${ts}`,
              session: `Recap: Day ${d - 1}`,
              type: 'day_recap',
              duration: 10,
            },
            {
              _id: `day-agenda-${d}-${ts}`,
              session: `Day ${d} Agenda`,
              type: 'section',
              duration: 5,
            },
            {
              _id: `session-${d}-1-${ts}`,
              session: 'Session 1',
              duration: 60,
              icon: 'presentation',
            },
            {
              _id: `break-tea-morning-${d}-${ts}`,
              session: 'Tea Break',
              type: 'break',
              duration: 15,
            },
            {
              _id: `lunch-${d}-${ts}`,
              session: 'Lunch Break',
              type: 'break',
              duration: 60,
            },
            {
              _id: `day-end-${d}-${ts}`,
              session: `End of Day ${d}`,
              type: 'day_end',
              slides: ['day_end.md'],
              duration: 5,
            },
          ]
        }
      }

      // Check for AI-generated content
      const aiObjectives = sessionStorage.getItem('ai_objectives')
      const aiExpectedOutputs = sessionStorage.getItem('ai_expected_outputs')
      sessionStorage.removeItem('ai_objectives')
      sessionStorage.removeItem('ai_expected_outputs')

      const config = {
        workshop: {
          name: newWorkshop.name,
          country: newWorkshop.country,
          location: newWorkshop.location,
          date: '',
          facilitators: '',
          objectives: aiObjectives || '',
          expected_outputs: aiExpectedOutputs || '',
        },
        schedule,
        content: {
          modules: [],
          custom_slides: [],
        },
      }

      await createWorkshop(workshopId, config)
    }

    setShowCreateWorkshop(false)
    setShowWorkshopSelector(false)
    setNewWorkshop({ name: '', country: '', location: '', days: 3, date: '', time: '10:00', duration: 90 })
  }

  // Build deck
  const handleBuild = async (format: 'html' | 'pdf' | 'pptx') => {
    if (!currentWorkshopId) return
    setIsBuilding(true)
    setShowExportMenu(false)

    try {
      let downloadUrl = ''
      let response: Response

      if (format === 'html') {
        response = await fetch(`/api/export/${currentWorkshopId}/html`, { method: 'POST', credentials: 'include' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/html`
      } else if (format === 'pdf') {
        response = await fetch(`/api/export/${currentWorkshopId}/pdf`, { method: 'POST', credentials: 'include' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/pdf`
      } else if (format === 'pptx') {
        response = await fetch(`/api/export/${currentWorkshopId}/pptx`, { method: 'POST', credentials: 'include' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/pptx`
      } else {
        return
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || `Export failed (${response.status})`)
      }

      window.open(downloadUrl, '_blank')
    } catch (error: any) {
      showToast(`Build failed: ${error.message}`, 'error')
    }
    setIsBuilding(false)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Auth Loading State
  // ─────────────────────────────────────────────────────────────────────────
  if (isCheckingAuth) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-fastr-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Login Page
  // ─────────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-fastr-primary flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-white/20">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">FASTR Deck Builder</h1>
            <p className="text-white/70">{t('enterPasswordToContinue', contentLanguage)}</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5 border border-slate-200">
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('teamPassword', contentLanguage)}
              </label>
              <input
                type="password"
                id="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors"
                placeholder="Enter password"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !loginPassword}
              className="w-full py-3 bg-fastr-primary text-white rounded-lg font-medium hover:bg-fastr-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t('signingIn', contentLanguage)}
                </>
              ) : (
                t('signIn', contentLanguage)
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Shell wrapper — every authenticated, non-modal screen uses this layout
  // ─────────────────────────────────────────────────────────────────────────
  function renderShell(args: {
    section: string
    breadcrumb?: string
    searchPlaceholder?: string
    primaryAction?: React.ReactNode
    topbarActions?: React.ReactNode
    children: React.ReactNode
  }) {
    return (
      <AppShell
        activeNav={mapModeToNav(appMode)}
        onNavChange={(id) => {
          if (id === 'workshops') setAppMode('select')
          else if (id === 'library') setAppMode('library')
          else if (id === 'settings') setAppMode('settings')
        }}
        language={contentLanguage}
        onLanguageChange={setContentLanguage}
        signOutLabel={t('signOut', contentLanguage)}
        onSignOut={handleLogout}
        workshopsLabel={t('navWorkshops', contentLanguage)}
        libraryLabel={t('navLibrary', contentLanguage)}
        settingsLabel={t('navSettings', contentLanguage)}
        section={args.section}
        breadcrumb={args.breadcrumb}
        searchPlaceholder={args.searchPlaceholder}
        primaryAction={args.primaryAction}
        topbarActions={args.topbarActions}
      >
        {args.children}
      </AppShell>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Landing Page / Mode Selector
  // ─────────────────────────────────────────────────────────────────────────
  if (appMode === 'select') {
    // Group workshops by country
    const workshopsByCountry: Record<string, typeof workshops> = {}
    workshops.forEach(w => {
      const country = w.country || 'Other'
      if (!workshopsByCountry[country]) workshopsByCountry[country] = []
      workshopsByCountry[country].push(w)
    })
    const countries = Object.keys(workshopsByCountry).sort()

    const toggleCountry = (country: string) => {
      const next = new Set(expandedCountries)
      if (next.has(country)) {
        next.delete(country)
      } else {
        next.add(country)
      }
      setExpandedCountries(next)
    }

    const landingPrimary = (
      <div className="relative" data-tour="new-workshop">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowNewDeckMenu(!showNewDeckMenu)
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newWorkshop', contentLanguage)}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {showNewDeckMenu && (
          <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl shadow-lg ring-1 ring-black/5 border border-slate-200 py-1 z-30">
            <button
              onClick={() => {
                setShowNewDeckMenu(false)
                setPendingDeckType('workshop')
                setAppMode('workshop')
              }}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 focus-ring"
            >
              <Presentation className="w-5 h-5 text-fastr-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-body-sm font-semibold text-slate-900">{t('buildSlideDeck', contentLanguage)}</div>
                <div className="text-caption text-slate-500 mt-0.5">{t('workshopDeckDesc', contentLanguage)}</div>
              </div>
            </button>
            <button
              onClick={() => {
                setShowNewDeckMenu(false)
                setPendingDeckType('webinar')
                setAppMode('workshop')
              }}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 focus-ring"
            >
              <Monitor className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-body-sm font-semibold text-slate-900">{t('buildWebinar', contentLanguage)}</div>
                <div className="text-caption text-slate-500 mt-0.5">{t('webinarDeckDesc', contentLanguage)}</div>
              </div>
            </button>
          </div>
        )}
      </div>
    )

    return renderShell({
      section: t('navWorkshops', contentLanguage),
      breadcrumb: undefined,
      primaryAction: landingPrimary,
      children: (
        <div className="h-full overflow-auto p-8">
          <div className="max-w-5xl mx-auto">
          {workshops.length > 0 ? (
            <div data-tour="existing-decks">
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">{t('existingDecks', contentLanguage)}</h3>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm ring-1 ring-black/5 overflow-hidden divide-y divide-slate-100">
                {countries.map(country => (
                  <div key={country} className="border-b border-slate-100 last:border-b-0">
                    <button
                      onClick={() => toggleCountry(country)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left focus-ring"
                    >
                      {expandedCountries.has(country) ? (
                        <FolderOpen className="w-5 h-5 text-fastr-primary" />
                      ) : (
                        <Folder className="w-5 h-5 text-slate-400" />
                      )}
                      <span className="text-body-sm font-semibold text-slate-800">{country}</span>
                      <span className="text-caption text-slate-500">({workshopsByCountry[country].length})</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto transition-transform ${expandedCountries.has(country) ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedCountries.has(country) && (
                      <div className="bg-slate-50 border-t border-slate-100">
                        {workshopsByCountry[country].map(workshop => (
                          <div
                            key={workshop.id}
                            className="group flex items-center hover:bg-slate-100 transition-colors"
                          >
                            <button
                              onClick={() => {
                                selectWorkshop(workshop.id)
                                setPendingDeckType((workshop as any).deckType || 'workshop')
                                setAppMode('workshop')
                              }}
                              className="flex-1 px-4 py-2 pl-12 flex items-center gap-3 text-left focus-ring"
                            >
                              <FileText className="w-4 h-4 text-slate-400" />
                              <span className="text-body-sm text-slate-700">{workshop.name}</span>
                              {(workshop as any).deckType === 'webinar' && (
                                <span className="inline-flex items-center rounded-pill px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-indigo-50 text-indigo-700">
                                  {t('webinarBadge', contentLanguage)}
                                </span>
                              )}
                              {workshop.locked && <Lock className="w-3 h-3 text-amber-500 ml-auto" />}
                            </button>
                            {!workshop.locked && (
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation()
                                  const confirmMsg = contentLanguage === 'fr'
                                    ? `Supprimer le deck « ${workshop.name} » ? Cette action est irréversible.`
                                    : `Delete the deck "${workshop.name}"? This cannot be undone.`
                                  if (!window.confirm(confirmMsg)) return
                                  try {
                                    await deleteWorkshop(workshop.id)
                                    showToast(
                                      contentLanguage === 'fr' ? 'Deck supprimé' : 'Deck deleted',
                                      'success'
                                    )
                                  } catch (err) {
                                    showToast(
                                      contentLanguage === 'fr' ? 'Échec de la suppression' : 'Delete failed',
                                      'error'
                                    )
                                  }
                                }}
                                className="px-3 py-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600 focus-ring rounded"
                                title={contentLanguage === 'fr' ? 'Supprimer ce deck' : 'Delete this deck'}
                                aria-label={contentLanguage === 'fr' ? 'Supprimer ce deck' : 'Delete this deck'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 ring-1 ring-black/5 shadow-sm p-12 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-fastr-light flex items-center justify-center">
                <Presentation className="w-7 h-7 text-fastr-primary" />
              </div>
              <h2 className="text-h2 text-slate-900 m-0 mb-1">{t('noWorkshopsYet', contentLanguage)}</h2>
              <p className="text-body-sm text-slate-500 mb-5">{t('noWorkshopsYetDesc', contentLanguage)}</p>
              <button
                onClick={() => { setPendingDeckType('workshop'); setAppMode('workshop') }}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>{t('newWorkshop', contentLanguage)}</span>
              </button>
            </div>
          )}
          </div>
          <GuidedTour
            ref={landingTourRef}
            tour="landing"
            language={contentLanguage}
            workshopCount={workshops.length}
          />
          <HelpButton
            onClick={() => setShowHelp(true)}
            language={contentLanguage}
          />
          <HelpPanel
            open={showHelp}
            onClose={() => setShowHelp(false)}
            language={contentLanguage}
            view="landing"
            onStartTour={() => landingTourRef.current?.startTour()}
          />
        </div>
      ),
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Content Library (Browse + Select-for-export modes)
  // ─────────────────────────────────────────────────────────────────────────
  if (appMode === 'library') {
    const effectiveLibraryView: 'browse' | 'handouts' = libraryView

    const libraryToggle = (
      <div className="inline-flex items-stretch border border-slate-200 bg-white rounded-lg p-0.5" data-tour="library-views">
        <button
          onClick={() => setLibraryView('browse')}
          aria-pressed={effectiveLibraryView === 'browse'}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-body-sm font-semibold transition-colors ${
            effectiveLibraryView === 'browse' ? 'bg-fastr-primary text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          {t('slidesTab', contentLanguage)}
        </button>
        <button
          onClick={() => setLibraryView('handouts')}
          aria-pressed={effectiveLibraryView === 'handouts'}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-body-sm font-semibold transition-colors ${
            effectiveLibraryView === 'handouts' ? 'bg-fastr-primary text-white' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          {t('handoutsTab', contentLanguage)}
        </button>
      </div>
    )

    let libraryChild
    if (effectiveLibraryView === 'handouts') {
      libraryChild = (
        <div className="h-full overflow-y-auto p-4">
          <div className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-lg">
            <HandoutsPanel />
          </div>
        </div>
      )
    } else {
      libraryChild = <LibraryMode />
    }

    return renderShell({
      section: t('navLibrary', contentLanguage),
      topbarActions: libraryToggle,
      children: (
        <>
          {libraryChild}
          <GuidedTour ref={libraryTourRef} tour="library" language={contentLanguage} />
          <HelpButton onClick={() => setShowHelp(true)} language={contentLanguage} />
          <HelpPanel
            open={showHelp}
            onClose={() => setShowHelp(false)}
            language={contentLanguage}
            view="library"
            onStartTour={() => libraryTourRef.current?.startTour()}
          />
        </>
      ),
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Import Mode
  // ─────────────────────────────────────────────────────────────────────────
  if (appMode === 'import') {
    return (
      <SlideImportWizard
        onBack={() => setAppMode('workshop')}
        onGoToLibrary={() => setAppMode('workshop')}
        language={contentLanguage}
      />
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Settings Mode
  // ─────────────────────────────────────────────────────────────────────────
  if (appMode === 'settings') {
    return renderShell({
      section: t('navSettings', contentLanguage),
      children: (
        <>
          <SettingsPage />
          <GuidedTour ref={settingsTourRef} tour="settings" language={contentLanguage} />
          <HelpButton onClick={() => setShowHelp(true)} language={contentLanguage} />
          <HelpPanel
            open={showHelp}
            onClose={() => setShowHelp(false)}
            language={contentLanguage}
            view="settings"
            onStartTour={() => settingsTourRef.current?.startTour()}
          />
        </>
      ),
    })
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Workshop Mode (default) — wrapped in AppShell with the toolbar in topbar
  // ─────────────────────────────────────────────────────────────────────────
  const workshopSection = currentConfig?.workshop?.name || currentWorkshopId || t('navWorkshops', contentLanguage)
  const totalDays = currentConfig?.schedule?.days || 0
  const workshopBreadcrumb = totalDays > 0
    ? `${totalDays} ${totalDays === 1 ? t('day', contentLanguage) : t('day', contentLanguage) + 's'}`
    : undefined

  const workshopTopbarActions = (
    <>
      {/* Auto-save pill — visible state, retry on failure */}
      {saveStatus === 'saving' && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-caption font-semibold bg-slate-100 text-slate-600">
          <RefreshCw className="w-3 h-3 animate-spin" />
          {t('saving', contentLanguage)}
        </span>
      )}
      {saveStatus === 'saved' && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-caption font-semibold bg-emerald-50 text-emerald-700">
          <Check className="w-3 h-3" />
          {t('saved', contentLanguage)}
        </span>
      )}
      {saveStatus === 'error' && (
        <button
          onClick={() => useWorkshopStore.getState().saveCurrentWorkshop()}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-caption font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors focus-ring"
          title={t('saveFailed', contentLanguage)}
        >
          <AlertTriangle className="w-3 h-3" />
          {t('saveFailed', contentLanguage)} · {t('retry', contentLanguage)}
        </button>
      )}

      <button
        onClick={() => setRightPanelOpen(!rightPanelOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-body-sm font-semibold transition-colors focus-ring ${
          rightPanelOpen
            ? 'bg-fastr-primary text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        title={t('aiHelp', contentLanguage)}
        aria-pressed={rightPanelOpen}
        data-tour="toolbar-ai"
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden xl:inline">{t('aiHelp', contentLanguage)}</span>
      </button>

      <div className="w-px h-6 bg-slate-200 mx-1" />

      <button
        onClick={() => setShowPreview(!showPreview)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-body-sm font-semibold transition-colors focus-ring ${
          showPreview
            ? 'bg-fastr-primary text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
        title={t('preview', contentLanguage)}
        aria-pressed={showPreview}
      >
        <Eye className="w-4 h-4" />
        <span className="hidden xl:inline">{t('preview', contentLanguage)}</span>
      </button>

      <button
        onClick={() => setShowSettings(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-body-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors focus-ring"
        title={t('workshopDetails', contentLanguage)}
      >
        <Settings className="w-4 h-4" />
        <span className="hidden xl:inline">{t('workshopDetails', contentLanguage)}</span>
      </button>

      {currentWorkshopId && (
        <button
          onClick={() => setShowWorkshopSelector(true)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-body-sm text-slate-500 hover:bg-slate-100 transition-colors focus-ring"
          title={t('selectWorkshop', contentLanguage)}
        >
          <FolderOpen className="w-4 h-4" />
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      )}
    </>
  )

  const workshopPrimary = (
    <div className="relative" data-tour="toolbar-export">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowExportMenu(!showExportMenu)
        }}
        disabled={isBuilding || !currentWorkshopId}
        className="btn-accent"
      >
        {isBuilding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        <span>{t('export', contentLanguage)}</span>
        <ChevronDown className="w-4 h-4" />
      </button>
      {showExportMenu && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black/5 border border-slate-200 py-1 z-30">
          <button onClick={() => handleBuild('html')} className="w-full flex items-center gap-2 px-4 py-2 text-body-sm text-slate-700 hover:bg-slate-50">
            <Eye className="w-4 h-4 text-slate-400" />
            <span>{t('exportHTML', contentLanguage)}</span>
          </button>
          <button onClick={() => handleBuild('pdf')} className="w-full flex items-center gap-2 px-4 py-2 text-body-sm text-slate-700 hover:bg-slate-50">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>{t('exportPDF', contentLanguage)}</span>
          </button>
          <button onClick={() => handleBuild('pptx')} className="w-full flex items-center gap-2 px-4 py-2 text-body-sm text-slate-700 hover:bg-slate-50">
            <Presentation className="w-4 h-4 text-slate-400" />
            <span>{t('exportPowerPoint', contentLanguage)}</span>
          </button>
        </div>
      )}
    </div>
  )

  // Workshop authoring is rendered WITHOUT the global sidebar — the sidebar's
  // job is to switch between top-level surfaces, but inside a workshop the user
  // is focused on building. A "← Workshops" back button + topbar actions cover
  // navigation. The drawer/preview/AI panel still work the same way.
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-4 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setAppMode('select')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-body-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors focus-ring"
            title={t('navWorkshops', contentLanguage)}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{t('navWorkshops', contentLanguage)}</span>
          </button>
          <span className="text-slate-300">/</span>
          <h1 className="text-body font-semibold text-slate-900 m-0 truncate">{workshopSection}</h1>
          {workshopBreadcrumb && (
            <>
              <span className="text-slate-300 hidden md:inline">·</span>
              <span className="text-caption text-slate-500 hidden md:inline truncate">{workshopBreadcrumb}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {workshopTopbarActions}
          {workshopPrimary}
        </div>
      </header>
      <div className="flex-1 flex flex-col min-h-0">
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2.5 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span className="flex-1 text-sm">{error}</span>
          <button onClick={() => setError(null)} aria-label="Dismiss error" className="p-1 rounded-md text-red-400 hover:text-red-600 hover:bg-red-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main content */}
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
      <div className="flex-1 flex overflow-hidden relative">
        {/* Center - Main content. When the AddContentDrawer OR AI panel is open
            we reserve 400px / 320px on the right so day columns stay visible. */}
        <main
          className={`flex-1 overflow-hidden transition-[padding] duration-200 ${
            addContentDrawerOpen ? 'pr-[400px]' : rightPanelOpen ? 'pr-80' : ''
          }`}
        >
          {currentWorkshopId ? (
            showPreview ? (
              <SlideSorter onBack={() => setShowPreview(false)} />
            ) : (
              <>
                  <div className="h-full overflow-auto p-4">
                    <div className="max-w-7xl mx-auto">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {currentConfig?.workshop?.name || 'Workshop'}
                        {(currentConfig?.workshop as any)?.deckType === 'webinar' && (
                          <span className="ml-2 text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-600 font-medium align-middle">
                            {t('webinarBadge', contentLanguage)}
                          </span>
                        )}
                      </h2>

                      {(currentConfig?.workshop as any)?.deckType === 'webinar' ? (
                        /* ── Webinar mode: single vertical slide list ── */
                        (() => {
                          const sessions = (currentConfig?.schedule?.day1 || []).map(
                            (s: any, idx: number) => ({
                              ...s,
                              _id: s._id || `day1-${idx}`,
                            })
                          )
                          return (
                            <div className="max-w-2xl mx-auto" data-tour="schedule-area">
                              <DroppableDayColumn dayNum={1}>
                                <div className="p-3 space-y-2 min-h-[200px]">
                                  <SortableContext
                                    items={sessions.map((s: any) => s._id)}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    {sessions.map((session: any, idx: number) => (
                                      <SortableSessionCard
                                        key={session._id}
                                        session={session}
                                        index={idx}
                                        dayNum={1}
                                        totalDays={1}
                                        totalSessions={sessions.length}
                                        onEdit={handleEditSession}
                                        onMoveToDay={handleMoveToDay}
                                      />
                                    ))}
                                  </SortableContext>

                                  {/* + Add content — opens AddContentDrawer */}
                                  <button
                                    className="w-full py-2 px-3 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 hover:border-fastr-secondary hover:text-fastr-secondary hover:bg-fastr-secondary/5 transition-colors flex items-center justify-center gap-2 focus-ring"
                                    onClick={() => {
                                      setAddContentDayNum(1)
                                      setAddContentDrawerOpen(true)
                                    }}
                                    data-tour="add-content-btn"
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-body-sm font-semibold">{t('addContent', contentLanguage)}</span>
                                  </button>
                                </div>
                              </DroppableDayColumn>

                              {/* Slide count + duration summary */}
                              <div className="mt-3 text-center text-xs text-gray-400">
                                {sessions.length} {t('webinarSlides', contentLanguage)}
                                {(currentConfig?.workshop as any)?.duration && (
                                  <span className="ml-2">
                                    ({(currentConfig?.workshop as any).duration} min)
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })()
                      ) : (
                        /* ── Workshop mode: Kanban day columns ── */
                        <div className="flex gap-4 overflow-x-auto pb-4" data-tour="schedule-area">
                          {Array.from({ length: currentConfig?.schedule?.days || 0 }).map((_, i) => {
                            const dayNum = i + 1
                            const dayKey = `day${dayNum}`
                            const startTimeStr = currentConfig?.schedule?.day_start_times?.[dayNum] || '09:00'

                            // Calculate cumulative times for each session
                            let currentMinutes = parseInt(startTimeStr.split(':')[0]) * 60 + parseInt(startTimeStr.split(':')[1] || '0')
                            const sessions = (currentConfig?.schedule?.[dayKey] || []).map(
                              (s: any, idx: number) => {
                                const sessionStart = currentMinutes
                                currentMinutes += (s.duration || 0)
                                const startHour = Math.floor(sessionStart / 60)
                                const startMin = sessionStart % 60
                                const endHour = Math.floor(currentMinutes / 60)
                                const endMin = currentMinutes % 60
                                return {
                                  ...s,
                                  _id: s._id || `${dayKey}-${idx}`,
                                  _startTime: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
                                  _endTime: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
                                }
                              }
                            )

                            return (
                              <DroppableDayColumn key={dayNum} dayNum={dayNum}>
                                {/* Day header */}
                                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-fastr-primary to-fastr-primary-light rounded-t-xl">
                                  <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-semibold text-white">
                                      Day {dayNum}
                                      {currentConfig?.schedule?.day_titles?.[dayNum] && (
                                        <span className="text-white/60 font-normal ml-1">
                                          - {currentConfig.schedule.day_titles[dayNum]}
                                        </span>
                                      )}
                                    </h3>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <button
                                        onClick={() => {
                                          setAddContentDayNum(dayNum)
                                          setAddContentDrawerOpen(true)
                                        }}
                                        {...(dayNum === 1 ? { 'data-tour': 'add-content-btn' } : {})}
                                        title={t('addContent', contentLanguage)}
                                        className="flex items-center gap-1 px-2 py-1 rounded-md text-caption font-semibold bg-white/15 text-white hover:bg-white/25 transition-colors focus-ring"
                                      >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>{t('addContent', contentLanguage)}</span>
                                      </button>
                                      {(currentConfig?.schedule?.days ?? 0) > 1 && (
                                        <button
                                          onClick={() => {
                                            if (confirm(t('confirmDeleteDayMsg', contentLanguage).replace('{day}', String(dayNum)))) {
                                              useWorkshopStore.getState().removeDay(dayNum)
                                            }
                                          }}
                                          className="p-1 rounded hover:bg-white/20 text-white/40 hover:text-white transition-colors"
                                          title={`${t('deleteDay', contentLanguage)} ${dayNum}`}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {currentConfig?.schedule?.day_start_times?.[dayNum] && (
                                    <div className="text-xs text-white/50 mt-0.5">
                                      Starts at {currentConfig.schedule.day_start_times[dayNum]}
                                    </div>
                                  )}
                                </div>

                                {/* Sessions list */}
                                <div className="p-3 space-y-2 min-h-[200px]">
                                  <SortableContext
                                    items={sessions.map((s: any) => s._id)}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    {sessions.map((session: any, idx: number) => (
                                      <SortableSessionCard
                                        key={session._id}
                                        session={session}
                                        index={idx}
                                        dayNum={dayNum}
                                        totalDays={currentConfig?.schedule?.days || 1}
                                        totalSessions={sessions.length}
                                        onEdit={handleEditSession}
                                        onMoveToDay={handleMoveToDay}
                                      />
                                    ))}
                                  </SortableContext>

                                  {/* + Add content (bottom dashed) — keep for users
                                      at the bottom of long day columns. The primary
                                      entry point is the button in the day header. */}
                                  <button
                                    className="w-full py-2 px-3 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 hover:border-fastr-secondary hover:text-fastr-secondary hover:bg-fastr-secondary/5 transition-colors flex items-center justify-center gap-2 focus-ring"
                                    onClick={() => {
                                      setAddContentDayNum(dayNum)
                                      setAddContentDrawerOpen(true)
                                    }}
                                  >
                                    <Plus className="w-4 h-4" />
                                    <span className="text-body-sm font-semibold">{t('addContent', contentLanguage)}</span>
                                  </button>
                                </div>
                              </DroppableDayColumn>
                            )
                          })}

                          {/* Add Day button */}
                          <button
                            className="flex-shrink-0 w-64 h-32 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-fastr-primary hover:text-fastr-primary transition-colors flex flex-col items-center justify-center gap-2"
                            onClick={() => useWorkshopStore.getState().addDay()}
                          >
                            <Plus className="w-6 h-6" />
                            <span className="font-medium">{t('addDay', contentLanguage)}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Layers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">{t('selectOrCreateWorkshop', contentLanguage)}</p>
                <button
                  onClick={() => setShowWorkshopSelector(true)}
                  className="mt-4 px-4 py-2 bg-fastr-primary text-white rounded-md hover:bg-fastr-primary/90 transition-colors"
                >
                  {t('chooseWorkshop', contentLanguage)}
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - AI Assistant (slide-out) */}
        {rightPanelOpen && (
          <div className="absolute right-0 top-0 bottom-0 z-20">
            <div className="h-full w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">{t('aiAssistant', contentLanguage)}</span>
                <button
                  onClick={() => setRightPanelOpen(false)}
                  aria-label="Close AI assistant"
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <AIAssistant />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drag overlay — floating preview while dragging library items */}
      <DragOverlay dropAnimation={null}>
        {activeDragData?.data?.type === 'library-module' && (
          <div className="px-3 py-2 bg-white rounded-lg shadow-xl border border-fastr-secondary ring-2 ring-fastr-secondary/30 max-w-[240px]">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-5 rounded bg-fastr-primary/10 text-fastr-primary text-xs font-bold">
                M{activeDragData.data.module.number}
              </span>
              <span className="text-sm font-medium text-gray-800 truncate">{activeDragData.data.module.name}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1 pl-9">
              {activeDragData.data.module.topics?.length || 0} {t('xTopics', contentLanguage)}
            </div>
          </div>
        )}
        {activeDragData?.data?.type === 'library-topic' && (
          <div className="px-3 py-2 bg-white rounded-lg shadow-xl border border-fastr-secondary ring-2 ring-fastr-secondary/30 max-w-[240px]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-fastr-primary flex-shrink-0" />
              <span className="text-sm font-medium text-gray-800 truncate">{activeDragData.data.topic.title}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1 pl-6">
              {activeDragData.data.topic.slideCount || 0} {t('xSlides', contentLanguage)}
            </div>
          </div>
        )}
      </DragOverlay>

      {/* + Add content drawer — MUST be inside DndContext so the ContentLibrary
          inside the drawer can register draggables and reach the day-column
          droppables. React context flows through createPortal. */}
      <AddContentDrawer
        open={addContentDrawerOpen}
        onClose={() => setAddContentDrawerOpen(false)}
        onImportSlides={() => {
          setAddContentDrawerOpen(false)
          setAppMode('import')
        }}
        targetDayNum={addContentDayNum}
      />
      </DndContext>

      {/* Workshop Selector Modal */}
      {showWorkshopSelector && (
        <Modal
          open
          onClose={() => {
            setShowWorkshopSelector(false)
            setShowCreateWorkshop(false)
            setAiQuestions([])
            setAiAnswers({})
            setUploadFile(null)
            setUploadText('')
            if (pendingDeckType === 'webinar' && !currentWorkshopId) {
              setAppMode('select')
            }
          }}
          title={
            showCreateWorkshop
              ? (pendingDeckType === 'webinar' ? t('buildWebinar', contentLanguage) : t('createNewWorkshop', contentLanguage))
              : (pendingDeckType === 'webinar' ? t('buildWebinar', contentLanguage) : t('selectWorkshop', contentLanguage))
          }
          size="md"
          closeOnBackdrop={false}
        >

            {showCreateWorkshop ? (
              <div className="p-4">
                {/* Mode toggle — AI + Upload + Manual for workshops, AI + Manual for webinars */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
                  <button
                    onClick={() => setCreateMode('ai')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      createMode === 'ai'
                        ? 'bg-white text-fastr-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    {t('aiSetup', contentLanguage)}
                  </button>
                  {pendingDeckType !== 'webinar' && (
                  <button
                    onClick={() => setCreateMode('upload')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      createMode === 'upload'
                        ? 'bg-white text-fastr-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    {t('uploadOrPaste', contentLanguage)}
                  </button>
                  )}
                  <button
                    onClick={() => setCreateMode('manual')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      createMode === 'manual'
                        ? 'bg-white text-fastr-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {t('manual', contentLanguage)}
                  </button>
                </div>

                {createMode === 'ai' ? (
                  <div className="space-y-4">
                    {aiQuestions.length > 0 ? (
                      /* ── Clarification Q&A phase ── */
                      <>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-amber-800">
                            {t('aiClarifying', contentLanguage)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">{t('describeWorkshop', contentLanguage)}</p>
                          <p className="text-sm text-gray-700 italic">{aiPrompt}</p>
                        </div>
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700">{t('answerQuestions', contentLanguage)}</p>
                          {aiQuestions.map((question, idx) => (
                            <div key={idx}>
                              <label className="block text-sm text-gray-700 mb-1">{question}</label>
                              <input
                                type="text"
                                value={aiAnswers[idx] || ''}
                                onChange={(e) => setAiAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                                disabled={aiGenerating}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setAiQuestions([])
                              setAiAnswers({})
                            }}
                            className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={aiGenerating}
                          >
                            {t('editPrompt', contentLanguage)}
                          </button>
                          <button
                            onClick={handleAIGenerate}
                            disabled={aiGenerating || aiQuestions.some((_, idx) => !aiAnswers[idx]?.trim())}
                            className="flex-1 px-4 py-2 font-medium bg-fastr-primary text-white rounded-lg shadow-sm hover:shadow-md hover:bg-fastr-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {aiGenerating ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                {t('generating', contentLanguage)}
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" />
                                {t('generateWithAnswers', contentLanguage)}
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      /* ── Initial prompt phase ── */
                      <>
                        <p className="text-sm text-gray-600">
                          {pendingDeckType === 'webinar' ? t('describeWebinar', contentLanguage) : t('describeWorkshop', contentLanguage)}
                        </p>
                        <textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                          placeholder={pendingDeckType === 'webinar' ? t('webinarAiPlaceholder', contentLanguage) : t('aiPlaceholder', contentLanguage)}
                          disabled={aiGenerating}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowCreateWorkshop(false)
                              setAiPrompt('')
                            }}
                            className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={aiGenerating}
                          >
                            {pendingDeckType === 'webinar' ? t('cancel', contentLanguage) : t('back', contentLanguage)}
                          </button>
                          <button
                            onClick={handleAIGenerate}
                            disabled={aiGenerating || !aiPrompt.trim()}
                            className="flex-1 px-4 py-2 font-medium bg-fastr-primary text-white rounded-lg shadow-sm hover:shadow-md hover:bg-fastr-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {aiGenerating ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                {t('generating', contentLanguage)}
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-4 h-4" />
                                {pendingDeckType === 'webinar' ? t('generateWebinar', contentLanguage) : t('generateWorkshop', contentLanguage)}
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : createMode === 'upload' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {t('uploadAgendaDesc', contentLanguage)}
                    </p>

                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setUploadDragOver(true) }}
                      onDragLeave={() => setUploadDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault()
                        setUploadDragOver(false)
                        const file = e.dataTransfer.files[0]
                        if (file && (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                          setUploadFile(file)
                        } else {
                          setError(contentLanguage === 'fr' ? 'Format non supporté. Utilisez PDF ou Word (.docx)' : 'Unsupported format. Use PDF or Word (.docx)')
                        }
                      }}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        uploadDragOver
                          ? 'border-fastr-primary bg-fastr-primary/5'
                          : uploadFile
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = '.pdf,.docx'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) setUploadFile(file)
                        }
                        input.click()
                      }}
                    >
                      {uploadFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-700">{uploadFile.name}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setUploadFile(null) }}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-gray-700">{t('dropFileHere', contentLanguage)}</p>
                          <p className="text-xs text-gray-500 mt-1">{t('supportedFormats', contentLanguage)}</p>
                        </>
                      )}
                    </div>

                    {/* Paste textarea */}
                    {!uploadFile && (
                      <textarea
                        value={uploadText}
                        onChange={(e) => setUploadText(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                        placeholder={t('pasteAgendaHere', contentLanguage)}
                        disabled={aiGenerating}
                      />
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowCreateWorkshop(false)
                          setUploadFile(null)
                          setUploadText('')
                        }}
                        className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={aiGenerating}
                      >
                        {t('back', contentLanguage)}
                      </button>
                      <button
                        onClick={handleUploadAgenda}
                        disabled={aiGenerating || (!uploadFile && !uploadText.trim())}
                        className="flex-1 px-4 py-2 font-medium bg-fastr-primary text-white rounded-lg shadow-sm hover:shadow-md hover:bg-fastr-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {aiGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            {t('parsing', contentLanguage)}
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            {t('generateWorkshop', contentLanguage)}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {pendingDeckType === 'webinar' ? t('webinarName', contentLanguage) : t('workshopName', contentLanguage)} *
                      </label>
                      <input
                        type="text"
                        value={newWorkshop.name}
                        onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors duration-200"
                        placeholder={pendingDeckType === 'webinar'
                          ? (contentLanguage === 'fr' ? 'ex. Webinaire FASTR - Introduction' : 'e.g., FASTR Webinar - Introduction')
                          : (contentLanguage === 'fr' ? 'ex. Atelier de formation FASTR' : 'e.g., FASTR Training Workshop')
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('country', contentLanguage)} *
                      </label>
                      <input
                        type="text"
                        value={newWorkshop.country}
                        onChange={(e) => setNewWorkshop({ ...newWorkshop, country: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors duration-200"
                        placeholder={contentLanguage === 'fr' ? 'ex. Sénégal' : 'e.g., Kenya'}
                      />
                    </div>

                    {pendingDeckType === 'webinar' ? (
                      <>
                        {/* Webinar-specific fields */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('webinarDate', contentLanguage)}
                            </label>
                            <input
                              type="date"
                              value={newWorkshop.date}
                              onChange={(e) => setNewWorkshop({ ...newWorkshop, date: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors duration-200"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t('webinarTime', contentLanguage)}
                            </label>
                            <input
                              type="time"
                              value={newWorkshop.time}
                              onChange={(e) => setNewWorkshop({ ...newWorkshop, time: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors duration-200"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('webinarDuration', contentLanguage)}
                          </label>
                          <select
                            value={newWorkshop.duration}
                            onChange={(e) => setNewWorkshop({ ...newWorkshop, duration: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors duration-200"
                          >
                            {[30, 45, 60, 90, 120].map(d => (
                              <option key={d} value={d}>{d} min</option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Workshop-specific fields */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('city', contentLanguage)}</label>
                          <input
                            type="text"
                            value={newWorkshop.location}
                            onChange={(e) => setNewWorkshop({ ...newWorkshop, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors duration-200"
                            placeholder={contentLanguage === 'fr' ? 'ex. Dakar' : 'e.g., Nairobi'}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('numberOfDays', contentLanguage)}
                          </label>
                          <select
                            value={newWorkshop.days}
                            onChange={(e) =>
                              setNewWorkshop({ ...newWorkshop, days: parseInt(e.target.value) })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors duration-200"
                          >
                            {[1, 2, 3, 4, 5].map((d) => (
                              <option key={d} value={d}>
                                {d} {contentLanguage === 'fr' ? (d > 1 ? 'jours' : 'jour') : (d > 1 ? 'days' : 'day')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          if (pendingDeckType === 'webinar') {
                            // For webinars, close dialog and go back to landing
                            setShowWorkshopSelector(false)
                            setShowCreateWorkshop(false)
                            setAppMode('select')
                          } else {
                            setShowCreateWorkshop(false)
                          }
                        }}
                        className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {pendingDeckType === 'webinar' ? t('cancel', contentLanguage) : t('back', contentLanguage)}
                      </button>
                      <button
                        onClick={handleCreateWorkshop}
                        className="flex-1 px-4 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 transition-colors"
                      >
                        {t('create', contentLanguage)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4">
                {/* Create New — secondary action; primary entry is "+ New" in the topbar */}
                <button
                  onClick={() => {
                    setShowCreateWorkshop(true)
                    if (pendingDeckType === 'webinar') setCreateMode('manual')
                  }}
                  className="w-full mb-4 py-2 px-3 rounded-lg text-body-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 focus-ring border border-slate-200"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {pendingDeckType === 'webinar' ? t('buildWebinar', contentLanguage) : t('createNewWorkshop', contentLanguage)}
                  </span>
                </button>

                {/* Existing workshops — filtered by deck type */}
                {(() => {
                  const filteredWorkshops = workshops.filter((w: any) =>
                    pendingDeckType === 'webinar'
                      ? w.deckType === 'webinar'
                      : w.deckType !== 'webinar'
                  )
                  return (
                <div className="max-h-72 overflow-auto">
                  {filteredWorkshops.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">{t('noWorkshopsFound', contentLanguage)}</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredWorkshops.map((workshop) => (
                        <div
                          key={workshop.id}
                          className={`group flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                            currentWorkshopId === workshop.id
                              ? 'bg-fastr-primary/10 border-fastr-primary'
                              : 'hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          {/* Lock indicator */}
                          {workshop.locked && (
                            <span title="Locked">
                              <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            </span>
                          )}
                          <button
                            onClick={() => {
                              selectWorkshop(workshop.id)
                              setShowWorkshopSelector(false)
                            }}
                            className="flex-1 text-left"
                          >
                            <div className="font-medium">{workshop.name}</div>
                            <div className="text-sm text-gray-500">
                              {workshop.country}
                              {workshop.location && ` • ${workshop.location}`}
                            </div>
                          </button>
                          {/* Clone button — fork the workshop's structure into a new id */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setCloneSource(workshop)
                              const slug = workshop.id.replace(/[-_]\d{4}.*$/, '') // strip trailing year/qualifier if present
                              const year = new Date().getFullYear()
                              setCloneForm({
                                newId: `${slug}-copy-${year}`,
                                name: `${workshop.name} (copy)`,
                                country: workshop.country || '',
                                date: '',
                              })
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all"
                            title="Clone this workshop as a starting point"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          {/* Lock/Unlock button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setWorkshopLocked(workshop.id, !workshop.locked)
                            }}
                            className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                              workshop.locked
                                ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            title={workshop.locked ? 'Unlock workshop' : 'Lock workshop'}
                          >
                            {workshop.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                          {/* Delete button - disabled if locked */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (workshop.locked) {
                                showToast('Cannot delete a locked workshop. Unlock it first.', 'error')
                                return
                              }
                              if (confirm(`Delete "${workshop.name}"? This cannot be undone.`)) {
                                deleteWorkshop(workshop.id)
                              }
                            }}
                            className={`p-2 rounded-lg transition-all ${
                              workshop.locked
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100'
                            }`}
                            title={workshop.locked ? 'Unlock to delete' : 'Delete workshop'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                  )
                })()}
              </div>
            )}
        </Modal>
      )}

      {/* Clone Workshop Modal */}
      {cloneSource && (
        <Modal
          open
          onClose={() => { if (!cloneBusy) setCloneSource(null) }}
          title="Clone workshop"
          size="md"
        >
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              Fork <span className="font-medium text-gray-900">{cloneSource.name}</span> into a new workshop.
              The session structure, slide order, breaks, and any custom slides come with you.
              Override the country and date for the new context.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New workshop ID</label>
              <input
                type="text"
                value={cloneForm.newId}
                onChange={(e) => setCloneForm({ ...cloneForm, newId: e.target.value.replace(/\s+/g, '-').toLowerCase() })}
                placeholder="e.g. addis-burkina-2027"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                disabled={cloneBusy}
              />
              <p className="text-xs text-gray-500 mt-1">Lowercase, hyphens, no spaces. Must be unique.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
              <input
                type="text"
                value={cloneForm.name}
                onChange={(e) => setCloneForm({ ...cloneForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={cloneBusy}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={cloneForm.country}
                  onChange={(e) => setCloneForm({ ...cloneForm, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={cloneBusy}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  value={cloneForm.date}
                  onChange={(e) => setCloneForm({ ...cloneForm, date: e.target.value })}
                  placeholder="(optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={cloneBusy}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCloneSource(null)}
                disabled={cloneBusy}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!cloneForm.newId.trim()) {
                    showToast('New workshop ID is required', 'error')
                    return
                  }
                  setCloneBusy(true)
                  try {
                    await cloneWorkshop(cloneSource.id, cloneForm.newId.trim(), {
                      name: cloneForm.name.trim() || undefined,
                      country: cloneForm.country.trim() || undefined,
                      date: cloneForm.date.trim() || undefined,
                    })
                    showToast(`Cloned to "${cloneForm.newId.trim()}"`, 'success')
                    setCloneSource(null)
                    setShowWorkshopSelector(false)
                  } catch (err: any) {
                    showToast(err?.message || 'Clone failed', 'error')
                  } finally {
                    setCloneBusy(false)
                  }
                }}
                disabled={cloneBusy || !cloneForm.newId.trim()}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {cloneBusy ? 'Cloning…' : 'Clone'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Workshop Details Modal */}
      {showSettings && currentConfig && (
        <Modal
          open
          onClose={() => setShowSettings(false)}
          title={t('workshopDetails', contentLanguage)}
          size="lg"
          closeOnBackdrop={false}
        >

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Cover Slide Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {t('coverSlide', contentLanguage)}
                </h3>
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('presentationTitle', contentLanguage)}
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.title || currentConfig.workshop.name || ''}
                      onChange={(e) => updateWorkshopSettings({ title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder={contentLanguage === 'fr' ? 'Titre principal de la couverture' : 'Main title on cover slide'}
                    />
                    <p className="text-xs text-gray-500 mt-1">{contentLanguage === 'fr' ? 'Le titre principal affiché sur la diapositive de couverture' : 'The main title displayed on the cover slide'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('subtitle', contentLanguage)}
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.subtitle || ''}
                      onChange={(e) => updateWorkshopSettings({ subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder={contentLanguage === 'fr' ? 'Sous-titre de la couverture' : 'Subtitle on cover slide'}
                    />
                  </div>
                </div>
              </section>

              {/* Basic Info Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {t('workshopDetails', contentLanguage)}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('workshopName', contentLanguage)}
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.name || ''}
                      onChange={(e) => updateWorkshopSettings({ name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder={contentLanguage === 'fr' ? 'ex. Atelier FASTR - Sénégal' : 'e.g., FASTR Workshop - Kenya'}
                    />
                  </div>

                  {(() => {
                    // Derive start_date/end_date from formatted date string for existing workshops
                    const ws = currentConfig.workshop as any
                    let startDateVal = ws.start_date || ''
                    let endDateVal = ws.end_date || ''
                    if ((!startDateVal || !endDateVal) && ws.date) {
                      const monthMap: Record<string, string> = {
                        january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',
                        july:'07',august:'08',september:'09',october:'10',november:'11',december:'12',
                        janvier:'01',février:'02',mars:'03',avril:'04',mai:'05',juin:'06',
                        juillet:'07',août:'08',septembre:'09',octobre:'10',novembre:'11',décembre:'12',
                      }
                      const dateStr = ws.date as string
                      const monthMatch = dateStr.toLowerCase().match(new RegExp(Object.keys(monthMap).join('|')))
                      const yearMatch = dateStr.match(/(\d{4})/)
                      const daysMatch = dateStr.match(/(\d{1,2})\s*[-–]\s*(\d{1,2})/)
                      if (monthMatch && yearMatch && daysMatch) {
                        const mm = monthMap[monthMatch[0]]
                        const yyyy = yearMatch[1]
                        if (!startDateVal) startDateVal = `${yyyy}-${mm}-${daysMatch[1].padStart(2, '0')}`
                        if (!endDateVal) endDateVal = `${yyyy}-${mm}-${daysMatch[2].padStart(2, '0')}`
                      }
                    }

                    // Helper to format date string for cover slide
                    const formatDateRange = (start: string, end: string) => {
                      if (!start || !end) return undefined
                      const s = new Date(start + 'T00:00:00'), e = new Date(end + 'T00:00:00')
                      if (isNaN(s.getTime()) || isNaN(e.getTime())) return undefined
                      const months = contentLanguage === 'fr'
                        ? ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
                        : ['January','February','March','April','May','June','July','August','September','October','November','December']
                      if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
                        return `${s.getDate()}-${e.getDate()} ${months[s.getMonth()]}, ${s.getFullYear()}`
                      }
                      return `${s.getDate()} ${months[s.getMonth()]} - ${e.getDate()} ${months[e.getMonth()]}, ${e.getFullYear()}`
                    }

                    return (<>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('startDate', contentLanguage)}
                        </label>
                        <input
                          type="date"
                          value={startDateVal}
                          onChange={(e) => {
                            const updates: any = { start_date: e.target.value }
                            const newDate = formatDateRange(e.target.value, endDateVal)
                            if (newDate) updates.date = newDate
                            updateWorkshopSettings(updates)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t('endDate', contentLanguage)}
                        </label>
                        <input
                          type="date"
                          value={endDateVal}
                          onChange={(e) => {
                            const updates: any = { end_date: e.target.value }
                            const newDate = formatDateRange(startDateVal, e.target.value)
                            if (newDate) updates.date = newDate
                            updateWorkshopSettings(updates)
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                        />
                      </div>
                    </>)
                  })()}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('country', contentLanguage)}
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.country || ''}
                      onChange={(e) => updateWorkshopSettings({ country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder={contentLanguage === 'fr' ? 'ex. Sénégal' : 'e.g., Kenya'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('location', contentLanguage)}
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.location || ''}
                      onChange={(e) => updateWorkshopSettings({ location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder={contentLanguage === 'fr' ? 'ex. Dakar' : 'e.g., Nairobi'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('venue', contentLanguage)}
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.venue || ''}
                      onChange={(e) => updateWorkshopSettings({ venue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder={contentLanguage === 'fr' ? 'ex. Hôtel Terrou-Bi' : 'e.g., Sarova Stanley Hotel'}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('facilitators', contentLanguage)}
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.facilitators || ''}
                      onChange={(e) => updateWorkshopSettings({ facilitators: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder={contentLanguage === 'fr' ? 'ex. Jean Dupont, Marie Martin' : 'e.g., John Smith, Jane Doe'}
                    />
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {t('contactInformation', contentLanguage)}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contactEmail', contentLanguage)}
                    </label>
                    <input
                      type="email"
                      value={currentConfig.workshop.contact_email || ''}
                      onChange={(e) => updateWorkshopSettings({ contact_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="ex. workshop@example.org"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('website', contentLanguage)}
                    </label>
                    <input
                      type="url"
                      value={currentConfig.workshop.website || ''}
                      onChange={(e) => updateWorkshopSettings({ website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="ex. https://data.gffportal.org/key-theme/FASTR"
                    />
                  </div>
                </div>
              </section>

              {/* Content Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {t('slideContent', contentLanguage)}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {t('slideContentDesc', contentLanguage)}
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('workshopObjectives', contentLanguage)}
                      <span className="ml-2 text-xs font-normal text-gray-400">→ {t('objectivesSlide', contentLanguage)}</span>
                    </label>
                    <textarea
                      value={currentConfig.workshop.objectives || ''}
                      onChange={(e) => updateWorkshopSettings({ objectives: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder={contentLanguage === 'fr' ? '- Comprendre la méthodologie FASTR\n- Apprendre les techniques d\'extraction de données\n- Développer des compétences analytiques' : '- Understand FASTR methodology\n- Learn data extraction techniques\n- Develop data analysis skills'}
                    />
                    <p className="text-xs text-gray-500 mt-1">{contentLanguage === 'fr' ? 'Un objectif par ligne (commencer par - pour les puces)' : 'One objective per line (start with - for bullets)'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('expectedOutputs', contentLanguage)}
                      <span className="ml-2 text-xs font-normal text-gray-400">→ {t('expectedOutputsSlide', contentLanguage)}</span>
                    </label>
                    <textarea
                      value={currentConfig.workshop.expected_outputs || ''}
                      onChange={(e) => updateWorkshopSettings({ expected_outputs: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder={contentLanguage === 'fr' ? '**Activités d\'analyse**\n- Extraction de données terminée\n- Premier rapport trimestriel produit\n\n**Renforcement des capacités**\n- Membres de l\'équipe formés' : '**Analysis Activities**\n- Data extraction completed\n- First quarterly report produced\n\n**Capacity Building**\n- Trained team members'}
                    />
                    <p className="text-xs text-gray-500 mt-1">{contentLanguage === 'fr' ? 'Utilisez **gras** pour les en-têtes de section, - pour les puces' : 'Use **bold** for section headers, - for bullets'}</p>
                  </div>
                </div>
              </section>

              {/* Schedule Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  {t('dailySchedule', contentLanguage)}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {t('dailyScheduleDesc', contentLanguage)}
                </p>

                {/* Column headers */}
                <div className="flex items-center gap-4 px-3 mb-2">
                  <span className="text-xs font-medium text-gray-500 w-16">{t('day', contentLanguage)}</span>
                  <span className="flex-1 text-xs font-medium text-gray-500">{t('themeFocusArea', contentLanguage)}</span>
                  <span className="w-24 text-xs font-medium text-gray-500">{t('startsAt', contentLanguage)}</span>
                  <span className="w-24 text-xs font-medium text-gray-500">{t('endsAt', contentLanguage)}</span>
                </div>

                <div className="space-y-2">
                  {Array.from({ length: currentConfig.schedule.days }).map((_, i) => {
                    const dayNum = i + 1
                    return (
                      <div key={dayNum} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-semibold text-fastr-primary w-16">{t('day', contentLanguage)} {dayNum}</span>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={currentConfig.schedule.day_titles?.[dayNum] || ''}
                            onChange={(e) => {
                              const newTitles = {
                                ...currentConfig.schedule.day_titles,
                                [dayNum]: e.target.value,
                              }
                              const newConfig = {
                                ...currentConfig,
                                schedule: { ...currentConfig.schedule, day_titles: newTitles },
                              }
                              useWorkshopStore.setState({ currentConfig: newConfig })
                              useWorkshopStore.getState().saveCurrentWorkshop()
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors duration-200"
                            placeholder={contentLanguage === 'fr'
                              ? `ex. ${dayNum === 1 ? 'Introduction & Extraction des données' : dayNum === 2 ? 'Évaluation de la qualité des données' : 'Analyse & Communication'}`
                              : `e.g., ${dayNum === 1 ? 'Introduction & Data Extraction' : dayNum === 2 ? 'Data Quality Assessment' : 'Analysis & Communication'}`}
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="time"
                            value={currentConfig.schedule.day_start_times?.[dayNum] || '09:00'}
                            onChange={(e) => {
                              const newTimes = {
                                ...currentConfig.schedule.day_start_times,
                                [dayNum]: e.target.value,
                              }
                              const newConfig = {
                                ...currentConfig,
                                schedule: { ...currentConfig.schedule, day_start_times: newTimes },
                              }
                              useWorkshopStore.setState({ currentConfig: newConfig })
                              useWorkshopStore.getState().saveCurrentWorkshop()
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors duration-200"
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="time"
                            value={currentConfig.schedule.day_end_times?.[dayNum] || '17:00'}
                            onChange={(e) => {
                              const newEndTimes = {
                                ...currentConfig.schedule.day_end_times,
                                [dayNum]: e.target.value,
                              }
                              const newConfig = {
                                ...currentConfig,
                                schedule: { ...currentConfig.schedule, day_end_times: newEndTimes },
                              }
                              useWorkshopStore.setState({ currentConfig: newConfig })
                              useWorkshopStore.getState().saveCurrentWorkshop()
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors duration-200"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {t('changesSavedAutomatically', contentLanguage)}
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 transition-colors text-sm font-medium"
                >
                  {t('done', contentLanguage)}
                </button>
              </div>
            </div>
        </Modal>
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <EditSessionModal
          session={editingSession.session}
          dayNum={editingSession.dayNum}
          totalDays={currentConfig?.schedule?.days || 1}
          onClose={() => setEditingSession(null)}
          onSave={handleSaveSession}
          onDelete={handleDeleteSession}
          onMoveToDay={(toDay) => {
            moveSessionToDay(editingSession.dayNum, editingSession.index, toDay, -1)
          }}
        />
      )}

      {/* AddContentDrawer is rendered inside the DndContext above so the
          ContentLibrary inside it can register drag sources. */}


      {/* Guided tour for builder mode */}
      {currentWorkshopId && (
        <>
          <GuidedTour
            ref={builderTourRef}
            tour="builder"
            language={contentLanguage}
            panelControls={{ setRightPanelOpen }}
          />
          <HelpButton
            onClick={() => setShowHelp(true)}
            language={contentLanguage}
          />
          <HelpPanel
            open={showHelp}
            onClose={() => setShowHelp(false)}
            language={contentLanguage}
            view="builder"
            onStartTour={() => builderTourRef.current?.startTour()}
          />
        </>
      )}
      </div>
    </div>
  )
}

export default App
