import { useState, useEffect } from 'react'
import { useWorkshopStore, Session } from '../stores/workshop'
import { X, Save, RotateCcw, ChevronLeft, ChevronRight, Plus, Trash2, Loader2 } from 'lucide-react'

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

interface ParsedSlide {
  title: string
  bullets: string[]
  extraContent: string // Any content that doesn't fit the simple model
}

export function SlideEditor({ session, onClose }: SlideEditorProps) {
  const { currentWorkshopId, currentConfig } = useWorkshopStore()
  const [slides, setSlides] = useState<SlideContent[]>([])
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Simple editable fields
  const [title, setTitle] = useState('')
  const [bullets, setBullets] = useState<string[]>([''])
  const [extraContent, setExtraContent] = useState('')

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
        parseSlide(loadedSlides[0].content)
        setCurrentSlideIndex(0)
      }
    } catch (err) {
      console.error('Error loading slides:', err)
    }
    setIsLoading(false)
  }

  // Parse markdown into simple fields
  const parseSlide = (content: string) => {
    // Remove frontmatter
    const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, '').trim()

    // Extract title (## heading)
    const titleMatch = withoutFrontmatter.match(/^##\s+(.+)$/m)
    setTitle(titleMatch ? titleMatch[1] : '')

    // Extract bullet points
    const bulletMatches = withoutFrontmatter.match(/^[-*]\s+(.+)$/gm)
    if (bulletMatches && bulletMatches.length > 0) {
      setBullets(bulletMatches.map(b => b.replace(/^[-*]\s+/, '')))
    } else {
      setBullets([''])
    }

    // Everything else goes to extraContent
    let extra = withoutFrontmatter
      .replace(/^##\s+.+$/m, '') // Remove title
      .replace(/^[-*]\s+.+$/gm, '') // Remove bullets
      .replace(/^---$/gm, '') // Remove slide separators
      .trim()
    setExtraContent(extra)

    setHasChanges(false)
  }

  // Convert back to markdown
  const toMarkdown = (): string => {
    const frontmatter = `---
marp: true
theme: fastr
paginate: true
---

`
    const bulletsMd = bullets
      .filter(b => b.trim())
      .map(b => `- ${b}`)
      .join('\n')

    let content = `${frontmatter}## ${title}\n\n`
    if (bulletsMd) content += bulletsMd + '\n\n'
    if (extraContent.trim()) content += extraContent + '\n\n'
    content += '---\n'

    return content
  }

  // Save
  const handleSave = async () => {
    if (!currentWorkshopId || slides.length === 0) return
    setIsSaving(true)

    try {
      const currentSlide = slides[currentSlideIndex]
      const newContent = toMarkdown()

      await window.electronAPI.saveCustomSlide(
        currentWorkshopId,
        currentSlide.filename,
        newContent
      )

      // Update local state
      const updatedSlides = [...slides]
      updatedSlides[currentSlideIndex] = {
        ...currentSlide,
        content: newContent,
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
    parseSlide(slides[currentSlideIndex].originalContent)
  }

  // Navigate slides
  const goToSlide = (index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlideIndex(index)
      parseSlide(slides[index].content)
    }
  }

  // Bullet management
  const updateBullet = (index: number, value: string) => {
    const newBullets = [...bullets]
    newBullets[index] = value
    setBullets(newBullets)
    setHasChanges(true)
  }

  const addBullet = () => {
    setBullets([...bullets, ''])
    setHasChanges(true)
  }

  const removeBullet = (index: number) => {
    if (bullets.length > 1) {
      setBullets(bullets.filter((_, i) => i !== index))
      setHasChanges(true)
    }
  }

  // Substitute variables for preview
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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-semibold text-gray-800">{session.session}</h2>
            <span className="text-sm text-gray-500">
              Slide {currentSlideIndex + 1} of {slides.length}
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
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
            Revert
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="flex items-center gap-2 px-4 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Slide navigation */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 p-2 bg-gray-100 border-b">
          <button
            onClick={() => goToSlide(currentSlideIndex - 1)}
            disabled={currentSlideIndex === 0}
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  idx === currentSlideIndex
                    ? 'bg-fastr-primary text-white'
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
            className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slide Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setHasChanges(true) }}
              className="w-full px-4 py-3 text-xl font-semibold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-fastr-primary"
              placeholder="Enter slide title..."
            />
          </div>

          {/* Bullet points */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Points
            </label>
            <div className="space-y-2">
              {bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-gray-400 w-6 text-center">•</span>
                  <input
                    type="text"
                    value={bullet}
                    onChange={e => updateBullet(idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-fastr-secondary"
                    placeholder="Enter point..."
                  />
                  <button
                    onClick={() => removeBullet(idx)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                    disabled={bullets.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={addBullet}
                className="flex items-center gap-2 px-3 py-2 text-fastr-primary hover:bg-fastr-primary/10 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add point
              </button>
            </div>
          </div>

          {/* Extra content (collapsed by default) */}
          {extraContent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Content (advanced)
              </label>
              <textarea
                value={extraContent}
                onChange={e => { setExtraContent(e.target.value); setHasChanges(true) }}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-fastr-secondary font-mono text-sm"
                rows={4}
              />
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="border-t bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Preview</h3>
          <div className="bg-gray-900 text-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{substituteVariables(title) || 'Untitled'}</h2>
            <ul className="space-y-2">
              {bullets.filter(b => b.trim()).map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-fastr-secondary">•</span>
                  <span>{substituteVariables(bullet)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
