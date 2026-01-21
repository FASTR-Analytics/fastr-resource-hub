import { useEffect, useState } from 'react'
import { useWorkshopStore } from './stores/workshop'
import { ContentLibrary } from './components/ContentLibrary'
import { DeckBuilder } from './components/DeckBuilder'
import { AIAssistant } from './components/AIAssistant'
import { WorkshopSelector } from './components/WorkshopSelector'
import {
  Layers,
  PanelLeftClose,
  PanelRightClose,
  Sparkles,
  Menu
} from 'lucide-react'

function App() {
  const {
    currentWorkshopId,
    currentConfig,
    loadWorkshops,
    loadContentLibrary,
    error,
    setError
  } = useWorkshopStore()

  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [showWorkshopSelector, setShowWorkshopSelector] = useState(false)

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

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-fastr-primary text-white px-4 py-2 flex items-center justify-between shadow-md z-10 drag-region">
        <div className="flex items-center gap-3">
          <Layers className="w-6 h-6" />
          <h1 className="font-semibold text-lg">FASTR Deck Builder</h1>
        </div>

        {currentWorkshopId && (
          <button
            onClick={() => setShowWorkshopSelector(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm">{currentConfig?.workshop?.name || currentWorkshopId}</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className={`p-2 rounded-md transition-colors ${leftPanelOpen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
            title="Toggle content library"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
            className={`p-2 rounded-md transition-colors ${rightPanelOpen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
            title="Toggle AI assistant"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-100 border-b border-red-200 text-red-700 px-4 py-2 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Content Library */}
        {leftPanelOpen && (
          <aside className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            <ContentLibrary />
          </aside>
        )}

        {/* Center Panel - Deck Builder */}
        <main className="flex-1 overflow-hidden">
          {currentWorkshopId ? (
            <DeckBuilder />
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

        {/* Right Panel - AI Assistant */}
        {rightPanelOpen && (
          <aside className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
            <AIAssistant />
          </aside>
        )}
      </div>

      {/* Workshop Selector Modal */}
      {showWorkshopSelector && (
        <WorkshopSelector onClose={() => setShowWorkshopSelector(false)} />
      )}
    </div>
  )
}

export default App
