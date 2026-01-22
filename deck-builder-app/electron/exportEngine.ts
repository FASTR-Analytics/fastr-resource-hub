/**
 * Export Engine Module
 *
 * Handles exporting decks to various formats (HTML, PDF, PPTX) with progress events.
 * Uses Marp CLI for conversions.
 */

import fs from 'fs'
import path from 'path'
import { spawn, ChildProcess } from 'child_process'
import { BrowserWindow } from 'electron'
import {
  ExportFormat,
  ExportOptions,
  ExportProgress,
  ExportResult,
  WorkshopConfig,
  ParsedModule,
} from './types'
import { assembleMarkdown, AssembleOptions } from './slideAssembler'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ExportEngineOptions {
  resourceHubPath: string
  workshopsPath: string
  coreContentPath: string
  templatesPath: string
  outputsPath: string
  themePath: string
}

export type ProgressCallback = (progress: ExportProgress) => void

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Find Marp CLI executable
 */
function findMarpCli(): string {
  const paths = [
    '/opt/homebrew/bin/marp',
    '/usr/local/bin/marp',
    'marp', // Use PATH
  ]

  for (const p of paths) {
    if (p === 'marp') return p // Let shell resolve
    if (fs.existsSync(p)) return p
  }

  return 'marp'
}

/**
 * Find Chrome/Chromium browser for PDF export
 */
function findBrowser(): string {
  const paths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  ]

  for (const p of paths) {
    if (fs.existsSync(p)) return p
  }

  return ''
}

/**
 * Count slides in markdown
 */
function countSlides(markdown: string): number {
  // Remove frontmatter
  let body = markdown
  const frontmatterMatch = markdown.match(/^---\n[\s\S]*?\n---\n?/)
  if (frontmatterMatch) {
    body = markdown.slice(frontmatterMatch[0].length)
  }

  // Count slide separators
  const slides = body.split(/^---$/m).filter(s => s.trim())
  return slides.length
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class ExportEngine {
  private options: ExportEngineOptions
  private mainWindow: BrowserWindow | null = null
  private currentProcess: ChildProcess | null = null

  constructor(options: ExportEngineOptions) {
    this.options = options
  }

  /**
   * Set the main window for sending IPC events
   */
  setMainWindow(window: BrowserWindow | null) {
    this.mainWindow = window
  }

  /**
   * Send progress update to renderer
   */
  private sendProgress(progress: ExportProgress) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('export-progress', progress)
    }
  }

  /**
   * Assemble markdown from workshop config
   */
  async assembleMarkdownFromConfig(
    workshopConfig: WorkshopConfig,
    workshopId: string,
    contentLibrary: ParsedModule[]
  ): Promise<string> {
    const assembleOptions: AssembleOptions = {
      workshopConfig,
      workshopId,
      contentLibrary,
      coreContentPath: this.options.coreContentPath,
      workshopsPath: this.options.workshopsPath,
      templatesPath: this.options.templatesPath,
    }

    return assembleMarkdown(assembleOptions)
  }

  /**
   * Export deck to specified format
   */
  async export(
    workshopConfig: WorkshopConfig,
    workshopId: string,
    contentLibrary: ParsedModule[],
    exportOptions: ExportOptions,
    onProgress?: ProgressCallback
  ): Promise<ExportResult> {
    const startTime = Date.now()
    const { format, outputPath } = exportOptions

    const progress = (p: ExportProgress) => {
      this.sendProgress(p)
      onProgress?.(p)
    }

    try {
      // Stage 1: Preparing
      progress({
        stage: 'preparing',
        progress: 0,
        message: 'Preparing export...',
      })

      // Stage 2: Assembling markdown
      progress({
        stage: 'assembling',
        progress: 10,
        message: 'Assembling slides...',
      })

      const markdown = await this.assembleMarkdownFromConfig(
        workshopConfig,
        workshopId,
        contentLibrary
      )

      const slideCount = countSlides(markdown)
      progress({
        stage: 'assembling',
        progress: 30,
        totalSlides: slideCount,
        message: `Assembled ${slideCount} slides`,
      })

      // Write markdown file
      const mdPath = outputPath || path.join(
        this.options.outputsPath,
        `${workshopId}_deck.md`
      )
      fs.writeFileSync(mdPath, markdown, 'utf-8')

      // If markdown format, we're done
      if (format === 'md') {
        progress({
          stage: 'complete',
          progress: 100,
          totalSlides: slideCount,
          message: 'Markdown export complete',
        })

        return {
          success: true,
          outputPath: mdPath,
          format: 'md',
          slideCount,
          duration: Date.now() - startTime,
        }
      }

      // Stage 3: Rendering with Marp
      progress({
        stage: 'rendering',
        progress: 40,
        totalSlides: slideCount,
        message: `Converting to ${format.toUpperCase()}...`,
      })

      const result = await this.runMarpConversion(
        mdPath,
        format,
        workshopId,
        slideCount,
        progress
      )

      // Stage 4: Complete
      progress({
        stage: 'complete',
        progress: 100,
        totalSlides: slideCount,
        message: `Export complete: ${result.outputPath}`,
      })

      return {
        ...result,
        slideCount,
        duration: Date.now() - startTime,
      }
    } catch (error: any) {
      progress({
        stage: 'error',
        progress: 0,
        error: error.message,
        message: `Export failed: ${error.message}`,
      })

      return {
        success: false,
        outputPath: '',
        format,
        error: error.message,
        duration: Date.now() - startTime,
      }
    }
  }

  /**
   * Run Marp CLI conversion
   */
  private async runMarpConversion(
    mdPath: string,
    format: ExportFormat,
    workshopId: string,
    slideCount: number,
    progress: ProgressCallback
  ): Promise<ExportResult> {
    return new Promise((resolve, reject) => {
      const marpPath = findMarpCli()
      const browserPath = findBrowser()

      // Determine output path and format flag
      const ext = format === 'pptx' ? 'pptx' : format
      const outputPath = path.join(
        this.options.outputsPath,
        `${workshopId}_deck.${ext}`
      )

      // Build args
      const args: string[] = [
        '--no-config',
        '--theme', this.options.themePath,
        '--html',
        '--allow-local-files',
      ]

      // Add format-specific flags
      if (format === 'pdf') {
        args.push('--pdf')
        if (browserPath) {
          args.push('--browser-path', browserPath)
        }
      } else if (format === 'pptx') {
        args.push('--pptx')
      }
      // HTML is the default output

      args.push(mdPath, '-o', outputPath)

      console.log('Running Marp:', marpPath, args.join(' '))

      const marpProcess = spawn(marpPath, args, {
        cwd: this.options.resourceHubPath,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          PUPPETEER_EXECUTABLE_PATH: browserPath || undefined,
        },
      })

      this.currentProcess = marpProcess

      let stdout = ''
      let stderr = ''
      let progressPercent = 40

      marpProcess.stdout.on('data', (data) => {
        stdout += data.toString()

        // Parse progress from Marp output if available
        const output = data.toString()
        if (output.includes('slide')) {
          progressPercent = Math.min(90, progressPercent + 5)
          progress({
            stage: 'rendering',
            progress: progressPercent,
            message: `Rendering slides...`,
          })
        }
      })

      marpProcess.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      // Set timeout
      const timeout = setTimeout(() => {
        console.error('Marp timed out after 120 seconds')
        marpProcess.kill('SIGTERM')
        reject(new Error('Export timed out'))
      }, 120000)

      marpProcess.on('close', (code) => {
        clearTimeout(timeout)
        this.currentProcess = null

        if (code === 0 && fs.existsSync(outputPath)) {
          const stats = fs.statSync(outputPath)
          resolve({
            success: true,
            outputPath,
            format,
            fileSize: stats.size,
          })
        } else {
          // Check if output was created despite error code
          if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath)
            resolve({
              success: true,
              outputPath,
              format,
              fileSize: stats.size,
            })
          } else {
            reject(new Error(stderr || `Marp exited with code ${code}`))
          }
        }
      })

      marpProcess.on('error', (error) => {
        clearTimeout(timeout)
        this.currentProcess = null
        reject(error)
      })
    })
  }

  /**
   * Export to HTML (fast preview)
   */
  async exportHTML(
    workshopConfig: WorkshopConfig,
    workshopId: string,
    contentLibrary: ParsedModule[]
  ): Promise<ExportResult> {
    return this.export(workshopConfig, workshopId, contentLibrary, {
      format: 'html',
      workshopId,
    })
  }

  /**
   * Export to PDF
   */
  async exportPDF(
    workshopConfig: WorkshopConfig,
    workshopId: string,
    contentLibrary: ParsedModule[]
  ): Promise<ExportResult> {
    return this.export(workshopConfig, workshopId, contentLibrary, {
      format: 'pdf',
      workshopId,
    })
  }

  /**
   * Export to PowerPoint
   */
  async exportPPTX(
    workshopConfig: WorkshopConfig,
    workshopId: string,
    contentLibrary: ParsedModule[]
  ): Promise<ExportResult> {
    return this.export(workshopConfig, workshopId, contentLibrary, {
      format: 'pptx',
      workshopId,
    })
  }

  /**
   * Export to Markdown only (fast, no Marp needed)
   */
  async exportMarkdown(
    workshopConfig: WorkshopConfig,
    workshopId: string,
    contentLibrary: ParsedModule[]
  ): Promise<ExportResult> {
    return this.export(workshopConfig, workshopId, contentLibrary, {
      format: 'md',
      workshopId,
    })
  }

  /**
   * Cancel current export
   */
  cancelExport() {
    if (this.currentProcess) {
      this.currentProcess.kill('SIGTERM')
      this.currentProcess = null
    }
  }

  /**
   * Quick build: Just Markdown + HTML (no PDF)
   */
  async quickBuild(
    workshopConfig: WorkshopConfig,
    workshopId: string,
    contentLibrary: ParsedModule[],
    onProgress?: ProgressCallback
  ): Promise<{ mdPath: string; htmlPath: string }> {
    const progress = (p: ExportProgress) => {
      this.sendProgress(p)
      onProgress?.(p)
    }

    progress({
      stage: 'preparing',
      progress: 0,
      message: 'Starting quick build...',
    })

    // Generate markdown
    const mdResult = await this.exportMarkdown(workshopConfig, workshopId, contentLibrary)
    if (!mdResult.success) {
      throw new Error(mdResult.error || 'Markdown generation failed')
    }

    progress({
      stage: 'rendering',
      progress: 50,
      message: 'Generating HTML preview...',
    })

    // Generate HTML
    const htmlResult = await this.exportHTML(workshopConfig, workshopId, contentLibrary)

    progress({
      stage: 'complete',
      progress: 100,
      message: 'Quick build complete',
    })

    return {
      mdPath: mdResult.outputPath,
      htmlPath: htmlResult.success ? htmlResult.outputPath : '',
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FACTORY FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

let exportEngineInstance: ExportEngine | null = null

/**
 * Get or create the export engine instance
 */
export function getExportEngine(resourceHubPath: string): ExportEngine {
  if (!exportEngineInstance) {
    exportEngineInstance = new ExportEngine({
      resourceHubPath,
      workshopsPath: path.join(resourceHubPath, 'workshops'),
      coreContentPath: path.join(resourceHubPath, 'core_content'),
      templatesPath: path.join(resourceHubPath, 'templates'),
      outputsPath: path.join(resourceHubPath, 'outputs'),
      themePath: path.join(resourceHubPath, 'fastr-theme.css'),
    })
  }
  return exportEngineInstance
}
