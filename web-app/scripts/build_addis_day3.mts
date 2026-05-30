// Build Addis Day 3 PPTX (EN + FR) from in-memory config.
// Day 3 sessions: 12 HFA · 13 Peer review + finalize · 14 Linking results · 15 Roadmap
//
// Usage:  npx tsx scripts/build_addis_day3.mts
// Outputs: web-app/outputs/addis_day3_en.pptx, addis_day3_fr.pptx
//
// Manual polish expected: timing, country examples, presenter notes. The point
// is to populate placeholders with real library content so the user has a
// starting deck to edit instead of a stack of "PLACEHOLDER" slides.

import path from 'node:path'
import { buildMarkdown } from '../server/services/deckBuilder.js'
import { generatePPTX } from '../server/services/pptxGenerator.js'

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname)
const WEB_APP = path.resolve(SCRIPT_DIR, '..')

function dayConfig(language: 'en' | 'fr') {
  const fr = language === 'fr'
  return {
    workshop: {
      name: fr ? 'Atelier FASTR Addis — Jour 3' : 'FASTR Addis Workshop — Day 3',
      title: fr ? 'Échange et apprentissage multi-pays' : 'Multi-Country Learning Exchange',
      subtitle: fr ? 'Jour 3 — Évaluation FOSA, revue par les pairs, action' : 'Day 3 — HFA, peer review, action',
      country: fr ? 'Éthiopie' : 'Ethiopia',
      location: 'Addis Ababa',
      date: fr ? '26 juin 2026' : 'June 26, 2026',
      start_date: '2026-06-26',
      end_date: '2026-06-26',
      facilitators: '',
      objectives: '',
      expected_outputs: '',
      language,
    },
    schedule: {
      days: 1,
      day_titles: { '1': fr ? 'Jour 3' : 'Day 3' },
      day_start_times: { '1': '09:00' },
      day_end_times: { '1': '17:00' },
      day1: [
        // Day title + agenda
        { _id: 'd3-title', session: fr ? 'Jour 3' : 'Day 3', type: 'day_title', slides: ['title_slide.md'], duration: 0 },
        { _id: 'd3-agenda', session: fr ? 'Jour 3 — Ordre du jour' : 'Day 3 — Agenda', type: 'section', duration: 5 },

        // Session 12 — HFA
        {
          _id: 's12-hfa',
          session: fr
            ? 'Session 12 · Enquêtes auprès des formations sanitaires (FOSA)'
            : 'Session 12 · Health Facility Assessment (HFA)',
          slides: [
            'm8_0_hfa_implementation_status.md',
            'm8_0a_fastr_hfa_approach.md',
            'm8_1_rapid_cycle_facility_survey.md',
            'm8_1a_hfa_survey_design.md',
            'm8_1b_adaptive_survey_content.md',
            'm8_1c_survey_structure_modules.md',
            'm8_3_snis_hfa_integration.md',
            'm8_3a_triangulation_example.md',
            'm8_3b_dhis2_chain.md',
            'm8_3c_complete_results_chain.md',
          ],
          duration: 90,
        },

        { _id: 's12-break', session: fr ? 'Pause café' : 'Health break', type: 'break', duration: 15 },

        // Session 13 — Peer review feedback + finalize
        {
          _id: 's13-peer-review',
          session: fr
            ? 'Session 13 · Intégrer la revue par les pairs et finaliser les produits'
            : 'Session 13 · Incorporate peer-review feedback and finalize knowledge products',
          slides: [
            'm9e_7_peer_review_checklist.md',
            'm9e_6_refine_disruption_report.md',
            'm9e_6b_refine_disruption_report.md',
            'm9e_8_presenting_reports.md',
          ],
          duration: 75,
        },

        // Session 14 — Linking results with actions
        {
          _id: 's14-linking',
          session: fr
            ? 'Session 14 · Lier les résultats aux actions'
            : 'Session 14 · Linking results with actions — identify decisions/actions the results can inform',
          slides: [
            'm7_6_linking_results_to_actions.md',
            'm7_6b_three_spheres_of_influence.md',
            'm7_6c_linking_results_to_actions_continued.md',
          ],
          duration: 60,
        },

        { _id: 's14-lunch', session: fr ? 'Pause déjeuner' : 'Lunch break', type: 'break', duration: 60 },

        // Session 15 — Roadmap / action planning
        {
          _id: 's15-roadmap',
          session: fr
            ? "Session 15 · Construire une feuille de route pour une utilisation durable — planification d'action"
            : 'Session 15 · Building a roadmap for sustained use — action planning',
          slides: [
            'm7_7_building_roadmap_sustained_use.md',
            'm7_6d_dissemination_and_data_use_roadmap.md',
          ],
          duration: 90,
        },

        { _id: 'd3-end', session: fr ? 'Fin du Jour 3' : 'End of Day 3', type: 'day_end', slides: ['day_end.md'], duration: 0 },
      ],
    },
  }
}

for (const lang of ['en', 'fr'] as const) {
  const config = dayConfig(lang)
  const id = `addis_day3_${lang}`
  console.log(`Building ${id}…`)
  const md = await buildMarkdown(id, config as any, lang)
  const out = path.join(WEB_APP, 'outputs', `${id}.pptx`)
  const { warnings } = await generatePPTX(md, config as any, out)
  console.log(`  → ${out}`)
  if (warnings.length) console.log(`  ${warnings.length} warning(s):`, warnings.slice(0, 3))
}
