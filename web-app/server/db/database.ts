import { createClient, Client } from '@libsql/client'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─────────────────────────────────────────────────────────────────────────────
// Database Client Setup
// ─────────────────────────────────────────────────────────────────────────────

let db: Client

// Check if Turso is configured (production) or use local SQLite (dev)
if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
  // Use Turso cloud database
  db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  console.log('Database: Connected to Turso cloud')
} else {
  // Use local SQLite file for development
  const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/workshops.db')
  const dataDir = path.dirname(DB_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  db = createClient({
    url: `file:${DB_PATH}`,
  })
  console.log('Database: Using local SQLite at', DB_PATH)
}

// ─────────────────────────────────────────────────────────────────────────────
// Initialize Database Schema
// ─────────────────────────────────────────────────────────────────────────────

export async function initializeDatabase() {
  // Create tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS workshops (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT NOT NULL,
      location TEXT,
      date TEXT,
      facilitators TEXT,
      venue TEXT,
      contact_email TEXT,
      website TEXT,
      objectives TEXT,
      config TEXT NOT NULL,
      locked INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS custom_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      workshop_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE,
      UNIQUE(workshop_id, filename)
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS imported_modules (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      source_filename TEXT,
      slide_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS imported_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      module_id TEXT NOT NULL,
      slide_order INTEGER NOT NULL,
      original_text TEXT,
      markdown TEXT NOT NULL,
      title TEXT,
      FOREIGN KEY (module_id) REFERENCES imported_modules(id) ON DELETE CASCADE
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS external_decks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      source_filename TEXT,
      page_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS external_pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deck_id TEXT NOT NULL,
      page_number INTEGER NOT NULL,
      image_filename TEXT NOT NULL,
      width INTEGER,
      height INTEGER,
      FOREIGN KEY (deck_id) REFERENCES external_decks(id) ON DELETE CASCADE
    )
  `)

  // Create indexes (ignore if exist)
  try {
    await db.execute('CREATE INDEX idx_workshops_country ON workshops(country)')
  } catch (e) {
    // Index already exists
  }
  try {
    await db.execute('CREATE INDEX idx_custom_slides_workshop ON custom_slides(workshop_id)')
  } catch (e) {
    // Index already exists
  }
  try {
    await db.execute('CREATE INDEX idx_imported_slides_module ON imported_slides(module_id)')
  } catch (e) {
    // Index already exists
  }
  try {
    await db.execute('CREATE INDEX idx_external_pages_deck ON external_pages(deck_id)')
  } catch (e) {
    // Index already exists
  }

  console.log('Database schema initialized')

  // Auto-import workshops from file system
  await autoImportWorkshops()
}

export default db

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface WorkshopRow {
  id: string
  name: string
  country: string
  location: string | null
  date: string | null
  facilitators: string | null
  venue: string | null
  contact_email: string | null
  website: string | null
  objectives: string | null
  config: string // JSON string
  locked: number // 0 or 1
  created_at: string
  updated_at: string
}

export interface WorkshopConfig {
  workshop: {
    name: string
    country: string
    location: string
    date: string
    facilitators: string
    venue?: string
    contact_email?: string
    website?: string
    objectives?: string
    theme?: 'classic' | 'clean' | 'bold'
  }
  schedule: {
    days: number
    day_titles?: Record<number, string>
    day_start_times?: Record<number, string>
    [key: string]: any
  }
  content: {
    modules: number[]
    custom_slides: string[]
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Workshop Operations (Async)
// ─────────────────────────────────────────────────────────────────────────────

// Get all workshops (summary)
export async function getAllWorkshops() {
  const result = await db.execute(`
    SELECT id, name, country, location, date,
           json_extract(config, '$.schedule.days') as days,
           locked
    FROM workshops
    ORDER BY updated_at DESC
  `)
  return result.rows.map((row: any) => ({
    id: row.id,
    name: row.name,
    country: row.country,
    location: row.location,
    date: row.date,
    days: row.days,
    locked: row.locked === 1
  }))
}

// Get single workshop
export async function getWorkshop(id: string): Promise<WorkshopConfig | null> {
  const result = await db.execute({
    sql: 'SELECT config FROM workshops WHERE id = ?',
    args: [id]
  })
  if (result.rows.length === 0) return null
  return JSON.parse(result.rows[0].config as string)
}

// Create workshop
export async function createWorkshop(id: string, config: WorkshopConfig) {
  await db.execute({
    sql: `
      INSERT INTO workshops (id, name, country, location, date, facilitators, venue, contact_email, website, objectives, config)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id,
      config.workshop.name,
      config.workshop.country,
      config.workshop.location,
      config.workshop.date,
      config.workshop.facilitators,
      config.workshop.venue || null,
      config.workshop.contact_email || null,
      config.workshop.website || null,
      config.workshop.objectives || null,
      JSON.stringify(config)
    ]
  })
}

// Update workshop
export async function updateWorkshop(id: string, config: WorkshopConfig) {
  await db.execute({
    sql: `
      UPDATE workshops
      SET name = ?, country = ?, location = ?, date = ?, facilitators = ?,
          venue = ?, contact_email = ?, website = ?, objectives = ?,
          config = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
    args: [
      config.workshop.name,
      config.workshop.country,
      config.workshop.location,
      config.workshop.date,
      config.workshop.facilitators,
      config.workshop.venue || null,
      config.workshop.contact_email || null,
      config.workshop.website || null,
      config.workshop.objectives || null,
      JSON.stringify(config),
      id
    ]
  })
}

// Delete workshop (only if not locked)
export async function deleteWorkshop(id: string): Promise<boolean> {
  // Check if locked
  const result = await db.execute({
    sql: 'SELECT locked FROM workshops WHERE id = ?',
    args: [id]
  })
  if (result.rows.length > 0 && result.rows[0].locked === 1) {
    return false // Cannot delete locked workshop
  }
  await db.execute({
    sql: 'DELETE FROM workshops WHERE id = ?',
    args: [id]
  })
  return true
}

// Lock/unlock workshop
export async function setWorkshopLocked(id: string, locked: boolean) {
  await db.execute({
    sql: 'UPDATE workshops SET locked = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [locked ? 1 : 0, id]
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Slides Operations
// ─────────────────────────────────────────────────────────────────────────────

export async function getCustomSlides(workshopId: string) {
  const result = await db.execute({
    sql: 'SELECT filename, content FROM custom_slides WHERE workshop_id = ?',
    args: [workshopId]
  })
  return result.rows.map((row: any) => ({
    filename: row.filename,
    content: row.content
  }))
}

export async function saveCustomSlide(workshopId: string, filename: string, content: string) {
  await db.execute({
    sql: `
      INSERT INTO custom_slides (workshop_id, filename, content)
      VALUES (?, ?, ?)
      ON CONFLICT(workshop_id, filename) DO UPDATE SET
        content = excluded.content,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [workshopId, filename, content]
  })
}

export async function deleteCustomSlide(workshopId: string, filename: string) {
  await db.execute({
    sql: 'DELETE FROM custom_slides WHERE workshop_id = ? AND filename = ?',
    args: [workshopId, filename]
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// Imported Modules Operations
// ─────────────────────────────────────────────────────────────────────────────

export interface ImportedModuleRow {
  id: string
  name: string
  source_filename: string | null
  slide_count: number
  created_at: string
  updated_at: string
}

export interface ImportedSlideRow {
  id: number
  module_id: string
  slide_order: number
  original_text: string | null
  markdown: string
  title: string | null
}

export async function getAllImportedModules(): Promise<ImportedModuleRow[]> {
  const result = await db.execute('SELECT * FROM imported_modules ORDER BY created_at DESC')
  return result.rows as unknown as ImportedModuleRow[]
}

export async function getImportedModule(id: string): Promise<ImportedModuleRow | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM imported_modules WHERE id = ?',
    args: [id]
  })
  if (result.rows.length === 0) return null
  return result.rows[0] as unknown as ImportedModuleRow
}

export async function createImportedModule(id: string, name: string, sourceFilename: string | null, slideCount: number) {
  await db.execute({
    sql: 'INSERT INTO imported_modules (id, name, source_filename, slide_count) VALUES (?, ?, ?, ?)',
    args: [id, name, sourceFilename, slideCount]
  })
}

export async function deleteImportedModule(id: string) {
  // Delete slides first (cascade may not work in all SQLite modes)
  await db.execute({ sql: 'DELETE FROM imported_slides WHERE module_id = ?', args: [id] })
  await db.execute({ sql: 'DELETE FROM imported_modules WHERE id = ?', args: [id] })
}

export async function getImportedSlides(moduleId: string): Promise<ImportedSlideRow[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM imported_slides WHERE module_id = ? ORDER BY slide_order',
    args: [moduleId]
  })
  return result.rows as unknown as ImportedSlideRow[]
}

export async function saveImportedSlides(moduleId: string, slides: Array<{ order: number; originalText: string | null; markdown: string; title: string | null }>) {
  // Clear existing slides for this module
  await db.execute({ sql: 'DELETE FROM imported_slides WHERE module_id = ?', args: [moduleId] })
  // Insert new slides
  for (const slide of slides) {
    await db.execute({
      sql: 'INSERT INTO imported_slides (module_id, slide_order, original_text, markdown, title) VALUES (?, ?, ?, ?, ?)',
      args: [moduleId, slide.order, slide.originalText, slide.markdown, slide.title]
    })
  }
}

export async function updateImportedSlide(id: number, markdown: string) {
  await db.execute({
    sql: 'UPDATE imported_slides SET markdown = ? WHERE id = ?',
    args: [markdown, id]
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// External Decks Operations
// ─────────────────────────────────────────────────────────────────────────────

export interface ExternalDeckRow {
  id: string
  name: string
  source_filename: string | null
  page_count: number
  created_at: string
}

export interface ExternalPageRow {
  id: number
  deck_id: string
  page_number: number
  image_filename: string
  width: number | null
  height: number | null
}

export async function createExternalDeck(
  id: string,
  name: string,
  sourceFilename: string | null,
  pages: Array<{ pageNumber: number; width: number; height: number; imageFilename: string }>
) {
  await db.execute({
    sql: 'INSERT INTO external_decks (id, name, source_filename, page_count) VALUES (?, ?, ?, ?)',
    args: [id, name, sourceFilename, pages.length]
  })
  for (const page of pages) {
    await db.execute({
      sql: 'INSERT INTO external_pages (deck_id, page_number, image_filename, width, height) VALUES (?, ?, ?, ?, ?)',
      args: [id, page.pageNumber, page.imageFilename, page.width || null, page.height || null]
    })
  }
}

export async function getAllExternalDecks(): Promise<ExternalDeckRow[]> {
  const result = await db.execute('SELECT * FROM external_decks ORDER BY created_at DESC')
  return result.rows as unknown as ExternalDeckRow[]
}

export async function getExternalDeck(id: string): Promise<ExternalDeckRow | null> {
  const result = await db.execute({
    sql: 'SELECT * FROM external_decks WHERE id = ?',
    args: [id]
  })
  if (result.rows.length === 0) return null
  return result.rows[0] as unknown as ExternalDeckRow
}

export async function getExternalPages(deckId: string): Promise<ExternalPageRow[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM external_pages WHERE deck_id = ? ORDER BY page_number',
    args: [deckId]
  })
  return result.rows as unknown as ExternalPageRow[]
}

export async function deleteExternalDeck(id: string) {
  await db.execute({ sql: 'DELETE FROM external_pages WHERE deck_id = ?', args: [id] })
  await db.execute({ sql: 'DELETE FROM external_decks WHERE id = ?', args: [id] })
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-import workshops from file system on startup
// ─────────────────────────────────────────────────────────────────────────────

async function autoImportWorkshops() {
  const REPO_ROOT = process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../../../..')
    : path.resolve(__dirname, '../../..')
  const WORKSHOPS_PATH = path.join(REPO_ROOT, 'workshops')

  if (!fs.existsSync(WORKSHOPS_PATH)) {
    return
  }

  const folders = fs.readdirSync(WORKSHOPS_PATH)
  let imported = 0
  let skipped = 0

  for (const folder of folders) {
    const workshopPath = path.join(WORKSHOPS_PATH, folder)
    const yamlPath = path.join(workshopPath, 'workshop.yaml')

    // Skip non-directories and folders without workshop.yaml
    try {
      if (!fs.statSync(workshopPath).isDirectory()) continue
    } catch {
      continue
    }
    if (!fs.existsSync(yamlPath)) continue

    // Check if already exists
    const existing = await getWorkshop(folder)
    if (existing) {
      skipped++
      continue
    }

    // Read and parse YAML
    try {
      const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
      const config = yaml.load(yamlContent) as WorkshopConfig
      await createWorkshop(folder, config)
      imported++
    } catch (err: any) {
      console.error(`  Error importing ${folder}:`, err.message)
    }
  }

}
