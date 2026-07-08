import { useState, useEffect, useMemo } from 'react'
import { Loader2, GitFork, RotateCcw } from 'lucide-react'
import { useWorkshopStore, Session } from '../stores/workshop'
import { t } from '../i18n/translations'
import { workshopAPI, Language } from '../../lib/api'
import { useToast } from './Toast'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Textarea } from './ui/Textarea'

/** The provenance a grid slide carries (from POST /api/export/:id/slides). */
export interface EditableSlideTarget {
  sourceRef: string
  sourceKind: string
  overridden: boolean
  sessionName: string
  dayNumber: number
  sessionIndex: number
}

interface SlideMarkdownEditorProps {
  workshopId: string
  slide: EditableSlideTarget
  language?: Language
  /** Called after a successful save or reset — parent should rebuild the grid. */
  onSaved: () => void
  onClose: () => void
}

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\s*/
// A `---` slide separator on its own line, after a blank line (setext-safe enough
// for a UI hint; the server owns the authoritative count).
const SEPARATOR_RE = /\n\s*\n {0,3}---\s*(\n|$)/

/**
 * Modal markdown editor for any editable slide in the preview grid.
 * Library/template/imported slides are forked into a per-workshop custom
 * slide on first save (session.slideOverrides points the builder at the
 * fork); custom slides are edited in place.
 */
export function SlideMarkdownEditor({ workshopId, slide, language, onSaved, onClose }: SlideMarkdownEditorProps) {
  const { currentConfig, contentLanguage, setSlideOverride, removeSlideOverride } = useWorkshopStore()
  const { showToast } = useToast()

  const session: Session | undefined = (currentConfig?.schedule[`day${slide.dayNumber}`] || [])[slide.sessionIndex]
  const isCustom = slide.sourceKind === 'custom'
  const forkRef = isCustom ? slide.sourceRef : session?.slideOverrides?.[slide.sourceRef]

  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')

  const isMultiSlide = useMemo(() => SEPARATOR_RE.test(content), [content])

  // Load the current markdown (the fork when one exists, else the source)
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    // No language → the server falls back to the workshop's configured
    // language, matching what the preview grid renders.
    workshopAPI
      .getSlideContent(workshopId, forkRef || slide.sourceRef, language)
      .then(res => {
        if (cancelled) return
        setContent((res.content || '').replace(FRONTMATTER_RE, ''))
      })
      .catch(err => {
        if (!cancelled) showToast(`Failed to load slide content: ${err.message}`, 'error')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workshopId, forkRef, slide.sourceRef])

  // Debounced live preview (same pattern as CustomSlideEditor)
  useEffect(() => {
    if (loading) return
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/content/render', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown: `---\nmarp: true\ntheme: fastr\n---\n\n${content}` }),
        })
        if (response.ok) {
          const data = await response.json()
          setPreviewHtml(data.html.replace('<head>', `<head><base href="${window.location.origin}/">`))
        }
      } catch (err) {
        console.error('Preview render error:', err)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [content, loading])

  /** Deterministic fork filename; suffixed if another fork already claimed it. */
  const buildForkFilename = async (): Promise<string> => {
    let base = `fork_${slide.sourceRef.replace(/[/:]/g, '_')}`
    if (!base.endsWith('.md')) base += '.md'
    const existing = new Set((await workshopAPI.getCustomSlides(workshopId)).map((s: any) => s.filename))
    if (!existing.has(base)) return base
    const stem = base.slice(0, -3)
    for (let i = 2; ; i++) {
      const candidate = `${stem}_${i}.md`
      if (!existing.has(candidate)) return candidate
    }
  }

  const handleSave = async () => {
    if (!content.trim()) {
      showToast('Slide content cannot be empty', 'error')
      return
    }
    setSaving(true)
    try {
      if (forkRef) {
        // Existing fork or genuine custom slide: edit in place
        await workshopAPI.saveCustomSlide(workshopId, forkRef.slice('custom_slides/'.length), content)
        showToast('Slide content saved', 'success')
      } else {
        // First edit of a library/template/imported slide: fork it
        const forkFilename = await buildForkFilename()
        await workshopAPI.saveCustomSlide(workshopId, forkFilename, content)
        setSlideOverride(slide.dayNumber, slide.sessionIndex, slide.sourceRef, `custom_slides/${forkFilename}`)
        showToast('Library slide forked for this workshop', 'success')
      }
      onSaved()
      onClose()
    } catch (err: any) {
      showToast(`Slide save failed: ${err.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!forkRef || isCustom) return
    if (!confirm(t('resetToLibraryConfirm', contentLanguage))) return
    setSaving(true)
    try {
      await workshopAPI.deleteCustomSlide(workshopId, forkRef.slice('custom_slides/'.length))
      removeSlideOverride(slide.dayNumber, slide.sessionIndex, slide.sourceRef)
      showToast(t('resetToLibrary', contentLanguage), 'success')
      onSaved()
      onClose()
    } catch (err: any) {
      showToast(`Reset failed: ${err.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  const showResetButton = !!forkRef && !isCustom

  return (
    <Modal
      open
      onClose={onClose}
      title={`${t('editSlide', contentLanguage)} — ${slide.sessionName}`}
      size="full"
      footer={
        <div className="flex w-full items-center justify-between">
          <div>
            {showResetButton && (
              <Button
                variant="ghost"
                onClick={handleReset}
                disabled={saving}
                className="text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="w-4 h-4" />
                {t('resetToLibrary', contentLanguage)}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              {t('cancel', contentLanguage)}
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={loading || saving || !dirty}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {t('saveChanges', contentLanguage)}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-2 h-[70vh]">
        {!forkRef && !isCustom && (
          <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-caption text-amber-900">
            <GitFork className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              {t('forkBanner', contentLanguage)} {t('forkAndEditHint', contentLanguage)}
            </span>
          </div>
        )}
        {isMultiSlide && (
          <div className="text-caption text-slate-500">{t('multiSlideFile', contentLanguage)}</div>
        )}
        <div className="flex gap-4 flex-1 min-h-0">
          <div className="w-1/2 flex flex-col min-h-0">
            {loading ? (
              <div className="flex items-center gap-2 text-body-sm text-slate-500 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('forking', contentLanguage)}
              </div>
            ) : (
              <Textarea
                value={content}
                onChange={e => { setContent(e.target.value); setDirty(true) }}
                className="font-mono text-caption flex-1 resize-none"
                spellCheck={false}
              />
            )}
          </div>
          <div className="w-1/2 flex flex-col min-h-0 bg-slate-100 rounded-lg overflow-auto">
            {previewHtml ? (
              <iframe
                srcDoc={previewHtml}
                className="w-full h-full bg-white rounded-lg"
                title="Slide preview"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-body-sm text-slate-400">
                {t('loadingPreview', contentLanguage)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}
