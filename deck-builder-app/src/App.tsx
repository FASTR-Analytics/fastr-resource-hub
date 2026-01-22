import { useEffect, useState } from 'react'
import { useWorkshopStore } from './stores/workshop'
import { KanbanBoard } from './components/KanbanBoard'
import { ContentLibrary } from './components/ContentLibrary'
import { AIAssistant } from './components/AIAssistant'
import { WorkshopSelector } from './components/WorkshopSelector'
import { SettingsPanel } from './components/SettingsPanel'
import { DeckPreview } from './components/DeckPreview'
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
  Hammer,
  FileText,
  ExternalLink,
  FolderOpen,
} from 'lucide-react'

function App() {
  const {
    currentWorkshopId,
    currentConfig,
    loadWorkshops,
    loadContentLibrary,
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
  const [buildResult, setBuildResult] = useState<{
    success: boolean
    outputPath: string
    htmlPath?: string | null
  } | null>(null)

  // Load data on mount
  useEffect(() => {
    loadWorkshops()
    loadContentLibrary()
  }, [])

  // Show workshop selector if no workshop is selected
  useEffect(() => {
    if (!currentWorkshopId) {
      setShowWorkshopSelector(true)
    }
  }, [currentWorkshopId])

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClick = () => setShowExportMenu(false)
    if (showExportMenu) {
      document.addEventListener('click', handleClick)
      return () => document.removeEventListener('click', handleClick)
    }
  }, [showExportMenu])

  // Build deck
  const handleBuild = async (includePdf: boolean = false) => {
    if (!currentWorkshopId) return
    setIsBuilding(true)
    setBuildResult(null)
    setShowExportMenu(false)
    try {
      const result = await window.electronAPI.buildDeck(currentWorkshopId, !includePdf)
      setBuildResult({
        success: result.success,
        outputPath: result.outputPath,
        htmlPath: result.htmlPath,
      })
    } catch (error: any) {
      alert(`Build failed: ${error.message}`)
    }
    setIsBuilding(false)
  }

  // Open preview window
  const openPreview = async (htmlPath: string) => {
    try {
      await window.electronAPI.openPreviewWindow(htmlPath)
    } catch (error) {
      console.error('Error opening preview:', error)
    }
  }

  const handleOpenFile = async (filePath: string) => {
    try {
      await window.electronAPI.openFile(filePath)
    } catch (error) {
      console.error('Error opening file:', error)
    }
  }

  const handleShowInFolder = async (filePath: string) => {
    try {
      await window.electronAPI.showInFolder(filePath)
    } catch (error) {
      console.error('Error showing in folder:', error)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header / Toolbar */}
      <header className="bg-fastr-primary text-white px-4 py-2 flex items-center justify-between shadow-md z-20 drag-region">
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
                  onClick={() => handleBuild(false)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Hammer className="w-4 h-4 text-gray-400" />
                  <span>Build Deck (HTML/MD)</span>
                </button>
                <button
                  onClick={() => handleBuild(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span>Build + Export PDF</span>
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

      {/* Build result banner */}
      {buildResult?.success && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Build successful!</span>
          </div>
          <div className="flex items-center gap-2">
            {buildResult.htmlPath && (
              <button
                onClick={() => openPreview(buildResult.htmlPath!)}
                className="flex items-center gap-1.5 px-2 py-1 text-sm text-green-700 hover:bg-green-100 rounded transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            )}
            <button
              onClick={() => handleOpenFile(buildResult.outputPath)}
              className="flex items-center gap-1.5 px-2 py-1 text-sm text-green-700 hover:bg-green-100 rounded transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </button>
            <button
              onClick={() => handleShowInFolder(buildResult.outputPath)}
              className="flex items-center gap-1.5 px-2 py-1 text-sm text-green-700 hover:bg-green-100 rounded transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              Show in Finder
            </button>
            <button
              onClick={() => setBuildResult(null)}
              className="p-1 text-green-500 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
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
            <div className="flex-1 overflow-hidden">
              <ContentLibrary />
            </div>
          </div>
        </div>

        {/* Center - Main content */}
        <main className="flex-1 overflow-hidden">
          {currentWorkshopId ? (
            showPreview ? (
              <DeckPreview />
            ) : (
              <KanbanBoard />
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

        {/* Overlay when panels are open (for mobile/click outside) */}
        {(leftPanelOpen || rightPanelOpen) && (
          <div
            className="absolute inset-0 bg-black/10 z-[5] lg:hidden"
            onClick={() => {
              setLeftPanelOpen(false)
              setRightPanelOpen(false)
            }}
          />
        )}
      </div>

      {/* Workshop Selector Modal */}
      {showWorkshopSelector && (
        <WorkshopSelector onClose={() => setShowWorkshopSelector(false)} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

export default App
