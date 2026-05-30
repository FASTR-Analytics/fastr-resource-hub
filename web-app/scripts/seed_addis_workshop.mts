// Seed the Addis Multi-Country Learning Exchange workshop into workshops.db.
//
// After this runs, the UI's existing "Workshops" picker shows Addis, and the
// export buttons regenerate EN + FR decks the same way they do for Sierra Leone.
// Edit _addisFullConfig.ts to change the deck structure; re-run this script to
// push the change to the DB. Idempotent — uses INSERT OR REPLACE on the id.
//
// Usage:  npx tsx scripts/seed_addis_workshop.mts

import Database from 'better-sqlite3'
import path from 'node:path'
import { addisFullConfig, ADDIS_WORKSHOP_ID } from './_addisFullConfig.js'

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname)
const WEB_APP = path.resolve(SCRIPT_DIR, '..')
const DB_PATH = path.join(WEB_APP, 'data', 'workshops.db')

// The DB stores ONE config (single language). We persist the English variant
// since the UI's language switcher rebuilds from this config plus a language
// override (deckBuilder.buildMarkdown(workshopId, config, lang)).
const config = addisFullConfig('en')
const w = config.workshop

const db = new Database(DB_PATH)
const existing = db.prepare('SELECT id FROM workshops WHERE id = ?').get(ADDIS_WORKSHOP_ID) as { id: string } | undefined

db.prepare(`
  INSERT OR REPLACE INTO workshops
    (id, name, country, location, date, facilitators, objectives, config, updated_at)
  VALUES
    (?,  ?,    ?,       ?,        ?,    ?,            ?,          ?,      CURRENT_TIMESTAMP)
`).run(
  ADDIS_WORKSHOP_ID,
  w.name,
  w.country,
  w.location,
  w.date,
  w.facilitators,
  w.objectives,
  JSON.stringify(config),
)

console.log(`${existing ? 'Updated' : 'Inserted'} workshop: ${ADDIS_WORKSHOP_ID}`)
console.log(`  Name:     ${w.name}`)
console.log(`  Country:  ${w.country}`)
console.log(`  Date:     ${w.date}`)
console.log(`  Sessions: ${(config.schedule.day1?.length || 0) + (config.schedule.day2?.length || 0) + (config.schedule.day3?.length || 0)} entries across ${config.schedule.days} days`)
console.log()
console.log('Rebuild from DB:')
console.log(`  npx tsx scripts/regen_sl_pptx.mts ${ADDIS_WORKSHOP_ID}`)
console.log('Or use the deck builder UI: http://localhost:5173')
