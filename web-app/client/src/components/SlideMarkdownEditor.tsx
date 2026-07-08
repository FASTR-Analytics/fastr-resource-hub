import { useState, useEffect, useMemo } from 'react'
import { Loader2, GitFork, RotateCcw, ImagePlus, Minus, Plus, Trash2, Upload, X, Image as ImageIcon, RefreshCw } from 'lucide-react'
import { useWorkshopStore, Session } from '../stores/workshop'
import { t } from '../i18n/translations'
import api, { workshopAPI, Language, Asset } from '../../lib/api'
import { useToast } from './Toast'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Textarea } from './ui/Textarea'

/** The provenance a grid slide carries (from POST /api/export/:id/slides). */
export interface EditableSlideTarget {
  sourceRef: string
  sourceKind: string
  overridden: boolean
  stale?: boolean
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
const IMAGE_RE = /!\[([^\]]*)\]\(([^)]+)\)/g

interface SlideImage {
  alt: string
  url: string
  start: number
  end: number
  width: number | null
  isBackground: boolean
}

function parseImages(content: string): SlideImage[] {
  const images: SlideImage[] = []
  for (const m of content.matchAll(IMAGE_RE)) {
    const alt = m[1]
    const widthMatch = alt.match(/w:(\d+)/)
    images.push({
      alt,
      url: m[2],
      start: m.index!,
      end: m.index! + m[0].length,
      width: widthMatch ? parseInt(widthMatch[1], 10) : null,
      isBackground: /(^|\s)bg(\s|$)/.test(alt),
    })
  }
  return images
}

/** Repo-relative image paths (../../resources/…) → the static mount the app serves. */
function displayUrl(url: string): string {
  return url.replace(/^(\.\.\/)+resources\//, '/resources/')
}

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

  // Asset picker: 'add' appends a new image; a number replaces that image's URL
  const [pickerMode, setPickerMode] = useState<'add' | number | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetsLoading, setAssetsLoading] = useState(false)
  const [uploadingAsset, setUploadingAsset] = useState(false)

  const isMultiSlide = useMemo(() => SEPARATOR_RE.test(content), [content])
  const images = useMemo(() => parseImages(content), [content])

  const updateContent = (next: string) => {
    setContent(next)
    setDirty(true)
  }

  const openPicker = async (mode: 'add' | number) => {
    setPickerMode(mode)
    setAssetsLoading(true)
    try {
      setAssets(await api.listAssets(workshopId))
    } catch (err) {
      console.error('Failed to load assets:', err)
    } finally {
      setAssetsLoading(false)
    }
  }

  const handleUploadAsset = async (files: FileList | null) => {
    if (!files) return
    setUploadingAsset(true)
    try {
      for (const file of Array.from(files)) {
        await api.uploadAsset(workshopId, file)
      }
      setAssets(await api.listAssets(workshopId))
    } catch (err: any) {
      showToast(`Upload failed: ${err.message}`, 'error')
    } finally {
      setUploadingAsset(false)
    }
  }

  const handlePickAsset = (asset: Asset) => {
    if (pickerMode === 'add') {
      const md = `![w:700](${asset.url})`
      updateContent(content.trim() ? `${content.replace(/\s*$/, '')}\n\n${md}\n` : `${md}\n`)
    } else if (typeof pickerMode === 'number') {
      const img = images[pickerMode]
      if (img) {
        // Swap the URL only — keep the alt directives (w:, bg, etc.)
        updateContent(content.slice(0, img.start) + `![${img.alt}](${asset.url})` + content.slice(img.end))
      }
    }
    setPickerMode(null)
  }

  const handleResizeImage = (index: number, delta: number) => {
    const img = images[index]
    if (!img || img.isBackground) return
    const next = Math.min(1200, Math.max(100, (img.width ?? 700) + delta))
    const newAlt = img.width !== null
      ? img.alt.replace(/w:\d+/, `w:${next}`)
      : `w:${next}${img.alt ? ' ' + img.alt : ''}`
    updateContent(content.slice(0, img.start) + `![${newAlt}](${img.url})` + content.slice(img.end))
  }

  const handleRemoveImage = (index: number) => {
    const img = images[index]
    if (!img) return
    const before = content.slice(0, img.start).replace(/[ \t]*$/, '')
    const after = content.slice(img.end).replace(/^[ \t]*\r?\n/, '')
    updateContent(before + after)
  }

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
        // First edit of a library/template/imported slide: fork it, recording
        // the source ref so stale-fork detection can compare against it later.
        const forkFilename = await buildForkFilename()
        await workshopAPI.saveCustomSlide(workshopId, forkFilename, content, slide.sourceRef)
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
      <div className="relative flex flex-col gap-2 h-[70vh]">
        {!forkRef && !isCustom && (
          <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-caption text-amber-900">
            <GitFork className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              {t('forkBanner', contentLanguage)} {t('forkAndEditHint', contentLanguage)}
            </span>
          </div>
        )}
        {slide.stale && (
          <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-300 px-3 py-2 text-caption text-amber-900">
            <RefreshCw className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{t('staleForkBanner', contentLanguage)}</span>
          </div>
        )}
        {isMultiSlide && (
          <div className="text-caption text-slate-500">{t('multiSlideFile', contentLanguage)}</div>
        )}

        {/* Image strip: swap, resize or remove images without touching markdown */}
        {!loading && (
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <div key={`${img.url}-${i}`} className="flex-shrink-0 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-1.5">
                <img
                  src={displayUrl(img.url)}
                  alt={img.alt}
                  className="w-20 h-12 object-contain bg-white rounded border border-slate-200"
                />
                <div className="flex flex-col gap-1">
                  {img.isBackground ? (
                    <span className="text-caption text-slate-400 px-1">background</span>
                  ) : (
                    <div className="flex items-center gap-1 text-caption text-slate-600">
                      <button
                        onClick={() => handleResizeImage(i, -100)}
                        className="p-0.5 rounded hover:bg-slate-200"
                        title="Smaller"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-10 text-center">{img.width ?? 700}px</span>
                      <button
                        onClick={() => handleResizeImage(i, 100)}
                        className="p-0.5 rounded hover:bg-slate-200"
                        title="Larger"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openPicker(i)}
                      className="text-caption px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 hover:border-fastr-secondary hover:text-fastr-secondary"
                    >
                      {t('replaceImage', contentLanguage)}
                    </button>
                    <button
                      onClick={() => handleRemoveImage(i)}
                      className="p-0.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title={t('removeImage', contentLanguage)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => openPicker('add')}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-caption text-slate-500 hover:border-fastr-secondary hover:text-fastr-secondary transition-colors"
            >
              <ImagePlus className="w-4 h-4" />
              {t('addImage', contentLanguage)}
            </button>
          </div>
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

        {/* Asset picker — side panel, same flow as CustomSlideEditor's */}
        {pickerMode !== null && (
          <div className="absolute top-0 right-0 bottom-0 w-80 bg-white border-l border-slate-200 shadow-elevated flex flex-col z-10 rounded-r-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                {typeof pickerMode === 'number' ? t('replaceImage', contentLanguage) : t('addImage', contentLanguage)}
              </h3>
              <button
                onClick={() => setPickerMode(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-3">
              <div
                className="border-2 border-dashed border-slate-300 rounded-lg p-3 mb-3 text-center hover:border-slate-400 transition-colors"
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); handleUploadAsset(e.dataTransfer.files) }}
              >
                {uploadingAsset ? (
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-caption">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <label className="text-caption text-fastr-secondary hover:underline cursor-pointer">
                      Drag & drop or browse files
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleUploadAsset(e.target.files)}
                      />
                    </label>
                  </>
                )}
              </div>
              {assetsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-fastr-secondary" />
                </div>
              ) : assets.length === 0 ? (
                <div className="text-center text-slate-400 py-10 text-caption">
                  No images uploaded yet for this workshop
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {assets.map((asset) => (
                    <button
                      key={asset.filename}
                      onClick={() => handlePickAsset(asset)}
                      className="group relative aspect-video bg-slate-50 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-fastr-secondary transition-colors"
                    >
                      <img src={asset.url} alt={asset.filename} className="w-full h-full object-contain" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5">
                        <p className="text-[10px] text-white truncate">{asset.filename}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
