#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════
                    FASTR SLIDE DECK BUILDER
═══════════════════════════════════════════════════════════════════════

This script assembles a complete slide deck from:
  1. Title slide (with your workshop details)
  2. Agenda slide (if you have agenda.png)
  3. Core FASTR content (sections you select)
  4. Your custom slides (country-specific content)
  5. Break slides (tea & lunch)
  6. Closing slides (thank you & contact)

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
  - Show you what will be included
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
   ✓ config.py (workshop settings)
   ✓ custom-slides.md (optional - your content)
   ✓ agenda.png (optional - agenda image)

3. Not sure? Look at the example:
   workshops/example/

═══════════════════════════════════════════════════════════════════════
                          OUTPUT
═══════════════════════════════════════════════════════════════════════

After building, you'll get:

  outputs/YOUR-WORKSHOP-NAME_deck.md

This is a markdown file with ALL your content assembled!

Next step: Convert to PDF (recommended) or PowerPoint

  # PDF (recommended):
  marp outputs/YOUR-WORKSHOP-NAME_deck.md --theme-set fastr-theme.css --pdf

  # PowerPoint (alternative):
  python3 tools/convert_to_pptx.py outputs/YOUR-WORKSHOP-NAME_deck.md

═══════════════════════════════════════════════════════════════════════
"""

import argparse
import os
import sys
import importlib.util

# ═══════════════════════════════════════════════════════════════════════
# SECTION DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════
# These are the 7 core FASTR methodology modules available

CORE_SECTIONS = {
    1: "01_background_rationale.md",
    2: "02_fastr_approach.md",
    3: "03_data_extraction.md",
    4: "04_data_quality_assessment.md",
    5: "05_service_utilization.md",
    6: "06_coverage_analysis.md",
    7: "07_facility_assessments.md",
}

SECTION_DESCRIPTIONS = {
    1: "Background & Rationale",
    2: "FASTR Approach",
    3: "Data Extraction",
    4: "Data Quality Assessment",
    5: "Service Utilization",
    6: "Coverage Analysis",
    7: "Facility Assessments",
}


# ═══════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def list_available_workshops(base_dir):
    """
    Show all available workshop folders

    Looks in workshops/ directory and lists folders that have config.py
    """
    workshops_dir = os.path.join(base_dir, "workshops")

    if not os.path.exists(workshops_dir):
        print(f"❌ Error: workshops/ folder not found!")
        print(f"   Are you running this from the repository root?")
        return []

    workshops = []
    for item in os.listdir(workshops_dir):
        item_path = os.path.join(workshops_dir, item)
        config_path = os.path.join(item_path, "config.py")

        # Only include if it's a directory with config.py
        if os.path.isdir(item_path) and os.path.exists(config_path):
            workshops.append(item)

    return sorted(workshops)


def prompt_for_workshop(base_dir):
    """
    Interactive mode: Ask user which workshop to build

    Shows list of available workshops and lets user choose
    """
    print("\n" + "═" * 70)
    print("                    AVAILABLE WORKSHOPS")
    print("═" * 70 + "\n")

    workshops = list_available_workshops(base_dir)

    if not workshops:
        print("❌ No workshops found!")
        print("\n💡 To create a workshop:")
        print("   1. Copy workshops/example/ to workshops/YOUR-NAME/")
        print("   2. Edit workshops/YOUR-NAME/config.py")
        print("   3. Run this script again")
        sys.exit(1)

    for i, workshop in enumerate(workshops, 1):
        print(f"  {i}. {workshop}")

    print(f"\n  Total: {len(workshops)} workshop(s) available")
    print("\n" + "─" * 70)

    while True:
        try:
            choice = input("\nWhich workshop do you want to build? (enter number or name): ").strip()

            # Try as number first
            if choice.isdigit():
                idx = int(choice) - 1
                if 0 <= idx < len(workshops):
                    return workshops[idx]

            # Try as name
            if choice in workshops:
                return choice

            print(f"❌ Invalid choice. Please enter 1-{len(workshops)} or a workshop name.")

        except KeyboardInterrupt:
            print("\n\n👋 Cancelled by user")
            sys.exit(0)


def load_workshop_config(workshop_id, base_dir):
    """
    Load the config.py file from a workshop folder

    This reads the workshop settings like name, date, location, etc.
    """
    config_path = os.path.join(base_dir, "workshops", workshop_id, "config.py")

    if not os.path.exists(config_path):
        print(f"\n❌ Error: Workshop config not found!")
        print(f"   Looking for: {config_path}")
        print(f"\n💡 Make sure:")
        print(f"   1. Workshop folder exists: workshops/{workshop_id}/")
        print(f"   2. It contains: config.py")
        print(f"\n💡 Try copying the example:")
        print(f"   cp -r workshops/example workshops/{workshop_id}")
        sys.exit(1)

    # Load config as module
    spec = importlib.util.spec_from_file_location("workshop_config", config_path)
    config_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(config_module)

    return config_module.WORKSHOP_CONFIG


def substitute_variables(content, config):
    """
    Replace {{VARIABLE}} placeholders with actual values

    Example: {{WORKSHOP_NAME}} becomes "FASTR Workshop - Nigeria"
    """
    replacements = {
        'WORKSHOP_ID': config.get('workshop_id', ''),
        'WORKSHOP_NAME': config.get('name', ''),
        'DATE': config.get('date', ''),
        'LOCATION': config.get('location', ''),
        'FACILITATORS': config.get('facilitators', ''),
        'CONTACT_EMAIL': config.get('contact_email', ''),
        'WEBSITE': config.get('website', ''),
        'TEA_RESUME_TIME': config.get('tea_resume_time', ''),
        'LUNCH_RESUME_TIME': config.get('lunch_resume_time', ''),
    }

    result = content
    for var, value in replacements.items():
        pattern = f'{{{{{var}}}}}'
        result = result.replace(pattern, value)

    return result


def read_markdown_file(filepath):
    """Read a markdown file and return its content"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        return content
    except FileNotFoundError:
        print(f"⚠️  Warning: File not found: {filepath}")
        return ""


def strip_frontmatter(content):
    """
    Remove YAML frontmatter from markdown content

    We only want ONE frontmatter block at the top of the final deck,
    so we strip it from all individual files we're combining
    """
    lines = content.split('\n')
    if lines[0].strip() == '---':
        # Find the end of frontmatter
        end_idx = None
        for i in range(1, len(lines)):
            if lines[i].strip() == '---':
                end_idx = i
                break
        if end_idx:
            return '\n'.join(lines[end_idx+1:])
    return content


def preview_build_plan(config, base_dir):
    """
    Show what will be included in the deck BEFORE building

    This helps users verify they selected the right content
    """
    print("\n" + "═" * 70)
    print("                    BUILD PREVIEW")
    print("═" * 70)

    print(f"\n📋 Workshop: {config.get('name', 'Unknown')}")
    print(f"   Date: {config.get('date', 'Not set')}")
    print(f"   Location: {config.get('location', 'Not set')}")

    print(f"\n📄 Components that will be included:")

    # Title slide
    print(f"   ✓ Title slide")

    # Agenda
    if config.get('include_agenda', False):
        print(f"   ✓ Agenda slide")

    # Core sections
    sections = config.get('sections', [])
    if sections:
        print(f"\n📚 Core FASTR content ({len(sections)} sections):")
        for num in sorted(sections):
            if num in SECTION_DESCRIPTIONS:
                print(f"   ✓ {num}. {SECTION_DESCRIPTIONS[num]}")

    # Breaks
    if config.get('include_breaks', False):
        print(f"\n☕ Break slides:")
        print(f"   ✓ Tea break (resume at {config.get('tea_resume_time', 'TBD')})")
        print(f"   ✓ Lunch break (resume at {config.get('lunch_resume_time', 'TBD')})")

    # Custom slides
    custom_slides = config.get('custom_slides', [])
    if custom_slides:
        print(f"\n📁 Custom slides:")
        for slide in custom_slides:
            print(f"   ✓ {slide}")

    # Closing
    if config.get('include_closing', True):
        print(f"\n👋 Closing slides:")
        print(f"   ✓ Thank you")
        print(f"   ✓ Contact information")

    print("\n" + "─" * 70)


def build_workshop_deck(workshop_id, base_dir, output_file=None, skip_confirmation=False):
    """
    MAIN FUNCTION: Build a complete slide deck for a workshop

    This is the "chef" that assembles all the ingredients!
    """

    print("\n" + "═" * 70)
    print(f"       BUILDING WORKSHOP: {workshop_id}")
    print("═" * 70)

    # Step 1: Load the workshop configuration
    print("\n📖 Step 1: Reading workshop configuration...")
    config = load_workshop_config(workshop_id, base_dir)
    print("   ✓ Config loaded successfully")

    # Step 2: Show what will be built
    preview_build_plan(config, base_dir)

    # Step 3: Confirm with user (unless skipped for command-line mode)
    if not skip_confirmation:
        print("\n" + "─" * 70)
        response = input("\n➤ Proceed with build? [Y/n]: ").strip().lower()
        if response and response not in ['y', 'yes']:
            print("\n👋 Build cancelled")
            sys.exit(0)

    # Step 4: Set output filename
    if not output_file:
        output_file = f"{workshop_id}_deck.md"

    print(f"\n🔨 Step 2: Assembling deck components...")

    # Start with Marp frontmatter (styling configuration)
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
        # Ensure it ends with slide break
        if not title_content.rstrip().endswith('---'):
            title_content = title_content.rstrip() + "\n\n---\n"
        deck_content += title_content + "\n"
        print(f"   ✓ Title slide added")

    # Add agenda if enabled
    if config.get('include_agenda', False):
        agenda_path = os.path.join(base_dir, "templates", "agenda.md")
        agenda_content = read_markdown_file(agenda_path)
        if agenda_content:
            agenda_content = strip_frontmatter(agenda_content)
            agenda_content = substitute_variables(agenda_content, config)
            # Ensure it ends with slide break
            if not agenda_content.rstrip().endswith('---'):
                agenda_content = agenda_content.rstrip() + "\n\n---\n"
            deck_content += agenda_content + "\n"
            print(f"   ✓ Agenda slide added")

    # Add core sections
    sections = config.get('sections', [])
    if sections:
        print(f"\n📚 Adding core content:")
        core_content_dir = os.path.join(base_dir, "core_content")

        for num in sorted(sections):
            if num in CORE_SECTIONS:
                filepath = os.path.join(core_content_dir, CORE_SECTIONS[num])
                content = read_markdown_file(filepath)
                if content:
                    content = strip_frontmatter(content)
                    content = substitute_variables(content, config)
                    # Ensure it ends with slide break
                    if not content.rstrip().endswith('---'):
                        content = content.rstrip() + "\n\n---\n"
                    deck_content += "\n" + content + "\n"
                    print(f"   ✓ {num}. {SECTION_DESCRIPTIONS[num]}")

    # Add breaks if enabled
    if config.get('include_breaks', False):
        breaks_path = os.path.join(base_dir, "templates", "breaks.md")
        breaks_content = read_markdown_file(breaks_path)
        if breaks_content:
            breaks_content = strip_frontmatter(breaks_content)
            breaks_content = substitute_variables(breaks_content, config)
            # Ensure it ends with slide break
            if not breaks_content.rstrip().endswith('---'):
                breaks_content = breaks_content.rstrip() + "\n\n---\n"
            deck_content += breaks_content + "\n"
            print(f"\n☕ Break slides added")

    # Add custom slides
    custom_slides = config.get('custom_slides', [])
    if custom_slides:
        print(f"\n📁 Adding custom content:")
        workshop_dir = os.path.join(base_dir, "workshops", workshop_id)

        for custom_file in custom_slides:
            custom_path = os.path.join(workshop_dir, custom_file)
            content = read_markdown_file(custom_path)
            if content:
                content = strip_frontmatter(content)
                content = substitute_variables(content, config)
                # Ensure it ends with slide break
                if not content.rstrip().endswith('---'):
                    content = content.rstrip() + "\n\n---\n"
                deck_content += "\n" + content + "\n"
                print(f"   ✓ {custom_file}")

    # Add closing slide
    if config.get('include_closing', True):
        closing_path = os.path.join(base_dir, "templates", "closing.md")
        closing_content = read_markdown_file(closing_path)
        if closing_content:
            closing_content = strip_frontmatter(closing_content)
            closing_content = substitute_variables(closing_content, config)
            deck_content += closing_content + "\n"
            print(f"\n👋 Closing slides added")

    # Write output file
    print(f"\n💾 Step 3: Writing output file...")
    output_dir = os.path.join(base_dir, "outputs")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, output_file)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(deck_content)

    # Success!
    print("\n" + "═" * 70)
    print("                    ✅ SUCCESS!")
    print("═" * 70)
    print(f"\n📄 Deck created: {output_path}")

    print(f"\n💡 Next steps:")
    print(f"\n   OPTION 1: Convert to PDF (RECOMMENDED)")
    print(f"   ────────────────────────────────────────")
    print(f"   marp {output_path} --theme-set fastr-theme.css --pdf")
    print(f"\n   Why PDF? Consistent styling, no font issues, ready to present!")

    print(f"\n   OPTION 2: Convert to PowerPoint")
    print(f"   ────────────────────────────────────────")
    print(f"   python3 tools/convert_to_pptx.py {output_path}")
    print(f"\n   Note: PowerPoint may need font/layout adjustments")

    print("\n" + "═" * 70 + "\n")

    return output_path


def main():
    """
    Main entry point

    Handles both interactive mode and command-line arguments
    """

    # Determine base directory (parent of tools/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(script_dir)  # Go up one level from tools/

    # Check if user provided command-line arguments
    if len(sys.argv) > 1:
        # ═══════════════════════════════════════════════════════════════
        # COMMAND LINE MODE
        # ═══════════════════════════════════════════════════════════════

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

        args = parser.parse_args()

        # Build the deck (skip confirmation in command-line mode)
        build_workshop_deck(args.workshop, base_dir, args.output, skip_confirmation=True)

    else:
        # ═══════════════════════════════════════════════════════════════
        # INTERACTIVE MODE (No arguments provided)
        # ═══════════════════════════════════════════════════════════════

        print("\n" + "═" * 70)
        print("             FASTR SLIDE DECK BUILDER")
        print("               (Interactive Mode)")
        print("═" * 70)

        # Prompt user to select a workshop
        workshop_id = prompt_for_workshop(base_dir)

        # Build it!
        build_workshop_deck(workshop_id, base_dir, skip_confirmation=False)


if __name__ == "__main__":
    main()
