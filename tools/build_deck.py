#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════
                    FASTR SLIDE DECK BUILDER
═══════════════════════════════════════════════════════════════════════

This script assembles a complete slide deck from:
  1. Title slide (with your workshop details)
  2. Agenda slide (if you have agenda.png)
  3. Core FASTR sessions (with breaks inserted at natural points!)
  4. Your custom slides (country-specific content)
  5. Closing slides (thank you & contact)

═══════════════════════════════════════════════════════════════════════
                         HOW TO USE
═══════════════════════════════════════════════════════════════════════

OPTION 1: Interactive Mode (Easiest!)
--------------------------------------
Just run without arguments and follow the prompts:

    python3 tools/build_deck.py

The script will:
  - Show you all available workshops
  - Ask which one to build
  - Ask how many days your workshop is
  - Show suggested break placements
  - Build it!


OPTION 2: Command Line (For Experts)
-------------------------------------
Specify the workshop folder name directly:

    python3 tools/build_deck.py --workshop 2025-01-nigeria

Replace "2025-01-nigeria" with YOUR workshop folder name.


═══════════════════════════════════════════════════════════════════════
                      BEFORE YOU START
═══════════════════════════════════════════════════════════════════════

1. Make sure you have a workshop folder:
   workshops/YOUR-WORKSHOP-NAME/

2. Your folder must contain:
   config.py (workshop settings)
   custom-slides.md (optional - your content)
   agenda.png (optional - agenda image)

3. Not sure? Look at the example:
   workshops/example/

═══════════════════════════════════════════════════════════════════════
"""

import argparse
import os
import sys
import importlib.util

# ═══════════════════════════════════════════════════════════════════════
# SESSION DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════
# These are the logical sessions that can be included in a workshop

SESSIONS = {
    'intro': {
        'files': ['01_background_rationale.md', '02_fastr_approach.md'],
        'name': 'Intro (Background + FASTR Approach)',
        'short_name': 'Intro',
        'weight': 'light',
        'duration': '~30 min',
    },
    'extraction': {
        'files': ['03_data_extraction.md'],
        'name': 'Data Extraction',
        'short_name': 'Data Extraction',
        'weight': 'medium',
        'duration': '~45 min',
    },
    'dq_assessment': {
        'files': ['04a_data_quality_assessment.md'],
        'name': 'Data Quality Assessment',
        'short_name': 'DQ Assessment',
        'weight': 'core',
        'duration': '~90 min',
    },
    'dq_adjustment': {
        'files': ['04b_data_adjustment.md'],
        'name': 'Data Adjustment',
        'short_name': 'DQ Adjustment',
        'weight': 'core',
        'duration': '~60 min',
    },
    'disruption': {
        'files': ['05_service_utilization.md'],
        'name': 'Disruption Detection',
        'short_name': 'Disruption',
        'weight': 'core',
        'duration': '~90 min',
    },
    'coverage': {
        'files': ['06_coverage_analysis.md'],
        'name': 'Coverage Analysis',
        'short_name': 'Coverage',
        'weight': 'core',
        'duration': '~90 min',
    },
    'facility': {
        'files': ['07_facility_assessments.md'],
        'name': 'Facility Assessments',
        'short_name': 'Facility',
        'weight': 'light',
        'duration': '~30 min',
    },
}

# Mapping from old numeric sections to new session names (for backwards compatibility)
LEGACY_SECTION_MAP = {
    1: ['intro'],  # Background becomes part of intro
    2: ['intro'],  # FASTR Approach becomes part of intro (handled specially)
    3: ['extraction'],
    4: ['dq_assessment', 'dq_adjustment'],  # Old section 4 splits into two
    5: ['disruption'],
    6: ['coverage'],
    7: ['facility'],
}

# ═══════════════════════════════════════════════════════════════════════
# SCHEDULE PRESETS
# ═══════════════════════════════════════════════════════════════════════
# These define where breaks and day-ends go for 1, 2, or 3-day workshops

SCHEDULE_PRESETS = {
    1: {  # One-day (condensed)
        'days': {
            1: ['intro', 'dq_assessment', 'dq_adjustment', 'disruption'],
        },
        'tea_after': ['intro'],
        'lunch_after': ['dq_assessment'],
        'afternoon_tea_after': ['dq_adjustment'],
    },
    2: {  # Two-day (standard)
        'days': {
            1: ['intro', 'extraction', 'dq_assessment', 'dq_adjustment'],
            2: ['disruption', 'coverage'],
        },
        'tea_after': ['intro', 'disruption'],
        'lunch_after': ['extraction'],
        'afternoon_tea_after': ['dq_assessment'],
    },
    3: {  # Three-day (comprehensive)
        'days': {
            1: ['intro', 'extraction', 'dq_assessment'],
            2: ['dq_adjustment', 'disruption'],
            3: ['coverage', 'facility'],
        },
        'tea_after': ['intro', 'dq_adjustment', 'coverage'],
        'lunch_after': ['extraction', 'disruption'],
        'afternoon_tea_after': ['dq_assessment'],
    },
}


# ═══════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def list_available_workshops(base_dir):
    """Show all available workshop folders"""
    workshops_dir = os.path.join(base_dir, "workshops")

    if not os.path.exists(workshops_dir):
        print(f"Error: workshops/ folder not found!")
        print(f"   Are you running this from the repository root?")
        return []

    workshops = []
    for item in os.listdir(workshops_dir):
        item_path = os.path.join(workshops_dir, item)
        config_path = os.path.join(item_path, "config.py")

        if os.path.isdir(item_path) and os.path.exists(config_path):
            workshops.append(item)

    return sorted(workshops)


def prompt_for_workshop(base_dir):
    """Interactive mode: Ask user which workshop to build"""
    print("\n" + "=" * 70)
    print("                    AVAILABLE WORKSHOPS")
    print("=" * 70 + "\n")

    workshops = list_available_workshops(base_dir)

    if not workshops:
        print("No workshops found!")
        print("\nTo create a workshop:")
        print("   1. Copy workshops/example/ to workshops/YOUR-NAME/")
        print("   2. Edit workshops/YOUR-NAME/config.py")
        print("   3. Run this script again")
        sys.exit(1)

    for i, workshop in enumerate(workshops, 1):
        print(f"  {i}. {workshop}")

    print(f"\n  Total: {len(workshops)} workshop(s) available")
    print("\n" + "-" * 70)

    while True:
        try:
            choice = input("\nWhich workshop do you want to build? (enter number or name): ").strip()

            if choice.isdigit():
                idx = int(choice) - 1
                if 0 <= idx < len(workshops):
                    return workshops[idx]

            if choice in workshops:
                return choice

            print(f"Invalid choice. Please enter 1-{len(workshops)} or a workshop name.")

        except KeyboardInterrupt:
            print("\n\nCancelled by user")
            sys.exit(0)


def load_workshop_config(workshop_id, base_dir):
    """Load the config.py file from a workshop folder"""
    config_path = os.path.join(base_dir, "workshops", workshop_id, "config.py")

    if not os.path.exists(config_path):
        print(f"\nError: Workshop config not found!")
        print(f"   Looking for: {config_path}")
        print(f"\nMake sure:")
        print(f"   1. Workshop folder exists: workshops/{workshop_id}/")
        print(f"   2. It contains: config.py")
        print(f"\nTry copying the example:")
        print(f"   cp -r workshops/example workshops/{workshop_id}")
        sys.exit(1)

    spec = importlib.util.spec_from_file_location("workshop_config", config_path)
    config_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(config_module)

    return config_module.WORKSHOP_CONFIG


def convert_legacy_sections(config):
    """Convert old numeric sections to new session names"""
    if 'sections' in config and isinstance(config.get('sections', []), list):
        sections = config['sections']
        if sections and isinstance(sections[0], int):
            # This is an old-style config with numeric sections
            new_sessions = []
            seen = set()
            for num in sections:
                if num in LEGACY_SECTION_MAP:
                    for session in LEGACY_SECTION_MAP[num]:
                        if session not in seen:
                            new_sessions.append(session)
                            seen.add(session)
            return new_sessions

    # New-style config with session names
    return config.get('sessions', ['intro', 'extraction', 'dq_assessment',
                                    'dq_adjustment', 'disruption', 'coverage'])


def prompt_for_days(config):
    """Ask user how many days the workshop is"""
    print("\n" + "=" * 70)
    print("                    WORKSHOP SCHEDULE SETUP")
    print("=" * 70)

    print("\nHow many days is your workshop?")
    print("  1. One day (condensed)")
    print("  2. Two days (standard)")
    print("  3. Three days (comprehensive)")

    while True:
        try:
            choice = input("\nEnter choice [2]: ").strip()
            if choice == "":
                return 2
            if choice in ["1", "2", "3"]:
                return int(choice)
            print("Please enter 1, 2, or 3")
        except KeyboardInterrupt:
            print("\n\nCancelled by user")
            sys.exit(0)


def generate_schedule(sessions, num_days, config):
    """Generate a schedule based on sessions and number of days"""
    preset = SCHEDULE_PRESETS.get(num_days, SCHEDULE_PRESETS[2])

    # Filter preset to only include sessions that are selected
    schedule = []
    current_day = 1

    for day_num, day_sessions in preset['days'].items():
        if day_num > num_days:
            break

        for session_id in day_sessions:
            if session_id in sessions:
                entry = {
                    'session': session_id,
                    'day': day_num,
                    'tea_after': session_id in preset.get('tea_after', []),
                    'lunch_after': session_id in preset.get('lunch_after', []),
                    'afternoon_tea_after': session_id in preset.get('afternoon_tea_after', []),
                }
                schedule.append(entry)

    # Add any sessions not in preset at the end
    for session_id in sessions:
        if not any(e['session'] == session_id for e in schedule):
            if session_id in SESSIONS:
                schedule.append({
                    'session': session_id,
                    'day': num_days,
                    'tea_after': False,
                    'lunch_after': False,
                    'afternoon_tea_after': False,
                })

    # Mark end-of-day for multi-day workshops
    if num_days > 1:
        for i, entry in enumerate(schedule):
            # Check if this is the last session of a day
            if i < len(schedule) - 1:
                next_entry = schedule[i + 1]
                if next_entry['day'] > entry['day']:
                    entry['end_of_day'] = True
                else:
                    entry['end_of_day'] = False
            else:
                entry['end_of_day'] = False

    return schedule


def preview_schedule(schedule, config):
    """Display a visual preview of the schedule"""
    print("\n" + "-" * 70)
    print("\nSUGGESTED SCHEDULE:")
    print("")

    current_day = 0

    for i, entry in enumerate(schedule):
        session_id = entry['session']
        session_info = SESSIONS.get(session_id, {'name': session_id, 'duration': ''})

        # Day header
        if entry['day'] != current_day:
            current_day = entry['day']
            print(f"\nDAY {current_day}")

        # Session
        is_last_of_day = entry.get('end_of_day', False)
        connector = "└──" if is_last_of_day or i == len(schedule) - 1 else "├──"
        print(f"  {connector} {session_info['name']} ({session_info.get('duration', '')})")

        # Breaks
        if entry.get('tea_after'):
            tea_time = config.get('tea_time', '10:45 AM')
            print(f"  │   ☕ Tea Break (resume {tea_time})")

        if entry.get('lunch_after'):
            lunch_time = config.get('lunch_time', '1:00 PM')
            print(f"  │   🍽️  Lunch Break (resume {lunch_time})")

        if entry.get('afternoon_tea_after'):
            afternoon_time = config.get('afternoon_tea_time', '3:30 PM')
            print(f"  │   ☕ Afternoon Break (resume {afternoon_time})")

        # End of day
        if entry.get('end_of_day'):
            day_start = config.get('day_start_time', '9:00 AM')
            print(f"      🌙 End of Day {current_day}")

    print(f"      ✅ Workshop Complete")
    print("")


def confirm_schedule():
    """Ask user to confirm the schedule"""
    print("-" * 70)
    try:
        response = input("\nDoes this schedule look good? [Y/n]: ").strip().lower()
        return response in ['', 'y', 'yes']
    except KeyboardInterrupt:
        print("\n\nCancelled by user")
        sys.exit(0)


def substitute_variables(content, config, extra_vars=None):
    """Replace {{VARIABLE}} placeholders with actual values"""
    replacements = {
        'WORKSHOP_ID': config.get('workshop_id', ''),
        'WORKSHOP_NAME': config.get('name', ''),
        'DATE': config.get('date', ''),
        'LOCATION': config.get('location', ''),
        'FACILITATORS': config.get('facilitators', ''),
        'CONTACT_EMAIL': config.get('contact_email', ''),
        'WEBSITE': config.get('website', ''),
        'TEA_RESUME_TIME': config.get('tea_time', config.get('tea_resume_time', '')),
        'LUNCH_RESUME_TIME': config.get('lunch_time', config.get('lunch_resume_time', '')),
        'TEA_TIME': config.get('tea_time', '10:45 AM'),
        'LUNCH_TIME': config.get('lunch_time', '1:00 PM'),
        'AFTERNOON_TEA_TIME': config.get('afternoon_tea_time', '3:30 PM'),
        'DAY_START_TIME': config.get('day_start_time', '9:00 AM'),
    }

    if extra_vars:
        replacements.update(extra_vars)

    result = content
    for var, value in replacements.items():
        pattern = f'{{{{{var}}}}}'
        result = result.replace(pattern, str(value))

    return result


def read_markdown_file(filepath):
    """Read a markdown file and return its content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except FileNotFoundError:
        print(f"Warning: File not found: {filepath}")
        return ""


def strip_frontmatter(content):
    """Remove YAML frontmatter from markdown content"""
    lines = content.split('\n')
    if lines and lines[0].strip() == '---':
        end_idx = None
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                end_idx = i
                break
        if end_idx:
            return '\n'.join(lines[end_idx+1:])
    return content


def ensure_slide_break(content):
    """Ensure content ends with a slide break"""
    if not content.rstrip().endswith('---'):
        return content.rstrip() + "\n\n---\n"
    return content


def generate_break_slide(break_type, config):
    """Generate a break slide"""
    if break_type == 'tea':
        time = config.get('tea_time', '10:45 AM')
        return f"""
# Tea Break

**15 minutes**

We'll resume at {time}

---
"""
    elif break_type == 'lunch':
        time = config.get('lunch_time', '1:00 PM')
        return f"""
# Lunch Break

**60 minutes**

We'll resume at {time}

---
"""
    elif break_type == 'afternoon_tea':
        time = config.get('afternoon_tea_time', '3:30 PM')
        return f"""
# Afternoon Break

**15 minutes**

We'll resume at {time}

---
"""
    return ""


def generate_day_end_slide(day_number, next_day_sessions, config):
    """Generate an end-of-day slide"""
    day_start = config.get('day_start_time', '9:00 AM')

    # Build preview of next day
    preview_items = []
    for session_id in next_day_sessions[:3]:  # Show up to 3 sessions
        if session_id in SESSIONS:
            preview_items.append(SESSIONS[session_id]['short_name'])

    preview_text = ""
    if preview_items:
        preview_text = f"\n\n**Tomorrow:** {', '.join(preview_items)}"

    return f"""
# See You Tomorrow!

**Day {day_number} Complete**

We resume tomorrow at **{day_start}**{preview_text}

---
"""


def build_workshop_deck(workshop_id, base_dir, output_file=None, skip_confirmation=False, override_days=None):
    """Build a complete slide deck for a workshop"""

    print("\n" + "=" * 70)
    print(f"       BUILDING WORKSHOP: {workshop_id}")
    print("=" * 70)

    # Step 1: Load the workshop configuration
    print("\nStep 1: Reading workshop configuration...")
    config = load_workshop_config(workshop_id, base_dir)
    print("   Config loaded successfully")

    # Step 2: Get sessions (convert legacy format if needed)
    sessions = convert_legacy_sections(config)

    # Step 3: Determine number of days
    if override_days:
        num_days = override_days
    else:
        num_days = config.get('workshop_days')
        if num_days is None and not skip_confirmation:
            num_days = prompt_for_days(config)
        elif num_days is None:
            num_days = 2  # Default for non-interactive mode

    # Step 4: Generate schedule
    schedule = generate_schedule(sessions, num_days, config)

    # Step 5: Preview and confirm
    if not skip_confirmation:
        preview_schedule(schedule, config)
        if not confirm_schedule():
            print("\nBuild cancelled. Please adjust your config.py and try again.")
            sys.exit(0)

    # Step 6: Set output filename
    if not output_file:
        output_file = f"{workshop_id}_deck.md"

    print(f"\nStep 2: Assembling deck components...")

    # Start with Marp frontmatter
    deck_content = """---
marp: true
theme: fastr
paginate: true
---

"""

    # Add title slide
    template_path = os.path.join(base_dir, "templates", "title_slide.md")
    title_content = read_markdown_file(template_path)
    if title_content:
        title_content = strip_frontmatter(title_content)
        title_content = substitute_variables(title_content, config)
        deck_content += ensure_slide_break(title_content) + "\n"
        print(f"   Title slide added")

    # Add agenda if enabled
    if config.get('include_agenda', False):
        agenda_path = os.path.join(base_dir, "templates", "agenda.md")
        agenda_content = read_markdown_file(agenda_path)
        if agenda_content:
            agenda_content = strip_frontmatter(agenda_content)
            agenda_content = substitute_variables(agenda_content, config)
            deck_content += ensure_slide_break(agenda_content) + "\n"
            print(f"   Agenda slide added")

    # Add sessions with breaks
    print(f"\nAdding sessions with breaks:")
    core_content_dir = os.path.join(base_dir, "core_content")

    current_day = 0
    for i, entry in enumerate(schedule):
        session_id = entry['session']
        session_info = SESSIONS.get(session_id)

        if not session_info:
            print(f"   Warning: Unknown session '{session_id}'")
            continue

        # Day separator (for multi-day)
        if entry['day'] != current_day:
            current_day = entry['day']
            if num_days > 1:
                print(f"\n   DAY {current_day}:")

        # Add session content
        for filename in session_info['files']:
            filepath = os.path.join(core_content_dir, filename)
            content = read_markdown_file(filepath)
            if content:
                content = strip_frontmatter(content)
                content = substitute_variables(content, config)
                deck_content += "\n" + ensure_slide_break(content) + "\n"

        print(f"   {session_info['name']}")

        # Add breaks after session
        if entry.get('tea_after'):
            deck_content += generate_break_slide('tea', config)
            print(f"      ☕ Tea break")

        if entry.get('lunch_after'):
            deck_content += generate_break_slide('lunch', config)
            print(f"      🍽️  Lunch break")

        if entry.get('afternoon_tea_after'):
            deck_content += generate_break_slide('afternoon_tea', config)
            print(f"      ☕ Afternoon break")

        # Add end-of-day slide
        if entry.get('end_of_day') and config.get('include_day_end_slides', True):
            # Get next day's sessions
            next_day_sessions = [e['session'] for e in schedule if e['day'] == current_day + 1]
            deck_content += generate_day_end_slide(current_day, next_day_sessions, config)
            print(f"      🌙 End of Day {current_day}")

    # Add custom slides
    custom_slides = config.get('custom_slides', [])
    if custom_slides:
        print(f"\nAdding custom content:")
        workshop_dir = os.path.join(base_dir, "workshops", workshop_id)

        for custom_file in custom_slides:
            custom_path = os.path.join(workshop_dir, custom_file)
            content = read_markdown_file(custom_path)
            if content:
                content = strip_frontmatter(content)
                content = substitute_variables(content, config)
                deck_content += "\n" + ensure_slide_break(content) + "\n"
                print(f"   {custom_file}")

    # Add closing slide
    if config.get('include_closing', True):
        closing_path = os.path.join(base_dir, "templates", "closing.md")
        closing_content = read_markdown_file(closing_path)
        if closing_content:
            closing_content = strip_frontmatter(closing_content)
            closing_content = substitute_variables(closing_content, config)
            deck_content += closing_content + "\n"
            print(f"\nClosing slides added")

    # Write output file
    print(f"\nStep 3: Writing output file...")
    output_dir = os.path.join(base_dir, "outputs")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, output_file)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(deck_content)

    # Success!
    print("\n" + "=" * 70)
    print("                    SUCCESS!")
    print("=" * 70)
    print(f"\nDeck created: {output_path}")

    print(f"\nNext steps:")
    print(f"\n   OPTION 1: Convert to PDF (RECOMMENDED)")
    print(f"   " + "-" * 40)
    print(f"   marp {output_path} --theme-set fastr-theme.css --pdf")
    print(f"\n   Why PDF? Consistent styling, no font issues, ready to present!")

    print(f"\n   OPTION 2: Convert to PowerPoint")
    print(f"   " + "-" * 40)
    print(f"   python3 tools/convert_to_pptx.py {output_path}")
    print(f"\n   Note: PowerPoint may need font/layout adjustments")

    print("\n" + "=" * 70 + "\n")

    return output_path


def main():
    """Main entry point"""

    # Determine base directory (parent of tools/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(script_dir)

    # Check if user provided command-line arguments
    if len(sys.argv) > 1:
        # Command line mode
        parser = argparse.ArgumentParser(
            description="Build FASTR workshop slide deck from config",
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
Examples:
  python3 tools/build_deck.py --workshop 2025-01-nigeria
  python3 tools/build_deck.py --workshop example --output test.md

For more help, see: docs/building-decks.md
            """
        )

        parser.add_argument(
            '--workshop',
            type=str,
            required=True,
            help='Workshop folder name (e.g., "2025-01-nigeria")'
        )

        parser.add_argument(
            '--output',
            type=str,
            help='Output filename (default: {workshop_id}_deck.md)'
        )

        parser.add_argument(
            '--days',
            type=int,
            choices=[1, 2, 3],
            help='Number of workshop days (default: 2)'
        )

        args = parser.parse_args()

        build_workshop_deck(args.workshop, base_dir, args.output,
                           skip_confirmation=True, override_days=args.days)

    else:
        # Interactive mode
        print("\n" + "=" * 70)
        print("             FASTR SLIDE DECK BUILDER")
        print("               (Interactive Mode)")
        print("=" * 70)

        workshop_id = prompt_for_workshop(base_dir)
        build_workshop_deck(workshop_id, base_dir, skip_confirmation=False)


if __name__ == "__main__":
    main()
