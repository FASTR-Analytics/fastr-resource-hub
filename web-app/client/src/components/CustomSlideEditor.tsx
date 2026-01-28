import { useState, useEffect, useRef } from 'react'
import { X, Save, Eye, Sparkles, Layout, Layers, Plus, Trash2, Image, Upload, Loader2 } from 'lucide-react'
import api, { Asset } from '../../lib/api'

interface CustomSlideEditorProps {
  workshopId: string
  dayNumber: number
  onSave: (filename: string, content: string, sessionName: string) => void
  onClose: () => void
}

type SlideType = 'content' | 'section'
type EditorMode = 'simple' | 'advanced'

interface ContentSlide {
  title: string
  bullets: string[]
}

interface SectionSlide {
  title: string
  subtitle: string
}

const SLIDE_INFO = {
  content: {
    name: 'Content Slide',
    description: 'Standard slide with title and bullet points',
  },
  section: {
    name: 'Section Slide',
    description: 'Section divider with background image',
  },
}

// Generate markdown from form data
function generateContentMarkdown(slides: ContentSlide[]): string {
  return slides
    .map((slide) => {
      const bullets = slide.bullets
        .filter((b) => b.trim())
        .map((b) => `- ${b}`)
        .join('\n')
      return `## ${slide.title || 'Slide Title'}\n\n${bullets || '- Add your content here'}`
    })
    .join('\n\n---\n\n')
}

function generateSectionMarkdown(data: SectionSlide): string {
  return `<!-- _class: section-cover -->

![bg](/resources/backgrounds/section_slide.png)

# ${data.title || 'Section Title'}

${data.subtitle || ''}`
}

export function CustomSlideEditor({ workshopId, dayNumber, onSave, onClose }: CustomSlideEditorProps) {
  const [selectedType, setSelectedType] = useState<SlideType | null>(null)
  const [editorMode, setEditorMode] = useState<EditorMode>('simple')
  const [markdown, setMarkdown] = useState('')
  const [sessionName, setSessionName] = useState('')
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Asset picker state
  const [showAssetPicker, setShowAssetPicker] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetsLoading, setAssetsLoading] = useState(false)
  const [uploadingAsset, setUploadingAsset] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Form state for simple mode
  const [contentSlides, setContentSlides] = useState<ContentSlide[]>([
    { title: '', bullets: ['', '', ''] },
  ])
  const [sectionData, setSectionData] = useState<SectionSlide>({
    title: '',
    subtitle: '',
  })

  // Load assets when asset picker opens
  const loadAssets = async () => {
    setAssetsLoading(true)
    try {
      const assetList = await api.listAssets(workshopId)
      setAssets(assetList)
    } catch (err) {
      console.error('Failed to load assets:', err)
    } finally {
      setAssetsLoading(false)
    }
  }

  const openAssetPicker = () => {
    setShowAssetPicker(true)
    loadAssets()
  }

  // Handle asset upload in picker
  const handleUploadAsset = async (files: FileList | null) => {
    if (!files) return

    setUploadingAsset(true)
    try {
      for (const file of Array.from(files)) {
        await api.uploadAsset(workshopId, file)
      }
      await loadAssets()
    } catch (err: any) {
      console.error('Upload failed:', err)
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploadingAsset(false)
    }
  }

  // Insert asset markdown at cursor position
  const insertAsset = (asset: Asset) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newMarkdown = markdown.slice(0, start) + asset.markdown + markdown.slice(end)
      setMarkdown(newMarkdown)

      // Restore cursor position after state update
      setTimeout(() => {
        textarea.focus()
        const newPos = start + asset.markdown.length
        textarea.setSelectionRange(newPos, newPos)
      }, 0)
    } else {
      // If textarea not focused, append to end
      setMarkdown(prev => prev + '\n' + asset.markdown)
    }
    setShowAssetPicker(false)
  }

  const selectTemplate = (type: SlideType) => {
    setSelectedType(type)
    // Reset form data
    setContentSlides([{ title: '', bullets: ['', '', ''] }])
    setSectionData({ title: '', subtitle: '' })
    setMarkdown('')
  }

  // Update markdown when form changes (simple mode)
  useEffect(() => {
    if (editorMode === 'simple' && selectedType) {
      if (selectedType === 'content') {
        setMarkdown(generateContentMarkdown(contentSlides))
      } else {
        setMarkdown(generateSectionMarkdown(sectionData))
      }
    }
  }, [editorMode, selectedType, contentSlides, sectionData])

  // Content slide helpers
  const updateSlideTitle = (index: number, title: string) => {
    setContentSlides((prev) =>
      prev.map((slide, i) => (i === index ? { ...slide, title } : slide))
    )
  }

  const updateBullet = (slideIndex: number, bulletIndex: number, value: string) => {
    setContentSlides((prev) =>
      prev.map((slide, i) =>
        i === slideIndex
          ? {
              ...slide,
              bullets: slide.bullets.map((b, j) => (j === bulletIndex ? value : b)),
            }
          : slide
      )
    )
  }

  const addBullet = (slideIndex: number) => {
    setContentSlides((prev) =>
      prev.map((slide, i) =>
        i === slideIndex ? { ...slide, bullets: [...slide.bullets, ''] } : slide
      )
    )
  }

  const removeBullet = (slideIndex: number, bulletIndex: number) => {
    setContentSlides((prev) =>
      prev.map((slide, i) =>
        i === slideIndex
          ? { ...slide, bullets: slide.bullets.filter((_, j) => j !== bulletIndex) }
          : slide
      )
    )
  }

  const addSlide = () => {
    setContentSlides((prev) => [...prev, { title: '', bullets: ['', '', ''] }])
  }

  const removeSlide = (index: number) => {
    if (contentSlides.length > 1) {
      setContentSlides((prev) => prev.filter((_, i) => i !== index))
    }
  }

  // Render preview when markdown changes
  useEffect(() => {
    const timer = setTimeout(() => {
      renderPreview()
    }, 500)
    return () => clearTimeout(timer)
  }, [markdown])

  const renderPreview = async () => {
    try {
      const response = await fetch('/api/content/render', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: `---\nmarp: true\ntheme: fastr\n---\n\n${markdown}` }),
      })

      if (response.ok) {
        const data = await response.json()
        // Add base URL for resources
        const htmlWithBase = data.html.replace('<head>', '<head><base href="http://localhost:3001/">')
        setPreviewHtml(htmlWithBase)
      }
    } catch (err) {
      console.error('Preview render error:', err)
    }
  }

  const handleSave = async () => {
    if (!sessionName.trim()) {
      setError('Please enter a session name')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Generate filename from session name
      const filename = sessionName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '') + '.md'

      // Save to API
      const response = await fetch(`/api/workshops/${workshopId}/custom-slides`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content: markdown }),
      })

      if (!response.ok) {
        throw new Error('Failed to save slide')
      }

      onSave(filename, markdown, sessionName)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-fastr-secondary" />
            <h2 className="text-lg font-semibold text-white">Create Custom Slide</h2>
            <span className="text-sm text-gray-400">Day {dayNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedType && (
              <>
                <div className="flex bg-gray-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setEditorMode('simple')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      editorMode === 'simple'
                        ? 'bg-gray-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Simple
                  </button>
                  <button
                    onClick={() => setEditorMode('advanced')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      editorMode === 'advanced'
                        ? 'bg-gray-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Markdown
                  </button>
                </div>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    showPreview ? 'bg-fastr-secondary text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Selector or Editor */}
        {!selectedType ? (
          // Template picker
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <h3 className="text-xl font-semibold text-white mb-2">Choose a slide type</h3>
            <p className="text-gray-400 mb-8">Select a template to get started</p>

            <div className="flex gap-6">
              {/* Content Slide */}
              <button
                onClick={() => selectTemplate('content')}
                className="group flex flex-col items-center p-6 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-fastr-secondary rounded-xl transition-all w-64"
              >
                <div className="w-16 h-16 mb-4 bg-gray-700 group-hover:bg-fastr-secondary/20 rounded-lg flex items-center justify-center">
                  <Layout className="w-8 h-8 text-gray-400 group-hover:text-fastr-secondary" />
                </div>
                <span className="text-lg font-medium text-white mb-1">{SLIDE_INFO.content.name}</span>
                <span className="text-sm text-gray-400 text-center">{SLIDE_INFO.content.description}</span>
              </button>

              {/* Section Slide */}
              <button
                onClick={() => selectTemplate('section')}
                className="group flex flex-col items-center p-6 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-fastr-secondary rounded-xl transition-all w-64"
              >
                <div className="w-16 h-16 mb-4 bg-gray-700 group-hover:bg-fastr-secondary/20 rounded-lg flex items-center justify-center">
                  <Layers className="w-8 h-8 text-gray-400 group-hover:text-fastr-secondary" />
                </div>
                <span className="text-lg font-medium text-white mb-1">{SLIDE_INFO.section.name}</span>
                <span className="text-sm text-gray-400 text-center">{SLIDE_INFO.section.description}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Session name input */}
            <div className="px-4 py-3 border-b border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">Session Name</label>
                  <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="e.g., Data Quality Activity, Group Discussion..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fastr-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Template</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => selectTemplate('content')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedType === 'content'
                          ? 'bg-fastr-secondary text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Content
                    </button>
                    <button
                      onClick={() => selectTemplate('section')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedType === 'section'
                          ? 'bg-fastr-secondary text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Section
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Editor and Preview */}
            <div className="flex-1 flex overflow-hidden">
              {/* Editor (Simple or Advanced) */}
              <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-700`}>
                {editorMode === 'advanced' ? (
                  // Advanced: Raw markdown
                  <>
                    <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                      <span className="text-sm text-gray-400">Markdown</span>
                      <button
                        onClick={openAssetPicker}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded transition-colors"
                      >
                        <Image className="w-3.5 h-3.5" />
                        Insert Image
                      </button>
                    </div>
                    <textarea
                      ref={textareaRef}
                      value={markdown}
                      onChange={(e) => setMarkdown(e.target.value)}
                      className="flex-1 w-full p-4 bg-gray-950 text-gray-100 font-mono text-sm resize-none focus:outline-none"
                      placeholder="Write your slide content in Markdown..."
                      spellCheck={false}
                    />
                  </>
                ) : selectedType === 'content' ? (
                  // Simple: Content slides form
                  <div className="flex-1 overflow-auto p-4 space-y-4">
                    {contentSlides.map((slide, slideIndex) => (
                      <div
                        key={slideIndex}
                        className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-400">
                            Slide {slideIndex + 1}
                          </span>
                          {contentSlides.length > 1 && (
                            <button
                              onClick={() => removeSlide(slideIndex)}
                              className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlideTitle(slideIndex, e.target.value)}
                          placeholder="Slide title"
                          className="w-full px-3 py-2 mb-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fastr-secondary"
                        />

                        <div className="space-y-2">
                          {slide.bullets.map((bullet, bulletIndex) => (
                            <div key={bulletIndex} className="flex items-center gap-2">
                              <span className="text-gray-500">•</span>
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) =>
                                  updateBullet(slideIndex, bulletIndex, e.target.value)
                                }
                                placeholder={`Point ${bulletIndex + 1}`}
                                className="flex-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fastr-secondary text-sm"
                              />
                              {slide.bullets.length > 1 && (
                                <button
                                  onClick={() => removeBullet(slideIndex, bulletIndex)}
                                  className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => addBullet(slideIndex)}
                            className="flex items-center gap-1 text-sm text-gray-400 hover:text-fastr-secondary transition-colors mt-2"
                          >
                            <Plus className="w-3 h-3" />
                            Add point
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={addSlide}
                      className="w-full py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:text-fastr-secondary hover:border-fastr-secondary transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add another slide
                    </button>
                  </div>
                ) : (
                  // Simple: Section slide form
                  <div className="flex-1 overflow-auto p-4">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={sectionData.title}
                          onChange={(e) =>
                            setSectionData((prev) => ({ ...prev, title: e.target.value }))
                          }
                          placeholder="e.g., Data Quality Assessment"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fastr-secondary text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Subtitle (optional)
                        </label>
                        <input
                          type="text"
                          value={sectionData.subtitle}
                          onChange={(e) =>
                            setSectionData((prev) => ({ ...prev, subtitle: e.target.value }))
                          }
                          placeholder="e.g., Day 2 - Morning Session"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-fastr-secondary"
                        />
                      </div>
                      <div className="pt-2 text-sm text-gray-500">
                        This creates a full-screen section divider with background image.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview */}
              {showPreview && (
                <div className="w-1/2 flex flex-col bg-gray-800">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <span className="text-sm text-gray-400">Preview</span>
                  </div>
                  <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
                    {previewHtml ? (
                      <div className="w-full max-w-2xl">
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            srcDoc={previewHtml}
                            className="absolute inset-0 w-full h-full bg-white rounded-lg shadow-lg"
                            title="Slide Preview"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">Loading preview...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
          {selectedType ? (
            <>
              <div className="text-sm text-gray-400">
                {editorMode === 'simple' ? (
                  selectedType === 'content' ? (
                    <>Fill in the title and bullet points. Click "Add another slide" to create multiple slides.</>
                  ) : (
                    <>Enter your section title. A background image will be added automatically.</>
                  )
                ) : (
                  <>
                    Use <code className="text-fastr-secondary">---</code> to separate slides.
                    {selectedType === 'section' && (
                      <> Background: <code className="text-fastr-secondary">![bg](/resources/backgrounds/section_slide.png)</code></>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                {error && <span className="text-red-400 text-sm">{error}</span>}
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading || !sessionName.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-fastr-secondary text-white rounded-lg hover:bg-fastr-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save & Add to Day'}
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Asset Picker Modal */}
        {showAssetPicker && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-8 z-10">
            <div className="bg-gray-800 rounded-xl w-full max-w-2xl max-h-[80%] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Insert Image
                </h3>
                <button
                  onClick={() => setShowAssetPicker(false)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4">
                {/* Upload area */}
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 text-center hover:border-gray-500 transition-colors">
                  {uploadingAsset ? (
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mx-auto text-gray-500 mb-2" />
                      <p className="text-sm text-gray-400 mb-1">Drag & drop or click to upload</p>
                      <label className="text-xs text-fastr-secondary hover:underline cursor-pointer">
                        Browse files
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

                {/* Assets grid */}
                {assetsLoading ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-500" />
                  </div>
                ) : assets.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No images uploaded yet</p>
                    <p className="text-xs text-gray-600 mt-1">Upload images to insert them into your slides</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {assets.map((asset) => (
                      <button
                        key={asset.filename}
                        onClick={() => insertAsset(asset)}
                        className="group relative aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 border-transparent hover:border-fastr-secondary transition-colors"
                      >
                        <img
                          src={asset.url}
                          alt={asset.filename}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium px-2 py-1 bg-fastr-secondary rounded">
                            Insert
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                          <p className="text-xs text-gray-300 truncate">{asset.filename}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-700 text-right">
                <button
                  onClick={() => setShowAssetPicker(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
