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

try:
    import yaml
except ImportError:
    print("Error: PyYAML not installed. Run: pip install pyyaml")
    sys.exit(1)


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════════════

MODULES = {
    0: {'name': 'Introduction to FASTR', 'short': 'Intro', 'duration': 45, 'default': True},
    1: {'name': 'Identify Questions & Indicators', 'short': 'Questions', 'duration': 60, 'default': False},
    2: {'name': 'Data Extraction', 'short': 'Extraction', 'duration': 30, 'default': True},
    3: {'name': 'FASTR Analytics Platform', 'short': 'Platform', 'duration': 90, 'default': False},
    4: {'name': 'Data Quality Assessment', 'short': 'DQA', 'duration': 60, 'default': True},
    5: {'name': 'Data Quality Adjustment', 'short': 'DQ Adjust', 'duration': 45, 'default': True},
    6: {'name': 'Data Analysis', 'short': 'Analysis', 'duration': 60, 'default': True},
    7: {'name': 'Results Communication', 'short': 'Results', 'duration': 60, 'default': False},
}


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


def auto_assign_modules_to_days(selected_modules, num_days):
    """
    Auto-assign modules to days based on duration.
    Tries to balance total time per day.
    """
    # Calculate total duration
    total_duration = sum(MODULES[m]['duration'] for m in selected_modules)
    target_per_day = total_duration / num_days

    days = {d: [] for d in range(1, num_days + 1)}
    day_durations = {d: 0 for d in range(1, num_days + 1)}

    # Assign modules, trying to balance days
    remaining = list(selected_modules)
    current_day = 1

    for mod in remaining:
        duration = MODULES[mod]['duration']

        # Find best day (not exceeding target too much)
        best_day = current_day
        for d in range(1, num_days + 1):
            if day_durations[d] + duration <= target_per_day * 1.2:
                best_day = d
                break

        days[best_day].append(mod)
        day_durations[best_day] += duration

        # Move to next day if current is full
        if day_durations[current_day] >= target_per_day:
            current_day = min(current_day + 1, num_days)

    return days


def build_daily_schedule(day_modules, start_time_mins, tea_time_mins, lunch_time_mins, afternoon_tea_mins):
    """Build a detailed schedule for one day."""
    schedule = []
    current_time = start_time_mins

    # Welcome/recap
    schedule.append({
        'time': format_time(current_time),
        'session': 'Welcome & Introductions',
        'duration': 15
    })
    current_time += 15

    modules_done = 0
    total_modules = len(day_modules)

    for i, mod_num in enumerate(day_modules):
        mod = MODULES[mod_num]

        # Add module
        schedule.append({
            'time': format_time(current_time),
            'session': mod['name'],
            'module': f'm{mod_num}',
            'duration': mod['duration']
        })
        current_time += mod['duration']
        modules_done += 1

        # Check for tea break (after first module if we haven't passed tea time)
        if modules_done == 1 and current_time >= tea_time_mins - 15 and current_time < lunch_time_mins:
            schedule.append({
                'time': format_time(tea_time_mins),
                'session': 'Tea Break',
                'type': 'break',
                'duration': 15
            })
            current_time = tea_time_mins + 15

        # Check for lunch (around midpoint)
        if current_time >= lunch_time_mins - 30 and current_time < lunch_time_mins + 60:
            if modules_done < total_modules:  # Don't add lunch at end
                schedule.append({
                    'time': format_time(lunch_time_mins),
                    'session': 'Lunch',
                    'type': 'break',
                    'duration': 60
                })
                current_time = lunch_time_mins + 60

        # Check for afternoon tea
        if current_time >= afternoon_tea_mins - 15 and modules_done < total_modules:
            schedule.append({
                'time': format_time(afternoon_tea_mins),
                'session': 'Afternoon Tea',
                'type': 'break',
                'duration': 15
            })
            current_time = afternoon_tea_mins + 15

    return schedule


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN WIZARD
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    # Determine base directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(script_dir)

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
    for num, mod in MODULES.items():
        mark = "*" if mod['default'] else " "
        print(f"   [{mark}] {num}. {mod['name']} (~{mod['duration']} min)")
        if mod['default']:
            defaults.append(str(num))

    default_str = ",".join(defaults)
    print(f"\n   (* = recommended for standard workshop)")

    modules_input = get_input(f"\n   Enter module numbers (comma-separated)", default_str)

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

    # Auto-assign modules to days
    days_assignment = auto_assign_modules_to_days(selected_modules, num_days)

    print("   Suggested schedule:\n")
    for day, mods in days_assignment.items():
        mod_names = [MODULES[m]['short'] for m in mods]
        total_mins = sum(MODULES[m]['duration'] for m in mods)
        print(f"   Day {day}: {', '.join(mod_names)} ({total_mins} min)")

    adjust = input("\n   Adjust this schedule? [y/N]: ").strip().lower()

    if adjust == 'y':
        for day in range(1, num_days + 1):
            current = ','.join(str(m) for m in days_assignment[day])
            new_input = input(f"   Day {day} modules [{current}]: ").strip()
            if new_input:
                new_mods = []
                for m in new_input.split(','):
                    m = m.strip()
                    if m.isdigit() and int(m) in MODULES:
                        new_mods.append(int(m))
                if new_mods:
                    days_assignment[day] = new_mods

    # ─────────────────────────────────────────────────────────────────────────
    # BUILD CONFIG
    # ─────────────────────────────────────────────────────────────────────────
    print("\n" + "─" * 70)
    print("Creating workshop...")
    print("─" * 70 + "\n")

    # Build full schedule
    daily_schedules = {}
    for day, mods in days_assignment.items():
        daily_schedules[f'day{day}'] = build_daily_schedule(
            mods, start_time_mins, tea_time_mins, lunch_time_mins, afternoon_tea_mins
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
            'agenda': daily_schedules,
        },
        'content': {
            'modules': selected_modules,
            'deck_order': ['agenda'] + [f'm{m}' for m in selected_modules] + ['next-steps.md'],
            'custom_slides': [
                'objectives.md',
                'country-overview.md',
                'health-priorities.md',
                'next-steps.md',
            ]
        }
    }

    # Create workshop folder
    os.makedirs(workshop_dir, exist_ok=True)

    # Write YAML config
    config_path = os.path.join(workshop_dir, "workshop.yaml")
    with open(config_path, 'w') as f:
        yaml.dump(config, f, default_flow_style=False, sort_keys=False, allow_unicode=True)
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
# Optional: Check setup
python3 tools/02_check_workshop.py {workshop_id}

# Build the deck
python3 tools/03_build_deck.py {workshop_id}

# Convert to PowerPoint (optional)
python3 tools/04_convert_pptx.py {workshop_id}
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
    print(f"   3. Build: python3 tools/03_build_deck.py {workshop_id}")
    print("\n" + "═" * 70 + "\n")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCancelled.\n")
        sys.exit(0)
