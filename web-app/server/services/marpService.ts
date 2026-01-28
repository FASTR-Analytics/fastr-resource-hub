import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Repo root path (different in dev vs prod)
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')

// Singleton Marp instance and theme cache
let marpInstance: any = null
let fastrThemeCSS: string = ''
let marpCSS: string = ''  // Cached CSS from last render

/**
 * Initialize the global Marp instance with FASTR theme
 * Called once at startup, reused for all renders
 */
export async function initializeMarp(): Promise<void> {
  if (marpInstance) return  // Already initialized

  const { Marp } = await import('@marp-team/marp-core')
  marpInstance = new Marp({ html: true })

  // Load and cache FASTR theme
  const themePath = path.join(REPO_ROOT, 'fastr-theme.css')
  if (fs.existsSync(themePath)) {
    fastrThemeCSS = fs.readFileSync(themePath, 'utf-8')
    marpInstance.themeSet.add(fastrThemeCSS)
  }

  console.log('✓ Marp service initialized with FASTR theme')
}

/**
 * Render markdown to HTML using the shared Marp instance
 * Much faster than creating a new instance per request
 */
export function renderMarkdown(markdown: string): { html: string; css: string } {
  if (!marpInstance) {
    throw new Error('Marp service not initialized. Call initializeMarp() first.')
  }

  const result = marpInstance.render(markdown)
  marpCSS = result.css  // Cache for later use
  return result
}

/**
 * Get the cached FASTR theme CSS
 */
export function getThemeCSS(): string {
  return fastrThemeCSS
}

/**
 * Get the Marp CSS from the last render
 */
export function getMarpCSS(): string {
  return marpCSS
}

/**
 * Get the repo root path
 */
export function getRepoRoot(): string {
  return REPO_ROOT
}
