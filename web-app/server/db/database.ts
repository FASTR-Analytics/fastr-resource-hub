import Database, { Database as DatabaseType } from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Database file location
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data/workshops.db')

// Ensure data directory exists
import fs from 'fs'
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize database
const db: DatabaseType = new Database(DB_PATH)

// Enable foreign keys and WAL mode for better performance
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

// Create tables
db.exec(`
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
    config JSON NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS custom_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workshop_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE,
    UNIQUE(workshop_id, filename)
  );

  CREATE INDEX IF NOT EXISTS idx_workshops_country ON workshops(country);
  CREATE INDEX IF NOT EXISTS idx_custom_slides_workshop ON custom_slides(workshop_id);
`)

// Add locked column if it doesn't exist (migration)
try {
  db.exec(`ALTER TABLE workshops ADD COLUMN locked INTEGER DEFAULT 0`)
} catch (e: any) {
  // Column already exists, ignore
  if (!e.message.includes('duplicate column')) {
    console.error('Migration error:', e.message)
  }
}

console.log('Database initialized at:', DB_PATH)

export default db

// ─────────────────────────────────────────────────────────────────────────────
// Workshop Operations
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

// Get all workshops (summary)
export function getAllWorkshops() {
  const stmt = db.prepare(`
    SELECT id, name, country, location, date,
           json_extract(config, '$.schedule.days') as days,
           locked
    FROM workshops
    ORDER BY updated_at DESC
  `)
  return stmt.all().map((row: any) => ({
    ...row,
    locked: row.locked === 1
  }))
}

// Get single workshop
export function getWorkshop(id: string): WorkshopConfig | null {
  const stmt = db.prepare('SELECT config FROM workshops WHERE id = ?')
  const row = stmt.get(id) as { config: string } | undefined
  if (!row) return null
  return JSON.parse(row.config)
}

// Create workshop
export function createWorkshop(id: string, config: WorkshopConfig) {
  const stmt = db.prepare(`
    INSERT INTO workshops (id, name, country, location, date, facilitators, venue, contact_email, website, objectives, config)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(
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
  )
}

// Update workshop
export function updateWorkshop(id: string, config: WorkshopConfig) {
  const stmt = db.prepare(`
    UPDATE workshops
    SET name = ?, country = ?, location = ?, date = ?, facilitators = ?,
        venue = ?, contact_email = ?, website = ?, objectives = ?,
        config = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `)
  stmt.run(
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
  )
}

// Delete workshop (only if not locked)
export function deleteWorkshop(id: string): boolean {
  // Check if locked
  const workshop = db.prepare('SELECT locked FROM workshops WHERE id = ?').get(id) as { locked: number } | undefined
  if (workshop?.locked) {
    return false // Cannot delete locked workshop
  }
  const stmt = db.prepare('DELETE FROM workshops WHERE id = ?')
  stmt.run(id)
  return true
}

// Lock/unlock workshop
export function setWorkshopLocked(id: string, locked: boolean) {
  const stmt = db.prepare('UPDATE workshops SET locked = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
  stmt.run(locked ? 1 : 0, id)
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Slides Operations
// ─────────────────────────────────────────────────────────────────────────────

export function getCustomSlides(workshopId: string) {
  const stmt = db.prepare(`
    SELECT filename, content FROM custom_slides WHERE workshop_id = ?
  `)
  return stmt.all(workshopId)
}

export function saveCustomSlide(workshopId: string, filename: string, content: string) {
  const stmt = db.prepare(`
    INSERT INTO custom_slides (workshop_id, filename, content)
    VALUES (?, ?, ?)
    ON CONFLICT(workshop_id, filename) DO UPDATE SET
      content = excluded.content,
      updated_at = CURRENT_TIMESTAMP
  `)
  stmt.run(workshopId, filename, content)
}

export function deleteCustomSlide(workshopId: string, filename: string) {
  const stmt = db.prepare('DELETE FROM custom_slides WHERE workshop_id = ? AND filename = ?')
  stmt.run(workshopId, filename)
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-import workshops from file system on startup
// ─────────────────────────────────────────────────────────────────────────────

function autoImportWorkshops() {
  const REPO_ROOT = process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../../..')
    : path.resolve(__dirname, '../..')
  const WORKSHOPS_PATH = path.join(REPO_ROOT, 'workshops')

  console.log('Auto-importing workshops from:', WORKSHOPS_PATH)

  if (!fs.existsSync(WORKSHOPS_PATH)) {
    console.log('Workshops folder not found, skipping auto-import')
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
    const existing = getWorkshop(folder)
    if (existing) {
      skipped++
      continue
    }

    // Read and parse YAML
    try {
      const yamlContent = fs.readFileSync(yamlPath, 'utf-8')
      const config = yaml.load(yamlContent) as WorkshopConfig
      createWorkshop(folder, config)
      imported++
      console.log(`  Imported: ${folder}`)
    } catch (err: any) {
      console.error(`  Error importing ${folder}:`, err.message)
    }
  }

  console.log(`Auto-import complete: ${imported} imported, ${skipped} already exist`)
}

// Run auto-import on module load
autoImportWorkshops()
