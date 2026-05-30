// One-off: regenerate fastr_sierra_leone_onboarding_jun2026 PPTX
// through the fixed generator. Reads workshops.db directly.
import Database from 'better-sqlite3'
import path from 'node:path'
import { buildMarkdown } from '../server/services/deckBuilder.js'
import { generatePPTX } from '../server/services/pptxGenerator.js'

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname)
const WEB_APP = path.resolve(SCRIPT_DIR, '..')

const id = process.argv[2] || 'fastr_sierra_leone_onboarding_jun2026'
const db = new Database(path.join(WEB_APP, 'data', 'workshops.db'), { readonly: true })

const row = db.prepare('SELECT config FROM workshops WHERE id = ?').get(id) as { config: string } | undefined
if (!row) {
  console.error('Workshop not found:', id)
  process.exit(1)
}
const config = JSON.parse(row.config)

const md = await buildMarkdown(id, config)
const out = path.join(WEB_APP, 'outputs', `${id}_deck.pptx`)
const { warnings } = await generatePPTX(md, config, out)
console.log('Wrote', out)
if (warnings.length) console.log('warnings:', warnings.length)
