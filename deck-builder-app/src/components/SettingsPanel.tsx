import { useState, useEffect } from 'react'
import { useWorkshopStore } from '../stores/workshop'
import {
  X,
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
  Building,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

interface SettingsPanelProps {
  onClose: () => void
}

// Common country data fields that workshops typically need
const COMMON_COUNTRY_FIELDS = [
  { key: 'POPULATION', label: 'Population', placeholder: 'e.g., 19 million' },
  { key: 'FACILITY_COUNT', label: 'Number of health facilities', placeholder: 'e.g., 2,500' },
  { key: 'DISTRICT_COUNT', label: 'Number of districts', placeholder: 'e.g., 116' },
  { key: 'HMIS_NAME', label: 'HMIS system name', placeholder: 'e.g., DHIS2' },
]

type SectionKey = 'info' | 'content' | 'country' | 'days'

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { currentConfig, currentWorkshopId, saveCurrentWorkshop } = useWorkshopStore()

  // Collapsible sections
  const [expandedSections, setExpandedSections] = useState<Set<SectionKey>>(new Set(['info']))

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

  const toggleSection = (section: SectionKey) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

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

  if (!currentConfig) return null

  const numDays = currentConfig.schedule.days || 1

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Workshop Settings</h2>
            <p className="text-xs text-gray-500">
              Workshop ID: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{currentWorkshopId}</code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!hasChanges && saveStatus !== 'saved'}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
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
                  Save
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Workshop Info Section */}
            <section className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('info')}
                className="w-full px-4 py-3 bg-gray-50 flex items-center gap-2 text-left hover:bg-gray-100 transition-colors"
              >
                {expandedSections.has('info') ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <Globe className="w-4 h-4 text-fastr-primary" />
                <span className="text-sm font-semibold text-gray-700">Workshop Information</span>
              </button>
              {expandedSections.has('info') && (
                <div className="p-4 space-y-4">
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
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
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Workshop Content Section */}
            <section className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('content')}
                className="w-full px-4 py-3 bg-gray-50 flex items-center gap-2 text-left hover:bg-gray-100 transition-colors"
              >
                {expandedSections.has('content') ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <Target className="w-4 h-4 text-fastr-primary" />
                <span className="text-sm font-semibold text-gray-700">Workshop Content</span>
              </button>
              {expandedSections.has('content') && (
                <div className="p-4 space-y-4">
                  <p className="text-xs text-gray-500">
                    Enter bullet points (one per line) - these will be used to generate slides
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Workshop Objectives
                    </label>
                    <textarea
                      value={workshopContent.objectives}
                      onChange={e => updateWorkshopContent('objectives', e.target.value)}
                      placeholder="Enter objectives, one per line"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Scope of Work
                    </label>
                    <textarea
                      value={workshopContent.scope_of_work}
                      onChange={e => updateWorkshopContent('scope_of_work', e.target.value)}
                      placeholder="Enter scope items, one per line"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Expected Outputs
                    </label>
                    <textarea
                      value={workshopContent.expected_outputs}
                      onChange={e => updateWorkshopContent('expected_outputs', e.target.value)}
                      placeholder="Enter expected outputs, one per line"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Priorities / Key Focus Areas
                    </label>
                    <textarea
                      value={workshopContent.priorities}
                      onChange={e => updateWorkshopContent('priorities', e.target.value)}
                      placeholder="Enter priorities, one per line"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm font-mono"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Country Data Section */}
            <section className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('country')}
                className="w-full px-4 py-3 bg-gray-50 flex items-center gap-2 text-left hover:bg-gray-100 transition-colors"
              >
                {expandedSections.has('country') ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <Database className="w-4 h-4 text-fastr-primary" />
                <span className="text-sm font-semibold text-gray-700">Country Data Variables</span>
              </button>
              {expandedSections.has('country') && (
                <div className="p-4 space-y-4">
                  <p className="text-xs text-gray-500">
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
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Custom fields */}
                  {customFields.length > 0 && (
                    <div className="pt-4 border-t border-gray-100 space-y-2">
                      <h4 className="text-sm font-medium text-gray-600">Custom Variables</h4>
                      {customFields.map((field, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={field.key}
                            onChange={e => updateCustomField(idx, e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ''), field.value)}
                            placeholder="VARIABLE_NAME"
                            className="w-40 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm font-mono"
                          />
                          <input
                            type="text"
                            value={field.value}
                            onChange={e => updateCustomField(idx, field.key, e.target.value)}
                            placeholder="Value"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
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
                    className="flex items-center gap-1.5 text-sm text-fastr-primary hover:text-fastr-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add custom variable
                  </button>
                </div>
              )}
            </section>

            {/* Day Settings Section */}
            <section className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('days')}
                className="w-full px-4 py-3 bg-gray-50 flex items-center gap-2 text-left hover:bg-gray-100 transition-colors"
              >
                {expandedSections.has('days') ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <Clock className="w-4 h-4 text-fastr-primary" />
                <span className="text-sm font-semibold text-gray-700">Day Settings</span>
              </button>
              {expandedSections.has('days') && (
                <div className="p-4 space-y-2">
                  {Array.from({ length: numDays }, (_, i) => i + 1).map(day => (
                    <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700 w-16">Day {day}</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={dayTitles[day] || ''}
                          onChange={e => updateDayTitle(day, e.target.value)}
                          placeholder={`Day ${day} title (optional)`}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="w-28">
                        <input
                          type="text"
                          value={dayStartTimes[day] || ''}
                          onChange={e => updateDayStartTime(day, e.target.value)}
                          placeholder="09:00"
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
