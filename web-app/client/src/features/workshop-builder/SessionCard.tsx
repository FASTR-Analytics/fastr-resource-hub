import { ReactNode, useState, KeyboardEvent } from 'react'
import {
  GripVertical,
  Pencil,
  Lock,
  Coffee,
  Calendar,
  Flag,
  ClipboardList,
  Folder,
  BookOpen,
  FileText,
  ArrowRightLeft,
  ChevronUp,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useWorkshopStore, Session } from '../../stores/workshop'
import { t } from '../../i18n/translations'

// ─────────────────────────────────────────────────────────────────────────────
// Session type chrome — Lucide icons + tinted card backgrounds per type
// ─────────────────────────────────────────────────────────────────────────────

export interface SessionTypeConfig {
  bg: string
  border: string
  Icon: LucideIcon
  iconColor: string
}

const sessionTypeConfig: Record<string, SessionTypeConfig> = {
  break:     { bg: 'bg-amber-50',   border: 'border-amber-200',   Icon: Coffee,         iconColor: 'text-amber-500' },
  day_title: { bg: 'bg-slate-100',  border: 'border-slate-200',   Icon: Calendar,       iconColor: 'text-slate-500' },
  day_end:   { bg: 'bg-violet-50',  border: 'border-violet-200',  Icon: Flag,           iconColor: 'text-violet-500' },
  day_recap: { bg: 'bg-emerald-50', border: 'border-emerald-200', Icon: ClipboardList,  iconColor: 'text-emerald-600' },
  section:   { bg: 'bg-slate-50',   border: 'border-slate-200',   Icon: Folder,         iconColor: 'text-slate-500' },
}

const moduleSessionConfig: SessionTypeConfig = {
  bg: 'bg-sky-50',
  border: 'border-sky-200',
  Icon: BookOpen,
  iconColor: 'text-sky-500',
}

const defaultSessionConfig: SessionTypeConfig = {
  bg: 'bg-white',
  border: 'border-slate-200',
  Icon: FileText,
  iconColor: 'text-slate-400',
}

// ─────────────────────────────────────────────────────────────────────────────
// Locked / compulsory session detection
// ─────────────────────────────────────────────────────────────────────────────

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

export function isSessionLocked(session: Session): boolean {
  if (session.type && compulsoryTypes.includes(session.type)) return true
  if (session.slides?.some(s => compulsorySlides.includes(s))) return true
  const name = session.session?.toLowerCase() || ''
  if (
    name.includes('agenda') ||
    name.includes('objectives') ||
    name.includes('expectations') ||
    name.includes('expected outputs') ||
    name.includes('introductions') ||
    name.includes('welcome') ||
    name.includes('recap')
  ) {
    return true
  }
  return false
}

// ─────────────────────────────────────────────────────────────────────────────
// SortableSessionCard — a draggable session in the day timeline
// ─────────────────────────────────────────────────────────────────────────────

interface SortableSessionCardProps {
  session: Session & { _id: string; _startTime?: string; _endTime?: string }
  index: number
  dayNum: number
  totalDays: number
  /** Total session count for this day — used to disable Move up/down at edges. */
  totalSessions?: number
  onEdit: (session: Session, dayNum: number, index: number) => void
  onMoveToDay: (fromDay: number, fromIdx: number, toDay: number) => void
}

export function SortableSessionCard({
  session,
  index,
  dayNum,
  totalDays,
  totalSessions,
  onEdit,
  onMoveToDay,
}: SortableSessionCardProps) {
  const [showMoveMenu, setShowMoveMenu] = useState(false)
  const { contentLanguage, reorderSession } = useWorkshopStore()
  const isFirst = index === 0
  const isLast = totalSessions != null ? index === totalSessions - 1 : false

  const handleMoveUp = () => {
    if (!isFirst) reorderSession(dayNum, index, index - 1)
  }
  const handleMoveDown = () => {
    if (!isLast) reorderSession(dayNum, index, index + 1)
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowUp') {
      e.preventDefault()
      handleMoveUp()
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'ArrowDown') {
      e.preventDefault()
      handleMoveDown()
    }
  }
  const isLocked = isSessionLocked(session)
  const config: SessionTypeConfig = session.module
    ? moduleSessionConfig
    : sessionTypeConfig[session.type || ''] || defaultSessionConfig
  const SessionIcon = config.Icon

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: session._id,
    disabled: isLocked,
    data: { type: 'session', dayNum },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Locked sessions — compact, grayed-out
  if (isLocked) {
    // Distinct "ghost card" — auto-generated, can't be reordered or deleted.
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-50 border border-dashed border-slate-300">
        <span className="text-xs font-mono text-slate-400 w-12 flex-shrink-0">{session._startTime || ''}</span>
        <Lock className="w-3 h-3 text-slate-400 flex-shrink-0" aria-hidden />
        <span className="text-xs italic text-slate-500 truncate flex-1">{session.session}</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-400 flex-shrink-0">
          {t('autoGenerated', contentLanguage)}
        </span>
        {session.duration && session.duration > 0 && (
          <span className="text-xs text-slate-400 flex-shrink-0">{session.duration}m</span>
        )}
      </div>
    )
  }

  // Editable sessions — full card
  return (
    <div
      ref={setNodeRef}
      style={style}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`group relative p-3 rounded-lg border shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-fastr-secondary/40 ${config.bg} ${config.border} ${
        isDragging ? 'opacity-80 scale-[1.02] shadow-lg ring-2 ring-fastr-secondary z-50' : ''
      }`}
    >
      {/* Drag handle — always visible at rest for discoverability */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2">
        <div
          {...attributes}
          {...listeners}
          title={t('dragToReorder', contentLanguage)}
          aria-label={t('dragToReorder', contentLanguage)}
          className="cursor-move active:cursor-grabbing opacity-70 group-hover:opacity-100 hover:bg-black/5 rounded p-0.5 transition-all"
        >
          <GripVertical className="w-4 h-4 text-slate-400" aria-hidden />
        </div>
      </div>

      {/* Action buttons (top-right) — always visible at rest, subtle */}
      <div className="absolute right-1 top-1 flex items-center gap-0.5">
        {totalSessions != null && totalSessions > 1 && (
          <>
            <button
              onClick={e => { e.stopPropagation(); handleMoveUp() }}
              disabled={isFirst}
              className="p-1 rounded text-slate-300 hover:text-slate-700 hover:bg-black/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title={t('moveUp', contentLanguage)}
              aria-label={t('moveUp', contentLanguage)}
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); handleMoveDown() }}
              disabled={isLast}
              className="p-1 rounded text-slate-300 hover:text-slate-700 hover:bg-black/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title={t('moveDown', contentLanguage)}
              aria-label={t('moveDown', contentLanguage)}
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        {totalDays > 1 && (
          <div className="relative">
            <button
              onClick={e => {
                e.stopPropagation()
                setShowMoveMenu(!showMoveMenu)
              }}
              className="p-1 rounded text-slate-300 hover:text-slate-700 hover:bg-black/10 transition-colors"
              title={t('moveToDay', contentLanguage)}
              aria-label={t('moveToDay', contentLanguage)}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
            {showMoveMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg ring-1 ring-black/10 py-1 z-50 min-w-[100px]">
                {Array.from({ length: totalDays }, (_, i) => i + 1)
                  .filter(d => d !== dayNum)
                  .map(d => (
                    <button
                      key={d}
                      onClick={e => {
                        e.stopPropagation()
                        onMoveToDay(dayNum, index, d)
                        setShowMoveMenu(false)
                      }}
                      className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-fastr-primary/10 hover:text-fastr-primary transition-colors"
                    >
                      {t('day', contentLanguage)} {d}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}
        <button
          onClick={e => {
            e.stopPropagation()
            onEdit(session, dayNum, index)
          }}
          className="p-1 rounded text-slate-300 hover:text-slate-700 hover:bg-black/10 transition-colors"
          title={t('editSession', contentLanguage)}
          aria-label={t('editSession', contentLanguage)}
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="pl-5 pr-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 w-12 flex-shrink-0">{session._startTime || ''}</span>
          <SessionIcon className={`w-4 h-4 flex-shrink-0 ${config.iconColor}`} aria-hidden />
          <span className="text-sm font-medium text-slate-800 truncate flex-1">{session.session}</span>
        </div>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
          {session.duration && session.duration > 0 && <span>{session.duration} min</span>}
          {session.speaker && (
            <>
              <span>•</span>
              <span className="truncate">{session.speaker}</span>
            </>
          )}
        </div>
        {session.duration && session.duration > 0 && (
          <div className="duration-bar">
            <div
              className="duration-bar-fill"
              style={{ width: `${Math.min((session.duration / 60) * 100, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DroppableDayColumn — wraps a day timeline, highlights on drag-over
// ─────────────────────────────────────────────────────────────────────────────

export function DroppableDayColumn({ dayNum, children }: { dayNum: number; children: ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-drop-${dayNum}`,
    data: { type: 'day-column', dayNum },
  })
  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-[340px] rounded-xl shadow-sm border ring-1 ring-black/[0.03] transition-all ${
        isOver
          ? 'border-fastr-secondary bg-fastr-secondary/5 ring-2 ring-fastr-secondary/40'
          : 'border-slate-200/80 bg-white/70 backdrop-blur-sm'
      }`}
    >
      {children}
    </div>
  )
}
