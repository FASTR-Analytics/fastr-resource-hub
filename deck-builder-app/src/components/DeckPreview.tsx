import { useState, useEffect } from 'react'
import { useWorkshopStore, Session } from '../stores/workshop'
import {
  Eye,
  Layers,
  FileText,
  Image,
  LayoutTemplate,
  Coffee,
  UtensilsCrossed,
  RefreshCw
} from 'lucide-react'

// Local type definitions (matches global types from preload.ts)
interface LocalSlideElement {
  type: 'heading' | 'text' | 'bullet' | 'numbered' | 'image' | 'code' | 'directive'
  content: string
  level?: number
  alt?: string
  src?: string
  language?: string
}

interface LocalParsedSlide {
  index: number
  title: string
  elements: LocalSlideElement[]
  rawContent: string
  layout?: string
}

interface LocalParsedTopic {
  id: string
  file: string
  title: string
  path: string
  slides: LocalParsedSlide[]
  frontmatter: Record<string, unknown>
  slideCount: number
  lastModified: number
}

interface LocalParsedModule {
  number: number
  id: string
  name: string
  folder: string
  topics: LocalParsedTopic[]
  totalSlides: number
}

interface SlidePreviewProps {
  slide: LocalParsedSlide
  index: number
}

function SlidePreview({ slide, index }: SlidePreviewProps) {
  // Detect slide type from layout or content
  const isTitleSlide = slide.layout === 'cover' || slide.layout === 'title' ||
    slide.title?.toLowerCase().includes('title') ||
    slide.elements.some(e => e.type === 'heading' && e.level === 1)

  const isSectionSlide = slide.layout === 'section' || slide.layout === 'divider'

  // Get the main title (h2 heading)
  const titleElement = slide.elements.find(e => e.type === 'heading' && (e.level === 2 || e.level === 1))
  const title = titleElement?.content || slide.title || `Slide ${index + 1}`

  // Get subtitle (h3) if present
  const subtitleElement = slide.elements.find(e => e.type === 'heading' && e.level === 3)

  // Get bullet points
  const bullets = slide.elements.filter(e => e.type === 'bullet').slice(0, 4)

  // Check if slide has an image
  const hasImage = slide.elements.some(e => e.type === 'image')

  return (
    <div className="group relative">
      {/* Slide number badge */}
      <div className="absolute -top-2 -left-2 z-10 w-6 h-6 bg-fastr-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
        {index + 1}
      </div>

      {/* Slide thumbnail - 16:9 aspect ratio */}
      <div className="aspect-video bg-white border-2 border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-lg hover:border-fastr-secondary transition-all cursor-pointer">
        {/* FASTR header bar */}
        <div className="h-[12%] bg-gradient-to-r from-fastr-primary to-fastr-secondary flex items-center px-2">
          <div className="flex gap-0.5">
            <div className="w-1 h-1 rounded-full bg-white/60"></div>
            <div className="w-1 h-1 rounded-full bg-white/60"></div>
            <div className="w-1 h-1 rounded-full bg-white/60"></div>
          </div>
        </div>

        {/* Slide content area */}
        <div className="h-[88%] p-2 flex flex-col overflow-hidden">
          {isTitleSlide || isSectionSlide ? (
            // Title/Section slide layout - centered
            <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
              <div className="text-[10px] font-bold text-fastr-primary leading-tight line-clamp-2">
                {title}
              </div>
              {subtitleElement && (
                <div className="text-[8px] text-gray-500 mt-1 line-clamp-1">
                  {subtitleElement.content}
                </div>
              )}
            </div>
          ) : hasImage ? (
            // Two-column layout with image
            <div className="flex-1 flex gap-2">
              <div className="flex-1 flex flex-col">
                <div className="text-[9px] font-bold text-fastr-primary mb-1 line-clamp-2 leading-tight">
                  {title}
                </div>
                <div className="flex-1 space-y-0.5 overflow-hidden">
                  {bullets.slice(0, 3).map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-1 text-[6px] text-gray-600 leading-tight">
                      <span className="text-fastr-secondary mt-0.5">•</span>
                      <span className="line-clamp-1">{bullet.content}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Image placeholder */}
              <div className="w-[40%] bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                <Image className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ) : (
            // Standard content layout
            <div className="flex-1 flex flex-col">
              <div className="text-[9px] font-bold text-fastr-primary mb-1.5 line-clamp-2 leading-tight">
                {title}
              </div>
              <div className="flex-1 space-y-0.5 overflow-hidden">
                {bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-1 text-[6px] text-gray-600 leading-tight">
                    <span className="text-fastr-secondary mt-0.5">•</span>
                    <span className="line-clamp-1">{bullet.content}</span>
                  </div>
                ))}
                {bullets.length === 0 && slide.elements.filter(e => e.type === 'text').slice(0, 3).map((text, idx) => (
                  <div key={idx} className="text-[6px] text-gray-600 line-clamp-1 leading-tight">
                    {text.content}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Layout badge on hover */}
      {slide.layout && (
        <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[8px] bg-black/60 text-white px-1.5 py-0.5 rounded">
            {slide.layout}
          </span>
        </div>
      )}
    </div>
  )
}

interface SessionPreviewProps {
  session: Session
}

function SessionPreview({ session }: SessionPreviewProps) {
  const [slides, setSlides] = useState<LocalParsedSlide[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const isBreak = session.type === 'break'
  const isSection = session.type === 'section'
  const hasContent = session.module || (session.topics && session.topics.length > 0)

  // Auto-load slides on mount for sessions with content
  useEffect(() => {
    if (!isBreak && !isSection && hasContent && !loaded) {
      loadSlides()
    }
  }, [session.module, session.topics])

  const loadSlides = async () => {
    setLoading(true)
    setLoaded(true)
    try {
      let loadedSlides: LocalParsedSlide[] = []

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const api = window.electronAPI as any

      if (session.module) {
        console.log('Loading module:', session.module)
        const module = await api.getParsedModule(session.module) as LocalParsedModule | null
        console.log('Got module:', module?.id, 'with', module?.topics?.length, 'topics')
        if (module) {
          loadedSlides = module.topics.flatMap(t => t.slides)
          console.log('Total slides:', loadedSlides.length)
        }
      } else if (session.topics && session.topics.length > 0) {
        console.log('Loading topics:', session.topics)
        for (const topicId of session.topics) {
          const topic = await api.getParsedTopic(topicId) as LocalParsedTopic | null
          console.log('Got topic:', topicId, 'with', topic?.slides?.length, 'slides')
          if (topic) {
            loadedSlides.push(...topic.slides)
          }
        }
      }

      setSlides(loadedSlides)
    } catch (err) {
      console.error('Error loading slides:', err)
    }
    setLoading(false)
  }

  // Section divider
  if (isSection) {
    return (
      <div className="bg-fastr-primary/10 border-2 border-dashed border-fastr-primary/30 rounded-lg p-3 my-2">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-fastr-primary" />
          <span className="font-semibold text-fastr-primary">{session.session}</span>
        </div>
      </div>
    )
  }

  // Break
  if (isBreak) {
    const isLunch = session.session.toLowerCase().includes('lunch')
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 my-2">
        <div className="flex items-center gap-2">
          {isLunch ? (
            <UtensilsCrossed className="w-5 h-5 text-orange-500" />
          ) : (
            <Coffee className="w-5 h-5 text-amber-600" />
          )}
          <span className="font-medium text-amber-800">{session.session}</span>
          <span className="text-sm text-amber-600 ml-auto">{session.duration} min</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4">
      {/* Session header */}
      <div className="flex items-center gap-2 mb-2">
        <Layers className="w-4 h-4 text-fastr-secondary" />
        <span className="font-medium text-gray-800 text-sm">{session.session}</span>
        <span className="text-xs text-gray-400">
          {session.module && `Module ${session.module}`}
          {session.topics && session.topics.length > 0 && `${session.topics.length} topic(s)`}
        </span>
        <span className="text-xs text-gray-500 ml-auto">{session.duration} min</span>
      </div>

      {/* Slide thumbnails */}
      {loading ? (
        <div className="flex items-center gap-2 py-4 text-gray-400 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          Loading slides...
        </div>
      ) : slides.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {slides.map((slide, idx) => (
            <SlidePreview key={idx} slide={slide} index={idx} />
          ))}
        </div>
      ) : hasContent ? (
        <div className="text-sm text-gray-400 py-2">No slides found</div>
      ) : (
        <div className="text-sm text-gray-400 py-2">No content attached</div>
      )}
    </div>
  )
}

export function DeckPreview() {
  const { currentConfig } = useWorkshopStore()
  const [activeDay, setActiveDay] = useState(1)

  if (!currentConfig) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a workshop to preview
      </div>
    )
  }

  const numDays = currentConfig.schedule.days || 1
  const dayKey = `day${activeDay}`
  const sessions: Session[] = currentConfig.schedule[dayKey] || []

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-5 h-5 text-fastr-primary" />
          <h2 className="font-semibold text-gray-800">Deck Preview</h2>
        </div>

        {/* Day tabs */}
        <div className="flex gap-2">
          {Array.from({ length: numDays }, (_, i) => i + 1).map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeDay === day
                  ? 'bg-fastr-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Day {day}
            </button>
          ))}
        </div>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto p-4">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No sessions on Day {activeDay}</p>
            <p className="text-sm">Add sessions in the deck builder</p>
          </div>
        ) : (
          <div>
            {sessions.map((session, idx) => (
              <SessionPreview
                key={session._id || idx}
                session={session}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{sessions.filter(s => s.type !== 'break' && s.type !== 'section').length} sessions</span>
          <span>
            {sessions.reduce((sum, s) => sum + (s.duration || 0), 0)} min total
          </span>
        </div>
      </div>
    </div>
  )
}
