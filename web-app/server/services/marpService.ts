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

// All loaded theme CSS keyed by theme name
const themeCSS: Record<string, string> = {}

// Theme file mapping
const THEME_FILES: Record<string, string> = {
  'fastr': 'fastr-theme.css',
}

/**
 * Initialize the global Marp instance with all FASTR themes
 * Called once at startup, reused for all renders
 */
export async function initializeMarp(): Promise<void> {
  if (marpInstance) return  // Already initialized

  const { Marp } = await import('@marp-team/marp-core')
  marpInstance = new Marp({ html: true })

  // Load and cache all FASTR themes
  for (const [themeName, fileName] of Object.entries(THEME_FILES)) {
    const themePath = path.join(REPO_ROOT, fileName)
    if (fs.existsSync(themePath)) {
      const css = fs.readFileSync(themePath, 'utf-8')
      themeCSS[themeName] = css
      marpInstance.themeSet.add(css)
    }
  }

  // Keep backward compatibility
  fastrThemeCSS = themeCSS['fastr'] || ''
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
 * Get the cached FASTR theme CSS (classic theme for backward compatibility)
 */
export function getThemeCSS(): string {
  return fastrThemeCSS
}

/**
 * Get the FASTR deck theme CSS. (A `theme` arg is accepted for call-site
 * compatibility; there is a single deck theme now.)
 */
export function getThemeCSSByName(_theme?: string): string {
  return themeCSS['fastr'] || fastrThemeCSS
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
