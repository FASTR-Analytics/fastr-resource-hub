import { useState, DragEvent } from 'react'
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
  arrayMove,
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
  Play,
  FileText,
  ChevronDown,
  Hammer
} from 'lucide-react'

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

  if (!currentConfig) return null

  const numDays = currentConfig.schedule.days || 1
  const dayKey = `day${activeDay}`
  const sessions: Session[] = currentConfig.schedule[dayKey] || []
  const dayTitle = currentConfig.schedule.day_titles?.[activeDay] || ''

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
        session: topicId,
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
    }
  }

  const getModuleName = (moduleId: string) => {
    const modNum = parseInt(moduleId.replace('m', ''))
    const module = contentLibrary.find(m => m.number === modNum)
    return module?.name || moduleId
  }

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = sessions.findIndex((_, i) => `session-${i}` === active.id)
      const newIndex = sessions.findIndex((_, i) => `session-${i}` === over.id)
      reorderSession(activeDay, oldIndex, newIndex)
    }
  }

  // Build deck
  const handleBuild = async () => {
    if (!currentWorkshopId) return
    setIsBuilding(true)
    try {
      const result = await window.electronAPI.buildDeck(currentWorkshopId)
      alert('Deck built successfully!')
    } catch (error: any) {
      alert(`Build failed: ${error.message}`)
    }
    setIsBuilding(false)
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
          <button
            onClick={handleBuild}
            disabled={isBuilding}
            className="flex items-center gap-2 px-4 py-2 bg-fastr-accent text-white rounded-md hover:bg-fastr-accent/90 transition-colors disabled:opacity-50"
          >
            <Hammer className="w-4 h-4" />
            {isBuilding ? 'Building...' : 'Build Deck'}
          </button>
        </div>

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
            items={sessions.map((_, i) => `session-${i}`)}
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
                {sessions.map((session, idx) => (
                  <SortableSessionItem
                    key={`session-${idx}`}
                    id={`session-${idx}`}
                    session={session}
                    index={idx}
                    dayNum={activeDay}
                    onUpdate={(updates) => updateSession(activeDay, idx, updates)}
                    onRemove={() => removeSession(activeDay, idx)}
                  />
                ))}
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
  index,
  dayNum,
  onUpdate,
  onRemove,
}: {
  id: string
  session: Session
  index: number
  dayNum: number
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
          <Play className="w-5 h-5 text-fastr-secondary" />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={session.time || ''}
              onChange={e => onUpdate({ time: e.target.value })}
              placeholder="00:00-00:00"
              className="w-28 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary"
            />
            <input
              type="text"
              value={session.session}
              onChange={e => onUpdate({ session: e.target.value })}
              className="flex-1 px-2 py-1 text-sm font-medium border border-transparent hover:border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary focus:border-transparent"
            />
          </div>
          {!isBreak && (
            <div className="mt-1 text-xs text-gray-500 truncate">
              {getContentLabel()}
            </div>
          )}
        </div>

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
