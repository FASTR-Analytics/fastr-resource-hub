/**
 * Quick terminal deck build — render an existing workshop to PDF/HTML/markdown
 * without going through the web UI. Uses the same buildMarkdown the app uses, so
 * you get the live theme, dynamic chrome and the auto-compact tier.
 *
 * Usage (run from web-app/):
 *   npx tsx scripts/build_deck.mts <workshop-id> [pdf|html|md]
 *   npx tsx scripts/build_deck.mts                 # lists workshop ids
 *
 * Output: /tmp/deck_<id>.<ext>
 */
import Database from 'better-sqlite3'
import { buildMarkdown } from '../server/services/deckBuilder.js'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname)
const WEB_APP = path.resolve(SCRIPT_DIR, '..')
const REPO_ROOT = path.resolve(WEB_APP, '..')
const db = new Database(path.join(WEB_APP, 'data', 'workshops.db'), { readonly: true })

const id = process.argv[2]
const fmt = (process.argv[3] || 'pdf').toLowerCase()

if (!id) {
  const ids = db.prepare('SELECT id FROM workshops ORDER BY id').all() as { id: string }[]
  console.log('workshop ids:\n' + ids.map(r => '  ' + r.id).join('\n'))
  console.log('\nusage: npx tsx scripts/build_deck.mts <workshop-id> [pdf|html|md]')
  process.exit(0)
}

const row = db.prepare('SELECT id, config FROM workshops WHERE id = ?').get(id) as { id: string; config: string } | undefined
if (!row) { console.error(`No workshop "${id}".`); process.exit(1) }

const config = JSON.parse(row.config)
const lang = config.workshop?.language || 'en'
let md = await buildMarkdown(row.id, config, lang)

// Resolve resource paths to absolute so Marp CLI can load them locally.
md = md
  .replace(/\.\.\/\.\.\/resources\//g, REPO_ROOT + '/resources/')
  .replace(/\.\.\/resources\//g, REPO_ROOT + '/resources/')

const mdPath = `/tmp/deck_${id}.md`
fs.writeFileSync(mdPath, md)

if (fmt === 'md') {
  console.log(`wrote ${mdPath}`)
  process.exit(0)
}

const out = `/tmp/deck_${id}.${fmt}`
execFileSync(
  path.join(WEB_APP, 'node_modules', '.bin', 'marp'),
  [mdPath, '--theme-set', path.join(REPO_ROOT, 'fastr-theme.css'), '--allow-local-files', `--${fmt}`, '-o', out],
  { stdio: 'inherit', cwd: REPO_ROOT }
)
console.log(`wrote ${out}`)
