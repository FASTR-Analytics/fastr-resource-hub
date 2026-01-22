import { useState } from 'react'
import { useWorkshopStore, Session } from '../stores/workshop'
import { DayColumn } from './DayColumn'
import { QuickAddMenu } from './QuickAddMenu'
import { SessionCard } from './SessionCard'
import { ContentInputModal, ContentSlideType, ContentSlideData } from './ContentInputModal'
import { SessionEditor } from './SessionEditor'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

export function KanbanBoard() {
  const {
    currentConfig,
    contentLibrary,
    addSession,
    removeSession,
    updateSession,
    reorderSession,
    moveSessionToDay,
    addDay,
    updateDayTitle,
    updateDayStartTime,
  } = useWorkshopStore()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  // Quick add menu state
  const [quickAddDay, setQuickAddDay] = useState<number | null>(null)
  const [quickAddAnchor, setQuickAddAnchor] = useState<{ x: number; y: number } | null>(null)

  // Content input modal state (for slides that need content)
  const [contentInputModal, setContentInputModal] = useState<{
    slideType: ContentSlideType
    dayNumber: number
    existingContent?: ContentSlideData
  } | null>(null)

  // Session editor state (for day_recap and day_end)
  const [editingSession, setEditingSession] = useState<{
    session: Session
    index: number
    dayNumber: number
  } | null>(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  if (!currentConfig) return null

  const numDays = currentConfig.schedule.days || 1

  // Helper to find session by ID
  const findSessionById = (id: string): { session: Session; dayNum: number; index: number } | null => {
    for (let day = 1; day <= numDays; day++) {
      const sessions: Session[] = currentConfig.schedule[`day${day}`] || []
      const index = sessions.findIndex((s, i) => (s._id || `session-${day}-${i}`) === id)
      if (index !== -1) {
        return { session: sessions[index], dayNum: day, index }
      }
    }
    return null
  }

  // Helper to find which day a droppable belongs to
  const findDayForDroppable = (droppableId: string): number | null => {
    // Check if it's a day column droppable
    const dayMatch = droppableId.match(/^day-(\d+)-droppable$/)
    if (dayMatch) {
      return parseInt(dayMatch[1])
    }
    // Check if it's a session (find its day)
    const found = findSessionById(droppableId)
    return found?.dayNum || null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    const found = findSessionById(active.id as string)
    if (found) {
      setActiveSession(found.session)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setOverId(over ? (over.id as string) : null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setActiveSession(null)
    setOverId(null)

    if (!over) return

    const activeData = findSessionById(active.id as string)
    if (!activeData) return

    const overId = over.id as string

    // Check if dropping on a day column
    const targetDay = findDayForDroppable(overId)
    if (!targetDay) return

    // Same day reordering
    if (activeData.dayNum === targetDay) {
      const overData = findSessionById(overId)
      if (overData && active.id !== over.id) {
        reorderSession(targetDay, activeData.index, overData.index)
      }
    } else {
      // Cross-day move
      const overData = findSessionById(overId)
      const targetIndex = overData ? overData.index : -1 // -1 means end of day
      moveSessionToDay(activeData.dayNum, activeData.index, targetDay, targetIndex)
    }
  }

  const handleQuickAdd = (dayNum: number, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setQuickAddDay(dayNum)
    setQuickAddAnchor({ x: rect.left, y: rect.bottom + 4 })
  }

  const handleAddSession = (dayNum: number, session: Session) => {
    addSession(dayNum, session)
    setQuickAddDay(null)
    setQuickAddAnchor(null)
  }

  const handleContentSlideRequest = (dayNum: number, slideType: ContentSlideType) => {
    setContentInputModal({ slideType, dayNumber: dayNum })
    setQuickAddDay(null)
    setQuickAddAnchor(null)
  }

  const handleContentSlideSubmit = (content: ContentSlideData) => {
    if (!contentInputModal) return

    const slideConfigs: Record<ContentSlideType, { session: string; icon: string; slideFile: string }> = {
      objectives: { session: 'Workshop Objectives', icon: 'target', slideFile: '01_objectives.md' },
      scope: { session: 'Scope of Work', icon: 'compass', slideFile: '02_scope.md' },
      priorities: { session: 'Health Priorities', icon: 'list', slideFile: '03_priorities.md' },
      outputs: { session: 'Expected Outputs', icon: 'check', slideFile: '04_outputs.md' },
      custom: { session: content.title, icon: 'custom', slideFile: 'custom.md' },
    }

    const config = slideConfigs[content.type]

    addSession(contentInputModal.dayNumber, {
      session: content.title || config.session,
      slides: [config.slideFile],
      duration: 10,
      icon: config.icon,
    })

    setContentInputModal(null)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-100">
      {/* Kanban columns container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <div className="flex gap-4 h-full min-w-max">
            {Array.from({ length: numDays }, (_, i) => i + 1).map(dayNum => (
              <DayColumn
                key={dayNum}
                dayNumber={dayNum}
                sessions={currentConfig.schedule[`day${dayNum}`] || []}
                dayTitle={currentConfig.schedule.day_titles?.[dayNum] || ''}
                dayStartTime={currentConfig.schedule.day_start_times?.[dayNum] || ''}
                workshopDate={currentConfig.workshop.date}
                onUpdateDayTitle={(title) => updateDayTitle(dayNum, title)}
                onUpdateDayStartTime={(time) => updateDayStartTime(dayNum, time)}
                onUpdateSession={(idx, updates) => updateSession(dayNum, idx, updates)}
                onRemoveSession={(idx) => removeSession(dayNum, idx)}
                onEditSession={(session, idx) => setEditingSession({ session, index: idx, dayNumber: dayNum })}
                onQuickAdd={(e) => handleQuickAdd(dayNum, e)}
                activeOverId={overId}
              />
            ))}

            {/* Add Day button */}
            <div className="flex-shrink-0 w-80">
              <button
                onClick={addDay}
                className="w-full h-16 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 bg-white/50 hover:bg-white border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Day</span>
              </button>
            </div>
          </div>
        </div>

        {/* Drag overlay for visual feedback */}
        <DragOverlay>
          {activeId && activeSession && (
            <div className="opacity-90 rotate-2 shadow-xl">
              <SessionCard
                session={activeSession}
                sessionId={activeId}
                calculatedTime={{ start: '', end: '' }}
                onUpdate={() => {}}
                onRemove={() => {}}
                isDragging
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Quick Add Menu */}
      {quickAddDay !== null && quickAddAnchor && (
        <QuickAddMenu
          dayNumber={quickAddDay}
          position={quickAddAnchor}
          onClose={() => {
            setQuickAddDay(null)
            setQuickAddAnchor(null)
          }}
          onAddSession={(session) => handleAddSession(quickAddDay, session)}
          onContentSlideRequest={(slideType) => handleContentSlideRequest(quickAddDay, slideType)}
          contentLibrary={contentLibrary}
        />
      )}

      {/* Content Input Modal */}
      {contentInputModal && (
        <ContentInputModal
          slideType={contentInputModal.slideType}
          workshopContext={currentConfig ? {
            name: currentConfig.workshop.name,
            country: currentConfig.workshop.country,
            location: currentConfig.workshop.location,
            date: currentConfig.workshop.date,
          } : undefined}
          existingContent={contentInputModal.existingContent}
          onCancel={() => setContentInputModal(null)}
          onSave={handleContentSlideSubmit}
        />
      )}

      {/* Session Editor Modal (for day_recap and day_end) */}
      {editingSession && (
        <SessionEditor
          session={editingSession.session}
          sessionIndex={editingSession.index}
          dayNumber={editingSession.dayNumber}
          onClose={() => setEditingSession(null)}
          onSave={(updates) => {
            updateSession(editingSession.dayNumber, editingSession.index, updates)
            setEditingSession(null)
          }}
        />
      )}
    </div>
  )
}
