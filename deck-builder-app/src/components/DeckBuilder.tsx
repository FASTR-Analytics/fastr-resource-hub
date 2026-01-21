import { useState, useEffect, DragEvent } from 'react'
import { useWorkshopStore, Session } from '../stores/workshop'
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
  X,
  RefreshCw,
  Eye
} from 'lucide-react'

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
    updateDayTitle
  } = useWorkshopStore()

  const [activeDay, setActiveDay] = useState(1)
  const [isBuilding, setIsBuilding] = useState(false)
  const [buildResult, setBuildResult] = useState<{
    success: boolean
    outputPath: string
    outputDir: string
    mdPath?: string
    htmlPath?: string | null
  } | null>(null)
  const [outputs, setOutputs] = useState<OutputFile[]>([])
  const [showOutputPanel, setShowOutputPanel] = useState(false)

  
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
    // Parse "HH:MM" or "H:MM" format to minutes since midnight
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/)
    if (!match) return null
    const hours = parseInt(match[1])
    const mins = parseInt(match[2])
    if (hours > 23 || mins > 59) return null
    return hours * 60 + mins
  }

  const formatTime = (minutes: number): string => {
    // Format minutes since midnight to "HH:MM"
    const h = Math.floor(minutes / 60) % 24
    const m = minutes % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  const getStartTime = (timeStr?: string): string => {
    // Extract start time from "HH:MM-HH:MM" or "HH:MM" format
    if (!timeStr) return ''
    const parts = timeStr.split('-')
    return parts[0].trim()
  }

  // Calculate times for all sessions based on first session's start time
  const calculateSessionTimes = (): Array<{ start: string; end: string }> => {
    const times: Array<{ start: string; end: string }> = []
    let currentTime: number | null = null

    for (let i = 0; i < sessions.length; i++) {
      const session = sessions[i]

      // Skip section headers (no time)
      if (session.type === 'section') {
        times.push({ start: '', end: '' })
        continue
      }

      // Get start time from session or calculate from previous
      const sessionStart = getStartTime(session.time)
      const parsedStart = parseTime(sessionStart)

      if (parsedStart !== null) {
        currentTime = parsedStart
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
      })
    } else if (slideType === 'topic') {
      const topicId = e.dataTransfer.getData('topicId')
      addSession(activeDay, {
        session: getTopicTitle(topicId),
        topics: [topicId],
        duration: 30,
      })
    } else if (slideType === 'custom') {
      const slideFile = e.dataTransfer.getData('slideFile')
      addSession(activeDay, {
        session: slideFile.replace('.md', ''),
        slides: [slideFile],
        duration: 15,
      })
    } else if (slideType === 'template') {
      const templateId = e.dataTransfer.getData('templateId')
      // Map template IDs to their appropriate session types
      const templateConfig: Record<string, Partial<Session>> = {
        'title': { session: 'Title Slide', slides: ['title'], duration: 5 },
        'agenda': { session: 'Agenda', slides: ['agenda'], duration: 10 },
        'section': { session: 'Section', type: 'section', duration: 0 },
        'closing': { session: 'Closing', slides: ['closing'], duration: 5 },
        'tea': { session: 'Tea Break', type: 'break', duration: 15 },
        'lunch': { session: 'Lunch Break', type: 'break', duration: 60 },
        'day_end': { session: 'End of Day', slides: ['day_end'], duration: 5 },
        'day_recap': { session: 'Day Recap', slides: ['day_recap'], duration: 10 },
        'objectives': { session: 'Workshop Objectives', slides: ['objectives'], duration: 10 },
        'country': { session: 'Country Overview', slides: ['country_overview'], duration: 15 },
        'priorities': { session: 'Health Priorities', slides: ['health_priorities'], duration: 15 },
        'results': { session: 'Coverage Results', slides: ['coverage_results'], duration: 15 },
        'next_steps': { session: 'Next Steps', slides: ['next_steps'], duration: 10 },
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
    // topicId format: "m0_1", "m3_2", etc.
    const modNumMatch = topicId.match(/^m(\d+)_/)
    if (!modNumMatch) return topicId

    const modNum = parseInt(modNumMatch[1])
    const module = contentLibrary.find(m => m.number === modNum)
    if (!module) return topicId

    const topic = module.topics?.find((t: any) => t.id === topicId)
    return topic?.title || topicId
  }

  // DnD sensors - add activation constraint so clicks on inputs work
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before dragging starts
      },
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
  const handleBuild = async (pdfMode: 'skip' | 'include' = 'include') => {
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
      setShowOutputPanel(true)
      // Refresh outputs list
      await loadOutputs()
    } catch (error: any) {
      alert(`Build failed: ${error.message}`)
    }
    setIsBuilding(false)
  }

  
  // Open file handlers
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {currentConfig.workshop.name}
            </h2>
            <p className="text-sm text-gray-500">
              {currentConfig.workshop.location} • {currentConfig.workshop.date}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {outputs.length > 0 && (
              <button
                onClick={() => setShowOutputPanel(!showOutputPanel)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <FileCode className="w-4 h-4" />
                Outputs ({outputs.length})
              </button>
            )}
            <button
              onClick={() => handleBuild('skip')}
              disabled={isBuilding}
              className="flex items-center gap-2 px-4 py-2 bg-fastr-primary text-white rounded-md hover:bg-fastr-primary/90 transition-colors disabled:opacity-50 text-sm"
            >
              {isBuilding ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Hammer className="w-4 h-4" />
              )}
              Build Deck
            </button>
          </div>
        </div>

        {/* Build success message */}
        {buildResult?.success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-green-800">Deck built successfully!</p>
                  <p className="text-sm text-green-600">
                    {buildResult.outputPath.split('/').pop()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBuildResult(null)}
                className="p-1.5 text-green-400 hover:text-green-600 hover:bg-green-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action buttons */}
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
                onClick={() => handleBuild('include')}
                disabled={isBuilding}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-md hover:bg-green-100 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
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

        {/* Day tabs */}
        <div className="flex items-center gap-2">
          {Array.from({ length: numDays }, (_, i) => i + 1).map(day => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeDay === day
                  ? 'bg-fastr-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Day {day}
            </button>
          ))}
          <button
            onClick={addDay}
            className="px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day title */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <input
          type="text"
          value={dayTitle}
          onChange={e => updateDayTitle(activeDay, e.target.value)}
          placeholder={`Day ${activeDay} theme (optional)`}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
        />
      </div>

      {/* Outputs panel */}
      {showOutputPanel && outputs.length > 0 && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-700">Workshop Outputs</h3>
            <button
              onClick={() => setShowOutputPanel(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2 max-h-48 overflow-y-auto">
            <div className="space-y-1">
              {outputs.map(file => (
                <div
                  key={file.path}
                  className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                    file.type === 'pdf' ? 'bg-red-100 text-red-600' :
                    file.type === 'pptx' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {file.type.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(file.modified).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenFile(file.path)}
                      className="p-1.5 text-gray-400 hover:text-fastr-primary hover:bg-gray-100 rounded transition-colors"
                      title="Open file"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleShowInFolder(file.path)}
                      className="p-1.5 text-gray-400 hover:text-fastr-primary hover:bg-gray-100 rounded transition-colors"
                      title="Show in folder"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sessions list (droppable area) */}
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
                      isFirst={idx === 0 || sessions.slice(0, idx).every(s => s.type === 'section')}
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
            Add Session
          </button>
          <button
            onClick={() => addSession(activeDay, { session: 'Tea Break', type: 'break', duration: 15 })}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Coffee className="w-4 h-4" />
            Tea Break
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

          </div>
  )
}

// Sortable session item
function SortableSessionItem({
  id,
  session,
  calculatedTime,
  isFirst,
  onUpdate,
  onRemove,
}: {
  id: string
  session: Session
  calculatedTime: { start: string; end: string }
  isFirst: boolean
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

  // Get content description
  const getContentLabel = () => {
    if (session.module) return `Module: ${session.module}`
    if (session.topics?.length) return `Topics: ${session.topics.join(', ')}`
    if (session.slides?.length) return `Slides: ${session.slides.join(', ')}`
    return 'No content attached'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`session-item ${isBreak ? 'is-break' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle */}
        <div {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="w-5 h-5 text-gray-300" />
        </div>

        {/* Icon */}
        {isBreak ? (
          session.session.toLowerCase().includes('lunch') ? (
            <UtensilsCrossed className="w-5 h-5 text-amber-500" />
          ) : (
            <Coffee className="w-5 h-5 text-amber-500" />
          )
        ) : (
          <FileText className="w-5 h-5 text-fastr-secondary" />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Time display/input */}
            {session.type === 'section' ? (
              <div className="w-28" /> // Empty space for section headers
            ) : (
              <div className="flex items-center gap-1 text-sm">
                {isFirst ? (
                  // First session: editable start time
                  <input
                    type="text"
                    value={session.time || ''}
                    onChange={e => {
                      e.stopPropagation()
                      onUpdate({ time: e.target.value })
                    }}
                    placeholder="08:30"
                    className="w-14 px-1.5 py-1 text-center border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary bg-white"
                  />
                ) : (
                  // Subsequent sessions: show calculated start time
                  <span className="w-14 px-1.5 py-1 text-center text-gray-600 bg-gray-50 rounded">
                    {calculatedTime.start || '--:--'}
                  </span>
                )}
                <span className="text-gray-400">-</span>
                <span className="w-14 px-1.5 py-1 text-center text-gray-500 bg-gray-50 rounded">
                  {calculatedTime.end || '--:--'}
                </span>
              </div>
            )}
            <input
              type="text"
              value={session.session}
              onChange={e => onUpdate({ session: e.target.value })}
              className="flex-1 px-2 py-1 text-sm font-medium border border-transparent hover:border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary focus:border-transparent"
            />
          </div>
          {!isBreak && session.type !== 'section' && (
            <div className="mt-1 text-xs text-gray-500 truncate pl-32">
              {getContentLabel()}
            </div>
          )}
        </div>

        {/* Speaker */}
        {!isBreak && session.type !== 'section' && (
          <input
            type="text"
            value={session.speaker || ''}
            onChange={e => onUpdate({ speaker: e.target.value })}
            placeholder="Speaker"
            className="w-24 px-2 py-1 text-sm text-gray-600 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary"
          />
        )}

        {/* Duration */}
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

        {/* Remove button */}
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
