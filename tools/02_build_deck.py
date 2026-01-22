#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════
                    FASTR SLIDE DECK BUILDER
═══════════════════════════════════════════════════════════════════════

Validates and builds a complete slide deck for FASTR workshops.

What it does:
  1. Validates workshop config (required fields, missing files, undefined variables)
  2. Assembles slides from core content + custom slides
  3. Inserts breaks and day markers at appropriate points
  4. Generates a Marp-ready markdown file

═══════════════════════════════════════════════════════════════════════
                         HOW TO USE
═══════════════════════════════════════════════════════════════════════

Interactive mode:
    python3 tools/02_build_deck.py

Command line:
    python3 tools/02_build_deck.py --workshop 2025-nigeria

═══════════════════════════════════════════════════════════════════════
                      BEFORE YOU START
═══════════════════════════════════════════════════════════════════════

1. Create a workshop using the wizard:
   python3 tools/01_new_workshop.py

2. Edit workshop.yaml to customize:
   - country_data section for {{variable}} substitution
   - deck_order to add/remove slides

═══════════════════════════════════════════════════════════════════════
"""

import argparse
import os
import sys
import importlib.util
from pathlib import Path

# ═══════════════════════════════════════════════════════════════════════════════
# AUTO-DETECT AND USE VENV
# ═══════════════════════════════════════════════════════════════════════════════

def ensure_venv():
    """Re-execute with venv Python if not already in venv."""
    if sys.prefix != sys.base_prefix:
        return
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent
    for venv_name in ['.venv', 'venv']:
        venv_python = project_root / venv_name / 'bin' / 'python3'
        if venv_python.exists():
            os.execv(str(venv_python), [str(venv_python)] + sys.argv)

ensure_venv()

try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False

import re

# ═══════════════════════════════════════════════════════════════════════
# VALIDATION FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

# Required config fields
REQUIRED_FIELDS = ['name', 'date', 'location']


def find_variables_in_file(filepath):
    """Find all {{variable}} patterns in a file"""
    variables = set()
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        matches = re.findall(r'\{\{(\w+)\}\}', content)
        variables.update(matches)
    except:
        pass
    return variables


def find_images_in_file(filepath):
    """Find all image references in a markdown file"""
    images = []
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
        pattern = r'!\[[^\]]*\]\((.*?\.(?:png|jpg|jpeg|gif|svg|webp))\)'
        matches = re.findall(pattern, content, re.IGNORECASE)
        images.extend(matches)
    except:
        pass
    return images


def resolve_slide_path(filename, workshop_id, base_dir, core_content_dir):
    """
    Resolve slide file path, checking for custom overrides first.

    Priority order:
    1. Workshop's custom_slides folder (workshops/{id}/custom_slides/{filename})
    2. Core content folder (core_content/{folder}/{filename})

    Returns the path that exists, or the core_content path if neither exists.
    """
    # Check for custom override in workshop's custom_slides folder
    custom_path = os.path.join(base_dir, "workshops", workshop_id, "custom_slides", filename)
    if os.path.exists(custom_path):
        return custom_path, True  # Return path and flag indicating it's a custom override

    # Fall back to core content
    return os.path.join(core_content_dir, filename), False


def validate_workshop(workshop_id, base_dir, config):
    """
    Validate workshop setup before building.
    Returns (success, errors, warnings)
    """
    workshop_dir = os.path.join(base_dir, "workshops", workshop_id)
    core_content_dir = os.path.join(base_dir, "core_content")

    errors = []
    warnings = []

    print("\n   Validating workshop setup...")

    # CHECK 1: Required fields
    for field in REQUIRED_FIELDS:
        value = config.get(field, '')
        if not value or (isinstance(value, str) and value.strip() == ''):
            warnings.append(f"Required field '{field}' is empty")
        elif isinstance(value, str) and ('EXAMPLE' in value.upper() or 'YOUR' in value.upper()):
            warnings.append(f"Field '{field}' has placeholder text: {value}")

    # CHECK 2: Files in deck_order exist
    deck_order = config.get('deck_order', [])
    for item in deck_order:
        if item == 'agenda':
            continue
        elif item.endswith('.md'):
            custom_path = os.path.join(workshop_dir, item)
            template_path = os.path.join(base_dir, "templates", "custom_slides", item)
            if not os.path.exists(custom_path) and not os.path.exists(template_path):
                errors.append(f"Custom slide missing: {item}")

    # CHECK 3: Variables have values
    available_vars = set(['WORKSHOP_ID', 'WORKSHOP_NAME', 'DATE', 'LOCATION',
                         'FACILITATORS', 'COUNTRY', 'TEA_TIME', 'LUNCH_TIME'])
    country_data = config.get('country_data', {})
    available_vars.update(country_data.keys())

    files_to_check = []
    for item in deck_order:
        if item.endswith('.md'):
            workshop_path = os.path.join(workshop_dir, item)
            template_path = os.path.join(base_dir, "templates", "custom_slides", item)
            if os.path.exists(workshop_path):
                files_to_check.append(workshop_path)
            elif os.path.exists(template_path):
                files_to_check.append(template_path)

    used_vars = set()
    for filepath in files_to_check:
        used_vars.update(find_variables_in_file(filepath))

    undefined = used_vars - available_vars
    for var in sorted(undefined):
        warnings.append(f"Variable '{{{{{var}}}}}' used but not defined in country_data")

    # Print results
    if errors:
        print(f"   ERRORS: {len(errors)}")
        for e in errors:
            print(f"      - {e}")
    if warnings:
        print(f"   WARNINGS: {len(warnings)}")
        for w in warnings:
            print(f"      - {w}")
    if not errors and not warnings:
        print("   All checks passed!")

    return len(errors) == 0, errors, warnings


# ═══════════════════════════════════════════════════════════════════════
# MODULE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════
# Maps module prefixes (m0, m1, etc.) to their folders and topic files

MODULES = {
    0: {
        'name': 'Introduction to FASTR',
        'folder': 'm0_introduction',
        'topics': [
            ('m0_0', 'm0_0_topic_0.md'),
            ('m0_1', 'm0_1_introduction_to_fastr.md'),
            ('m0_2', 'm0_2_rmncahn_service_use_monitoring.md'),
            ('m0_3', 'm0_3_why_rapid_cycle_analytics.md'),
            ('m0_4', 'm0_4_technical_approaches.md'),
        ],
    },
    1: {
        'name': 'Identify Questions & Indicators',
        'folder': 'm1_identify_questions_indicators',
        'topics': [
            ('m1_1', 'm1_1_what_is_data_use_case.md'),
            ('m1_1a', 'm1_1a_common_data_use_case.md'),
            ('m1_1b', 'm1_1b_how_select_indicators.md'),
            ('m1_2', 'm1_2_development_of_data_use_case.md'),
            ('m1_2a', 'm1_2a_defining_priority_questions.md'),
            ('m1_2b', 'm1_2b_relevant_priority_questions.md'),
            ('m1_2c', 'm1_2c_answerable_questions.md'),
            ('m1_2d', 'm1_2d_pico_framework.md'),
            ('m1_3', 'm1_3_good_indicator_criteria.md'),
            ('m1_3a', 'm1_3a_high_volume_indicators.md'),
            ('m1_3b', 'm1_3b_high_completeness_indicators.md'),
            ('m1_3c', 'm1_3c_count_indicators.md'),
            ('m1_3d', 'm1_3d_fastr_core_indicators.md'),
            ('m1_3e', 'm1_3e_country_indicator_selection.md'),
            ('m1_4', 'm1_4_preparing_for_data_extraction.md'),
        ],
    },
    2: {
        'name': 'Data Extraction',
        'folder': 'm2_data_extraction',
        'topics': [
            ('m2_0', 'm2_0_show_of_hands_extraction.md'),
            ('m2_1', 'm2_1_why_extract_data.md'),
            ('m2_1b', 'm2_1b_why_extract_data_continued.md'),
            ('m2_1d', 'm2_1d_why_extract_data_continued.md'),
            ('m2_2', 'm2_2_tools_for_data_extraction.md'),
            ('m2_2a', 'm2_2a_data_downloader.md'),
            ('m2_2b', 'm2_2b_tools_for_data_extraction_continued.md'),
            ('m2_2c', 'm2_2c_tools_for_data_extraction_continued.md'),
            ('m2_2d', 'm2_2d_tools_for_data_extraction_continued.md'),
            ('m2_2e', 'm2_2e_tools_for_data_extraction_continued.md'),
            ('m2_2f', 'm2_2f_tools_for_data_extraction_continued.md'),
            ('m2_2g', 'm2_2g_tools_for_data_extraction_continued.md'),
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
            ('m6_1', 'm6_1_service_utilization_analysis.md'),
            ('m6_2', 'm6_2_year_over_year_change.md'),
            ('m6_3', 'm6_3_disruption_detection.md'),
            ('m6_4', 'm6_4_actual_vs_expected_outputs.md'),
            ('m6_5', 'm6_5_data_quality_adjustment_scenarios.md'),
            ('m6_6', 'm6_6_service_coverage_introduction.md'),
            ('m6_7', 'm6_7_definition_of_coverage.md'),
            ('m6_8', 'm6_8_denominators_by_service_type.md'),
            ('m6_9', 'm6_9_demographic_cascade.md'),
            ('m6_10', 'm6_10_denominator_cascade_illustration.md'),
            ('m6_11', 'm6_11_forward_and_backward_derivation.md'),
            ('m6_12', 'm6_12_denominators_by_entry_point.md'),
            ('m6_13', 'm6_13_denominator_selection_methodology.md'),
            ('m6_14', 'm6_14_coverage_projection_methodology.md'),
            ('m6_15', 'm6_15_interpretation_of_coverage_outputs.md'),
            ('m6_16', 'm6_16_coverage_output_national.md'),
            ('m6_17', 'm6_17_coverage_output_subnational.md'),
            ('m6_18', 'm6_18_coverage_output_district.md'),
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
    8: {
        'name': 'Survey & HFA',
        'folder': 'm8_survey_hfa',
        'topics': [
            ('m8_1', 'm8_1_overview_hfa_phone_survey.md'),
            ('m8_2', 'm8_2_questionnaire_adaptation_guidelines.md'),
            ('m8_3', 'm8_3_questionnaire_structure_review.md'),
            ('m8_4', 'm8_4_hands_on_adaptation.md'),
            ('m8_5', 'm8_5_hfa_priorities_data_use.md'),
        ],
    },
    9: {
        'name': 'Workshop Activities',
        'folder': 'm9_workshop_activities',
        'topics': [
            ('m9_1', 'm9_1_data_use_case_application_1.md'),
            ('m9_2', 'm9_2_data_use_case_application_2.md'),
            ('m9_3', 'm9_3_data_use_case_application_3.md'),
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

    # Pattern for topic prefix: m0_1, m4_2, m1_2a, etc. (with optional letter suffix)
    topic_match = re.match(r'^m(\d+)_(\d+[a-z]?)$', prefix)
    if topic_match:
        module_num = int(topic_match.group(1))
        topic_id = topic_match.group(2)  # e.g., "2" or "2a"
        if module_num in MODULES:
            module = MODULES[module_num]
            folder = module['folder']
            # First try exact match in predefined topics
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

            # If not found in predefined list, search filesystem dynamically
            # This handles topics like m1_2a, m1_2b, etc. not in MODULE_CONTENT
            core_content_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "core_content", folder)
            if os.path.exists(core_content_dir):
                for f in os.listdir(core_content_dir):
                    if f.startswith(prefix + '_') and f.endswith('.md'):
                        if prefix in exclude:
                            return ([], prefix, True)
                        # Extract readable topic name from filename
                        topic_name = f.replace('.md', '').replace('_', ' ')
                        topic_name = ' '.join(topic_name.split()[2:]).title()
                        return ([f"{folder}/{f}"], topic_name, True)
        return ([], prefix, False)

    return ([], prefix, False)


def is_module_prefix(item):
    """Check if an item looks like a module prefix (m0, m0_1, m1_2a, etc.)"""
    import re
    return bool(re.match(r'^m\d+(_\d+[a-z]?)?$', item))


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
        config_py = os.path.join(item_path, "config.py")
        config_yaml = os.path.join(item_path, "workshop.yaml")

        if os.path.isdir(item_path) and (os.path.exists(config_py) or os.path.exists(config_yaml)):
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
        print("   python3 tools/01_new_workshop.py")
        print("\nThen run this script again.")
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


def generate_single_day_agenda(config, day_num):
    """
    Generate agenda slide content for a single day.
    Uses compact 'agenda' class for auto-fit.
    """
    schedule = config.get('_yaml_schedule', {})
    is_unified = config.get('_is_unified_format', False)
    day_titles = schedule.get('day_titles', {})

    day_key = f'day{day_num}'

    # Get day items from unified or old format
    if is_unified:
        day_items = schedule.get(day_key, [])
    else:
        agenda = schedule.get('agenda', {})
        day_items = agenda.get(day_key, [])

    if not day_items:
        return ""

    # Get day title if specified
    day_title = day_titles.get(day_num, '')

    # Use compact agenda class for auto-fit
    slide_content = "\n<!-- _class: agenda -->\n"
    slide_content += "# Agenda\n\n"

    # Add day title with theme if specified
    if day_title:
        slide_content += f"**Day {day_num} -- {day_title}**\n\n"
    else:
        slide_content += f"**Day {day_num}**\n\n"

    # Use HTML table for colspan support on section headers
    slide_content += '<table>\n'
    slide_content += '<tr style="background: #CAE6E9;"><th>Time</th><th>Agenda</th><th>Facilitator/Presenter</th></tr>\n'

    for item in day_items:
        item_type = item.get('type', '')
        time = item.get('time', '')
        session = item.get('session', '')
        speaker = item.get('speaker', '')

        if item_type == 'section':
            # Section header - spans all columns
            slide_content += f'<tr style="background: #E8F4F3;"><td colspan="3"><strong>{session}</strong></td></tr>\n'
        elif item_type == 'break':
            # Breaks - italicized
            slide_content += f'<tr><td>{time}</td><td><em>{session}</em></td><td></td></tr>\n'
        else:
            # Regular item
            slide_content += f'<tr><td>{time}</td><td>{session}</td><td>{speaker}</td></tr>\n'

    slide_content += '</table>\n\n---\n'
    return slide_content


def generate_agenda_slide(config):
    """
    Generate agenda slide content from YAML config (table format).
    Uses compact 'agenda' class for auto-fit. One day per slide.

    Supports:
    - Day titles (optional 'title' field in day config)
    - Section headers (type: section)
    - Regular items with Time | Agenda | Facilitator

    Supports both:
    - New unified format: schedule.day1, schedule.day2, etc.
    - Old format: schedule.agenda.day1, schedule.agenda.day2, etc.
    """
    schedule = config.get('_yaml_schedule', {})
    num_days = schedule.get('days', 1)
    is_unified = config.get('_is_unified_format', False)
    day_titles = schedule.get('day_titles', {})

    all_slides = []

    # Generate one slide per day
    for day_num in range(1, num_days + 1):
        day_key = f'day{day_num}'

        # Get day items from unified or old format
        if is_unified:
            day_items = schedule.get(day_key, [])
        else:
            agenda = schedule.get('agenda', {})
            day_items = agenda.get(day_key, [])

        if not day_items:
            continue

        # Get day title if specified
        day_title = day_titles.get(day_num, '')

        # Use compact agenda class for auto-fit
        slide_content = "\n<!-- _class: agenda -->\n"
        slide_content += "# Agenda\n\n"

        # Add day title with theme if specified
        if day_title:
            slide_content += f"**Day {day_num} -- {day_title}**\n\n"
        else:
            slide_content += f"**Day {day_num}**\n\n"

        # Use HTML table for colspan support on section headers
        slide_content += '<table>\n'
        slide_content += '<tr style="background: #CAE6E9;"><th>Time</th><th>Agenda</th><th>Facilitator/Presenter</th></tr>\n'

        for item in day_items:
            item_type = item.get('type', '')
            time = item.get('time', '')
            session = item.get('session', '')
            speaker = item.get('speaker', '')

            if item_type == 'section':
                # Section header - spans all columns
                slide_content += f'<tr style="background: #E8F4F3;"><td colspan="3"><strong>{session}</strong></td></tr>\n'
            elif item_type == 'break':
                # Breaks - italicized
                slide_content += f'<tr><td>{time}</td><td><em>{session}</em></td><td></td></tr>\n'
            else:
                # Regular item
                slide_content += f'<tr><td>{time}</td><td>{session}</td><td>{speaker}</td></tr>\n'

        slide_content += '</table>\n\n---\n'
        all_slides.append(slide_content)

    return "".join(all_slides)


def load_yaml_config(yaml_path):
    """Load and convert YAML config to expected format."""
    if not YAML_AVAILABLE:
        return None

    with open(yaml_path, 'r') as f:
        yaml_config = yaml.safe_load(f)

    workshop = yaml_config.get('workshop', {})
    schedule = yaml_config.get('schedule', {})
    content = yaml_config.get('content', {})
    country_data = yaml_config.get('country_data', {})

    # Check if using new unified format (schedule.day1, schedule.day2, etc.)
    # vs old format (schedule.agenda.day1, content.deck_order)
    is_unified_format = 'day1' in schedule and 'agenda' not in schedule

    # Convert to expected format
    config = {
        'workshop_id': workshop.get('id', ''),
        'name': workshop.get('name', ''),
        'date': workshop.get('date', ''),
        'location': workshop.get('location', ''),
        'facilitators': workshop.get('facilitators', ''),
        'contact_email': workshop.get('contact_email', ''),
        'website': workshop.get('website', 'https://www.globalfinancingfacility.org/'),

        'workshop_days': schedule.get('days', 2),
        'tea_time': schedule.get('tea_time', '10:30 AM'),
        'lunch_time': schedule.get('lunch_time', '12:30 PM'),
        'afternoon_tea_time': schedule.get('afternoon_tea', '3:30 PM'),
        'day_start_time': schedule.get('start_time', '9:00 AM'),
        'day_start_times': schedule.get('day_start_times', {}),  # Per-day start times

        'deck_order': content.get('deck_order', []),
        'include_day_end_slides': True,
        'include_closing': True,

        # Store original YAML schedule for agenda generation
        '_yaml_schedule': schedule,
        '_is_yaml': True,
        '_is_unified_format': is_unified_format,

        # Country-specific data for variable substitution
        'country_data': country_data,
    }

    return config


def generate_break_slide_content(session_name, duration, return_time):
    """Generate markdown content for a break slide."""
    # Determine title and icon based on session name
    name_lower = session_name.lower()
    if 'lunch' in name_lower:
        title = 'Lunch Break'
        icon = '../resources/icons/lunch.png'
    elif 'afternoon' in name_lower:
        title = 'Afternoon Tea'
        icon = '../resources/icons/coffee.png'
    else:
        title = 'Tea Break'
        icon = '../resources/icons/coffee.png'

    # Note: No leading --- since previous slide ends with ---
    # Use HTML img tag for icon with transparent background
    return f"""
# <img src="{icon}" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> {title}

**{duration} minutes**

Back at {return_time}

---
"""


def extract_unified_schedule(config):
    """
    Extract deck-building info from unified schedule format.

    Returns list of items for each day:
    [
        {
            'day': 1,
            'session': 'Welcome',
            'module': 'm0' or None,
            'slides': ['agenda', '01_objectives.md'] or None,
            'is_break': True/False,
            'duration': 15,
            'time': '9:00 AM - 9:15 AM',
        },
        ...
    ]
    """
    schedule = config.get('_yaml_schedule', {})
    num_days = config.get('workshop_days', 2)

    items = []
    for day_num in range(1, num_days + 1):
        day_key = f'day{day_num}'
        day_sessions = schedule.get(day_key, [])

        for session in day_sessions:
            session_type = session.get('type', '')
            item = {
                'day': day_num,
                'session': session.get('session', ''),
                'module': session.get('module'),
                'topics': session.get('topics'),  # List of specific topic IDs like [m3_1, m3_2]
                'slides': session.get('slides'),
                'is_break': session_type == 'break',
                'is_section': session_type == 'section',
                'is_day_recap': session_type == 'day_recap',
                'is_day_end': session_type == 'day_end',
                'duration': session.get('duration', 0),
                'time': session.get('time', ''),
                # Inline content for day_recap
                'recap_yesterday': session.get('recap_yesterday', ''),
                'recap_today': session.get('recap_today', ''),
                # Inline content for day_end
                'wrapup_message': session.get('wrapup_message', ''),
            }
            items.append(item)

    return items


def load_workshop_config(workshop_id, base_dir):
    """Load workshop config from YAML or Python file."""
    workshop_dir = os.path.join(base_dir, "workshops", workshop_id)
    yaml_path = os.path.join(workshop_dir, "workshop.yaml")
    py_path = os.path.join(workshop_dir, "config.py")

    # Try YAML first
    if os.path.exists(yaml_path) and YAML_AVAILABLE:
        print(f"   Loading workshop.yaml")
        config = load_yaml_config(yaml_path)
        # Ensure workshop_id is set (from folder name if not in yaml)
        if not config.get('workshop_id'):
            config['workshop_id'] = workshop_id
        return config

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


def infer_days_from_deck_order(deck_order, yaml_schedule):
    """
    Infer day assignments from deck_order using session slide markers.

    Uses dayN_wrapup.md and dayN_recap.md files to determine day boundaries.
    Falls back to yaml schedule if available.

    Returns: dict mapping deck_order items to their day numbers
    """
    import re

    day_info = {}
    current_day = 1

    # First pass: identify day boundaries from session slides
    for item in deck_order:
        # dayN_wrapup.md marks end of day N
        wrapup_match = re.match(r'day(\d+)_wrapup\.md', item)
        if wrapup_match:
            day_info[item] = int(wrapup_match.group(1))
            continue

        # dayN_recap.md marks start of day N
        recap_match = re.match(r'day(\d+)_recap\.md', item)
        if recap_match:
            day_info[item] = int(recap_match.group(1))
            continue

    # Second pass: assign days to all items based on markers
    current_day = 1
    for item in deck_order:
        # Check if this is a day marker
        wrapup_match = re.match(r'day(\d+)_wrapup\.md', item)
        recap_match = re.match(r'day(\d+)_recap\.md', item)

        if recap_match:
            # Recap marks start of a new day
            current_day = int(recap_match.group(1))
            day_info[item] = current_day
        elif wrapup_match:
            # Wrapup is at end of its day
            day_info[item] = int(wrapup_match.group(1))
        else:
            # Regular items belong to current day
            day_info[item] = current_day

        # After wrapup, move to next day (for subsequent items)
        if wrapup_match:
            current_day = int(wrapup_match.group(1)) + 1

    # Build break info from yaml schedule if available
    if yaml_schedule and 'agenda' in yaml_schedule:
        agenda = yaml_schedule['agenda']
        for day_key, sessions in agenda.items():
            day_match = re.match(r'day(\d+)', day_key)
            if day_match:
                day_num = int(day_match.group(1))
                for session in sessions:
                    if 'module' in session:
                        module_id = session['module']
                        # Update any items that match this module
                        for item in deck_order:
                            if is_module_prefix(item):
                                item_module = item.split('_')[0] if '_' in item else item
                                if item_module == module_id and item not in day_info:
                                    day_info[item] = day_num

    return day_info


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
            # Sort to ensure consistent order (m3_1, m3_2, m3_3, etc.)
            matching_sessions = sorted(matching_sessions)
            for idx, session_id in enumerate(matching_sessions):
                is_last_in_module = (idx == len(matching_sessions) - 1)
                entry = {
                    'session': session_id,
                    'day': day_num,
                    # Only add breaks after the LAST topic in a module
                    'tea_after': is_last_in_module and module_id in preset.get('tea_after', []),
                    'lunch_after': is_last_in_module and module_id in preset.get('lunch_after', []),
                    'afternoon_tea_after': is_last_in_module and module_id in preset.get('afternoon_tea_after', []),
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
    # Check if it's a module prefix (m0, m1, m4_2, m1_2a, etc.)
    module_match = re.match(r'^m(\d+)(_\d+[a-z]?)?$', item)
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


def preview_unified_schedule(config):
    """Display a visual preview of the unified schedule format"""
    schedule_config = config.get('_yaml_schedule', {})
    num_days = schedule_config.get('days', 1)

    print("\n" + "=" * 70)
    print("   WORKSHOP SCHEDULE PREVIEW")
    print("=" * 70)

    for day_num in range(1, num_days + 1):
        day_key = f'day{day_num}'
        day_items = schedule_config.get(day_key, [])

        if not day_items:
            continue

        print(f"\n   DAY {day_num}")
        print("   " + "-" * 50)

        for item in day_items:
            time_slot = item.get('time', '')
            session = item.get('session', '')
            is_break = item.get('type') == 'break'

            if is_break:
                print(f"   {time_slot:20} ☕ {session}")
            else:
                print(f"   {time_slot:20} {session}")

    print("\n" + "=" * 70)
    print("   Edit schedule in: workshops/{}/workshop.yaml".format(config.get('workshop_id', '')))
    print("=" * 70)
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
    workshop_id = config.get('workshop_id', '')
    country_data = config.get('country_data', {})
    country_name = country_data.get('COUNTRY', '').lower().replace(' ', '-')

    replacements = {
        'WORKSHOP_ID': workshop_id,
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
        # Workshop-specific media path (relative to outputs/ folder)
        'WORKSHOP_MEDIA': f'../workshops/{workshop_id}/media' if workshop_id else '../media',
        # Platform URL based on country name (e.g., https://zambia.fastr-analytics.org/)
        'PLATFORM_URL': f'https://{country_name}.fastr-analytics.org' if country_name else 'https://fastr-analytics.org',
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


def fix_image_paths_for_output(content):
    """
    Fix image paths for output folder.
    Slides from core_content use ../../resources/ but output is in outputs/
    so we need ../resources/ (one level up from outputs/).
    """
    # Fix ../../resources/ to ../resources/
    content = content.replace('](../../resources/', '](../resources/')
    content = content.replace('](../resources/', '](../resources/')  # Already correct, no change
    return content


# ═══════════════════════════════════════════════════════════════════════
# AUTO-LAYOUT DETECTION AND PROCESSING
# ═══════════════════════════════════════════════════════════════════════

IMAGE_PATTERN = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)')
LAYOUT_DIRECTIVE_PATTERN = re.compile(r'<!--\s*layout:\s*(\S+)\s*-->')


def has_manual_layout(slide_content):
    """Check if slide already has manual layout markup."""
    layout_markers = [
        '<div class="columns',
        '<div class="columns-3',
        '<div style=',
    ]
    return any(marker in slide_content for marker in layout_markers)


def count_images(slide_content):
    """Count images in slide content."""
    return len(IMAGE_PATTERN.findall(slide_content))


def has_significant_text(slide_content):
    """Check if slide has enough text content to justify columns layout."""
    # Remove images, comments, headings, and slide breaks
    text = slide_content
    text = IMAGE_PATTERN.sub('', text)
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    text = re.sub(r'^#{1,6}\s+.*$', '', text, flags=re.MULTILINE)
    text = text.replace('---', '').strip()

    # Require substantial text to justify side-by-side layout
    # At least 200 characters or 3+ bullet points
    # Otherwise the text column will have too much whitespace
    char_count = len(text)
    bullet_count = len(re.findall(r'^\s*[-*]\s', text, re.MULTILINE))

    return char_count > 200 or bullet_count >= 3


def estimate_content_length(slide_content):
    """
    Estimate if content will overflow slide area.

    Returns: ('ok' | 'warning' | 'overflow', message)
    """
    # Remove images - they have predictable height
    text = IMAGE_PATTERN.sub('[IMAGE]', slide_content)
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)

    lines = text.strip().split('\n')
    non_empty_lines = [l for l in lines if l.strip()]
    char_count = len(text)
    list_items = len(re.findall(r'^\s*[-*\d]+[.)]?\s', text, re.MULTILINE))

    if len(non_empty_lines) > 22 or char_count > 1800:
        return ('overflow', f'{len(non_empty_lines)} lines, {char_count} chars')
    elif len(non_empty_lines) > 18 or char_count > 1200 or list_items > 10:
        return ('warning', f'{len(non_empty_lines)} lines, {list_items} list items')
    return ('ok', '')


def get_layout_preference(slide_content):
    """Extract layout preference from directive if present."""
    match = LAYOUT_DIRECTIVE_PATTERN.search(slide_content)
    if match:
        pref = match.group(1).strip().lower()
        if pref in ['image-left', 'image-right', 'none', 'skip']:
            return pref
    return None


def apply_image_text_columns(slide_content, image_position='right'):
    """
    Wrap slide content with image + text in a two-column layout.

    Args:
        slide_content: Raw slide markdown
        image_position: 'left' or 'right' (default: 'right')

    Returns:
        Transformed slide content with columns layout
    """
    lines = slide_content.split('\n')

    # Find directive, heading, and body
    directive_lines = []
    heading_line = None
    body_lines = []

    in_body = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('<!--') and ('_class:' in line or 'layout:' in line):
            directive_lines.append(line)
        elif not in_body and stripped.startswith('#'):
            heading_line = line
            in_body = True
        elif in_body:
            body_lines.append(line)

    body_content = '\n'.join(body_lines).strip()

    # Find and extract the image
    images = IMAGE_PATTERN.findall(body_content)
    if not images:
        return slide_content

    # Use first image only
    alt_text, image_path = images[0]
    image_md = f'![{alt_text}]({image_path})'

    # Remove image from body to get text content
    text_content = IMAGE_PATTERN.sub('', body_content, count=1).strip()

    # Remove orphaned figure captions (italicized lines that look like captions)
    text_lines = text_content.split('\n')
    cleaned_text_lines = []
    for line in text_lines:
        stripped = line.strip()
        # Skip lines that are just italicized figure captions
        if stripped.startswith('*') and stripped.endswith('*') and len(stripped) < 100:
            if 'figure' in stripped.lower():
                continue
        cleaned_text_lines.append(line)

    text_content = '\n'.join(cleaned_text_lines).strip()

    # Build the columns layout
    if image_position == 'left':
        left_content = image_md
        right_content = text_content
    else:
        left_content = text_content
        right_content = image_md

    # Assemble the new slide
    result_parts = []
    result_parts.extend(directive_lines)
    if heading_line:
        result_parts.append(heading_line)
    result_parts.append('')
    result_parts.append('<div class="columns">')
    result_parts.append('<div>')
    result_parts.append('')
    result_parts.append(left_content)
    result_parts.append('')
    result_parts.append('</div>')
    result_parts.append('<div>')
    result_parts.append('')
    result_parts.append(right_content)
    result_parts.append('')
    result_parts.append('</div>')
    result_parts.append('</div>')

    return '\n'.join(result_parts)


def process_slide_auto_layout(slide_content, verbose=False):
    """
    Process a single slide for auto-layout.

    Returns: (processed_content, status_message)
    """
    # Check for explicit skip directive
    layout_pref = get_layout_preference(slide_content)
    if layout_pref in ['none', 'skip']:
        return slide_content, None

    # Skip if already has manual layout
    if has_manual_layout(slide_content):
        return slide_content, None

    # Skip if content has internal slide breaks (multiple slides in one block)
    # This prevents wrapping slide breaks inside column divs
    if '\n---\n' in slide_content or slide_content.strip().endswith('---'):
        return slide_content, None

    # Check content length
    length_status, length_msg = estimate_content_length(slide_content)
    warning_msg = None
    if length_status == 'overflow':
        warning_msg = f"Content overflow: {length_msg}"
    elif length_status == 'warning':
        warning_msg = f"Content may be tight: {length_msg}"

    # Check for auto-layout opportunity: single image + significant text
    image_count = count_images(slide_content)
    has_text = has_significant_text(slide_content)

    if image_count == 1 and has_text:
        # Apply columns layout
        image_pos = 'left' if layout_pref == 'image-left' else 'right'
        processed = apply_image_text_columns(slide_content, image_pos)
        status = f"Auto-layout applied (image {image_pos})"
        if warning_msg:
            status += f" [{warning_msg}]"
        return processed, status

    # No layout change, but maybe a warning
    return slide_content, warning_msg


def process_slides_with_auto_layout(content, verbose=True):
    """
    Process all slides in content for auto-layout.

    NOTE: Auto-layout is currently disabled due to complexity with slide breaks.
    This function now just returns the content unchanged.
    """
    # TODO: Re-enable auto-layout with proper slide break handling
    return content

    # Original implementation (disabled):
    parts = content.split('\n---\n')
    processed_parts = []
    layout_stats = {'applied': 0, 'warnings': 0}

    for i, slide in enumerate(parts):
        # Skip empty slides and frontmatter
        if not slide.strip() or slide.strip().startswith('marp:'):
            processed_parts.append(slide)
            continue

        processed, status = process_slide_auto_layout(slide, verbose)
        processed_parts.append(processed)

        if status:
            if 'Auto-layout applied' in status:
                layout_stats['applied'] += 1
                if verbose:
                    print(f"      [slide {i+1}] {status}")
            elif 'overflow' in status.lower() or 'warning' in status.lower():
                layout_stats['warnings'] += 1
                if verbose:
                    print(f"      [slide {i+1}] ⚠️  {status}")

    if verbose and (layout_stats['applied'] or layout_stats['warnings']):
        print(f"\n   Auto-layout: {layout_stats['applied']} layouts applied, {layout_stats['warnings']} warnings")

    return '\n---\n'.join(processed_parts)


def read_markdown_file(filepath):
    """Read a markdown file and return its content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        # Fix image paths for output folder
        content = fix_image_paths_for_output(content)
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
    # Get next day's start time (day_number is current day, so next is day_number + 1)
    next_day = day_number + 1
    day_start_times = config.get('day_start_times', {})
    day_start = day_start_times.get(next_day) or day_start_times.get(str(next_day)) or config.get('day_start_time', '9:00 AM')

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


def build_workshop_deck(workshop_id, base_dir, output_file=None, skip_confirmation=False, override_days=None, target_lang='en'):
    """Build a complete slide deck for a workshop.

    Args:
        target_lang: Output language ('en', 'fr', 'es', etc.). Default 'en'.
                     Non-English requires DeepL API key.
    """

    print("\n" + "=" * 70)
    print(f"       BUILDING WORKSHOP: {workshop_id}")
    print("=" * 70)

    # Step 1: Load and validate workshop configuration
    print("\nStep 1: Loading and validating workshop...")
    config = load_workshop_config(workshop_id, base_dir)
    print("   Config loaded successfully")

    # Validate before building
    valid, errors, warnings = validate_workshop(workshop_id, base_dir, config)
    if not valid:
        print("\n   Build cancelled due to errors. Please fix the issues above.")
        sys.exit(1)

    # Check format and get build configuration
    is_unified = config.get('_is_unified_format', False)
    deck_order = config.get('deck_order', [])
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

    # Step 3: Get schedule info based on format
    if is_unified:
        # New unified format - extract schedule from day1, day2, etc.
        unified_items = extract_unified_schedule(config)
        schedule = []  # Not used for unified format
        break_info = {}  # Not used for unified format
    else:
        # Old format - use deck_order
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

        # For YAML configs, also infer days from deck_order markers (dayN_wrapup.md, dayN_recap.md)
        if config.get('_is_yaml'):
            yaml_schedule = config.get('_yaml_schedule', {})
            day_info = infer_days_from_deck_order(deck_order, yaml_schedule)
            # Update break_info with inferred day info
            for item, day_num in day_info.items():
                if item not in break_info:
                    break_info[item] = {'day': day_num}
                else:
                    break_info[item]['day'] = day_num

    # Step 5: Preview and confirm
    if not skip_confirmation:
        if is_unified:
            preview_unified_schedule(config)
        else:
            preview_schedule(schedule, config)
        if not confirm_schedule():
            print("\nBuild cancelled. Edit workshop.yaml and try again.")
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

    # Add welcome slide (appears after title in all workshops)
    welcome_path = os.path.join(base_dir, "templates", "welcome_slide.md")
    welcome_content = read_markdown_file(welcome_path)
    if welcome_content:
        welcome_content = strip_frontmatter(welcome_content)
        welcome_content = substitute_variables(welcome_content, config)
        deck_content += ensure_slide_break(welcome_content) + "\n"
        print(f"   Welcome slide added")

    # Add introductions slide (appears after welcome in all workshops)
    intros_path = os.path.join(base_dir, "templates", "introductions_slide.md")
    intros_content = read_markdown_file(intros_path)
    if intros_content:
        intros_content = strip_frontmatter(intros_content)
        intros_content = substitute_variables(intros_content, config)
        deck_content += ensure_slide_break(intros_content) + "\n"
        print(f"   Introductions slide added")

    # Workshop and content directories
    workshop_dir = os.path.join(base_dir, "workshops", workshop_id)
    core_content_dir = os.path.join(base_dir, "core_content")

    # ═══════════════════════════════════════════════════════════════════════
    # BUILD DECK
    # ═══════════════════════════════════════════════════════════════════════
    print(f"\nAdding slides in order:")
    current_day = 0
    current_section = None  # Track current section for session title slides

    if is_unified:
        # ═══════════════════════════════════════════════════════════════════
        # UNIFIED FORMAT: Build from schedule.day1, schedule.day2, etc.
        # ═══════════════════════════════════════════════════════════════════
        for item in unified_items:
            # Day separator
            if item['day'] != current_day:
                current_day = item['day']
                if num_days > 1:
                    print(f"\n   DAY {current_day}:")
                    # Generate day title slide (skip Day 1 which has title slide already)
                    if current_day > 1:
                        day_title_content = f"\n# Day {current_day}\n\n---\n"
                        deck_content += day_title_content

            session_name = item['session']

            # Track section headers (for session title slides)
            if item.get('is_section'):
                current_section = session_name
                continue  # Section headers are only for agenda, not content

            # Handle breaks
            if item['is_break']:
                # Extract return time from time field
                # Handles both "10:30 AM - 10:45 AM" and "12:30-14:00" formats
                time_str = item['time']
                if ' - ' in time_str:
                    time_parts = time_str.split(' - ')
                    return_time = time_parts[1] if len(time_parts) > 1 else ''
                elif '-' in time_str:
                    time_parts = time_str.split('-')
                    return_time = time_parts[1] if len(time_parts) > 1 else ''
                else:
                    return_time = ''
                break_content = generate_break_slide_content(session_name, item['duration'], return_time)
                deck_content += break_content + "\n"
                # Determine emoji
                if 'lunch' in session_name.lower():
                    print(f"   🍽️  {session_name}")
                else:
                    print(f"   ☕ {session_name}")
                continue

            # Handle day_recap session type (from GUI with inline content)
            if item.get('is_day_recap'):
                recap_yesterday = item.get('recap_yesterday', '')
                recap_today = item.get('recap_today', '')

                if recap_yesterday or recap_today:
                    # Generate from inline content
                    recap_content = f"\n# Recap\n\n"
                    if recap_yesterday:
                        recap_content += "**Yesterday we covered:**\n\n"
                        for line in recap_yesterday.strip().split('\n'):
                            line = line.strip()
                            if line and not line.startswith('-'):
                                line = f"- {line}"
                            if line:
                                recap_content += f"{line}\n"
                        recap_content += "\n---\n\n"

                    if recap_today:
                        recap_content += f"# Day {current_day} Focus\n\n**Today we will cover:**\n\n"
                        for line in recap_today.strip().split('\n'):
                            line = line.strip()
                            if line and not line.startswith('-'):
                                line = f"- {line}"
                            if line:
                                recap_content += f"{line}\n"
                        recap_content += "\n---\n"

                    deck_content += recap_content
                    print(f"   📋 {session_name} (from inline content)")
                elif current_day > 1:
                    # Fall back to file
                    recap_file = f"day{current_day}_recap.md"
                    custom_path = os.path.join(workshop_dir, recap_file)
                    content = read_markdown_file(custom_path)
                    if content:
                        content = strip_frontmatter(content)
                        content = substitute_variables(content, config)
                        deck_content += "\n" + ensure_slide_break(content) + "\n"
                        print(f"   📋 {session_name}: {recap_file}")
                    else:
                        print(f"   ⚠️  Warning: No content for {session_name} - fill in the fields or create {recap_file}")
                else:
                    print(f"   Note: Skipping day_recap on Day 1 (nothing to recap)")
                continue

            # Handle day_end session type (from GUI with inline content)
            if item.get('is_day_end'):
                wrapup_message = item.get('wrapup_message', '')

                if wrapup_message:
                    # Use custom wrap-up message
                    wrapup_content = f"\n# End of Day {current_day}\n\n{wrapup_message}\n\n---\n"
                    deck_content += wrapup_content
                    print(f"   🌙 {session_name} (custom message)")
                else:
                    # Try file first
                    wrapup_file = f"day{current_day}_wrapup.md"
                    custom_path = os.path.join(workshop_dir, wrapup_file)
                    content = read_markdown_file(custom_path)
                    if content:
                        content = strip_frontmatter(content)
                        content = substitute_variables(content, config)
                        deck_content += "\n" + ensure_slide_break(content) + "\n"
                        print(f"   🌙 {session_name}: {wrapup_file}")
                    else:
                        # Auto-generate end of day slide
                        next_day_sessions = [e['session'] for e in unified_items if e['day'] == current_day + 1 and not e.get('is_break') and not e.get('is_section')]
                        end_content = generate_day_end_slide(current_day, next_day_sessions, config)
                        if end_content:
                            deck_content += end_content
                            print(f"   🌙 {session_name} (auto-generated)")
                continue

            # Handle module content
            if item['module']:
                module_id = item['module']
                files, name, is_valid = resolve_module_prefix(module_id, exclude=exclude_list)

                if is_valid and files:
                    # Generate session title slide if we have a section header
                    if current_section:
                        session_title = f"\n<!-- _class: section-cover -->\n\n![bg](../resources/backgrounds/section_slide.png)\n\n# {current_section}\n\n---\n"
                        deck_content += session_title
                        current_section = None  # Reset after using
                    module_overrides = []
                    custom_slide_count = 0
                    for filename in files:
                        filepath, is_custom = resolve_slide_path(filename, workshop_id, base_dir, core_content_dir)
                        if is_custom:
                            custom_slide_count += 1
                        content = read_markdown_file(filepath)
                        if content:
                            content = strip_frontmatter(content)
                            content = substitute_variables(content, config)
                            content, overrides = resolve_asset_overrides(content, workshop_id, base_dir)
                            module_overrides.extend(overrides)
                            deck_content += "\n" + ensure_slide_break(content) + "\n"

                    print(f"   [{module_id}] {name}")
                    if custom_slide_count > 0:
                        print(f"      📝 {custom_slide_count} custom slide override(s)")
                    if module_overrides:
                        print(f"      📊 {len(module_overrides)} custom asset(s)")
                else:
                    print(f"   Warning: Unknown module '{module_id}'")

            # Handle topics (list of specific topic IDs like [m3_1, m3_2])
            if item.get('topics'):
                # Generate session title slide if we have a section header
                if current_section:
                    session_title = f"\n<!-- _class: section-cover -->\n\n![bg](../resources/backgrounds/section_slide.png)\n\n# {current_section}\n\n---\n"
                    deck_content += session_title
                    current_section = None  # Reset after using
                topics_overrides = []
                topics_custom_count = 0
                for topic_id in item['topics']:
                    files, name, is_valid = resolve_module_prefix(topic_id, exclude=exclude_list)
                    if is_valid and files:
                        for filename in files:
                            filepath, is_custom = resolve_slide_path(filename, workshop_id, base_dir, core_content_dir)
                            if is_custom:
                                topics_custom_count += 1
                            content = read_markdown_file(filepath)
                            if content:
                                content = strip_frontmatter(content)
                                content = substitute_variables(content, config)
                                content, overrides = resolve_asset_overrides(content, workshop_id, base_dir)
                                topics_overrides.extend(overrides)
                                deck_content += "\n" + ensure_slide_break(content) + "\n"
                    else:
                        print(f"   Warning: Unknown topic '{topic_id}'")
                print(f"   {session_name}: {item['topics']}")
                if topics_custom_count > 0:
                    print(f"      📝 {topics_custom_count} custom slide override(s)")
                if topics_overrides:
                    print(f"      📊 {len(topics_overrides)} custom asset(s)")

            # Handle custom slides
            if item['slides']:
                for slide_file in item['slides']:
                    if slide_file == 'agenda':
                        # Generate agenda slides (all days)
                        agenda_content = generate_agenda_slide(config)
                        if agenda_content:
                            deck_content += ensure_slide_break(agenda_content) + "\n"
                            print(f"   {session_name}: agenda")

                    elif slide_file.endswith('_agenda') and slide_file.startswith('day'):
                        # Day-specific agenda (e.g., day1_agenda, day2_agenda)
                        import re
                        day_match = re.match(r'day(\d+)_agenda', slide_file)
                        if day_match:
                            agenda_day = int(day_match.group(1))
                            agenda_content = generate_single_day_agenda(config, agenda_day)
                            if agenda_content:
                                deck_content += ensure_slide_break(agenda_content) + "\n"
                                print(f"   {session_name}: {slide_file}")

                    elif slide_file in ['day_recap', 'day_recap.md']:
                        # Day recap - use inline content, fall back to file, or skip
                        recap_yesterday = item.get('recap_yesterday', '')
                        recap_today = item.get('recap_today', '')

                        if recap_yesterday or recap_today:
                            # Generate from inline content
                            recap_content = f"\n# Recap\n\n"
                            if recap_yesterday:
                                recap_content += "**Yesterday we covered:**\n\n"
                                for line in recap_yesterday.strip().split('\n'):
                                    line = line.strip()
                                    if line and not line.startswith('-'):
                                        line = f"- {line}"
                                    if line:
                                        recap_content += f"{line}\n"
                                recap_content += "\n---\n\n"

                            if recap_today:
                                recap_content += f"# Day {current_day} Focus\n\n**Today we will cover:**\n\n"
                                for line in recap_today.strip().split('\n'):
                                    line = line.strip()
                                    if line and not line.startswith('-'):
                                        line = f"- {line}"
                                    if line:
                                        recap_content += f"{line}\n"
                                recap_content += "\n---\n"

                            deck_content += recap_content
                            print(f"   {session_name}: (from inline content)")
                        elif current_day > 1:
                            # Fall back to file
                            recap_file = f"day{current_day}_recap.md"
                            custom_path = os.path.join(workshop_dir, recap_file)
                            content = read_markdown_file(custom_path)
                            if content:
                                content = strip_frontmatter(content)
                                content = substitute_variables(content, config)
                                deck_content += "\n" + ensure_slide_break(content) + "\n"
                                print(f"   {session_name}: {recap_file}")
                            else:
                                print(f"   Warning: No content for {session_name} - fill in the fields or create {recap_file}")
                        else:
                            print(f"   Note: Skipping day_recap on Day 1 (nothing to recap)")

                    elif slide_file in ['day_end', 'day_end.md', 'day_wrapup', 'day_wrapup.md']:
                        # End of day - use inline content, fall back to file, or auto-generate
                        wrapup_message = item.get('wrapup_message', '')

                        if wrapup_message:
                            # Use custom wrap-up message
                            wrapup_content = f"\n# End of Day {current_day}\n\n{wrapup_message}\n\n---\n"
                            deck_content += wrapup_content
                            print(f"   {session_name}: (custom message)")
                        else:
                            # Try file first
                            wrapup_file = f"day{current_day}_wrapup.md"
                            custom_path = os.path.join(workshop_dir, wrapup_file)
                            content = read_markdown_file(custom_path)
                            if content:
                                content = strip_frontmatter(content)
                                content = substitute_variables(content, config)
                                deck_content += "\n" + ensure_slide_break(content) + "\n"
                                print(f"   {session_name}: {wrapup_file}")
                            else:
                                # Auto-generate end of day slide
                                next_day_sessions = [e['session'] for e in unified_items if e['day'] == current_day + 1 and not e.get('is_break') and not e.get('is_section')]
                                end_content = generate_day_end_slide(current_day, next_day_sessions, config)
                                if end_content:
                                    deck_content += end_content
                                    print(f"   {session_name}: (auto-generated)")

                    else:
                        # Custom slide - check workshop folder first, then templates folder
                        custom_path = os.path.join(workshop_dir, slide_file)
                        content = read_markdown_file(custom_path)
                        if not content:
                            # Try templates folder
                            template_path = os.path.join(base_dir, "templates", slide_file)
                            content = read_markdown_file(template_path)
                        if content:
                            content = strip_frontmatter(content)
                            content = substitute_variables(content, config)
                            deck_content += "\n" + ensure_slide_break(content) + "\n"
                            print(f"   {session_name}: {slide_file}")
                        else:
                            print(f"   Warning: Could not read {slide_file}")

    else:
        # ═══════════════════════════════════════════════════════════════════
        # OLD FORMAT: Build from deck_order list
        # ═══════════════════════════════════════════════════════════════════
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
                    custom_slide_count = 0
                    for filename in files:
                        filepath, is_custom = resolve_slide_path(filename, workshop_id, base_dir, core_content_dir)
                        if is_custom:
                            custom_slide_count += 1
                        content = read_markdown_file(filepath)
                        if content:
                            content = strip_frontmatter(content)
                            content = substitute_variables(content, config)
                            content, overrides = resolve_asset_overrides(content, workshop_id, base_dir)
                            module_overrides.extend(overrides)
                            deck_content += "\n" + ensure_slide_break(content) + "\n"

                    print(f"   [{item}] {name}")
                    if custom_slide_count > 0:
                        print(f"      📝 {custom_slide_count} custom slide override(s)")
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

    # Apply auto-layout processing
    print(f"\nStep 3: Applying auto-layout...")
    deck_content = process_slides_with_auto_layout(deck_content, verbose=True)

    # Step 4: Translate if non-English
    if target_lang and target_lang.lower() != 'en':
        print(f"\nStep 4: Translating to {target_lang.upper()}...")
        try:
            from translate import translate_content, get_api_key, validate_api_key

            # Check API key
            api_key = get_api_key()
            if not api_key:
                print("   ❌ DeepL API key not found.")
                print("   Set DEEPL_API_KEY environment variable or create .env file.")
                print("   Sign up at: https://www.deepl.com/pro-api (free tier available)")
                sys.exit(1)

            # Validate key
            is_valid, msg = validate_api_key(api_key)
            if not is_valid:
                print(f"   ❌ {msg}")
                sys.exit(1)

            # Translate content
            print(f"   Translating... (this may take a minute)")
            deck_content = translate_content(deck_content, target_lang.upper())
            print(f"   ✓ Translation complete")

            # Update output filename
            if not output_file:
                output_file = f"{workshop_id}_deck.{target_lang.lower()}.md"
            elif not output_file.endswith(f'.{target_lang.lower()}.md'):
                # Insert language before .md
                output_file = output_file.replace('.md', f'.{target_lang.lower()}.md')

        except ImportError:
            print("   ❌ Translation module not found. Check tools/translate.py exists.")
            sys.exit(1)
        except Exception as e:
            print(f"   ❌ Translation failed: {e}")
            sys.exit(1)

    # Write output file
    print(f"\nStep 5: Writing output file..." if target_lang and target_lang.lower() != 'en' else "\nStep 4: Writing output file...")
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
    print(f"   marp --html --no-config {output_path} --theme fastr-theme.css --pdf --allow-local-files")
    print(f"\n   Why PDF? Consistent styling, no font issues, ready to present!")

    print(f"\n   OPTION 2: Convert to PowerPoint")
    print(f"   " + "-" * 40)
    print(f"   python3 tools/03_convert_pptx.py {output_path}")
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
  python3 tools/02_build_deck.py --workshop 2025-01-nigeria
  python3 tools/02_build_deck.py --workshop example --output test.md

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

        parser.add_argument(
            '--lang',
            type=str,
            choices=['en', 'fr', 'es', 'de', 'pt'],
            default='en',
            help='Output language (default: en). Requires DeepL API key for non-English.'
        )

        args = parser.parse_args()

        build_workshop_deck(args.workshop, base_dir, args.output,
                           skip_confirmation=True, override_days=args.days,
                           target_lang=args.lang)

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
