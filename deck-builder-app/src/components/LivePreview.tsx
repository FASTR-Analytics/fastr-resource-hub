/**
 * LivePreview Component
 *
 * Real-time slide preview using Marp Core for in-browser rendering.
 * No CLI needed - renders directly in React.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import Marp from '@marp-team/marp-core'
import { useWorkshopStore } from '../stores/workshop'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  LayoutList,
  RefreshCw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface SlideData {
  index: number
  html: string
  title: string
}

type ViewMode = 'single' | 'grid'

// ═══════════════════════════════════════════════════════════════════════════════
// MARP INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

// Create Marp instance with FASTR theme embedded
const createMarp = () => {
  const marp = new Marp({
    html: true,
    emoji: {
      shortcode: true,
      unicode: true,
    },
  })

  // Add FASTR theme CSS (simplified version for preview)
  marp.themeSet.default = marp.themeSet.add(`
/* @theme fastr-preview */
@import 'default';

section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: linear-gradient(90deg, #00796B, #4CAF50, #8BC34A);
}

h1 {
  color: #00796B;
  font-weight: 700;
}

h2 {
  color: #00695C;
  border-bottom: 3px solid #4CAF50;
  padding-bottom: 0.3em;
}

h3 {
  color: #00796B;
}

strong {
  color: #00695C;
}

section.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #00796B 0%, #004D40 100%);
  color: white;
}

section.title h1,
section.title h2 {
  color: white;
  border: none;
}

section.break {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
}

section.break h1 {
  color: #E65100;
  font-size: 3em;
}

section.section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
}

section.section h1 {
  color: #2E7D32;
  font-size: 2.5em;
}

section.closing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #00796B 0%, #004D40 100%);
  color: white;
}

section.closing h1,
section.closing h2 {
  color: white;
  border: none;
}
  `)

  return marp
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Extract slide title from HTML
 */
function extractTitleFromHtml(html: string): string {
  // Look for h2 first (Marp standard)
  const h2Match = html.match(/<h2[^>]*>([^<]+)<\/h2>/)
  if (h2Match) return h2Match[1]

  // Look for h1
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/)
  if (h1Match) return h1Match[1]

  return 'Untitled Slide'
}

/**
 * Split Marp HTML output into individual slides
 */
function splitSlidesFromHtml(html: string): string[] {
  // Marp wraps each slide in a <section> tag
  const sectionRegex = /<section[^>]*>[\s\S]*?<\/section>/g
  const matches = html.match(sectionRegex)
  return matches || []
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function LivePreview() {
  const { currentConfig, currentWorkshopId } = useWorkshopStore()

  const [slides, setSlides] = useState<SlideData[]>([])
  const [css, setCss] = useState<string>('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [viewMode, setViewMode] = useState<ViewMode>('single')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)

  const containerRef = useRef<HTMLDivElement>(null)
  const marpRef = useRef<Marp | null>(null)

  // Initialize Marp
  useEffect(() => {
    marpRef.current = createMarp()
  }, [])

  // Fetch and render markdown
  const renderSlides = useCallback(async () => {
    if (!currentWorkshopId || !currentConfig || !marpRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      // Get assembled markdown from main process
      const markdown = await window.electronAPI.assembleMarkdown(currentWorkshopId)

      if (!markdown) {
        setSlides([])
        setIsLoading(false)
        return
      }

      // Render with Marp
      const { html, css: marpCss } = marpRef.current.render(markdown)

      // Split into individual slides
      const slideHtmls = splitSlidesFromHtml(html)

      const slideData: SlideData[] = slideHtmls.map((slideHtml, index) => ({
        index,
        html: slideHtml,
        title: extractTitleFromHtml(slideHtml),
      }))

      setSlides(slideData)
      setCss(marpCss)

      // Reset to first slide if current is out of bounds
      if (currentSlide >= slideData.length) {
        setCurrentSlide(0)
      }
    } catch (err: any) {
      console.error('Error rendering slides:', err)
      setError(err.message || 'Failed to render slides')
    }

    setIsLoading(false)
  }, [currentWorkshopId, currentConfig])

  // Render on config change
  useEffect(() => {
    renderSlides()
  }, [currentConfig, renderSlides])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'single') return

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setCurrentSlide(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Home') {
        e.preventDefault()
        setCurrentSlide(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        setCurrentSlide(slides.length - 1)
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        setIsFullscreen(prev => !prev)
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault()
        setViewMode(prev => prev === 'single' ? 'grid' : 'single')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [slides.length, viewMode])

  // Navigation handlers
  const goToPrev = () => setCurrentSlide(prev => Math.max(prev - 1, 0))
  const goToNext = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setViewMode('single')
  }

  // Zoom handlers
  const zoomIn = () => setZoom(prev => Math.min(prev + 10, 150))
  const zoomOut = () => setZoom(prev => Math.max(prev - 10, 50))

  if (!currentConfig) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Select a workshop to preview</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-fastr-primary mx-auto mb-3" />
          <p className="text-gray-600">Rendering slides...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="font-medium mb-2">Error rendering slides</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={renderSlides}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="font-medium mb-2">No slides to preview</p>
          <p className="text-sm">Add content to your workshop schedule</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}
    >
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        isFullscreen ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <button
            onClick={() => setViewMode('single')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'single'
                ? 'bg-fastr-primary text-white'
                : isFullscreen ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
            }`}
            title="Single slide view (S)"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-fastr-primary text-white'
                : isFullscreen ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
            }`}
            title="Grid view (G)"
          >
            <Grid className="w-4 h-4" />
          </button>

          <div className={`h-4 w-px mx-2 ${isFullscreen ? 'bg-gray-600' : 'bg-gray-300'}`} />

          {/* Zoom controls */}
          <button
            onClick={zoomOut}
            className={`p-2 rounded-lg transition-colors ${
              isFullscreen ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
            }`}
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className={`text-sm font-mono w-12 text-center ${
            isFullscreen ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {zoom}%
          </span>
          <button
            onClick={zoomIn}
            className={`p-2 rounded-lg transition-colors ${
              isFullscreen ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
            }`}
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className={`text-sm font-medium ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}`}>
          {viewMode === 'single' ? (
            `Slide ${currentSlide + 1} of ${slides.length}`
          ) : (
            `${slides.length} slides`
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh */}
          <button
            onClick={renderSlides}
            className={`p-2 rounded-lg transition-colors ${
              isFullscreen ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
            }`}
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-lg transition-colors ${
              isFullscreen ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
            }`}
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Marp CSS */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Content */}
      <div className={`flex-1 overflow-hidden ${isFullscreen ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {viewMode === 'single' ? (
          // Single slide view
          <div className="h-full flex items-center justify-center p-4">
            <div
              className="relative bg-white shadow-xl rounded-lg overflow-hidden"
              style={{
                width: `${960 * (zoom / 100)}px`,
                height: `${540 * (zoom / 100)}px`,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top left',
                  width: '960px',
                  height: '540px',
                }}
                dangerouslySetInnerHTML={{ __html: slides[currentSlide]?.html || '' }}
              />
            </div>

            {/* Navigation buttons */}
            <button
              onClick={goToPrev}
              disabled={currentSlide === 0}
              className={`absolute left-4 p-3 rounded-full shadow-lg transition-all ${
                currentSlide === 0
                  ? 'opacity-30 cursor-not-allowed bg-gray-300'
                  : 'bg-white hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentSlide === slides.length - 1}
              className={`absolute right-4 p-3 rounded-full shadow-lg transition-all ${
                currentSlide === slides.length - 1
                  ? 'opacity-30 cursor-not-allowed bg-gray-300'
                  : 'bg-white hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          // Grid view
          <div className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`relative bg-white rounded-lg shadow overflow-hidden transition-all hover:ring-2 hover:ring-fastr-primary ${
                    index === currentSlide ? 'ring-2 ring-fastr-primary' : ''
                  }`}
                  style={{ aspectRatio: '16/9' }}
                >
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      transform: 'scale(0.2)',
                      transformOrigin: 'top left',
                      width: '500%',
                      height: '500%',
                      pointerEvents: 'none',
                    }}
                    dangerouslySetInnerHTML={{ __html: slide.html }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-xs text-white font-medium">
                      {index + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Slide strip (single view only) */}
      {viewMode === 'single' && (
        <div className={`flex items-center gap-2 px-4 py-3 overflow-x-auto ${
          isFullscreen ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-200'
        }`}>
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`relative flex-shrink-0 rounded overflow-hidden transition-all ${
                index === currentSlide
                  ? 'ring-2 ring-fastr-primary ring-offset-2'
                  : 'hover:ring-1 hover:ring-gray-300'
              }`}
              style={{ width: '80px', height: '45px' }}
            >
              <div
                className="absolute inset-0 overflow-hidden bg-white"
                style={{
                  transform: 'scale(0.0833)',
                  transformOrigin: 'top left',
                  width: '1200%',
                  height: '1200%',
                  pointerEvents: 'none',
                }}
                dangerouslySetInnerHTML={{ __html: slide.html }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-center">
                <span className="text-[10px] text-white">{index + 1}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LivePreview
