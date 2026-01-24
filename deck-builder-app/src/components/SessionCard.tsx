import { useState } from 'react'
import { Session } from '../stores/workshop'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Clock,
  Trash2,
  ChevronDown,
  ChevronRight,
  Coffee,
  UtensilsCrossed,
  FileText,
  Target,
  Globe,
  BarChart3,
  ArrowRight,
  Layers,
  FileCode,
  LayoutTemplate,
  Sunset,
  Sunrise,
  ListChecks,
  Sparkles,
  Edit3,
  User,
  CalendarDays,
} from 'lucide-react'

interface SessionCardProps {
  session: Session
  sessionId: string
  calculatedTime: { start: string; end: string }
  onUpdate: (updates: Partial<Session>) => void
  onRemove: () => void
  onEdit?: () => void
  isDragging?: boolean
  isOverlay?: boolean
}

// Card type colors and icons
const CARD_STYLES: Record<string, { bg: string; border: string; iconBg: string; text: string }> = {
  break: { bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-100', text: 'text-amber-700' },
  module: { bg: 'bg-blue-50', border: 'border-blue-200', iconBg: 'bg-blue-100', text: 'text-blue-700' },
  day_title: { bg: 'bg-gradient-to-r from-fastr-primary/10 to-fastr-secondary/10', border: 'border-fastr-primary/40', iconBg: 'bg-fastr-primary', text: 'text-fastr-primary' },
  day_recap: { bg: 'bg-sky-50', border: 'border-sky-200', iconBg: 'bg-sky-100', text: 'text-sky-700' },
  day_end: { bg: 'bg-orange-50', border: 'border-orange-200', iconBg: 'bg-orange-100', text: 'text-orange-700' },
  section: { bg: 'bg-fastr-light', border: 'border-fastr-primary/30', iconBg: 'bg-fastr-primary/20', text: 'text-fastr-primary' },
  objectives: { bg: 'bg-red-50', border: 'border-red-200', iconBg: 'bg-red-100', text: 'text-red-700' },
  scope: { bg: 'bg-indigo-50', border: 'border-indigo-200', iconBg: 'bg-indigo-100', text: 'text-indigo-700' },
  priorities: { bg: 'bg-purple-50', border: 'border-purple-200', iconBg: 'bg-purple-100', text: 'text-purple-700' },
  custom: { bg: 'bg-teal-50', border: 'border-teal-200', iconBg: 'bg-teal-100', text: 'text-teal-700' },
  default: { bg: 'bg-white', border: 'border-gray-200', iconBg: 'bg-gray-100', text: 'text-gray-700' },
}

export function SessionCard({
  session,
  sessionId,
  calculatedTime,
  onUpdate,
  onRemove,
  onEdit,
  isDragging = false,
  isOverlay = false,
}: SessionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localDuration, setLocalDuration] = useState(String(session.duration || 0))
  const [localSpeaker, setLocalSpeaker] = useState(session.speaker || '')
  const [localTitle, setLocalTitle] = useState(session.session || '')

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: sessionId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Determine card type for styling
  const getCardType = (): string => {
    if (session.type === 'break') return 'break'
    if (session.type === 'section') return 'section'
    if (session.type === 'day_recap') return 'day_recap'
    if (session.type === 'day_end') return 'day_end'
    if (session.module) return 'module'
    if (session.icon === 'target' || session.slides?.some(s => s.includes('objective'))) return 'objectives'
    if (session.icon === 'compass' || session.slides?.some(s => s.includes('scope'))) return 'scope'
    if (session.icon === 'list' || session.slides?.some(s => s.includes('priorities'))) return 'priorities'
    if (session.icon === 'custom') return 'custom'
    return 'default'
  }

  const cardType = getCardType()
  const styles = CARD_STYLES[cardType] || CARD_STYLES.default

  // Get appropriate icon
  const getIcon = () => {
    const iconClass = 'w-4 h-4'
    if (session.type === 'break') {
      return session.session.toLowerCase().includes('lunch')
        ? <UtensilsCrossed className={`${iconClass} text-orange-500`} />
        : <Coffee className={`${iconClass} text-amber-600`} />
    }
    if (session.type === 'section') return <LayoutTemplate className={`${iconClass} text-fastr-primary`} />
    if (session.type === 'day_recap') return <Sunrise className={`${iconClass} text-sky-500`} />
    if (session.type === 'day_end') return <Sunset className={`${iconClass} text-orange-500`} />
    if (session.module) return <Layers className={`${iconClass} text-blue-600`} />
    if (session.topics?.length) return <FileCode className={`${iconClass} text-fastr-secondary`} />
    if (session.icon === 'target') return <Target className={`${iconClass} text-red-500`} />
    if (session.icon === 'compass' || session.icon === 'globe') return <Globe className={`${iconClass} text-indigo-500`} />
    if (session.icon === 'list') return <ListChecks className={`${iconClass} text-purple-500`} />
    if (session.icon === 'chart') return <BarChart3 className={`${iconClass} text-green-500`} />
    if (session.icon === 'arrow') return <ArrowRight className={`${iconClass} text-fastr-primary`} />
    if (session.icon === 'custom') return <FileText className={`${iconClass} text-teal-500`} />
    return <FileText className={`${iconClass} text-gray-500`} />
  }

  // Get content description
  const getContentLabel = () => {
    if (session.module) return `Module: ${session.module}`
    if (session.topics?.length) return `${session.topics.length} topic${session.topics.length > 1 ? 's' : ''}`
    if (session.slides?.length) return `${session.slides.length} slide${session.slides.length > 1 ? 's' : ''}`
    return ''
  }

  // Check if auto-generated
  const isAutoGenerated = (session.type === 'day_recap' && !session.recap_yesterday && !session.recap_today) ||
    (session.type === 'day_end' && !session.wrapup_message)

  // Handle field updates
  const handleDurationChange = (value: string) => {
    setLocalDuration(value)
  }

  const handleDurationBlur = () => {
    const duration = parseInt(localDuration) || 0
    if (duration !== session.duration) {
      onUpdate({ duration })
    }
  }

  const handleSpeakerChange = (value: string) => {
    setLocalSpeaker(value)
  }

  const handleSpeakerBlur = () => {
    if (localSpeaker !== session.speaker) {
      onUpdate({ speaker: localSpeaker })
    }
  }

  const handleTitleChange = (value: string) => {
    setLocalTitle(value)
  }

  const handleTitleBlur = () => {
    if (localTitle !== session.session) {
      onUpdate({ session: localTitle })
    }
  }

  // Section divider render
  if (session.type === 'section') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`${styles.bg} ${styles.border} border-2 border-dashed rounded-lg p-3 ${
          isSortableDragging || isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab touch-none">
            <GripVertical className="w-4 h-4 text-fastr-primary/50" />
          </div>
          {getIcon()}
          <input
            type="text"
            value={localTitle}
            onChange={e => handleTitleChange(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="Section title..."
            className="flex-1 text-sm font-semibold bg-transparent border-0 focus:outline-none focus:ring-0 text-fastr-primary placeholder:text-fastr-primary/40"
          />
          <button
            onClick={onRemove}
            className="p-1 text-fastr-primary/50 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.bg} ${styles.border} border rounded-lg overflow-hidden transition-shadow ${
        isSortableDragging || isDragging ? 'opacity-50 shadow-lg' : 'shadow-sm hover:shadow-md'
      } ${isOverlay ? 'ring-2 ring-fastr-primary ring-offset-2' : ''}`}
    >
      {/* Collapsed view - always visible */}
      <div
        className="flex items-center gap-2 p-2.5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none p-0.5"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>

        {/* Icon */}
        <div className={`w-7 h-7 rounded-md ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
          {getIcon()}
        </div>

        {/* Session info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${styles.text} truncate`}>
              {session.session}
            </span>
            {isAutoGenerated && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white/60 text-xs rounded">
                <Sparkles className="w-2.5 h-2.5" />
                Auto
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-mono">
              {calculatedTime.start || '--:--'}
            </span>
            <span className="text-gray-300">·</span>
            <span>{session.duration || 0}min</span>
            {session.speaker && (
              <>
                <span className="text-gray-300">·</span>
                <span className="truncate">{session.speaker}</span>
              </>
            )}
          </div>
        </div>

        {/* Expand indicator */}
        {session.type !== 'break' && (
          <div className="text-gray-400">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
        )}
      </div>

      {/* Expanded view */}
      {isExpanded && session.type !== 'break' && (
        <div className="px-3 pb-3 pt-1 border-t border-gray-100 bg-white/50 space-y-3">
          {/* Time display */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{calculatedTime.start || '--:--'}</span>
              <span className="text-gray-400">-</span>
              <span className="font-mono">{calculatedTime.end || '--:--'}</span>
            </div>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Duration (min)</label>
              <input
                type="number"
                value={localDuration}
                onChange={e => handleDurationChange(e.target.value)}
                onBlur={handleDurationBlur}
                className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Speaker</label>
              <div className="relative">
                <User className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={localSpeaker}
                  onChange={e => handleSpeakerChange(e.target.value)}
                  onBlur={handleSpeakerBlur}
                  placeholder="Facilitator..."
                  className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary"
                />
              </div>
            </div>
          </div>

          {/* Title editing */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Session Title</label>
            <input
              type="text"
              value={localTitle}
              onChange={e => handleTitleChange(e.target.value)}
              onBlur={handleTitleBlur}
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-fastr-secondary"
            />
          </div>

          {/* Content info */}
          {getContentLabel() && (
            <div className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-1.5">
              {getContentLabel()}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {onEdit && (
              <button
                onClick={onEdit}
                className={`flex items-center gap-1.5 px-2 py-1 text-xs ${styles.text} hover:bg-white rounded transition-colors`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Content
              </button>
            )}
            <button
              onClick={onRemove}
              className="flex items-center gap-1.5 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
