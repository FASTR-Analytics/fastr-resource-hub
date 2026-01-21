import { useState, useEffect, DragEvent } from 'react'
import { useWorkshopStore, Session } from '../stores/workshop'
import { DeckPreview } from './DeckPreview'
import { WorkshopSettings } from './WorkshopSettings'
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
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Clock,
  Trash2,
  Plus,
  Coffee,
  UtensilsCrossed,
  FileText,
  Hammer,
  Check,
  FolderOpen,
  FileCode,
  ExternalLink,
  Eye,
  LayoutTemplate,
  ListChecks,
  Sunset,
  BookOpen,
  Target,
  Globe,
  BarChart3,
  ArrowRight,
  Layers,
  Download,
  RefreshCw,
  Package,
  Settings
} from 'lucide-react'

type TabType = 'settings' | 'compose' | 'preview' | 'export'

interface OutputFile {
  name: string
  path: string
  type: 'md' | 'pdf' | 'pptx'
  modified: Date
}

export function DeckBuilder() {
  const {
    currentConfig,
    currentWorkshopId,
    contentLibrary,
    addSession,
    removeSession,
    updateSession,
    reorderSession,
    addDay,
    updateDayTitle,
    updateDayStartTime
  } = useWorkshopStore()

  const [activeTab, setActiveTab] = useState<TabType>('compose')
  const [activeDay, setActiveDay] = useState(1)
  const [dayStartTime, setDayStartTime] = useState('')
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildResult, setBuildResult] = useState<{
    success: boolean
    outputPath: string
    outputDir: string
    mdPath?: string
    htmlPath?: string | null
  } | null>(null)
  const [outputs, setOutputs] = useState<OutputFile[]>([])

  // Sync day start time from config when switching days
  useEffect(() => {
    if (currentConfig) {
      const startTime = currentConfig.schedule.day_start_times?.[activeDay] || ''
      setDayStartTime(startTime)
    }
  }, [activeDay, currentWorkshopId])

  // Load outputs when workshop changes or after build
  useEffect(() => {
    if (currentWorkshopId) {
      loadOutputs()
    }
  }, [currentWorkshopId])

  const loadOutputs = async () => {
    if (!currentWorkshopId) return
    try {
      const files = await window.electronAPI.getWorkshopOutputs(currentWorkshopId)
      setOutputs(files)
    } catch (error) {
      console.error('Error loading outputs:', error)
    }
  }

  // Open HTML preview in a new window
  const openPreview = async (htmlPath: string) => {
    try {
      await window.electronAPI.openPreviewWindow(htmlPath)
    } catch (error) {
      console.error('Error opening preview:', error)
    }
  }

  if (!currentConfig) return null

  const numDays = currentConfig.schedule.days || 1
  const dayKey = `day${activeDay}`
  const sessions: Session[] = currentConfig.schedule[dayKey] || []
  const dayTitle = currentConfig.schedule.day_titles?.[activeDay] || ''

  // Helper functions for time calculation
  const parseTime = (timeStr: string): number | null => {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/)
    if (!match) return null
    const hours = parseInt(match[1])
    const mins = parseInt(match[2])
    if (hours > 23 || mins > 59) return null
    return hours * 60 + mins
  }

  const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60) % 24
    const m = minutes % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  // Calculate times for all sessions based on day start time
  const calculateSessionTimes = (): Array<{ start: string; end: string }> => {
    const times: Array<{ start: string; end: string }> = []
    const dayStartTimeConfig = currentConfig.schedule.day_start_times?.[activeDay] || ''
    let currentTime: number | null = parseTime(dayStartTimeConfig)

    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i]
      if (session.type === 'section') {
        times.push({ start: '', end: '' })
        continue
      }

      if (currentTime !== null) {
        const duration: number = session.duration || 0
        const endTime: number = currentTime + duration
        times.push({
          start: formatTime(currentTime),
          end: formatTime(endTime)
        })
        currentTime = endTime
      } else {
        times.push({ start: '', end: '' })
      }
    }
    return times
  }

  const sessionTimes = calculateSessionTimes()

  // Handle drop from content library
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    const slideType = e.dataTransfer.getData('slideType')

    if (slideType === 'module') {
      const moduleId = e.dataTransfer.getData('moduleId')
      addSession(activeDay, {
        session: getModuleName(moduleId),
        module: moduleId,
        duration: 60,
        icon: 'module',
      })
    } else if (slideType === 'topic') {
      const topicId = e.dataTransfer.getData('topicId')
      addSession(activeDay, {
        session: getTopicTitle(topicId),
        topics: [topicId],
        duration: 30,
        icon: 'topic',
      })
    } else if (slideType === 'custom') {
      const slideFile = e.dataTransfer.getData('slideFile')
      addSession(activeDay, {
        session: slideFile.replace('.md', ''),
        slides: [slideFile],
        duration: 15,
        icon: 'custom',
      })
    } else if (slideType === 'template') {
      const templateId = e.dataTransfer.getData('templateId')

      // Day-specific templates with inline content editing
      if (templateId === 'day_recap') {
        addSession(activeDay, {
          session: `Day ${activeDay} Recap`,
          type: 'day_recap',
          duration: 10,
          icon: 'recap',
          recap_yesterday: '',
          recap_today: '',
        })
        return
      }

      if (templateId === 'day_end') {
        addSession(activeDay, {
          session: `End of Day ${activeDay}`,
          type: 'day_end',
          duration: 5,
          icon: 'sunset',
          wrapup_message: '',
        })
        return
      }

      const templateConfig: Record<string, Partial<Session>> = {
        'title': { session: 'Title Slide', slides: ['title'], duration: 5, icon: 'cover' },
        'agenda': { session: 'Agenda', slides: ['agenda'], duration: 10, icon: 'list' },
        'section': { session: 'Section', type: 'section', duration: 0, icon: 'divider' },
        'closing': { session: 'Closing', slides: ['closing.md'], duration: 5, icon: 'end' },
        'tea': { session: 'Tea Break', type: 'break', duration: 15, icon: 'coffee' },
        'lunch': { session: 'Lunch Break', type: 'break', duration: 60, icon: 'lunch' },
        'objectives': { session: 'Workshop Objectives', slides: ['01_objectives.md'], duration: 10, icon: 'target' },
        'country': { session: 'Country Overview', slides: ['02_country-overview.md'], duration: 15, icon: 'globe' },
        'priorities': { session: 'Health Priorities', slides: ['03_health-priorities.md'], duration: 15, icon: 'heart' },
        'results': { session: 'Coverage Results', slides: ['04_coverage-results.md'], duration: 15, icon: 'chart' },
        'next_steps': { session: 'Next Steps', slides: ['99_next-steps.md'], duration: 10, icon: 'arrow' },
      }
      const config = templateConfig[templateId] || { session: templateId, duration: 10 }
      addSession(activeDay, config as Session)
    }
  }

  const getModuleName = (moduleId: string) => {
    const modNum = parseInt(moduleId.replace('m', ''))
    const module = contentLibrary.find(m => m.number === modNum)
    return module?.name || moduleId
  }

  const getTopicTitle = (topicId: string) => {
    const modNumMatch = topicId.match(/^m(\d+)_/)
    if (!modNumMatch) return topicId
    const modNum = parseInt(modNumMatch[1])
    const module = contentLibrary.find(m => m.number === modNum)
    if (!module) return topicId
    const topic = module.topics?.find((t: any) => t.id === topicId)
    return topic?.title || topicId
  }

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = sessions.findIndex((s, i) => (s._id || `session-${i}`) === active.id)
      const newIndex = sessions.findIndex((s, i) => (s._id || `session-${i}`) === over.id)
      reorderSession(activeDay, oldIndex, newIndex)
    }
  }

  // Build deck
  const handleBuild = async (pdfMode: 'skip' | 'include' = 'skip') => {
    if (!currentWorkshopId) return
    setIsBuilding(true)
    setBuildResult(null)
    try {
      const result = await window.electronAPI.buildDeck(currentWorkshopId, pdfMode === 'skip')
      setBuildResult({
        success: result.success,
        outputPath: result.outputPath,
        outputDir: result.outputDir,
        mdPath: result.mdPath,
        htmlPath: result.htmlPath,
      })
      await loadOutputs()
    } catch (error: any) {
      alert(`Build failed: ${error.message}`)
    }
    setIsBuilding(false)
  }

  const handleOpenFile = async (filePath: string) => {
    try {
      await window.electronAPI.openFile(filePath)
    } catch (error) {
      console.error('Error opening file:', error)
    }
  }

  const handleShowInFolder = async (filePath: string) => {
    try {
      await window.electronAPI.showInFolder(filePath)
    } catch (error) {
      console.error('Error showing in folder:', error)
    }
  }

  // Calculate total stats
  const totalSessions = sessions.filter(s => s.type !== 'break' && s.type !== 'section').length
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header with workshop info and tabs */}
      <div className="bg-white border-b border-gray-200">
        {/* Workshop title */}
        <div className="px-4 pt-4 pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentConfig.workshop.name}
          </h2>
          <p className="text-sm text-gray-500">
            {currentConfig.workshop.location} • {currentConfig.workshop.date}
          </p>
        </div>

        {/* Tab bar */}
        <div className="px-4 flex items-center gap-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-fastr-primary text-fastr-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'compose'
                ? 'border-fastr-primary text-fastr-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            Compose
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-fastr-primary text-fastr-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-fastr-primary text-fastr-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Package className="w-4 h-4" />
            Build & Export
            {outputs.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
                {outputs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SETTINGS TAB */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <WorkshopSettings />
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* COMPOSE TAB */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'compose' && (
          <div className="h-full flex flex-col">
            {/* Day tabs and settings */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-4 mb-3">
                {/* Day tabs */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: numDays }, (_, i) => i + 1).map(day => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeDay === day
                          ? 'bg-fastr-primary text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      Day {day}
                    </button>
                  ))}
                  <button
                    onClick={addDay}
                    className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
                    title="Add day"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Start time */}
                <div className="flex items-center gap-2 ml-auto">
                  <label className="text-sm text-gray-600">Start:</label>
                  <input
                    type="text"
                    value={dayStartTime}
                    onChange={e => setDayStartTime(e.target.value)}
                    onBlur={e => updateDayStartTime(activeDay, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        updateDayStartTime(activeDay, dayStartTime)
                        e.currentTarget.blur()
                      }
                    }}
                    placeholder="09:00"
                    className="w-20 px-2 py-1 text-center font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Day title */}
              <input
                type="text"
                value={dayTitle}
                onChange={e => updateDayTitle(activeDay, e.target.value)}
                placeholder={`Day ${activeDay} theme (optional)`}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent bg-white"
              />
            </div>

            {/* Sessions list */}
            <div
              className="flex-1 overflow-y-auto p-4"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
            >
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sessions.map((s, i) => s._id || `session-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {sessions.length === 0 ? (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">Drop content here</p>
                        <p className="text-sm">Drag modules or slides from the left panel</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sessions.map((session, idx) => {
                        const sessionKey = session._id || `session-${idx}`
                        return (
                          <SortableSessionItem
                            key={sessionKey}
                            id={sessionKey}
                            session={session}
                            calculatedTime={sessionTimes[idx]}
                            onUpdate={(updates) => updateSession(activeDay, idx, updates)}
                            onRemove={() => removeSession(activeDay, idx)}
                          />
                        )
                      })}
                    </div>
                  )}
                </SortableContext>
              </DndContext>

              {/* Quick add buttons */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => addSession(activeDay, { session: 'New Session', duration: 60 })}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Session
                </button>
                <button
                  onClick={() => addSession(activeDay, { session: 'Section', type: 'section', duration: 0 })}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <LayoutTemplate className="w-4 h-4" />
                  Section
                </button>
                <button
                  onClick={() => addSession(activeDay, { session: 'Tea Break', type: 'break', duration: 15 })}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Coffee className="w-4 h-4" />
                  Tea
                </button>
                <button
                  onClick={() => addSession(activeDay, { session: 'Lunch Break', type: 'break', duration: 60 })}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  Lunch
                </button>
              </div>
            </div>

            {/* Footer stats */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
              Day {activeDay}: {totalSessions} sessions • {totalMinutes} min total
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* PREVIEW TAB */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'preview' && (
          <div className="h-full">
            <DeckPreview />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* BUILD & EXPORT TAB */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'export' && (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Build section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-fastr-primary" />
                  Build Deck
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  Generate presentation files from your workshop configuration.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleBuild('skip')}
                    disabled={isBuilding}
                    className="flex items-center gap-2 px-4 py-2.5 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 transition-colors disabled:opacity-50 font-medium"
                  >
                    {isBuilding ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Hammer className="w-4 h-4" />
                    )}
                    Build Deck
                  </button>

                  <button
                    onClick={() => handleBuild('include')}
                    disabled={isBuilding}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
                  >
                    {isBuilding ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    Build + Export PDF
                  </button>
                </div>

                {/* Build result */}
                {buildResult?.success && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Build successful!</p>
                        <p className="text-sm text-green-600">
                          {buildResult.outputPath.split('/').pop()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-green-200">
                      {buildResult.htmlPath && (
                        <button
                          onClick={() => openPreview(buildResult.htmlPath!)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenFile(buildResult.outputPath)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open
                      </button>
                      <button
                        onClick={() => handleShowInFolder(buildResult.outputPath)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm font-medium"
                      >
                        <FolderOpen className="w-4 h-4" />
                        Show in Finder
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Outputs section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-fastr-secondary" />
                  Output Files
                </h3>

                {outputs.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <FileCode className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No output files yet</p>
                    <p className="text-sm">Build your deck to generate files</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {outputs.map(file => (
                      <div
                        key={file.path}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                          file.type === 'pdf' ? 'bg-red-100 text-red-600' :
                          file.type === 'pptx' ? 'bg-orange-100 text-orange-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {file.type.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(file.modified).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenFile(file.path)}
                            className="p-2 text-gray-400 hover:text-fastr-primary hover:bg-white rounded-lg transition-colors"
                            title="Open file"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShowInFolder(file.path)}
                            className="p-2 text-gray-400 hover:text-fastr-primary hover:bg-white rounded-lg transition-colors"
                            title="Show in folder"
                          >
                            <FolderOpen className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SORTABLE SESSION ITEM
// ═══════════════════════════════════════════════════════════════════════════════

function SortableSessionItem({
  id,
  session,
  calculatedTime,
  onUpdate,
  onRemove,
}: {
  id: string
  session: Session
  calculatedTime: { start: string; end: string }
  onUpdate: (updates: Partial<Session>) => void
  onRemove: () => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isBreak = session.type === 'break'
  const isSection = session.type === 'section'

  // Get content description
  const getContentLabel = () => {
    if (session.module) return `Module: ${session.module}`
    if (session.topics?.length) return `Topics: ${session.topics.join(', ')}`
    if (session.slides?.length) return `Slides: ${session.slides.join(', ')}`
    return 'No content attached'
  }

  // Special render for section dividers
  if (isSection) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-fastr-primary/10 border-2 border-dashed border-fastr-primary/30 rounded-lg p-3 my-2"
      >
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="w-5 h-5 text-fastr-primary/50" />
          </div>
          <LayoutTemplate className="w-5 h-5 text-fastr-primary" />
          <div className="flex-1">
            <div className="text-xs text-fastr-primary font-medium mb-1">Section Title Slide</div>
            <input
              type="text"
              value={session.session}
              onChange={e => onUpdate({ session: e.target.value })}
              onClick={e => e.stopPropagation()}
              onPointerDown={e => e.stopPropagation()}
              placeholder="Enter section title..."
              className="w-full px-3 py-2 text-lg font-semibold text-fastr-primary bg-white border-2 border-fastr-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-primary focus:border-transparent placeholder:text-fastr-primary/40"
            />
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 text-fastr-primary/50 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Special render for Day Recap
  if (session.type === 'day_recap') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 my-2"
      >
        <div className="flex items-start gap-3">
          <div {...attributes} {...listeners} className="cursor-grab mt-1">
            <GripVertical className="w-5 h-5 text-blue-400" />
          </div>
          <BookOpen className="w-5 h-5 text-blue-500 mt-1" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-blue-700">{session.session}</div>
              <div className="flex items-center gap-2 text-sm text-blue-500">
                <Clock className="w-4 h-4" />
                <input
                  type="number"
                  value={session.duration || 0}
                  onChange={e => onUpdate({ duration: parseInt(e.target.value) || 0 })}
                  onClick={e => e.stopPropagation()}
                  onPointerDown={e => e.stopPropagation()}
                  className="w-12 px-1 py-0.5 text-center border border-blue-200 rounded bg-white"
                />
                <span>min</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-blue-600 mb-1">Yesterday we covered:</label>
              <textarea
                value={session.recap_yesterday || ''}
                onChange={e => onUpdate({ recap_yesterday: e.target.value })}
                onClick={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                placeholder="- Topic 1&#10;- Topic 2&#10;- Topic 3"
                rows={3}
                className="w-full px-3 py-2 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-blue-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-blue-600 mb-1">Today we will cover:</label>
              <textarea
                value={session.recap_today || ''}
                onChange={e => onUpdate({ recap_today: e.target.value })}
                onClick={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                placeholder="- Topic 1&#10;- Topic 2&#10;- Topic 3"
                rows={3}
                className="w-full px-3 py-2 text-sm bg-white border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-blue-300"
              />
            </div>
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Special render for End of Day
  if (session.type === 'day_end') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 my-2"
      >
        <div className="flex items-start gap-3">
          <div {...attributes} {...listeners} className="cursor-grab mt-1">
            <GripVertical className="w-5 h-5 text-orange-400" />
          </div>
          <Sunset className="w-5 h-5 text-orange-500 mt-1" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-orange-700">{session.session}</div>
              <div className="flex items-center gap-2 text-sm text-orange-500">
                <Clock className="w-4 h-4" />
                <input
                  type="number"
                  value={session.duration || 0}
                  onChange={e => onUpdate({ duration: parseInt(e.target.value) || 0 })}
                  onClick={e => e.stopPropagation()}
                  onPointerDown={e => e.stopPropagation()}
                  className="w-12 px-1 py-0.5 text-center border border-orange-200 rounded bg-white"
                />
                <span>min</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-orange-600 mb-1">Wrap-up message (optional):</label>
              <textarea
                value={session.wrapup_message || ''}
                onChange={e => onUpdate({ wrapup_message: e.target.value })}
                onClick={e => e.stopPropagation()}
                onPointerDown={e => e.stopPropagation()}
                placeholder="Leave empty to auto-generate 'See You Tomorrow' slide with next day's start time"
                rows={2}
                className="w-full px-3 py-2 text-sm bg-white border border-orange-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder:text-orange-300"
              />
            </div>
            <p className="text-xs text-orange-500">
              Auto-generates preview of tomorrow's sessions if message is empty
            </p>
          </div>
          <button
            onClick={onRemove}
            className="p-1.5 text-orange-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  // Get icon based on session content
  const getIcon = () => {
    let icon = session.icon
    if (!icon) {
      if (isBreak) {
        icon = session.session.toLowerCase().includes('lunch') ? 'lunch' : 'coffee'
      } else if (session.module) {
        icon = 'module'
      } else if (session.topics && session.topics.length > 0) {
        icon = 'topic'
      } else if (session.slides && session.slides.length > 0) {
        const slides = session.slides.join(',').toLowerCase()
        if (slides.includes('agenda')) icon = 'list'
        else if (slides.includes('title') || slides.includes('cover')) icon = 'cover'
        else if (slides.includes('closing')) icon = 'end'
        else if (slides.includes('objective')) icon = 'target'
        else if (slides.includes('country') || slides.includes('overview')) icon = 'globe'
        else if (slides.includes('priorities') || slides.includes('health')) icon = 'heart'
        else if (slides.includes('results') || slides.includes('coverage')) icon = 'chart'
        else if (slides.includes('next') || slides.includes('steps')) icon = 'arrow'
        else if (slides.includes('day_end') || slides.includes('end')) icon = 'sunset'
        else icon = 'custom'
      } else {
        icon = 'default'
      }
    }

    switch (icon) {
      case 'cover': return <FileText className="w-5 h-5 text-fastr-accent" />
      case 'list': return <ListChecks className="w-5 h-5 text-fastr-secondary" />
      case 'divider': return <LayoutTemplate className="w-5 h-5 text-fastr-secondary" />
      case 'end': return <FileText className="w-5 h-5 text-gray-500" />
      case 'coffee': return <Coffee className="w-5 h-5 text-amber-600" />
      case 'lunch': return <UtensilsCrossed className="w-5 h-5 text-orange-500" />
      case 'sunset': return <Sunset className="w-5 h-5 text-orange-400" />
      case 'recap': return <BookOpen className="w-5 h-5 text-blue-500" />
      case 'target': return <Target className="w-5 h-5 text-red-500" />
      case 'globe': return <Globe className="w-5 h-5 text-blue-500" />
      case 'heart': return <FileText className="w-5 h-5 text-pink-500" />
      case 'chart': return <BarChart3 className="w-5 h-5 text-green-500" />
      case 'arrow': return <ArrowRight className="w-5 h-5 text-fastr-primary" />
      case 'module': return <Layers className="w-5 h-5 text-fastr-primary" />
      case 'topic': return <FileCode className="w-5 h-5 text-fastr-secondary" />
      case 'custom': return <FileText className="w-5 h-5 text-fastr-accent" />
      default: return <FileText className="w-5 h-5 text-fastr-secondary" />
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`session-item ${isBreak ? 'is-break' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="w-5 h-5 text-gray-300" />
        </div>

        {getIcon()}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm font-mono">
              <span className={`w-14 px-1.5 py-1 text-center rounded ${
                calculatedTime.start ? 'text-gray-700 bg-gray-100' : 'text-gray-400 bg-gray-50'
              }`}>
                {calculatedTime.start || '--:--'}
              </span>
              <span className="text-gray-400">→</span>
              <span className={`w-14 px-1.5 py-1 text-center rounded ${
                calculatedTime.end ? 'text-gray-700 bg-gray-100' : 'text-gray-400 bg-gray-50'
              }`}>
                {calculatedTime.end || '--:--'}
              </span>
            </div>
            <input
              type="text"
              value={session.session}
              onChange={e => onUpdate({ session: e.target.value })}
              onClick={e => e.stopPropagation()}
              onPointerDown={e => e.stopPropagation()}
              className="flex-1 px-2 py-1 text-sm font-medium border border-transparent hover:border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary focus:border-transparent"
            />
          </div>
          {!isBreak && (
            <div className="mt-1 text-xs text-gray-500 truncate pl-32">
              {getContentLabel()}
            </div>
          )}
        </div>

        {!isBreak && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">by</span>
            <input
              type="text"
              value={session.speaker || ''}
              onChange={e => onUpdate({ speaker: e.target.value })}
              placeholder="Facilitator"
              className="w-28 px-2 py-1 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary"
            />
          </div>
        )}

        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <input
            type="number"
            value={session.duration || 0}
            onChange={e => onUpdate({ duration: parseInt(e.target.value) || 0 })}
            className="w-12 px-1 py-0.5 text-center border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary"
          />
          <span>min</span>
        </div>

        <button
          onClick={onRemove}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
