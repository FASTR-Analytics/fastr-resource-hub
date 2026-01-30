#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
                    FASTR WORKSHOP SETUP WIZARD
═══════════════════════════════════════════════════════════════════════════════

Step 1: Create a new workshop folder with everything you need.

USAGE:
    python3 tools/01_new_workshop.py

This wizard will:
1. Ask for basic workshop info (country, dates, location)
2. Help you select which modules to include
3. Auto-assign modules to days based on duration
4. Generate a workshop.yaml config file
5. Copy custom slide templates

═══════════════════════════════════════════════════════════════════════════════
"""

import os
import sys
import re
import shutil
from datetime import datetime
from pathlib import Path

# ═══════════════════════════════════════════════════════════════════════════════
# AUTO-DETECT AND USE VENV
# ═══════════════════════════════════════════════════════════════════════════════

def ensure_venv():
    """Re-execute with venv Python if not already in venv."""
    # Already in a venv?
    if sys.prefix != sys.base_prefix:
        return

    # Find project root (where .venv should be)
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent

    # Check for .venv or venv
    for venv_name in ['.venv', 'venv']:
        venv_python = project_root / venv_name / 'bin' / 'python3'
        if venv_python.exists():
            # Re-execute this script with venv Python
            os.execv(str(venv_python), [str(venv_python)] + sys.argv)

    # No venv found, continue with system Python (may fail on imports)

ensure_venv()

try:
    import yaml
except ImportError:
    print("Error: PyYAML not installed. Run: pip install pyyaml")
    sys.exit(1)


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE DEFINITIONS - Read dynamically from core_content/
# ═══════════════════════════════════════════════════════════════════════════════

# Official FASTR RMNCAH-N Service Use Monitoring Resource Package terminology
MODULE_NAMES = {
    0: 'Introduction to the FASTR Approach',
    1: 'Identify Questions & Indicators',
    2: 'Data Extraction',
    3: 'The FASTR Data Analytics Platform',
    4: 'Data Quality Assessment',
    5: 'Data Quality Adjustment',
    6: 'Data Analysis',
    7: 'Results Communication and Data Use',
    8: 'Survey & Health Facility Assessment',
}

MODULE_SHORT_NAMES = {
    0: 'Intro',
    1: 'Questions',
    2: 'Extraction',
    3: 'Platform',
    4: 'DQA',
    5: 'DQ Adjust',
    6: 'Analysis',
    7: 'Results',
    8: 'HFA',
}

# Default modules for standard workshop (recommended)
DEFAULT_MODULES = [0, 2, 4, 5, 6]

# Estimated duration per topic in minutes
MINUTES_PER_TOPIC = 15

# Modules longer than this will be auto-split across days
LONG_MODULE_THRESHOLD = 90


def discover_modules(base_dir):
    """
    Scan core_content/ folder to discover available modules and their topics.
    Returns a dict of module info keyed by module number.
    """
    core_content_dir = os.path.join(base_dir, "core_content")
    modules = {}

    if not os.path.exists(core_content_dir):
        print(f"Warning: core_content/ not found at {core_content_dir}")
        return modules

    # Find all module folders (m0_*, m1_*, etc.)
    for item in sorted(os.listdir(core_content_dir)):
        item_path = os.path.join(core_content_dir, item)
        if os.path.isdir(item_path) and item.startswith('m') and '_' in item:
            # Parse module number from folder name (e.g., "m0_introduction" -> 0)
            try:
                mod_num = int(item.split('_')[0][1:])  # Extract number after 'm'
            except ValueError:
                continue

            # Count topics (markdown files in the module folder)
            topics = []
            topic_ids = []
            for f in sorted(os.listdir(item_path)):
                if f.endswith('.md'):
                    topics.append(f)
                    # Extract topic ID from filename (e.g., "m3_1_overview.md" -> "m3_1", "m1_2a_..." -> "m1_2a")
                    match = re.match(r'^(m\d+_\d+[a-z]?)', f)
                    if match:
                        topic_ids.append(match.group(1))

            # Get official name, or derive from folder name if not defined
            if mod_num in MODULE_NAMES:
                name = MODULE_NAMES[mod_num]
            else:
                # Convert folder name: m0_introduction -> Introduction
                folder_name = '_'.join(item.split('_')[1:])
                name = folder_name.replace('_', ' ').title()

            short = MODULE_SHORT_NAMES.get(mod_num, f'M{mod_num}')

            # Estimate duration based on number of topics
            duration = len(topics) * MINUTES_PER_TOPIC
            if duration < 15:
                duration = 15  # Minimum 15 minutes

            modules[mod_num] = {
                'name': name,
                'short': short,
                'duration': duration,
                'topics': len(topics),
                'topic_ids': topic_ids,  # e.g., ['m3_1', 'm3_2', ...]
                'default': mod_num in DEFAULT_MODULES,
                'folder': item,
            }

    return modules


# Will be populated at runtime
MODULES = {}


# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def get_input(prompt, default=None, required=True):
    """Get user input with optional default. If default is provided (even empty string), field is optional."""
    if default is not None:
        if default:
            result = input(f"{prompt} [{default}]: ").strip()
        else:
            result = input(f"{prompt}: ").strip()
        return result if result else default
    elif required:
        while True:
            result = input(f"{prompt}: ").strip()
            if result:
                return result
            print("   This field is required.")
    else:
        return input(f"{prompt}: ").strip()


def create_workshop_id(country):
    """Generate a workshop ID from the country name."""
    year = datetime.now().year
    country_slug = re.sub(r'[^a-z0-9]', '', country.lower())
    return f"{year}-{country_slug}"


def parse_time(time_str):
    """Parse time string like '9:00 AM' to minutes from midnight."""
    try:
        # Handle various formats
        time_str = time_str.upper().strip()
        if 'PM' in time_str:
            time_str = time_str.replace('PM', '').strip()
            parts = time_str.split(':')
            hours = int(parts[0])
            minutes = int(parts[1]) if len(parts) > 1 else 0
            if hours != 12:
                hours += 12
        elif 'AM' in time_str:
            time_str = time_str.replace('AM', '').strip()
            parts = time_str.split(':')
            hours = int(parts[0])
            minutes = int(parts[1]) if len(parts) > 1 else 0
            if hours == 12:
                hours = 0
        else:
            parts = time_str.split(':')
            hours = int(parts[0])
            minutes = int(parts[1]) if len(parts) > 1 else 0
        return hours * 60 + minutes
    except:
        return 9 * 60  # Default to 9:00 AM


def format_time(minutes):
    """Format minutes from midnight to time string."""
    hours = minutes // 60
    mins = minutes % 60
    period = 'AM' if hours < 12 else 'PM'
    if hours == 0:
        hours = 12
    elif hours > 12:
        hours -= 12
    return f"{hours}:{mins:02d} {period}"


def is_long_module(mod_num):
    """Check if a module exceeds the split threshold."""
    return MODULES[mod_num]['duration'] > LONG_MODULE_THRESHOLD


def expand_module_to_topics(mod_num):
    """
    Expand a module into its individual topics.
    Returns list of (item_id, duration, label) tuples.
    For long modules: [('m3_1', 15, 'Platform pt.1'), ('m3_2', 15, 'Platform pt.2'), ...]
    """
    mod = MODULES[mod_num]
    topic_ids = mod.get('topic_ids', [])
    short_name = mod['short']

    items = []
    for i, topic_id in enumerate(topic_ids, 1):
        items.append((topic_id, MINUTES_PER_TOPIC, f"{short_name} pt.{i}"))

    return items


def auto_assign_modules_to_days(selected_modules, num_days):
    """
    Auto-assign modules to days based on duration.
    Maintains module order while balancing time across days.
    Long modules (>90 min) are automatically split into individual topics.

    Returns:
        days: dict mapping day number to list of items
        split_modules: set of module numbers that were split
    """
    # Sort modules to maintain logical sequence (0, 1, 2, 3, 4, 5, 6, 7)
    sorted_modules = sorted(selected_modules)

    # Build list of all items (modules or topics) with their durations
    # Each item: (item_id, duration, mod_num, label)
    all_items = []
    split_modules = set()

    for mod_num in sorted_modules:
        mod = MODULES[mod_num]
        if is_long_module(mod_num) and mod.get('topic_ids'):
            # Split this module into individual topics
            split_modules.add(mod_num)
            for topic_id, duration, label in expand_module_to_topics(mod_num):
                all_items.append((topic_id, duration, mod_num, label))
        else:
            # Keep as whole module
            all_items.append((f'm{mod_num}', mod['duration'], mod_num, mod['short']))

    # Calculate target per day
    total_duration = sum(item[1] for item in all_items)
    target_per_day = total_duration / num_days

    days = {d: [] for d in range(1, num_days + 1)}
    day_durations = {d: 0 for d in range(1, num_days + 1)}

    current_day = 1

    # Assign items in order, moving to next day when current is full
    for item_id, duration, mod_num, label in all_items:
        # If adding this item exceeds target and we have more days, consider next day
        if (day_durations[current_day] > 0 and
            day_durations[current_day] + duration > target_per_day * 1.3 and
            current_day < num_days):
            current_day += 1

        days[current_day].append({
            'id': item_id,
            'duration': duration,
            'mod_num': mod_num,
            'label': label,
        })
        day_durations[current_day] += duration

    return days, split_modules


def build_daily_schedule(day_items, start_time_mins, tea_time_mins, lunch_time_mins, afternoon_tea_mins, day_num=1, num_days=1, custom_slides=None):
    """
    Build a FULL DAY schedule with content, exercises, and breaks.

    Key features:
    - Day 1: Registration, Welcome, Introductions, then custom slides (objectives, country overview)
    - Days 2+: Recap & Questions at start
    - Final day: Next steps before wrap-up
    - Max 60 min content sessions
    - Smart placeholders when content runs out
    - Each session includes 'slides' or 'module' field for unified deck building

    custom_slides: dict with 'opening' (Day 1) and 'closing' (Final day) lists
                   Each item is (session_name, duration, slide_files_list)
    """
    MAX_SESSION = 60  # Max minutes for a single content session
    END_OF_DAY = 17 * 60  # 5:00 PM

    # Default custom slides with durations and slide files
    if custom_slides is None:
        custom_slides = {
            'opening': [
                ('Workshop Objectives', 15, ['objectives_slide.md']),
            ],
            'closing': [
                ('Next Steps & Action Planning', 20, ['99_next-steps.md']),
            ]
        }

    # Consolidate consecutive items from same module
    consolidated = []
    i = 0
    while i < len(day_items):
        item = day_items[i]
        mod_num = item['mod_num']
        total_duration = item['duration']
        j = i + 1
        while j < len(day_items) and day_items[j]['mod_num'] == mod_num:
            total_duration += day_items[j]['duration']
            j += 1
        consolidated.append({
            'mod_num': mod_num,
            'duration': total_duration,
            'name': MODULES[mod_num]['name'],
        })
        i = j

    schedule = []
    current_time = start_time_mins
    content_idx = 0

    # Track modules covered for exercise naming
    modules_covered = []

    def add_session(name, duration, module=None, slides=None, is_break=False):
        nonlocal current_time
        start_str = format_time(current_time)
        end_time = current_time + duration
        end_str = format_time(end_time)
        entry = {
            'time': f"{start_str} - {end_str}",
            'session': name,
            'duration': duration
        }
        if module:
            entry['module'] = module
        if slides:
            entry['slides'] = slides
        if is_break:
            entry['type'] = 'break'
        if not is_break:
            entry['speaker'] = ""
        schedule.append(entry)
        current_time = end_time

    def add_content(max_duration):
        """Add content sessions up to max_duration, respecting MAX_SESSION limit."""
        nonlocal content_idx
        time_remaining = max_duration

        while time_remaining > 0 and content_idx < len(consolidated):
            item = consolidated[content_idx]
            # Don't start a new module if we have less than 15 min
            if time_remaining < 15:
                break

            # Calculate session duration
            # If module fits entirely, use full duration
            if item['duration'] <= time_remaining:
                session_duration = item['duration']
            # If module is longer than time remaining, take what we can
            elif item['duration'] <= MAX_SESSION:
                # Module fits in one session but not in remaining time
                # Take what we can, it will continue after break
                session_duration = min(item['duration'], time_remaining)
            else:
                # Module needs multiple sessions
                # If remaining module time after this session would be small (< 20 min),
                # extend this session to avoid awkward tiny follow-ups
                potential_session = min(item['duration'], time_remaining, MAX_SESSION)
                remaining_after = item['duration'] - potential_session
                if 0 < remaining_after < 20:
                    # Extend session to include the small remainder (up to 75 min max)
                    session_duration = min(item['duration'], time_remaining, MAX_SESSION + 15)
                else:
                    session_duration = potential_session

            add_session(item['name'], session_duration, f"m{item['mod_num']}")
            if item['mod_num'] not in modules_covered:
                modules_covered.append(item['mod_num'])

            item['duration'] -= session_duration
            time_remaining -= session_duration

            if item['duration'] <= 0:
                content_idx += 1

        return time_remaining

    def add_placeholder(duration, slot_type='exercise'):
        """Add appropriate placeholder activity."""
        if duration < 10:
            return

        if slot_type == 'exercise' and modules_covered:
            last_mod = modules_covered[-1]
            mod_name = MODULE_SHORT_NAMES.get(last_mod, f'Module {last_mod}')
            add_session(f"Hands-on Practice: {mod_name}", duration)
        elif slot_type == 'group':
            add_session("Group Work & Discussion", duration)
        elif slot_type == 'analysis':
            add_session("Country Data Analysis", duration)
        elif slot_type == 'planning':
            add_session("Action Planning", duration)
        else:
            add_session("Practical Exercises", duration)

    # ═══════════════════════════════════════════════════════════════════════
    # DAY 1: Opening ceremony + custom opening slides
    # ═══════════════════════════════════════════════════════════════════════
    if day_num == 1:
        # Registration (30 min before official start)
        reg_start = start_time_mins - 30
        schedule.append({
            'time': f"{format_time(reg_start)} - {format_time(start_time_mins)}",
            'session': 'Registration',
            'speaker': '',
            'duration': 30
        })

        # Welcome & Opening Remarks (includes agenda slide)
        add_session("Welcome & Opening Remarks", 15, slides=['agenda'])

        # Participant Introductions
        add_session("Participant Introductions", 30)

        # Opening custom slides (objectives, country overview, health priorities)
        for slide_name, slide_duration, slide_files in custom_slides.get('opening', []):
            add_session(slide_name, slide_duration, slides=slide_files)

    # ═══════════════════════════════════════════════════════════════════════
    # DAYS 2+: Recap
    # ═══════════════════════════════════════════════════════════════════════
    else:
        add_session("Recap & Questions", 15, slides=[f'day{day_num}_recap.md'])

    # ═══════════════════════════════════════════════════════════════════════
    # MORNING SESSION (until tea)
    # ═══════════════════════════════════════════════════════════════════════
    time_until_tea = tea_time_mins - current_time
    remaining = add_content(time_until_tea)
    if remaining > 10:
        add_placeholder(remaining, 'exercise')

    # Tea break
    add_session("Tea Break", 15, is_break=True)

    # ═══════════════════════════════════════════════════════════════════════
    # LATE MORNING (until lunch)
    # ═══════════════════════════════════════════════════════════════════════
    time_until_lunch = lunch_time_mins - current_time
    remaining = add_content(time_until_lunch)
    if remaining > 10:
        add_placeholder(remaining, 'exercise')

    # Lunch
    add_session("Lunch", 60, is_break=True)

    # ═══════════════════════════════════════════════════════════════════════
    # AFTERNOON (until afternoon tea)
    # ═══════════════════════════════════════════════════════════════════════
    time_until_pm_tea = afternoon_tea_mins - current_time
    remaining = add_content(time_until_pm_tea)
    if remaining > 10:
        add_placeholder(remaining, 'group')

    # Afternoon tea
    add_session("Afternoon Tea", 15, is_break=True)

    # ═══════════════════════════════════════════════════════════════════════
    # LATE AFTERNOON (until end of day)
    # ═══════════════════════════════════════════════════════════════════════
    time_until_wrapup = END_OF_DAY - 15 - current_time
    remaining = add_content(time_until_wrapup)

    # Fill remaining time with varied activities
    if remaining > 0:
        if remaining > 60:
            # Long time remaining - mix of activities
            add_placeholder(45, 'analysis')
            remaining -= 45
        if remaining > 30:
            add_placeholder(remaining, 'group')
        elif remaining > 10:
            add_placeholder(remaining, 'planning')

    # ═══════════════════════════════════════════════════════════════════════
    # FINAL DAY: Closing slides before wrap-up
    # ═══════════════════════════════════════════════════════════════════════
    if day_num == num_days:
        for slide_name, slide_duration, slide_files in custom_slides.get('closing', []):
            add_session(slide_name, slide_duration, slides=slide_files)

    # Day wrap-up (with slide for non-final days)
    if day_num < num_days:
        add_session("Day Wrap-up & Q&A", 15, slides=[f'day{day_num}_wrapup.md'])
    else:
        add_session("Day Wrap-up & Q&A", 15)

    return schedule


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN WIZARD
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    global MODULES

    # Determine base directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(script_dir)

    # Discover available modules from core_content/
    MODULES = discover_modules(base_dir)
    if not MODULES:
        print("Error: No modules found in core_content/")
        print("Make sure the core_content/ folder exists with module subfolders.")
        sys.exit(1)

    print("\n" + "═" * 70)
    print("              FASTR WORKSHOP SETUP WIZARD")
    print("═" * 70)
    print("\nI'll help you set up your workshop step by step.")
    print("All responses are saved to files you can edit later.\n")

    # ─────────────────────────────────────────────────────────────────────────
    # STEP 1: Basic Info
    # ─────────────────────────────────────────────────────────────────────────
    print("─" * 70)
    print("STEP 1: Basic Information")
    print("─" * 70 + "\n")

    country = get_input("   Country name")
    location = get_input(f"   City/Location", country)
    date_str = get_input("   Workshop dates (e.g., 'January 15-17, 2025')")
    facilitators = get_input("   Facilitator(s)", "TBD")

    # Generate workshop ID
    suggested_id = create_workshop_id(country)
    workshop_id = get_input(f"   Workshop folder name", suggested_id)
    workshop_id = re.sub(r'[^a-z0-9_-]', '-', workshop_id.lower())

    # Check if folder exists
    workshop_dir = os.path.join(base_dir, "workshops", workshop_id)
    if os.path.exists(workshop_dir):
        print(f"\n   ⚠️  workshops/{workshop_id}/ already exists!")
        overwrite = input("   Overwrite? [y/N]: ").strip().lower()
        if overwrite != 'y':
            print("\n   Cancelled. Choose a different name.\n")
            sys.exit(0)
        shutil.rmtree(workshop_dir)

    # ─────────────────────────────────────────────────────────────────────────
    # STEP 2: Schedule
    # ─────────────────────────────────────────────────────────────────────────
    print("\n" + "─" * 70)
    print("STEP 2: Workshop Schedule")
    print("─" * 70 + "\n")

    print("   How many days is your workshop?")
    print("     1 = One day (condensed)")
    print("     2 = Two days (standard)")
    print("     3 = Three days (comprehensive)")
    print("     4+ = Extended workshop\n")

    days_input = get_input("   Number of days", "2")
    try:
        num_days = max(1, min(5, int(days_input)))
    except:
        num_days = 2

    start_time = get_input("   Start time each day", "9:00 AM")
    tea_time = get_input("   Morning tea break", "10:30 AM")
    lunch_time = get_input("   Lunch time", "12:30 PM")
    afternoon_tea = get_input("   Afternoon tea", "3:30 PM")

    # Parse times
    start_time_mins = parse_time(start_time)
    tea_time_mins = parse_time(tea_time)
    lunch_time_mins = parse_time(lunch_time)
    afternoon_tea_mins = parse_time(afternoon_tea)

    # ─────────────────────────────────────────────────────────────────────────
    # STEP 3: Content Selection
    # ─────────────────────────────────────────────────────────────────────────
    print("\n" + "─" * 70)
    print("STEP 3: Module Selection")
    print("─" * 70 + "\n")

    print("   Which modules do you want to include?\n")

    defaults = []
    for num in sorted(MODULES.keys()):
        mod = MODULES[num]
        mark = "*" if mod['default'] else " "
        topics_info = f"{mod['topics']} topics" if mod['topics'] != 1 else "1 topic"
        print(f"   [{mark}] {num}. {mod['name']}")
        print(f"       ({topics_info}, ~{mod['duration']} min)")
        if mod['default']:
            defaults.append(str(num))

    default_str = ",".join(defaults)
    print(f"\n   (* = recommended for standard workshop)")
    print(f"   (or type 'all' for all modules)")

    modules_input = get_input(f"\n   Enter module numbers (comma-separated)", default_str)

    # Handle "all" shortcut
    if modules_input.lower().strip() in ('all', '*'):
        selected_modules = list(MODULES.keys())
    else:
        selected_modules = []
        for m in modules_input.split(','):
            m = m.strip()
            if m.isdigit() and int(m) in MODULES:
                selected_modules.append(int(m))

    if not selected_modules:
        selected_modules = [int(d) for d in defaults]
        print(f"   Using defaults: {selected_modules}")

    # ─────────────────────────────────────────────────────────────────────────
    # STEP 4: Daily Assignment
    # ─────────────────────────────────────────────────────────────────────────
    print("\n" + "─" * 70)
    print("STEP 4: Daily Schedule")
    print("─" * 70 + "\n")

    # Auto-assign modules to days (splits long modules automatically)
    days_assignment, split_modules = auto_assign_modules_to_days(selected_modules, num_days)

    print("   Suggested schedule (each day is 9:00 AM - 5:00 PM):\n")
    if split_modules:
        split_names = [f"m{m} ({MODULES[m]['short']})" for m in sorted(split_modules)]
        print(f"   Note: Long modules auto-split across days: {', '.join(split_names)}\n")

    for day, items in days_assignment.items():
        # Get unique module names (consolidate split topics)
        seen_mods = set()
        labels = []
        for item in items:
            mod_num = item['mod_num']
            if mod_num not in seen_mods:
                seen_mods.add(mod_num)
                labels.append(MODULES[mod_num]['short'])
        print(f"   Day {day}: {', '.join(labels)}")

    adjust = input("\n   Adjust this schedule? [y/N]: ").strip().lower()

    if adjust == 'y':
        print("\n   (Enter module numbers or topic IDs like: 0,1,m3_1,m3_2)")
        for day in range(1, num_days + 1):
            current = ','.join(item['id'] for item in days_assignment[day])
            new_input = input(f"   Day {day} [{current}]: ").strip()
            if new_input:
                new_items = []
                for item_str in new_input.split(','):
                    item_str = item_str.strip()
                    # Handle module number (e.g., "3") or prefix (e.g., "m3") or topic (e.g., "m3_1")
                    if item_str.isdigit():
                        mod_num = int(item_str)
                        if mod_num in MODULES:
                            new_items.append({
                                'id': f'm{mod_num}',
                                'duration': MODULES[mod_num]['duration'],
                                'mod_num': mod_num,
                                'label': MODULES[mod_num]['short'],
                            })
                    elif item_str.startswith('m'):
                        # Could be m3 or m3_1
                        if '_' in item_str:
                            # Topic ID like m3_1
                            parts = item_str.split('_')
                            mod_num = int(parts[0][1:])
                            if mod_num in MODULES:
                                new_items.append({
                                    'id': item_str,
                                    'duration': MINUTES_PER_TOPIC,
                                    'mod_num': mod_num,
                                    'label': item_str,
                                })
                        else:
                            # Module prefix like m3
                            mod_num = int(item_str[1:])
                            if mod_num in MODULES:
                                new_items.append({
                                    'id': item_str,
                                    'duration': MODULES[mod_num]['duration'],
                                    'mod_num': mod_num,
                                    'label': MODULES[mod_num]['short'],
                                })
                if new_items:
                    days_assignment[day] = new_items

    # ─────────────────────────────────────────────────────────────────────────
    # STEP 5: Country Data
    # ─────────────────────────────────────────────────────────────────────────
    # STEP 5: Workshop Content
    # ─────────────────────────────────────────────────────────────────────────
    print("\n" + "─" * 70)
    print("STEP 5: Workshop Content (optional)")
    print("─" * 70 + "\n")
    print("   Press Enter for defaults - edit the .md files in your workshop folder later.\n")

    # Objectives
    print("   Workshop objectives (enter each objective, empty line to finish):")
    print("   Example: 'Understand FASTR methodology'\n")
    objectives = []
    while True:
        obj = input(f"   Objective {len(objectives)+1}: ").strip()
        if not obj:
            break
        objectives.append(obj)
    if not objectives:
        objectives = [
            "Understand the FASTR approach to routine data analysis",
            "Learn to assess and adjust for data quality issues",
            "Apply methods to analyze service utilization and coverage",
            "Practice interpreting and communicating results"
        ]

    # Next steps
    print("\n   Next steps / action items (enter each, empty line to finish):")
    print("   Example: 'Conduct monthly data review meetings'\n")
    next_steps = []
    while True:
        ns = input(f"   Action {len(next_steps)+1}: ").strip()
        if not ns:
            break
        next_steps.append(ns)
    if not next_steps:
        next_steps = [
            "Apply FASTR methods to your country data",
            "Share findings with stakeholders",
            "Establish regular data review processes",
            "Identify areas for data quality improvement"
        ]

    # ─────────────────────────────────────────────────────────────────────────
    # BUILD CONFIG
    # ─────────────────────────────────────────────────────────────────────────
    print("\n" + "─" * 70)
    print("Creating workshop...")
    print("─" * 70 + "\n")

    # Build full unified schedule (combines agenda + deck_order)
    daily_schedules = {}
    for day, items in days_assignment.items():
        daily_schedules[day] = build_daily_schedule(
            items, start_time_mins, tea_time_mins, lunch_time_mins, afternoon_tea_mins,
            day_num=day, num_days=num_days
        )

    # Build config
    config = {
        'workshop': {
            'id': workshop_id,
            'name': f"FASTR Workshop - {country}",
            'country': country,
            'location': location,
            'date': date_str,
            'facilitators': facilitators,
            'contact_email': 'fastr@worldbank.org',
        },
        'schedule': {
            'days': num_days,
            'start_time': start_time,
            'tea_time': tea_time,
            'lunch_time': lunch_time,
            'afternoon_tea': afternoon_tea,
            # Daily schedules are added below as day1, day2, etc.
        },
        'content': {
            'modules': selected_modules,
            'custom_slides': [
                '99_next-steps.md',
            ]
        },
        # Country-specific data for {{variable}} substitution in slides
        'country_data': {
            'LOCATION': location,
            'COUNTRY': country,
            'WORKSHOP_NAME': f"FASTR Workshop - {country}",
            'DATE': date_str,
            'FACILITATORS': facilitators,
        },
        # Workshop content
        'workshop_content': {
            'objectives': objectives,
            'next_steps': next_steps,
        }
    }

    # Create workshop folder
    os.makedirs(workshop_dir, exist_ok=True)

    # Write YAML config with helpful comments
    config_path = os.path.join(workshop_dir, "workshop.yaml")
    with open(config_path, 'w') as f:
        f.write(f"""# ═══════════════════════════════════════════════════════════════════════
# WORKSHOP CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════
# Edit this file to customize your workshop.
# After editing, rebuild with: python3 tools/02_build_deck.py
# ═══════════════════════════════════════════════════════════════════════

workshop:
  id: {workshop_id}
  name: {config['workshop']['name']}
  country: {country}
  location: {location}
  date: {date_str}
  facilitators: {facilitators}
  contact_email: fastr@worldbank.org
  objectives:
""" + '\n'.join([f'    - "{obj}"' for obj in objectives]) + """

# ───────────────────────────────────────────────────────────────────────
# SCHEDULE
# ───────────────────────────────────────────────────────────────────────
# To change session times: edit the 'time' field for each item
# To add a session: copy an existing item and modify it
# To remove a session: delete the entire item (time + session + duration)
# Break types: add 'type: break' to show in italics on agenda
# ───────────────────────────────────────────────────────────────────────

schedule:
  days: {num_days}
  start_time: "{start_time}"
  tea_time: "{tea_time}"
  lunch_time: "{lunch_time}"
  afternoon_tea: "{afternoon_tea}"

  # ─────────────────────────────────────────────────────────────────────
  # OPTIONAL SESSIONS - Uncomment and customize as needed
  # ─────────────────────────────────────────────────────────────────────
  # Copy any of these into your day1/day2/etc schedule:
  #
  # OPENING CEREMONY (Day 1)
  #   - time: "8:50 AM - 9:00 AM"
  #     session: Welcome to Country / Opening Prayer
  #     duration: 10
  #   - time: "9:00 AM - 9:15 AM"
  #     session: Opening Remarks (Host Organization)
  #     duration: 15
  #   - time: "9:15 AM - 9:30 AM"
  #     session: Ministerial Address
  #     duration: 15
  #   - time: "9:30 AM - 9:45 AM"
  #     session: Participant Introductions
  #     duration: 15
  #
  # GUEST SPEAKERS / PRESENTATIONS
  #   - time: "2:00 PM - 2:30 PM"
  #     session: "Guest Speaker: [Name, Title]"
  #     duration: 30
  #   - time: "2:30 PM - 3:00 PM"
  #     session: "Country Presentation: [Topic]"
  #     duration: 30
  #   - time: "3:00 PM - 3:30 PM"
  #     session: Panel Discussion
  #     duration: 30
  #
  # ACTIVITIES
  #   - time: "9:30 AM - 9:45 AM"
  #     session: Icebreaker Activity
  #     duration: 15
  #   - time: "12:00 PM"
  #     session: Group Photo
  #     duration: 10
  #   - time: "4:30 PM - 4:45 PM"
  #     session: Daily Reflection & Feedback
  #     duration: 15
  #
  # CLOSING CEREMONY (Final Day)
  #   - time: "3:00 PM - 3:30 PM"
  #     session: Participant Presentations
  #     duration: 30
  #   - time: "3:30 PM - 4:00 PM"
  #     session: Certificate Ceremony
  #     duration: 30
  #   - time: "4:00 PM - 4:15 PM"
  #     session: Closing Remarks
  #     duration: 15
  # ─────────────────────────────────────────────────────────────────────

""")
        # Write each day's schedule directly under schedule (unified structure)
        for day_num_key in sorted(daily_schedules.keys()):
            day_items = daily_schedules[day_num_key]
            f.write(f"\n  day{day_num_key}:\n")
            # Add hints for specific days
            if day_num_key == 1:
                f.write(f"    # ─── DAY 1: Opening ───\n")
            elif day_num_key == num_days:
                f.write(f"    # ─── DAY {day_num_key}: Final Day ───\n")
            else:
                f.write(f"    # ─── DAY {day_num_key} ───\n")

            for item in day_items:
                f.write(f"    - time: \"{item['time']}\"\n")
                # Quote session names to handle colons and special chars
                session_name = item['session'].replace('"', '\\"')
                f.write(f"      session: \"{session_name}\"\n")

                # Module field (for content sessions)
                if 'module' in item:
                    f.write(f"      module: {item['module']}\n")

                # Slides field (for custom slides)
                if 'slides' in item and item['slides']:
                    if len(item['slides']) == 1:
                        f.write(f"      slides: [{item['slides'][0]}]\n")
                    else:
                        f.write(f"      slides:\n")
                        for slide in item['slides']:
                            f.write(f"        - {slide}\n")

                # Break type
                if item.get('type') == 'break':
                    f.write(f"      type: break\n")

                # Speaker field for non-break items
                if not item.get('type') == 'break':
                    speaker = item.get('speaker', '')
                    f.write(f"      speaker: \"{speaker}\"\n")

                f.write(f"      duration: {item['duration']}\n")

        # Write template for adding extra days
        next_day = num_days + 1
        f.write(f"""
  # ─────────────────────────────────────────────────────────────────────
  # TO ADD A DAY: Uncomment the template below and customize
  # ─────────────────────────────────────────────────────────────────────
  # 1. Change 'days: {num_days}' above to 'days: {next_day}'
  # 2. Uncomment day{next_day} below and edit sessions
  # 3. Create slide files: day{num_days}_wrapup.md, day{next_day}_recap.md
  # ─────────────────────────────────────────────────────────────────────
  #
  # day{next_day}:
  #   # ─── DAY {next_day} ───
  #   - time: "9:00 AM - 9:15 AM"
  #     session: "Recap & Questions"
  #     slides: [day{next_day}_recap.md]
  #     duration: 15
  #   - time: "9:15 AM - 10:30 AM"
  #     session: "[Module Name]"
  #     module: m7
  #     duration: 75
  #   - time: "10:30 AM - 10:45 AM"
  #     session: "Tea Break"
  #     type: break
  #     duration: 15
  #   - time: "10:45 AM - 12:30 PM"
  #     session: "[Session Name]"
  #     duration: 105
  #   - time: "12:30 PM - 1:30 PM"
  #     session: "Lunch"
  #     type: break
  #     duration: 60
  #   - time: "1:30 PM - 3:30 PM"
  #     session: "Group Work"
  #     duration: 120
  #   - time: "3:30 PM - 3:45 PM"
  #     session: "Afternoon Tea"
  #     type: break
  #     duration: 15
  #   - time: "3:45 PM - 4:45 PM"
  #     session: "[Session Name]"
  #     duration: 60
  #   - time: "4:45 PM - 5:00 PM"
  #     session: "Day Wrap-up"
  #     slides: [day{next_day}_wrapup.md]
  #     duration: 15

# ───────────────────────────────────────────────────────────────────────
# CONTENT - Module selection and custom slides
# ───────────────────────────────────────────────────────────────────────
# The schedule above controls what slides appear in the deck:
#   - 'module: m0'     → All slides from that module
#   - 'slides: [...]'  → Specific custom slide files
#   - 'type: break'    → Generates a break slide
#
# CUSTOM SLIDES (edit these in your workshop folder):
#   99_next-steps.md   - Action items (at end)
# Note: Objectives are defined in workshop.objectives above
#
# TO MOVE CONTENT: Cut and paste sessions between days
# TO ADD A BREAK: Add a session with 'type: break'
# TO ADD CUSTOM SLIDE: Add 'slides: [filename.md]' to a session
# ───────────────────────────────────────────────────────────────────────

content:
  modules: {selected_modules}
  custom_slides:
    - 99_next-steps.md

# ───────────────────────────────────────────────────────────────────────
# COUNTRY DATA - Variables for {{{{placeholder}}}} substitution
# ───────────────────────────────────────────────────────────────────────
# These values replace {{{{variable_name}}}} in your slides.
# Example: {{{{LOCATION}}}} becomes "Lusaka"
# ───────────────────────────────────────────────────────────────────────

country_data:
  LOCATION: "{location}"
  COUNTRY: "{country}"
  WORKSHOP_NAME: "{config['workshop']['name']}"
  DATE: "{date_str}"
  FACILITATORS: "{facilitators}"
""")
    print(f"   ✓ workshop.yaml")

    # Generate custom slides with user content
    # 99_next-steps.md
    ns_bullets = '\n'.join([f"- {ns}" for ns in next_steps])
    nextsteps_content = f"""---
marp: true
theme: fastr
paginate: true
---

# Next Steps

## Action items

{ns_bullets}

---
"""
    with open(os.path.join(workshop_dir, "99_next-steps.md"), 'w') as f:
        f.write(nextsteps_content)
    print(f"   ✓ 99_next-steps.md")

    # Generate session slides for each day
    for day in range(1, num_days + 1):
        # Get unique module names for this day (preserve order, deduplicate)
        seen = set()
        day_modules = []
        for item in days_assignment[day]:
            name = MODULES[item['mod_num']]['name']
            if name not in seen:
                seen.add(name)
                day_modules.append(name)
        day_modules_list = '\n'.join([f"- {m}" for m in day_modules])

        if day > 1:
            # Get unique module names for previous day
            seen = set()
            prev_day_modules = []
            for item in days_assignment[day - 1]:
                name = MODULES[item['mod_num']]['name']
                if name not in seen:
                    seen.add(name)
                    prev_day_modules.append(name)
            prev_modules_list = '\n'.join([f"- {m}" for m in prev_day_modules])

            # Recap slide for days 2+
            recap_content = f"""---
marp: true
theme: fastr
paginate: true
---

# Day {day}: Recap & Questions

## Yesterday we covered:

{prev_modules_list}

---

## Questions & Discussion

- Any questions from yesterday's sessions?
- Points that need clarification?
- Insights from the exercises?

---
"""
            with open(os.path.join(workshop_dir, f"day{day}_recap.md"), 'w') as f:
                f.write(recap_content)
            print(f"   ✓ day{day}_recap.md")

        if day < num_days:
            # Get unique module names for next day preview
            seen = set()
            next_day_modules = []
            for item in days_assignment[day + 1]:
                name = MODULES[item['mod_num']]['name']
                if name not in seen:
                    seen.add(name)
                    next_day_modules.append(name)
            next_modules_short = ', '.join(next_day_modules[:3])
            if len(next_day_modules) > 3:
                next_modules_short += ', ...'

            # Wrap-up slide for non-final days
            wrapup_content = f"""---
marp: true
theme: fastr
paginate: true
---

# See You Tomorrow!

## Day {day} Complete

We covered today:

{day_modules_list}

---

## Tomorrow: Day {day + 1}

We resume at **{start_time}**

**Coming up:** {next_modules_short}

---
"""
            with open(os.path.join(workshop_dir, f"day{day}_wrapup.md"), 'w') as f:
                f.write(wrapup_content)
            print(f"   ✓ day{day}_wrapup.md")

    # Copy remaining templates from custom_slides
    templates_dir = os.path.join(base_dir, "templates", "custom_slides")
    if os.path.exists(templates_dir):
        for tmpl in Path(templates_dir).glob("*.md"):
            # Skip ones we already generated
            if tmpl.name in ['99_next-steps.md']:
                continue
            dest = os.path.join(workshop_dir, tmpl.name)
            if not os.path.exists(dest):
                shutil.copy2(tmpl, dest)
                print(f"   ✓ {tmpl.name}")

    # Create media folders
    media_dir = os.path.join(workshop_dir, "media")
    os.makedirs(os.path.join(media_dir, "outputs"), exist_ok=True)
    print(f"   ✓ media/outputs/")

    # Create README
    readme = f"""# {config['workshop']['name']}

**Location:** {location}
**Date:** {date_str}
**Facilitators:** {facilitators}

## Files

- `workshop.yaml` - Workshop configuration (modules, schedule, etc.)
- Custom slides to edit:
  - `objectives.md` - Workshop objectives
  - `country-overview.md` - Country context
  - `health-priorities.md` - Health priorities
  - `next-steps.md` - Action items

## Build Your Deck

```bash
# Build the deck (validates automatically)
python3 tools/02_build_deck.py --workshop {workshop_id}

# Convert to PowerPoint (optional)
python3 tools/03_convert_pptx.py outputs/{workshop_id}_deck.md
```

## Country Outputs

Add your FASTR platform outputs to `media/outputs/` to include them in slides.
"""
    readme_path = os.path.join(workshop_dir, "README.md")
    with open(readme_path, 'w') as f:
        f.write(readme)
    print(f"   ✓ README.md")

    # ─────────────────────────────────────────────────────────────────────────
    # SUCCESS
    # ─────────────────────────────────────────────────────────────────────────
    print("\n" + "═" * 70)
    print("                    SUCCESS!")
    print("═" * 70)
    print(f"\n   Workshop created: workshops/{workshop_id}/")

    print(f"\n   Files you can edit:")
    print(f"   ─────────────────────────────────────────────────────")
    print(f"   workshop.yaml          → Schedule, modules, objectives, country data")
    print(f"   99_next-steps.md       → Action items")
    print(f"   media/outputs/         → Add FASTR charts here")

    print(f"\n   To build your deck:")
    print(f"   python3 tools/02_build_deck.py --workshop {workshop_id}")
    print("\n" + "═" * 70 + "\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled.\n")
        sys.exit(0)
