import { useState, useRef, useEffect } from 'react'
import { Session, Module } from '../stores/workshop'
import { ContentSlideType } from './ContentInputModal'
import {
  X,
  ChevronRight,
  Coffee,
  UtensilsCrossed,
  Layers,
  Target,
  Globe,
  ListChecks,
  Sunrise,
  Sunset,
  LayoutTemplate,
  Plus,
  BookOpen,
} from 'lucide-react'

interface QuickAddMenuProps {
  dayNumber: number
  position: { x: number; y: number }
  onClose: () => void
  onAddSession: (session: Session) => void
  onContentSlideRequest: (slideType: ContentSlideType) => void
  contentLibrary: Module[]
}

type MenuSection = 'main' | 'modules'

export function QuickAddMenu({
  dayNumber,
  position,
  onClose,
  onAddSession,
  onContentSlideRequest,
  contentLibrary,
}: QuickAddMenuProps) {
  const [activeSection, setActiveSection] = useState<MenuSection>('main')
  const menuRef = useRef<HTMLDivElement>(null)

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeSection !== 'main') {
          setActiveSection('main')
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeSection, onClose])

  // Adjust position to stay in viewport
  const adjustedPosition = {
    left: Math.min(position.x, window.innerWidth - 280),
    top: Math.min(position.y, window.innerHeight - 400),
  }

  // Default durations for modules
  const moduleDurations: Record<number, number> = {
    0: 60, 1: 90, 2: 120, 3: 180, 4: 120, 5: 90, 6: 240, 7: 120
  }

  const handleAddModule = (module: Module) => {
    onAddSession({
      session: module.name,
      module: module.id,
      duration: moduleDurations[module.number] || 60,
      icon: 'module',
    })
  }

  const handleAddDayStart = () => {
    onAddSession({
      session: `Day ${dayNumber} Recap`,
      type: 'day_recap',
      duration: 10,
      icon: 'recap',
      recap_yesterday: '',
      recap_today: '',
    })
  }

  const handleAddDayEnd = () => {
    onAddSession({
      session: `End of Day ${dayNumber}`,
      type: 'day_end',
      duration: 5,
      icon: 'sunset',
      wrapup_message: '',
    })
  }

  const handleAddBreak = (type: 'tea' | 'lunch') => {
    onAddSession({
      session: type === 'tea' ? 'Tea Break' : 'Lunch Break',
      type: 'break',
      duration: type === 'tea' ? 15 : 60,
      icon: type === 'tea' ? 'coffee' : 'lunch',
    })
  }

  const handleAddSection = () => {
    onAddSession({
      session: 'New Section',
      type: 'section',
      duration: 0,
      icon: 'divider',
    })
  }

  const handleAddCustom = () => {
    onAddSession({
      session: 'New Session',
      duration: 60,
      icon: 'default',
    })
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
      style={adjustedPosition}
    >
      {/* Header */}
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {activeSection === 'main' ? `Add to Day ${dayNumber}` : 'Select Module'}
        </span>
        <button
          onClick={activeSection === 'main' ? onClose : () => setActiveSection('main')}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Menu */}
      {activeSection === 'main' && (
        <div className="py-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Modules section */}
          <div className="px-2 py-1">
            <button
              onClick={() => setActiveSection('modules')}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-fastr-light rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Modules</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="h-px bg-gray-100 mx-2 my-1" />

          {/* Workshop Content */}
          <div className="px-2 py-1">
            <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Workshop Content
            </div>
            <button
              onClick={() => onContentSlideRequest('objectives')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Target className="w-4 h-4 text-red-500" />
              <span>Objectives</span>
            </button>
            <button
              onClick={() => onContentSlideRequest('scope')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>Scope of Work</span>
            </button>
            <button
              onClick={() => onContentSlideRequest('priorities')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <ListChecks className="w-4 h-4 text-purple-500" />
              <span>Priorities</span>
            </button>
          </div>

          <div className="h-px bg-gray-100 mx-2 my-1" />

          {/* Day Structure */}
          <div className="px-2 py-1">
            <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Day Structure
            </div>
            <button
              onClick={handleAddDayStart}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 rounded-lg transition-colors"
            >
              <Sunrise className="w-4 h-4 text-sky-500" />
              <span>Day Start (Recap)</span>
              <span className="ml-auto text-xs text-gray-400">Auto</span>
            </button>
            <button
              onClick={handleAddDayEnd}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <Sunset className="w-4 h-4 text-orange-500" />
              <span>Day End (Wrapup)</span>
              <span className="ml-auto text-xs text-gray-400">Auto</span>
            </button>
            <button
              onClick={handleAddSection}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-fastr-light rounded-lg transition-colors"
            >
              <LayoutTemplate className="w-4 h-4 text-fastr-primary" />
              <span>Section Divider</span>
            </button>
          </div>

          <div className="h-px bg-gray-100 mx-2 my-1" />

          {/* Breaks */}
          <div className="px-2 py-1">
            <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Breaks
            </div>
            <button
              onClick={() => handleAddBreak('tea')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 rounded-lg transition-colors"
            >
              <Coffee className="w-4 h-4 text-amber-600" />
              <span>Tea Break</span>
              <span className="ml-auto text-xs text-gray-400">15 min</span>
            </button>
            <button
              onClick={() => handleAddBreak('lunch')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <UtensilsCrossed className="w-4 h-4 text-orange-500" />
              <span>Lunch Break</span>
              <span className="ml-auto text-xs text-gray-400">60 min</span>
            </button>
          </div>

          <div className="h-px bg-gray-100 mx-2 my-1" />

          {/* Custom */}
          <div className="px-2 py-1">
            <button
              onClick={handleAddCustom}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-500" />
              <span>Custom Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Modules submenu */}
      {activeSection === 'modules' && (
        <div className="py-1 max-h-[calc(100vh-200px)] overflow-y-auto">
          {contentLibrary.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No modules available
            </div>
          ) : (
            <div className="px-2 py-1 space-y-1">
              {contentLibrary.map(module => (
                <button
                  key={module.id}
                  onClick={() => handleAddModule(module)}
                  className="w-full flex items-start gap-2 px-3 py-2 text-sm text-left hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Layers className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-700 truncate">{module.name}</div>
                    <div className="text-xs text-gray-400">
                      {module.topics?.length || 0} topics · {module.totalSlides} slides
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {moduleDurations[module.number] || 60}m
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
