// Build the full 3-day Addis Multi-Country Learning Exchange deck (EN + FR).
//
// Reads the shared config from _addisFullConfig.ts so the same source of truth
// drives both this local build AND the workshops.db seed (seed_addis_workshop.mts).
//
// Usage:  npx tsx scripts/build_addis_full.mts
// Output: web-app/outputs/addis_full_en.pptx, addis_full_fr.pptx

import path from 'node:path'
import { buildMarkdown } from '../server/services/deckBuilder.js'
import { generatePPTX } from '../server/services/pptxGenerator.js'
import { addisFullConfig } from './_addisFullConfig.js'

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname)
const WEB_APP = path.resolve(SCRIPT_DIR, '..')

for (const lang of ['en', 'fr', 'pt'] as const) {
  const config = addisFullConfig(lang)
  const id = `addis_full_${lang}`
  console.log(`Building ${id}…`)
  const md = await buildMarkdown(id, config as any, lang)
  const out = path.join(WEB_APP, 'outputs', `${id}.pptx`)
  const { warnings } = await generatePPTX(md, config as any, out)
  console.log(`  → ${out}`)
  if (warnings.length) console.log(`  ${warnings.length} warning(s):`, warnings.slice(0, 5))
}
