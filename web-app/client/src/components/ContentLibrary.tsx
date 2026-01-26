import { useState } from 'react'
import { useWorkshopStore } from '../stores/workshop'
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Clock,
  Layers,
  Plus,
  Eye,
  X
} from 'lucide-react'

interface Topic {
  id: string
  file: string
  title: string
  slideCount: number
  slideTitles: string[]
  preview: string[]
  path?: string
  isShort?: boolean
}

interface Module {
  number: number
  id: string
  name: string
  folder: string
  topics: Topic[]
  totalSlides: number
}

interface PreviewData {
  topic: Topic
  module: Module
  position: { x: number; y: number }
}

export function ContentLibrary() {
  const { contentLibrary, addSession, currentConfig } = useWorkshopStore()
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set())
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [fullPreview, setFullPreview] = useState<{ topic: Topic; module: Module; content: string; html?: string } | null>(null)
  const [_loadingPreview, setLoadingPreview] = useState(false)

  // Toggle module expansion
  const toggleModule = (moduleNum: number) => {
    const next = new Set(expandedModules)
    if (next.has(moduleNum)) {
      next.delete(moduleNum)
    } else {
      next.add(moduleNum)
    }
    setExpandedModules(next)
  }

  // Show hover preview
  const handleMouseEnter = (e: React.MouseEvent, topic: Topic, module: Module) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPreview({
      topic,
      module,
      position: { x: rect.right + 10, y: rect.top }
    })
  }

  const handleMouseLeave = () => {
    setPreview(null)
  }

  // Show full preview modal with rendered slides
  const showFullPreview = async (topic: Topic, module: Module) => {
    setLoadingPreview(true)
    try {
      const response = await fetch(`/api/content/topic/${topic.id}`)
      if (response.ok) {
        const data = await response.json()

        // Render markdown to HTML via backend
        const renderResponse = await fetch('/api/content/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown: data.content })
        })

        let html = ''
        if (renderResponse.ok) {
          const renderData = await renderResponse.json()
          html = renderData.html
        }

        setFullPreview({ topic, module, content: data.content, html })
      }
    } catch (err) {
      console.error('Failed to load preview:', err)
    } finally {
      setLoadingPreview(false)
    }
  }

  // Add topic to current day
  const addTopic = (topic: Topic, module: Module) => {
    if (!currentConfig) return

    // Add to Day 1 by default (user can drag to another day)
    const dayNum = 1

    // Estimate duration based on slide count (3 min per slide average)
    const duration = Math.max(15, topic.slideCount * 3)

    addSession(dayNum, {
      session: topic.title,
      module: module.id,
      topics: [topic.id],
      duration: duration,
      slides: [topic.file],
    })
  }

  // Module duration estimates
  const getModuleDuration = (module: Module): string => {
    const durations: Record<number, string> = {
      0: '45-60 min',
      1: '60-90 min',
      2: '90-120 min',
      3: '120-180 min',
      4: '90-120 min',
      5: '60-90 min',
      6: '180-240 min',
      7: '90-120 min',
      8: '120-180 min',
    }
    return durations[module.number] || '60 min'
  }

  if (contentLibrary.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        <div className="text-center">
          <Layers className="w-8 h-8 mx-auto mb-2" />
          <p>Loading content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="text-xs text-gray-500">
          Click + to add, hover to preview
        </p>
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto">
        {contentLibrary.map((module) => (
          <div key={module.id} className="border-b border-gray-100">
            {/* Module header */}
            <button
              onClick={() => toggleModule(module.number)}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
            >
              {expandedModules.has(module.number) ? (
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-700 truncate">
                  M{module.number}: {module.name}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span>{module.topics.length} topics</span>
                  <span>•</span>
                  <span>{module.totalSlides} slides</span>
                  <span>•</span>
                  <span>{getModuleDuration(module)}</span>
                </div>
              </div>
            </button>

            {/* Topics */}
            {expandedModules.has(module.number) && (
              <div className="bg-gray-50 border-t border-gray-100">
                {module.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center gap-2 px-3 py-2 pl-8 hover:bg-gray-100 transition-colors group"
                    onMouseEnter={(e) => handleMouseEnter(e, topic, module)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 truncate" title={topic.title}>
                        {topic.title}
                        {topic.isShort && (
                          <span className="ml-1 text-xs bg-blue-100 text-blue-600 px-1 rounded">
                            short
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{topic.slideCount} slides</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => showFullPreview(topic, module)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-white rounded"
                        title="Preview slides"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addTopic(topic, module)}
                        className="p-1 text-fastr-primary hover:bg-white rounded"
                        title="Add to Day 1"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hover preview tooltip */}
      {preview && (
        <div
          className="fixed z-50 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-3 pointer-events-none"
          style={{
            left: Math.min(preview.position.x, window.innerWidth - 300),
            top: Math.min(preview.position.y, window.innerHeight - 200),
          }}
        >
          <div className="font-medium text-sm text-gray-800 mb-2">
            {preview.topic.title}
          </div>

          <div className="text-xs text-gray-500 mb-2 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {preview.topic.slideCount} slides
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              ~{Math.max(15, preview.topic.slideCount * 3)} min
            </span>
          </div>

          {/* Slide titles */}
          {preview.topic.slideTitles.length > 0 && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="text-xs font-medium text-gray-600 mb-1">Slides:</div>
              <ul className="text-xs text-gray-500 space-y-0.5">
                {preview.topic.slideTitles.slice(0, 5).map((title, i) => (
                  <li key={i} className="truncate">• {title}</li>
                ))}
                {preview.topic.slideTitles.length > 5 && (
                  <li className="text-gray-400">
                    +{preview.topic.slideTitles.length - 5} more...
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Key points */}
          {preview.topic.preview.length > 0 && (
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="text-xs font-medium text-gray-600 mb-1">Key points:</div>
              <ul className="text-xs text-gray-500 space-y-0.5">
                {preview.topic.preview.slice(0, 3).map((point, i) => (
                  <li key={i} className="truncate">• {point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Full preview modal */}
      {fullPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <h3 className="font-semibold">{fullPreview.topic.title}</h3>
                <p className="text-sm text-gray-500">
                  M{fullPreview.module.number}: {fullPreview.module.name}
                </p>
              </div>
              <button
                onClick={() => setFullPreview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-800 p-4">
              {fullPreview.html ? (
                <div className="flex justify-center">
                  <iframe
                    srcDoc={fullPreview.html}
                    className="bg-white rounded shadow-lg"
                    style={{ width: '800px', height: '450px' }}
                    title="Slide Preview"
                  />
                </div>
              ) : (
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900 p-4 rounded">
                  {fullPreview.content}
                </pre>
              )}
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t">
              <button
                onClick={() => setFullPreview(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Close
              </button>
              <button
                onClick={() => {
                  addTopic(fullPreview.topic, fullPreview.module)
                  setFullPreview(null)
                }}
                className="px-4 py-2 text-sm bg-fastr-primary text-white rounded hover:bg-fastr-primary/90"
              >
                Add to Day 1
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
