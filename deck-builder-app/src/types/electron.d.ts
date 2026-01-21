// TypeScript declarations for window.electronAPI
// This file extends the Window interface to include Electron IPC methods

interface OutputFile {
  name: string
  path: string
  type: 'md' | 'pdf' | 'pptx'
  modified: Date
}

interface BuildResult {
  success: boolean
  outputPath: string
  outputDir: string
  mdPath: string
  htmlPath: string | null
  pdfPath: string | null
}

interface SlideContent {
  filename: string
  content: string
  isCustom: boolean
  originalContent: string
}

interface ElectronAPI {
  // Workshop operations
  getWorkshops: () => Promise<any[]>
  loadWorkshop: (workshopId: string) => Promise<any>
  saveWorkshop: (workshopId: string, config: any) => Promise<boolean>
  createWorkshop: (workshopId: string, config: any) => Promise<boolean>

  // Content library
  getContentLibrary: () => Promise<any[]>
  readSlide: (filePath: string) => Promise<string>

  // Slide content for editor
  getModuleSlides: (moduleId: string, workshopId: string) => Promise<SlideContent[]>
  getTopicSlide: (topicId: string, workshopId: string) => Promise<SlideContent | null>
  getSlideContent: (slideId: string, workshopId: string) => Promise<SlideContent | null>

  // Custom slides
  getCustomSlides: (workshopId: string) => Promise<any[]>
  saveCustomSlide: (workshopId: string, filename: string, content: string) => Promise<boolean>

  // Templates
  getTemplates: () => Promise<Array<{
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
  }>>

  // Build
  buildDeck: (workshopId: string, skipPdf?: boolean) => Promise<BuildResult>

  // File operations
  openFile: (filePath: string) => Promise<boolean>
  showInFolder: (filePath: string) => Promise<boolean>
  readFileContent: (filePath: string) => Promise<string>
  getOutputsPath: () => Promise<string>
  getWorkshopOutputs: (workshopId: string) => Promise<OutputFile[]>
  openPreviewWindow: (htmlPath: string) => Promise<boolean>

  // AI Assistant
  aiChat: (messages: any[], context: any) => Promise<{
    role: string
    content: string
    toolCalls?: Array<{ id: string; name: string; input: any }>
    stopReason?: string
  }>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
