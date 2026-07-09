import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { THEMES, getThemeSpec } from './themeTokens.js'

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

// All loaded theme CSS keyed by Marp theme name (e.g. 'fastr', 'fastr-2026')
const themeCSS: Record<string, string> = {}

// Theme files come from the theme registry. The base 'fastr' theme must be
// registered first — variant CSS files `@import 'fastr'` and Marpit resolves
// that against the registered theme set by name.
const THEME_FILES: Record<string, string> = Object.fromEntries(
  Object.values(THEMES).map(spec => [spec.marpTheme, spec.cssFile])
)

/**
 * Initialize the global Marp instance with all FASTR themes
 * Called once at startup, reused for all renders
 */
export async function initializeMarp(): Promise<void> {
  if (marpInstance) return  // Already initialized

  const { Marp } = await import('@marp-team/marp-core')
  marpInstance = new Marp({ html: true })

  // Load and cache all FASTR themes — base 'fastr' first so variants can
  // @import it, then the rest.
  const names = Object.keys(THEME_FILES).sort((a, b) =>
    a === 'fastr' ? -1 : b === 'fastr' ? 1 : a.localeCompare(b)
  )
  for (const themeName of names) {
    const themePath = path.join(REPO_ROOT, THEME_FILES[themeName])
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
 * Get the deck theme CSS for a workshop theme id ('classic' | 'fastr2026' |
 * 'minimal' | legacy/unknown → classic). Returns the raw CSS of that theme's
 * file — used as a cache-key salt and for direct injection.
 */
export function getThemeCSSByName(theme?: string): string {
  const spec = getThemeSpec(theme)
  return themeCSS[spec.marpTheme] || fastrThemeCSS
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
