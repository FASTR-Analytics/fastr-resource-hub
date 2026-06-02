// Shared workshop config for the Addis Multi-Country Learning Exchange.
// Used by:
//   - build_addis_full.mts  — local PPTX rebuild
//   - seed_addis_workshop.mts — write to workshops.db so the UI can re-export

export const ADDIS_WORKSHOP_ID = 'addis_multi_country_jun2026'

export function addisFullConfig(language: 'en' | 'fr' | 'pt') {
  const fr = language === 'fr'
  const pt = language === 'pt'
  // t(en, fr, pt) — pick the right string for the language. Falls back to EN
  // if a PT or FR variant is missing (passed as undefined).
  const t = (en: string, frV?: string, ptV?: string): string => {
    if (pt && ptV) return ptV
    if (fr && frV) return frV
    return en
  }
  return {
    workshop: {
      name: t('FASTR Multi-Country Collaborative Learning Exchange',
              "Échange d'apprentissage collaboratif multi-pays FASTR",
              'Intercâmbio de Aprendizagem Colaborativa Multipaíses FASTR'),
      title: t('FASTR Multi-Country Collaborative Learning Exchange',
               "Échange d'apprentissage multi-pays FASTR",
               'Intercâmbio de Aprendizagem Multipaíses FASTR'),
      subtitle: t('Addis Ababa · 24–26 June 2026',
                  'Addis-Abeba · 24–26 juin 2026',
                  'Adis Abeba · 24–26 de junho de 2026'),
      country: t('Ethiopia', 'Éthiopie', 'Etiópia'),
      location: 'Addis Ababa',
      date: t('June 24–26, 2026', '24–26 juin 2026', '24–26 de junho de 2026'),
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
        '1': t('Day 1', 'Jour 1', 'Dia 1'),
        '2': t('Day 2', 'Jour 2', 'Dia 2'),
        '3': t('Day 3', 'Jour 3', 'Dia 3'),
      },
      day_start_times: { '1': '09:00', '2': '09:00', '3': '09:00' },
      day_end_times:   { '1': '15:35', '2': '16:30', '3': '17:00' },

      // ─── DAY 1 ──────────────────────────────────────────────────────────────
      day1: [
        // Workshop cover (logos + title + date + location) — appears once, before everything
        { _id: 'd0-workshop-cover', session: t('Workshop cover', 'Couverture de l\'atelier', 'Capa do workshop'), slides: ['title_slide.md'], duration: 0 },

        // Pre-workshop assessment
        { _id: 'd1-preworkshop', session: t('FASTR Pre-Workshop Assessment', 'Évaluation avant atelier', 'Avaliação pré-workshop FASTR'), slides: [], duration: 15 },

        // Day 1 cover (just "Day 1" / "Jour 1" on a section-cover background)
        { _id: 'd1-title', session: t('Day 1', 'Jour 1', 'Dia 1'), type: 'day_title', slides: ['day_title.md'], duration: 0 },

        // Session 1 · Opening — uses workshop templates
        { _id: 's1-divider', session: t('Session 1 · Opening session', 'Session 1 · Session d\'ouverture', 'Sessão 1 · Sessão de abertura'), type: 'section', duration: 0 },
        { _id: 's1-welcome', session: t('Welcome, introductions and opening remarks', 'Bienvenue et introductions', 'Boas-vindas, apresentações e abertura'), slides: ['welcome_slide.md'], duration: 15 },
        { _id: 's1-icebreaker', session: t('Ice breaker', 'Brise-glace', 'Quebra-gelo'), slides: [], duration: 15 },
        { _id: 's1-norms', session: t('Meeting norms', 'Règles de la réunion', 'Regras da reunião'), slides: ['meeting_norms.md'], duration: 10 },

        // Day 1 Agenda
        { _id: 'd1-agenda', session: t('Day 1 Agenda', 'Agenda Jour 1', 'Agenda Dia 1'), type: 'section', duration: 0 },

        // Session 2 · Host country — section cover (no time) + placeholder body (time in agenda)
        { _id: 's2-cover', session: t('Session 2 · Host country spotlight', 'Session 2 · Pleins feux sur le pays hôte', 'Sessão 2 · Foco no país anfitrião'), type: 'section', duration: 0 },
        { _id: 's2-host', session: t('Session 2 · Host country spotlight', 'Session 2 · Pleins feux sur le pays hôte', 'Sessão 2 · Foco no país anfitrião'), slides: [], duration: 45 },

        // Session 3 · Introduction to FASTR
        { _id: 's3-divider', session: t('Session 3 · Introduction to FASTR', 'Session 3 · Introduction à FASTR', 'Sessão 3 · Introdução ao FASTR'), type: 'section', duration: 0 },
        {
          _id: 's3-intro',
          session: t('Session 3 · Introduction to FASTR', 'Session 3 · Introduction à FASTR', 'Sessão 3 · Introdução ao FASTR'),
          slides: [
            'm0_1_what_is_fastr.md',
            'm0_2_what_are_we_trying_to_achieve.md',
            'm0_3_analyze_learn_strengthen_act.md',
            'm0_4_four_complementary_pillars.md',
            'm0_5_how_countries_use_fastr.md',
            'm0_6_fastr_approach_rmncahn.md',
            'm0_7_from_analysis_to_action.md',
          ],
          // Session 3 total time including all sub-sessions (orientation 25 + DQA 25 + adjust 15 + SUC 30 = 95) + this opener (20) = 115
          duration: 115,
        },

        // Workshop-owned closers for Session 3 — emit as PLACEHOLDER slots so the deck
        // mirrors the master structure. Fill via the UI's custom_slides for per-workshop content.
        { _id: 's3-learning-journey', session: t('The Learning Journey', "Le parcours d'apprentissage", 'O percurso de aprendizagem'), slides: [], duration: 5 },
        { _id: 's3-participant-outcomes', session: t('What participants will learn and do during the workshop', "Ce que les participants apprendront et feront pendant l'atelier", 'O que os participantes vão aprender e fazer durante o workshop'), slides: [], duration: 5 },

        // Group photograph (custom)
        { _id: 'd1-photo', session: t('Group photograph', 'Photo de groupe', 'Fotografia de grupo'), slides: [], duration: 0 },

        // Coffee break
        { _id: 'd1-break-am', session: t('Health break', 'Pause santé', 'Pausa'), type: 'break', duration: 30 },

        // Methods + Disruption analysis section opener (matches ref slide 23)
        { _id: 's3-methods-divider', session: t('Introduction to FASTR methods and disruption analysis', "Introduction aux méthodes FASTR et à l'analyse des perturbations", 'Introdução aos métodos FASTR e à análise de perturbações'), type: 'section', duration: 0 },

        // Session 3 continued — Orientation to FASTR Analytics Platform
        // Sub-sessions named "Session 3 · X" so the kicker chrome shows X and
        // the locator shows "Session 3". Duration=0 hides them from the agenda
        // (the Session 3 opener entry above accounts for the time).
        {
          _id: 's3-orientation',
          session: t('Session 3 · Orientation to the FASTR Analytics Platform', 'Session 3 · Orientation à la plateforme analytique FASTR', 'Sessão 3 · Orientação à plataforma analítica FASTR'),
          slides: [
            'm3_1_overview_of_platform.md',
            'm3_2a_accessing_platform_continued.md',     // Country instance
            'm3_2c_accessing_platform_continued.md',     // Projects within instance
            'm3_2b_accessing_platform_continued.md',     // User roles
            'm3_1b_overview_of_platform_continued.md',   // Platform capabilities
          ],
          duration: 0,
        },

        // Session 3 continued — Methods · DQA
        {
          _id: 's3-dqa',
          session: t('Session 3 · Methods — Data Quality Assessment', 'Session 3 · Méthodes — Évaluation de la qualité des données', 'Sessão 3 · Métodos — Avaliação da qualidade dos dados'),
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
          duration: 0,
        },

        // Session 3 continued — Methods · DQ Adjustment
        {
          _id: 's3-dqadj',
          session: t('Session 3 · Methods — Data Quality Adjustment', 'Session 3 · Méthodes — Ajustement de la qualité des données', 'Sessão 3 · Métodos — Ajustamento da qualidade dos dados'),
          slides: [
            'm5_1_from_detection_to_correction.md',  // "Data quality adjustment" overview slide
            'm5_3_why_adjust_for_outliers.md',
            'm5_3b_outlier_adjustment_output.md',
            'm5_2a_completeness_adjustment_output.md',
          ],
          duration: 0,
        },

        // Session 3 continued — Methods · Service Utilization & Coverage
        {
          _id: 's3-suc',
          session: t('Session 3 · Methods — Service Utilization and Coverage', 'Session 3 · Méthodes — Utilisation des services et couverture', 'Sessão 3 · Métodos — Utilização dos serviços e cobertura'),
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
          duration: 0,
        },

        // Session 4 · Orientation to FASTR Platform (AI Assistant)
        { _id: 's4-divider', session: t('Session 4 · Orientation to the FASTR Analytics Platform', 'Session 4 · Orientation à la plateforme analytique FASTR', 'Sessão 4 · Orientação à plataforma analítica FASTR'), type: 'section', duration: 0 },
        {
          _id: 's4-ai',
          session: t('Session 4 · AI Assistant', 'Session 4 · Assistant IA', 'Sessão 4 · Assistente IA'),
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
        { _id: 'd1-lunch', session: t('Lunch break', 'Pause déjeuner', 'Pausa para almoço'), type: 'break', duration: 60 },

        // Session 5 · Practice — Exploring outputs
        { _id: 's5-divider', session: t('Session 5 · Exploring FASTR outputs, visualizations and AI Assistant', 'Session 5 · Explorer les résultats FASTR, visualisations et assistant IA', 'Sessão 5 · Explorar resultados FASTR, visualizações e Assistente IA'), type: 'section', duration: 0 },
        {
          _id: 's5-practice-outputs',
          session: t('Session 5 · Practice — Exploring FASTR outputs', 'Session 5 · Pratique — Explorer les résultats FASTR', 'Sessão 5 · Prática — Explorar resultados FASTR'),
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
        { _id: 's6-divider', session: t('Session 6 · Using FASTR for policy-relevant questions', 'Session 6 · Utiliser FASTR pour des questions politiques', 'Sessão 6 · Usar FASTR para questões políticas'), type: 'section', duration: 0 },
        {
          _id: 's6-practice-policy',
          session: t('Session 6 · Using FASTR for policy-relevant questions', 'Session 6 · Utiliser FASTR pour des questions politiques', 'Sessão 6 · Usar FASTR para questões políticas'),
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
        { _id: 'd1-wrap', session: t('Key messages and wrap-up', 'Messages clés et conclusion', 'Mensagens-chave e conclusão'), slides: [], duration: 15 },
        { _id: 'd1-plenary', session: t('Plenary discussion', 'Discussion en plénière', 'Discussão em plenário'), slides: [], duration: 15 },
      ],

      // ─── DAY 2 ──────────────────────────────────────────────────────────────
      day2: [
        { _id: 'd2-title', session: t('Day 2', 'Jour 2', 'Dia 2'), type: 'day_title', slides: ['day_title.md'], duration: 0 },
        { _id: 'd2-recap', session: t('Recap of Day 1 — overview of Day 2', 'Récapitulatif du Jour 1 — aperçu du Jour 2', 'Resumo do Dia 1 — perspetiva do Dia 2'), slides: [], duration: 10 },
        { _id: 'd2-agenda', session: t('Day 2 Agenda', 'Agenda Jour 2', 'Agenda Dia 2'), type: 'section', duration: 0 },

        // Session 7 · Mentor countries — section cover + placeholder body
        { _id: 's7-cover', session: t('Session 7 · Experiences from mentor countries', 'Session 7 · Expériences des pays mentors', 'Sessão 7 · Experiências dos países mentores'), type: 'section', duration: 0 },
        { _id: 's7-mentor', session: t('Session 7 · Experiences from mentor countries', 'Session 7 · Expériences des pays mentors', 'Sessão 7 · Experiências dos países mentores'), slides: [], duration: 60 },

        // Session 8 · Practice — Creating presentations (spans coffee break)
        { _id: 's8-divider', session: t('Session 8 · Practice — creating presentations in the platform', 'Session 8 · Pratique — Créer des présentations sur la plateforme', 'Sessão 8 · Prática — criar apresentações na plataforma'), type: 'section', duration: 0 },
        {
          _id: 's8-presentations-a',
          session: t('Session 8 · Practice — creating presentations', 'Session 8 · Pratique — Créer des présentations', 'Sessão 8 · Prática — criar apresentações'),
          slides: [
            'm9d_1_creating_slide_decks.md',
            'm9d_1b_adding_viz_manually.md',
            'm9d_1c_adding_viz_ai.md',
            'm9d_2_editing_formatting_slides.md',
          ],
          duration: 60,
        },
        { _id: 'd2-break-am', session: t('Health break', 'Pause santé', 'Pausa'), type: 'break', duration: 20 },
        {
          _id: 's8-presentations-b',
          session: t('Session 8 · continued', 'Session 8 · suite', 'Sessão 8 · continuação'),
          slides: [
            'm9d_2b_open_slide_editor.md',
            'm9d_3_formatting_text.md',
            'm9d_3_ref_markdown_shortcuts.md',
            'm9d_3a_formatting_report_settings.md',
          ],
          duration: 50,
        },

        // Session 9 · Creating Country Disruptions Reports
        { _id: 's9-divider', session: t('Session 9 · Creating Country Disruptions Reports', 'Session 9 · Créer des rapports nationaux de perturbations', 'Sessão 9 · Criar relatórios de perturbações dos países'), type: 'section', duration: 0 },
        {
          _id: 's9-disruptions',
          session: t('Session 9 · Creating Country Disruptions Reports', 'Session 9 · Créer des rapports nationaux de perturbations', 'Sessão 9 · Criar relatórios de perturbações dos países'),
          slides: [
            'm9f_4_introducing_prompt_library.md',
            'm9f_4b_introducing_prompt_library.md',
            'm9e_1_manual_to_ai_reporting.md',
          ],
          duration: 40,
        },

        // Lunch
        { _id: 'd2-lunch', session: t('Lunch break', 'Pause déjeuner', 'Pausa para almoço'), type: 'break', duration: 60 },

        // Session 10 · Understanding audience — section cover + placeholder body
        { _id: 's10-cover', session: t('Session 10 · Understanding your audience — user mapping and storytelling', 'Session 10 · Comprendre votre public — cartographie et narration', 'Sessão 10 · Compreender o público — mapeamento de utilizadores e narrativa'), type: 'section', duration: 0 },
        { _id: 's10-audience', session: t('Session 10 · Understanding your audience', 'Session 10 · Comprendre votre public', 'Sessão 10 · Compreender o público'), slides: [], duration: 30 },

        // Session 11 · Refining disruption reports
        { _id: 's11-divider', session: t('Session 11 · Refining disruption reports and adding country-specific analyses', 'Session 11 · Affiner les rapports de perturbations et ajouter des analyses spécifiques au pays', 'Sessão 11 · Afinar relatórios de perturbações e adicionar análises específicas do país'), type: 'section', duration: 0 },
        {
          _id: 's11-refining',
          session: t('Session 11 · Refining disruption reports', 'Session 11 · Affiner les rapports de perturbations', 'Sessão 11 · Afinar relatórios de perturbações'),
          slides: [
            'm9e_6_refine_disruption_report.md',
            'm9e_7_peer_review_checklist.md',
            'm9e_8_presenting_reports.md',
          ],
          duration: 60,
        },

        { _id: 'd2-wrap', session: t('Key messages and wrap-up', 'Messages clés et conclusion', 'Mensagens-chave e conclusão'), slides: [], duration: 10 },
      ],

      // ─── DAY 3 ──────────────────────────────────────────────────────────────
      day3: [
        { _id: 'd3-title', session: t('Day 3', 'Jour 3', 'Dia 3'), type: 'day_title', slides: ['day_title.md'], duration: 0 },
        { _id: 'd3-recap', session: t('Recap of Day 2 — overview of Day 3', 'Récapitulatif du Jour 2 — aperçu du Jour 3', 'Resumo do Dia 2 — perspetiva do Dia 3'), slides: [], duration: 10 },
        { _id: 'd3-agenda', session: t('Day 3 Agenda', 'Agenda Jour 3', 'Agenda Dia 3'), type: 'section', duration: 0 },

        // Session 12 · HFA
        { _id: 's12-divider', session: t('Session 12 · Health Facility Assessment (HFA)', 'Session 12 · Enquêtes auprès des formations sanitaires (FOSA)', 'Sessão 12 · Avaliação de unidades de saúde (HFA)'), type: 'section', duration: 0 },
        {
          _id: 's12-hfa',
          session: t('Session 12 · Health Facility Assessment', 'Session 12 · Enquêtes FOSA', 'Sessão 12 · Avaliação de unidades de saúde'),
          slides: [
            'm8_0_fastr_hfa_approach.md',
            'm8_0a_hfa_implementation_status.md',
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

        { _id: 'd3-break-am', session: t('Health break', 'Pause santé', 'Pausa'), type: 'break', duration: 20 },

        // Session 13 · Incorporate peer-review feedback + finalize
        { _id: 's13-divider', session: t('Session 13 · Incorporate peer-review feedback and finalize knowledge products', 'Session 13 · Intégrer la revue par les pairs et finaliser les produits', 'Sessão 13 · Integrar feedback da revisão por pares e finalizar produtos de conhecimento'), type: 'section', duration: 0 },
        {
          _id: 's13-incorporate',
          session: t('Session 13 · Incorporate peer-review feedback', 'Session 13 · Intégrer la revue par les pairs', 'Sessão 13 · Integrar feedback da revisão por pares'),
          slides: [
            'm9e_6b_refine_disruption_report.md',  // Prompt 2 & 3 checklist
          ],
          duration: 60,
        },

        // Session 14 · Linking results with actions
        { _id: 's14-divider', session: t('Session 14 · Linking results with actions', 'Session 14 · Lier les résultats aux actions', 'Sessão 14 · Ligar resultados a ações'), type: 'section', duration: 0 },
        {
          _id: 's14-linking',
          session: t('Session 14 · Linking results with actions', 'Session 14 · Lier les résultats aux actions', 'Sessão 14 · Ligar resultados a ações'),
          slides: [
            'm7e_1_linking_results_to_actions.md',
            'm7e_1a_three_spheres_of_influence.md',
            'm7e_1b_linking_results_to_actions_continued.md',
          ],
          duration: 60,
        },

        { _id: 'd3-lunch', session: t('Lunch break', 'Pause déjeuner', 'Pausa para almoço'), type: 'break', duration: 60 },

        // Session 15 · Roadmap + action planning + peer review on action plans
        { _id: 's15-divider', session: t('Session 15 · Building a roadmap for sustained use', 'Session 15 · Construire une feuille de route pour une utilisation durable', 'Sessão 15 · Construir um roteiro para uma utilização sustentada'), type: 'section', duration: 0 },
        {
          _id: 's15-roadmap',
          session: t('Session 15 · Roadmap', 'Session 15 · Feuille de route', 'Sessão 15 · Roteiro'),
          slides: [
            'm7f_1_building_roadmap_sustained_use.md',
            'm7e_1c_dissemination_and_data_use_roadmap.md',
            'm7f_1a_peer_review_action_plans.md',
          ],
          duration: 60,
        },

        // Final plenary + post-workshop + closing
        { _id: 'd3-final', session: t('Final plenary and feedback', 'Plénière finale et retours', 'Plenário final e feedback'), slides: [], duration: 60 },
        { _id: 'd3-post', session: t('Post-workshop assessment and evaluation', 'Évaluation post-atelier', 'Avaliação pós-workshop'), slides: [], duration: 30 },
        { _id: 'd3-close', session: t('Certificate ceremony and closing remarks', 'Cérémonie des certificats et clôture', 'Cerimónia de certificados e encerramento'), slides: [], duration: 30 },
      ],
    },
  }
}
