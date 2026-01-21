import { useState } from 'react'
import { useWorkshopStore, Module, Topic } from '../stores/workshop'
import {
  Search,
  ChevronRight,
  ChevronDown,
  FileText,
  FolderOpen,
  Plus,
  GripVertical
} from 'lucide-react'

export function ContentLibrary() {
  const { contentLibrary, customSlides, currentWorkshopId } = useWorkshopStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set())

  const toggleModule = (moduleNum: number) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleNum)) {
      newExpanded.delete(moduleNum)
    } else {
      newExpanded.add(moduleNum)
    }
    setExpandedModules(newExpanded)
  }

  // Filter modules based on search
  const filteredModules = contentLibrary.filter(module => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    if (module.name.toLowerCase().includes(query)) return true
    return module.topics.some(
      topic =>
        topic.title.toLowerCase().includes(query) ||
        topic.id.toLowerCase().includes(query)
    )
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800 mb-3">Content Library</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search modules & topics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
          />
        </div>
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto p-2">
        {filteredModules.map(module => (
          <ModuleItem
            key={module.number}
            module={module}
            isExpanded={expandedModules.has(module.number)}
            onToggle={() => toggleModule(module.number)}
            searchQuery={searchQuery}
          />
        ))}

        {/* Custom slides section */}
        {currentWorkshopId && customSlides.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
              Custom Slides
            </h3>
            {customSlides.map(slide => (
              <div
                key={slide.file}
                className="content-card flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-grab"
                draggable
                onDragStart={e => {
                  e.dataTransfer.setData('slideType', 'custom')
                  e.dataTransfer.setData('slideFile', slide.file)
                }}
              >
                <GripVertical className="w-4 h-4 text-gray-300" />
                <FileText className="w-4 h-4 text-fastr-accent" />
                <span className="text-sm truncate">{slide.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick add buttons */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 mb-2">Drag content to add to your deck</p>
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-fastr-primary text-white rounded-md hover:bg-fastr-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Create Custom Slide
        </button>
      </div>
    </div>
  )
}

// Module item component
function ModuleItem({
  module,
  isExpanded,
  onToggle,
  searchQuery
}: {
  module: Module
  isExpanded: boolean
  onToggle: () => void
  searchQuery: string
}) {
  return (
    <div className="mb-1">
      {/* Module header */}
      <div
        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
        onClick={onToggle}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
        <FolderOpen className="w-4 h-4 text-fastr-secondary" />
        <span className="text-sm font-medium flex-1 truncate">
          Module {module.number}: {module.name}
        </span>
        <span className="text-xs text-gray-400">{module.topics.length}</span>
      </div>

      {/* Topics */}
      {isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {/* Add all button */}
          <div
            className="content-card flex items-center gap-2 p-2 rounded-md bg-fastr-light/50 hover:bg-fastr-light cursor-grab border border-fastr-secondary/20"
            draggable
            onDragStart={e => {
              e.dataTransfer.setData('slideType', 'module')
              e.dataTransfer.setData('moduleId', module.id)
            }}
          >
            <GripVertical className="w-4 h-4 text-fastr-secondary" />
            <Plus className="w-4 h-4 text-fastr-secondary" />
            <span className="text-sm font-medium text-fastr-primary">
              Add entire module
            </span>
          </div>

          {/* Individual topics */}
          {module.topics.map(topic => (
            <TopicItem key={topic.id} topic={topic} searchQuery={searchQuery} />
          ))}
        </div>
      )}
    </div>
  )
}

// Topic item component
function TopicItem({ topic, searchQuery }: { topic: Topic; searchQuery: string }) {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div
      className="content-card relative"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      <div
        className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 cursor-grab"
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('slideType', 'topic')
          e.dataTransfer.setData('topicId', topic.id)
        }}
      >
        <GripVertical className="w-4 h-4 text-gray-300 mt-0.5" />
        <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-sm truncate">{topic.title}</div>
          <div className="text-xs text-gray-400">{topic.id}</div>
        </div>
      </div>

      {/* Preview tooltip */}
      {showPreview && topic.preview.length > 0 && (
        <div className="absolute left-full top-0 ml-2 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <h4 className="font-medium text-sm mb-2 truncate">{topic.title}</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            {topic.preview.map((item, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-gray-400">•</span>
                <span className="truncate">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
