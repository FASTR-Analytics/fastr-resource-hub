import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AIContext {
  description: string
  topics: string[]
  duration: string
}

export interface ModuleDefinition {
  id: string           // e.g., 'm4', 'm3b', 'mai', 'overview'
  number: string       // e.g., '4', '3b', 'overview'
  folder: string       // e.g., 'm4_data_quality_assessment'
  name: {
    en: string
    fr: string
  }
  ai_context?: AIContext
}

export interface SlideEntry {
  file: string
  order: number
  variant: 'full' | 'condensed'
  title: string
  status?: 'new' | 'updated'
}

export interface ModuleMeta {
  slides: SlideEntry[]
}

type Language = 'en' | 'fr'

// ─────────────────────────────────────────────────────────────────────────────
// Cache
// ─────────────────────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const CACHE_TTL = 60 * 1000  // 60 seconds

let modulesCache: CacheEntry<ModuleDefinition[]> | null = null
const metaCache = new Map<string, CacheEntry<ModuleMeta>>()

function isFresh<T>(entry: CacheEntry<T> | null): entry is CacheEntry<T> {
  return entry !== null && (Date.now() - entry.timestamp) < CACHE_TTL
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load all module definitions from modules.yaml
 */
export function loadModulesRegistry(): ModuleDefinition[] {
  if (isFresh(modulesCache)) {
    return modulesCache.data
  }

  const modulesPath = path.join(REPO_ROOT, 'modules.yaml')
  if (!fs.existsSync(modulesPath)) {
    console.warn('modules.yaml not found at', modulesPath)
    return []
  }

  const raw = fs.readFileSync(modulesPath, 'utf-8')
  const parsed = yaml.load(raw) as { modules: ModuleDefinition[] }
  const modules = parsed?.modules || []

  modulesCache = { data: modules, timestamp: Date.now() }
  return modules
}

/**
 * Get display name for a module
 */
export function getModuleName(id: string, language: Language = 'en'): string {
  const modules = loadModulesRegistry()

  // Support lookup by id (m4), by number (4), or by folder prefix (mai)
  const mod = modules.find(m =>
    m.id === id ||
    m.number === id ||
    `m${m.number}` === id
  )
  if (!mod) return `Module ${id}`

  return mod.name[language] || mod.name.en || `Module ${id}`
}

/**
 * Get folder name for a module ID
 * Accepts: 'm4', 'mai', 'm3b', 'overview', etc.
 */
export function getModuleFolder(id: string): string | null {
  const modules = loadModulesRegistry()
  const mod = modules.find(m =>
    m.id === id ||
    m.number === id ||
    `m${m.number}` === id
  )
  return mod?.folder || null
}

/**
 * Load _meta.yaml for a specific module folder
 */
export function loadModuleMeta(contentPath: string, folder: string): ModuleMeta | null {
  const cacheKey = path.join(contentPath, folder)
  if (isFresh(metaCache.get(cacheKey) || null)) {
    return metaCache.get(cacheKey)!.data
  }

  const metaPath = path.join(contentPath, folder, '_meta.yaml')
  if (!fs.existsSync(metaPath)) {
    return null
  }

  try {
    const raw = fs.readFileSync(metaPath, 'utf-8')
    const parsed = yaml.load(raw) as ModuleMeta
    if (parsed?.slides) {
      metaCache.set(cacheKey, { data: parsed, timestamp: Date.now() })
      return parsed
    }
  } catch (e) {
    console.warn(`Failed to parse _meta.yaml for ${folder}:`, e)
  }
  return null
}

/**
 * Backward-compatible dict: { m0: 'm0_introduction', m1: '...', mai: '...', ... }
 */
export function getModuleFoldersDict(): Record<string, string> {
  const modules = loadModulesRegistry()
  const dict: Record<string, string> = {}
  for (const mod of modules) {
    dict[mod.id] = mod.folder
    // Also map 'mai' for AI module backward compatibility
    if (mod.id === 'm3b') {
      dict['mai'] = mod.folder
    }
  }
  return dict
}

/**
 * Backward-compatible dict: { 0: 'Introduction to FASTR', '3b': 'AI Assistant', ... }
 */
export function getModuleNamesDict(language: Language = 'en'): Record<number | string, string> {
  const modules = loadModulesRegistry()
  const dict: Record<number | string, string> = {}
  for (const mod of modules) {
    const key = /^\d+$/.test(mod.number) ? parseInt(mod.number) : mod.number
    dict[key] = mod.name[language] || mod.name.en
  }
  return dict
}

/**
 * Get AI context info for a module (by number key like 0, 1, 2, etc.)
 */
export function getModuleAIContext(id: number): AIContext | null {
  const modules = loadModulesRegistry()
  const mod = modules.find(m => m.number === String(id))
  return mod?.ai_context || null
}

/**
 * Invalidate all caches (call after content rebuild)
 */
export function invalidateRegistryCache(): void {
  modulesCache = null
  metaCache.clear()
}
