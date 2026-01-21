import { useState } from 'react'
import { useWorkshopStore, WorkshopConfig } from '../stores/workshop'
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
  const { workshops, selectWorkshop, createWorkshop, isLoading } = useWorkshopStore()
  const [showCreate, setShowCreate] = useState(false)
  const [newWorkshop, setNewWorkshop] = useState({
    country: '',
    location: '',
    dates: '',
    days: 2,
  })

  const handleSelect = async (workshopId: string) => {
    await selectWorkshop(workshopId)
    onClose()
  }

  const handleCreate = async () => {
    if (!newWorkshop.country) return

    const year = new Date().getFullYear()
    const workshopId = `${year}-${newWorkshop.country.toLowerCase().replace(/[^a-z0-9]/g, '')}`

    const config: WorkshopConfig = {
      workshop: {
        name: `FASTR Workshop - ${newWorkshop.country}`,
        country: newWorkshop.country,
        location: newWorkshop.location || newWorkshop.country,
        date: newWorkshop.dates,
        facilitators: 'TBD',
      },
      schedule: {
        days: newWorkshop.days,
      },
      content: {
        modules: [],
        custom_slides: [],
      },
      country_data: {
        COUNTRY: newWorkshop.country,
        LOCATION: newWorkshop.location || newWorkshop.country,
        DATE: newWorkshop.dates,
      },
    }

    // Add empty days
    for (let i = 1; i <= newWorkshop.days; i++) {
      (config.schedule as any)[`day${i}`] = []
    }

    await createWorkshop(workshopId, config)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {showCreate ? 'Create Workshop' : 'Select Workshop'}
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
          {showCreate ? (
            // Create form
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={newWorkshop.country}
                  onChange={e => setNewWorkshop({ ...newWorkshop, country: e.target.value })}
                  placeholder="e.g., Zambia"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newWorkshop.location}
                  onChange={e => setNewWorkshop({ ...newWorkshop, location: e.target.value })}
                  placeholder="e.g., Lusaka"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dates
                </label>
                <input
                  type="text"
                  value={newWorkshop.dates}
                  onChange={e => setNewWorkshop({ ...newWorkshop, dates: e.target.value })}
                  placeholder="e.g., January 27-30, 2026"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Days
                </label>
                <select
                  value={newWorkshop.days}
                  onChange={e => setNewWorkshop({ ...newWorkshop, days: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>
                      {n} day{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newWorkshop.country || isLoading}
                  className="flex-1 px-4 py-2 bg-fastr-primary text-white rounded-md hover:bg-fastr-primary/90 transition-colors disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            // Workshop list
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
                onClick={() => setShowCreate(true)}
                className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-fastr-secondary hover:text-fastr-primary transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create New Workshop
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
