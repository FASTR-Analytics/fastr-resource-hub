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
  Lock,
  ArrowLeft,
  GitFork,
  SlidersHorizontal,
} from 'lucide-react'

// Compulsory session types that are locked
const compulsoryTypes = ['day_title', 'day_end', 'day_recap', 'section']

// Check if session is locked based on name patterns
function isSessionLocked(sessionName: string, sessionType: string): boolean {
  if (compulsoryTypes.includes(sessionType)) return true
  const name = sessionName.toLowerCase()
  if (name.includes('agenda') || name.includes('objectives') || name.includes('expectations') ||
      name.includes('expected outputs') || name.includes('introductions') ||
      name.includes('welcome') || name.includes('recap')) return true
  return false
}
import { CustomSlideEditor } from './CustomSlideEditor'
import { SlideMarkdownEditor } from './SlideMarkdownEditor'
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
  sourceRef: string | null
  sourceKind: string
  editable: boolean
  overridden: boolean
  stale?: boolean
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
  workshopLocked: boolean
  onSlideClick: (slide: SlideData) => void
  onSlideEdit: (slide: SlideData) => void
  onOpenSettings?: () => void
  onEditClick: (session: SessionGroup) => void
  onDeleteClick: (session: SessionGroup) => void
}

function SortableSession({ session, zoom, workshopLocked, onSlideClick, onSlideEdit, onOpenSettings, onEditClick, onDeleteClick }: SortableSessionProps) {
  const isLocked = isSessionLocked(session.sessionName, session.sessionType)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: session.sessionId, disabled: isLocked })

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

  const bgColor = isLocked ? 'bg-gray-400' : (typeColors[session.sessionType] || 'bg-gray-500')

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'z-50 opacity-80' : ''} ${isLocked ? 'opacity-60' : ''}`}
    >
      {/* Session header with drag handle */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg shadow-sm ${bgColor} text-white`}
      >
        {isLocked ? (
          <Lock className="w-4 h-4 opacity-70" />
        ) : (
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 opacity-70" />
          </div>
        )}
        <span className="font-medium text-sm truncate flex-1">
          {session.sessionName}
        </span>
        <span className="text-xs opacity-70 mr-2">
          {session.slides.length} slide{session.slides.length !== 1 ? 's' : ''}
        </span>
        {!isLocked && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEditClick(session)
              }}
              className="p-1 hover:bg-white/20 rounded transition-colors"
              title="Session settings (name, presenter, duration)"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
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
          </>
        )}
      </div>

      {/* Slides in this session */}
      <div
        className={`flex flex-wrap gap-3 p-4 bg-gray-800/50 rounded-b-lg border ${
          isDragging ? 'border-fastr-secondary ring-2 ring-fastr-secondary/30 shadow-2xl' : 'border-gray-700/60'
        }`}
      >
        {session.slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="relative group cursor-pointer"
            onClick={() => onSlideClick(slide)}
          >
            <div
              className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:ring-2 hover:ring-fastr-secondary transition-all"
              style={{ width: slideWidth, height: slideHeight }}
            >
              {/* Slide number badge */}
              <div className="absolute top-1 left-1 z-10 bg-black/70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                {idx + 1}
              </div>

              {/* Edit slide (hover) */}
              {slide.editable && !workshopLocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSlideEdit(slide)
                  }}
                  className="absolute top-1 right-1 z-10 flex items-center gap-1 px-1.5 py-1 rounded bg-black/70 text-white text-xs font-medium opacity-0 group-hover:opacity-100 hover:bg-fastr-secondary transition-all"
                  title="Edit slide content"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  {zoom >= 0.8 && <span>Edit</span>}
                </button>
              )}

              {/* Cover slide: content lives in Workshop Settings, so route there
                  instead of offering a raw-markdown editor */}
              {slide.sourceKind === 'cover' && !workshopLocked && onOpenSettings && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenSettings()
                  }}
                  className="absolute top-1 right-1 z-10 flex items-center gap-1 px-1.5 py-1 rounded bg-black/70 text-white text-xs font-medium opacity-0 group-hover:opacity-100 hover:bg-fastr-secondary transition-all"
                  title="The cover is set in Workshop settings"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  {zoom >= 0.8 && <span>Settings</span>}
                </button>
              )}

              {/* Edited-for-this-workshop badge; the stale variant flags that the
                  library version changed since the edit */}
              {slide.overridden && (
                slide.stale ? (
                  <div
                    className="absolute bottom-1 right-1 z-10 p-1 rounded bg-orange-600 text-white"
                    title="Library version changed since you edited this"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </div>
                ) : (
                  <div
                    className="absolute bottom-1 right-1 z-10 p-1 rounded bg-amber-500/90 text-white"
                    title="Edited for this workshop"
                  >
                    <GitFork className="w-3 h-3" />
                  </div>
                )
              )}

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
  onSave: (updates: { session?: string; speaker?: string; duration?: number; slides?: string[]; excludedSlides?: string[] }) => void
}

interface ModuleSlideInfo {
  filename: string
  title: string
}

function EditSessionModal({ session, onClose, onSave }: EditSessionModalProps) {
  const { currentConfig } = useWorkshopStore()
  const [sessionName, setSessionName] = useState('')
  const [speaker, setSpeaker] = useState('')
  const [duration, setDuration] = useState(0)
  const [extraSlides, setExtraSlides] = useState<string[]>([])
  const [moduleId, setModuleId] = useState<string | null>(null)
  const [moduleSlides, setModuleSlides] = useState<ModuleSlideInfo[]>([])
  const [excludedSlides, setExcludedSlides] = useState<string[]>([])
  const [loadingModuleSlides, setLoadingModuleSlides] = useState(false)

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
        setExtraSlides(sessionData.slides || [])
        setModuleId(sessionData.module || null)
        setExcludedSlides(sessionData.excludedSlides || [])
      }
    }
  }, [session, currentConfig])

  // Fetch module slides when moduleId is set
  useEffect(() => {
    if (moduleId) {
      setLoadingModuleSlides(true)
      fetch(`/api/content/modules/${moduleId}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          if (data.slides) {
            const slides = data.slides.map((s: any) => ({
              filename: s.filename,
              title: extractTitle(s.filename, s.content)
            }))
            setModuleSlides(slides)
          }
        })
        .catch(err => console.error('Failed to load module slides:', err))
        .finally(() => setLoadingModuleSlides(false))
    } else {
      setModuleSlides([])
    }
  }, [moduleId])

  // Extract title from markdown content or filename
  const extractTitle = (filename: string, content: string) => {
    const titleMatch = content.match(/^##\s+(.+)$/m)
    if (titleMatch) {
      return titleMatch[1].replace(/\s*-\s*Module\s*\d+$/i, '').trim()
    }
    return getSlideDisplayName(filename)
  }

  const removeExtraSlide = (index: number) => {
    const newSlides = extraSlides.filter((_, i) => i !== index)
    setExtraSlides(newSlides)
  }

  const toggleModuleSlide = (filename: string) => {
    if (excludedSlides.includes(filename)) {
      setExcludedSlides(excludedSlides.filter(f => f !== filename))
    } else {
      setExcludedSlides([...excludedSlides, filename])
    }
  }

  // Get display name for a slide file
  const getSlideDisplayName = (filename: string) => {
    // Remove path prefixes and extensions
    let name = filename
      .replace('custom_slides/', '')
      .replace('.md', '')
    // Convert underscores to spaces and capitalize
    name = name.replace(/_/g, ' ')
    // If it's a module topic file (m4_1_xxx), make it more readable
    const moduleMatch = name.match(/^(m\d+)\s+(\d+[a-z]?)\s+(.+)$/i)
    if (moduleMatch) {
      return `${moduleMatch[1].toUpperCase()}.${moduleMatch[2]}: ${moduleMatch[3]}`
    }
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  if (!session) return null

  const activeModuleSlides = moduleSlides.filter(s => !excludedSlides.includes(s.filename))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-white mb-4">Session settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Session Name</label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fastr-secondary focus:ring-2 focus:ring-fastr-secondary/30"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Facilitator/Presenter</label>
            <input
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="e.g., John Smith, MoH Team"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-fastr-secondary focus:ring-2 focus:ring-fastr-secondary/30"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              min={0}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-fastr-secondary focus:ring-2 focus:ring-fastr-secondary/30"
            />
          </div>

          {/* Module Slides Section */}
          {moduleId && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Module Slides ({activeModuleSlides.length}/{moduleSlides.length} active)
              </label>
              {loadingModuleSlides ? (
                <div className="text-gray-400 text-sm py-2">Loading slides...</div>
              ) : (
                <div className="space-y-1 bg-gray-700/50 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {moduleSlides.map((slide) => {
                    const isExcluded = excludedSlides.includes(slide.filename)
                    return (
                      <div
                        key={slide.filename}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors ${
                          isExcluded
                            ? 'bg-red-900/30 hover:bg-red-900/50'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        onClick={() => toggleModuleSlide(slide.filename)}
                      >
                        <input
                          type="checkbox"
                          checked={!isExcluded}
                          onChange={() => toggleModuleSlide(slide.filename)}
                          className="w-4 h-4 rounded border-gray-500 text-fastr-primary focus:ring-fastr-primary"
                        />
                        <span className={`text-sm flex-1 truncate ${isExcluded ? 'text-gray-500 line-through' : 'text-gray-200'}`} title={slide.filename}>
                          {slide.title}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Uncheck slides to exclude them from this session
              </p>
            </div>
          )}

          {/* Extra Slides Section */}
          {extraSlides.length > 0 && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                {moduleId ? 'Additional Slides' : 'Slides'} ({extraSlides.length})
              </label>
              <div className="space-y-2 bg-gray-700/50 rounded-lg p-3">
                {extraSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 bg-gray-700 rounded px-3 py-2"
                  >
                    <span className="text-sm text-gray-200 truncate flex-1" title={slide}>
                      {getSlideDisplayName(slide)}
                    </span>
                    <button
                      onClick={() => removeExtraSlide(idx)}
                      className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                      title="Remove this slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {moduleId && (
                <p className="text-xs text-gray-500 mt-1">
                  These slides are shown after the module content
                </p>
              )}
            </div>
          )}
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
              onSave({ session: sessionName, speaker, duration, slides: extraSlides, excludedSlides })
              onClose()
            }}
            className="px-4 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/80 transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

interface SlideSorterProps {
  onBack?: () => void
  onOpenSettings?: () => void
}

export function SlideSorter({ onBack, onOpenSettings }: SlideSorterProps) {
  const { currentWorkshopId, currentConfig, workshops, loadWorkshops, reorderSession, moveSessionToDay, addSession, updateSession, removeSession } = useWorkshopStore()
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
  const [editingSlide, setEditingSlide] = useState<SlideData | null>(null)

  // Locked workshops are read-only: no per-slide editing
  const workshopLocked = workshops.find((w) => w.id === currentWorkshopId)?.locked ?? false
  useEffect(() => {
    if (workshops.length === 0) loadWorkshops()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        credentials: 'include',
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

    // Cross-day move: move session to the target day at the target position
    if (movingSession.dayNumber !== targetSession.dayNumber) {
      setSaving(true)
      try {
        moveSessionToDay(
          movingSession.dayNumber,
          movingSession.sessionIndex,
          targetSession.dayNumber,
          targetSession.sessionIndex
        )
        setTimeout(() => {
          buildSlides()
          setSaving(false)
        }, 500)
      } catch (err: any) {
        setError('Failed to move session: ' + err.message)
        await buildSlides()
        setSaving(false)
      }
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
          {/* Back button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
          )}

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
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Rebuild
          </button>

          <button
            onClick={() => {
              setEditorDay(dayFilter === 'all' ? 1 : dayFilter)
              setShowSlideEditor(true)
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-fastr-secondary text-white rounded-lg hover:bg-fastr-secondary/90 transition-colors duration-200"
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
                        workshopLocked={workshopLocked}
                        onSlideClick={setSelectedSlide}
                        onSlideEdit={setEditingSlide}
                        onOpenSettings={onOpenSettings}
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
            aria-label="Close slide view"
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); navigateSlide('prev') }}
            disabled={slides.findIndex((s) => s.id === selectedSlide.id) === 0}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white disabled:opacity-20"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateSlide('next') }}
            disabled={slides.findIndex((s) => s.id === selectedSlide.id) === slides.length - 1}
            aria-label="Next slide"
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
              {selectedSlide.editable && !workshopLocked && (
                <button
                  onClick={() => {
                    setEditingSlide(selectedSlide)
                    setSelectedSlide(null)
                  }}
                  className="ml-4 inline-flex items-center gap-1.5 px-3 py-1 text-sm bg-gray-700 text-gray-300 hover:text-white hover:bg-fastr-secondary rounded-lg transition-colors align-middle"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit slide
                </button>
              )}
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
            // Add the custom slide as a session to the day (editable, not locked).
            addSession(editorDay, {
              session: sessionName,
              slides: [`custom_slides/${filename}`],
              duration: 10,
            })
            setShowSlideEditor(false)
            // Rebuild slides after a short delay
            setTimeout(() => buildSlides(), 500)
          }}
        />
      )}

      {/* Per-slide Markdown Editor */}
      {editingSlide && editingSlide.sourceRef && currentWorkshopId && (
        <SlideMarkdownEditor
          workshopId={currentWorkshopId}
          slide={{
            sourceRef: editingSlide.sourceRef,
            sourceKind: editingSlide.sourceKind,
            overridden: editingSlide.overridden,
            stale: editingSlide.stale,
            sessionName: editingSlide.sessionName,
            dayNumber: editingSlide.dayNumber,
            sessionIndex: editingSlide.sessionIndex,
          }}
          onSaved={() => setTimeout(() => buildSlides(), 300)}
          onClose={() => setEditingSlide(null)}
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
