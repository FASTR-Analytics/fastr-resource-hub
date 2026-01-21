import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Workshop operations
  getWorkshops: () => ipcRenderer.invoke('get-workshops'),
  loadWorkshop: (workshopId: string) => ipcRenderer.invoke('load-workshop', workshopId),
  saveWorkshop: (workshopId: string, config: any) => ipcRenderer.invoke('save-workshop', workshopId, config),
  createWorkshop: (workshopId: string, config: any) => ipcRenderer.invoke('create-workshop', workshopId, config),

  // Content library
  getContentLibrary: () => ipcRenderer.invoke('get-content-library'),
  readSlide: (filePath: string) => ipcRenderer.invoke('read-slide', filePath),

  // Slide content for editor
  getModuleSlides: (moduleId: string, workshopId: string) =>
    ipcRenderer.invoke('get-module-slides', moduleId, workshopId),
  getTopicSlide: (topicId: string, workshopId: string) =>
    ipcRenderer.invoke('get-topic-slide', topicId, workshopId),
  getSlideContent: (slideId: string, workshopId: string) =>
    ipcRenderer.invoke('get-slide-content', slideId, workshopId),

  // Custom slides
  getCustomSlides: (workshopId: string) => ipcRenderer.invoke('get-custom-slides', workshopId),
  saveCustomSlide: (workshopId: string, filename: string, content: string) =>
    ipcRenderer.invoke('save-custom-slide', workshopId, filename, content),

  // Templates
  getTemplates: () => ipcRenderer.invoke('get-templates'),

  // Build
  buildDeck: (workshopId: string, skipPdf?: boolean) => ipcRenderer.invoke('build-deck', workshopId, skipPdf),

  // File operations
  openFile: (filePath: string) => ipcRenderer.invoke('open-file', filePath),
  showInFolder: (filePath: string) => ipcRenderer.invoke('show-in-folder', filePath),
  readFileContent: (filePath: string) => ipcRenderer.invoke('read-file-content', filePath),
  getOutputsPath: () => ipcRenderer.invoke('get-outputs-path'),
  getWorkshopOutputs: (workshopId: string) => ipcRenderer.invoke('get-workshop-outputs', workshopId),
  openPreviewWindow: (htmlPath: string) => ipcRenderer.invoke('open-preview-window', htmlPath),

  // AI Assistant
  aiChat: (messages: any[], context: any) => ipcRenderer.invoke('ai-chat', messages, context),
})

// TypeScript declarations for window.electronAPI
declare global {
  interface Window {
    electronAPI: {
      getWorkshops: () => Promise<any[]>
      loadWorkshop: (workshopId: string) => Promise<any>
      saveWorkshop: (workshopId: string, config: any) => Promise<boolean>
      createWorkshop: (workshopId: string, config: any) => Promise<boolean>
      getContentLibrary: () => Promise<any[]>
      readSlide: (filePath: string) => Promise<string>
      getCustomSlides: (workshopId: string) => Promise<any[]>
      saveCustomSlide: (workshopId: string, filename: string, content: string) => Promise<boolean>
      buildDeck: (workshopId: string) => Promise<{
        success: boolean
        output: string
        outputPath: string
        outputDir: string
      }>
      openFile: (filePath: string) => Promise<boolean>
      showInFolder: (filePath: string) => Promise<boolean>
      readFileContent: (filePath: string) => Promise<string>
      getOutputsPath: () => Promise<string>
      getWorkshopOutputs: (workshopId: string) => Promise<Array<{
        name: string
        path: string
        type: 'md' | 'pdf' | 'pptx'
        modified: Date
      }>>
      aiChat: (messages: any[], context: any) => Promise<{ role: string; content: string }>
    }
  }
}
