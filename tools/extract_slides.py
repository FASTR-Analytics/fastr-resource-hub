#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
                    FASTR SLIDE EXTRACTION TOOL
═══════════════════════════════════════════════════════════════════════════════

Extracts slide content from methodology documentation.

USAGE:
    python3 tools/extract_slides.py

This script:
1. Scans methodology/*.md files for <!-- SLIDE:xxx --> markers
2. Extracts content between markers
3. Generates/updates slide files in core_content/

MARKER FORMAT:
    <!-- SLIDE:m4_1 -->
    # Slide Title

    Content here...
    <!-- /SLIDE -->

The marker ID (e.g., m4_1) determines:
- Module folder: m4_data_quality_assessment/
- File name: m4_1_*.md

═══════════════════════════════════════════════════════════════════════════════
"""

import os
import re
import sys
from pathlib import Path


# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

# Module folder names (must match existing structure in core_content/)
MODULE_FOLDERS = {
    0: 'm0_introduction',
    1: 'm1_identify_questions_indicators',
    2: 'm2_data_extraction',
    3: 'm3_fastr_analytics_platform',
    4: 'm4_data_quality_assessment',
    5: 'm5_data_quality_adjustment',
    6: 'm6_data_analysis',
    7: 'm7_results_communication',
}

# Topic names for generating filenames
TOPIC_NAMES = {
    # m0 - Introduction
    'm0_1': 'introduce_fastr_approach',
    'm0_2': 'overview_of_resources',
    'm0_3': 'models_of_implementation',

    # m4 - Data Quality Assessment
    'm4_1': 'approach_to_dqa',
    'm4_2': 'indicator_completeness',
    'm4_3': 'outliers',
    'm4_4': 'internal_consistency',
    'm4_5': 'overall_dqa_score',
    'm4_6': 'assessing_dq_in_platform',

    # m5 - Data Quality Adjustment
    'm5_1': 'approach_to_dq_adjustment',
    'm5_2': 'adjustment_for_outliers',
    'm5_3': 'adjustment_for_completeness',
    'm5_4': 'adjusting_dq_in_platform',

    # m6 - Data Analysis
    'm6_1': 'service_utilization',
    'm6_2': 'surplus_disruption_analyses',
    'm6_3': 'service_coverage',

    # Add more as needed...
}

# Marp frontmatter to add to extracted slides
MARP_FRONTMATTER = """---
marp: true
theme: fastr
paginate: true
---

"""


# ═══════════════════════════════════════════════════════════════════════════════
# EXTRACTION FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def find_slide_markers(content):
    """
    Find all <!-- SLIDE:xxx --> ... <!-- /SLIDE --> blocks in content.

    Returns list of (slide_id, content) tuples.
    """
    pattern = r'<!--\s*SLIDE:(\w+)\s*-->(.*?)<!--\s*/SLIDE\s*-->'
    matches = re.findall(pattern, content, re.DOTALL)

    results = []
    for slide_id, slide_content in matches:
        # Clean up the content (remove leading/trailing whitespace but preserve internal formatting)
        cleaned = slide_content.strip()
        results.append((slide_id, cleaned))

    return results


def parse_slide_id(slide_id):
    """
    Parse slide ID like 'm4_1' into module number and topic number.

    Returns (module_num, topic_num) or (None, None) if invalid.
    """
    match = re.match(r'^m(\d+)_(\d+)$', slide_id)
    if match:
        return int(match.group(1)), int(match.group(2))
    return None, None


def get_output_path(slide_id, base_dir):
    """
    Generate output file path for a slide ID.

    Example: 'm4_1' -> core_content/m4_data_quality_assessment/m4_1_approach_to_dqa.md
    """
    module_num, topic_num = parse_slide_id(slide_id)

    if module_num is None:
        print(f"   ⚠️  Invalid slide ID format: {slide_id}")
        return None

    if module_num not in MODULE_FOLDERS:
        print(f"   ⚠️  Unknown module number: {module_num}")
        return None

    module_folder = MODULE_FOLDERS[module_num]

    # Get topic name or use generic name
    if slide_id in TOPIC_NAMES:
        topic_name = TOPIC_NAMES[slide_id]
    else:
        topic_name = f"topic_{topic_num}"
        print(f"   ℹ️  Using generic name for {slide_id}: {topic_name}")

    filename = f"{slide_id}_{topic_name}.md"

    return os.path.join(base_dir, 'core_content', module_folder, filename)


def fix_image_paths(content, source_file):
    """
    Fix image paths to be relative to core_content folder.

    Images in methodology use paths like: images/foo.png
    These need to become: ../../methodology/images/foo.png
    """
    # Pattern for markdown images
    def replace_image(match):
        alt_text = match.group(1)
        img_path = match.group(2)

        # Skip URLs
        if img_path.startswith('http://') or img_path.startswith('https://'):
            return match.group(0)

        # Skip already-fixed paths
        if img_path.startswith('../../methodology/'):
            return match.group(0)

        # Fix relative paths from methodology folder
        if img_path.startswith('images/'):
            new_path = f"../../methodology/{img_path}"
            return f"![{alt_text}]({new_path})"

        # For other relative paths, assume they're in methodology
        new_path = f"../../methodology/images/{os.path.basename(img_path)}"
        return f"![{alt_text}]({new_path})"

    return re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', replace_image, content)


def extract_slides(base_dir):
    """
    Main extraction function.

    Scans methodology/*.md files and extracts slide content.
    """
    methodology_dir = os.path.join(base_dir, 'methodology')

    if not os.path.exists(methodology_dir):
        print("❌ Error: methodology/ folder not found")
        print("   Make sure you're running from the fastr-slide-builder directory")
        return False

    print("\n" + "═" * 70)
    print("              FASTR SLIDE EXTRACTION")
    print("═" * 70 + "\n")

    # Find all markdown files in methodology
    md_files = list(Path(methodology_dir).glob('*.md'))

    if not md_files:
        print("❌ No markdown files found in methodology/")
        return False

    print(f"📂 Scanning {len(md_files)} methodology files...\n")

    total_extracted = 0

    for md_file in sorted(md_files):
        filename = md_file.name

        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        slides = find_slide_markers(content)

        if not slides:
            continue

        print(f"📄 {filename}")

        for slide_id, slide_content in slides:
            output_path = get_output_path(slide_id, base_dir)

            if not output_path:
                continue

            # Ensure output directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)

            # Fix image paths
            fixed_content = fix_image_paths(slide_content, md_file)

            # Add Marp frontmatter
            final_content = MARP_FRONTMATTER + fixed_content + "\n"

            # Write to file
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(final_content)

            print(f"   ✓ {slide_id} → {os.path.basename(output_path)}")
            total_extracted += 1

    print("\n" + "─" * 70)
    print(f"✅ Extracted {total_extracted} slide(s)")
    print("─" * 70 + "\n")

    return True


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    # Determine base directory (parent of tools/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(script_dir)

    success = extract_slides(base_dir)

    if success:
        print("💡 Next steps:")
        print("   1. Review extracted files in core_content/")
        print("   2. Build a deck: python3 tools/03_build_deck.py --workshop example")
        print("")

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
