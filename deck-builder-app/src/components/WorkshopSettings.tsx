import { useState, useEffect } from 'react'
import { useWorkshopStore } from '../stores/workshop'
import {
  Save,
  MapPin,
  Calendar,
  Users,
  Globe,
  Database,
  Clock,
  Plus,
  Trash2,
  Check,
  Target,
  Mail,
  Building
} from 'lucide-react'

// Common country data fields that workshops typically need
const COMMON_COUNTRY_FIELDS = [
  { key: 'POPULATION', label: 'Population', placeholder: 'e.g., 19 million' },
  { key: 'FACILITY_COUNT', label: 'Number of health facilities', placeholder: 'e.g., 2,500' },
  { key: 'DISTRICT_COUNT', label: 'Number of districts', placeholder: 'e.g., 116' },
  { key: 'HMIS_NAME', label: 'HMIS system name', placeholder: 'e.g., DHIS2' },
]

export function WorkshopSettings() {
  const { currentConfig, currentWorkshopId, saveCurrentWorkshop } = useWorkshopStore()

  // Local state for editing
  const [workshopInfo, setWorkshopInfo] = useState({
    name: '',
    country: '',
    location: '',
    venue: '',
    date: '',
    facilitators: '',
    contact_email: '',
    website: '',
  })

  const [workshopContent, setWorkshopContent] = useState({
    objectives: '',
    scope_of_work: '',
    expected_outputs: '',
    priorities: '',
  })

  const [countryData, setCountryData] = useState<Record<string, string>>({})
  const [customFields, setCustomFields] = useState<{ key: string; value: string }[]>([])
  const [dayTitles, setDayTitles] = useState<Record<number, string>>({})
  const [dayStartTimes, setDayStartTimes] = useState<Record<number, string>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  // Load current config into local state
  useEffect(() => {
    if (currentConfig) {
      setWorkshopInfo({
        name: currentConfig.workshop.name || '',
        country: currentConfig.workshop.country || '',
        location: currentConfig.workshop.location || '',
        venue: currentConfig.workshop.venue || '',
        date: currentConfig.workshop.date || '',
        facilitators: currentConfig.workshop.facilitators || '',
        contact_email: currentConfig.workshop.contact_email || '',
        website: currentConfig.workshop.website || '',
      })

      setWorkshopContent({
        objectives: currentConfig.workshop.objectives || '',
        scope_of_work: currentConfig.workshop.scope_of_work || '',
        expected_outputs: currentConfig.workshop.expected_outputs || '',
        priorities: currentConfig.workshop.priorities || '',
      })

      // Separate common fields from custom fields
      const data = currentConfig.country_data || {}
      const commonKeys = COMMON_COUNTRY_FIELDS.map(f => f.key)
      const custom: { key: string; value: string }[] = []

      Object.entries(data).forEach(([key, value]) => {
        if (!commonKeys.includes(key) && !['COUNTRY', 'LOCATION', 'DATE', 'WORKSHOP_NAME'].includes(key)) {
          custom.push({ key, value })
        }
      })

      setCountryData(data)
      setCustomFields(custom)
      setDayTitles(currentConfig.schedule.day_titles || {})
      setDayStartTimes(currentConfig.schedule.day_start_times || {})
      setHasChanges(false)
    }
  }, [currentConfig, currentWorkshopId])

  const handleSave = async () => {
    if (!currentConfig) return

    setSaveStatus('saving')

    // Build updated config
    const updatedConfig = {
      ...currentConfig,
      workshop: {
        ...currentConfig.workshop,
        ...workshopInfo,
        ...workshopContent,
      },
      schedule: {
        ...currentConfig.schedule,
        day_titles: dayTitles,
        day_start_times: dayStartTimes,
      },
      country_data: {
        ...countryData,
        // Ensure common fields are synced
        COUNTRY: workshopInfo.country,
        LOCATION: workshopInfo.location,
        DATE: workshopInfo.date,
        WORKSHOP_NAME: workshopInfo.name,
        FACILITATORS: workshopInfo.facilitators,
        CONTACT_EMAIL: workshopInfo.contact_email,
        WEBSITE: workshopInfo.website,
        VENUE: workshopInfo.venue,
        // Add custom fields
        ...Object.fromEntries(customFields.filter(f => f.key).map(f => [f.key, f.value])),
      },
    }

    // Update store and save
    useWorkshopStore.setState({ currentConfig: updatedConfig })
    await saveCurrentWorkshop()
    setHasChanges(false)
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus('idle'), 2000)
  }

  const updateWorkshopInfo = (key: string, value: string) => {
    setWorkshopInfo(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
    setSaveStatus('idle')
  }

  const updateWorkshopContent = (key: string, value: string) => {
    setWorkshopContent(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
    setSaveStatus('idle')
  }

  const updateCountryData = (key: string, value: string) => {
    setCountryData(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
    setSaveStatus('idle')
  }

  const updateDayTitle = (day: number, title: string) => {
    setDayTitles(prev => ({ ...prev, [day]: title }))
    setHasChanges(true)
    setSaveStatus('idle')
  }

  const updateDayStartTime = (day: number, time: string) => {
    setDayStartTimes(prev => ({ ...prev, [day]: time }))
    setHasChanges(true)
    setSaveStatus('idle')
  }

  const addCustomField = () => {
    setCustomFields(prev => [...prev, { key: '', value: '' }])
    setHasChanges(true)
    setSaveStatus('idle')
  }

  const updateCustomField = (index: number, key: string, value: string) => {
    setCustomFields(prev => {
      const updated = [...prev]
      updated[index] = { key, value }
      return updated
    })
    setHasChanges(true)
    setSaveStatus('idle')
  }

  const removeCustomField = (index: number) => {
    setCustomFields(prev => prev.filter((_, i) => i !== index))
    setHasChanges(true)
    setSaveStatus('idle')
  }

  if (!currentConfig) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Select a workshop to edit settings
      </div>
    )
  }

  const numDays = currentConfig.schedule.days || 1

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Sticky header with save button */}
      <div className="px-6 py-3 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="font-medium text-gray-800">Workshop Settings</h3>
          <p className="text-xs text-gray-500">
            Workshop ID: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{currentWorkshopId}</code>
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges && saveStatus !== 'saved'}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-md transition-colors text-sm font-medium ${
            saveStatus === 'saved'
              ? 'bg-green-500 text-white'
              : hasChanges
              ? 'bg-fastr-primary text-white hover:bg-fastr-primary/90'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {saveStatus === 'saved' ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : saveStatus === 'saving' ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Workshop Info Section */}
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-fastr-primary" />
              Workshop Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Workshop Name
                </label>
                <input
                  type="text"
                  value={workshopInfo.name}
                  onChange={e => updateWorkshopInfo('name', e.target.value)}
                  placeholder="e.g., FASTR Workshop - Zambia"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  Country
                </label>
                <input
                  type="text"
                  value={workshopInfo.country}
                  onChange={e => updateWorkshopInfo('country', e.target.value)}
                  placeholder="e.g., Zambia"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />
                  City/Location
                </label>
                <input
                  type="text"
                  value={workshopInfo.location}
                  onChange={e => updateWorkshopInfo('location', e.target.value)}
                  placeholder="e.g., Lusaka"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <Building className="w-3.5 h-3.5 inline mr-1" />
                  Venue
                </label>
                <input
                  type="text"
                  value={workshopInfo.venue}
                  onChange={e => updateWorkshopInfo('venue', e.target.value)}
                  placeholder="e.g., Protea Hotel by Marriott"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />
                  Dates
                </label>
                <input
                  type="text"
                  value={workshopInfo.date}
                  onChange={e => updateWorkshopInfo('date', e.target.value)}
                  placeholder="e.g., January 27-30, 2026"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <Users className="w-3.5 h-3.5 inline mr-1" />
                  Facilitators
                </label>
                <input
                  type="text"
                  value={workshopInfo.facilitators}
                  onChange={e => updateWorkshopInfo('facilitators', e.target.value)}
                  placeholder="e.g., GFF FASTR Team"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <Mail className="w-3.5 h-3.5 inline mr-1" />
                  Contact Email
                </label>
                <input
                  type="email"
                  value={workshopInfo.contact_email}
                  onChange={e => updateWorkshopInfo('contact_email', e.target.value)}
                  placeholder="e.g., contact@example.org"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <Globe className="w-3.5 h-3.5 inline mr-1" />
                  Website
                </label>
                <input
                  type="url"
                  value={workshopInfo.website}
                  onChange={e => updateWorkshopInfo('website', e.target.value)}
                  placeholder="e.g., https://fastr-analytics.org"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
                />
              </div>
            </div>
          </section>

          {/* Workshop Content Section */}
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-fastr-primary" />
              Workshop Content
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Enter bullet points (one per line) - these will be used to generate slides
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Workshop Objectives
                </label>
                <textarea
                  value={workshopContent.objectives}
                  onChange={e => updateWorkshopContent('objectives', e.target.value)}
                  placeholder="Enter objectives, one per line:&#10;- Strengthen capacity for data analysis&#10;- Configure the analytics platform&#10;- Produce the first quarterly report"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Scope of Work
                </label>
                <textarea
                  value={workshopContent.scope_of_work}
                  onChange={e => updateWorkshopContent('scope_of_work', e.target.value)}
                  placeholder="Enter scope items, one per line:&#10;- RMNCAH-N service delivery analysis&#10;- Data quality assessment&#10;- Coverage estimation"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Expected Outputs
                </label>
                <textarea
                  value={workshopContent.expected_outputs}
                  onChange={e => updateWorkshopContent('expected_outputs', e.target.value)}
                  placeholder="Enter expected outputs, one per line:&#10;- Configured analytics platform&#10;- Draft quarterly report&#10;- Trained staff"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Priorities / Key Focus Areas
                </label>
                <textarea
                  value={workshopContent.priorities}
                  onChange={e => updateWorkshopContent('priorities', e.target.value)}
                  placeholder="Enter priorities, one per line:&#10;- Maternal health indicators&#10;- Under-5 mortality&#10;- Immunization coverage"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm font-mono"
                />
              </div>
            </div>
          </section>

          {/* Country Data Section */}
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-fastr-primary" />
              Country Data Variables
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              These values are used in slides as {'{{VARIABLE_NAME}}'} placeholders
            </p>
            <div className="grid grid-cols-2 gap-4">
              {COMMON_COUNTRY_FIELDS.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    {field.label}
                    <span className="text-xs text-gray-400 ml-1 font-mono">{`{{${field.key}}}`}</span>
                  </label>
                  <input
                    type="text"
                    value={countryData[field.key] || ''}
                    onChange={e => updateCountryData(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Custom fields */}
            {customFields.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Custom Variables</h4>
                {customFields.map((field, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={field.key}
                      onChange={e => updateCustomField(idx, e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''), field.value)}
                      placeholder="VARIABLE_NAME"
                      className="w-40 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm font-mono"
                    />
                    <input
                      type="text"
                      value={field.value}
                      onChange={e => updateCustomField(idx, field.key, e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => removeCustomField(idx)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={addCustomField}
              className="mt-4 flex items-center gap-1.5 text-sm text-fastr-primary hover:text-fastr-secondary transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add custom variable
            </button>
          </section>

          {/* Day Settings Section */}
          <section className="bg-white rounded-lg border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-fastr-primary" />
              Day Settings
            </h3>
            <div className="space-y-3">
              {Array.from({ length: numDays }, (_, i) => i + 1).map(day => (
                <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700 w-16">Day {day}</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={dayTitles[day] || ''}
                      onChange={e => updateDayTitle(day, e.target.value)}
                      placeholder={`Day ${day} title (optional)`}
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="text"
                      value={dayStartTimes[day] || ''}
                      onChange={e => updateDayStartTime(day, e.target.value)}
                      placeholder="9:00 AM"
                      className="w-full px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
