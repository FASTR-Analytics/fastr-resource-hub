// Build Addis Day 1 AI Assistant FR PPTX (8 slides).
// Mirrors the EN master deck's AI module section so it can be slotted in
// where the FR deck currently has "MISSING CONTENT CLAIRE TO TRANSLATE…".
//
// Usage:  npx tsx scripts/build_addis_ai_fr.mts
// Output: web-app/outputs/addis_ai_fr.pptx

import path from 'node:path'
import { buildMarkdown } from '../server/services/deckBuilder.js'
import { generatePPTX } from '../server/services/pptxGenerator.js'

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname)
const WEB_APP = path.resolve(SCRIPT_DIR, '..')

const config = {
  workshop: {
    name: 'Atelier FASTR Addis — Assistant IA',
    title: 'Échange et apprentissage multi-pays',
    subtitle: "Jour 1 — L'assistant IA",
    country: 'Éthiopie',
    location: 'Addis Ababa',
    date: '24 juin 2026',
    start_date: '2026-06-24',
    end_date: '2026-06-24',
    facilitators: '',
    objectives: '',
    expected_outputs: '',
    language: 'fr',
  },
  schedule: {
    days: 1,
    day_titles: { '1': 'Jour 1' },
    day_start_times: { '1': '09:00' },
    day_end_times: { '1': '17:00' },
    day1: [
      {
        _id: 's4-ai',
        session: "Assistant IA",
        module: 'm3b',  // Pulls all 13 mai slides in _meta.yaml order — trim manually after.
        duration: 60,
      },
    ],
  },
}

console.log('Building addis_ai_fr…')
const md = await buildMarkdown('addis_ai_fr', config as any, 'fr')
const out = path.join(WEB_APP, 'outputs', 'addis_ai_fr.pptx')
const { warnings } = await generatePPTX(md, config as any, out)
console.log(`  → ${out}`)
if (warnings.length) console.log(`  ${warnings.length} warning(s):`, warnings.slice(0, 3))
