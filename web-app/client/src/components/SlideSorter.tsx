import { useState, useEffect, useMemo } from 'react'
import { useWorkshopStore } from '../stores/workshop'
import {
  RefreshCw,
  ZoomIn,
  ZoomOut,
  X,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react'
import { CustomSlideEditor } from './CustomSlideEditor'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SlideData {
  id: string
  sessionId: string
  dayNumber: number
  sessionIndex: number
  slideIndex: number
  sessionName: string
  sessionType: string
  moduleId: string | null
  html: string
}

interface SessionGroup {
  sessionId: string
  dayNumber: number
  sessionIndex: number
  sessionName: string
  sessionType: string
  moduleId: string | null
  slides: SlideData[]
}

interface SortableSessionProps {
  session: SessionGroup
  zoom: number
  onSlideClick: (slide: SlideData) => void
  onEditClick: (session: SessionGroup) => void
  onDeleteClick: (session: SessionGroup) => void
}

function SortableSession({ session, zoom, onSlideClick, onEditClick, onDeleteClick }: SortableSessionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: session.sessionId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const slideWidth = 200 * zoom
  const slideHeight = 112.5 * zoom

  // Session type colors
  const typeColors: Record<string, string> = {
    module: 'bg-blue-500',
    break: 'bg-amber-500',
    day_recap: 'bg-green-500',
    day_end: 'bg-purple-500',
    section: 'bg-gray-500',
    custom: 'bg-teal-500',
  }

  const bgColor = typeColors[session.sessionType] || 'bg-gray-500'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'z-50 opacity-80' : ''}`}
    >
      {/* Session header with drag handle */}
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-t-lg ${bgColor} text-white`}
      >
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 opacity-70" />
        </div>
        <span className="font-medium text-sm truncate flex-1">
          {session.sessionName}
        </span>
        <span className="text-xs opacity-70 mr-2">
          {session.slides.length} slide{session.slides.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEditClick(session)
          }}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          title="Edit session"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDeleteClick(session)
          }}
          className="p-1 hover:bg-red-500/50 rounded transition-colors"
          title="Delete session"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Slides in this session */}
      <div
        className={`flex flex-wrap gap-2 p-3 bg-gray-800/50 rounded-b-lg border-2 ${
          isDragging ? 'border-fastr-primary shadow-2xl' : 'border-gray-700'
        }`}
      >
        {session.slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="relative group cursor-pointer"
            onClick={() => onSlideClick(slide)}
          >
            <div
              className="rounded overflow-hidden shadow-lg hover:ring-2 hover:ring-fastr-secondary transition-all"
              style={{ width: slideWidth, height: slideHeight }}
            >
              {/* Slide number badge */}
              <div className="absolute top-1 left-1 z-10 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                {idx + 1}
              </div>

              {/* Slide preview iframe */}
              <iframe
                srcDoc={slide.html}
                className="pointer-events-none bg-white"
                style={{
                  width: 960,
                  height: 540,
                  transform: `scale(${slideWidth / 960})`,
                  transformOrigin: 'top left',
                }}
                title={`Slide ${idx + 1}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Session edit modal
interface EditSessionModalProps {
  session: SessionGroup | null
  onClose: () => void
  onSave: (updates: { session?: string; speaker?: string; duration?: number }) => void
}

function EditSessionModal({ session, onClose, onSave }: EditSessionModalProps) {
  const { currentConfig } = useWorkshopStore()
  const [sessionName, setSessionName] = useState('')
  const [speaker, setSpeaker] = useState('')
  const [duration, setDuration] = useState(0)

  // Get the actual session data from config
  useEffect(() => {
    if (session && currentConfig) {
      const dayKey = `day${session.dayNumber}`
      const sessions = currentConfig.schedule[dayKey] || []
      const sessionData = sessions[session.sessionIndex]
      if (sessionData) {
        setSessionName(sessionData.session || '')
        setSpeaker(sessionData.speaker || '')
        setDuration(sessionData.duration || 0)
      }
    }
  }, [session, currentConfig])

  if (!session) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-white mb-4">Edit Session</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Session Name</label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Facilitator/Presenter</label>
            <input
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="e.g., John Smith, MoH Team"
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({ session: sessionName, speaker, duration })
              onClose()
            }}
            className="px-4 py-2 bg-fastr-primary text-white rounded hover:bg-fastr-primary/80 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export function SlideSorter() {
  const { currentWorkshopId, currentConfig, reorderSession, addSession, updateSession, removeSession } = useWorkshopStore()
  const [slides, setSlides] = useState<SlideData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [selectedSlide, setSelectedSlide] = useState<SlideData | null>(null)
  const [saving, setSaving] = useState(false)
  const [dayFilter, setDayFilter] = useState<number | 'all'>('all')
  const [showSlideEditor, setShowSlideEditor] = useState(false)
  const [editorDay, setEditorDay] = useState(1)
  const [editingSession, setEditingSession] = useState<SessionGroup | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Group slides by session
  const sessionGroups = useMemo(() => {
    const groups: SessionGroup[] = []
    const sessionMap = new Map<string, SessionGroup>()

    for (const slide of slides) {
      let group = sessionMap.get(slide.sessionId)
      if (!group) {
        group = {
          sessionId: slide.sessionId,
          dayNumber: slide.dayNumber,
          sessionIndex: slide.sessionIndex,
          sessionName: slide.sessionName,
          sessionType: slide.sessionType,
          moduleId: slide.moduleId,
          slides: [],
        }
        sessionMap.set(slide.sessionId, group)
        groups.push(group)
      }
      group.slides.push(slide)
    }

    return groups
  }, [slides])

  // Build slides when workshop loads
  useEffect(() => {
    if (currentWorkshopId) {
      buildSlides()
    }
  }, [currentWorkshopId])

  const buildSlides = async () => {
    if (!currentWorkshopId) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/export/${currentWorkshopId}/slides`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to build slides')

      const data = await response.json()
      setSlides(data.slides)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id || !currentConfig) return

    // Find the sessions being moved
    const oldIndex = sessionGroups.findIndex((s) => s.sessionId === active.id)
    const newIndex = sessionGroups.findIndex((s) => s.sessionId === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const movingSession = sessionGroups[oldIndex]
    const targetSession = sessionGroups[newIndex]

    // For now, only allow reordering within the same day
    if (movingSession.dayNumber !== targetSession.dayNumber) {
      // TODO: Support cross-day moves using moveSessionToDay
      return
    }

    // Reorder the session groups locally for immediate visual feedback
    const reorderedGroups = arrayMove(sessionGroups, oldIndex, newIndex)

    // Update slides to reflect new order
    const newSlides: SlideData[] = []
    for (const group of reorderedGroups) {
      newSlides.push(...group.slides)
    }
    setSlides(newSlides)

    // Update the workshop config using the store's reorderSession
    setSaving(true)
    try {
      // Get the session indices within the day
      const sessionOldIdx = movingSession.sessionIndex
      const sessionNewIdx = targetSession.sessionIndex

      // Call the store's reorderSession which handles saving
      reorderSession(movingSession.dayNumber, sessionOldIdx, sessionNewIdx)

      // Rebuild slides to get fresh indices after a short delay
      setTimeout(() => {
        buildSlides()
        setSaving(false)
      }, 500)
    } catch (err: any) {
      setError('Failed to save reorder: ' + err.message)
      // Revert by rebuilding
      await buildSlides()
      setSaving(false)
    }
  }

  // Navigate between slides in zoomed view
  const navigateSlide = (direction: 'prev' | 'next') => {
    if (!selectedSlide) return

    const currentIdx = slides.findIndex((s) => s.id === selectedSlide.id)
    const newIdx = direction === 'prev' ? currentIdx - 1 : currentIdx + 1

    if (newIdx >= 0 && newIdx < slides.length) {
      setSelectedSlide(slides[newIdx])
    }
  }

  // Keyboard navigation when zoomed
  useEffect(() => {
    if (!selectedSlide) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigateSlide('prev')
      if (e.key === 'ArrowRight') navigateSlide('next')
      if (e.key === 'Escape') setSelectedSlide(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedSlide, slides])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <RefreshCw className="w-10 h-10 animate-spin mx-auto mb-4" />
          <p className="text-lg">Building slides...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button onClick={buildSlides} className="px-4 py-2 bg-fastr-primary rounded-lg">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Get unique days
  const days = [...new Set(sessionGroups.map((g) => g.dayNumber))].sort()

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          {/* Day filter buttons */}
          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setDayFilter('all')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                dayFilter === 'all'
                  ? 'bg-fastr-secondary text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {days.map((dayNum) => (
              <button
                key={dayNum}
                onClick={() => setDayFilter(dayNum)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  dayFilter === dayNum
                    ? 'bg-fastr-secondary text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                Day {dayNum}
              </button>
            ))}
          </div>

          <div className="text-white text-sm">
            <span className="font-medium">
              {dayFilter === 'all'
                ? slides.length
                : slides.filter(s => s.dayNumber === dayFilter).length} slides
            </span>
            {saving && (
              <span className="ml-3 text-fastr-secondary">
                <RefreshCw className="w-4 h-4 inline animate-spin mr-1" />
                Saving...
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Zoom slider */}
          <div className="flex items-center gap-3 bg-gray-700 rounded-lg px-3 py-1.5">
            <ZoomOut className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-32 h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-fastr-secondary"
            />
            <ZoomIn className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <button
            onClick={buildSlides}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 hover:text-white rounded-lg"
          >
            <RefreshCw className="w-4 h-4" />
            Rebuild
          </button>

          <button
            onClick={() => {
              setEditorDay(dayFilter === 'all' ? 1 : dayFilter)
              setShowSlideEditor(true)
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-fastr-secondary text-white rounded-lg hover:bg-fastr-secondary/90"
          >
            <Plus className="w-4 h-4" />
            New Slide
          </button>
        </div>
      </div>

      {/* Session groups by day */}
      <div className="flex-1 overflow-auto p-6">
        {days
          .filter((dayNum) => dayFilter === 'all' || dayFilter === dayNum)
          .map((dayNum) => {
          const daySessions = sessionGroups.filter((g) => g.dayNumber === dayNum)

          return (
            <div key={dayNum} className="mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">
                Day {dayNum}
                <span className="text-gray-400 font-normal ml-2">
                  ({daySessions.reduce((sum, s) => sum + s.slides.length, 0)} slides)
                </span>
              </h2>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={daySessions.map((s) => s.sessionId)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {daySessions.map((session) => (
                      <SortableSession
                        key={session.sessionId}
                        session={session}
                        zoom={zoom}
                        onSlideClick={setSelectedSlide}
                        onEditClick={setEditingSession}
                        onDeleteClick={(s) => {
                          if (confirm(`Delete "${s.sessionName}"? This cannot be undone.`)) {
                            removeSession(s.dayNumber, s.sessionIndex)
                            // Rebuild slides after deletion
                            setTimeout(() => buildSlides(), 100)
                          }
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )
        })}
      </div>

      {/* Zoomed slide modal */}
      {selectedSlide && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={() => setSelectedSlide(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setSelectedSlide(null)}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); navigateSlide('prev') }}
            disabled={slides.findIndex((s) => s.id === selectedSlide.id) === 0}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white disabled:opacity-20"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateSlide('next') }}
            disabled={slides.findIndex((s) => s.id === selectedSlide.id) === slides.length - 1}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white disabled:opacity-20"
          >
            <ChevronRight className="w-12 h-12" />
          </button>

          {/* Slide */}
          <div className="max-w-6xl w-full mx-8" onClick={(e) => e.stopPropagation()}>
            <div className="text-center text-white mb-4">
              <span className="text-2xl font-medium">
                {selectedSlide.sessionName}
              </span>
              <span className="text-gray-400 mx-3">•</span>
              <span className="text-gray-400">
                Slide {selectedSlide.slideIndex + 1}
              </span>
            </div>

            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                srcDoc={selectedSlide.html}
                className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-2xl"
                title={`Slide ${selectedSlide.slideIndex + 1}`}
              />
            </div>

            {/* Keyboard hint */}
            <p className="text-center text-gray-500 text-sm mt-4">
              ← → to navigate • ESC to close
            </p>
          </div>
        </div>
      )}

      {/* Custom Slide Editor Modal */}
      {showSlideEditor && currentWorkshopId && (
        <CustomSlideEditor
          workshopId={currentWorkshopId}
          dayNumber={editorDay}
          onClose={() => setShowSlideEditor(false)}
          onSave={(filename, _content, sessionName) => {
            // Add the custom slide as a session to the day
            addSession(editorDay, {
              session: sessionName,
              type: 'section',
              slides: [`custom_slides/${filename}`],
              duration: 10,
            })
            setShowSlideEditor(false)
            // Rebuild slides after a short delay
            setTimeout(() => buildSlides(), 500)
          }}
        />
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <EditSessionModal
          session={editingSession}
          onClose={() => setEditingSession(null)}
          onSave={(updates) => {
            updateSession(editingSession.dayNumber, editingSession.sessionIndex, updates)
            // Rebuild slides after a short delay
            setTimeout(() => buildSlides(), 500)
          }}
        />
      )}
    </div>
  )
}
