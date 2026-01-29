import { useState, useEffect, useCallback, useRef } from 'react'
import { useWorkshopStore } from '../stores/workshop'
import api, { Asset } from '../../lib/api'
import {
  ChevronRight,
  ChevronDown,
  FileText,
  Clock,
  Layers,
  Plus,
  Eye,
  X,
  Coffee,
  UtensilsCrossed,
  Layout,
  Target,
  MessageSquare,
  BookOpen,
  Image,
  Upload,
  Trash2,
  Copy,
  Check,
  Loader2,
  RefreshCw,
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

interface Template {
  id: string
  file: string | null
  name: string
  icon: string
  preview?: string
  special?: boolean
  path?: string
}

interface TemplateCategory {
  id: string
  name: string
  description: string
  templates: Template[]
}

export function ContentLibrary() {
  const { contentLibrary, addSession, currentConfig, currentWorkshopId, updateSession } = useWorkshopStore()
  const [activeTab, setActiveTab] = useState<'content' | 'assets'>('content')
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set())
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['breaks']))
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [fullPreview, setFullPreview] = useState<{ topic: Topic; module: Module; content: string; html?: string } | null>(null)

  // Add to session dialog state
  const [addToSessionDialog, setAddToSessionDialog] = useState<{ topic: Topic; module: Module } | null>(null)
  const [_loadingPreview, setLoadingPreview] = useState(false)
  const [templates, setTemplates] = useState<TemplateCategory[]>([])
  const [templatePreview, setTemplatePreview] = useState<{ template: Template; category: TemplateCategory; position: { x: number; y: number }; html?: string } | null>(null)

  // Track which template is being hovered to prevent race conditions
  const hoveredTemplateRef = useRef<string | null>(null)

  // Assets state
  const [assets, setAssets] = useState<Asset[]>([])
  const [assetsLoading, setAssetsLoading] = useState(false)
  const [uploadingAsset, setUploadingAsset] = useState(false)
  const [copiedAsset, setCopiedAsset] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Rebuild state
  const [isRebuilding, setIsRebuilding] = useState(false)

  // Fetch templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/content/templates', { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          setTemplates(data)
        }
      } catch (err) {
        console.error('Failed to fetch templates:', err)
      }
    }
    fetchTemplates()
  }, [])

  // Fetch assets when workshop changes or tab switches to assets
  const loadAssets = useCallback(async () => {
    if (!currentWorkshopId) return
    setAssetsLoading(true)
    try {
      const assetList = await api.listAssets(currentWorkshopId)
      setAssets(assetList)
    } catch (err) {
      console.error('Failed to load assets:', err)
    } finally {
      setAssetsLoading(false)
    }
  }, [currentWorkshopId])

  useEffect(() => {
    if (activeTab === 'assets' && currentWorkshopId) {
      loadAssets()
    }
  }, [activeTab, currentWorkshopId, loadAssets])

  // Handle file upload
  const handleUpload = async (files: FileList | null) => {
    if (!files || !currentWorkshopId) return

    setUploadingAsset(true)
    try {
      for (const file of Array.from(files)) {
        await api.uploadAsset(currentWorkshopId, file)
      }
      await loadAssets()
    } catch (err: any) {
      console.error('Upload failed:', err)
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploadingAsset(false)
    }
  }

  // Handle delete asset
  const handleDeleteAsset = async (filename: string) => {
    if (!currentWorkshopId) return
    if (!confirm(`Delete ${filename}?`)) return

    try {
      await api.deleteAsset(currentWorkshopId, filename)
      await loadAssets()
    } catch (err: any) {
      console.error('Delete failed:', err)
      alert(`Delete failed: ${err.message}`)
    }
  }

  // Copy markdown to clipboard
  const copyMarkdown = (asset: Asset) => {
    navigator.clipboard.writeText(asset.markdown)
    setCopiedAsset(asset.filename)
    setTimeout(() => setCopiedAsset(null), 2000)
  }

  // Rebuild content from methodology files
  const handleRebuildContent = async () => {
    if (!confirm('Rebuild content from methodology files? This will re-extract all slides.')) return

    setIsRebuilding(true)
    try {
      const result = await api.rebuildContent()
      alert(`Content rebuilt successfully in ${(result.duration / 1000).toFixed(1)}s`)
      // Reload the page to get fresh content
      window.location.reload()
    } catch (err: any) {
      console.error('Rebuild failed:', err)
      alert(`Rebuild failed: ${err.message}`)
    } finally {
      setIsRebuilding(false)
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleUpload(e.dataTransfer.files)
  }

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

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

  // Toggle template category expansion
  const toggleCategory = (categoryId: string) => {
    const next = new Set(expandedCategories)
    if (next.has(categoryId)) {
      next.delete(categoryId)
    } else {
      next.add(categoryId)
    }
    setExpandedCategories(next)
  }

  // Get icon for template
  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'coffee': return <Coffee className="w-4 h-4" />
      case 'lunch': return <UtensilsCrossed className="w-4 h-4" />
      case 'divider': return <Layout className="w-4 h-4" />
      case 'target': return <Target className="w-4 h-4" />
      case 'demo': return <MessageSquare className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  // Add template to schedule
  const addTemplate = (template: Template, category: TemplateCategory) => {
    console.log('[ContentLibrary] addTemplate called:', template.name, category.id)

    if (!currentConfig) {
      console.warn('[ContentLibrary] No currentConfig - cannot add template')
      return
    }

    const dayNum = 1

    // Determine duration based on template type
    let duration = 15
    if (template.id === 'lunch') duration = 60
    if (template.id === 'tea') duration = 15
    if (category.id === 'activities') duration = 30  // Activities get 30 min

    // Determine session type - only use valid types from Session interface
    // Valid types: 'break' | 'section' | 'day_recap' | 'day_end' | 'day_title' | undefined
    const sessionType = category.id === 'breaks' ? 'break' as const : undefined

    console.log('[ContentLibrary] Adding session:', template.name, 'with slides:', template.file)

    addSession(dayNum, {
      session: template.name,
      type: sessionType,
      duration: duration,
      slides: template.file ? [template.file] : [],
    })
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

  // Template preview handlers
  const handleTemplateMouseEnter = async (e: React.MouseEvent, template: Template, category: TemplateCategory) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const position = { x: rect.right + 10, y: rect.top }

    // Track which template we're hovering
    hoveredTemplateRef.current = template.id

    // Generate preview markdown based on template type
    let markdown = ''
    if (category.id === 'breaks') {
      const isLunch = template.id === 'lunch'
      const duration = isLunch ? 60 : 15
      markdown = `---
marp: true
theme: fastr
---

<!-- _class: break -->

![bg](/resources/backgrounds/break_slide.png)

# ${isLunch ? '🍽️ Lunch Break' : '☕ Tea Break'}

**${duration} minutes**

We resume at **[time]**`
    } else if (template.file) {
      // Load template file content
      try {
        const response = await fetch(`/api/content/templates/${template.id}`, { credentials: 'include' })
        // Check if we're still hovering this template
        if (hoveredTemplateRef.current !== template.id) return
        if (response.ok) {
          const data = await response.json()
          // Use content directly - it already has frontmatter
          markdown = data.content
        }
      } catch (err) {
        console.error('Failed to load template:', err)
      }
    }

    // Check if we're still hovering this template before rendering
    if (hoveredTemplateRef.current !== template.id) return

    // Render to HTML
    if (markdown) {
      try {
        const renderResponse = await fetch('/api/content/render', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown })
        })
        // Check again after async operation
        if (hoveredTemplateRef.current !== template.id) return
        if (renderResponse.ok) {
          const data = await renderResponse.json()
          const html = data.html.replace('<head>', `<head><base href="${window.location.origin}/">`)
          setTemplatePreview({ template, category, position, html })
        }
      } catch (err) {
        console.error('Failed to render preview:', err)
        if (hoveredTemplateRef.current === template.id) {
          setTemplatePreview({ template, category, position })
        }
      }
    } else {
      setTemplatePreview({ template, category, position })
    }
  }

  const handleTemplateMouseLeave = () => {
    hoveredTemplateRef.current = null
    setTemplatePreview(null)
  }

  // Show full preview modal with rendered slides
  const showFullPreview = async (topic: Topic, module: Module) => {
    setLoadingPreview(true)
    try {
      const response = await fetch(`/api/content/topic/${topic.id}`, { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()

        // Render markdown to HTML via backend
        const renderResponse = await fetch('/api/content/render', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdown: data.content })
        })

        let html = ''
        if (renderResponse.ok) {
          const renderData = await renderResponse.json()
          // Add base tag so /resources/ paths resolve correctly in iframe
          html = renderData.html.replace('<head>', `<head><base href="${window.location.origin}/">`)
        }

        setFullPreview({ topic, module, content: data.content, html })
      }
    } catch (err) {
      console.error('Failed to load preview:', err)
    } finally {
      setLoadingPreview(false)
    }
  }

  // Show dialog to choose where to add topic
  const addTopic = (topic: Topic, module: Module) => {
    if (!currentConfig) return
    setAddToSessionDialog({ topic, module })
  }

  // Add topic as a new session
  const addTopicAsNewSession = (topic: Topic, module: Module, dayNum: number = 1) => {
    const duration = Math.max(15, topic.slideCount * 3)
    addSession(dayNum, {
      session: topic.title,
      module: module.id,
      topics: [topic.id],
      duration: duration,
      slides: [topic.file],
    })
    setAddToSessionDialog(null)
  }

  // Add topic to an existing session
  const addTopicToExistingSession = (topic: Topic, dayNum: number, sessionIdx: number) => {
    if (!currentConfig) return
    const dayKey = `day${dayNum}`
    const sessions = currentConfig.schedule[dayKey] || []
    const existingSession = sessions[sessionIdx]
    if (existingSession) {
      const topicDuration = Math.max(15, topic.slideCount * 3)
      updateSession(dayNum, sessionIdx, {
        topics: [...(existingSession.topics || []), topic.id],
        slides: [...(existingSession.slides || []), topic.file],
        duration: (existingSession.duration || 0) + topicDuration,
      })
    }
    setAddToSessionDialog(null)
  }

  // Get all module sessions from all days
  const getExistingModuleSessions = () => {
    if (!currentConfig) return []
    const sessions: Array<{ dayNum: number; sessionIdx: number; session: any }> = []
    const numDays = currentConfig.schedule.days || 1
    for (let d = 1; d <= numDays; d++) {
      const dayKey = `day${d}`
      const daySessions = currentConfig.schedule[dayKey] || []
      daySessions.forEach((s: any, idx: number) => {
        if (s.module) {
          sessions.push({ dayNum: d, sessionIdx: idx, session: s })
        }
      })
    }
    return sessions
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

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 px-3 py-2 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'content'
              ? 'text-fastr-primary border-b-2 border-fastr-primary bg-fastr-primary/5'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Content
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex-1 px-3 py-2 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'assets'
              ? 'text-fastr-primary border-b-2 border-fastr-primary bg-fastr-primary/5'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Image className="w-4 h-4" />
          Assets
        </button>
        <button
          onClick={handleRebuildContent}
          disabled={isRebuilding}
          title="Rebuild content from methodology files"
          className="px-2 py-2 text-gray-400 hover:text-fastr-primary hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRebuilding ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Assets Tab */}
      {activeTab === 'assets' && (
        <div className="flex-1 overflow-y-auto p-3">
          {!currentWorkshopId ? (
            <div className="text-center text-gray-400 py-8">
              <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a workshop to manage assets</p>
            </div>
          ) : (
            <>
              {/* Upload area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors mb-4 ${
                  isDragging
                    ? 'border-fastr-primary bg-fastr-primary/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {uploadingAsset ? (
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-1">
                      Drag & drop images here
                    </p>
                    <label className="text-xs text-fastr-primary hover:underline cursor-pointer">
                      or click to browse
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleUpload(e.target.files)}
                      />
                    </label>
                  </>
                )}
              </div>

              {/* Assets grid */}
              {assetsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </div>
              ) : assets.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p className="text-sm">No assets uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {assets.map((asset) => (
                    <div
                      key={asset.filename}
                      className="group relative border rounded-lg overflow-hidden bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-square bg-white flex items-center justify-center">
                        <img
                          src={asset.url}
                          alt={asset.filename}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-2 border-t bg-white">
                        <p className="text-xs font-medium text-gray-700 truncate" title={asset.filename}>
                          {asset.filename}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatSize(asset.size)}
                        </p>
                      </div>

                      {/* Actions overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => copyMarkdown(asset)}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          title="Copy markdown"
                        >
                          {copiedAsset === asset.filename ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.filename)}
                          className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Usage hint */}
              {assets.length > 0 && (
                <div className="mt-4 p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Tip:</strong> Click the copy button to get the markdown reference, then paste it in your custom slide.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
      <div className="flex-1 overflow-y-auto">
        {contentLibrary.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
              <p>Loading content...</p>
            </div>
          </div>
        ) : (
        <>
        {/* Templates Section */}
        {templates.filter(cat => ['breaks', 'activities'].includes(cat.id)).length > 0 && (
          <div className="border-b-2 border-gray-200 bg-amber-50/50">
            <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Breaks & Structure
            </div>
            {templates
              .filter(cat => ['breaks', 'activities'].includes(cat.id))
              .map((category) => (
                <div key={category.id} className="border-t border-gray-100">
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-amber-100/50 transition-colors text-left"
                  >
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-700">
                        {category.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {category.description}
                      </div>
                    </div>
                  </button>

                  {/* Templates */}
                  {expandedCategories.has(category.id) && (
                    <div className="bg-white border-t border-gray-100">
                      {category.templates.map((template) => (
                        <div
                          key={template.id}
                          className="flex items-center gap-2 px-3 py-2 pl-8 hover:bg-gray-50 transition-colors group cursor-pointer"
                          onMouseEnter={(e) => handleTemplateMouseEnter(e, template, category)}
                          onMouseLeave={handleTemplateMouseLeave}
                          onClick={() => addTemplate(template, category)}
                        >
                          <span className="text-amber-600 flex-shrink-0">
                            {getTemplateIcon(template.icon)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-700 truncate" title={template.name}>
                              {template.name}
                            </div>
                            {template.preview && (
                              <div className="text-xs text-gray-400">
                                {template.preview}
                              </div>
                            )}
                          </div>

                          {/* Add button */}
                          <button
                            onClick={() => addTemplate(template, category)}
                            className="p-1 text-amber-600 hover:bg-amber-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Add to Day 1"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Modules Section */}
        <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide border-b border-gray-100">
          Modules
        </div>
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

            {/* Topics - Full and Condensed sub-sections */}
            {expandedModules.has(module.number) && (
              <div className="bg-gray-50 border-t border-gray-100">
                {/* Full slides section */}
                {(module as any).fullTopics?.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 pl-8 text-xs font-medium text-gray-500 bg-gray-100 border-b border-gray-200">
                      Full ({(module as any).fullSlides} slides)
                    </div>
                    {(module as any).fullTopics.map((topic: any) => (
                      <div
                        key={topic.id}
                        className="flex items-center gap-2 px-3 py-2 pl-10 hover:bg-gray-100 transition-colors group"
                        onMouseEnter={(e) => handleMouseEnter(e, topic, module)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-700 truncate" title={topic.title}>
                            {topic.title}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            <span>{topic.slideCount} slides</span>
                          </div>
                        </div>
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
                  </>
                )}
                {/* Condensed slides section */}
                {(module as any).condensedTopics?.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 pl-8 text-xs font-medium text-amber-700 bg-amber-50 border-b border-amber-200">
                      Condensed ({(module as any).condensedSlides} slides)
                    </div>
                    {(module as any).condensedTopics.map((topic: any) => (
                      <div
                        key={topic.id}
                        className="flex items-center gap-2 px-3 py-2 pl-10 hover:bg-amber-50 transition-colors group"
                        onMouseEnter={(e) => handleMouseEnter(e, topic, module)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-gray-700 truncate" title={topic.title}>
                            {topic.title}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            <span>{topic.slideCount} slides</span>
                          </div>
                        </div>
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
                  </>
                )}
                {/* Fallback for modules without separated topics */}
                {!(module as any).fullTopics?.length && !(module as any).condensedTopics?.length && module.topics.map((topic) => (
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
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{topic.slideCount} slides</span>
                      </div>
                    </div>
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
        </>
        )}
      </div>
      )}

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

      {/* Template hover preview tooltip */}
      {templatePreview && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden pointer-events-none"
          style={{
            left: Math.min(templatePreview.position.x, window.innerWidth - 340),
            top: Math.min(templatePreview.position.y, window.innerHeight - 280),
            width: '320px',
          }}
        >
          <div className="p-3 border-b border-gray-100">
            <div className="font-medium text-sm text-gray-800">
              {templatePreview.template.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {templatePreview.category.id === 'breaks' && (
                templatePreview.template.id === 'lunch' ? '60 min lunch break' : '15 min tea/coffee break'
              )}
              {templatePreview.category.id === 'activities' && 'Interactive session'}
              {templatePreview.category.id === 'demo' && 'Platform demonstration'}
            </div>
          </div>
          {templatePreview.html ? (
            <div className="bg-gray-100 p-2">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  srcDoc={templatePreview.html}
                  className="absolute inset-0 w-full h-full bg-white rounded shadow-sm"
                  title="Template Preview"
                  style={{ transform: 'scale(1)', transformOrigin: 'top left' }}
                />
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-1" />
              Loading preview...
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

      {/* Add to Session Dialog */}
      {addToSessionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold">Add Slide</h3>
              <button
                onClick={() => setAddToSessionDialog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {/* Selected topic info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                <div className="text-sm font-medium text-blue-800">{addToSessionDialog.topic.title}</div>
                <div className="text-xs text-blue-600 mt-1">
                  From: M{addToSessionDialog.module.number} - {addToSessionDialog.module.name}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {/* Create new session */}
                <button
                  onClick={() => addTopicAsNewSession(addToSessionDialog.topic, addToSessionDialog.module)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-fastr-primary hover:bg-fastr-primary/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">Create New Session</div>
                    <div className="text-sm text-gray-500">Add as a separate session on Day 1</div>
                  </div>
                </button>

                {/* Existing sessions */}
                {getExistingModuleSessions().length > 0 && (
                  <>
                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide px-1 pt-2">
                      Or add to existing session
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {getExistingModuleSessions().map(({ dayNum, sessionIdx, session }) => (
                        <button
                          key={`${dayNum}-${sessionIdx}`}
                          onClick={() => addTopicToExistingSession(addToSessionDialog.topic, dayNum, sessionIdx)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-fastr-primary hover:bg-fastr-primary/5 transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
                            D{dayNum}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{session.session}</div>
                            <div className="text-sm text-gray-500">
                              {session.module && <span className="text-blue-600">{session.module.toUpperCase()}</span>}
                              {(session.slides?.length ?? 0) > 0 && <span> + {session.slides?.length} extra</span>}
                              {' • '}{session.duration || 0} min
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
              <button
                onClick={() => setAddToSessionDialog(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
