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

    python3 tools/03_build_deck.py

The script will:
  - Show you all available workshops
  - Ask which one to build
  - Ask how many days your workshop is
  - Show suggested break placements
  - Build it!


OPTION 2: Command Line (For Experts)
-------------------------------------
Specify the workshop folder name directly:

    python3 tools/03_build_deck.py --workshop 2025-01-nigeria

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

try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False

# ═══════════════════════════════════════════════════════════════════════
# MODULE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════
# Maps module prefixes (m0, m1, etc.) to their folders and topic files

MODULES = {
    0: {
        'name': 'Introduction to FASTR',
        'folder': 'm0_introduction',
        'topics': [
            ('m0_1', 'm0_1_introduction_to_fastr.md'),
            ('m0_2', 'm0_2_rmncahn_service_use_monitoring.md'),
            ('m0_3', 'm0_3_why_rapid_cycle_analytics.md'),
            ('m0_4', 'm0_4_technical_approaches.md'),
            ('m0_5', 'm0_5_fastr_approach_to_routine_data_analysis.md'),
        ],
    },
    1: {
        'name': 'Identify Questions & Indicators',
        'folder': 'm1_identify_questions_indicators',
        'topics': [
            ('m1_1', 'm1_1_fastr_gaps_challenges.md'),
            ('m1_2', 'm1_2_development_of_data_use_case.md'),
            ('m1_3', 'm1_3_defining_priority_questions.md'),
            ('m1_4', 'm1_4_preparing_for_data_extraction.md'),
        ],
    },
    2: {
        'name': 'Data Extraction',
        'folder': 'm2_data_extraction',
        'topics': [
            ('m2_1', 'm2_1_why_extract_data.md'),
            ('m2_2', 'm2_2_tools_for_data_extraction.md'),
        ],
    },
    3: {
        'name': 'FASTR Analytics Platform',
        'folder': 'm3_fastr_analytics_platform',
        'topics': [
            ('m3_1', 'm3_1_overview_of_platform.md'),
            ('m3_2', 'm3_2_accessing_platform.md'),
            ('m3_3', 'm3_3_setting_up_structure.md'),
            ('m3_4', 'm3_4_importing_dataset.md'),
            ('m3_5', 'm3_5_installing_running_modules.md'),
            ('m3_6', 'm3_6_creating_new_project.md'),
            ('m3_7', 'm3_7_creating_visualizations.md'),
            ('m3_8', 'm3_8_creating_reports.md'),
        ],
    },
    4: {
        'name': 'Data Quality Assessment',
        'folder': 'm4_data_quality_assessment',
        'topics': [
            ('m4_1', 'm4_1_approach_to_dqa.md'),
            ('m4_2', 'm4_2_indicator_completeness.md'),
            ('m4_3', 'm4_3_outliers.md'),
            ('m4_4', 'm4_4_internal_consistency.md'),
            ('m4_5', 'm4_5_overall_dqa_score.md'),
        ],
    },
    5: {
        'name': 'Data Quality Adjustment',
        'folder': 'm5_data_quality_adjustment',
        'topics': [
            ('m5_1', 'm5_1_approach_to_dq_adjustment.md'),
            ('m5_2', 'm5_2_adjustment_for_outliers.md'),
            ('m5_3', 'm5_3_adjustment_for_completeness.md'),
        ],
    },
    6: {
        'name': 'Data Analysis',
        'folder': 'm6_data_analysis',
        'topics': [
            ('m6_1', 'm6_1_service_utilization.md'),
            ('m6_2', 'm6_2_surplus_disruption_analyses.md'),
            ('m6_3', 'm6_3_service_coverage.md'),
        ],
    },
    7: {
        'name': 'Results Communication',
        'folder': 'm7_results_communication',
        'topics': [
            ('m7_1', 'm7_1_analytical_thinking_interpretation.md'),
            ('m7_2', 'm7_2_data_visualization_communication.md'),
            ('m7_3', 'm7_3_using_data_for_decision_making.md'),
            ('m7_4', 'm7_4_stakeholder_engagement_advocacy.md'),
            ('m7_5', 'm7_5_practice_quarterly_reporting.md'),
        ],
    },
}


# ═══════════════════════════════════════════════════════════════════════
# SCHEDULE PRESETS
# ═══════════════════════════════════════════════════════════════════════
# These define where breaks and day-ends go for 1-5 day workshops
# Uses module prefixes: m0=Intro, m1=Questions, m2=Extraction, m3=Platform,
#                       m4=DQA, m5=DQ Adjust, m6=Analysis, m7=Communication

SCHEDULE_PRESETS = {
    1: {  # One-day (condensed)
        'days': {
            1: ['m0', 'm4', 'm5', 'm6'],
        },
        'tea_after': ['m0'],
        'lunch_after': ['m4'],
        'afternoon_tea_after': ['m5'],
    },
    2: {  # Two-day (standard)
        'days': {
            1: ['m0', 'm2', 'm4', 'm5'],
            2: ['m6'],
        },
        'tea_after': ['m0', 'm6'],
        'lunch_after': ['m2'],
        'afternoon_tea_after': ['m4'],
    },
    3: {  # Three-day (comprehensive)
        'days': {
            1: ['m0', 'm2', 'm4'],
            2: ['m5', 'm6'],
            3: ['m7'],
        },
        'tea_after': ['m0', 'm5', 'm7'],
        'lunch_after': ['m2', 'm6'],
        'afternoon_tea_after': ['m4'],
    },
    4: {  # Four-day (extended)
        'days': {
            1: ['m0', 'm1'],
            2: ['m2', 'm4'],
            3: ['m5', 'm6'],
            4: ['m7'],
        },
        'tea_after': ['m0', 'm2', 'm5', 'm7'],
        'lunch_after': ['m1', 'm4', 'm6'],
        'afternoon_tea_after': [],
    },
    5: {  # Five-day (full curriculum)
        'days': {
            1: ['m0', 'm1'],
            2: ['m2', 'm3'],
            3: ['m4', 'm5'],
            4: ['m6'],
            5: ['m7'],
        },
        'tea_after': ['m0', 'm2', 'm4', 'm6', 'm7'],
        'lunch_after': ['m1', 'm3', 'm5'],
        'afternoon_tea_after': [],
    },
}


# ═══════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def resolve_module_prefix(prefix, exclude=None):
    """
    Resolve a module prefix to a list of file paths.

    Examples:
        'm0'   -> all files in m0_introduction/
        'm0_1' -> just m0_1_introduce_fastr_approach.md
        'm4'   -> all files in m4_data_quality_assessment/
        'm4_2' -> just m4_2_indicator_completeness.md

    Args:
        prefix: Module prefix like 'm0' or 'm4_2'
        exclude: Optional list of topic prefixes to exclude (e.g., ['m4_3', 'm4_6'])

    Returns: (files, name, is_valid)
        - files: list of relative file paths within core_content/
        - name: display name for the module or topic
        - is_valid: True if prefix was recognized
    """
    import re
    exclude = exclude or []

    # Pattern for module prefix: m0, m1, m2, etc.
    module_match = re.match(r'^m(\d+)$', prefix)
    if module_match:
        module_num = int(module_match.group(1))
        if module_num in MODULES:
            module = MODULES[module_num]
            folder = module['folder']
            # Include all topics except those in exclude list
            files = []
            for topic_prefix, topic_file in module['topics']:
                if topic_prefix not in exclude:
                    files.append(f"{folder}/{topic_file}")
            return (files, module['name'], True)
        return ([], prefix, False)

    # Pattern for topic prefix: m0_1, m4_2, etc.
    topic_match = re.match(r'^m(\d+)_(\d+)$', prefix)
    if topic_match:
        module_num = int(topic_match.group(1))
        topic_num = int(topic_match.group(2))
        if module_num in MODULES:
            module = MODULES[module_num]
            folder = module['folder']
            # Find the topic with matching prefix
            for topic_prefix, topic_file in module['topics']:
                if topic_prefix == prefix:
                    # Skip if in exclude list
                    if topic_prefix in exclude:
                        return ([], prefix, True)  # Valid but excluded
                    # Extract readable topic name from filename
                    topic_name = topic_file.replace('.md', '').replace('_', ' ')
                    # Remove the prefix part (e.g., "m0 1 ")
                    topic_name = ' '.join(topic_name.split()[2:]).title()
                    return ([f"{folder}/{topic_file}"], topic_name, True)
        return ([], prefix, False)

    return ([], prefix, False)


def is_module_prefix(item):
    """Check if an item looks like a module prefix (m0, m0_1, etc.)"""
    import re
    return bool(re.match(r'^m\d+(_\d+)?$', item))


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


def generate_agenda_slide(config):
    """Generate agenda slide content from YAML config (table format)."""
    schedule = config.get('_yaml_schedule', {})
    agenda = schedule.get('agenda', {})
    num_days = schedule.get('days', 1)

    if not agenda:
        return None

    slide_content = "\n# Workshop Agenda\n\n"

    for day_num in range(1, num_days + 1):
        day_key = f'day{day_num}'
        day_items = agenda.get(day_key, [])

        if not day_items:
            continue

        if num_days > 1:
            slide_content += f"**Day {day_num}**\n\n"

        slide_content += "| Time | Session |\n|------|--------|\n"

        for item in day_items:
            time = item.get('time', '')
            session = item.get('session', '')
            is_break = item.get('type') == 'break'

            if is_break:
                slide_content += f"| {time} | *{session}* |\n"
            else:
                slide_content += f"| {time} | **{session}** |\n"

        slide_content += "\n"

    slide_content += "---\n"
    return slide_content


def load_yaml_config(yaml_path):
    """Load and convert YAML config to expected format."""
    if not YAML_AVAILABLE:
        return None

    with open(yaml_path, 'r') as f:
        yaml_config = yaml.safe_load(f)

    workshop = yaml_config.get('workshop', {})
    schedule = yaml_config.get('schedule', {})
    content = yaml_config.get('content', {})

    # Convert to expected format
    config = {
        'workshop_id': workshop.get('id', ''),
        'name': workshop.get('name', ''),
        'date': workshop.get('date', ''),
        'location': workshop.get('location', ''),
        'facilitators': workshop.get('facilitators', ''),
        'contact_email': workshop.get('contact_email', ''),
        'website': workshop.get('website', 'https://fastr.org'),

        'workshop_days': schedule.get('days', 2),
        'tea_time': schedule.get('tea_time', '10:30 AM'),
        'lunch_time': schedule.get('lunch_time', '12:30 PM'),
        'afternoon_tea_time': schedule.get('afternoon_tea', '3:30 PM'),
        'day_start_time': schedule.get('start_time', '9:00 AM'),

        'deck_order': content.get('deck_order', []),
        'include_day_end_slides': True,
        'include_closing': True,

        # Store original YAML schedule for agenda generation
        '_yaml_schedule': schedule,
        '_is_yaml': True,
    }

    return config


def load_workshop_config(workshop_id, base_dir):
    """Load workshop config from YAML or Python file."""
    workshop_dir = os.path.join(base_dir, "workshops", workshop_id)
    yaml_path = os.path.join(workshop_dir, "workshop.yaml")
    py_path = os.path.join(workshop_dir, "config.py")

    # Try YAML first
    if os.path.exists(yaml_path) and YAML_AVAILABLE:
        print(f"   Loading workshop.yaml")
        return load_yaml_config(yaml_path)

    # Fall back to Python config
    if os.path.exists(py_path):
        print(f"   Loading config.py")
        spec = importlib.util.spec_from_file_location("workshop_config", py_path)
        config_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(config_module)
        return config_module.WORKSHOP_CONFIG

    # No config found
    print(f"\nError: Workshop config not found!")
    print(f"   Looking for: workshop.yaml or config.py")
    print(f"\nMake sure:")
    print(f"   1. Workshop folder exists: workshops/{workshop_id}/")
    print(f"   2. It contains: workshop.yaml or config.py")
    print(f"\nCreate a workshop with:")
    print(f"   python3 tools/01_new_workshop.py")
    sys.exit(1)


def prompt_for_days(config):
    """Ask user how many days the workshop is"""
    print("\n" + "=" * 70)
    print("                    WORKSHOP SCHEDULE SETUP")
    print("=" * 70)

    print("\nHow many days is your workshop?")
    print("  1. One day (condensed)")
    print("  2. Two days (standard)")
    print("  3. Three days (comprehensive)")
    print("  4. Four days (extended)")
    print("  5. Five days (full curriculum)")

    while True:
        try:
            choice = input("\nEnter choice [2]: ").strip()
            if choice == "":
                return 2
            if choice in ["1", "2", "3", "4", "5"]:
                return int(choice)
            print("Please enter 1-5")
        except KeyboardInterrupt:
            print("\n\nCancelled by user")
            sys.exit(0)


def normalize_to_module(item):
    """Convert a deck_order item to its module prefix for schedule matching"""
    if is_module_prefix(item):
        # For specific topics like m4_2, return the module (m4)
        if '_' in item:
            return item.split('_')[0]
        return item
    # Non-module items (custom .md files, etc.) don't map to modules
    return None


def generate_schedule(sessions, num_days, config):
    """Generate a schedule based on sessions and number of days"""
    preset = SCHEDULE_PRESETS.get(num_days, SCHEDULE_PRESETS[2])

    # Normalize sessions to module prefixes for matching
    session_modules = {s: normalize_to_module(s) for s in sessions}
    modules_in_use = set(session_modules.values())

    # Filter preset to only include modules that are selected
    schedule = []

    for day_num, day_modules in preset['days'].items():
        if day_num > num_days:
            break

        for module_id in day_modules:
            # Find sessions that map to this module
            matching_sessions = [s for s, m in session_modules.items() if m == module_id]
            for session_id in matching_sessions:
                entry = {
                    'session': session_id,
                    'day': day_num,
                    'tea_after': module_id in preset.get('tea_after', []),
                    'lunch_after': module_id in preset.get('lunch_after', []),
                    'afternoon_tea_after': module_id in preset.get('afternoon_tea_after', []),
                }
                schedule.append(entry)

    # Add any sessions not matched to preset at the end
    scheduled_sessions = {e['session'] for e in schedule}
    for session_id in sessions:
        if session_id not in scheduled_sessions:
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


def get_module_info(item):
    """Get display info for a module prefix or custom item"""
    import re
    # Check if it's a module prefix (m0, m1, m4_2, etc.)
    module_match = re.match(r'^m(\d+)(_\d+)?$', item)
    if module_match:
        module_num = int(module_match.group(1))
        if module_num in MODULES:
            return {'name': MODULES[module_num]['name'], 'duration': ''}
    # For custom items, just return the item name
    return {'name': item, 'duration': ''}


def preview_schedule(schedule, config):
    """Display a visual preview of the schedule"""
    print("\n" + "-" * 70)
    print("\nSUGGESTED SCHEDULE:")
    print("")

    current_day = 0

    for i, entry in enumerate(schedule):
        session_id = entry['session']
        session_info = get_module_info(session_id)

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

    # Add country_data variables (all keys become {{key}} variables)
    country_data = config.get('country_data', {})
    for key, value in country_data.items():
        replacements[key] = str(value)

    if extra_vars:
        replacements.update(extra_vars)

    result = content
    for var, value in replacements.items():
        pattern = f'{{{{{var}}}}}'
        result = result.replace(pattern, str(value))

    return result


def resolve_asset_overrides(content, workshop_id, base_dir):
    """
    Check for workshop-specific asset overrides and rewrite paths.

    If a workshop has assets/fastr-outputs/m1_completeness.png,
    it will override the default assets/fastr-outputs/m1_completeness.png.

    Paths in content like "../assets/X" are rewritten to "../workshops/{id}/assets/X"
    if the override exists.
    """
    import re

    workshop_assets_dir = os.path.join(base_dir, "workshops", workshop_id, "assets")

    if not os.path.exists(workshop_assets_dir):
        return content, []  # No workshop assets folder, no overrides

    overrides_applied = []

    # Find all image references: ![...](path)
    def replace_if_override(match):
        full_match = match.group(0)
        alt_text = match.group(1)
        original_path = match.group(2)

        # Only process paths that reference assets
        if '../assets/' not in original_path and 'assets/' not in original_path:
            return full_match

        # Extract the relative path within assets/
        if '../assets/' in original_path:
            assets_rel = original_path.split('../assets/', 1)[1]
        elif original_path.startswith('assets/'):
            assets_rel = original_path[14:]  # Remove 'assets/'
        else:
            return full_match

        # Check if workshop has an override
        override_path = os.path.join(workshop_assets_dir, assets_rel)
        if os.path.exists(override_path):
            # Rewrite to workshop-specific path
            new_path = f"../workshops/{workshop_id}/assets/{assets_rel}"
            overrides_applied.append(assets_rel)
            return f"![{alt_text}]({new_path})"

        return full_match

    # Pattern to match ![alt](path) including paths with parentheses
    pattern = r'!\[([^\]]*)\]\((.*?\.(?:png|jpg|jpeg|gif|svg|webp))\)'
    content = re.sub(pattern, replace_if_override, content, flags=re.IGNORECASE)

    return content, overrides_applied


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
        info = get_module_info(session_id)
        if info['name'] != session_id:  # It's a module, not a custom file
            preview_items.append(info['name'])

    preview_text = ""
    if preview_items:
        preview_text = f"\n\n**Tomorrow:** {', '.join(preview_items)}"

    return f"""
# See You Tomorrow!

**Day {day_number} Complete**

We resume tomorrow at **{day_start}**{preview_text}

---
"""


def get_custom_slides_for_position(config, position, workshop_dir):
    """
    Get custom slides for a specific position in the deck.
    Handles both old format (list) and new format (dict).
    """
    custom_slides = config.get('custom_slides', {})

    # Old format: just a list (all slides go at end)
    if isinstance(custom_slides, list):
        if position == 'before_closing':
            return custom_slides
        return []

    # New format: dict with positions
    if isinstance(custom_slides, dict):
        return custom_slides.get(position, [])

    return []


def add_custom_slides_at_position(position, config, workshop_dir, base_dir):
    """Add custom slides for a given position, returns content string"""
    slides = get_custom_slides_for_position(config, position, workshop_dir)
    if not slides:
        return ""

    content = ""
    for custom_file in slides:
        custom_path = os.path.join(workshop_dir, custom_file)
        file_content = read_markdown_file(custom_path)
        if file_content:
            file_content = strip_frontmatter(file_content)
            file_content = substitute_variables(file_content, config)
            content += "\n" + ensure_slide_break(file_content) + "\n"
            print(f"      + {custom_file}")
    return content


def build_workshop_deck(workshop_id, base_dir, output_file=None, skip_confirmation=False, override_days=None):
    """Build a complete slide deck for a workshop"""

    print("\n" + "=" * 70)
    print(f"       BUILDING WORKSHOP: {workshop_id}")
    print("=" * 70)

    # Step 1: Load the workshop configuration
    print("\nStep 1: Reading workshop configuration...")
    config = load_workshop_config(workshop_id, base_dir)
    print("   Config loaded successfully")

    # Check if using new deck_order format
    deck_order = config.get('deck_order')
    exclude_list = config.get('exclude', [])

    # Step 2: Determine number of days
    if override_days:
        num_days = override_days
    else:
        num_days = config.get('workshop_days')
        if num_days is None and not skip_confirmation:
            num_days = prompt_for_days(config)
        elif num_days is None:
            num_days = 2  # Default for non-interactive mode

    # Step 3: Get sessions list for schedule generation
    if not deck_order:
        print("\nError: 'deck_order' is required in config.py")
        print("   Please define which modules to include using module prefixes (m0, m1, etc.)")
        print("   Example: 'deck_order': ['agenda', 'm0', 'm2', 'm4', 'm5', 'm6']")
        sys.exit(1)

    # Extract module items from deck_order (non-.md items except 'agenda')
    sessions = [item for item in deck_order if not item.endswith('.md') and item != 'agenda']

    # Step 4: Generate schedule (for break placement)
    schedule = generate_schedule(sessions, num_days, config)

    # Build a lookup for break info by session
    break_info = {}
    for entry in schedule:
        break_info[entry['session']] = entry

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

    # Workshop and content directories
    workshop_dir = os.path.join(base_dir, "workshops", workshop_id)
    core_content_dir = os.path.join(base_dir, "core_content")

    # ═══════════════════════════════════════════════════════════════════════
    # BUILD DECK FROM deck_order
    # ═══════════════════════════════════════════════════════════════════════
    print(f"\nAdding slides in order:")
    current_day = 0

    for item in deck_order:
        # Check what type of item this is
        if item == 'agenda':
            # Agenda slide - generate from YAML config or use template
            if config.get('_is_yaml'):
                # Generate agenda from YAML schedule
                agenda_content = generate_agenda_slide(config)
                if agenda_content:
                    deck_content += ensure_slide_break(agenda_content) + "\n"
                    print(f"   Agenda (generated from config)")
            else:
                # Fall back to template for Python config
                agenda_path = os.path.join(base_dir, "templates", "agenda.md")
                agenda_content = read_markdown_file(agenda_path)
                if agenda_content:
                    agenda_content = strip_frontmatter(agenda_content)
                    agenda_content = substitute_variables(agenda_content, config)
                    deck_content += ensure_slide_break(agenda_content) + "\n"
                    print(f"   Agenda (from template)")

        elif item.endswith('.md'):
            # Custom slide from workshop folder
            custom_path = os.path.join(workshop_dir, item)
            content = read_markdown_file(custom_path)
            if content:
                content = strip_frontmatter(content)
                content = substitute_variables(content, config)
                deck_content += "\n" + ensure_slide_break(content) + "\n"
                print(f"   {item} (custom)")

        elif is_module_prefix(item):
            # Module prefix (m0, m0_1, m4_2, etc.)
            files, name, is_valid = resolve_module_prefix(item, exclude=exclude_list)
            entry = break_info.get(item, {})

            # Day separator (for multi-day)
            if entry.get('day', 1) != current_day:
                current_day = entry.get('day', 1)
                if num_days > 1:
                    print(f"\n   DAY {current_day}:")

            if is_valid and files:
                # Add all files for this module/topic
                module_overrides = []
                for filename in files:
                    filepath = os.path.join(core_content_dir, filename)
                    content = read_markdown_file(filepath)
                    if content:
                        content = strip_frontmatter(content)
                        content = substitute_variables(content, config)
                        content, overrides = resolve_asset_overrides(content, workshop_id, base_dir)
                        module_overrides.extend(overrides)
                        deck_content += "\n" + ensure_slide_break(content) + "\n"

                print(f"   [{item}] {name}")
                if module_overrides:
                    print(f"      📊 {len(module_overrides)} custom asset(s)")

                # Add breaks after module
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
                    next_day_sessions = [e['session'] for e in schedule if e['day'] == current_day + 1]
                    deck_content += generate_day_end_slide(current_day, next_day_sessions, config)
                    print(f"      🌙 End of Day {current_day}")
            else:
                print(f"   Warning: Unknown module prefix '{item}'")

        else:
            print(f"   Warning: Unknown item '{item}'")

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
    print(f"   python3 tools/04_convert_to_pptx.py {output_path}")
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
  python3 tools/03_build_deck.py --workshop 2025-01-nigeria
  python3 tools/03_build_deck.py --workshop example --output test.md

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
            choices=[1, 2, 3, 4, 5],
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
