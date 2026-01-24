import { useEffect, useState } from 'react'
import { useWorkshopStore } from './stores/workshop'
import { DeckPreview } from './components/DeckPreview'
import { AIAssistant } from './components/AIAssistant'
import {
  Layers,
  BookOpen,
  Sparkles,
  Settings,
  Eye,
  Download,
  ChevronDown,
  Menu,
  X,
  Check,
  RefreshCw,
  FileText,
  Presentation,
} from 'lucide-react'

function App() {
  const {
    currentWorkshopId,
    currentConfig,
    workshops,
    loadWorkshops,
    loadContentLibrary,
    selectWorkshop,
    error,
    setError,
    saveStatus,
  } = useWorkshopStore()

  const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [showWorkshopSelector, setShowWorkshopSelector] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isBuilding, setIsBuilding] = useState(false)

  // Load data on mount
  useEffect(() => {
    loadWorkshops()
    loadContentLibrary()
  }, [])

  // Show workshop selector if no workshop is selected
  useEffect(() => {
    if (!currentWorkshopId && workshops.length > 0) {
      setShowWorkshopSelector(true)
    }
  }, [currentWorkshopId, workshops])

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowExportMenu(false)
    if (showExportMenu) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [showExportMenu])

  // Build deck
  const handleBuild = async (format: 'html' | 'pdf' | 'pptx') => {
    if (!currentWorkshopId) return
    setIsBuilding(true)
    setShowExportMenu(false)

    try {
      let downloadUrl = ''

      if (format === 'html') {
        await fetch(`/api/export/${currentWorkshopId}/html`, { method: 'POST' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/html`
      } else if (format === 'pdf') {
        await fetch(`/api/export/${currentWorkshopId}/pdf`, { method: 'POST' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/pdf`
      } else if (format === 'pptx') {
        await fetch(`/api/export/${currentWorkshopId}/pptx`, { method: 'POST' })
        downloadUrl = `/api/export/${currentWorkshopId}/download/pptx`
      }

      // Trigger download
      if (downloadUrl) {
        window.open(downloadUrl, '_blank')
      }
    } catch (error: any) {
      alert(`Build failed: ${error.message}`)
    }
    setIsBuilding(false)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header / Toolbar */}
      <header className="bg-fastr-primary text-white px-4 py-2 flex items-center justify-between shadow-md z-20">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6" />
          <h1 className="font-semibold text-lg">FASTR Deck Builder</h1>
        </div>

        {/* Workshop selector */}
        {currentWorkshopId && (
          <button
            onClick={() => setShowWorkshopSelector(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium max-w-[200px] truncate">
              {currentConfig?.workshop?.name || currentWorkshopId}
            </span>
            <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {/* Toolbar buttons */}
        <div className="flex items-center gap-1">
          {/* Save status */}
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-xs text-white/70 px-2">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 text-xs text-green-300 px-2">
              <Check className="w-3 h-3" />
              Saved
            </span>
          )}

          {/* Library toggle */}
          <button
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className={`p-2 rounded-md transition-colors ${
              leftPanelOpen ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
            }`}
            title="Content Library"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* AI toggle */}
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className={`p-2 rounded-md transition-colors ${
              rightPanelOpen ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
            }`}
            title="AI Assistant"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-white/20 mx-1" />

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-md text-white/80 hover:bg-white/10 transition-colors"
            title="Workshop Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Preview */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`p-2 rounded-md transition-colors ${
              showPreview ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
            }`}
            title="Preview Deck"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowExportMenu(!showExportMenu)
              }}
              disabled={isBuilding || !currentWorkshopId}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              {isBuilding ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">Export</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-30">
                <button
                  onClick={() => handleBuild('html')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span>Export HTML</span>
                </button>
                <button
                  onClick={() => handleBuild('pdf')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={() => handleBuild('pptx')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Presentation className="w-4 h-4 text-gray-400" />
                  <span>Export PowerPoint</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-100 border-b border-red-200 text-red-700 px-4 py-2 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel - Content Library (slide-out) */}
        <div
          className={`absolute left-0 top-0 bottom-0 z-10 transition-transform duration-300 ease-in-out ${
            leftPanelOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full w-80 bg-white border-r border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Content Library</span>
              <button
                onClick={() => setLeftPanelOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <p className="text-sm text-gray-500">Content library coming soon...</p>
            </div>
          </div>
        </div>

        {/* Center - Main content */}
        <main className="flex-1 overflow-hidden">
          {currentWorkshopId ? (
            showPreview ? (
              <DeckPreview />
            ) : (
              <div className="h-full overflow-auto p-4">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-xl font-semibold mb-4">
                    {currentConfig?.workshop?.name || 'Workshop'}
                  </h2>

                  {/* Day columns */}
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {Array.from({ length: currentConfig?.schedule?.days || 0 }).map((_, i) => {
                      const dayNum = i + 1
                      const dayKey = `day${dayNum}`
                      const sessions = currentConfig?.schedule?.[dayKey] || []

                      return (
                        <div key={dayNum} className="flex-shrink-0 w-72 bg-white rounded-lg shadow p-4">
                          <h3 className="font-medium text-gray-700 mb-3">
                            Day {dayNum}
                            {currentConfig?.schedule?.day_titles?.[dayNum] && (
                              <span className="text-gray-400 font-normal">
                                {' '}- {currentConfig.schedule.day_titles[dayNum]}
                              </span>
                            )}
                          </h3>

                          <div className="space-y-2">
                            {sessions.map((session: any, idx: number) => (
                              <div
                                key={session._id || idx}
                                className={`p-3 rounded-md border ${
                                  session.type === 'break'
                                    ? 'bg-amber-50 border-amber-200'
                                    : session.module
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="text-sm font-medium">{session.session}</div>
                                {session.duration > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {session.duration} min
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Layers className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Select or create a workshop to get started</p>
                <button
                  onClick={() => setShowWorkshopSelector(true)}
                  className="mt-4 px-4 py-2 bg-fastr-primary text-white rounded-md hover:bg-fastr-primary/90 transition-colors"
                >
                  Choose Workshop
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - AI Assistant (slide-out) */}
        <div
          className={`absolute right-0 top-0 bottom-0 z-10 transition-transform duration-300 ease-in-out ${
            rightPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">AI Assistant</span>
              <button
                onClick={() => setRightPanelOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIAssistant />
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Selector Modal */}
      {showWorkshopSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold">Select Workshop</h2>
              <button
                onClick={() => setShowWorkshopSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-auto">
              {workshops.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No workshops found</p>
              ) : (
                <div className="space-y-2">
                  {workshops.map((workshop) => (
                    <button
                      key={workshop.id}
                      onClick={() => {
                        selectWorkshop(workshop.id)
                        setShowWorkshopSelector(false)
                      }}
                      className={`w-full text-left p-3 rounded-md border transition-colors ${
                        currentWorkshopId === workshop.id
                          ? 'bg-fastr-primary/10 border-fastr-primary'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="font-medium">{workshop.name}</div>
                      <div className="text-sm text-gray-500">
                        {workshop.country} • {workshop.location}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold">Workshop Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-500">Settings panel coming soon...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
