"""
═══════════════════════════════════════════════════════════════════════════════
                        WORKSHOP CONFIGURATION FILE
═══════════════════════════════════════════════════════════════════════════════

This file defines all the settings for your workshop slide deck.

HOW TO USE:
1. Copy this entire 'example' folder to a new folder with your workshop name
   Example: cp -r workshops/example workshops/2025-03-kenya

2. Edit this config.py with your workshop details

3. Run: python3 tools/build_deck.py
   (You'll be prompted to set up your schedule interactively!)

═══════════════════════════════════════════════════════════════════════════════
"""

WORKSHOP_CONFIG = {

    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 1: BASIC WORKSHOP INFO
    # ═══════════════════════════════════════════════════════════════════════
    # This information appears on the title slide and closing slides

    'workshop_id': 'example',                          # Folder name (no spaces!)
    'name': 'FASTR Workshop - Example Country',        # Full workshop title
    'date': 'January 15-17, 2025',                     # Workshop dates
    'location': 'Capital City, Country',               # City and country
    'facilitators': 'Dr. Smith, Dr. Jones',            # Lead facilitator names

    # Contact info (shown on closing slide)
    'contact_email': 'fastr@example.org',
    'website': 'https://fastr.org',


    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 2: OPENING SLIDES
    # ═══════════════════════════════════════════════════════════════════════
    # These appear at the very beginning of the deck

    # Show the agenda slide after the title?
    # Set to True if you have an agenda.png image in your workshop folder
    'include_agenda': True,

    # Agenda image filename (must be in your workshop folder)
    # Tip: Create your agenda in PowerPoint/Canva, export as PNG
    'agenda_image': 'agenda.png',


    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 3: WORKSHOP SESSIONS
    # ═══════════════════════════════════════════════════════════════════════
    # Choose which sessions to include in your workshop.
    #
    # SESSIONS (in recommended order):
    # ┌──────────────────────────────────────────────────────────────────────┐
    # │  OPENING                                                             │
    # │    'intro'       = Background & FASTR Approach (light, ~30 min)      │
    # │    'extraction'  = Data Extraction from DHIS2 (medium, ~45 min)      │
    # │                                                                      │
    # │  CORE SESSIONS                                                       │
    # │    'dq_assessment' = Data Quality Assessment (core, ~90 min)         │
    # │    'dq_adjustment' = Data Adjustment Methods (core, ~60 min)         │
    # │    'disruption'    = Service Disruption Detection (core, ~90 min)    │
    # │    'coverage'      = Coverage Analysis (core, ~90 min)               │
    # │                                                                      │
    # │  SUPPLEMENTAL                                                        │
    # │    'facility'    = Facility Assessments (light, ~30 min)             │
    # └──────────────────────────────────────────────────────────────────────┘
    #
    # Example for a focused 2-day workshop:
    #   'sessions': ['intro', 'extraction', 'dq_assessment', 'dq_adjustment',
    #                'disruption', 'coverage'],

    'sessions': ['intro', 'extraction', 'dq_assessment', 'dq_adjustment',
                 'disruption', 'coverage'],


    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 4: WORKSHOP SCHEDULE & BREAKS
    # ═══════════════════════════════════════════════════════════════════════
    # Set workshop_days to None to be prompted interactively when building.
    # Or set it to 1, 2, or 3 to use preset schedules.
    #
    # The build script will suggest where to place tea breaks, lunch breaks,
    # and day-end slides based on your content and number of days.

    'workshop_days': None,  # None = prompt me, or 1, 2, 3

    # Break times (shown on break slides)
    'tea_time': '10:45 AM',
    'lunch_time': '1:00 PM',
    'afternoon_tea_time': '3:30 PM',

    # What time does each day start? (for day-end slides)
    'day_start_time': '9:00 AM',

    # Include "See you tomorrow" slides between days?
    'include_day_end_slides': True,


    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 5: CUSTOM SLIDES (Your Country-Specific Content)
    # ═══════════════════════════════════════════════════════════════════════
    # Add your own slides here! These are added after the core sessions.
    #
    # Put your custom slide files in your workshop folder, then list them here.
    #
    # Example:
    #   'custom_slides': ['country-data.md', 'local-examples.md'],

    'custom_slides': [],


    # ═══════════════════════════════════════════════════════════════════════
    # SECTION 6: CLOSING SLIDES
    # ═══════════════════════════════════════════════════════════════════════
    # These appear at the very end of the deck

    # Include "Thank You" and contact information slides?
    'include_closing': True,


    # ═══════════════════════════════════════════════════════════════════════
    # BACKWARDS COMPATIBILITY (optional - for old configs)
    # ═══════════════════════════════════════════════════════════════════════
    # If you have an old config with 'sections': [1, 2, 3, 4, 5, 6], it will
    # still work! The numbers map to:
    #   1 -> 'intro' (part 1)
    #   2 -> 'intro' (part 2)
    #   3 -> 'extraction'
    #   4 -> 'dq_assessment' + 'dq_adjustment'
    #   5 -> 'disruption'
    #   6 -> 'coverage'
    #   7 -> 'facility'

}


# ═══════════════════════════════════════════════════════════════════════════════
#                              QUICK REFERENCE
# ═══════════════════════════════════════════════════════════════════════════════
#
# INTERACTIVE BUILD:
#   When you run: python3 tools/build_deck.py
#   You'll be asked:
#     1. How many days is your workshop? (1, 2, or 3)
#     2. Preview of suggested schedule with break placements
#     3. Confirm or adjust the schedule
#
# SLIDE ORDER IN FINAL DECK:
# ┌─────────────────────────────────────────────────────────────────────────────┐
# │  1. Title Slide                                                             │
# │  2. Agenda Slide (if include_agenda = True)                                 │
# │  3. Sessions with breaks inserted at natural points:                        │
# │     ├── Intro                                                               │
# │     │   ☕ Tea Break                                                        │
# │     ├── Data Extraction                                                     │
# │     │   🍽️ Lunch Break                                                     │
# │     ├── Data Quality Assessment                                             │
# │     │   ☕ Afternoon Break                                                  │
# │     ├── Data Adjustment                                                     │
# │     │   🌙 End of Day (for multi-day workshops)                            │
# │     └── ... (continues for each day)                                        │
# │  4. Custom Slides                                                           │
# │  5. Closing Slides                                                          │
# └─────────────────────────────────────────────────────────────────────────────┘
#
# ═══════════════════════════════════════════════════════════════════════════════
