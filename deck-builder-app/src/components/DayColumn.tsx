import { useState, useRef, useEffect } from 'react'
import { Session } from '../stores/workshop'
import { SessionCard } from './SessionCard'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import {
  Plus,
  Calendar,
  Clock,
  Edit3,
  Check,
} from 'lucide-react'

interface DayColumnProps {
  dayNumber: number
  sessions: Session[]
  dayTitle: string
  dayStartTime: string
  workshopDate?: string
  onUpdateDayTitle: (title: string) => void
  onUpdateDayStartTime: (time: string) => void
  onUpdateSession: (idx: number, updates: Partial<Session>) => void
  onRemoveSession: (idx: number) => void
  onEditSession: (session: Session, idx: number) => void
  onQuickAdd: (e: React.MouseEvent) => void
  activeOverId: string | null
}

export function DayColumn({
  dayNumber,
  sessions,
  dayTitle,
  dayStartTime,
  workshopDate,
  onUpdateDayTitle,
  onUpdateDayStartTime,
  onUpdateSession,
  onRemoveSession,
  onEditSession,
  onQuickAdd,
  activeOverId,
}: DayColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingTime, setIsEditingTime] = useState(false)
  const [localTitle, setLocalTitle] = useState(dayTitle)
  const [localTime, setLocalTime] = useState(dayStartTime)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const timeInputRef = useRef<HTMLInputElement>(null)

  // Sync local state with props
  useEffect(() => {
    setLocalTitle(dayTitle)
  }, [dayTitle])

  useEffect(() => {
    setLocalTime(dayStartTime)
  }, [dayStartTime])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus()
      titleInputRef.current.select()
    }
  }, [isEditingTitle])

  useEffect(() => {
    if (isEditingTime && timeInputRef.current) {
      timeInputRef.current.focus()
      timeInputRef.current.select()
    }
  }, [isEditingTime])

  // Droppable for the column
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${dayNumber}-droppable`,
  })

  // Time calculation helpers
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

  // Calculate session times
  const calculateSessionTimes = (): Array<{ start: string; end: string }> => {
    const times: Array<{ start: string; end: string }> = []
    let currentTime: number | null = parseTime(dayStartTime)

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

  // Calculate totals
  const totalSessions = sessions.filter(s => s.type !== 'break' && s.type !== 'section').length
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
  const endTime = parseTime(dayStartTime) !== null
    ? formatTime((parseTime(dayStartTime) || 0) + totalMinutes)
    : '--:--'

  const handleTitleSave = () => {
    onUpdateDayTitle(localTitle)
    setIsEditingTitle(false)
  }

  const handleTimeSave = () => {
    onUpdateDayStartTime(localTime)
    setIsEditingTime(false)
  }

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSave()
    if (e.key === 'Escape') {
      setLocalTitle(dayTitle)
      setIsEditingTitle(false)
    }
  }

  const handleTimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTimeSave()
    if (e.key === 'Escape') {
      setLocalTime(dayStartTime)
      setIsEditingTime(false)
    }
  }

  // Generate session IDs for sortable context
  const sessionIds = sessions.map((s, i) => s._id || `session-${dayNumber}-${i}`)

  return (
    <div className="flex-shrink-0 w-80 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Day Header */}
      <div className="px-4 py-3 bg-gradient-to-br from-fastr-primary to-fastr-secondary text-white">
        {/* Day number and title */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold">Day {dayNumber}</span>
          {isEditingTitle ? (
            <div className="flex-1 flex items-center gap-1">
              <input
                ref={titleInputRef}
                type="text"
                value={localTitle}
                onChange={e => setLocalTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                placeholder="Day theme..."
                className="flex-1 px-2 py-0.5 text-sm bg-white/20 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:bg-white/30"
              />
              <button
                onClick={handleTitleSave}
                className="p-1 hover:bg-white/20 rounded"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="flex-1 flex items-center gap-1.5 text-left group"
            >
              <span className="text-sm text-white/90 truncate">
                {dayTitle || 'Add theme...'}
              </span>
              <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity" />
            </button>
          )}
        </div>

        {/* Date and time info */}
        <div className="flex items-center gap-3 text-sm text-white/80">
          {workshopDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{workshopDate}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {isEditingTime ? (
              <div className="flex items-center gap-1">
                <input
                  ref={timeInputRef}
                  type="text"
                  value={localTime}
                  onChange={e => setLocalTime(e.target.value)}
                  onBlur={handleTimeSave}
                  onKeyDown={handleTimeKeyDown}
                  placeholder="09:00"
                  className="w-14 px-1 py-0.5 text-xs text-center bg-white/20 border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:bg-white/30"
                />
                <span>-</span>
                <span>{endTime}</span>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingTime(true)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <span>{dayStartTime || '09:00'}</span>
                <span>-</span>
                <span>{endTime}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sessions list */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-3 space-y-2 ${
          isOver ? 'bg-fastr-light/30' : ''
        }`}
      >
        <SortableContext
          items={sessionIds}
          strategy={verticalListSortingStrategy}
        >
          {sessions.length === 0 ? (
            <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
              <div className="text-center">
                <p>No sessions yet</p>
                <p className="text-xs mt-1">Click + Add below</p>
              </div>
            </div>
          ) : (
            sessions.map((session, idx) => {
              const sessionId = session._id || `session-${dayNumber}-${idx}`
              return (
                <SessionCard
                  key={sessionId}
                  session={session}
                  sessionId={sessionId}
                  calculatedTime={sessionTimes[idx]}
                  onUpdate={(updates) => onUpdateSession(idx, updates)}
                  onRemove={() => onRemoveSession(idx)}
                  onEdit={
                    (session.type === 'day_recap' || session.type === 'day_end')
                      ? () => onEditSession(session, idx)
                      : undefined
                  }
                  isOverlay={activeOverId === sessionId}
                />
              )
            })
          )}
        </SortableContext>
      </div>

      {/* Footer with stats and add button */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            {totalSessions} session{totalSessions !== 1 ? 's' : ''} · {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
          </span>
        </div>
        <button
          onClick={onQuickAdd}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-fastr-primary bg-white border border-fastr-primary/30 rounded-lg hover:bg-fastr-light hover:border-fastr-primary/50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  )
}
