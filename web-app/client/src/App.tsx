import { useEffect, useState } from 'react'
import { useWorkshopStore, Session } from './stores/workshop'
import { SlideSorter } from './components/SlideSorter'
import { AIAssistant } from './components/AIAssistant'
import { ContentLibrary } from './components/ContentLibrary'
import {
  Layers,
  BookOpen,
  Sparkles,
  Settings,
  Eye,
  Download,
  ChevronDown,
  Menu,
  X,
  Check,
  RefreshCw,
  FileText,
  Presentation,
  GripVertical,
  Pencil,
  Lock,
  Plus,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Session type colors and icons
const sessionTypeConfig: Record<string, { bg: string; border: string; icon: string }> = {
  break: { bg: 'bg-amber-50', border: 'border-amber-300', icon: '☕' },
  day_title: { bg: 'bg-gray-100', border: 'border-gray-300', icon: '📅' },
  day_end: { bg: 'bg-purple-50', border: 'border-purple-300', icon: '🏁' },
  day_recap: { bg: 'bg-green-50', border: 'border-green-300', icon: '📋' },
  section: { bg: 'bg-gray-50', border: 'border-gray-300', icon: '📑' },
}

// Locked session types that can't be moved
const lockedTypes = ['day_title', 'day_end']

interface SortableSessionCardProps {
  session: Session & { _id: string }
  index: number
  dayNum: number
  onEdit: (session: Session, dayNum: number, index: number) => void
}

function SortableSessionCard({ session, index, dayNum, onEdit }: SortableSessionCardProps) {
  const isLocked = lockedTypes.includes(session.type || '')
  const config = session.module
    ? { bg: 'bg-blue-50', border: 'border-blue-300', icon: '📘' }
    : sessionTypeConfig[session.type || ''] || { bg: 'bg-white', border: 'border-gray-200', icon: '📝' }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: session._id,
    disabled: isLocked,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-3 rounded-lg border-2 transition-all ${config.bg} ${config.border} ${
        isDragging ? 'opacity-50 scale-105 shadow-lg z-50' : ''
      } ${isLocked ? 'opacity-70' : ''}`}
    >
      {/* Drag handle or lock icon */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2">
        {isLocked ? (
          <Lock className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>

      {/* Edit button */}
      {!isLocked && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(session, dayNum, index)
          }}
          className="absolute right-1 top-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-black/10 transition-all"
          title="Edit session"
        >
          <Pencil className="w-3.5 h-3.5 text-gray-500" />
        </button>
      )}

      {/* Content */}
      <div className="pl-5 pr-6">
        <div className="flex items-center gap-2">
          <span className="text-sm">{config.icon}</span>
          <span className="text-sm font-medium text-gray-800 truncate">{session.session}</span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          {session.duration && session.duration > 0 && (
            <span>{session.duration} min</span>
          )}
          {session.speaker && (
            <>
              <span>•</span>
              <span className="truncate">{session.speaker}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Edit Session Modal
interface EditSessionModalProps {
  session: Session
  onClose: () => void
  onSave: (updates: Partial<Session>) => void
  onDelete: () => void
}

function EditSessionModal({ session, onClose, onSave, onDelete }: EditSessionModalProps) {
  const [sessionName, setSessionName] = useState(session.session || '')
  const [speaker, setSpeaker] = useState(session.speaker || '')
  const [duration, setDuration] = useState(session.duration || 0)

  const handleSave = () => {
    onSave({
      session: sessionName,
      speaker: speaker || undefined,
      duration,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
          <h3 className="font-semibold text-gray-800">Edit Session</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Name</label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
              placeholder="Session name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facilitator/Presenter</label>
            <input
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
              placeholder="e.g., John Smith, MoH Team"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
              min={0}
              step={5}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
          <button
            onClick={() => {
              if (confirm('Delete this session?')) {
                onDelete()
                onClose()
              }
            }}
            className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete Session
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  const {
    currentWorkshopId,
    currentConfig,
    workshops,
    loadWorkshops,
    loadContentLibrary,
    selectWorkshop,
    error,
    setError,
    saveStatus,
  } = useWorkshopStore()

  const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [showWorkshopSelector, setShowWorkshopSelector] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)
  const [editingSession, setEditingSession] = useState<{
    session: Session
    dayNum: number
    index: number
  } | null>(null)
  const [_activeId, setActiveId] = useState<string | null>(null)
  const [showCreateWorkshop, setShowCreateWorkshop] = useState(false)
  const [newWorkshop, setNewWorkshop] = useState({
    name: '',
    country: '',
    location: '',
    days: 3,
  })

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Get store actions
  const { reorderSession, updateSession, removeSession, createWorkshop, updateWorkshopSettings } = useWorkshopStore()

  // Load data on mount
  useEffect(() => {
    loadWorkshops()
    loadContentLibrary()
  }, [])

  // Show workshop selector if no workshop is selected
  useEffect(() => {
    if (!currentWorkshopId && workshops.length > 0) {
      setShowWorkshopSelector(true)
    }
  }, [currentWorkshopId, workshops])

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowExportMenu(false)
    if (showExportMenu) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [showExportMenu])

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    // Find which day and index the dragged item is from
    for (let day = 1; day <= (currentConfig?.schedule?.days || 0); day++) {
      const dayKey = `day${day}`
      const sessions = currentConfig?.schedule?.[dayKey] || []
      const fromIndex = sessions.findIndex((s: any) => s._id === active.id)
      const toIndex = sessions.findIndex((s: any) => s._id === over.id)

      if (fromIndex !== -1 && toIndex !== -1) {
        reorderSession(day, fromIndex, toIndex)
        break
      }
    }
  }

  // Handle edit session
  const handleEditSession = (session: Session, dayNum: number, index: number) => {
    setEditingSession({ session, dayNum, index })
  }

  // Handle save session
  const handleSaveSession = (updates: Partial<Session>) => {
    if (editingSession) {
      updateSession(editingSession.dayNum, editingSession.index, updates)
    }
  }

  // Handle delete session
  const handleDeleteSession = () => {
    if (editingSession) {
      removeSession(editingSession.dayNum, editingSession.index)
    }
  }

  // Handle create new workshop
  const handleCreateWorkshop = async () => {
    if (!newWorkshop.name || !newWorkshop.country) {
      setError('Please fill in workshop name and country')
      return
    }

    // Generate workshop ID from year and country
    const year = new Date().getFullYear()
    const countrySlug = newWorkshop.country.toLowerCase().replace(/\s+/g, '-')
    const workshopId = `${year}-${countrySlug}`

    // Create initial schedule with empty days
    const schedule: any = {
      days: newWorkshop.days,
      day_titles: {},
      day_start_times: {},
    }

    // Add starter sessions for each day
    for (let d = 1; d <= newWorkshop.days; d++) {
      schedule.day_start_times[d] = '09:00'
      schedule.day_titles[d] = `Day ${d}`
      schedule[`day${d}`] = [
        {
          _id: `day-title-${d}-${Date.now()}`,
          session: `Day ${d}`,
          type: 'day_title',
          slides: ['day_title.md'],
          duration: 0,
        },
        {
          _id: `day-agenda-${d}-${Date.now()}`,
          session: `Day ${d} Agenda`,
          type: 'section',
          duration: 5,
        },
        ...(d > 1
          ? [
              {
                _id: `day-recap-${d}-${Date.now()}`,
                session: `Recap of Day ${d - 1}`,
                type: 'day_recap',
                duration: 15,
              },
            ]
          : []),
        {
          _id: `lunch-${d}-${Date.now()}`,
          session: 'Lunch Break',
          type: 'break',
          duration: 60,
        },
        {
          _id: `day-end-${d}-${Date.now()}`,
          session: `End of Day ${d}`,
          type: 'day_end',
          slides: ['day_end.md'],
          duration: 5,
        },
      ]
    }

    const config = {
      workshop: {
        name: newWorkshop.name,
        country: newWorkshop.country,
        location: newWorkshop.location,
        date: '',
        facilitators: '',
      },
      schedule,
      content: {
        modules: [],
        custom_slides: [],
      },
    }

    await createWorkshop(workshopId, config)
    setShowCreateWorkshop(false)
    setShowWorkshopSelector(false)
    setNewWorkshop({ name: '', country: '', location: '', days: 3 })
  }

  // Build deck
  const handleBuild = async (format: 'html' | 'pdf' | 'pptx') => {
    if (!currentWorkshopId) return
    setIsBuilding(true)
    setShowExportMenu(false)

    try {
      let downloadUrl = ''

      if (format === 'html') {
        await fetch(`/api/export/${currentWorkshopId}/html`, { method: 'POST' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/html`
      } else if (format === 'pdf') {
        await fetch(`/api/export/${currentWorkshopId}/pdf`, { method: 'POST' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/pdf`
      } else if (format === 'pptx') {
        await fetch(`/api/export/${currentWorkshopId}/pptx`, { method: 'POST' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/pptx`
      }

      // Trigger download
      if (downloadUrl) {
        window.open(downloadUrl, '_blank')
      }
    } catch (error: any) {
      alert(`Build failed: ${error.message}`)
    }
    setIsBuilding(false)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header / Toolbar */}
      <header className="bg-fastr-primary text-white px-4 py-2 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6" />
          <h1 className="font-semibold text-lg">FASTR Deck Builder</h1>
        </div>

        {/* Workshop selector */}
        {currentWorkshopId && (
          <button
            onClick={() => setShowWorkshopSelector(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium max-w-[200px] truncate">
              {currentConfig?.workshop?.name || currentWorkshopId}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {/* Toolbar buttons */}
        <div className="flex items-center gap-1">
          {/* Save status */}
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-xs text-white/70 px-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 text-xs text-green-300 px-2">
              <Check className="w-3 h-3" />
              Saved
            </span>
          )}

          {/* Library toggle */}
          <button
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className={`p-2 rounded-md transition-colors ${
              leftPanelOpen ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
            }`}
            title="Content Library"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* AI toggle */}
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className={`p-2 rounded-md transition-colors ${
              rightPanelOpen ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
            }`}
            title="AI Assistant"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-white/20 mx-1" />

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-md text-white/80 hover:bg-white/10 transition-colors"
            title="Workshop Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Preview */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded-md transition-colors ${
              showPreview ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
            }`}
            title="Preview Deck"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowExportMenu(!showExportMenu)
              }}
              disabled={isBuilding || !currentWorkshopId}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              {isBuilding ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">Export</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30">
                <button
                  onClick={() => handleBuild('html')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span>Export HTML</span>
                </button>
                <button
                  onClick={() => handleBuild('pdf')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => handleBuild('pptx')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Presentation className="w-4 h-4 text-gray-400" />
                  <span>Export PowerPoint</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-100 border-b border-red-200 text-red-700 px-4 py-2 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel - Content Library (slide-out) */}
        <div
          className={`absolute left-0 top-0 bottom-0 z-10 transition-transform duration-300 ease-in-out ${
            leftPanelOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full w-80 bg-white border-r border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Content Library</span>
              <button
                onClick={() => setLeftPanelOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ContentLibrary />
            </div>
          </div>
        </div>

        {/* Center - Main content */}
        <main className="flex-1 overflow-hidden">
          {currentWorkshopId ? (
            showPreview ? (
              <SlideSorter />
            ) : (
              <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <div className="h-full overflow-auto p-4">
                    <div className="max-w-7xl mx-auto">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        {currentConfig?.workshop?.name || 'Workshop'}
                      </h2>

                      {/* Day columns - Kanban style */}
                      <div className="flex gap-4 overflow-x-auto pb-4">
                        {Array.from({ length: currentConfig?.schedule?.days || 0 }).map((_, i) => {
                          const dayNum = i + 1
                          const dayKey = `day${dayNum}`
                          const sessions = (currentConfig?.schedule?.[dayKey] || []).map(
                            (s: any, idx: number) => ({
                              ...s,
                              _id: s._id || `${dayKey}-${idx}`,
                            })
                          )

                          return (
                            <div
                              key={dayNum}
                              className="flex-shrink-0 w-80 bg-gray-50 rounded-xl shadow-sm border border-gray-200"
                            >
                              {/* Day header */}
                              <div className="px-4 py-3 border-b border-gray-200 bg-white rounded-t-xl">
                                <h3 className="font-semibold text-gray-800">
                                  Day {dayNum}
                                  {currentConfig?.schedule?.day_titles?.[dayNum] && (
                                    <span className="text-gray-400 font-normal ml-1">
                                      - {currentConfig.schedule.day_titles[dayNum]}
                                    </span>
                                  )}
                                </h3>
                                {currentConfig?.schedule?.day_start_times?.[dayNum] && (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    Starts at {currentConfig.schedule.day_start_times[dayNum]}
                                  </div>
                                )}
                              </div>

                              {/* Sessions list */}
                              <div className="p-3 space-y-2 min-h-[200px]">
                                <SortableContext
                                  items={sessions.map((s: any) => s._id)}
                                  strategy={verticalListSortingStrategy}
                                >
                                  {sessions.map((session: any, idx: number) => (
                                    <SortableSessionCard
                                      key={session._id}
                                      session={session}
                                      index={idx}
                                      dayNum={dayNum}
                                      onEdit={handleEditSession}
                                    />
                                  ))}
                                </SortableContext>

                                {/* Add session button */}
                                <button
                                  className="w-full py-2 px-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-fastr-primary hover:text-fastr-primary transition-colors flex items-center justify-center gap-2"
                                  onClick={() => {
                                    // TODO: Open add session menu
                                  }}
                                >
                                  <Plus className="w-4 h-4" />
                                  <span className="text-sm">Add Session</span>
                                </button>
                              </div>
                            </div>
                          )
                        })}

                        {/* Add Day button */}
                        <button
                          className="flex-shrink-0 w-64 h-32 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-fastr-primary hover:text-fastr-primary transition-colors flex flex-col items-center justify-center gap-2"
                          onClick={() => useWorkshopStore.getState().addDay()}
                        >
                          <Plus className="w-6 h-6" />
                          <span className="font-medium">Add Day</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </DndContext>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Layers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Select or create a workshop to get started</p>
                <button
                  onClick={() => setShowWorkshopSelector(true)}
                  className="mt-4 px-4 py-2 bg-fastr-primary text-white rounded-md hover:bg-fastr-primary/90 transition-colors"
                >
                  Choose Workshop
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - AI Assistant (slide-out) */}
        <div
          className={`absolute right-0 top-0 bottom-0 z-10 transition-transform duration-300 ease-in-out ${
            rightPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">AI Assistant</span>
              <button
                onClick={() => setRightPanelOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIAssistant />
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Selector Modal */}
      {showWorkshopSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold">
                {showCreateWorkshop ? 'Create New Workshop' : 'Select Workshop'}
              </h2>
              <button
                onClick={() => {
                  setShowWorkshopSelector(false)
                  setShowCreateWorkshop(false)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {showCreateWorkshop ? (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Workshop Name *
                  </label>
                  <input
                    type="text"
                    value={newWorkshop.name}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
                    placeholder="e.g., FASTR Training Workshop"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={newWorkshop.country}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
                    placeholder="e.g., Kenya"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newWorkshop.location}
                    onChange={(e) => setNewWorkshop({ ...newWorkshop, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
                    placeholder="e.g., Nairobi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Days
                  </label>
                  <select
                    value={newWorkshop.days}
                    onChange={(e) =>
                      setNewWorkshop({ ...newWorkshop, days: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
                  >
                    {[1, 2, 3, 4, 5].map((d) => (
                      <option key={d} value={d}>
                        {d} day{d > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowCreateWorkshop(false)}
                    className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateWorkshop}
                    className="flex-1 px-4 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 transition-colors"
                  >
                    Create Workshop
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {/* Create New button */}
                <button
                  onClick={() => setShowCreateWorkshop(true)}
                  className="w-full mb-4 py-3 px-4 rounded-lg border-2 border-dashed border-fastr-primary text-fastr-primary hover:bg-fastr-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Create New Workshop</span>
                </button>

                {/* Existing workshops */}
                <div className="max-h-72 overflow-auto">
                  {workshops.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No workshops found</p>
                  ) : (
                    <div className="space-y-2">
                      {workshops.map((workshop) => (
                        <button
                          key={workshop.id}
                          onClick={() => {
                            selectWorkshop(workshop.id)
                            setShowWorkshopSelector(false)
                          }}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                            currentWorkshopId === workshop.id
                              ? 'bg-fastr-primary/10 border-fastr-primary'
                              : 'hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="font-medium">{workshop.name}</div>
                          <div className="text-sm text-gray-500">
                            {workshop.country}
                            {workshop.location && ` • ${workshop.location}`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && currentConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Workshop Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Cover Slide Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Cover Slide
                </h3>
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Presentation Title
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.title || 'STRENGTHENING HEALTH SYSTEMS AND RMNCAH-N OUTCOMES THROUGH RAPID CYCLE ANALYTICS AND DATA USE'}
                      onChange={(e) => updateWorkshopSettings({ title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="Main title on cover slide"
                    />
                    <p className="text-xs text-gray-500 mt-1">The main title displayed on the cover slide</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.subtitle || 'Country Workshop: Introduction to FASTR RMNCAH-N Service Use Monitoring'}
                      onChange={(e) => updateWorkshopSettings({ subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="Subtitle on cover slide"
                    />
                  </div>
                </div>
              </section>

              {/* Basic Info Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Workshop Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workshop Name
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.name || ''}
                      onChange={(e) => updateWorkshopSettings({ name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="e.g., FASTR Workshop - Kenya"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.date || ''}
                      onChange={(e) => updateWorkshopSettings({ date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="e.g., January 15-18, 2026"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.country || ''}
                      onChange={(e) => updateWorkshopSettings({ country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="e.g., Kenya"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.location || ''}
                      onChange={(e) => updateWorkshopSettings({ location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="e.g., Nairobi"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Venue
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.venue || ''}
                      onChange={(e) => updateWorkshopSettings({ venue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="e.g., Sarova Stanley Hotel"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Facilitators
                    </label>
                    <input
                      type="text"
                      value={currentConfig.workshop.facilitators || ''}
                      onChange={(e) => updateWorkshopSettings({ facilitators: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="e.g., John Smith, Jane Doe"
                    />
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={currentConfig.workshop.contact_email || ''}
                      onChange={(e) => updateWorkshopSettings({ contact_email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="e.g., workshop@example.org"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={currentConfig.workshop.website || ''}
                      onChange={(e) => updateWorkshopSettings({ website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="e.g., https://fastr.org"
                    />
                  </div>
                </div>
              </section>

              {/* Content Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Workshop Content
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Objectives
                    </label>
                    <textarea
                      value={currentConfig.workshop.objectives || ''}
                      onChange={(e) => updateWorkshopSettings({ objectives: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="Enter workshop objectives (one per line)"
                    />
                    <p className="text-xs text-gray-500 mt-1">One objective per line, will be formatted as bullet points</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Scope of Work
                    </label>
                    <textarea
                      value={currentConfig.workshop.scope_of_work || ''}
                      onChange={(e) => updateWorkshopSettings({ scope_of_work: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="Enter scope of work items (one per line)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Outputs
                    </label>
                    <textarea
                      value={currentConfig.workshop.expected_outputs || ''}
                      onChange={(e) => updateWorkshopSettings({ expected_outputs: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="Enter expected outputs (one per line)"
                    />
                  </div>
                </div>
              </section>

              {/* Schedule Section */}
              <section>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Daily Schedule
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Set the theme and start time for each day. These appear in agenda slides and day headers.
                </p>

                {/* Column headers */}
                <div className="flex items-center gap-4 px-3 mb-2">
                  <span className="text-xs font-medium text-gray-500 w-16">Day</span>
                  <span className="flex-1 text-xs font-medium text-gray-500">Theme / Focus Area</span>
                  <span className="w-24 text-xs font-medium text-gray-500">Starts at</span>
                </div>

                <div className="space-y-2">
                  {Array.from({ length: currentConfig.schedule.days }).map((_, i) => {
                    const dayNum = i + 1
                    return (
                      <div key={dayNum} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                        <span className="text-sm font-semibold text-fastr-primary w-16">Day {dayNum}</span>
                        <div className="flex-1">
                          <input
                            type="text"
                            value={currentConfig.schedule.day_titles?.[dayNum] || ''}
                            onChange={(e) => {
                              const newTitles = {
                                ...currentConfig.schedule.day_titles,
                                [dayNum]: e.target.value,
                              }
                              const newConfig = {
                                ...currentConfig,
                                schedule: { ...currentConfig.schedule, day_titles: newTitles },
                              }
                              useWorkshopStore.setState({ currentConfig: newConfig })
                              useWorkshopStore.getState().saveCurrentWorkshop()
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
                            placeholder={`e.g., ${dayNum === 1 ? 'Introduction & Data Extraction' : dayNum === 2 ? 'Data Quality Assessment' : 'Analysis & Communication'}`}
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="time"
                            value={currentConfig.schedule.day_start_times?.[dayNum] || '09:00'}
                            onChange={(e) => {
                              const newTimes = {
                                ...currentConfig.schedule.day_start_times,
                                [dayNum]: e.target.value,
                              }
                              const newConfig = {
                                ...currentConfig,
                                schedule: { ...currentConfig.schedule, day_start_times: newTimes },
                              }
                              useWorkshopStore.setState({ currentConfig: newConfig })
                              useWorkshopStore.getState().saveCurrentWorkshop()
                            }}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Changes are saved automatically
                </span>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 transition-colors text-sm font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editingSession && (
        <EditSessionModal
          session={editingSession.session}
          onClose={() => setEditingSession(null)}
          onSave={handleSaveSession}
          onDelete={handleDeleteSession}
        />
      )}
    </div>
  )
}

export default App
