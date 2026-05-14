import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useWorkshopStore } from '../stores/workshop'
import { t } from '../i18n/translations'
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Eye,
  Download,
  X,
  FileText,
  BookOpen,
  MessageSquare,
  ClipboardList,
  Loader2,
} from 'lucide-react'

type HandoutType = 'participant_activity' | 'facilitator_demo' | 'reference' | 'worksheet'

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

interface PreviewState {
  handout: HandoutEntry
  pdfUrl: string | null
  fallbackHtml: string | null
  loading: boolean
}

function typeIcon(type: HandoutType) {
  switch (type) {
    case 'facilitator_demo':
      return <MessageSquare className="w-4 h-4" />
    case 'reference':
      return <BookOpen className="w-4 h-4" />
    case 'worksheet':
      return <ClipboardList className="w-4 h-4" />
    case 'participant_activity':
    default:
      return <FileText className="w-4 h-4" />
  }
}

function typeChipClasses(type: HandoutType): string {
  switch (type) {
    case 'facilitator_demo':
      return 'bg-purple-100 text-purple-700'
    case 'reference':
      return 'bg-blue-100 text-blue-700'
    case 'worksheet':
      return 'bg-amber-100 text-amber-700'
    case 'participant_activity':
    default:
      return 'bg-emerald-100 text-emerald-700'
  }
}

function typeLabel(type: HandoutType, lang: 'en' | 'fr'): string {
  switch (type) {
    case 'facilitator_demo':
      return t('handoutTypeFacilitator', lang)
    case 'reference':
      return t('handoutTypeReference', lang)
    case 'worksheet':
      return t('handoutTypeWorksheet', lang)
    case 'participant_activity':
    default:
      return t('handoutTypeParticipant', lang)
  }
}

export function HandoutsPanel() {
  const { contentLanguage } = useWorkshopStore()
  const [groups, setGroups] = useState<HandoutGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [preview, setPreview] = useState<PreviewState | null>(null)

  useEffect(() => {
    let cancelled = false
    const fetchHandouts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/content/handouts?language=${contentLanguage}`, {
          credentials: 'include',
        })
        if (response.ok && !cancelled) {
          const data = await response.json()
          setGroups(data)
          // Expand all groups by default — the user came to this tab to find handouts.
          setExpanded(new Set(data.map((g: HandoutGroup) => g.moduleId)))
        }
      } catch (err) {
        console.error('Failed to fetch handouts:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchHandouts()
    return () => {
      cancelled = true
    }
  }, [contentLanguage])

  // ESC closes the preview overlay
  useEffect(() => {
    if (!preview) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreview(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview])

  const toggleGroup = (moduleId: string) => {
    const next = new Set(expanded)
    if (next.has(moduleId)) next.delete(moduleId)
    else next.add(moduleId)
    setExpanded(next)
  }

  const openPreview = async (handout: HandoutEntry) => {
    if (handout.pdfUrl) {
      setPreview({ handout, pdfUrl: handout.pdfUrl, fallbackHtml: null, loading: false })
      return
    }
    // Fallback: render the markdown source via the Marp render endpoint
    setPreview({ handout, pdfUrl: null, fallbackHtml: null, loading: true })
    try {
      const sourceResp = await fetch(handout.markdownUrl, { credentials: 'include' })
      if (!sourceResp.ok) throw new Error('Source not found')
      const { content } = await sourceResp.json()

      const renderResp = await fetch('/api/content/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ markdown: content }),
      })
      if (!renderResp.ok) throw new Error('Render failed')
      const { html } = await renderResp.json()
      setPreview({ handout, pdfUrl: null, fallbackHtml: html, loading: false })
    } catch (err) {
      console.error('Failed to load handout preview:', err)
      setPreview({ handout, pdfUrl: null, fallbackHtml: null, loading: false })
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse p-3" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-b border-gray-100 flex items-center gap-2 py-2">
            <div className="w-4 h-4 rounded bg-slate-200 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 rounded bg-slate-200" style={{ width: `${55 + ((i * 11) % 30)}%` }} />
              <div className="h-2 rounded bg-slate-100" style={{ width: `${30 + ((i * 7) % 20)}%` }} />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <div className="p-6 text-sm text-gray-500 text-center">
        {t('noHandoutsYet', contentLanguage)}
      </div>
    )
  }

  // Bucket groups by theme, preserving server-side order
  const themedGroups: Array<{ themeId: string; themeName: string; groups: HandoutGroup[] }> = []
  const seen = new Map<string, { themeId: string; themeName: string; groups: HandoutGroup[] }>()
  for (const g of groups) {
    const tid = g.themeId || '_other'
    const tname = g.themeName || (contentLanguage === 'fr' ? 'Autre' : 'Other')
    if (!seen.has(tid)) {
      const bucket = { themeId: tid, themeName: tname, groups: [] as HandoutGroup[] }
      seen.set(tid, bucket)
      themedGroups.push(bucket)
    }
    seen.get(tid)!.groups.push(g)
  }

  return (
    <div>
      {themedGroups.map((bucket) => (
        <div key={bucket.themeId}>
          <div className="px-3 py-1.5 bg-slate-50 border-y border-slate-200 text-[11px] uppercase tracking-wide font-semibold text-slate-600">
            {bucket.themeName}
          </div>
          {bucket.groups.map((group) => {
            const isOpen = expanded.has(group.moduleId)
            return (
          <div key={group.moduleId} className="border-b border-gray-100">
            <button
              onClick={() => toggleGroup(group.moduleId)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
            >
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <span className="inline-flex items-center justify-center px-1.5 h-5 rounded bg-fastr-primary/10 text-fastr-primary text-xs font-bold flex-shrink-0">
                {group.moduleId.toUpperCase()}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-700 truncate">
                  {group.moduleName}
                </div>
                <div className="text-xs text-gray-400">
                  {group.handouts.length} {group.handouts.length === 1 ? 'handout' : 'handouts'}
                </div>
              </div>
            </button>

            {isOpen && (
              <div className="bg-gray-50 border-t border-gray-100">
                {group.handouts.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-2 px-3 py-2 pl-8 hover:bg-white border-l-2 border-l-transparent hover:border-l-fastr-secondary transition-all group"
                  >
                    <span className="text-gray-500 flex-shrink-0">{typeIcon(h.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 truncate" title={h.title}>
                        {h.title}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1.5 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${typeChipClasses(h.type)}`}>
                          {typeLabel(h.type, contentLanguage)}
                        </span>
                        {h.duration && <span>{h.duration}</span>}
                        {!h.pdfUrl && (
                          <span className="text-amber-600 italic">PDF pending</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => openPreview(h)}
                      className="p-1 text-gray-500 hover:text-fastr-primary hover:bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title={t('previewHandout', contentLanguage)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {h.pdfUrl && (
                      <a
                        href={h.pdfUrl}
                        download
                        className="p-1 text-gray-500 hover:text-fastr-primary hover:bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title={t('downloadHandout', contentLanguage)}
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
        </div>
      ))}

      {preview && createPortal(
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
          <div className="flex items-center justify-between gap-3 px-3 py-2 bg-slate-900 text-white flex-shrink-0">
            <button
              onClick={() => setPreview(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm font-medium flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              {contentLanguage === 'fr' ? 'Retour aux documents' : 'Back to handouts'}
            </button>
            <div className="min-w-0 flex-1 text-center">
              <h3 className="font-semibold truncate text-sm">{preview.handout.title}</h3>
              <p className="text-xs text-slate-300">
                {typeLabel(preview.handout.type, contentLanguage)}
                {preview.handout.duration ? ` · ${preview.handout.duration}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {preview.handout.pdfUrl && (
                <>
                  <a
                    href={preview.handout.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:inline px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-700 rounded"
                    title="Open in new tab"
                  >
                    Open in new tab
                  </a>
                  <a
                    href={preview.handout.pdfUrl}
                    download
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
                    title={t('downloadHandout', contentLanguage)}
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </>
              )}
              <button
                onClick={() => setPreview(null)}
                aria-label="Close preview"
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-slate-700">
            {preview.loading ? (
              <div className="h-full flex items-center justify-center text-slate-300">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : preview.pdfUrl ? (
              <iframe
                src={preview.pdfUrl + '#view=FitH'}
                className="w-full h-full bg-white"
                title={preview.handout.title}
              />
            ) : preview.fallbackHtml ? (
              <div className="h-full flex flex-col">
                <div className="text-xs px-3 py-2 bg-amber-50 text-amber-800 border-b border-amber-200 flex-shrink-0">
                  {t('pdfNotRendered', contentLanguage)}
                </div>
                <iframe
                  srcDoc={preview.fallbackHtml}
                  className="flex-1 w-full bg-white"
                  title={preview.handout.title}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300">
                Preview unavailable
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
