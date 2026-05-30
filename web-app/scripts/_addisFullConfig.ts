// Shared workshop config for the Addis Multi-Country Learning Exchange.
// Used by:
//   - build_addis_full.mts  — local PPTX rebuild
//   - seed_addis_workshop.mts — write to workshops.db so the UI can re-export

export const ADDIS_WORKSHOP_ID = 'addis_multi_country_jun2026'

export function addisFullConfig(language: 'en' | 'fr') {
  const fr = language === 'fr'
  return {
    workshop: {
      name: fr
        ? "Échange d'apprentissage collaboratif multi-pays FASTR"
        : 'FASTR Multi-Country Collaborative Learning Exchange',
      title: fr
        ? "Échange d'apprentissage multi-pays FASTR"
        : 'FASTR Multi-Country Collaborative Learning Exchange',
      subtitle: fr ? 'Addis-Abeba · 24–26 juin 2026' : 'Addis Ababa · 24–26 June 2026',
      country: fr ? 'Éthiopie' : 'Ethiopia',
      location: 'Addis Ababa',
      date: fr ? '24–26 juin 2026' : 'June 24–26, 2026',
      start_date: '2026-06-24',
      end_date: '2026-06-26',
      facilitators: '',
      objectives: '',
      expected_outputs: '',
      language,
    },
    schedule: {
      days: 3,
      day_titles: {
        '1': fr ? 'Jour 1' : 'Day 1',
        '2': fr ? 'Jour 2' : 'Day 2',
        '3': fr ? 'Jour 3' : 'Day 3',
      },
      day_start_times: { '1': '09:00', '2': '09:00', '3': '09:00' },
      day_end_times:   { '1': '15:35', '2': '16:30', '3': '17:00' },

      // ─── DAY 1 ──────────────────────────────────────────────────────────────
      day1: [
        // Workshop cover (logos + title + date + location) — appears once, before everything
        { _id: 'd0-workshop-cover', session: fr ? "Couverture de l'atelier" : 'Workshop cover', slides: ['title_slide.md'], duration: 0 },

        // Pre-workshop assessment
        { _id: 'd1-preworkshop', session: fr ? 'Évaluation avant atelier' : 'FASTR Pre-Workshop Assessment', slides: [], duration: 15 },

        // Day 1 cover (just "Day 1" / "Jour 1" on a section-cover background)
        { _id: 'd1-title', session: fr ? 'Jour 1' : 'Day 1', type: 'day_title', slides: ['day_title.md'], duration: 0 },

        // Session 1 · Opening — uses workshop templates
        { _id: 's1-divider', session: fr ? "Session 1 · Session d'ouverture" : 'Session 1 · Opening session', type: 'section', duration: 0 },
        { _id: 's1-welcome', session: fr ? 'Bienvenue et introductions' : 'Welcome, introductions and opening remarks', slides: ['welcome_slide.md'], duration: 15 },
        { _id: 's1-icebreaker', session: fr ? 'Brise-glace' : 'Ice breaker', slides: [], duration: 15 },
        { _id: 's1-norms', session: fr ? 'Règles de la réunion' : 'Meeting norms', slides: ['meeting_norms.md'], duration: 10 },

        // Day 1 Agenda
        { _id: 'd1-agenda', session: fr ? 'Agenda Jour 1' : 'Day 1 Agenda', type: 'section', duration: 0 },

        // Session 2 · Host country — single placeholder slide (no divider; the placeholder title IS the divider)
        { _id: 's2-host', session: fr ? 'Session 2 · Pleins feux sur le pays hôte' : 'Session 2 · Host country spotlight', slides: [], duration: 45 },

        // Session 3 · Introduction to FASTR
        { _id: 's3-divider', session: fr ? 'Session 3 · Introduction à FASTR' : 'Session 3 · Introduction to FASTR', type: 'section', duration: 0 },
        {
          _id: 's3-intro',
          session: fr ? 'Session 3 · Introduction à FASTR' : 'Session 3 · Introduction to FASTR',
          slides: [
            'm0_1_what_is_fastr.md',
            'm0_2_what_are_we_trying_to_achieve.md',
            'm0_3_analyze_learn_strengthen_act.md',
            'm0_4_four_complementary_pillars.md',
            'm0_5_how_countries_use_fastr.md',
            'm0_6_fastr_approach_rmncahn.md',
            'm0_7_from_analysis_to_action.md',
          ],
          duration: 20,
        },

        // Workshop-owned closers for Session 3 — emit as PLACEHOLDER slots so the deck
        // mirrors the master structure. Fill via the UI's custom_slides for per-workshop content.
        { _id: 's3-learning-journey', session: fr ? "Le parcours d'apprentissage" : 'The Learning Journey', slides: [], duration: 5 },
        { _id: 's3-participant-outcomes', session: fr ? 'Ce que les participants apprendront et feront pendant l\'atelier' : 'What participants will learn and do during the workshop', slides: [], duration: 5 },

        // Group photograph (custom)
        { _id: 'd1-photo', session: fr ? 'Photo de groupe' : 'Group photograph', slides: [], duration: 0 },

        // Coffee break
        { _id: 'd1-break-am', session: fr ? 'Pause santé' : 'Health break', type: 'break', duration: 30 },

        // Methods + Disruption analysis section opener (matches ref slide 23)
        { _id: 's3-methods-divider', session: fr ? "Introduction aux méthodes FASTR et à l'analyse des perturbations" : 'Introduction to FASTR methods and disruption analysis', type: 'section', duration: 0 },

        // Session 3 continued — Orientation to FASTR Analytics Platform
        {
          _id: 's3-orientation',
          session: fr ? 'Orientation à la plateforme analytique FASTR' : 'Orientation to the FASTR Analytics Platform',
          slides: [
            'm3_1_overview_of_platform.md',
            'm3_2a_accessing_platform_continued.md',     // Country instance
            'm3_2c_accessing_platform_continued.md',     // Projects within instance
            'm3_2b_accessing_platform_continued.md',     // User roles
            'm3_1b_overview_of_platform_continued.md',   // Platform capabilities
          ],
          duration: 25,
        },

        // Session 3 continued — Methods · DQA
        {
          _id: 's3-dqa',
          session: fr ? 'Méthodes — Évaluation de la qualité des données' : 'Methods — Data Quality Assessment',
          slides: [
            'm4_0_fastr_analytical_pipeline.md',
            'm4_1_approach_to_dqa.md',
            'm4_1b_approach_to_dqa.md',         // Rationale
            'm4_s2b_dqa_rationale_objectives.md', // Objectives (full variant not present; use _s)
            'm4_2_indicator_completeness.md',
            'm4_2b_indicator_completeness_output.md',
            'm4_s3b_dqa_outliers.md',           // Outlier detection (no full variant)
            'm4_3d_outlier_detection_output.md',
            'm4_s4_dqa_internal_consistency.md', // Internal consistency
            'm4_4c_internal_consistency_output.md',
            'm4_5_overall_dqa_score.md',
            'm4_5c_overall_dqa_score_output.md',
            'm4_5d_mean_dqa_score_output.md',
          ],
          duration: 25,
        },

        // Session 3 continued — Methods · DQ Adjustment
        {
          _id: 's3-dqadj',
          session: fr ? 'Méthodes — Ajustement de la qualité des données' : 'Methods — Data Quality Adjustment',
          slides: [
            'm5_1_from_detection_to_correction.md',  // "Data quality adjustment" overview slide
            'm5_3_why_adjust_for_outliers.md',
            'm5_3b_outlier_adjustment_output.md',
            'm5_2a_completeness_adjustment_output.md',
          ],
          duration: 15,
        },

        // Session 3 continued — Methods · Service Utilization & Coverage
        {
          _id: 's3-suc',
          session: fr ? 'Méthodes — Utilisation des services et couverture' : 'Methods — Service Utilization and Coverage',
          slides: [
            'm6_1_service_utilization_analysis.md',
            'm6_1d_quarter_on_quarter_change.md',
            'm6_2_service_disruptions_surpluses_detection.md',
            'm6_2d_service_disruption_output.md',
            'm6_6_service_coverage_introduction.md',
            'm6_7_definition_of_coverage.md',               // Service coverage example
            'm6_9_demographic_cascade.md',                  // Expected relationships
            'm6_10_denominator_cascade_illustration.md',    // Estimating denominators from ANC-1
            'm6_11_deriving_denominators_from_entry_points.md', // Not just ANC1 — multiple entry points
            'm6_s3f_five_denominator_options.md',
            'm6_s3g_how_fastr_estimates_coverage.md',
            'm6_14_coverage_output_national.md',
            'm6_14b_coverage_output_subnational.md',
            'm6_20_fastr_pipeline_adds_on_top_of_dhis2.md', // Why FASTR? Value add beyond DHIS2
            'm6_21_key_takeaway.md',
          ],
          duration: 30,
        },

        // Session 4 · Orientation to FASTR Platform (AI Assistant)
        { _id: 's4-divider', session: fr ? 'Session 4 · Orientation à la plateforme analytique FASTR' : 'Session 4 · Orientation to the FASTR Analytics Platform', type: 'section', duration: 0 },
        {
          _id: 's4-ai',
          session: fr ? "Session 4 · Assistant IA" : 'Session 4 · AI Assistant',
          slides: [
            'mai_1_ai_assistant_overview.md',
            'mai_3_ai_ask_questions.md',
            'mai_2_ai_assistant_capabilities.md',
            'mai_3a_ai_ask_questions_continued.md',
            'mai_4_ai_conversations.md',
            'mai_5_ai_tips_better_answers.md',
            'mai_5a_ai_good_prompt_checklist.md',
            'mai_8a_ai_private_vs_shared_continued.md',
          ],
          duration: 75,
        },

        // Lunch
        { _id: 'd1-lunch', session: fr ? 'Pause déjeuner' : 'Lunch break', type: 'break', duration: 60 },

        // Session 5 · Practice — Exploring outputs
        { _id: 's5-divider', session: fr ? 'Session 5 · Explorer les résultats FASTR, visualisations et assistant IA' : 'Session 5 · Exploring FASTR outputs, visualizations and AI Assistant', type: 'section', duration: 0 },
        {
          _id: 's5-practice-outputs',
          session: fr ? 'Session 5 · Pratique — Explorer les résultats FASTR' : 'Session 5 · Practice — Exploring FASTR outputs',
          slides: [
            'm9b_1_login_folder_activity.md',
            'm9c_1_creating_visualizations_manually.md',
            'm9c_2_creating_visualizations_ai.md',
            'm9c_3_interpreting_visualizations.md',
            'm9c_3b_interpreting_activity.md',
            'm9c_4_interpreting_with_ai.md',
          ],
          duration: 60,
        },

        // Session 6 · Practice — Policy-relevant questions
        { _id: 's6-divider', session: fr ? 'Session 6 · Utiliser FASTR pour des questions politiques' : 'Session 6 · Using FASTR for policy-relevant questions', type: 'section', duration: 0 },
        {
          _id: 's6-practice-policy',
          session: fr ? 'Session 6 · Utiliser FASTR pour des questions politiques' : 'Session 6 · Using FASTR for policy-relevant questions',
          slides: [
            'm1_1_what_is_data_use_case.md',
            'm1_1a_nigeria_quarterly_monitoring.md',
            'm1_1a2_guinea_investment_tracking.md',
            'm1_1a3_ethiopia_program_monitoring.md',
            'm1_1b_common_data_use_case.md',
          ],
          duration: 60,
        },

        // Wrap-up + plenary
        { _id: 'd1-wrap', session: fr ? 'Messages clés et conclusion' : 'Key messages and wrap-up', slides: [], duration: 15 },
        { _id: 'd1-plenary', session: fr ? 'Discussion en plénière' : 'Plenary discussion', slides: [], duration: 15 },
      ],

      // ─── DAY 2 ──────────────────────────────────────────────────────────────
      day2: [
        { _id: 'd2-title', session: fr ? 'Jour 2' : 'Day 2', type: 'day_title', slides: ['day_title.md'], duration: 0 },
        { _id: 'd2-recap', session: fr ? 'Récapitulatif du Jour 1 — aperçu du Jour 2' : 'Recap of Day 1 — overview of Day 2', slides: [], duration: 10 },
        { _id: 'd2-agenda', session: fr ? 'Agenda Jour 2' : 'Day 2 Agenda', type: 'section', duration: 0 },

        // Session 7 · Mentor countries — single placeholder slide
        { _id: 's7-mentor', session: fr ? 'Session 7 · Expériences des pays mentors' : 'Session 7 · Experiences from mentor countries', slides: [], duration: 60 },

        // Session 8 · Practice — Creating presentations (spans coffee break)
        { _id: 's8-divider', session: fr ? 'Session 8 · Pratique — Créer des présentations sur la plateforme' : 'Session 8 · Practice — creating presentations in the platform', type: 'section', duration: 0 },
        {
          _id: 's8-presentations-a',
          session: fr ? 'Session 8 · Pratique — Créer des présentations' : 'Session 8 · Practice — creating presentations',
          slides: [
            'm9d_1_creating_slide_decks.md',
            'm9d_1b_adding_viz_manually.md',
            'm9d_1c_adding_viz_ai.md',
            'm9d_2_editing_formatting_slides.md',
          ],
          duration: 60,
        },
        { _id: 'd2-break-am', session: fr ? 'Pause santé' : 'Health break', type: 'break', duration: 20 },
        {
          _id: 's8-presentations-b',
          session: fr ? 'Session 8 (suite)' : 'Session 8 continued',
          slides: [
            'm9d_2b_open_slide_editor.md',
            'm9d_3_formatting_text.md',
            'm9d_3_ref_markdown_shortcuts.md',
            'm9d_3a_formatting_report_settings.md',
          ],
          duration: 50,
        },

        // Session 9 · Creating Country Disruptions Reports
        { _id: 's9-divider', session: fr ? 'Session 9 · Créer des rapports nationaux de perturbations' : 'Session 9 · Creating Country Disruptions Reports', type: 'section', duration: 0 },
        {
          _id: 's9-disruptions',
          session: fr ? 'Session 9 · Créer des rapports nationaux de perturbations' : 'Session 9 · Creating Country Disruptions Reports',
          slides: [
            'm9f_4_introducing_prompt_library.md',
            'm9f_4b_introducing_prompt_library.md',
            'm9e_1_manual_to_ai_reporting.md',
          ],
          duration: 40,
        },

        // Lunch
        { _id: 'd2-lunch', session: fr ? 'Pause déjeuner' : 'Lunch break', type: 'break', duration: 60 },

        // Session 10 · Understanding audience — single placeholder slide
        { _id: 's10-audience', session: fr ? 'Session 10 · Comprendre votre public — cartographie et narration' : 'Session 10 · Understanding your audience — user mapping and storytelling', slides: [], duration: 30 },

        // Session 11 · Refining disruption reports
        { _id: 's11-divider', session: fr ? 'Session 11 · Affiner les rapports de perturbations et ajouter des analyses spécifiques au pays' : 'Session 11 · Refining disruption reports and adding country-specific analyses', type: 'section', duration: 0 },
        {
          _id: 's11-refining',
          session: fr ? 'Session 11 · Affiner les rapports de perturbations' : 'Session 11 · Refining disruption reports',
          slides: [
            'm9e_6_refine_disruption_report.md',
            'm9e_7_peer_review_checklist.md',
            'm9e_8_presenting_reports.md',
          ],
          duration: 60,
        },

        { _id: 'd2-wrap', session: fr ? 'Messages clés et conclusion' : 'Key messages and wrap-up', slides: [], duration: 10 },
      ],

      // ─── DAY 3 ──────────────────────────────────────────────────────────────
      day3: [
        { _id: 'd3-title', session: fr ? 'Jour 3' : 'Day 3', type: 'day_title', slides: ['day_title.md'], duration: 0 },
        { _id: 'd3-recap', session: fr ? 'Récapitulatif du Jour 2 — aperçu du Jour 3' : 'Recap of Day 2 — overview of Day 3', slides: [], duration: 10 },
        { _id: 'd3-agenda', session: fr ? 'Agenda Jour 3' : 'Day 3 Agenda', type: 'section', duration: 0 },

        // Session 12 · HFA
        { _id: 's12-divider', session: fr ? 'Session 12 · Enquêtes auprès des formations sanitaires (FOSA)' : 'Session 12 · Health Facility Assessment (HFA)', type: 'section', duration: 0 },
        {
          _id: 's12-hfa',
          session: fr ? 'Session 12 · Enquêtes FOSA' : 'Session 12 · Health Facility Assessment',
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
          duration: 60,
        },

        { _id: 'd3-break-am', session: fr ? 'Pause santé' : 'Health break', type: 'break', duration: 20 },

        // Session 13 · Incorporate peer-review feedback + finalize
        { _id: 's13-divider', session: fr ? 'Session 13 · Intégrer la revue par les pairs et finaliser les produits' : 'Session 13 · Incorporate peer-review feedback and finalize knowledge products', type: 'section', duration: 0 },
        {
          _id: 's13-incorporate',
          session: fr ? 'Session 13 · Intégrer la revue par les pairs' : 'Session 13 · Incorporate peer-review feedback',
          slides: [
            'm9e_6b_refine_disruption_report.md',  // Prompt 2 & 3 checklist
          ],
          duration: 60,
        },

        // Session 14 · Linking results with actions
        { _id: 's14-divider', session: fr ? 'Session 14 · Lier les résultats aux actions' : 'Session 14 · Linking results with actions', type: 'section', duration: 0 },
        {
          _id: 's14-linking',
          session: fr ? 'Session 14 · Lier les résultats aux actions' : 'Session 14 · Linking results with actions',
          slides: [
            'm7_6_linking_results_to_actions.md',
            'm7_6b_three_spheres_of_influence.md',
            'm7_6c_linking_results_to_actions_continued.md',
          ],
          duration: 60,
        },

        { _id: 'd3-lunch', session: fr ? 'Pause déjeuner' : 'Lunch break', type: 'break', duration: 60 },

        // Session 15 · Roadmap + action planning + peer review on action plans
        { _id: 's15-divider', session: fr ? 'Session 15 · Construire une feuille de route pour une utilisation durable' : 'Session 15 · Building a roadmap for sustained use', type: 'section', duration: 0 },
        {
          _id: 's15-roadmap',
          session: fr ? 'Session 15 · Feuille de route' : 'Session 15 · Roadmap',
          slides: [
            'm7_7_building_roadmap_sustained_use.md',
            'm7_6d_dissemination_and_data_use_roadmap.md',
            'm7_7a_peer_review_action_plans.md',
          ],
          duration: 60,
        },

        // Final plenary + post-workshop + closing
        { _id: 'd3-final', session: fr ? 'Plénière finale et retours' : 'Final plenary and feedback', slides: [], duration: 60 },
        { _id: 'd3-post', session: fr ? 'Évaluation post-atelier' : 'Post-workshop assessment and evaluation', slides: [], duration: 30 },
        { _id: 'd3-close', session: fr ? 'Cérémonie des certificats et clôture' : 'Certificate ceremony and closing remarks', slides: [], duration: 30 },
      ],
    },
  }
}
