import { useState, useEffect, useMemo } from 'react'
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
  MessageSquare,
  Loader2,
  Compass,
  Database,
  BarChart3,
  Megaphone,
  Settings,
  Users,
  FlaskConical,
} from 'lucide-react'

type HandoutType = 'participant' | 'facilitator'

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

function themeIcon(themeId: string) {
  switch (themeId) {
    case 'foundations':
      return <Compass className="w-3.5 h-3.5" />
    case 'data':
      return <Database className="w-3.5 h-3.5" />
    case 'analysis':
      return <BarChart3 className="w-3.5 h-3.5" />
    case 'communication':
      return <Megaphone className="w-3.5 h-3.5" />
    case 'platform':
      return <Settings className="w-3.5 h-3.5" />
    case 'methodology':
      return <FlaskConical className="w-3.5 h-3.5" />
    case 'workshop':
      return <Users className="w-3.5 h-3.5" />
    default:
      return null
  }
}

export function HandoutsPanel() {
  const { contentLanguage } = useWorkshopStore()
  const [groups, setGroups] = useState<HandoutGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [audience, setAudience] = useState<HandoutType>('participant')

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

  // Per-audience counts (computed once per fetch).
  const { participantCount, facilitatorCount } = useMemo(() => {
    let p = 0
    let f = 0
    for (const g of groups) {
      for (const h of g.handouts) {
        if (h.type === 'facilitator') f++
        else p++
      }
    }
    return { participantCount: p, facilitatorCount: f }
  }, [groups])

  // Filter groups by the active audience, drop empty modules, preserve order.
  const filteredGroups = useMemo(() => {
    return groups
      .map((g) => ({
        ...g,
        handouts: g.handouts.filter((h) =>
          audience === 'facilitator' ? h.type === 'facilitator' : h.type !== 'facilitator'
        ),
      }))
      .filter((g) => g.handouts.length > 0)
  }, [groups, audience])

  // Bucket by theme, with workshop-activity modules (m9*) ordered before
  // theory modules (m7, m8) inside each bucket. Matches the day-by-day flow
  // (e.g., Communication & action: m9c → m9d → m9i → m7).
  const themedGroups = useMemo(() => {
    const buckets: Array<{ themeId: string; themeName: string; groups: HandoutGroup[] }> = []
    const seen = new Map<string, { themeId: string; themeName: string; groups: HandoutGroup[] }>()
    for (const g of filteredGroups) {
      const tid = g.themeId || '_other'
      const tname = g.themeName || (contentLanguage === 'fr' ? 'Autre' : 'Other')
      if (!seen.has(tid)) {
        const bucket = { themeId: tid, themeName: tname, groups: [] as HandoutGroup[] }
        seen.set(tid, bucket)
        buckets.push(bucket)
      }
      seen.get(tid)!.groups.push(g)
    }
    const isWorkshop = (mid: string) => /^m9/.test(mid)
    for (const b of buckets) {
      b.groups.sort((a, c) => {
        const aw = isWorkshop(a.moduleId)
        const cw = isWorkshop(c.moduleId)
        if (aw !== cw) return aw ? -1 : 1
        return a.moduleId.localeCompare(c.moduleId)
      })
    }
    return buckets
  }, [filteredGroups, contentLanguage])

  // For the facilitator tab, drop the "Facilitator guide — <Module>"
  // suffix from row titles — the module name is already the header above.
  const displayTitle = (h: HandoutEntry): string => {
    if (audience !== 'facilitator') return h.title
    const m = h.title.match(/^(Facilitator guide|Guide du facilitateur)\s*[—\-]\s*/i)
    if (m) return contentLanguage === 'fr' ? 'Guide du facilitateur' : 'Facilitator guide'
    return h.title
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

  const labelParticipant = contentLanguage === 'fr' ? 'Participants' : 'Participants'
  const labelFacilitator = contentLanguage === 'fr' ? 'Facilitateurs' : 'Facilitators'

  return (
    <div>
      {/* Audience tabs — clear separation between participant and facilitator material */}
      <div
        role="tablist"
        aria-label={contentLanguage === 'fr' ? 'Public' : 'Audience'}
        className="flex gap-1 px-3 py-2 border-b border-slate-200 bg-white sticky top-0 z-10"
      >
        <button
          role="tab"
          aria-selected={audience === 'participant'}
          onClick={() => setAudience('participant')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            audience === 'participant'
              ? 'bg-fastr-primary text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          {labelParticipant}
          <span
            className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
              audience === 'participant' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {participantCount}
          </span>
        </button>
        <button
          role="tab"
          aria-selected={audience === 'facilitator'}
          onClick={() => setAudience('facilitator')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            audience === 'facilitator'
              ? 'bg-amber-700 text-white'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          {labelFacilitator}
          <span
            className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
              audience === 'facilitator' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {facilitatorCount}
          </span>
        </button>
      </div>

      {/* List view, themed sections */}
      {themedGroups.length === 0 ? (
        <div className="p-6 text-sm text-gray-500 text-center">
          {audience === 'facilitator'
            ? contentLanguage === 'fr'
              ? 'Aucun document facilitateur dans cette langue.'
              : 'No facilitator material in this language.'
            : t('noHandoutsYet', contentLanguage)}
        </div>
      ) : (
        themedGroups.map((bucket) => {
          const isFacilitator = audience === 'facilitator'
          if (isFacilitator) {
            // Facilitator content is sparse (1-2 items per module). A 2-column
            // grid of module cards with always-visible actions reads better than
            // a tall flat list.
            return (
              <div key={bucket.themeId}>
                <div className="px-3 py-1.5 bg-slate-50 border-y border-slate-200 text-[11px] uppercase tracking-wide font-semibold text-slate-600 flex items-center gap-2">
                  <span className="text-fastr-primary">{themeIcon(bucket.themeId)}</span>
                  {bucket.themeName}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                  {bucket.groups.map((group) => (
                    <div
                      key={group.moduleId}
                      className="border border-slate-200 rounded-md bg-white hover:border-fastr-secondary hover:shadow-sm transition-all flex flex-col"
                    >
                      <div className="px-3 pt-2.5 pb-1.5 text-sm font-semibold text-gray-800 border-b border-slate-100">
                        {group.moduleName}
                      </div>
                      <div className="flex-1 flex flex-col divide-y divide-slate-100">
                        {group.handouts.map((h) => (
                          <div
                            key={h.id}
                            className="flex items-center gap-2 px-3 py-2"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-700 truncate" title={h.title}>
                                {displayTitle(h)}
                              </div>
                              <div className="text-xs text-gray-400 flex items-center gap-1.5 flex-wrap">
                                {h.duration && <span>{h.duration}</span>}
                                {!h.pdfUrl && (
                                  <span className="text-amber-600 italic">PDF pending</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => openPreview(h)}
                              className="p-1.5 text-gray-500 hover:text-fastr-primary hover:bg-slate-50 rounded"
                              title={t('previewHandout', contentLanguage)}
                              aria-label={t('previewHandout', contentLanguage)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {h.pdfUrl && (
                              <a
                                href={h.pdfUrl}
                                download
                                className="p-1.5 text-gray-500 hover:text-fastr-primary hover:bg-slate-50 rounded"
                                title={t('downloadHandout', contentLanguage)}
                                aria-label={t('downloadHandout', contentLanguage)}
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
          // Participants tab — collapsible module groups (dense content).
          return (
            <div key={bucket.themeId}>
              <div className="px-3 py-1.5 bg-slate-50 border-y border-slate-200 text-[11px] uppercase tracking-wide font-semibold text-slate-600 flex items-center gap-2">
                <span className="text-fastr-primary">{themeIcon(bucket.themeId)}</span>
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
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">
                          {group.moduleName}
                        </div>
                        <div className="text-xs text-gray-400">
                          {group.handouts.length}{' '}
                          {group.handouts.length === 1
                            ? contentLanguage === 'fr'
                              ? 'document'
                              : 'handout'
                            : contentLanguage === 'fr'
                              ? 'documents'
                              : 'handouts'}
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="bg-gray-50 border-t border-gray-100">
                        {group.handouts.map((h, idx) => (
                          <div
                            key={h.id}
                            className="flex items-center gap-2 px-3 py-2 pl-8 hover:bg-white border-l-2 border-l-transparent hover:border-l-fastr-secondary transition-all group"
                          >
                            <span className="text-gray-400 text-xs font-mono w-5 text-right flex-shrink-0">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-700 truncate" title={h.title}>
                                {displayTitle(h)}
                              </div>
                              <div className="text-xs text-gray-400 flex items-center gap-1.5 flex-wrap">
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
          )
        })
      )}

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
              <h3 className="font-semibold truncate text-sm">
                {preview.handout.title}
                {preview.handout.type === 'facilitator' && (
                  <span className="ml-2 align-middle text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                    {contentLanguage === 'fr' ? 'Facilitateur' : 'Facilitator'}
                  </span>
                )}
              </h3>
              {preview.handout.duration && (
                <p className="text-xs text-slate-300">{preview.handout.duration}</p>
              )}
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
