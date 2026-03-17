import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, Check, ChevronRight, ArrowLeft, FileText, Sparkles, X, BookOpen, AlertTriangle, Eye, Pencil, RefreshCw, Image, FileImage, Download } from 'lucide-react'
import { importAPI, type ParsedSlide, type ConvertedSlide } from '../../lib/api'
import { t, type Language } from '../i18n/translations'

interface SlideImportWizardProps {
  onBack: () => void
  onGoToLibrary: () => void
  language: Language
}

type ImportMode = 'convert' | 'external'
type Step = 'upload' | 'select' | 'review' | 'done'

export function SlideImportWizard({ onBack, onGoToLibrary, language }: SlideImportWizardProps) {
  const [importMode, setImportMode] = useState<ImportMode>('convert')
  const [step, setStep] = useState<Step>('upload')
  const [error, setError] = useState<string | null>(null)

  // Upload state
  const [isDragging, setIsDragging] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parsedSlides, setParsedSlides] = useState<ParsedSlide[]>([])
  const [sourceFilename, setSourceFilename] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const externalFileInputRef = useRef<HTMLInputElement>(null)

  // Select state
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set())
  const [moduleName, setModuleName] = useState('')
  const [moduleId, setModuleId] = useState('')
  const [isConverting, setIsConverting] = useState(false)

  // Review state
  const [convertedSlides, setConvertedSlides] = useState<ConvertedSlide[]>([])
  const [editedMarkdown, setEditedMarkdown] = useState<Record<number, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [previewHtml, setPreviewHtml] = useState<Record<number, string>>({})
  const [previewLoading, setPreviewLoading] = useState<Record<number, boolean>>({})
  const [editingSlide, setEditingSlide] = useState<number | null>(null)

  // Saved state
  const [, setSavedModuleId] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  // External slides state
  const [isUploadingExternal, setIsUploadingExternal] = useState(false)
  const [externalDeckName, setExternalDeckName] = useState('')
  const [externalPageCount, setExternalPageCount] = useState(0)
  const [, setExternalDeckId] = useState('')

  const steps: { key: Step; label: string }[] = importMode === 'convert'
    ? [
        { key: 'upload', label: t('importUploadStep', language) },
        { key: 'select', label: t('importSelectStep', language) },
        { key: 'review', label: t('importReviewStep', language) },
        { key: 'done', label: t('importDoneStep', language) },
      ]
    : [
        { key: 'upload', label: t('importUploadStep', language) },
        { key: 'done', label: t('importDoneStep', language) },
      ]

  const currentStepIndex = steps.findIndex(s => s.key === step)

  // ─── Upload handlers ───

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    setIsParsing(true)
    try {
      const result = await importAPI.parse(file)
      setParsedSlides(result.slides)
      setSourceFilename(result.sourceFilename)
      // Auto-set module name from filename
      const baseName = result.sourceFilename.replace(/\.(pptx|pdf|docx)$/i, '').replace(/[_-]/g, ' ')
      setModuleName(baseName)
      setModuleId(baseName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''))
      // Auto-select all slides with text
      const withText = new Set(result.slides.filter(s => s.wordCount > 0).map(s => s.index))
      setSelectedIndices(withText)
      setStep('select')
    } catch (err: any) {
      setError(err.message || 'Failed to parse file')
    } finally {
      setIsParsing(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      if (importMode === 'external') {
        handleExternalFile(file)
      } else {
        handleFile(file)
      }
    }
  }, [handleFile, importMode])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  // ─── External slides handlers ───

  const handleExternalFile = async (file: File) => {
    setError(null)
    setIsUploadingExternal(true)
    try {
      const name = externalDeckName || file.name.replace(/\.pdf$/i, '')
      const result = await importAPI.uploadExternal(file, name)
      setExternalDeckId(result.id)
      setExternalDeckName(result.name)
      setExternalPageCount(result.pageCount)
      setStep('done')
    } catch (err: any) {
      setError(err.message || 'Failed to upload external slides')
    } finally {
      setIsUploadingExternal(false)
    }
  }

  const handleExternalFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleExternalFile(file)
  }, [externalDeckName])

  // ─── Select handlers ───

  const toggleSlide = (index: number) => {
    const next = new Set(selectedIndices)
    if (next.has(index)) {
      next.delete(index)
    } else {
      next.add(index)
    }
    setSelectedIndices(next)
  }

  const toggleAll = () => {
    if (selectedIndices.size === parsedSlides.length) {
      setSelectedIndices(new Set())
    } else {
      setSelectedIndices(new Set(parsedSlides.map(s => s.index)))
    }
  }

  const handleConvert = async () => {
    setError(null)
    setIsConverting(true)
    try {
      const selected = parsedSlides.filter(s => selectedIndices.has(s.index))
      const result = await importAPI.convert(
        selected.map(s => ({ index: s.index, text: s.text, images: s.images })),
        moduleName
      )
      setConvertedSlides(result.slides)
      setEditedMarkdown({})
      setStep('review')
    } catch (err: any) {
      setError(err.message || 'Failed to convert slides')
    } finally {
      setIsConverting(false)
    }
  }

  // ─── Review handlers ───

  const getSlideMarkdown = (index: number) => {
    return editedMarkdown[index] ?? convertedSlides[index]?.markdown ?? ''
  }

  // Render a single slide markdown to HTML preview
  const renderSlidePreview = async (index: number, markdown: string) => {
    setPreviewLoading(prev => ({ ...prev, [index]: true }))
    try {
      const wrappedMarkdown = `---\nmarp: true\ntheme: fastr\npaginate: false\n---\n\n${markdown}`
      const response = await fetch('/api/content/render', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: wrappedMarkdown }),
      })
      if (response.ok) {
        const data = await response.json()
        setPreviewHtml(prev => ({ ...prev, [index]: data.html }))
      } else {
        console.error('Render failed:', response.status)
      }
    } catch (err) {
      console.error('Failed to render slide preview:', err)
    } finally {
      setPreviewLoading(prev => ({ ...prev, [index]: false }))
    }
  }

  // Render all slide previews when converted slides are set
  const renderAllPreviews = useRef(false)
  useEffect(() => {
    if (step === 'review' && convertedSlides.length > 0 && !renderAllPreviews.current) {
      renderAllPreviews.current = true
      for (let i = 0; i < convertedSlides.length; i++) {
        const md = editedMarkdown[i] ?? convertedSlides[i].markdown
        renderSlidePreview(i, md)
      }
    }
    if (step !== 'review') {
      renderAllPreviews.current = false
    }
  }, [step, convertedSlides])

  const handleSave = async () => {
    setError(null)
    setIsSaving(true)
    try {
      const selectedParsed = parsedSlides.filter(s => selectedIndices.has(s.index))
      const slides = convertedSlides.map((cs, i) => ({
        order: i,
        originalText: selectedParsed[i]?.text || null,
        markdown: getSlideMarkdown(i),
        title: cs.title,
      }))

      const result = await importAPI.save({
        id: moduleId,
        name: moduleName,
        sourceFilename,
        slides,
      })

      setSavedModuleId(result.id)
      setStep('done')
    } catch (err: any) {
      setError(err.message || 'Failed to save module')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportPPTX = async () => {
    setError(null)
    setIsExporting(true)
    try {
      const slides = convertedSlides.map((cs, i) => ({
        markdown: getSlideMarkdown(i),
        title: cs.title,
      }))
      const result = await importAPI.exportPPTX(slides, moduleName)
      // Trigger browser download
      window.open(result.downloadUrl, '_blank')
    } catch (err: any) {
      setError(err.message || 'Failed to export PPTX')
    } finally {
      setIsExporting(false)
    }
  }

  // Reset everything
  const resetWizard = () => {
    setStep('upload')
    setParsedSlides([])
    setConvertedSlides([])
    setSelectedIndices(new Set())
    setModuleName('')
    setModuleId('')
    setEditedMarkdown({})
    setError(null)
    setExternalDeckName('')
    setExternalDeckId('')
    setExternalPageCount(0)
  }

  // ─── Render ───

  return (
    <div className="h-screen bg-gradient-to-b from-fastr-light-warm to-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{t('importSlides', language)}</h1>
          <p className="text-sm text-gray-500">{t('importSlidesDesc', language)}</p>
        </div>
      </div>

      {/* Mode toggle (only show on upload step) */}
      {step === 'upload' && (
        <div className="px-6 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            <button
              onClick={() => { setImportMode('convert'); resetWizard() }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                importMode === 'convert'
                  ? 'bg-fastr-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {t('importModeConvert', language)}
            </button>
            <button
              onClick={() => { setImportMode('external'); resetWizard() }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                importMode === 'external'
                  ? 'bg-fastr-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileImage className="w-4 h-4" />
              {t('importModeExternal', language)}
            </button>
          </div>
        </div>
      )}

      {/* Step indicator (only for convert mode, or simplified for external) */}
      {(importMode === 'convert' || step !== 'upload') && (
        <div className="px-6 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            {steps.map((s, i) => (
              <React.Fragment key={s.key}>
                {i > 0 && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  i === currentStepIndex
                    ? 'bg-fastr-primary text-white'
                    : i < currentStepIndex
                      ? 'bg-fastr-primary/10 text-fastr-primary'
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {i < currentStepIndex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="w-5 h-5 flex items-center justify-center text-xs rounded-full bg-current/10">{i + 1}</span>
                  )}
                  {s.label}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">

          {/* ─── Step 1: Upload (Convert mode) ─── */}
          {step === 'upload' && importMode === 'convert' && (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div
                className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? 'border-fastr-primary bg-fastr-primary/5'
                    : 'border-gray-300 hover:border-fastr-primary/50 hover:bg-gray-50'
                } ${isParsing ? 'pointer-events-none opacity-60' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {isParsing ? (
                  <>
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-fastr-primary/30 border-t-fastr-primary rounded-full animate-spin" />
                    <p className="text-gray-600 font-medium">{t('importParsing', language)}</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-700 font-medium mb-1">{t('importDropzone', language)}</p>
                    <p className="text-gray-500 text-sm mb-3">{t('importOrClick', language)}</p>
                    <p className="text-gray-400 text-xs">{t('importAcceptedFormats', language)}</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pptx,.pdf,.docx"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}

          {/* ─── Step 1: Upload (External mode) ─── */}
          {step === 'upload' && importMode === 'external' && (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-full max-w-lg mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('externalDeckName', language)}</label>
                <input
                  type="text"
                  value={externalDeckName}
                  onChange={(e) => setExternalDeckName(e.target.value)}
                  placeholder={t('externalDeckNamePlaceholder', language)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary"
                />
              </div>
              <div
                className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
                } ${isUploadingExternal ? 'pointer-events-none opacity-60' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => externalFileInputRef.current?.click()}
              >
                {isUploadingExternal ? (
                  <>
                    <div className="w-12 h-12 mx-auto mb-4 border-4 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
                    <p className="text-gray-600 font-medium">{t('externalProcessing', language)}</p>
                    <p className="text-gray-400 text-sm mt-1">{t('externalProcessingDesc', language)}</p>
                  </>
                ) : (
                  <>
                    <FileImage className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                    <p className="text-gray-700 font-medium mb-1">{t('externalDropzone', language)}</p>
                    <p className="text-gray-500 text-sm mb-3">{t('importOrClick', language)}</p>
                    <p className="text-gray-400 text-xs">{t('externalAcceptedFormat', language)}</p>
                  </>
                )}
              </div>
              <input
                ref={externalFileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleExternalFileInput}
                className="hidden"
              />
              <p className="text-gray-400 text-xs mt-4 max-w-lg text-center">
                {t('externalHelpText', language)}
              </p>
            </div>
          )}

          {/* ─── Step 2: Select ─── */}
          {step === 'select' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{t('importSelectSlides', language)}</h2>
                <span className="text-sm text-gray-500">
                  {selectedIndices.size} / {parsedSlides.length} {t('importSlidesSelected', language)}
                </span>
              </div>

              {/* Module name + ID */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('importModuleName', language)}</label>
                  <input
                    type="text"
                    value={moduleName}
                    onChange={(e) => {
                      setModuleName(e.target.value)
                      setModuleId(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''))
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('importModuleId', language)}</label>
                  <input
                    type="text"
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary"
                  />
                </div>
              </div>

              {/* Select all / deselect all */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={toggleAll}
                  className="text-sm text-fastr-primary hover:underline"
                >
                  {selectedIndices.size === parsedSlides.length
                    ? t('importDeselectAll', language)
                    : t('importSelectAll', language)}
                </button>
              </div>

              {/* Slide grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {parsedSlides.map((slide) => {
                  const hasImages = slide.images && slide.images.length > 0
                  return (
                    <button
                      key={slide.index}
                      onClick={() => toggleSlide(slide.index)}
                      className={`text-left p-3 rounded-lg border-2 transition-colors ${
                        selectedIndices.has(slide.index)
                          ? 'border-fastr-primary bg-fastr-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedIndices.has(slide.index)
                            ? 'border-fastr-primary bg-fastr-primary'
                            : 'border-gray-300'
                        }`}>
                          {selectedIndices.has(slide.index) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-400">#{slide.index + 1}</span>
                            <span className="text-xs text-gray-400">{slide.wordCount} {t('importWords', language)}</span>
                            {hasImages && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-medium rounded">
                                <Image className="w-3 h-3" />
                                {t('importVisualSlide', language)}
                              </span>
                            )}
                          </div>
                          {/* Image thumbnails */}
                          {hasImages && (
                            <div className="flex gap-1 mb-1.5">
                              {slide.images!.slice(0, 3).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={`data:${img.contentType};base64,${img.base64}`}
                                  alt=""
                                  className="w-12 h-9 object-cover rounded border border-gray-200"
                                />
                              ))}
                              {slide.images!.length > 3 && (
                                <span className="w-12 h-9 flex items-center justify-center bg-gray-100 rounded border border-gray-200 text-[10px] text-gray-500">
                                  +{slide.images!.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {slide.text || <span className="italic text-gray-400">{t('importNoText', language)}</span>}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Convert button */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  {t('back', language)}
                </button>
                <button
                  onClick={handleConvert}
                  disabled={selectedIndices.size === 0 || !moduleName.trim() || isConverting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-fastr-primary text-white rounded-lg text-sm font-medium hover:bg-fastr-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isConverting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('importConverting', language)}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {t('importConvert', language)}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 3: Review ─── */}
          {step === 'review' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('importReviewSlides', language)}</h2>

              <div className="space-y-5 mb-6">
                {convertedSlides.map((slide, i) => {
                  const selectedParsed = parsedSlides.filter(s => selectedIndices.has(s.index))
                  const original = selectedParsed[i]
                  const isEditing = editingSlide === i
                  const html = previewHtml[i]
                  const isLoading = previewLoading[i]

                  return (
                    <div key={i} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      {/* Header */}
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">{slide.title}</span>
                          <span className="text-xs text-gray-400">#{i + 1}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {isEditing && (
                            <button
                              onClick={() => {
                                renderSlidePreview(i, getSlideMarkdown(i))
                                setEditingSlide(null)
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-fastr-primary hover:bg-fastr-primary/10 rounded-md transition-colors"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              {t('preview', language)}
                            </button>
                          )}
                          <button
                            onClick={() => setEditingSlide(isEditing ? null : i)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                              isEditing
                                ? 'text-amber-600 bg-amber-50'
                                : 'text-gray-500 hover:bg-gray-100'
                            }`}
                          >
                            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                            {isEditing ? t('close', language) : t('editSession', language)}
                          </button>
                        </div>
                      </div>

                      {/* Slide preview */}
                      <div className="bg-gray-100 p-4 flex justify-center">
                        {isLoading ? (
                          <div className="flex items-center justify-center h-48">
                            <div className="w-6 h-6 border-2 border-fastr-primary/30 border-t-fastr-primary rounded-full animate-spin" />
                          </div>
                        ) : html ? (
                          <iframe
                            srcDoc={html.replace('</head>', `<style>
                              html, body { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; }
                              svg[data-marpit-svg] { display: block; width: 100%; height: 100%; }
                            </style></head>`)}
                            className="bg-white rounded-lg shadow-md"
                            style={{ width: '640px', height: '360px', border: 'none' }}
                            title={`Slide ${i + 1} preview`}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
                            {t('noPreviewAvailable', language)}
                          </div>
                        )}
                      </div>

                      {/* Edit panel (collapsible) */}
                      {isEditing && (
                        <div className="border-t border-gray-200">
                          <div className="grid grid-cols-2 divide-x divide-gray-200">
                            {/* Original text */}
                            <div className="p-3">
                              <p className="text-xs font-medium text-gray-400 mb-2">{t('importOriginal', language)}</p>
                              <p className="text-sm text-gray-600 whitespace-pre-wrap max-h-48 overflow-y-auto">{original?.text || ''}</p>
                            </div>
                            {/* Editable markdown */}
                            <div className="p-3">
                              <p className="text-xs font-medium text-gray-400 mb-2">{t('importConverted', language)}</p>
                              <textarea
                                value={getSlideMarkdown(i)}
                                onChange={(e) => setEditedMarkdown({ ...editedMarkdown, [i]: e.target.value })}
                                className="w-full h-48 text-sm font-mono text-gray-700 border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary resize-y"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setStep('select')}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  {t('back', language)}
                </button>
                <button
                  onClick={handleExportPPTX}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-5 py-2.5 border border-fastr-primary text-fastr-primary rounded-lg text-sm font-medium hover:bg-fastr-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-fastr-primary/30 border-t-fastr-primary rounded-full animate-spin" />
                      {t('importExporting', language)}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      {t('importDownloadPPTX', language)}
                    </>
                  )}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-fastr-primary text-white rounded-lg text-sm font-medium hover:bg-fastr-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('importSaving', language)}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {t('importSaveModule', language)}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 4: Done ─── */}
          {step === 'done' && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {importMode === 'external' ? t('externalSuccess', language) : t('importSuccess', language)}
              </h2>
              <p className="text-gray-500 mb-2">
                {importMode === 'external' ? externalDeckName : moduleName}
              </p>
              {importMode === 'external' && (
                <p className="text-sm text-gray-400 mb-6">
                  {externalPageCount} {t('externalPagesImported', language)}
                </p>
              )}
              {importMode !== 'external' && <div className="mb-6" />}
              <div className="flex gap-3">
                <button
                  onClick={onGoToLibrary}
                  className="flex items-center gap-2 px-5 py-2.5 bg-fastr-primary text-white rounded-lg text-sm font-medium hover:bg-fastr-primary/90 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  {t('importGoToLibrary', language)}
                </button>
                <button
                  onClick={resetWizard}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {t('importAnother', language)}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
