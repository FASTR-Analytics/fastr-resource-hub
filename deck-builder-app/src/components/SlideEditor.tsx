import { useState, useEffect } from 'react'
import { useWorkshopStore, Session } from '../stores/workshop'
import { X, Save, RotateCcw, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

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

export function SlideEditor({ session, onClose }: SlideEditorProps) {
  const { currentWorkshopId, currentConfig } = useWorkshopStore()
  const [slides, setSlides] = useState<SlideContent[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [editedContent, setEditedContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Load slides
  useEffect(() => {
    loadSlides()
  }, [session, currentWorkshopId])

  const loadSlides = async () => {
    if (!currentWorkshopId) return
    setIsLoading(true)

    try {
      const loadedSlides: SlideContent[] = []

      if (session.module) {
        const moduleSlides = await window.electronAPI.getModuleSlides(session.module, currentWorkshopId)
        loadedSlides.push(...moduleSlides)
      } else if (session.topics && session.topics.length > 0) {
        for (const topicId of session.topics) {
          const topicSlide = await window.electronAPI.getTopicSlide(topicId, currentWorkshopId)
          if (topicSlide) loadedSlides.push(topicSlide)
        }
      } else if (session.slides && session.slides.length > 0) {
        for (const slideId of session.slides) {
          const slide = await window.electronAPI.getSlideContent(slideId, currentWorkshopId)
          if (slide) loadedSlides.push(slide)
        }
      }

      setSlides(loadedSlides)
      if (loadedSlides.length > 0) {
        setEditedContent(loadedSlides[0].content)
        setCurrentSlideIndex(0)
      }
    } catch (err) {
      console.error('Error loading slides:', err)
    }
    setIsLoading(false)
  }

  // Track changes
  useEffect(() => {
    if (slides.length > 0) {
      const currentSlide = slides[currentSlideIndex]
      setHasChanges(editedContent !== currentSlide?.content)
    }
  }, [editedContent, slides, currentSlideIndex])

  // Save
  const handleSave = async () => {
    if (!currentWorkshopId || slides.length === 0) return
    setIsSaving(true)

    try {
      const currentSlide = slides[currentSlideIndex]
      await window.electronAPI.saveCustomSlide(
        currentWorkshopId,
        currentSlide.filename,
        editedContent
      )

      const updatedSlides = [...slides]
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        content: editedContent,
        isCustom: true
      }
      setSlides(updatedSlides)
      setHasChanges(false)
    } catch (err) {
      console.error('Error saving:', err)
    }
    setIsSaving(false)
  }

  // Revert
  const handleRevert = () => {
    if (slides.length === 0) return
    setEditedContent(slides[currentSlideIndex].originalContent)
  }

  // Navigate slides
  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlideIndex(index)
      setEditedContent(slides[index].content)
    }
  }

  // Substitute variables
  const substituteVariables = (text: string): string => {
    if (!currentConfig) return text
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
    let result = text
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
    }
    return result
  }

  // Simple markdown to HTML preview
  const renderPreview = (content: string) => {
    let md = content.replace(/^---[\s\S]*?---\n?/, '').trim()
    md = substituteVariables(md)

    const slideContents = md.split(/^---$/m).filter(s => s.trim())

    return slideContents.map((slideContent, idx) => {
      let html = slideContent
        .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-700 mb-2">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-gray-800 mb-3">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4" style="color: #1e3a5f">$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^[-*] (.+)$/gm, '<li class="ml-4">$1</li>')
        .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '<div class="bg-gray-200 text-gray-500 text-sm p-4 rounded my-2 text-center">📷 $1</div>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
        .replace(/\n\n/g, '</p><p class="mb-2">')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<div[^>]*class="columns"[^>]*>/gi, '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">')

      html = html.replace(/(<li[^>]*>.*?<\/li>\n?)+/g, '<ul class="list-disc mb-3 space-y-1">$&</ul>')

      return (
        <div key={idx} className="bg-white rounded-lg shadow-lg p-6 mb-4 aspect-video flex flex-col">
          <div className="text-xs text-gray-400 mb-2">Slide {idx + 1}</div>
          <div
            className="flex-1 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: `<div>${html}</div>` }}
          />
        </div>
      )
    })
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-fastr-primary" />
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="h-full flex flex-col bg-gray-50">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-lg font-semibold">{session.session}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No editable content for this session
        </div>
      </div>
    )
  }

  const currentSlide = slides[currentSlideIndex]

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-semibold text-gray-800">{session.session}</h2>
            <span className="text-sm text-gray-500">
              {currentSlide.filename}
              {currentSlide.isCustom && <span className="ml-2 text-green-600">(customized)</span>}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-sm text-amber-600 mr-2">Unsaved changes</span>
          )}
          <button
            onClick={handleRevert}
            className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Revert
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-2 px-4 py-1.5 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 disabled:opacity-50 text-sm"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* File navigation for multi-file sessions */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 py-2 bg-gray-200 border-b">
          <button
            onClick={() => goToSlide(currentSlideIndex - 1)}
            disabled={currentSlideIndex === 0}
            className="p-1 hover:bg-gray-300 rounded disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  idx === currentSlideIndex
                    ? 'bg-fastr-primary text-white'
                    : s.isCustom
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-white hover:bg-gray-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => goToSlide(currentSlideIndex + 1)}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-1 hover:bg-gray-300 rounded disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Split view: Editor + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Markdown Editor */}
        <div className="w-1/2 flex flex-col border-r border-gray-300">
          <div className="px-3 py-1.5 bg-gray-200 border-b border-gray-300">
            <span className="text-sm font-medium text-gray-600">Markdown</span>
          </div>
          <textarea
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
            className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-white"
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div className="w-1/2 flex flex-col bg-gray-600">
          <div className="px-3 py-1.5 bg-gray-500 border-b border-gray-400">
            <span className="text-sm font-medium text-gray-100">Preview</span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {renderPreview(editedContent)}
          </div>
        </div>
      </div>
    </div>
  )
}
