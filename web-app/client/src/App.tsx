import React, { useEffect, useState, useRef } from 'react'
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
  ChevronRight,
  Menu,
  X,
  Check,
  RefreshCw,
  FileText,
  Presentation,
  GripVertical,
  Pencil,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Pin,
  PinOff,
  Library,
  Zap,
  ArrowLeft,
  Folder,
  FolderOpen,
  Minus,
  LogOut,
  KeyRound,
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

// Compulsory slides that are locked (can't be moved or deleted)
// These are identified by their slide templates or session types
const compulsorySlides = [
  'title_slide.md',
  'welcome_slide.md',
  'introductions_slide.md',
  'objectives_slide.md',
  'expectations_slide.md',
  'expected_outputs_slide.md',
  'day_title.md',
  'day_end.md',
]
const compulsoryTypes = ['day_title', 'day_end', 'day_recap', 'section']

// Check if a session is compulsory/locked
function isSessionLocked(session: Session): boolean {
  // Check by type
  if (session.type && compulsoryTypes.includes(session.type)) return true
  // Check by slide template
  if (session.slides?.some(s => compulsorySlides.includes(s))) return true
  // Check by session name patterns
  const name = session.session?.toLowerCase() || ''
  if (name.includes('agenda') || name.includes('objectives') || name.includes('expectations') ||
      name.includes('expected outputs') || name.includes('introductions') ||
      name.includes('welcome') || name.includes('recap')) return true
  return false
}

interface SortableSessionCardProps {
  session: Session & { _id: string; _startTime?: string; _endTime?: string }
  index: number
  dayNum: number
  onEdit: (session: Session, dayNum: number, index: number) => void
}

function SortableSessionCard({ session, index, dayNum, onEdit }: SortableSessionCardProps) {
  const isLocked = isSessionLocked(session)
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

  // Locked sessions are shown as compact, grayed-out items
  if (isLocked) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-100 border border-gray-200 opacity-60">
        <span className="text-xs font-mono text-gray-400 w-12 flex-shrink-0">{session._startTime || ''}</span>
        <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="text-xs text-gray-500 truncate flex-1">{session.session}</span>
        {session.duration && session.duration > 0 && (
          <span className="text-xs text-gray-400 flex-shrink-0">{session.duration}m</span>
        )}
      </div>
    )
  }

  // Editable sessions get full card treatment
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-3 rounded-lg border-2 transition-all ${config.bg} ${config.border} ${
        isDragging ? 'opacity-50 scale-105 shadow-lg z-50' : ''
      }`}
    >
      {/* Drag handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Edit button */}
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

      {/* Content */}
      <div className="pl-5 pr-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500 w-12 flex-shrink-0">{session._startTime || ''}</span>
          <span className="text-sm">{config.icon}</span>
          <span className="text-sm font-medium text-gray-800 truncate flex-1">{session.session}</span>
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
  dayNum: number
  totalDays: number
  onClose: () => void
  onSave: (updates: Partial<Session>) => void
  onDelete: () => void
  onMoveToDay: (toDay: number) => void
}

function EditSessionModal({ session, dayNum, totalDays, onClose, onSave, onDelete, onMoveToDay }: EditSessionModalProps) {
  const [sessionName, setSessionName] = useState(session.session || '')
  const [speaker, setSpeaker] = useState(session.speaker || '')
  const [duration, setDuration] = useState(session.duration || 0)
  const [moveToDay, setMoveToDay] = useState<number | null>(null)

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

          {/* Move to Day */}
          {totalDays > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Move to Different Day</label>
              <div className="flex gap-2">
                <select
                  value={moveToDay ?? ''}
                  onChange={(e) => setMoveToDay(e.target.value ? parseInt(e.target.value) : null)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
                >
                  <option value="">Select day...</option>
                  {Array.from({ length: totalDays }, (_, i) => i + 1)
                    .filter(d => d !== dayNum)
                    .map(d => (
                      <option key={d} value={d}>Day {d}</option>
                    ))}
                </select>
                <button
                  onClick={() => {
                    if (moveToDay) {
                      onMoveToDay(moveToDay)
                      onClose()
                    }
                  }}
                  disabled={!moveToDay}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Move
                </button>
              </div>
            </div>
          )}
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

// ─────────────────────────────────────────────────────────────────────────────
// Add Session Menu - Intuitive menu for adding sessions to a day
// ─────────────────────────────────────────────────────────────────────────────
interface ExistingSessionInfo {
  index: number
  session: Session
}

interface AddSessionMenuProps {
  dayNum: number
  onClose: () => void
  onAddSession: (session: Session) => void
  onAddToExistingSession: (sessionIdx: number, topic: { id: string; file: string; title: string; duration?: number }) => void
  contentLibrary: any[]
  existingSessions: ExistingSessionInfo[]
}

function AddSessionMenu({ dayNum, onClose, onAddSession, onAddToExistingSession, contentLibrary, existingSessions }: AddSessionMenuProps) {
  const [view, setView] = useState<'main' | 'modules' | 'custom' | 'assets' | 'add-to-session'>('main')
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<{ module: any; topic: any } | null>(null)
  const [customTitle, setCustomTitle] = useState('')
  const [customDuration, setCustomDuration] = useState(30)
  const [customContent, setCustomContent] = useState(`---
marp: true
theme: fastr
paginate: true
---

## Your Slide Title

- First point
- Second point
- Third point

`)
  const [assetLibrary, setAssetLibrary] = useState<Record<string, any[]>>({})
  const [expandedCategory, setExpandedCategory] = useState<string | null>('icons')
  const [isLoadingAssets, setIsLoadingAssets] = useState(false)
  const [uploadingAsset, setUploadingAsset] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load asset library when viewing assets
  useEffect(() => {
    if (view === 'assets' && Object.keys(assetLibrary).length === 0) {
      setIsLoadingAssets(true)
      fetch('/api/assets/library', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setAssetLibrary(data.library || {})
          setIsLoadingAssets(false)
        })
        .catch(() => setIsLoadingAssets(false))
    }
  }, [view])

  const insertImage = (asset: any) => {
    const markdown = `![${asset.filename}](/resources/${asset.path})`
    setCustomContent(prev => prev + '\n' + markdown + '\n')
    setView('custom')
  }

  const handleUploadAsset = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAsset(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/assets/library', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (data.success && data.asset) {
        // Add to custom category
        setAssetLibrary(prev => ({
          ...prev,
          custom: [...(prev.custom || []), data.asset],
        }))
        setExpandedCategory('custom')
      }
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploadingAsset(false)
    }
  }

  const addBreak = (type: 'tea' | 'lunch') => {
    const session: Session = {
      session: type === 'tea' ? '☕ Tea Break' : '🍽️ Lunch Break',
      type: 'break',
      duration: type === 'tea' ? 15 : 60,
      icon: type === 'tea' ? 'coffee' : 'utensils',
    }
    onAddSession(session)
    onClose()
  }

  const handleTopicClick = (module: any, topic: any) => {
    // Always show options view so user can choose
    setSelectedTopic({ module, topic })
    setView('add-to-session')
  }

  const addModuleAsNewSession = (module: any, topic: any) => {
    const session: Session = {
      session: topic.title,
      module: module.id,
      topics: [topic.id],
      slides: [topic.file],
      duration: topic.duration || 30,
    }
    onAddSession(session)
    onClose()
  }

  const addToExistingSession = (sessionIdx: number) => {
    if (!selectedTopic) return
    onAddToExistingSession(sessionIdx, {
      id: selectedTopic.topic.id,
      file: selectedTopic.topic.file,
      title: selectedTopic.topic.title,
      duration: selectedTopic.topic.duration,
    })
    onClose()
  }

  const addCustomSession = () => {
    if (!customTitle.trim()) return
    const session: Session = {
      session: customTitle,
      duration: customDuration,
      slides: [], // Will store custom content elsewhere
      // Store the custom markdown content in a special field
      _customContent: customContent,
    } as Session & { _customContent?: string }
    onAddSession(session)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            {view !== 'main' && (
              <button
                onClick={() => {
                  if (view === 'assets') setView('custom')
                  else if (view === 'add-to-session') setView('modules')
                  else setView('main')
                }}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="font-semibold text-gray-800">
              {view === 'main' && `Add to Day ${dayNum}`}
              {view === 'modules' && 'Choose Module Content'}
              {view === 'custom' && 'Create Custom Slide'}
              {view === 'assets' && 'Insert Image'}
              {view === 'add-to-session' && 'Add to Session'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Main Menu */}
        {view === 'main' && (
          <div className="p-4 space-y-2">
            {/* Module Content */}
            <button
              onClick={() => setView('modules')}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                📘
              </div>
              <div>
                <div className="font-medium text-gray-800">Module Content</div>
                <div className="text-sm text-gray-500">Add slides from FASTR modules</div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
            </button>

            {/* Breaks */}
            <div className="pt-2">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide px-3 mb-2">Breaks</div>
              <div className="flex gap-2">
                <button
                  onClick={() => addBreak('tea')}
                  className="flex-1 flex items-center gap-2 p-3 rounded-lg hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all"
                >
                  <span className="text-xl">☕</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Tea Break</div>
                    <div className="text-xs text-gray-500">15 min</div>
                  </div>
                </button>
                <button
                  onClick={() => addBreak('lunch')}
                  className="flex-1 flex items-center gap-2 p-3 rounded-lg hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all"
                >
                  <span className="text-xl">🍽️</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">Lunch Break</div>
                    <div className="text-xs text-gray-500">60 min</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Custom Session */}
            <div className="pt-2">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wide px-3 mb-2">Custom</div>
              <button
                onClick={() => setView('custom')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 border border-transparent hover:border-teal-200 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  ✏️
                </div>
                <div>
                  <div className="font-medium text-gray-800">Custom Slide</div>
                  <div className="text-sm text-gray-500">Create your own slide with markdown</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
              </button>
            </div>
          </div>
        )}

        {/* Module Browser */}
        {view === 'modules' && (
          <div className="overflow-y-auto max-h-[60vh]">
            {contentLibrary.map((module) => (
              <div key={module.id} className="border-b border-gray-100 last:border-0">
                <button
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  {expandedModule === module.id ? (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800">{module.title}</div>
                    <div className="text-xs text-gray-500">
                      Module {module.number} • {(module.fullTopics?.length || 0) + (module.condensedTopics?.length || 0)} slides
                    </div>
                  </div>
                </button>

                {expandedModule === module.id && (
                  <div className="bg-gray-50 px-4 pb-3">
                    {/* Add Full Module Button */}
                    {((module.fullTopics?.length || 0) + (module.condensedTopics?.length || 0)) > 0 && (
                      <button
                        onClick={() => {
                          // Add all topics from this module
                          const allTopics = [...(module.fullTopics || []), ...(module.condensedTopics || [])]
                          const session: Session = {
                            session: module.title,
                            module: module.id,
                            topics: allTopics.map((t: any) => t.id),
                            slides: allTopics.map((t: any) => t.file),
                            duration: allTopics.reduce((sum: number, t: any) => sum + (t.duration || 10), 0),
                          }
                          onAddSession(session)
                          onClose()
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2 mb-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Entire Module ({(module.fullTopics?.length || 0) + (module.condensedTopics?.length || 0)} slides)
                      </button>
                    )}

                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Or add individual slides:</div>

                    {/* Full Topics */}
                    {module.fullTopics && module.fullTopics.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs text-gray-500 font-medium py-1">Full Slides</div>
                        {module.fullTopics.map((topic: any) => (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicClick(module, topic)}
                            className="w-full flex items-center gap-2 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-left text-sm"
                          >
                            <span className="text-gray-400">📄</span>
                            <span className="flex-1 text-gray-700">{topic.title}</span>
                            {topic.duration && (
                              <span className="text-xs text-gray-400">{topic.duration}m</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Condensed Topics */}
                    {module.condensedTopics && module.condensedTopics.length > 0 && (
                      <div>
                        <div className="text-xs text-amber-600 font-medium py-1">⚡ Condensed Slides</div>
                        {module.condensedTopics.map((topic: any) => (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicClick(module, topic)}
                            className="w-full flex items-center gap-2 p-2 rounded hover:bg-amber-50 hover:shadow-sm transition-all text-left text-sm"
                          >
                            <span className="text-amber-500">📄</span>
                            <span className="flex-1 text-gray-700">{topic.title}</span>
                            {topic.duration && (
                              <span className="text-xs text-gray-400">{topic.duration}m</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Legacy topics (if no full/condensed split) */}
                    {!module.fullTopics && !module.condensedTopics && module.topics?.map((topic: any) => (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicClick(module, topic)}
                        className="w-full flex items-center gap-2 p-2 rounded hover:bg-white hover:shadow-sm transition-all text-left text-sm"
                      >
                        <span className="text-gray-400">📄</span>
                        <span className="flex-1 text-gray-700">{topic.title}</span>
                        {topic.duration && (
                          <span className="text-xs text-gray-400">{topic.duration}m</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Asset Browser */}
        {view === 'assets' && (
          <div className="flex flex-col max-h-[60vh]">
            {/* Upload button */}
            <div className="p-3 border-b bg-gray-50">
              <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-fastr-primary hover:bg-fastr-primary/5 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadAsset}
                  disabled={uploadingAsset}
                />
                {uploadingAsset ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span className="text-sm text-gray-600">Upload your own image</span>
              </label>
            </div>

            {isLoadingAssets ? (
              <div className="p-8 text-center text-gray-500">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading assets...
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                {Object.entries(assetLibrary).map(([category, assets]) => (
                  <div key={category} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                      className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 transition-colors"
                    >
                      {expandedCategory === category ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-800 capitalize">{category.replace(/_/g, ' ')}</span>
                      <span className="text-xs text-gray-400">({assets.length})</span>
                    </button>

                    {expandedCategory === category && (
                      <div className="px-3 pb-3 grid grid-cols-3 gap-3">
                        {assets.map((asset: any) => (
                          <button
                            key={asset.filename}
                            onClick={() => insertImage(asset)}
                            className="group flex flex-col rounded-lg border border-gray-200 overflow-hidden hover:border-fastr-primary hover:shadow-md transition-all bg-white"
                            title={asset.label || asset.filename}
                          >
                            <div className="relative aspect-square bg-gray-50">
                              <img
                                src={`/resources/${asset.path}`}
                                alt={asset.label || asset.filename}
                                className="w-full h-full object-contain p-2"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/resources/logos/FASTR_White_Horiz.png'
                                }}
                              />
                              <div className="absolute inset-0 bg-fastr-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-xs font-medium">+ Insert</span>
                              </div>
                            </div>
                            <div className="px-2 py-1.5 text-xs text-gray-600 truncate text-center border-t border-gray-100">
                              {asset.label || asset.filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ')}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Custom Slide Editor */}
        {view === 'custom' && (
          <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Title</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g., Hands-on Activity: Data Quality"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={customDuration}
                onChange={(e) => setCustomDuration(parseInt(e.target.value) || 0)}
                min={5}
                max={240}
                step={5}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary"
              />
            </div>

            {/* Markdown Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Slide Content (Marp Markdown)
                </label>
                <button
                  onClick={() => setView('assets')}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 flex items-center gap-1"
                >
                  🖼️ Insert Image
                </button>
              </div>
              <textarea
                ref={textareaRef}
                value={customContent}
                onChange={(e) => setCustomContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary font-mono text-sm"
                placeholder="Write your slide content in Marp markdown..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Use <code className="bg-gray-100 px-1 rounded">---</code> to separate slides.
                Variables: <code className="bg-gray-100 px-1 rounded">{'{{COUNTRY}}'}</code>,{' '}
                <code className="bg-gray-100 px-1 rounded">{'{{LOCATION}}'}</code>
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addCustomSession}
                disabled={!customTitle.trim()}
                className="px-4 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Session
              </button>
            </div>
          </div>
        )}

        {/* Add to Existing Session */}
        {view === 'add-to-session' && selectedTopic && (
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Selected topic info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-800">Adding: {selectedTopic.topic.title}</div>
              <div className="text-xs text-blue-600 mt-1">From: {selectedTopic.module.title}</div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {/* Create new session option */}
              <button
                onClick={() => addModuleAsNewSession(selectedTopic.module, selectedTopic.topic)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-fastr-primary hover:bg-fastr-primary/5 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Create New Session</div>
                  <div className="text-sm text-gray-500">Add as a separate session on Day {dayNum}</div>
                </div>
              </button>

              {/* Existing sessions */}
              {existingSessions.filter(s => s.session.module).length > 0 && (
                <>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wide px-1 pt-2">
                    Or add to existing session
                  </div>
                  {existingSessions
                    .filter(s => s.session.module) // Only show module sessions
                    .map(({ index, session }) => (
                      <button
                        key={index}
                        onClick={() => addToExistingSession(index)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-fastr-primary hover:bg-fastr-primary/5 transition-all text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-lg">
                          📘
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 truncate">{session.session}</div>
                          <div className="text-sm text-gray-500">
                            {session.module && <span className="text-blue-600">{session.module.toUpperCase()}</span>}
                            {(session.slides?.length ?? 0) > 0 && <span> + {session.slides?.length} extra</span>}
                            {' • '}{session.duration || 0} min
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// App Modes
// ─────────────────────────────────────────────────────────────────────────────
type AppMode = 'select' | 'workshop' | 'library' | 'quick'

// ─────────────────────────────────────────────────────────────────────────────
// Library Mode Component - Browse slides without export
// ─────────────────────────────────────────────────────────────────────────────
function LibraryMode({ onBack }: { onBack: () => void }) {
  const { contentLibrary, loadContentLibrary } = useWorkshopStore()
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [previewTopic, setPreviewTopic] = useState<any | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [presenterNotes, setPresenterNotes] = useState<string[]>([])
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)

  // Cache for rendered previews - persists across re-renders
  const previewCache = useRef<Map<string, { html: string; notes: string[] }>>(new Map())

  useEffect(() => {
    if (contentLibrary.length === 0) {
      loadContentLibrary()
    }
  }, [contentLibrary.length, loadContentLibrary])

  const toggleModule = (moduleId: string) => {
    const next = new Set(expandedModules)
    if (next.has(moduleId)) {
      next.delete(moduleId)
    } else {
      next.add(moduleId)
    }
    setExpandedModules(next)
  }

  const loadPreview = async (topic: any) => {
    setPreviewTopic(topic)

    // Check cache first - instant if already rendered
    const cached = previewCache.current.get(topic.id)
    if (cached) {
      setPreviewHtml(cached.html)
      setPresenterNotes(cached.notes)
      return
    }

    setPreviewHtml(null)  // Clear old preview immediately
    setIsLoadingPreview(true)
    setPresenterNotes([])
    try {
      const response = await fetch(`/api/content/topic/${topic.id}`, { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        const renderResponse = await fetch('/api/content/render', { credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown: data.content })
        })
        if (renderResponse.ok) {
          const renderData = await renderResponse.json()
          // Cache the result
          previewCache.current.set(topic.id, {
            html: renderData.html,
            notes: renderData.presenterNotes || []
          })
          setPreviewHtml(renderData.html)
          setPresenterNotes(renderData.presenterNotes || [])
        }
      }
    } catch (err) {
      console.error('Failed to load preview:', err)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  if (contentLibrary.length === 0) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading content library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Browse Content Library</h1>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Module list */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          {contentLibrary.map((module: any) => (
            <div key={module.id} className="border-b border-gray-100">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                {expandedModules.has(module.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-800 text-sm">M{module.number}: {module.name}</div>
                  <div className="text-xs text-gray-500">{module.totalSlides} slides</div>
                </div>
              </button>
              {expandedModules.has(module.id) && (
                <div className="bg-gray-50 border-t border-gray-100">
                  {/* Full slides */}
                  {module.fullTopics?.length > 0 && (
                    <>
                      <div className="px-4 py-1.5 pl-10 text-xs font-medium text-gray-500 bg-gray-100 border-b border-gray-200">
                        Full ({module.fullSlides} slides)
                      </div>
                      {module.fullTopics.map((topic: any) => (
                        <button
                          key={topic.id}
                          onClick={() => loadPreview(topic)}
                          className={`w-full text-left px-4 py-2 pl-12 hover:bg-gray-100 transition-colors ${
                            previewTopic?.id === topic.id ? 'bg-fastr-primary/10' : ''
                          }`}
                        >
                          <div className="text-sm text-gray-700">{topic.title}</div>
                          <div className="text-xs text-gray-400">{topic.slideCount} slides</div>
                        </button>
                      ))}
                    </>
                  )}
                  {/* Condensed slides */}
                  {module.condensedTopics?.length > 0 && (
                    <>
                      <div className="px-4 py-1.5 pl-10 text-xs font-medium text-amber-700 bg-amber-50 border-b border-amber-200">
                        Condensed ({module.condensedSlides} slides)
                      </div>
                      {module.condensedTopics.map((topic: any) => (
                        <button
                          key={topic.id}
                          onClick={() => loadPreview(topic)}
                          className={`w-full text-left px-4 py-2 pl-12 hover:bg-amber-50 transition-colors ${
                            previewTopic?.id === topic.id ? 'bg-fastr-primary/10' : ''
                          }`}
                        >
                          <div className="text-sm text-gray-700">{topic.title}</div>
                          <div className="text-xs text-gray-400">{topic.slideCount} slides</div>
                        </button>
                      ))}
                    </>
                  )}
                  {/* Fallback if no separated topics */}
                  {!module.fullTopics?.length && !module.condensedTopics?.length && module.topics.map((topic: any) => (
                    <button
                      key={topic.id}
                      onClick={() => loadPreview(topic)}
                      className={`w-full text-left px-4 py-2 pl-10 hover:bg-gray-100 transition-colors ${
                        previewTopic?.id === topic.id ? 'bg-fastr-primary/10' : ''
                      }`}
                    >
                      <div className="text-sm text-gray-700">{topic.title}</div>
                      <div className="text-xs text-gray-400">{topic.slideCount} slides</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Preview area */}
        <div className="flex-1 bg-gray-800 flex flex-col p-6 overflow-hidden">
          {isLoadingPreview ? (
            <div className="flex-1 flex items-center justify-center text-white/70">
              <div>
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>Loading preview...</p>
              </div>
            </div>
          ) : previewHtml ? (
            <>
              {/* Slide preview - fixed height, always visible */}
              <div className="flex-shrink-0 flex flex-col items-center">
                {/* Slide count indicator */}
                {previewTopic?.slideCount > 1 && (
                  <div className="mb-3 flex items-center justify-center gap-2 text-white/80 bg-white/10 rounded-full py-2 px-4 w-fit">
                    <span className="text-sm font-medium">{previewTopic.slideCount} slides</span>
                    <span className="text-white/50">•</span>
                    <span className="text-sm flex items-center gap-1">
                      <span>Scroll in preview to view all</span>
                      <ChevronDown className="w-4 h-4 animate-bounce" />
                    </span>
                  </div>
                )}
                <div className="w-full max-w-5xl">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      srcDoc={previewHtml}
                      className="absolute inset-0 w-full h-full bg-white rounded-lg shadow-2xl"
                      title="Slide Preview"
                    />
                    {/* Scroll fade indicator at bottom */}
                    {previewTopic?.slideCount > 1 && (
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-800/80 to-transparent rounded-b-lg pointer-events-none flex items-end justify-center pb-1">
                        <div className="flex items-center gap-1 text-white/70 text-xs">
                          <ChevronDown className="w-3 h-3" />
                          <span>More slides below</span>
                          <ChevronDown className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-white font-medium">{previewTopic?.title}</p>
                  {previewTopic?.slideCount === 1 && (
                    <p className="text-white/60 text-sm">1 slide</p>
                  )}
                </div>
              </div>

              {/* Presenter Notes - scrollable section below */}
              {presenterNotes.length > 0 && (
                <div className="mt-4 flex-1 min-h-0 max-w-4xl mx-auto w-full">
                  <div className="bg-gray-900 rounded-lg p-4 text-left h-full overflow-y-auto max-h-48">
                    <h4 className="text-amber-400 text-sm font-semibold mb-2">
                      Presenter Notes
                    </h4>
                    {presenterNotes.map((note, i) => (
                      <div key={i} className="text-white/80 text-sm whitespace-pre-wrap mb-2">
                        {note.replace(/^PRESENTER NOTES:\s*/i, '')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-gray-500">
              <div>
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg text-white/70">Click on a slide to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick Export Mode Component - Select slides for quick presentation
// ─────────────────────────────────────────────────────────────────────────────
function QuickExportMode({ onBack }: { onBack: () => void }) {
  const { contentLibrary, loadContentLibrary } = useWorkshopStore()
  const [selectedSlides, setSelectedSlides] = useState<Array<{ module: any; topic: any }>>([])
  const [selectedTemplates, setSelectedTemplates] = useState<Array<{ id: string; name: string; file: string }>>([])
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [expandedTemplateCategories, setExpandedTemplateCategories] = useState<Set<string>>(new Set(['breaks']))
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'pptx' | null>(null)
  const [previewTopic, setPreviewTopic] = useState<any | null>(null)
  const [previewHtml, setPreviewHtml] = useState<string | null>(null)
  const [presenterNotes, setPresenterNotes] = useState<string[]>([])
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [templates, setTemplates] = useState<any[]>([])

  // Cache for rendered previews - persists across re-renders
  const previewCache = useRef<Map<string, { html: string; notes: string[] }>>(new Map())

  useEffect(() => {
    if (contentLibrary.length === 0) {
      loadContentLibrary()
    }
  }, [contentLibrary.length, loadContentLibrary])

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/content/templates', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          setTemplates(data)
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err)
      }
    }
    fetchTemplates()
  }, [])

  const toggleTemplateCategory = (categoryId: string) => {
    const next = new Set(expandedTemplateCategories)
    if (next.has(categoryId)) {
      next.delete(categoryId)
    } else {
      next.add(categoryId)
    }
    setExpandedTemplateCategories(next)
  }

  const toggleTemplate = (template: any) => {
    const exists = selectedTemplates.find(t => t.id === template.id)
    if (exists) {
      setSelectedTemplates(selectedTemplates.filter(t => t.id !== template.id))
    } else {
      setSelectedTemplates([...selectedTemplates, { id: template.id, name: template.name, file: template.file }])
    }
  }

  const isTemplateSelected = (templateId: string) => selectedTemplates.some(t => t.id === templateId)

  const loadTemplatePreview = async (template: any) => {
    setPreviewTopic({ id: template.id, title: template.name, slideCount: 1 })

    // Check cache first
    const cached = previewCache.current.get(template.id)
    if (cached) {
      setPreviewHtml(cached.html)
      setPresenterNotes(cached.notes)
      return
    }

    setPreviewHtml(null)
    setIsLoadingPreview(true)
    setPresenterNotes([])

    try {
      // Fetch template content
      const response = await fetch(`/api/content/templates/${template.id}`, { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        // Render to HTML
        const renderResponse = await fetch('/api/content/render', {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown: data.content })
        })
        if (renderResponse.ok) {
          const renderData = await renderResponse.json()
          previewCache.current.set(template.id, {
            html: renderData.html,
            notes: renderData.presenterNotes || []
          })
          setPreviewHtml(renderData.html)
          setPresenterNotes(renderData.presenterNotes || [])
        }
      }
    } catch (err) {
      console.error('Failed to load template preview:', err)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const toggleModule = (moduleId: string) => {
    const next = new Set(expandedModules)
    if (next.has(moduleId)) {
      next.delete(moduleId)
    } else {
      next.add(moduleId)
    }
    setExpandedModules(next)
  }

  const toggleTopic = (module: any, topic: any) => {
    const exists = selectedSlides.find(s => s.topic.id === topic.id)
    if (exists) {
      setSelectedSlides(selectedSlides.filter(s => s.topic.id !== topic.id))
    } else {
      setSelectedSlides([...selectedSlides, { module, topic }])
    }
  }

  const isSelected = (topicId: string) => selectedSlides.some(s => s.topic.id === topicId)

  // Check if all topics in a module are selected
  const isModuleFullySelected = (module: any) => {
    return module.topics.every((topic: any) => isSelected(topic.id))
  }

  // Check if some (but not all) topics in a module are selected
  const isModulePartiallySelected = (module: any) => {
    const selectedCount = module.topics.filter((topic: any) => isSelected(topic.id)).length
    return selectedCount > 0 && selectedCount < module.topics.length
  }

  // Toggle all topics in a module
  const toggleModuleAllTopics = (module: any) => {
    const allSelected = isModuleFullySelected(module)
    if (allSelected) {
      const moduleTopicIds = new Set(module.topics.map((t: any) => t.id))
      setSelectedSlides(selectedSlides.filter(s => !moduleTopicIds.has(s.topic.id)))
    } else {
      const newSelections = module.topics
        .filter((topic: any) => !isSelected(topic.id))
        .map((topic: any) => ({ module, topic }))
      setSelectedSlides([...selectedSlides, ...newSelections])
    }
  }

  const loadPreview = async (topic: any) => {
    setPreviewTopic(topic)

    // Check cache first - instant if already rendered
    const cached = previewCache.current.get(topic.id)
    if (cached) {
      setPreviewHtml(cached.html)
      setPresenterNotes(cached.notes)
      return
    }

    setPreviewHtml(null)  // Clear old preview immediately
    setIsLoadingPreview(true)
    setPresenterNotes([])
    try {
      const response = await fetch(`/api/content/topic/${topic.id}`, { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        const renderResponse = await fetch('/api/content/render', { credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown: data.content })
        })
        if (renderResponse.ok) {
          const renderData = await renderResponse.json()
          // Cache the result
          previewCache.current.set(topic.id, {
            html: renderData.html,
            notes: renderData.presenterNotes || []
          })
          setPreviewHtml(renderData.html)
          setPresenterNotes(renderData.presenterNotes || [])
        }
      }
    } catch (err) {
      console.error('Failed to load preview:', err)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const exportSelection = async (format: 'pdf' | 'pptx') => {
    if (selectedSlides.length === 0 && selectedTemplates.length === 0) return
    setIsExporting(true)
    setExportFormat(format)

    try {
      const topicIds = selectedSlides.map(s => s.topic.id)
      const templateFiles = selectedTemplates.map(t => t.file).filter(Boolean)
      const response = await fetch('/api/content/export/selection', { credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicIds, templateFiles, format, title: 'Quick Export' })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank')
        }
      } else {
        alert('Export failed. Please try again.')
      }
    } catch (err) {
      console.error('Export failed:', err)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
      setExportFormat(null)
    }
  }

  const totalSlides = selectedSlides.reduce((sum, s) => sum + s.topic.slideCount, 0) + selectedTemplates.length

  if (contentLibrary.length === 0) {
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          <p>Loading content library...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Quick Export</h1>
        <span className="text-sm text-gray-500">Select slides and export to PPTX or PDF</span>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Topic picker */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Select Content</h2>
            <p className="text-sm text-gray-500 mt-1">Check to select, click name to preview</p>
          </div>
          <div className="flex-1 overflow-auto">
            {/* Templates Section - exclude 'custom' category */}
            {templates.filter((c: any) => c.id !== 'custom').length > 0 && (
              <div className="border-b border-gray-200">
                <div className="px-4 py-2 bg-amber-50 text-xs font-semibold text-amber-800 uppercase tracking-wide">
                  Templates
                </div>
                {templates.filter((c: any) => c.id !== 'custom').map((category: any) => (
                  <div key={category.id} className="border-b border-gray-100">
                    <button
                      onClick={() => toggleTemplateCategory(category.id)}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      {expandedTemplateCategories.has(category.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-700 text-sm">{category.name}</div>
                        <div className="text-xs text-gray-400">{category.description}</div>
                      </div>
                    </button>
                    {expandedTemplateCategories.has(category.id) && (
                      <div className="bg-gray-50">
                        {category.templates.map((template: any) => (
                          <div
                            key={template.id}
                            className={`flex items-center gap-2 px-4 py-2 pl-8 hover:bg-gray-100 transition-colors ${
                              previewTopic?.id === template.id ? 'bg-amber-100' : ''
                            }`}
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleTemplate(template) }}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isTemplateSelected(template.id)
                                  ? 'bg-amber-500 border-amber-500'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {isTemplateSelected(template.id) && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <button
                              onClick={() => loadTemplatePreview(template)}
                              className="flex-1 min-w-0 text-left"
                            >
                              <div className="text-sm text-gray-700">{template.name}</div>
                              {template.preview && (
                                <div className="text-xs text-gray-400 truncate">{template.preview}</div>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Modules Section */}
            <div className="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-200">
              Modules
            </div>
            {contentLibrary.map((module: any) => (
              <div key={module.id} className="border-b border-gray-100">
                <div className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors">
                  {/* Module select all checkbox */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleModuleAllTopics(module) }}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      isModuleFullySelected(module)
                        ? 'bg-fastr-primary border-fastr-primary'
                        : isModulePartiallySelected(module)
                          ? 'bg-fastr-primary/50 border-fastr-primary'
                          : 'border-gray-300 hover:border-gray-400'
                    }`}
                    title="Select all topics in this module"
                  >
                    {isModuleFullySelected(module) && <Check className="w-3 h-3 text-white" />}
                    {isModulePartiallySelected(module) && <Minus className="w-3 h-3 text-white" />}
                  </button>
                  {/* Module expand/collapse */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="flex-1 flex items-center gap-2 text-left"
                  >
                    {expandedModules.has(module.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">M{module.number}: {module.name}</div>
                      <div className="text-xs text-gray-500">{module.totalSlides} slides</div>
                    </div>
                  </button>
                </div>

                {expandedModules.has(module.id) && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {/* Full slides */}
                    {module.fullTopics?.length > 0 && (
                      <>
                        <div className="px-4 py-1.5 pl-8 text-xs font-medium text-gray-500 bg-gray-100 border-b border-gray-200">
                          Full ({module.fullSlides} slides)
                        </div>
                        {module.fullTopics.map((topic: any) => (
                          <div
                            key={topic.id}
                            className={`flex items-center gap-2 px-4 py-2 pl-10 hover:bg-gray-100 transition-colors ${
                              previewTopic?.id === topic.id ? 'bg-fastr-primary/10' : ''
                            }`}
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleTopic(module, topic) }}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected(topic.id)
                                  ? 'bg-fastr-primary border-fastr-primary'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {isSelected(topic.id) && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <button
                              onClick={() => loadPreview(topic)}
                              className="flex-1 min-w-0 text-left"
                            >
                              <div className="text-sm text-gray-700 truncate">{topic.title}</div>
                              <div className="text-xs text-gray-400">{topic.slideCount} slides</div>
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                    {/* Condensed slides */}
                    {module.condensedTopics?.length > 0 && (
                      <>
                        <div className="px-4 py-1.5 pl-8 text-xs font-medium text-amber-700 bg-amber-50 border-b border-amber-200">
                          Condensed ({module.condensedSlides} slides)
                        </div>
                        {module.condensedTopics.map((topic: any) => (
                          <div
                            key={topic.id}
                            className={`flex items-center gap-2 px-4 py-2 pl-10 hover:bg-amber-50 transition-colors ${
                              previewTopic?.id === topic.id ? 'bg-fastr-primary/10' : ''
                            }`}
                          >
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleTopic(module, topic) }}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected(topic.id)
                                  ? 'bg-fastr-primary border-fastr-primary'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {isSelected(topic.id) && <Check className="w-3 h-3 text-white" />}
                            </button>
                            <button
                              onClick={() => loadPreview(topic)}
                              className="flex-1 min-w-0 text-left"
                            >
                              <div className="text-sm text-gray-700 truncate">{topic.title}</div>
                              <div className="text-xs text-gray-400">{topic.slideCount} slides</div>
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                    {/* Fallback if no separated topics */}
                    {!module.fullTopics?.length && !module.condensedTopics?.length && module.topics.map((topic: any) => (
                      <div
                        key={topic.id}
                        className={`flex items-center gap-2 px-4 py-2 pl-8 hover:bg-gray-100 transition-colors ${
                          previewTopic?.id === topic.id ? 'bg-fastr-primary/10' : ''
                        }`}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleTopic(module, topic) }}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected(topic.id)
                              ? 'bg-fastr-primary border-fastr-primary'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {isSelected(topic.id) && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <button
                          onClick={() => loadPreview(topic)}
                          className="flex-1 min-w-0 text-left"
                        >
                          <div className="text-sm text-gray-700 truncate">{topic.title}</div>
                          <div className="text-xs text-gray-400">{topic.slideCount} slides</div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Slide preview area */}
        <div className="flex-1 bg-gray-800 flex flex-col p-6 overflow-hidden">
          {isLoadingPreview ? (
            <div className="flex-1 flex items-center justify-center text-white/70">
              <div>
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>Loading preview...</p>
              </div>
            </div>
          ) : previewHtml ? (
            <>
              {/* Slide preview - fixed height, always visible */}
              <div className="flex-shrink-0 flex flex-col items-center">
                {/* Slide count indicator */}
                {previewTopic?.slideCount > 1 && (
                  <div className="mb-3 flex items-center justify-center gap-2 text-white/80 bg-white/10 rounded-full py-2 px-4 w-fit">
                    <span className="text-sm font-medium">{previewTopic.slideCount} slides</span>
                    <span className="text-white/50">•</span>
                    <span className="text-sm flex items-center gap-1">
                      <span>Scroll in preview to view all</span>
                      <ChevronDown className="w-4 h-4 animate-bounce" />
                    </span>
                  </div>
                )}
                <div className="w-full max-w-5xl">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      srcDoc={previewHtml}
                      className="absolute inset-0 w-full h-full bg-white rounded-lg shadow-2xl"
                      title="Slide Preview"
                    />
                    {/* Scroll fade indicator at bottom */}
                    {previewTopic?.slideCount > 1 && (
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-800/80 to-transparent rounded-b-lg pointer-events-none flex items-end justify-center pb-1">
                        <div className="flex items-center gap-1 text-white/70 text-xs">
                          <ChevronDown className="w-3 h-3" />
                          <span>More slides below</span>
                          <ChevronDown className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-white font-medium">{previewTopic?.title}</p>
                  {previewTopic?.slideCount === 1 && (
                    <p className="text-white/60 text-sm">1 slide</p>
                  )}
                </div>
              </div>

              {/* Presenter Notes - scrollable section below */}
              {presenterNotes.length > 0 && (
                <div className="mt-4 flex-1 min-h-0 max-w-3xl mx-auto w-full">
                  <div className="bg-gray-900 rounded-lg p-4 text-left h-full overflow-y-auto max-h-40">
                    <h4 className="text-amber-400 text-sm font-semibold mb-2">
                      Presenter Notes
                    </h4>
                    {presenterNotes.map((note, i) => (
                      <div key={i} className="text-white/80 text-sm whitespace-pre-wrap mb-2">
                        {note.replace(/^PRESENTER NOTES:\s*/i, '')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-gray-500">
              <div>
                <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg text-white/70">Click on a slide to preview</p>
                <p className="text-sm mt-2 text-white/50">Check the box to add it to your selection</p>
              </div>
            </div>
          )}
        </div>

        {/* Selection sidebar */}
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">Your Selection</h3>
              {selectedSlides.length > 0 && (
                <button
                  onClick={() => setSelectedSlides([])}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {selectedSlides.length} topic{selectedSlides.length !== 1 ? 's' : ''} • {totalSlides} slides
            </p>
          </div>

          <div className="flex-1 overflow-auto p-2">
            {selectedSlides.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm text-center p-4">
                <p>Select topics from the library to build your presentation</p>
              </div>
            ) : (
              <div className="space-y-1">
                {selectedSlides.map((item, idx) => (
                  <div
                    key={item.topic.id}
                    onClick={() => loadPreview(item.topic)}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      previewTopic?.id === item.topic.id
                        ? 'bg-fastr-primary/10 border border-fastr-primary/30'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <span className="w-5 h-5 bg-fastr-primary text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800 truncate">{item.topic.title}</div>
                      <div className="text-xs text-gray-400">{item.topic.slideCount} slides</div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleTopic(item.module, item.topic) }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export buttons */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <button
              onClick={() => exportSelection('pptx')}
              disabled={selectedSlides.length === 0 || isExporting}
              className="w-full px-4 py-2.5 bg-fastr-primary text-white text-sm font-medium rounded-lg hover:bg-fastr-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isExporting && exportFormat === 'pptx' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export PPTX
                </>
              )}
            </button>
            <button
              onClick={() => exportSelection('pdf')}
              disabled={selectedSlides.length === 0 || isExporting}
              className="w-full px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isExporting && exportFormat === 'pdf' ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export PDF
                </>
              )}
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
    contentLibrary,
    addSession,
    selectWorkshop,
    error,
    setError,
    saveStatus,
  } = useWorkshopStore()

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/status', { credentials: 'include' })
        const data = await res.json()
        setIsAuthenticated(data.authenticated)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [])

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setLoginError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: loginPassword }),
      })
      if (res.ok) {
        setIsAuthenticated(true)
        setLoginPassword('')
      } else {
        setLoginError('Invalid password')
      }
    } catch {
      setLoginError('Failed to connect')
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // Ignore
    }
    setIsAuthenticated(false)
  }

  // App mode - starts with mode selector
  const [appMode, setAppMode] = useState<AppMode>('select')
  const [expandedCountries, setExpandedCountries] = useState<Set<string>>(new Set())

  const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [leftPanelPinned, setLeftPanelPinned] = useState(false)
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
  const [addSessionMenuDay, setAddSessionMenuDay] = useState<number | null>(null)
  const [_activeId, setActiveId] = useState<string | null>(null)
  const [showCreateWorkshop, setShowCreateWorkshop] = useState(false)
  const [createMode, setCreateMode] = useState<'manual' | 'ai'>('manual')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
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
  const { reorderSession, updateSession, removeSession, moveSessionToDay, createWorkshop, deleteWorkshop, setWorkshopLocked, updateWorkshopSettings } = useWorkshopStore()

  // Load data only after authentication
  useEffect(() => {
    if (isAuthenticated) {
      loadWorkshops()
      loadContentLibrary()
    }
  }, [isAuthenticated])

  // Show workshop selector if no workshop is selected (only in workshop mode)
  useEffect(() => {
    if (appMode === 'workshop' && !currentWorkshopId && workshops.length > 0) {
      setShowWorkshopSelector(true)
    }
  }, [currentWorkshopId, workshops, appMode])

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

  // Handle AI workshop generation - creates workshop directly
  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError('Please describe what kind of workshop you need')
      return
    }

    setAiGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-workshop', { credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      })

      if (!response.ok) throw new Error('Failed to generate workshop')

      const data = await response.json()

      // Generate workshop ID
      const year = new Date().getFullYear()
      const countrySlug = (data.country || 'workshop').toLowerCase().replace(/\s+/g, '-')
      const workshopId = `${year}-${countrySlug}`

      // Build the schedule from AI-generated data
      const ts = Date.now()
      const schedule: any = {
        days: data.days || 3,
        day_titles: {},
        day_start_times: {},
      }

      // Process AI-generated schedule or create default structure
      const startTime = data.day_start_time || '09:00'
      for (let d = 1; d <= (data.days || 3); d++) {
        schedule.day_start_times[d] = startTime
        schedule.day_titles[d] = ''

        const aiDaySessions = data.schedule?.[`day${d}`] || []
        const sessions: any[] = []
        let sessionNum = 1

        if (d === 1) {
          // Day 1 always starts with required opening sequence
          sessions.push(
            { _id: `title-${ts}`, session: data.name || 'FASTR Workshop', type: 'day_title', slides: ['title_slide.md'], duration: 0 },
            { _id: `welcome-${ts}`, session: 'Welcome and Opening Remarks', slides: ['welcome_slide.md'], duration: 10 },
            { _id: `intro-${ts}`, session: 'Introductions', slides: ['introductions_slide.md'], duration: 15 },
            { _id: `agenda1-${ts}`, session: 'Day 1 Agenda', type: 'section', duration: 5 },
            { _id: `obj-${ts}`, session: 'Workshop Objectives', slides: ['objectives_slide.md'], duration: 5 },
            { _id: `exp-${ts}`, session: 'Expectations', slides: ['expectations_slide.md'], duration: 15 },
            { _id: `outputs-${ts}`, session: 'Expected Outputs', slides: ['expected_outputs_slide.md'], duration: 5 }
          )
        } else {
          // Day 2+ starts with day cover, recap of previous day, then agenda
          sessions.push(
            { _id: `daytitle-${d}-${ts}`, session: `Day ${d}`, type: 'day_title', slides: ['day_title.md'], duration: 0 },
            { _id: `recap-${d}-${ts}`, session: `Recap: Day ${d - 1}`, type: 'day_recap', duration: 10 },
            { _id: `agenda-${d}-${ts}`, session: `Day ${d} Agenda`, type: 'section', duration: 5 }
          )
        }

        // Add AI-generated sessions (modules and breaks)
        for (const aiSession of aiDaySessions) {
          if (aiSession.module) {
            sessions.push({
              _id: `session-${d}-${sessionNum++}-${ts}`,
              session: aiSession.session,
              module: aiSession.module,
              duration: aiSession.duration || 60,
            })
          } else if (aiSession.type === 'break') {
            sessions.push({
              _id: `break-${d}-${sessionNum++}-${ts}`,
              session: aiSession.session,
              type: 'break',
              duration: aiSession.duration || 15,
            })
          }
        }

        // End each day
        sessions.push({
          _id: `dayend-${d}-${ts}`,
          session: `End of Day ${d}`,
          type: 'day_end',
          slides: ['day_end.md'],
          duration: 5,
        })

        schedule[`day${d}`] = sessions
      }

      // Create full config
      const config = {
        workshop: {
          name: data.name || 'FASTR Workshop',
          country: data.country || '',
          location: data.location || '',
          date: '',
          facilitators: '',
          objectives: data.objectives || '',
          expected_outputs: data.expected_outputs || '',
        },
        schedule,
        content: {
          modules: data.modules || [],
          custom_slides: [],
        },
      }

      // Create the workshop directly
      await createWorkshop(workshopId, config)
      setShowCreateWorkshop(false)
      setShowWorkshopSelector(false)
      setAiPrompt('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setAiGenerating(false)
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
    const ts = Date.now()
    for (let d = 1; d <= newWorkshop.days; d++) {
      schedule.day_start_times[d] = '09:00'
      schedule.day_titles[d] = ''

      if (d === 1) {
        // Day 1 has required opening sequence
        schedule[`day${d}`] = [
          {
            _id: `title-slide-${ts}`,
            session: newWorkshop.name || 'FASTR Workshop',
            type: 'day_title',
            slides: ['title_slide.md'],
            duration: 0,
            icon: 'cover',
          },
          {
            _id: `welcome-${ts}`,
            session: 'Welcome and Opening Remarks',
            slides: ['welcome_slide.md'],
            duration: 10,
            icon: 'welcome',
          },
          {
            _id: `introductions-${ts}`,
            session: 'Introductions',
            slides: ['introductions_slide.md'],
            duration: 15,
            icon: 'people',
          },
          {
            _id: `day-agenda-1-${ts}`,
            session: 'Day 1 Agenda',
            type: 'section',
            duration: 5,
            icon: 'list',
          },
          {
            _id: `objectives-${ts}`,
            session: 'Workshop Objectives',
            slides: ['objectives_slide.md'],
            duration: 10,
            icon: 'target',
          },
          {
            _id: `expectations-${ts}`,
            session: 'Expectations',
            slides: ['expectations_slide.md'],
            duration: 10,
            icon: 'clipboard',
          },
          {
            _id: `expected-outputs-${ts}`,
            session: 'Expected Outputs',
            slides: ['expected_outputs_slide.md'],
            duration: 10,
            icon: 'output',
          },
          {
            _id: `session-1-${ts}`,
            session: 'Session 1',
            duration: 60,
            icon: 'presentation',
          },
          {
            _id: `break-tea-morning-1-${ts}`,
            session: 'Tea Break',
            type: 'break',
            duration: 15,
          },
          {
            _id: `lunch-1-${ts}`,
            session: 'Lunch Break',
            type: 'break',
            duration: 60,
          },
          {
            _id: `day-end-1-${ts}`,
            session: 'End of Day 1',
            type: 'day_end',
            slides: ['day_end.md'],
            duration: 5,
          },
        ]
      } else {
        // Day 2+ has recap and standard structure
        schedule[`day${d}`] = [
          {
            _id: `day-title-${d}-${ts}`,
            session: `Day ${d}`,
            type: 'day_title',
            slides: ['day_title.md'],
            duration: 0,
          },
          {
            _id: `day-recap-${d}-${ts}`,
            session: `Recap: Day ${d - 1}`,
            type: 'day_recap',
            duration: 10,
          },
          {
            _id: `day-agenda-${d}-${ts}`,
            session: `Day ${d} Agenda`,
            type: 'section',
            duration: 5,
          },
          {
            _id: `session-${d}-1-${ts}`,
            session: 'Session 1',
            duration: 60,
            icon: 'presentation',
          },
          {
            _id: `break-tea-morning-${d}-${ts}`,
            session: 'Tea Break',
            type: 'break',
            duration: 15,
          },
          {
            _id: `lunch-${d}-${ts}`,
            session: 'Lunch Break',
            type: 'break',
            duration: 60,
          },
          {
            _id: `day-end-${d}-${ts}`,
            session: `End of Day ${d}`,
            type: 'day_end',
            slides: ['day_end.md'],
            duration: 5,
          },
        ]
      }
    }

    // Check for AI-generated content
    const aiObjectives = sessionStorage.getItem('ai_objectives')
    const aiExpectedOutputs = sessionStorage.getItem('ai_expected_outputs')
    sessionStorage.removeItem('ai_objectives')
    sessionStorage.removeItem('ai_expected_outputs')

    const config = {
      workshop: {
        name: newWorkshop.name,
        country: newWorkshop.country,
        location: newWorkshop.location,
        date: '',
        facilitators: '',
        objectives: aiObjectives || '',
        expected_outputs: aiExpectedOutputs || '',
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
        await fetch(`/api/export/${currentWorkshopId}/html`, { method: 'POST', credentials: 'include' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/html`
      } else if (format === 'pdf') {
        await fetch(`/api/export/${currentWorkshopId}/pdf`, { method: 'POST', credentials: 'include' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/pdf`
      } else if (format === 'pptx') {
        await fetch(`/api/export/${currentWorkshopId}/pptx`, { method: 'POST', credentials: 'include' })
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

  // ─────────────────────────────────────────────────────────────────────────
  // Auth Loading State
  // ─────────────────────────────────────────────────────────────────────────
  if (isCheckingAuth) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-fastr-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Login Page
  // ─────────────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-fastr-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-fastr-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">FASTR Deck Builder</h1>
            <p className="text-gray-600">Enter the team password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Team Password
              </label>
              <input
                type="password"
                id="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary/20 focus:border-fastr-primary transition-colors"
                placeholder="Enter password"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !loginPassword}
              className="w-full py-3 bg-fastr-primary text-white rounded-lg font-medium hover:bg-fastr-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Landing Page / Mode Selector
  // ─────────────────────────────────────────────────────────────────────────
  if (appMode === 'select') {
    // Group workshops by country
    const workshopsByCountry: Record<string, typeof workshops> = {}
    workshops.forEach(w => {
      const country = w.country || 'Other'
      if (!workshopsByCountry[country]) workshopsByCountry[country] = []
      workshopsByCountry[country].push(w)
    })
    const countries = Object.keys(workshopsByCountry).sort()

    const toggleCountry = (country: string) => {
      const next = new Set(expandedCountries)
      if (next.has(country)) {
        next.delete(country)
      } else {
        next.add(country)
      }
      setExpandedCountries(next)
    }

    return (
      <div className="h-screen bg-gray-50 flex flex-col">
        {/* Top bar with logout */}
        <div className="flex justify-end p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-5xl">
            {/* Logo/Title */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">FASTR Deck Builder</h1>
              <p className="text-gray-600">Build and manage workshop presentations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Build Slide Deck */}
              <button
                onClick={() => setAppMode('workshop')}
              className="group bg-white hover:bg-gray-50 rounded-2xl p-6 text-left transition-all hover:scale-105 border border-gray-200 hover:border-fastr-primary/30 shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-fastr-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-fastr-primary/20 transition-colors">
                <Presentation className="w-6 h-6 text-fastr-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Build Slide Deck</h2>
              <p className="text-gray-600 text-sm">
                Build a complete slide deck for a workshop or training event
              </p>
            </button>

            {/* Quick Export */}
            <button
              onClick={() => setAppMode('quick')}
              className="group bg-white hover:bg-gray-50 rounded-2xl p-6 text-left transition-all hover:scale-105 border border-gray-200 hover:border-fastr-secondary/30 shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-fastr-secondary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-fastr-secondary/20 transition-colors">
                <Zap className="w-6 h-6 text-fastr-secondary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Export</h2>
              <p className="text-gray-600 text-sm">
                Select slides from the library and export to PPTX or PDF
              </p>
            </button>

            {/* Browse Library */}
            <button
              onClick={() => setAppMode('library')}
              className="group bg-white hover:bg-gray-50 rounded-2xl p-6 text-left transition-all hover:scale-105 border border-gray-200 hover:border-amber-500/30 shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Library className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Browse Library</h2>
              <p className="text-gray-600 text-sm">
                Explore and preview slides from the content library
              </p>
            </button>
          </div>

          {/* Existing Decks */}
          {workshops.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Decks</h3>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {countries.map(country => (
                  <div key={country} className="border-b border-gray-100 last:border-b-0">
                    <button
                      onClick={() => toggleCountry(country)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      {expandedCountries.has(country) ? (
                        <FolderOpen className="w-5 h-5 text-fastr-primary" />
                      ) : (
                        <Folder className="w-5 h-5 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-800">{country}</span>
                      <span className="text-sm text-gray-500">({workshopsByCountry[country].length})</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${expandedCountries.has(country) ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedCountries.has(country) && (
                      <div className="bg-gray-50 border-t border-gray-100">
                        {workshopsByCountry[country].map(workshop => (
                          <button
                            key={workshop.id}
                            onClick={() => {
                              selectWorkshop(workshop.id)
                              setAppMode('workshop')
                            }}
                            className="w-full px-4 py-2 pl-12 flex items-center gap-3 hover:bg-gray-100 transition-colors text-left"
                          >
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{workshop.name}</span>
                            {workshop.locked && <Lock className="w-3 h-3 text-amber-500 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Library Mode
  // ─────────────────────────────────────────────────────────────────────────
  if (appMode === 'library') {
    return <LibraryMode onBack={() => setAppMode('select')} />
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Quick Export Mode
  // ─────────────────────────────────────────────────────────────────────────
  if (appMode === 'quick') {
    return <QuickExportMode onBack={() => setAppMode('select')} />
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Workshop Mode (default)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header / Toolbar */}
      <header className="bg-fastr-primary text-white px-4 py-2 flex items-center justify-between shadow-md z-20">
        {/* Back button */}
        <button
          onClick={() => setAppMode('select')}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors mr-2"
          title="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
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
            onClick={() => {
              if (leftPanelPinned) {
                // If pinned, unpin and close
                setLeftPanelPinned(false)
                setLeftPanelOpen(false)
              } else {
                // Toggle open/close
                setLeftPanelOpen(!leftPanelOpen)
              }
            }}
            className={`p-2 rounded-md transition-colors ${
              leftPanelOpen || leftPanelPinned ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
            }`}
            title={leftPanelPinned ? 'Unpin Content Library' : 'Content Library'}
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
        {/* Left Panel - Content Library (pinned or slide-out) */}
        {leftPanelPinned ? (
          // Pinned mode - part of flex layout
          <div className="h-full w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Content Library</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLeftPanelPinned(false)}
                  className="p-1 text-fastr-primary hover:bg-fastr-primary/10 rounded"
                  title="Unpin panel"
                >
                  <PinOff className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setLeftPanelPinned(false)
                    setLeftPanelOpen(false)
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  title="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <ContentLibrary />
            </div>
          </div>
        ) : (
          // Slide-out mode - absolute positioned overlay
          <div
            className={`absolute left-0 top-0 bottom-0 z-10 transition-transform duration-300 ease-in-out ${
              leftPanelOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="h-full w-80 bg-white border-r border-gray-200 shadow-lg flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <span className="font-medium text-gray-700">Content Library</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setLeftPanelPinned(true)
                      setLeftPanelOpen(true)
                    }}
                    className="p-1 text-gray-400 hover:text-fastr-primary hover:bg-fastr-primary/10 rounded"
                    title="Pin panel"
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLeftPanelOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    title="Close panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <ContentLibrary />
              </div>
            </div>
          </div>
        )}

        {/* Center - Main content */}
        <main className="flex-1 overflow-hidden">
          {currentWorkshopId ? (
            showPreview ? (
              <SlideSorter onBack={() => setShowPreview(false)} />
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
                          const startTimeStr = currentConfig?.schedule?.day_start_times?.[dayNum] || '09:00'

                          // Calculate cumulative times for each session
                          let currentMinutes = parseInt(startTimeStr.split(':')[0]) * 60 + parseInt(startTimeStr.split(':')[1] || '0')
                          const sessions = (currentConfig?.schedule?.[dayKey] || []).map(
                            (s: any, idx: number) => {
                              const sessionStart = currentMinutes
                              currentMinutes += (s.duration || 0)
                              const startHour = Math.floor(sessionStart / 60)
                              const startMin = sessionStart % 60
                              const endHour = Math.floor(currentMinutes / 60)
                              const endMin = currentMinutes % 60
                              return {
                                ...s,
                                _id: s._id || `${dayKey}-${idx}`,
                                _startTime: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
                                _endTime: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
                              }
                            }
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
                                  onClick={() => setAddSessionMenuDay(dayNum)}
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
        {rightPanelOpen && (
          <div className="absolute right-0 top-0 bottom-0 z-20">
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
        )}
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
              <div className="p-4">
                {/* Mode toggle */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-4">
                  <button
                    onClick={() => setCreateMode('ai')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      createMode === 'ai'
                        ? 'bg-white text-fastr-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Setup
                  </button>
                  <button
                    onClick={() => setCreateMode('manual')}
                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      createMode === 'manual'
                        ? 'bg-white text-fastr-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Manual
                  </button>
                </div>

                {createMode === 'ai' ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Describe your workshop and AI will set it up for you.
                    </p>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="Example: First FASTR workshop in Kenya, 3 days. Focus on data quality and coverage estimation. Use high-level introductory content (shorter versions where available). This is a refresher for teams who attended last year's training."
                      disabled={aiGenerating}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowCreateWorkshop(false)
                          setAiPrompt('')
                        }}
                        className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={aiGenerating}
                      >
                        Back
                      </button>
                      <button
                        onClick={handleAIGenerate}
                        disabled={aiGenerating || !aiPrompt.trim()}
                        className="flex-1 px-4 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {aiGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Generate Workshop
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                )}
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
                        <div
                          key={workshop.id}
                          className={`group flex items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                            currentWorkshopId === workshop.id
                              ? 'bg-fastr-primary/10 border-fastr-primary'
                              : 'hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          {/* Lock indicator */}
                          {workshop.locked && (
                            <span title="Locked">
                              <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                            </span>
                          )}
                          <button
                            onClick={() => {
                              selectWorkshop(workshop.id)
                              setShowWorkshopSelector(false)
                            }}
                            className="flex-1 text-left"
                          >
                            <div className="font-medium">{workshop.name}</div>
                            <div className="text-sm text-gray-500">
                              {workshop.country}
                              {workshop.location && ` • ${workshop.location}`}
                            </div>
                          </button>
                          {/* Lock/Unlock button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setWorkshopLocked(workshop.id, !workshop.locked)
                            }}
                            className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                              workshop.locked
                                ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            title={workshop.locked ? 'Unlock workshop' : 'Lock workshop'}
                          >
                            {workshop.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                          {/* Delete button - disabled if locked */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (workshop.locked) {
                                alert('Cannot delete a locked workshop. Unlock it first.')
                                return
                              }
                              if (confirm(`Delete "${workshop.name}"? This cannot be undone.`)) {
                                deleteWorkshop(workshop.id)
                              }
                            }}
                            className={`p-2 rounded-lg transition-all ${
                              workshop.locked
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100'
                            }`}
                            title={workshop.locked ? 'Unlock to delete' : 'Delete workshop'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                      value={currentConfig.workshop.title || currentConfig.workshop.name || ''}
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
                      value={currentConfig.workshop.subtitle || ''}
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
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={(currentConfig.workshop as any).start_date || ''}
                      onChange={(e) => updateWorkshopSettings({ start_date: e.target.value } as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={(currentConfig.workshop as any).end_date || ''}
                      onChange={(e) => updateWorkshopSettings({ end_date: e.target.value } as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
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
                  Slide Content
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  This content appears on the locked opening slides. Edit here to update what's shown.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workshop Objectives
                      <span className="ml-2 text-xs font-normal text-gray-400">→ Objectives slide</span>
                    </label>
                    <textarea
                      value={currentConfig.workshop.objectives || ''}
                      onChange={(e) => updateWorkshopSettings({ objectives: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="- Understand FASTR methodology&#10;- Learn data extraction techniques&#10;- Develop data analysis skills"
                    />
                    <p className="text-xs text-gray-500 mt-1">One objective per line (start with - for bullets)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Outputs
                      <span className="ml-2 text-xs font-normal text-gray-400">→ Expected Outputs slide</span>
                    </label>
                    <textarea
                      value={currentConfig.workshop.expected_outputs || ''}
                      onChange={(e) => updateWorkshopSettings({ expected_outputs: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fastr-primary focus:border-fastr-primary text-sm"
                      placeholder="**Analysis Activities**&#10;- Data extraction completed&#10;- First quarterly report produced&#10;&#10;**Capacity Building**&#10;- Trained team members"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use **bold** for section headers, - for bullets</p>
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
                        <div className="w-32">
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
          dayNum={editingSession.dayNum}
          totalDays={currentConfig?.schedule?.days || 1}
          onClose={() => setEditingSession(null)}
          onSave={handleSaveSession}
          onDelete={handleDeleteSession}
          onMoveToDay={(toDay) => {
            moveSessionToDay(editingSession.dayNum, editingSession.index, toDay, -1)
          }}
        />
      )}

      {/* Add Session Menu */}
      {addSessionMenuDay !== null && (
        <AddSessionMenu
          dayNum={addSessionMenuDay}
          onClose={() => setAddSessionMenuDay(null)}
          onAddSession={(session) => addSession(addSessionMenuDay, session)}
          onAddToExistingSession={(sessionIdx, topic) => {
            const dayKey = `day${addSessionMenuDay}`
            const sessions = currentConfig?.schedule?.[dayKey] || []
            const existingSession = sessions[sessionIdx]
            if (existingSession) {
              updateSession(addSessionMenuDay, sessionIdx, {
                topics: [...(existingSession.topics || []), topic.id],
                slides: [...(existingSession.slides || []), topic.file],
                duration: (existingSession.duration || 0) + (topic.duration || 30),
              })
            }
          }}
          contentLibrary={contentLibrary}
          existingSessions={
            (currentConfig?.schedule?.[`day${addSessionMenuDay}`] || [])
              .map((session: Session, index: number) => ({ index, session }))
              .filter(({ session }: { session: Session }) =>
                session.module || // Module sessions
                (!session.type && session.slides && session.slides.length > 0) // Sessions with slides
              )
          }
        />
      )}
    </div>
  )
}

export default App
