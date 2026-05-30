// Build FR filler slides missing from the Addis FR master deck:
//   - m9b_1_login_folder_activity.md  ("Activité : entrer dans la plateforme…")
//   - m9f_4b_introducing_prompt_library.md ("Ce qu'il y a dans la bibliothèque…")
//
// Usage:  npx tsx scripts/build_addis_fillers_fr.mts
// Output: web-app/outputs/addis_fillers_fr.pptx

import path from 'node:path'
import { buildMarkdown } from '../server/services/deckBuilder.js'
import { generatePPTX } from '../server/services/pptxGenerator.js'

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname)
const WEB_APP = path.resolve(SCRIPT_DIR, '..')

const config = {
  workshop: {
    name: 'Atelier FASTR Addis — diapos manquantes',
    title: 'Échange et apprentissage multi-pays',
    subtitle: 'Diapositives à insérer dans le deck principal',
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
    day_titles: { '1': '' },
    day_start_times: { '1': '09:00' },
    day_end_times: { '1': '17:00' },
    day1: [
      {
        _id: 'm9b-login',
        session: "Prise en main de la plateforme",
        slides: ['m9b_1_login_folder_activity.md'],
        duration: 15,
      },
      {
        _id: 'm9f-prompt-lib',
        session: "Bibliothèque de prompts FASTR",
        slides: ['m9f_4b_introducing_prompt_library.md'],
        duration: 10,
      },
    ],
  },
}

console.log('Building addis_fillers_fr…')
const md = await buildMarkdown('addis_fillers_fr', config as any, 'fr')
const out = path.join(WEB_APP, 'outputs', 'addis_fillers_fr.pptx')
const { warnings } = await generatePPTX(md, config as any, out)
console.log(`  → ${out}`)
if (warnings.length) console.log(`  ${warnings.length} warning(s):`, warnings.slice(0, 3))
