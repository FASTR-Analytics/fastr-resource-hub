/**
 * NewWorkshopWizard Component
 *
 * Simple wizard: Basic info → Pick modules → AI generates content → Review
 */

import { useState } from 'react'
import { useWorkshopStore, WorkshopConfig, Session } from '../stores/workshop'
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Wand2,
  Loader2,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Clock,
  AlertCircle,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & DATA
// ═══════════════════════════════════════════════════════════════════════════════

interface Props {
  onClose: () => void
  onComplete: () => void
}

type WizardStep = 'basics' | 'modules' | 'generating' | 'review'

// Module definitions with accurate descriptions from content
const MODULES = [
  { id: 'm0', name: 'Introduction to FASTR', duration: 60, description: 'Framework overview: rapid-cycle analytics for health monitoring' },
  { id: 'm1', name: 'Identify Questions & Indicators', duration: 90, description: 'Define use cases, select indicators with stakeholders' },
  { id: 'm2', name: 'Data Extraction', duration: 120, description: 'Extract DHIS2 data using API Script or Data Downloader' },
  { id: 'm3', name: 'FASTR Analytics Platform', duration: 90, description: 'Configure platform, import data, run analysis modules' },
  { id: 'm4', name: 'Data Quality Assessment', duration: 120, description: 'Assess completeness, outliers, internal consistency' },
  { id: 'm5', name: 'Data Quality Adjustment', duration: 90, description: 'Apply outlier replacement and missing data imputation' },
  { id: 'm6', name: 'Data Analysis', duration: 180, description: 'Service utilization trends and coverage estimation' },
  { id: 'm7', name: 'Results Communication', duration: 120, description: 'Interpret findings, create visualizations, stakeholder engagement' },
]

interface WizardData {
  country: string
  location: string
  dates: string
  days: number
  facilitators: string
  selectedModules: string[]
  objectives: string
  agenda: Record<number, Session[]>
  // Schedule settings
  startTime: string      // e.g., "09:00"
  lunchTime: string      // e.g., "12:30"
  lunchDuration: number  // minutes
  teaDuration: number    // minutes
  endTime: string        // e.g., "17:00"
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function NewWorkshopWizard({ onClose, onComplete }: Props) {
  const { createWorkshop, isLoading } = useWorkshopStore()

  const [step, setStep] = useState<WizardStep>('basics')
  const [isGenerating, setIsGenerating] = useState(false)

  const [data, setData] = useState<WizardData>({
    country: '',
    location: '',
    dates: '',
    days: 3,
    facilitators: '',
    selectedModules: ['m0', 'm1', 'm2', 'm4', 'm6', 'm7'], // Default selection
    objectives: '',
    agenda: {},
    // Schedule defaults
    startTime: '09:00',
    lunchTime: '12:30',
    lunchDuration: 60,
    teaDuration: 15,
    endTime: '17:00',
  })

  // Calculate total time
  const totalMinutes = data.selectedModules.reduce((sum, id) => {
    const mod = MODULES.find(m => m.id === id)
    return sum + (mod?.duration || 0)
  }, 0)

  // Available time per day (9:00-17:00 minus 1hr lunch, 30min breaks = ~5.5 hrs)
  const minutesPerDay = 330
  const totalAvailableMinutes = data.days * minutesPerDay
  const fitsInDays = totalMinutes <= totalAvailableMinutes

  // Toggle module selection
  const toggleModule = (moduleId: string) => {
    const current = data.selectedModules
    if (current.includes(moduleId)) {
      setData({ ...data, selectedModules: current.filter(id => id !== moduleId) })
    } else {
      setData({ ...data, selectedModules: [...current, moduleId] })
    }
  }

  // Parse time string to minutes since midnight
  const parseTime = (time: string): number => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
  }

  // Format minutes since midnight to time string
  const formatTime = (mins: number): string => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
  }

  // Build agenda from selected modules with proper time slots
  const buildAgenda = (): Record<number, Session[]> => {
    const agenda: Record<number, Session[]> = {}
    const selected = MODULES.filter(m => data.selectedModules.includes(m.id))

    const startMins = parseTime(data.startTime)
    const lunchMins = parseTime(data.lunchTime)
    const endMins = parseTime(data.endTime)

    // Morning tea: halfway between start and lunch
    const morningTeaMins = startMins + Math.floor((lunchMins - startMins) / 2)
    // Afternoon tea: halfway between lunch end and day end
    const afternoonTeaMins = lunchMins + data.lunchDuration + Math.floor((endMins - lunchMins - data.lunchDuration) / 2)

    let currentDay = 1
    let currentTime = startMins
    let moduleIndex = 0

    // Initialize all days
    for (let day = 1; day <= data.days; day++) {
      agenda[day] = []
    }

    // Build each day
    for (let day = 1; day <= data.days; day++) {
      currentTime = startMins
      let morningTeaAdded = false
      let lunchAdded = false
      let afternoonTeaAdded = false

      // Day opening
      if (day === 1) {
        agenda[day].push({
          _id: `title-${Date.now()}-${day}`,
          session: 'Opening & Welcome',
          slides: ['title'],
          duration: 15,
          icon: 'cover',
          time: formatTime(currentTime),
        })
        currentTime += 15
        agenda[day].push({
          _id: `objectives-${Date.now()}-${day}`,
          session: 'Workshop Objectives & Agenda',
          slides: ['01_objectives.md', 'agenda'],
          duration: 15,
          icon: 'target',
          time: formatTime(currentTime),
        })
        currentTime += 15
      } else {
        agenda[day].push({
          _id: `recap-${day}-${Date.now()}`,
          session: `Day ${day} Recap`,
          type: 'day_recap',
          duration: 15,
          icon: 'recap',
          time: formatTime(currentTime),
          recap_yesterday: '',
          recap_today: '',
        })
        currentTime += 15
      }

      // Add modules and breaks
      while (moduleIndex < selected.length && currentTime < endMins - 15) {
        const mod = selected[moduleIndex]

        // Morning tea break
        if (!morningTeaAdded && currentTime >= morningTeaMins - 15 && currentTime < lunchMins) {
          agenda[day].push({
            _id: `tea-am-${day}-${Date.now()}`,
            session: 'Tea Break',
            type: 'break',
            duration: data.teaDuration,
            icon: 'coffee',
            time: formatTime(currentTime),
          })
          currentTime += data.teaDuration
          morningTeaAdded = true
        }

        // Lunch break
        if (!lunchAdded && currentTime >= lunchMins - 30) {
          agenda[day].push({
            _id: `lunch-${day}-${Date.now()}`,
            session: 'Lunch Break',
            type: 'break',
            duration: data.lunchDuration,
            icon: 'lunch',
            time: formatTime(currentTime),
          })
          currentTime += data.lunchDuration
          lunchAdded = true
        }

        // Afternoon tea break
        if (!afternoonTeaAdded && lunchAdded && currentTime >= afternoonTeaMins - 15) {
          agenda[day].push({
            _id: `tea-pm-${day}-${Date.now()}`,
            session: 'Tea Break',
            type: 'break',
            duration: data.teaDuration,
            icon: 'coffee',
            time: formatTime(currentTime),
          })
          currentTime += data.teaDuration
          afternoonTeaAdded = true
        }

        // Check if module fits today
        if (currentTime + mod.duration > endMins - 5) {
          // Doesn't fit, move to next day
          break
        }

        // Add module
        agenda[day].push({
          _id: `${mod.id}-${Date.now()}-${day}`,
          session: mod.name,
          module: mod.id,
          duration: mod.duration,
          icon: 'module',
          time: formatTime(currentTime),
        })
        currentTime += mod.duration
        moduleIndex++
      }

      // Day end
      if (day < data.days || moduleIndex >= selected.length) {
        if (day === data.days && moduleIndex >= selected.length) {
          agenda[day].push({
            _id: `closing-${Date.now()}`,
            session: 'Closing & Next Steps',
            slides: ['closing.md'],
            duration: 15,
            icon: 'end',
            time: formatTime(currentTime),
          })
        } else {
          agenda[day].push({
            _id: `dayend-${day}-${Date.now()}`,
            session: `Day ${day} Wrap-up`,
            type: 'day_end',
            duration: 10,
            icon: 'sunset',
            time: formatTime(currentTime),
            wrapup_message: '',
          })
        }
      }
    }

    return agenda
  }

  // Generate content and build agenda
  const generateAndBuild = async () => {
    setIsGenerating(true)
    setStep('generating')

    const selectedNames = data.selectedModules
      .map(id => MODULES.find(m => m.id === id)?.name)
      .filter(Boolean)
      .join(', ')

    try {
      const prompt = `Write 4 learning objectives for a FASTR workshop in ${data.country} covering: ${selectedNames}.

Output ONLY the objectives, one per line, no numbers or bullets.`

      const objectives = await window.electronAPI.aiGenerateText(prompt, { country: data.country })
      const agenda = buildAgenda()

      setData(prev => ({
        ...prev,
        objectives: objectives.trim(),
        agenda,
      }))
    } catch (error) {
      console.error('Generation error:', error)
      const agenda = buildAgenda()
      setData(prev => ({ ...prev, agenda }))
    }

    setStep('review')
    setIsGenerating(false)
  }

  // Create workshop
  const handleCreate = async () => {
    const year = new Date().getFullYear()
    const workshopId = `${year}-${data.country.toLowerCase().replace(/[^a-z0-9]/g, '')}`

    const config: WorkshopConfig = {
      workshop: {
        name: `FASTR Workshop - ${data.country}`,
        country: data.country,
        location: data.location || data.country,
        date: data.dates,
        facilitators: data.facilitators || 'TBD',
        objectives: data.objectives,
      },
      schedule: {
        days: data.days,
        day_start_times: {},
      },
      content: {
        modules: data.selectedModules.map(id => parseInt(id.replace('m', ''))),
        custom_slides: [],
      },
      country_data: {
        COUNTRY: data.country,
        LOCATION: data.location || data.country,
        DATE: data.dates,
      },
    }

    for (let i = 1; i <= data.days; i++) {
      (config.schedule as any)[`day${i}`] = data.agenda[i] || [];
      (config.schedule.day_start_times as any)[i] = '09:00'
    }

    await createWorkshop(workshopId, config)
    onComplete()
  }

  // Format duration
  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    if (hours === 0) return `${minutes}min`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}min`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Create New Workshop</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Info */}
          {step === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={data.country}
                      onChange={e => setData({ ...data, country: e.target.value })}
                      placeholder="e.g., Zambia"
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={data.location}
                    onChange={e => setData({ ...data, location: e.target.value })}
                    placeholder="e.g., Lusaka"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={data.dates}
                      onChange={e => setData({ ...data, dates: e.target.value })}
                      placeholder="e.g., Jan 27-30, 2026"
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                  <select
                    value={data.days}
                    onChange={e => setData({ ...data, days: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} day{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facilitators</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={data.facilitators}
                    onChange={e => setData({ ...data, facilitators: e.target.value })}
                    placeholder="e.g., John Smith, Jane Doe"
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary"
                  />
                </div>
              </div>

              {/* Schedule Settings */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Daily Schedule
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start</label>
                    <select
                      value={data.startTime}
                      onChange={e => setData({ ...data, startTime: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary"
                    >
                      <option value="08:00">08:00</option>
                      <option value="08:30">08:30</option>
                      <option value="09:00">09:00</option>
                      <option value="09:30">09:30</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lunch at</label>
                    <select
                      value={data.lunchTime}
                      onChange={e => setData({ ...data, lunchTime: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary"
                    >
                      <option value="12:00">12:00</option>
                      <option value="12:30">12:30</option>
                      <option value="13:00">13:00</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lunch</label>
                    <select
                      value={data.lunchDuration}
                      onChange={e => setData({ ...data, lunchDuration: parseInt(e.target.value) })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary"
                    >
                      <option value="45">45 min</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End</label>
                    <select
                      value={data.endTime}
                      onChange={e => setData({ ...data, endTime: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary"
                    >
                      <option value="16:00">16:00</option>
                      <option value="16:30">16:30</option>
                      <option value="17:00">17:00</option>
                      <option value="17:30">17:30</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Tea breaks (15 min) added mid-morning and mid-afternoon automatically
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Module Picker */}
          {step === 'modules' && (
            <div className="space-y-4">
              <p className="text-gray-600">Select the modules to include in your workshop.</p>

              <div className="space-y-2">
                {MODULES.map(mod => (
                  <label
                    key={mod.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      data.selectedModules.includes(mod.id)
                        ? 'border-fastr-primary bg-fastr-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={data.selectedModules.includes(mod.id)}
                      onChange={() => toggleModule(mod.id)}
                      className="w-4 h-4 text-fastr-primary rounded focus:ring-fastr-primary"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{mod.name}</div>
                      <div className="text-xs text-gray-500">{mod.description}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatDuration(mod.duration)}
                    </div>
                  </label>
                ))}
              </div>

              {/* Time summary */}
              <div className={`p-4 rounded-lg ${fitsInDays ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {fitsInDays ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    )}
                    <span className={`font-medium ${fitsInDays ? 'text-green-700' : 'text-amber-700'}`}>
                      Total: {formatDuration(totalMinutes)}
                    </span>
                  </div>
                  <span className={`text-sm ${fitsInDays ? 'text-green-600' : 'text-amber-600'}`}>
                    {fitsInDays
                      ? `Fits in ${data.days} day${data.days > 1 ? 's' : ''}`
                      : `May need ${Math.ceil(totalMinutes / minutesPerDay)} days`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Generating */}
          {step === 'generating' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-fastr-primary animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">Building Your Workshop</h3>
              <p className="text-gray-500 text-sm mt-1">Generating agenda and content...</p>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 'review' && (
            <div className="space-y-4">
              {/* Workshop summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  FASTR Workshop - {data.country}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span>{data.location || data.country}</span>
                  {data.dates && <span>{data.dates}</span>}
                  <span>{data.days} day{data.days > 1 ? 's' : ''}</span>
                  {data.facilitators && <span>• {data.facilitators}</span>}
                </div>
              </div>

              {/* Agenda with times */}
              <div className="space-y-3">
                {Object.entries(data.agenda).map(([day, sessions]) => (
                  <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-fastr-primary/10 px-4 py-2 border-b border-gray-200">
                      <span className="font-semibold text-fastr-primary">Day {day}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {data.startTime} - {data.endTime}
                      </span>
                    </div>
                    <table className="w-full text-sm">
                      <tbody>
                        {(sessions as Session[]).map((session, idx) => {
                          const endTime = formatTime(
                            parseTime(session.time || '00:00') + (session.duration || 0)
                          )
                          const isBreak = session.type === 'break'
                          return (
                            <tr
                              key={session._id || idx}
                              className={`border-b border-gray-100 last:border-0 ${
                                isBreak ? 'bg-amber-50/50' : ''
                              }`}
                            >
                              <td className="px-3 py-2 w-24 text-gray-500 font-mono text-xs">
                                {session.time} - {endTime}
                              </td>
                              <td className={`px-3 py-2 ${isBreak ? 'text-amber-700' : 'text-gray-800'}`}>
                                {session.session}
                                {session.module && (
                                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-fastr-primary/10 text-fastr-primary rounded">
                                    {session.duration}min
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <Check className="w-4 h-4" />
                Ready! You can customize sessions, times, and content after creation.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => {
              if (step === 'basics') onClose()
              else if (step === 'modules') setStep('basics')
              else if (step === 'review') setStep('modules')
            }}
            disabled={step === 'generating'}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 'basics' ? 'Cancel' : 'Back'}
          </button>

          {step === 'basics' && (
            <button
              onClick={() => setStep('modules')}
              disabled={!data.country.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 disabled:opacity-50"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 'modules' && (
            <button
              onClick={generateAndBuild}
              disabled={data.selectedModules.length === 0}
              className="flex items-center gap-2 px-6 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4" />
              Build Workshop
            </button>
          )}

          {step === 'review' && (
            <button
              onClick={handleCreate}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-fastr-primary text-white rounded-lg hover:bg-fastr-primary/90 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Create Workshop
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NewWorkshopWizard
