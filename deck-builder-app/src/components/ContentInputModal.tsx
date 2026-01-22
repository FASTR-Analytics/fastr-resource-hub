/**
 * ContentInputModal Component
 *
 * Pop-up modal that appears when the user adds a slide that requires content input.
 * This ensures no blank slides are created - user must fill in content or cancel.
 */

import { useState, useEffect } from 'react'
import {
  X,
  AlertCircle,
  Target,
  Compass,
  CheckSquare,
  ListOrdered,
  Sparkles,
  Save,
  Wand2,
  Loader2,
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type ContentSlideType = 'objectives' | 'scope' | 'priorities' | 'outputs' | 'custom'

interface WorkshopContext {
  name: string
  country: string
  location: string
  date: string
}

interface ContentInputModalProps {
  slideType: ContentSlideType
  onSave: (content: ContentSlideData) => void
  onCancel: () => void
  existingContent?: ContentSlideData
  workshopContext?: WorkshopContext
}

export interface ContentSlideData {
  type: ContentSlideType
  title: string
  bullets: string[]
  customMarkdown?: string
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE TYPE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const slideTypeConfig: Record<ContentSlideType, {
  icon: typeof Target
  title: string
  defaultTitle: string
  placeholder: string
  helpText: string
  color: string
  bgColor: string
  borderColor: string
}> = {
  objectives: {
    icon: Target,
    title: 'Workshop Objectives',
    defaultTitle: 'Workshop Objectives',
    placeholder: 'By the end of this workshop, participants will be able to...\n\nUnderstand the FASTR methodology\n\nExtract and analyze routine health data\n\nGenerate coverage estimates',
    helpText: 'What will participants learn or be able to do after this workshop?',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  scope: {
    icon: Compass,
    title: 'Scope of Work',
    defaultTitle: 'Scope of Work',
    placeholder: 'Review immunization data for 2020-2024\n\nFocus on national and regional levels\n\nPrioritize routine immunization indicators',
    helpText: 'What data, time periods, and geographic areas will be covered?',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  priorities: {
    icon: ListOrdered,
    title: 'Health Priorities',
    defaultTitle: 'Health Priorities',
    placeholder: 'Strengthen routine immunization coverage\n\nImprove data quality at facility level\n\nSupport evidence-based decision making',
    helpText: 'What are the key health priorities this workshop addresses?',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  outputs: {
    icon: CheckSquare,
    title: 'Expected Outputs',
    defaultTitle: 'Expected Outputs',
    placeholder: 'Analysis-ready dataset\n\nCoverage estimates by district\n\nAction plan for data quality improvement',
    helpText: 'What tangible outputs will participants produce?',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  custom: {
    icon: Sparkles,
    title: 'Custom Content',
    defaultTitle: 'Custom Slide',
    placeholder: 'Enter your slide content here...',
    helpText: 'Create a custom slide with your own content',
    color: 'text-fastr-primary',
    bgColor: 'bg-fastr-primary/5',
    borderColor: 'border-fastr-primary/20',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT INPUT MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function ContentInputModal({
  slideType,
  onSave,
  onCancel,
  existingContent,
  workshopContext,
}: ContentInputModalProps) {
  const config = slideTypeConfig[slideType]
  const Icon = config.icon

  const [title, setTitle] = useState(existingContent?.title || config.defaultTitle)
  const [content, setContent] = useState(
    existingContent?.bullets?.join('\n') || ''
  )
  const [hasError, setHasError] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate content with AI
  const handleGenerateWithAI = async () => {
    if (!workshopContext) return

    setIsGenerating(true)

    try {
      // Build a prompt based on slide type
      const prompts: Record<ContentSlideType, string> = {
        objectives: `Write 4 workshop learning objectives for a FASTR health data analysis workshop in ${workshopContext.country}.

IMPORTANT: Output ONLY the objectives as plain text, one per line. No introduction, no explanation, no tool calls, no markdown. Example:
Understand the FASTR methodology
Extract routine health data from DHIS2
Assess data quality
Generate coverage estimates`,
        scope: `Write 4 scope items for a FASTR workshop in ${workshopContext.country}.

IMPORTANT: Output ONLY the items as plain text, one per line. No introduction, no tool calls, no markdown.`,
        priorities: `Write 4 health priorities for a FASTR workshop in ${workshopContext.country}.

IMPORTANT: Output ONLY the priorities as plain text, one per line. No introduction, no tool calls, no markdown.`,
        outputs: `Write 4 expected outputs for a FASTR workshop in ${workshopContext.country}.

IMPORTANT: Output ONLY the outputs as plain text, one per line. No introduction, no tool calls, no markdown.`,
        custom: `Write 4 bullet points for a workshop slide about ${workshopContext.name}.

IMPORTANT: Output ONLY the bullet points as plain text, one per line. No introduction, no tool calls, no markdown.`,
      }

      const messages = [{
        role: 'user' as const,
        content: prompts[slideType],
      }]

      const response = await window.electronAPI.aiChat(messages, workshopContext)

      if (response.content) {
        // Clean up the response
        const lines = response.content
          .split('\n')
          .map((line: string) => line.replace(/^[\d.-]*\s*/, '').trim())
          .filter((line: string) => line.length > 0)

        setContent(lines.join('\n'))
      }
    } catch (error) {
      console.error('AI generation error:', error)
    }

    setIsGenerating(false)
  }

  // Parse content into bullet points
  const parseBullets = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.replace(/^[-*•]\s*/, '').trim())
      .filter(line => line.length > 0)
  }

  const handleSave = () => {
    const bullets = parseBullets(content)

    if (bullets.length === 0) {
      setHasError(true)
      return
    }

    onSave({
      type: slideType,
      title,
      bullets,
    })
  }

  // Reset error when content changes
  useEffect(() => {
    if (content.trim()) {
      setHasError(false)
    }
  }, [content])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between ${config.bgColor} border-b ${config.borderColor}`}>
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${config.color}`} />
            <div>
              <h2 className={`text-lg font-semibold ${config.color}`}>
                {config.title}
              </h2>
              <p className="text-sm text-gray-600">
                Fill in the content for this slide
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slide Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-primary focus:border-transparent"
            />
          </div>

          {/* Content input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Content (one item per line)
              </label>
              {workshopContext && (
                <button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-fastr-primary bg-fastr-primary/10 rounded-md hover:bg-fastr-primary/20 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              )}
            </div>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={config.placeholder}
              rows={6}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fastr-primary focus:border-transparent ${
                hasError ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
            <p className="mt-1 text-xs text-gray-500">
              {config.helpText}
            </p>
          </div>

          {/* Error message */}
          {hasError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Please add at least one bullet point</span>
            </div>
          )}

          {/* Preview */}
          {content.trim() && (
            <div className={`p-4 rounded-lg ${config.bgColor} border ${config.borderColor}`}>
              <h4 className={`text-sm font-semibold ${config.color} mb-2`}>Preview</h4>
              <ul className="space-y-1">
                {parseBullets(content).map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Content is required before adding this slide
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                config.color.replace('text-', 'bg-').replace('600', '500')
              } hover:opacity-90`}
            >
              <Save className="w-4 h-4" />
              Add Slide
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentInputModal
