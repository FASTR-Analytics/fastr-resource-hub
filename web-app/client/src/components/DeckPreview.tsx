import { useState, useEffect, useRef } from 'react'
import { useWorkshopStore } from '../stores/workshop'
import { RefreshCw, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'

export function DeckPreview() {
  const { currentWorkshopId } = useWorkshopStore()
  const [html, setHtml] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [totalSlides, setTotalSlides] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Build preview when workshop changes
  useEffect(() => {
    if (currentWorkshopId) {
      buildPreview()
    }
  }, [currentWorkshopId])

  const buildPreview = async () => {
    if (!currentWorkshopId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/export/${currentWorkshopId}/html`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to build preview')
      }

      const data = await response.json()
      setHtml(data.html)

      // Count slides (sections in Marp HTML)
      const slideCount = (data.html.match(/<section/g) || []).length
      setTotalSlides(slideCount)
      setCurrentSlide(0)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    if (index < 0 || index >= totalSlides) return
    setCurrentSlide(index)

    // Scroll iframe to slide
    if (iframeRef.current?.contentWindow) {
      const sections = iframeRef.current.contentWindow.document.querySelectorAll('section')
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
          <p>Building preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={buildPreview}
            className="px-4 py-2 bg-fastr-primary rounded-md hover:bg-fastr-primary/80"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!html) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <p className="mb-4">No preview available</p>
          <button
            onClick={buildPreview}
            className="px-4 py-2 bg-fastr-primary rounded-md hover:bg-fastr-primary/80"
          >
            Build Preview
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-full flex flex-col bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-300 min-w-[80px] text-center">
            {currentSlide + 1} / {totalSlides}
          </span>
          <button
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide >= totalSlides - 1}
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={buildPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded"
          >
            <RefreshCw className="w-4 h-4" />
            Rebuild
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-700"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Slide preview */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full flex items-center justify-center">
          <iframe
            ref={iframeRef}
            srcDoc={html}
            className="w-full h-full max-w-4xl bg-white rounded-lg shadow-2xl"
            style={{ aspectRatio: '16/9', maxHeight: '80vh' }}
            title="Slide Preview"
          />
        </div>
      </div>

      {/* Slide thumbnails */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 overflow-x-auto">
        <div className="flex gap-2">
          {Array.from({ length: Math.min(totalSlides, 20) }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`flex-shrink-0 w-16 h-10 rounded border-2 text-xs font-medium flex items-center justify-center transition-colors ${
                i === currentSlide
                  ? 'border-fastr-secondary bg-fastr-secondary/20 text-white'
                  : 'border-gray-600 bg-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
          {totalSlides > 20 && (
            <span className="flex-shrink-0 text-gray-500 text-sm self-center px-2">
              +{totalSlides - 20} more
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
