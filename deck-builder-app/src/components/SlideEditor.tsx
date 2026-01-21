import { useState, useEffect } from 'react'
import { useWorkshopStore, Session } from '../stores/workshop'
import {
  X,
  Save,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus
} from 'lucide-react'

interface SlideEditorProps {
  session: Session
  sessionIndex: number
  dayNum: number
  onClose: () => void
}

interface SlideContent {
  filename: string
  content: string
  isCustom: boolean
  originalContent: string
}

export function SlideEditor({ session, sessionIndex: _sessionIndex, dayNum: _dayNum, onClose }: SlideEditorProps) {
  const { currentWorkshopId, currentConfig } = useWorkshopStore()
  const [slides, setSlides] = useState<SlideContent[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [editedContent, setEditedContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving' | null>(null)
  const [viewMode, setViewMode] = useState<'simple' | 'split' | 'markdown' | 'preview'>('simple')

  // Simple edit mode state
  const [simpleTitle, setSimpleTitle] = useState('')
  const [simpleBullets, setSimpleBullets] = useState<string[]>([''])

  // Load slide content
  useEffect(() => {
    loadSlides()
  }, [session, currentWorkshopId])

  const loadSlides = async () => {
    if (!currentWorkshopId) return
    setIsLoading(true)
    setError(null)

    console.log('Loading slides for session:', session)

    try {
      const loadedSlides: SlideContent[] = []

      // Determine what content to load based on session type
      if (session.module) {
        console.log('Loading module:', session.module)
        const moduleSlides = await window.electronAPI.getModuleSlides(session.module, currentWorkshopId)
        console.log('Module slides loaded:', moduleSlides?.length || 0)
        loadedSlides.push(...moduleSlides)
      } else if (session.topics && session.topics.length > 0) {
        console.log('Loading topics:', session.topics)
        for (const topicId of session.topics) {
          const topicSlide = await window.electronAPI.getTopicSlide(topicId, currentWorkshopId)
          if (topicSlide) loadedSlides.push(topicSlide)
        }
      } else if (session.slides && session.slides.length > 0) {
        console.log('Loading slides:', session.slides)
        for (const slideId of session.slides) {
          const slide = await window.electronAPI.getSlideContent(slideId, currentWorkshopId)
          if (slide) loadedSlides.push(slide)
        }
      } else {
        console.log('No content to load - session has no module, topics, or slides')
      }

      console.log('Total slides loaded:', loadedSlides.length)
      setSlides(loadedSlides)
      if (loadedSlides.length > 0) {
        setEditedContent(loadedSlides[0].content)
        parseToSimpleFields(loadedSlides[0].content)
        setCurrentSlideIndex(0)
      }
    } catch (err: any) {
      console.error('Error loading slides:', err)
      setError(err.message || 'Failed to load slides')
    }
    setIsLoading(false)
  }

  // Parse markdown to simple fields
  const parseToSimpleFields = (content: string) => {
    // Remove frontmatter
    const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, '').trim()

    // Extract title (first ## heading)
    const titleMatch = withoutFrontmatter.match(/^##\s+(.+)$/m)
    setSimpleTitle(titleMatch ? titleMatch[1] : '')

    // Extract bullet points
    const bulletMatches = withoutFrontmatter.match(/^[-*]\s+(.+)$/gm)
    if (bulletMatches) {
      setSimpleBullets(bulletMatches.map(b => b.replace(/^[-*]\s+/, '')))
    } else {
      setSimpleBullets([''])
    }
  }

  // Convert simple fields back to markdown
  const simpleFieldsToMarkdown = (): string => {
    // Get frontmatter from original content
    const frontmatterMatch = editedContent.match(/^---[\s\S]*?---\n?/)
    const frontmatter = frontmatterMatch ? frontmatterMatch[0] : `---
marp: true
theme: fastr
paginate: true
---

`

    const bullets = simpleBullets
      .filter(b => b.trim())
      .map(b => `- ${b}`)
      .join('\n')

    return `${frontmatter}
## ${simpleTitle}

${bullets}

---
`
  }

  // Sync simple fields to markdown when switching modes
  const handleViewModeChange = (newMode: 'simple' | 'split' | 'markdown' | 'preview') => {
    if (viewMode === 'simple' && newMode !== 'simple') {
      // Convert simple fields to markdown
      setEditedContent(simpleFieldsToMarkdown())
    } else if (viewMode !== 'simple' && newMode === 'simple') {
      // Parse markdown to simple fields
      parseToSimpleFields(editedContent)
    }
    setViewMode(newMode)
  }

  // Track unsaved changes
  useEffect(() => {
    if (slides.length === 0) return
    const currentSlide = slides[currentSlideIndex]
    if (currentSlide && editedContent !== currentSlide.content) {
      setSaveStatus('unsaved')
    } else {
      setSaveStatus('saved')
    }
  }, [editedContent, slides, currentSlideIndex])

  // Change slide
  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      // Save current changes to state before switching
      if (saveStatus === 'unsaved') {
        const updatedSlides = [...slides]
        updatedSlides[currentSlideIndex] = {
          ...updatedSlides[currentSlideIndex],
          content: editedContent
        }
        setSlides(updatedSlides)
      }
      setCurrentSlideIndex(index)
      setEditedContent(slides[index].content)
    }
  }

  // Save slide
  const handleSave = async () => {
    if (!currentWorkshopId || slides.length === 0) return
    setIsSaving(true)
    setSaveStatus('saving')

    try {
      const currentSlide = slides[currentSlideIndex]
      await window.electronAPI.saveCustomSlide(
        currentWorkshopId,
        currentSlide.filename,
        editedContent
      )

      // Update local state
      const updatedSlides = [...slides]
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        content: editedContent,
        isCustom: true
      }
      setSlides(updatedSlides)
      setSaveStatus('saved')
    } catch (err: any) {
      setError(err.message || 'Failed to save')
      setSaveStatus('unsaved')
    }
    setIsSaving(false)
  }

  // Revert to original
  const handleRevert = () => {
    if (slides.length === 0) return
    const currentSlide = slides[currentSlideIndex]
    setEditedContent(currentSlide.originalContent)
  }

  // Substitute {{VARIABLE}} placeholders with actual values from config
  const substituteVariables = (content: string): string => {
    if (!currentConfig) return content

    const workshop = currentConfig.workshop || {}
    const countryData = currentConfig.country_data || {}

    const replacements: Record<string, string> = {
      'WORKSHOP_NAME': workshop.name || '',
      'DATE': workshop.date || '',
      'LOCATION': workshop.location || '',
      'FACILITATORS': workshop.facilitators || '',
      'COUNTRY': workshop.country || '',
      ...countryData
    }

    let result = content
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
    }
    return result
  }

  // Render markdown preview (basic)
  const renderPreview = () => {
    // Parse Marp slides - split by ---
    let slideContent = editedContent
      .replace(/^---[\s\S]*?---\n?/, '') // Remove frontmatter
      .trim()

    // Substitute variables for preview
    slideContent = substituteVariables(slideContent)

    return (
      <div className="slide-preview bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{
            __html: simpleMarkdownToHtml(slideContent)
          }}
        />
      </div>
    )
  }

  // Simple markdown to HTML (for preview)
  const simpleMarkdownToHtml = (md: string): string => {
    let html = md
      // Handle two-column layout (Marp uses <div class="columns">)
      .replace(/<div class="columns">/g, '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">')
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2 text-fastr-primary">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists - wrap in ul
      .replace(/^((?:\- .*\n?)+)/gm, (match) => {
        const items = match.trim().split('\n').map(line =>
          `<li class="ml-4">${line.replace(/^\- /, '')}</li>`
        ).join('')
        return `<ul class="list-disc pl-4 my-2">${items}</ul>`
      })
      // Numbered lists
      .replace(/^((?:\d+\. .*\n?)+)/gm, (match) => {
        const items = match.trim().split('\n').map(line =>
          `<li class="ml-4">${line.replace(/^\d+\. /, '')}</li>`
        ).join('')
        return `<ol class="list-decimal pl-4 my-2">${items}</ol>`
      })
      // Images (show placeholder)
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="bg-gray-100 border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500 my-2"><span class="text-sm">Image: $1</span></div>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-fastr-secondary underline">$1</a>')
      // Paragraphs - only for lines that aren't already wrapped
      .replace(/^(?!<[a-z])(.*[^\n])$/gm, '<p class="my-2">$1</p>')

    return html
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-fastr-primary mx-auto mb-2" />
          <p className="text-gray-500">Loading slides...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={loadSlides}
            className="text-sm text-fastr-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">No slides to edit</p>
          <p className="text-sm text-gray-400">
            This session doesn't have any content attached
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const currentSlide = slides[currentSlideIndex]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h3 className="font-medium text-gray-800">{session.session}</h3>
            <p className="text-xs text-gray-500">
              {currentSlide.filename}
              {currentSlide.isCustom && (
                <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                  Customized
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save status */}
          {saveStatus === 'unsaved' && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              Unsaved changes
            </span>
          )}
          {saveStatus === 'saved' && currentSlide.isCustom && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Saved
            </span>
          )}

          {/* View mode toggle */}
          <div className="flex items-center bg-gray-100 rounded-md p-0.5">
            <button
              onClick={() => handleViewModeChange('simple')}
              className={`px-2 py-1.5 rounded text-xs font-medium ${viewMode === 'simple' ? 'bg-white shadow-sm text-fastr-primary' : 'hover:bg-gray-200 text-gray-600'}`}
              title="Simple editor (no markdown)"
            >
              Simple
            </button>
            <button
              onClick={() => handleViewModeChange('markdown')}
              className={`px-2 py-1.5 rounded text-xs font-medium ${viewMode === 'markdown' ? 'bg-white shadow-sm text-fastr-primary' : 'hover:bg-gray-200 text-gray-600'}`}
              title="Markdown editor"
            >
              Markdown
            </button>
            <button
              onClick={() => handleViewModeChange('split')}
              className={`px-2 py-1.5 rounded text-xs font-medium ${viewMode === 'split' ? 'bg-white shadow-sm text-fastr-primary' : 'hover:bg-gray-200 text-gray-600'}`}
              title="Split view"
            >
              Split
            </button>
            <button
              onClick={() => handleViewModeChange('preview')}
              className={`p-1.5 rounded ${viewMode === 'preview' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Preview only"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Revert button */}
          {currentSlide.isCustom && (
            <button
              onClick={handleRevert}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              title="Revert to original"
            >
              <RotateCcw className="w-4 h-4" />
              Revert
            </button>
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={isSaving || saveStatus === 'saved'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-fastr-primary text-white rounded-md hover:bg-fastr-primary/90 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
        </div>
      </div>

      {/* Slide navigation */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 py-2 bg-gray-100 border-b border-gray-200">
          <button
            onClick={() => goToSlide(currentSlideIndex - 1)}
            disabled={currentSlideIndex === 0}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1">
            {slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-8 h-8 text-xs rounded ${
                  i === currentSlideIndex
                    ? 'bg-fastr-primary text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
                } ${slide.isCustom ? 'ring-2 ring-amber-300' : ''}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => goToSlide(currentSlideIndex + 1)}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Editor and Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Simple Editor */}
        {viewMode === 'simple' && (
          <div className="w-full flex flex-col overflow-auto bg-white">
            <div className="flex-1 p-6 max-w-3xl mx-auto w-full">
              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slide Title
                </label>
                <input
                  type="text"
                  value={simpleTitle}
                  onChange={(e) => setSimpleTitle(e.target.value)}
                  className="w-full px-4 py-3 text-xl font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-primary"
                  placeholder="Enter slide title..."
                />
              </div>

              {/* Bullet Points */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Points
                </label>
                <div className="space-y-2">
                  {simpleBullets.map((bullet, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-gray-400">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const newBullets = [...simpleBullets]
                          newBullets[index] = e.target.value
                          setSimpleBullets(newBullets)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const newBullets = [...simpleBullets]
                            newBullets.splice(index + 1, 0, '')
                            setSimpleBullets(newBullets)
                            // Focus next input after render
                            setTimeout(() => {
                              const inputs = document.querySelectorAll('.bullet-input')
                              const nextInput = inputs[index + 1] as HTMLInputElement
                              nextInput?.focus()
                            }, 0)
                          } else if (e.key === 'Backspace' && !bullet && simpleBullets.length > 1) {
                            e.preventDefault()
                            const newBullets = simpleBullets.filter((_, i) => i !== index)
                            setSimpleBullets(newBullets)
                          }
                        }}
                        className="bullet-input flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-primary"
                        placeholder="Add a point..."
                      />
                      {simpleBullets.length > 1 && (
                        <button
                          onClick={() => setSimpleBullets(simpleBullets.filter((_, i) => i !== index))}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setSimpleBullets([...simpleBullets, ''])}
                    className="flex items-center gap-2 text-sm text-fastr-primary hover:text-fastr-primary/80"
                  >
                    <Plus className="w-4 h-4" />
                    Add point
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-bold text-fastr-primary mb-4">
                    {substituteVariables(simpleTitle) || 'Slide Title'}
                  </h2>
                  <ul className="space-y-2">
                    {simpleBullets.filter(b => b.trim()).map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-fastr-secondary mt-1">•</span>
                        <span>{substituteVariables(bullet)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Markdown Editor */}
        {(viewMode === 'markdown' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col border-r border-gray-200`}>
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-500 uppercase">Markdown</span>
            </div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-white"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col overflow-auto bg-gray-100`}>
            <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-500 uppercase">Preview</span>
            </div>
            <div className="flex-1 p-6 flex items-start justify-center overflow-auto">
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
