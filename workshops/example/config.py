"""
═══════════════════════════════════════════════════════════════════════════════
                        WORKSHOP CONFIGURATION FILE
═══════════════════════════════════════════════════════════════════════════════

Workshop: FASTR Workshop - Example Country
Location: Capital City, Country
Date: January 15-17, 2025

To build your deck, run:
    python3 tools/02_build_deck.py --workshop example

═══════════════════════════════════════════════════════════════════════════════
"""

WORKSHOP_CONFIG = {

    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 1: BASIC WORKSHOP INFO
    # ═══════════════════════════════════════════════════════════════════════

    'workshop_id': 'example',
    'name': 'FASTR Workshop - Example Country',
    'date': 'January 15-17, 2025',
    'location': 'Capital City, Country',
    'facilitators': 'Dr. Smith, Dr. Jones',

    'contact_email': 'fastr@example.org',
    'website': 'https://fastr.org',


    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 2: YOUR DECK - What slides, in what order
    # ═══════════════════════════════════════════════════════════════════════
    #
    # Built-in sessions: 'intro', 'extraction', 'dq_assessment', etc.
    # Your custom slides: 'objectives.md', 'country-overview.md', etc.
    #
    # Comment out any slides you don't want to include.

    'deck_order': [
        # --- Opening ---
        'agenda',
        'objectives.md',
        'country-overview.md',

        # --- Core Content ---
        'intro',
        'health-priorities.md',
        'extraction',
        'dq_assessment',
        'dq-findings.md',
        'dq_adjustment',
        'disruption',
        'disruption-local.md',
        'coverage',
        'coverage-results.md',

        # --- Closing ---
        'next-steps.md',
    ],


    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 3: WORKSHOP SCHEDULE
    # ═══════════════════════════════════════════════════════════════════════

    'workshop_days': 2,

    'tea_time': '10:45 AM',
    'lunch_time': '1:00 PM',
    'afternoon_tea_time': '3:30 PM',
    'day_start_time': '9:00 AM',

    'include_day_end_slides': True,
    'include_closing': True,
    'agenda_image': 'agenda.png',


    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 4: COUNTRY DATA
    # ═══════════════════════════════════════════════════════════════════════
    # Fill in your country stats here. Use {variable_name} in your slides.
    # Example: {total_facilities} becomes "2,847" in the slides.

    'country_data': {
        # Health system
        'total_facilities': '[X,XXX]',
        'facilities_reporting': '[X,XXX]',
        'reporting_rate': '[XX%]',

        # Population
        'total_population': '[XX million]',
        'women_reproductive_age': '[X.X million]',
        'under5_population': '[X.X million]',
        'expected_pregnancies': '[XXX,XXX]',
        'expected_births': '[XXX,XXX]',

        # Survey data
        'last_survey': '[DHS/MICS YYYY]',
        'survey_year': '[YYYY]',

        # Coverage - Survey
        'survey_anc1': '[XX%]',
        'survey_anc4': '[XX%]',
        'survey_sba': '[XX%]',
        'survey_penta1': '[XX%]',
        'survey_penta3': '[XX%]',
        'survey_measles': '[XX%]',

        # Coverage - FASTR estimates (fill after analysis)
        'fastr_anc1': '[XX%]',
        'fastr_anc4': '[XX%]',
        'fastr_sba': '[XX%]',
        'fastr_penta1': '[XX%]',
        'fastr_penta3': '[XX%]',
        'fastr_measles': '[XX%]',

        # Data quality
        'completeness_overall': '[XX%]',
        'outliers_detected': '[XXX]',
        'consistency_pass_rate': '[XX%]',

        # Add your own variables as needed...
    },

}
