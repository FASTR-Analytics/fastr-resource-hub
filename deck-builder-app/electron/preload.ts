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

  // Custom slides
  getCustomSlides: (workshopId: string) => ipcRenderer.invoke('get-custom-slides', workshopId),
  saveCustomSlide: (workshopId: string, filename: string, content: string) =>
    ipcRenderer.invoke('save-custom-slide', workshopId, filename, content),

  // Build
  buildDeck: (workshopId: string) => ipcRenderer.invoke('build-deck', workshopId),

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
      buildDeck: (workshopId: string) => Promise<{ success: boolean; output: string }>
      aiChat: (messages: any[], context: any) => Promise<{ role: string; content: string }>
    }
  }
}
