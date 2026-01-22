import { useState, useEffect } from 'react'
import { useWorkshopStore, Module, Topic } from '../stores/workshop'
import ReactMarkdown from 'react-markdown'
import {
  Search,
  ChevronRight,
  ChevronDown,
  FileText,
  FolderOpen,
  Plus,
  GripVertical,
  Layers,
  Eye,
  X,
  LayoutTemplate,
  Coffee,
  UtensilsCrossed,
  BookOpen,
  Target,
  Globe,
  BarChart3,
  ArrowRight,
  Sunset,
  ListChecks
} from 'lucide-react'

interface TemplateCategory {
  id: string
  name: string
  description: string
  templates: Array<{
    id: string
    file: string | null
    name: string
    icon: string
    special?: boolean
    path: string | null
    preview: string
  }>
}

export function ContentLibrary() {
  const { contentLibrary, customSlides, currentWorkshopId, loadCustomSlides } = useWorkshopStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0])) // Start with first module expanded
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [templates, setTemplates] = useState<TemplateCategory[]>([])
  const [expandedTemplates, setExpandedTemplates] = useState<Set<string>>(new Set(['structure']))
  const [showNewSlideModal, setShowNewSlideModal] = useState(false)
  const [newSlideName, setNewSlideName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Load templates on mount
  useEffect(() => {
    window.electronAPI.getTemplates().then(setTemplates).catch(console.error)
  }, [])

  // Load preview content when topic is selected
  useEffect(() => {
    if (selectedTopic?.path) {
      setPreviewLoading(true)
      window.electronAPI.readSlide(selectedTopic.path)
        .then(content => {
          // Extract first slide content (after frontmatter, before first ---)
          const slides = content.split(/^---$/m).filter(s => s.trim() && !s.trim().startsWith('marp:'))
          let firstSlide = slides[0] || ''

          // Clean up Marp-specific markup for preview
          // Remove <style> blocks
          firstSlide = firstSlide.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          // Remove HTML div wrappers but keep content
          firstSlide = firstSlide.replace(/<div[^>]*>/gi, '\n')
          firstSlide = firstSlide.replace(/<\/div>/gi, '\n')
          // Remove HTML comments (Marp directives)
          firstSlide = firstSlide.replace(/<!--[\s\S]*?-->/g, '')
          // Remove class attributes from remaining tags
          firstSlide = firstSlide.replace(/class="[^"]*"/gi, '')
          // Clean up extra whitespace
          firstSlide = firstSlide.replace(/\n{3,}/g, '\n\n').trim()

          setPreviewContent(firstSlide)
        })
        .catch(err => {
          console.error('Error loading preview:', err)
          setPreviewContent(null)
        })
        .finally(() => setPreviewLoading(false))
    } else {
      setPreviewContent(null)
    }
  }, [selectedTopic])

  const toggleModule = (moduleNum: number) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleNum)) {
      newExpanded.delete(moduleNum)
    } else {
      newExpanded.add(moduleNum)
    }
    setExpandedModules(newExpanded)
  }

  // Create a new custom slide
  const handleCreateCustomSlide = async () => {
    if (!currentWorkshopId || !newSlideName.trim()) return

    setIsCreating(true)
    try {
      // Create filename from slide name
      const filename = newSlideName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '') + '.md'

      // Create basic slide template
      const content = `---
marp: true
theme: fastr
paginate: true
---

## ${newSlideName}

Add your content here...

- Point 1
- Point 2
- Point 3

---
`

      await window.electronAPI.saveCustomSlide(currentWorkshopId, filename, content)
      await loadCustomSlides()
      setNewSlideName('')
      setShowNewSlideModal(false)
    } catch (error) {
      console.error('Error creating custom slide:', error)
    }
    setIsCreating(false)
  }

  const toggleTemplateCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedTemplates)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedTemplates(newExpanded)
  }

  // Filter modules based on search
  const filteredModules = contentLibrary.filter(module => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    if (module.name.toLowerCase().includes(query)) return true
    return module.topics.some(
      topic =>
        topic.title.toLowerCase().includes(query) ||
        topic.id.toLowerCase().includes(query) ||
        topic.slideTitles?.some(t => t.toLowerCase().includes(query))
    )
  })

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search slides..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-secondary focus:border-transparent"
          />
        </div>
      </div>

      {/* Content list */}
      <div className="flex-1 overflow-y-auto">
        {/* Templates section */}
        {!searchQuery && templates.length > 0 && (
          <div className="border-b border-gray-200">
            <div className="px-3 py-2 bg-fastr-light/50">
              <h3 className="text-xs font-semibold text-fastr-primary uppercase tracking-wider flex items-center gap-1.5">
                <LayoutTemplate className="w-3.5 h-3.5" />
                Templates & Structure
              </h3>
            </div>
            {templates.map(category => (
              <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                <div
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleTemplateCategory(category.id)}
                >
                  {expandedTemplates.has(category.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-xs text-gray-400">({category.templates.length})</span>
                </div>
                {expandedTemplates.has(category.id) && (
                  <div className="bg-gray-50/50 py-1">
                    {category.templates.map(template => (
                      <TemplateItem key={template.id} template={template} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modules section header */}
        {!searchQuery && (
          <div className="px-3 py-2 bg-gray-100 border-b border-gray-200">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Module Content
            </h3>
          </div>
        )}

        {/* Module list */}
        {filteredModules.map(module => (
          <ModuleItem
            key={module.number}
            module={module}
            isExpanded={expandedModules.has(module.number)}
            onToggle={() => toggleModule(module.number)}
            onSelectTopic={setSelectedTopic}
            selectedTopicId={selectedTopic?.id}
          />
        ))}

        {/* Custom slides section */}
        {currentWorkshopId && customSlides.length > 0 && (
          <div className="border-t border-gray-200">
            <div className="px-3 py-2 bg-gray-50">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Workshop Custom Slides
              </h3>
            </div>
            <div className="p-2 space-y-1">
              {customSlides.map(slide => (
                <div
                  key={slide.file}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 cursor-grab border border-transparent hover:border-gray-200"
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('slideType', 'custom')
                    e.dataTransfer.setData('slideFile', slide.file)
                  }}
                >
                  <GripVertical className="w-4 h-4 text-gray-300" />
                  <FileText className="w-4 h-4 text-fastr-accent" />
                  <span className="text-sm flex-1 truncate">{slide.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected topic preview */}
      {selectedTopic && (
        <div className="border-t border-gray-200 bg-white flex flex-col" style={{ maxHeight: '280px' }}>
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2 min-w-0">
              <Eye className="w-4 h-4 text-fastr-secondary flex-shrink-0" />
              <span className="text-sm font-medium text-gray-800 truncate">{selectedTopic.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{selectedTopic.slideCount} slides</span>
              <button
                onClick={() => setSelectedTopic(null)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Preview content - rendered markdown */}
          <div className="flex-1 overflow-y-auto p-3">
            {previewLoading ? (
              <div className="text-xs text-gray-400 text-center py-4">Loading preview...</div>
            ) : previewContent ? (
              <div className="slide-preview text-xs">
                <ReactMarkdown
                  components={{
                    h1: ({children}) => <h1 className="text-sm font-bold text-fastr-primary mb-2">{children}</h1>,
                    h2: ({children}) => <h2 className="text-sm font-semibold text-gray-800 mb-1.5">{children}</h2>,
                    h3: ({children}) => <h3 className="text-xs font-medium text-gray-700 mb-1">{children}</h3>,
                    p: ({children}) => <p className="text-xs text-gray-600 mb-1.5">{children}</p>,
                    ul: ({children}) => <ul className="text-xs text-gray-600 ml-3 mb-1.5 list-disc">{children}</ul>,
                    li: ({children}) => <li className="mb-0.5">{children}</li>,
                    strong: ({children}) => <strong className="font-semibold text-gray-800">{children}</strong>,
                    img: () => <span className="inline-block bg-gray-200 text-gray-500 text-xs px-2 py-0.5 rounded">[image]</span>,
                  }}
                >
                  {previewContent}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="space-y-1">
                {selectedTopic.slideTitles?.map((title, i) => (
                  <div key={i} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-gray-400 w-4 text-right">{i + 1}.</span>
                    <span className="truncate">{title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick add buttons */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <p className="text-xs text-gray-500 mb-2">Drag content to add to your deck</p>
        <button
          onClick={() => setShowNewSlideModal(true)}
          disabled={!currentWorkshopId}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-fastr-primary text-white rounded-md hover:bg-fastr-primary/90 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Create Custom Slide
        </button>
      </div>

      {/* New Slide Modal */}
      {showNewSlideModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Custom Slide</h3>
              <button
                onClick={() => setShowNewSlideModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slide Title
              </label>
              <input
                type="text"
                value={newSlideName}
                onChange={(e) => setNewSlideName(e.target.value)}
                placeholder="e.g., Country Health Overview"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fastr-primary"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateCustomSlide()
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewSlideModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomSlide}
                disabled={!newSlideName.trim() || isCreating}
                className="px-4 py-2 text-sm bg-fastr-primary text-white rounded-md hover:bg-fastr-primary/90 disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Module item component
function ModuleItem({
  module,
  isExpanded,
  onToggle,
  onSelectTopic,
  selectedTopicId
}: {
  module: Module
  isExpanded: boolean
  onToggle: () => void
  onSelectTopic: (topic: Topic | null) => void
  selectedTopicId?: string
}) {
  return (
    <div className="border-b border-gray-100">
      {/* Module header */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 cursor-pointer"
        onClick={onToggle}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
        <FolderOpen className="w-4 h-4 text-fastr-secondary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {module.name}
          </div>
          <div className="text-xs text-gray-400">
            {module.topics.length} topics · {module.totalSlides} slides
          </div>
        </div>
      </div>

      {/* Topics */}
      {isExpanded && (
        <div className="bg-gray-50/50 py-1">
          {/* Add all button */}
          <div
            className="mx-2 mb-1 flex items-center gap-2 p-2 rounded-md bg-fastr-light/70 hover:bg-fastr-light cursor-grab border border-fastr-secondary/30"
            draggable
            onDragStart={e => {
              e.dataTransfer.setData('slideType', 'module')
              e.dataTransfer.setData('moduleId', module.id)
            }}
          >
            <GripVertical className="w-4 h-4 text-fastr-secondary" />
            <Plus className="w-4 h-4 text-fastr-secondary" />
            <span className="text-sm font-medium text-fastr-primary">
              Add all {module.totalSlides} slides
            </span>
          </div>

          {/* Individual topics */}
          {module.topics.map(topic => (
            <TopicItem
              key={topic.id}
              topic={topic}
              onSelect={() => onSelectTopic(topic)}
              isSelected={selectedTopicId === topic.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Topic item component - now shows more info
function TopicItem({
  topic,
  onSelect,
  isSelected
}: {
  topic: Topic
  onSelect: () => void
  isSelected: boolean
}) {
  return (
    <div
      className={`mx-2 my-1 rounded-md border transition-all ${
        isSelected
          ? 'border-fastr-secondary bg-white shadow-sm'
          : 'border-transparent hover:border-gray-200 hover:bg-white'
      }`}
    >
      <div
        className="flex items-start gap-2 p-2 cursor-grab"
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('slideType', 'topic')
          e.dataTransfer.setData('topicId', topic.id)
        }}
      >
        <GripVertical className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800 truncate flex-1">
              {topic.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
              className="p-1 text-gray-400 hover:text-fastr-secondary rounded"
              title="Preview slides"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-400">{topic.id}</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {topic.slideCount} slides
            </span>
          </div>

          {/* Preview of key points */}
          {topic.preview && topic.preview.length > 0 && (
            <div className="mt-1.5 space-y-0.5">
              {topic.preview.slice(0, 2).map((point, i) => (
                <div key={i} className="text-xs text-gray-500 truncate flex items-start gap-1">
                  <span className="text-gray-300">•</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Template item component
function TemplateItem({ template }: {
  template: {
    id: string
    name: string
    icon: string
    special?: boolean
    path: string | null
    preview: string
  }
}) {
  const getIcon = () => {
    switch (template.icon) {
      case 'cover': return <FileText className="w-4 h-4 text-fastr-accent" />
      case 'list': return <ListChecks className="w-4 h-4 text-fastr-secondary" />
      case 'divider': return <LayoutTemplate className="w-4 h-4 text-fastr-secondary" />
      case 'end': return <FileText className="w-4 h-4 text-gray-500" />
      case 'coffee': return <Coffee className="w-4 h-4 text-amber-600" />
      case 'lunch': return <UtensilsCrossed className="w-4 h-4 text-orange-500" />
      case 'sunset': return <Sunset className="w-4 h-4 text-orange-400" />
      case 'recap': return <BookOpen className="w-4 h-4 text-blue-500" />
      case 'target': return <Target className="w-4 h-4 text-red-500" />
      case 'globe': return <Globe className="w-4 h-4 text-blue-500" />
      case 'heart': return <FileText className="w-4 h-4 text-pink-500" />
      case 'chart': return <BarChart3 className="w-4 h-4 text-green-500" />
      case 'arrow': return <ArrowRight className="w-4 h-4 text-fastr-primary" />
      default: return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div
      className="mx-2 my-1 flex items-center gap-2 p-2 rounded-md hover:bg-white cursor-grab border border-transparent hover:border-gray-200 transition-all"
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('slideType', 'template')
        e.dataTransfer.setData('templateId', template.id)
        if (template.path) {
          e.dataTransfer.setData('templatePath', template.path)
        }
      }}
    >
      <GripVertical className="w-4 h-4 text-gray-300" />
      {getIcon()}
      <div className="flex-1 min-w-0">
        <span className="text-sm text-gray-700">{template.name}</span>
        {template.special && (
          <span className="ml-1.5 text-xs text-gray-400">(auto)</span>
        )}
      </div>
    </div>
  )
}
