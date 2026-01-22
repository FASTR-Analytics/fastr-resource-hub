import { useState } from 'react'
import { useWorkshopStore } from '../stores/workshop'
import { NewWorkshopWizard } from './NewWorkshopWizard'
import {
  X,
  FolderOpen,
  Plus,
  Calendar,
  MapPin,
  CalendarDays
} from 'lucide-react'

interface Props {
  onClose: () => void
}

export function WorkshopSelector({ onClose }: Props) {
  const { workshops, selectWorkshop } = useWorkshopStore()
  const [showWizard, setShowWizard] = useState(false)

  const handleSelect = async (workshopId: string) => {
    await selectWorkshop(workshopId)
    onClose()
  }

  // Show wizard for creating new workshop
  if (showWizard) {
    return (
      <NewWorkshopWizard
        onClose={() => setShowWizard(false)}
        onComplete={onClose}
      />
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Select Workshop
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-3">
            {workshops.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No workshops found</p>
                <p className="text-sm">Create your first workshop to get started</p>
              </div>
            ) : (
              workshops.map(workshop => (
                <button
                  key={workshop.id}
                  onClick={() => handleSelect(workshop.id)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-fastr-secondary hover:bg-fastr-light/30 transition-colors"
                >
                  <div className="font-medium text-gray-800">{workshop.name}</div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {workshop.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {workshop.date || 'No date set'}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {workshop.days} day{workshop.days > 1 ? 's' : ''}
                    </span>
                  </div>
                </button>
              ))
            )}

            <button
              onClick={() => setShowWizard(true)}
              className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-fastr-secondary hover:text-fastr-primary transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Workshop
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
