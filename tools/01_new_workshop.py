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
                    # Extract topic ID from filename (e.g., "m3_1_overview.md" -> "m3_1")
                    match = re.match(r'^(m\d+_\d+)', f)
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

def get_input(prompt, default=None):
    """Get user input with optional default."""
    if default:
        result = input(f"{prompt} [{default}]: ").strip()
        return result if result else default
    else:
        while True:
            result = input(f"{prompt}: ").strip()
            if result:
                return result
            print("   This field is required.")


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


def build_daily_schedule(day_items, start_time_mins, tea_time_mins, lunch_time_mins, afternoon_tea_mins, day_num=1):
    """
    Build a FULL DAY schedule (9 AM - 5 PM) with content, exercises, and breaks.
    Consolidates consecutive topics from the same module into single entries.

    Args:
        day_items: list of dicts with 'id', 'duration', 'mod_num', 'label'
        day_num: which day (1, 2, etc.) for labeling
    """
    END_OF_DAY = 17 * 60  # 5:00 PM in minutes

    # First, consolidate consecutive items from the same module
    consolidated = []
    i = 0
    while i < len(day_items):
        item = day_items[i]
        mod_num = item['mod_num']
        total_duration = item['duration']

        # Look ahead for more items from same module
        j = i + 1
        while j < len(day_items) and day_items[j]['mod_num'] == mod_num:
            total_duration += day_items[j]['duration']
            j += 1

        # Create consolidated entry
        consolidated.append({
            'mod_num': mod_num,
            'duration': total_duration,
            'name': MODULES[mod_num]['name'],
        })
        i = j

    schedule = []
    current_time = start_time_mins
    content_idx = 0

    # Morning session until tea
    while current_time < tea_time_mins and content_idx < len(consolidated):
        item = consolidated[content_idx]
        duration = min(item['duration'], tea_time_mins - current_time)

        start_str = format_time(current_time)
        end_time = current_time + duration
        end_str = format_time(end_time)

        schedule.append({
            'time': f"{start_str} - {end_str}",
            'session': item['name'],
            'module': f"m{item['mod_num']}",
            'duration': duration
        })
        current_time = end_time

        # If we used the full duration, move to next item
        if duration >= item['duration']:
            content_idx += 1
        else:
            # Partial - reduce remaining duration
            consolidated[content_idx]['duration'] -= duration

    # Tea break
    tea_end = tea_time_mins + 15
    schedule.append({
        'time': f"{format_time(tea_time_mins)} - {format_time(tea_end)}",
        'session': 'Tea Break',
        'type': 'break',
        'duration': 15
    })
    current_time = tea_end

    # Late morning session until lunch
    while current_time < lunch_time_mins and content_idx < len(consolidated):
        item = consolidated[content_idx]
        duration = min(item['duration'], lunch_time_mins - current_time)

        start_str = format_time(current_time)
        end_time = current_time + duration
        end_str = format_time(end_time)

        schedule.append({
            'time': f"{start_str} - {end_str}",
            'session': item['name'],
            'module': f"m{item['mod_num']}",
            'duration': duration
        })
        current_time = end_time

        if duration >= item['duration']:
            content_idx += 1
        else:
            consolidated[content_idx]['duration'] -= duration

    # If time before lunch, add exercises
    if current_time < lunch_time_mins:
        schedule.append({
            'time': f"{format_time(current_time)} - {format_time(lunch_time_mins)}",
            'session': 'Practical Exercises',
            'duration': lunch_time_mins - current_time
        })
        current_time = lunch_time_mins

    # Lunch
    lunch_end = lunch_time_mins + 60
    schedule.append({
        'time': f"{format_time(lunch_time_mins)} - {format_time(lunch_end)}",
        'session': 'Lunch',
        'type': 'break',
        'duration': 60
    })
    current_time = lunch_end

    # Afternoon session until afternoon tea
    while current_time < afternoon_tea_mins and content_idx < len(consolidated):
        item = consolidated[content_idx]
        duration = min(item['duration'], afternoon_tea_mins - current_time)

        start_str = format_time(current_time)
        end_time = current_time + duration
        end_str = format_time(end_time)

        schedule.append({
            'time': f"{start_str} - {end_str}",
            'session': item['name'],
            'module': f"m{item['mod_num']}",
            'duration': duration
        })
        current_time = end_time

        if duration >= item['duration']:
            content_idx += 1
        else:
            consolidated[content_idx]['duration'] -= duration

    # If time before afternoon tea, add exercises
    if current_time < afternoon_tea_mins:
        schedule.append({
            'time': f"{format_time(current_time)} - {format_time(afternoon_tea_mins)}",
            'session': 'Practical Exercises',
            'duration': afternoon_tea_mins - current_time
        })
        current_time = afternoon_tea_mins

    # Afternoon tea
    tea_end = afternoon_tea_mins + 15
    schedule.append({
        'time': f"{format_time(afternoon_tea_mins)} - {format_time(tea_end)}",
        'session': 'Afternoon Tea',
        'type': 'break',
        'duration': 15
    })
    current_time = tea_end

    # Late afternoon until end of day
    while current_time < END_OF_DAY - 15 and content_idx < len(consolidated):
        item = consolidated[content_idx]
        duration = min(item['duration'], END_OF_DAY - 15 - current_time)

        start_str = format_time(current_time)
        end_time = current_time + duration
        end_str = format_time(end_time)

        schedule.append({
            'time': f"{start_str} - {end_str}",
            'session': item['name'],
            'module': f"m{item['mod_num']}",
            'duration': duration
        })
        current_time = end_time

        if duration >= item['duration']:
            content_idx += 1
        else:
            consolidated[content_idx]['duration'] -= duration

    # Fill remaining time with exercises/group work
    if current_time < END_OF_DAY - 15:
        schedule.append({
            'time': f"{format_time(current_time)} - {format_time(END_OF_DAY - 15)}",
            'session': 'Group Work & Discussion',
            'duration': END_OF_DAY - 15 - current_time
        })
        current_time = END_OF_DAY - 15

    # Day wrap-up
    schedule.append({
        'time': f"{format_time(current_time)} - {format_time(END_OF_DAY)}",
        'session': 'Day Wrap-up & Q&A',
        'duration': 15
    })

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
    print("\nI'll help you set up your workshop step by step.\n")

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
    # BUILD CONFIG
    # ─────────────────────────────────────────────────────────────────────────
    print("\n" + "─" * 70)
    print("Creating workshop...")
    print("─" * 70 + "\n")

    # Build full schedule
    daily_schedules = {}
    for day, items in days_assignment.items():
        daily_schedules[f'day{day}'] = build_daily_schedule(
            items, start_time_mins, tea_time_mins, lunch_time_mins, afternoon_tea_mins
        )

    # Build deck_order from all items across all days (preserves split modules)
    deck_order_items = ['agenda']
    for day in range(1, num_days + 1):
        for item in days_assignment[day]:
            deck_order_items.append(item['id'])
    deck_order_items.append('next-steps.md')

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
            'agenda': daily_schedules,
        },
        'content': {
            'modules': selected_modules,
            'deck_order': deck_order_items,
            'custom_slides': [
                'objectives.md',
                'country-overview.md',
                'health-priorities.md',
                'next-steps.md',
            ]
        },
        # Country-specific data for {{variable}} substitution in slides
        # Edit these values to customize your workshop
        'country_data': {
            'total_facilities': '[number of facilities]',
            'facilities_reporting': '[facilities reporting to DHIS2]',
            'reporting_rate': '[XX%]',
            'total_population': '[X million]',
            'women_reproductive_age': '[X million]',
            'under5_population': '[X million]',
            'expected_pregnancies': '[X per year]',
            'expected_births': '[X per year]',
            'last_survey': '[DHS YYYY or MICS YYYY]',
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

  agenda:
""")
        # Write each day's schedule
        for day_key, day_items in daily_schedules.items():
            f.write(f"    {day_key}:\n")
            # Add a hint for day 1 about optional opening sessions
            if day_key == 'day1':
                f.write(f"      # TIP: Add opening ceremony items here (see optional sessions above)\n")
            for item in day_items:
                f.write(f"      - time: \"{item['time']}\"\n")
                f.write(f"        session: {item['session']}\n")
                if 'module' in item:
                    f.write(f"        module: {item['module']}\n")
                if item.get('type') == 'break':
                    f.write(f"        type: break\n")
                f.write(f"        duration: {item['duration']}\n")

        f.write(f"""
# ───────────────────────────────────────────────────────────────────────
# CONTENT - What slides appear in the deck
# ───────────────────────────────────────────────────────────────────────
# deck_order controls what appears and in what order:
#   - 'agenda'          → Generated agenda slide(s)
#   - 'm0', 'm1'        → All slides from that module
#   - 'm3_1'            → Single topic (for splitting long modules)
#   - '01_objectives.md' → Custom slide from this workshop folder
#
# CUSTOM SLIDES (edit these in your workshop folder):
#   01_objectives.md       - Workshop objectives (after agenda)
#   02_country-overview.md - Country context (before data modules)
#   03_health-priorities.md - Health priorities to focus on
#   04_coverage-results.md - Coverage analysis results
#   05_disruption-local.md - Local disruption analysis
#   06_dq-findings.md      - Data quality findings
#   99_next-steps.md       - Action items (at end)
#
# TO MOVE A SLIDE: Cut and paste it to a new position in deck_order
# TO REMOVE: Delete the line from deck_order (file stays for later use)
# TO ADD NEW: Create a .md file and add it to deck_order
# ───────────────────────────────────────────────────────────────────────

content:
  modules: {selected_modules}
  deck_order:
    - agenda
    - 01_objectives.md        # Workshop goals
""")
        # Add country overview after intro if m0 is included
        if 0 in selected_modules:
            f.write(f"    - m0\n")
        f.write(f"    - 02_country-overview.md  # Country context\n")
        f.write(f"    - 03_health-priorities.md # Focus areas\n")

        # Add remaining modules
        for item in deck_order_items:
            if item not in ['agenda', 'm0', 'next-steps.md']:
                f.write(f"    - {item}\n")

        f.write(f"    - 99_next-steps.md        # Action items\n")

        f.write(f"""
  custom_slides:
    - 01_objectives.md
    - 02_country-overview.md
    - 03_health-priorities.md
    - 04_coverage-results.md
    - 05_disruption-local.md
    - 06_dq-findings.md
    - 99_next-steps.md

# ───────────────────────────────────────────────────────────────────────
# COUNTRY DATA - Variables for {{{{placeholder}}}} substitution
# ───────────────────────────────────────────────────────────────────────
# These values replace {{{{variable_name}}}} in your slides.
# Example: {{{{total_population}}}} becomes "45 million"
# Edit the values below with your country's data.
# ───────────────────────────────────────────────────────────────────────

country_data:
  total_facilities: "[number of facilities]"
  facilities_reporting: "[facilities reporting to DHIS2]"
  reporting_rate: "[XX%]"
  total_population: "[X million]"
  women_reproductive_age: "[X million]"
  under5_population: "[X million]"
  expected_pregnancies: "[X per year]"
  expected_births: "[X per year]"
  last_survey: "[DHS YYYY or MICS YYYY]"
""")
    print(f"   ✓ workshop.yaml")

    # Copy custom slide templates
    templates_dir = os.path.join(base_dir, "templates", "custom_slides")
    if os.path.exists(templates_dir):
        for tmpl in Path(templates_dir).glob("*.md"):
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
    print(f"\n   Next steps:")
    print(f"   1. Edit custom slides in workshops/{workshop_id}/")
    print(f"   2. Add country outputs to workshops/{workshop_id}/media/outputs/")
    print(f"   3. Build: python3 tools/02_build_deck.py --workshop {workshop_id}")
    print("\n" + "═" * 70 + "\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled.\n")
        sys.exit(0)
