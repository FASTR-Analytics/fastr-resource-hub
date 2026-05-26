#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════════════
                    FASTR SLIDE EXTRACTION TOOL
═══════════════════════════════════════════════════════════════════════════════

Step 0: Extract slide content from methodology documentation.

USAGE:
    python3 tools/00_extract_slides.py              # English (default)
    python3 tools/00_extract_slides.py --lang fr    # French

This script:
1. Scans methodology/*.md files for <!-- SLIDE:xxx --> markers
2. Extracts content between markers
3. Generates/updates slide files in core_content/ (or core_content_fr/ for French)

Run this ONCE when setting up, or whenever methodology docs change.

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
    8: 'm8_survey_hfa',
    # Note: m9 activities are manually managed in m9a/b/c/d sub-folders, not auto-extracted
    'ai': 'mai_ai_assistant',  # AI Assistant module (separate from m3)
}

# Topic names for generating filenames
TOPIC_NAMES = {
    # m0 - Introduction (from 00_introduction.md)
    'm0_1': 'what_is_fastr',
    'm0_2': 'what_are_we_trying_to_achieve',
    'm0_3': 'analyze_learn_strengthen_act',
    'm0_4': 'four_complementary_pillars',
    'm0_5': 'how_countries_use_fastr',
    'm0_6': 'fastr_approach_rmncahn',
    'm0_7': 'from_analysis_to_action',

    # m1 - Identify Questions & Indicators (from 01_identify_questions_indicators.md)
    'm1_1': 'what_is_data_use_case',
    'm1_1a': 'nigeria_quarterly_monitoring',
    'm1_1a2': 'guinea_investment_tracking',
    'm1_1a3': 'ethiopia_program_monitoring',
    'm1_1b': 'common_data_use_case',
    'm1_1c': 'how_select_indicators',
    'm1_2': 'fastr_core_indicators',
    'm1_2a': 'country_indicator_selection',
    'm1_3': 'high_volume_indicators',
    'm1_3a': 'high_completeness_indicators',
    'm1_3b': 'count_indicators',

    # m2 - Data Extraction (from 02_data_extraction.md)
    'm2_0': 'show_of_hands_extraction',
    'm2_1': 'why_extract_data',
    'm2_1a': 'extract_counts_not_percentages',
    'm2_2': 'tools_for_data_extraction',
    'm2_2a': 'fastr_direct_import',
    'm2_2b': 'data_downloader',
    'm2_2c': 'data_downloader_login',
    'm2_2d': 'data_downloader_overview',
    'm2_2e': 'data_downloader_history',
    'm2_2f': 'data_downloader_dictionary',
    'm2_2g': 'data_downloader_facility_list',
    'm2_2h': 'data_downloader_facility_map',

    # m3 - FASTR Analytics Platform (from 03_fastr_analytics_platform.md)
    'm3_0': 'learning_objectives',
    'm3_1': 'overview_of_platform',
    'm3_2': 'accessing_platform',
    'm3_2f': 'analytical_pipeline',
    'm3_2e': 'configuring_platform_intro',
    'm3_3': 'next_steps',
    'm3_4': 'importing_dataset',
    'm3_5': 'roadmap_2026',
    'm3_6': 'creating_new_project',
    'm3_7': 'creating_visualizations',
    'm3_8': 'creating_reports',
    # AI Assistant slides
    'm3_9': 'ai_assistant_overview',
    'm3_9a': 'ai_assistant_capabilities',
    'm3_9a1': 'ai_platform_components',
    'm3_9b': 'ai_ask_questions',
    'm3_9b2': 'ai_conversations',
    'm3_9c': 'ai_tips_better_answers',
    'm3_9c2': 'ai_report_generation',
    'm3_9d': 'ai_what_happens_log_off',
    'm3_9d2': 'ai_private_vs_shared',
    'm3_9d3': 'ai_team_collaboration',
    'm3_9d4': 'ai_quick_reference',
    'm3_9e': 'ai_how_it_works',
    'm3_9e1': 'ai_does_and_doesnt',
    'm3_9e2': 'ai_accelerator_not_decider',
    'm3_9e3': 'ai_principles_success',
    'm3_9f': 'ai_practice_activity',

    # m4 - Data Quality Assessment (from 04_data_quality_assessment.md)
    'm4_0': 'fastr_methods_overview',
    'm4_1': 'approach_to_dqa',
    'm4_1a': 'measures_data_quality_detailed',
    'm4_1b': 'approach_to_dqa',
    'm4_1c': 'approach_to_dqa',
    'm4_1d': 'approach_to_dqa',
    'm4_1e': 'fastr_vs_dhis2_dqa',
    'm4_1f': 'fastr_vs_dhis2_dqa_continued',
    'm4_2': 'indicator_completeness',
    'm4_2a': 'notes_on_completeness',
    'm4_3': 'outliers',
    'm4_3a': 'outlier_investigation',
    'm4_3ab': 'outlier_investigation',
    'm4_3b': 'outliers',
    'm4_3c': 'outliers',
    'm4_4': 'internal_consistency',
    'm4_4b': 'internal_consistency',
    'm4_5': 'overall_dqa_score',
    'm4_5b': 'overall_dqa_score',
    'm4_6': 'dqa_configuration_parameters',
    # Condensed DQA slides (methods + interpretation)
    'm4_s0': 'dqa_what_we_check',
    'm4_s1': 'dqa_pipeline_overview',
    'm4_s1b': 'dqa_pipeline_overview',
    'm4_s2': 'dqa_rationale_objectives',
    'm4_s2b': 'dqa_rationale_objectives',
    'm4_s3': 'dqa_completeness',
    'm4_s3c': 'dqa_completeness',
    'm4_s3a': 'dqa_outlier_illustration',
    'm4_s3b': 'dqa_outliers',
    'm4_s3bb': 'dqa_outliers',
    'm4_s4': 'dqa_internal_consistency',
    'm4_s4b': 'dqa_internal_consistency',
    'm4_s5': 'dqa_score_summary',
    'm4_s5b': 'dqa_score_summary',
    'm4_s5c': 'dqa_score_summary',

    # m5 - Data Quality Adjustment (from 05_data_quality_adjustment.md)
    'm5_1': 'approach_to_dq_adjustment',
    'm5_1b': 'approach_to_dq_adjustment',
    'm5_2': 'adjustment_for_outliers',
    'm5_3': 'adjustment_for_completeness',
    # Condensed DQ Adjustment slides (methods + interpretation)
    'm5_s0': 'adjustment_how_it_works',
    'm5_s1': 'dq_adjustment_overview',
    'm5_s1a': 'why_adjust_for_outliers',
    'm5_s2': 'dq_adjustment_interpretation',
    'm5_s2b': 'dq_adjustment_interpretation',

    # m6 - Data Analysis (from 06a_service_utilization.md, 06b_coverage_estimates.md)
    'm6_1': 'service_utilization_analysis',
    'm6_1a': 'service_utilization_comparison_dhis2',
    'm6_1b': 'service_utilization_analysis',
    'm6_1c': 'indicator_directionality',
    'm6_2': 'service_disruptions_surpluses_detection',
    'm6_2a': 'why_detecting_disruptions_matters',
    'm6_2b': 'service_disruptions_surpluses_detection',
    'm6_2c': 'service_disruptions_surpluses_detection',
    'm6_5a': 'service_utilization_configuration_parameters',
    'm6_6': 'service_coverage_introduction',
    'm6_6b': 'service_coverage_introduction',
    'm6_6c': 'service_coverage_introduction',
    'm6_7': 'definition_of_coverage',
    'm6_8': 'denominators_by_service_type',
    'm6_9': 'demographic_cascade',
    'm6_9a': 'cascade_dropout',
    'm6_9ab': 'cascade_dropout',
    'm6_10': 'denominator_cascade_illustration',
    'm6_11': 'deriving_denominators_from_entry_points',
    'm6_13': 'denominator_selection_methodology',
    'm6_13a': 'denominator_comparison',
    'm6_14': 'coverage_projection_methodology',
    'm6_19': 'coverage_configuration_parameters',
    # Condensed Service Utilization & Coverage slides (methods + interpretation)
    'm6_s0': 'utilization_detecting_changes',
    'm6_s0b': 'reading_disruption_chart',
    'm6_s0c': 'coverage_methods',
    'm6_s0d': 'reading_coverage_chart',
    'm6_s1': 'utilization_overview',
    'm6_s1a': 'quarter_on_quarter_change',
    'm6_s1b': 'utilization_overview',
    'm6_s1c': 'utilization_overview',
    'm6_s1d': 'indicator_directionality',
    'm6_s2': 'disruption_interpretation',
    'm6_s2b': 'disruption_interpretation',
    'm6_s3': 'coverage_overview',
    'm6_s3a': 'coverage_example',
    'm6_s3b': 'coverage_overview',
    'm6_s3c': 'estimating_denominators',
    'm6_s3d': 'five_denominator_options',
    'm6_s3e': 'how_fastr_estimates_coverage',
    'm6_s3f': 'expected_relationships',
    'm6_s4': 'coverage_interpretation',
    'm6_s4b': 'coverage_interpretation',
    'm6_s4c': 'coverage_interpretation',
    'm6_s5': 'country_example_nigeria',
    'm6_s6': 'fastr_value_beyond_dhis2',
    'm6_s7': 'key_takeaway',

    # m7 - Results Communication (from 07_results_communication.md)
    'm7_1': 'analytical_thinking_interpretation',
    'm7_1d': 'outliers_output',
    'm7_1e': 'internal_consistency_output',
    'm7_1f': 'overall_dqa_score_output',
    'm7_1g': 'mean_dqa_score_output',
    'm7_1h': 'outlier_adjustment_output',
    'm7_1i': 'completeness_adjustment_output',
    'm7_1i2': 'combined_adjustment_output',
    'm7_1j': 'service_utilization_output',
    'm7_1k': 'year_over_year_change_output',
    'm7_1l': 'disruption_output_national',
    'm7_1m': 'disruption_output_subnational',
    'm7_1n': 'coverage_output_national',
    'm7_1o': 'coverage_output_subnational',
    'm7_2': 'data_visualization_communication',
    'm4_3ab': 'outlier_making_the_call',
    'm4_s3bb': 'outlier_detection_output',
    'm6_9ab': 'calculating_interpreting_dropout',
    'm7_3': 'using_data_for_decision_making',
    'm7_4': 'understanding_audience_user_mapping',
    'm7_4a': 'activity_map_your_users',
    'm7_5': 'storytelling_with_data',
    'm7_5a': 'from_data_to_story_example',
    'm7_6': 'linking_results_to_actions',
    'm7_6a': 'activity_link_results_to_actions',
    'm7_6b': 'three_spheres_of_influence',
    'm7_7': 'building_roadmap_sustained_use',
    'm7_7a': 'activity_country_action_planning',

    # m8 - Survey & HFA (from 08_survey_hfa.md)
    'm8_0': 'hfa_implementation_status',
    'm8_0a': 'fastr_hfa_approach',
    'm8_1': 'rapid_cycle_facility_survey',
    'm8_1a': 'hfa_survey_design',
    'm8_1b': 'adaptive_survey_content',
    'm8_1c': 'four_types_of_indicators',
    'm8_2': 'validity_phone_surveys',
    'm8_3': 'snis_hfa_integration',
    'm8_3a': 'triangulation_example',
    'm8_3b': 'dhis2_chain',
    'm8_3c': 'complete_results_chain',

    # m9 - Workshop Activities (from 09_workshop_activities.md)
    'm9_0a': 'creating_user_folder',
    'm9_0b': 'creating_visualizations_manually',
    'm9_0c': 'creating_visualizations_ai',
    'm9_0d': 'explore_with_ai_assistant',
    'm9_0e': 'creating_slide_decks',
    'm9_0f': 'interpreting_visualizations',
    'm9_0g': 'refining_a_prompt',
    'm9_1': 'why_detecting_disruptions_matters',
    'm9_2': 'disruptions_report_activity',
    'm9_3': 'presenting_reports_group_feedback',
    'm9_4': 'fastr_quiz',
    'm9_5': 'manual_to_ai_reporting',
    'm9_6': 'ai_iterative_conversation',
    'm9_7': 'ai_single_prompt',
    'm9_8': 'iterative_vs_single_prompts',
    'm9_9': 'introducing_prompt_library',
    'm9_10': 'prompt_library_organization',
    'm9_11': 'example_prompts',
    'm9_12': 'creating_disruption_report_ai',
    'm9_13': 'working_from_pdf_template',
    'm9_14': 'review_checklist',
    'm9_15': 'editing_formatting_slides',

    # AI Assistant module (from 03b_ai_assistant.md)
    'mai_1': 'ai_assistant_overview',
    'mai_2': 'ai_assistant_capabilities',
    'mai_2a': 'ai_greatest_value',
    'mai_2b': 'ai_additional_capabilities',
    'mai_2c': 'ai_across_components',
    'mai_3': 'ai_ask_questions',
    'mai_4': 'ai_conversations',
    'mai_5': 'ai_tips_better_answers',
    'mai_5a': 'ai_good_prompt_checklist',
    'mai_6': 'ai_capabilities_table',
    'mai_7': 'ai_what_happens_log_off',
    'mai_8': 'ai_private_vs_shared',
    'mai_9': 'ai_team_collaboration',
    'mai_10': 'ai_how_it_works',
    'mai_11': 'ai_accelerator_not_decider',
    'mai_11a': 'ai_little_value_example',
    'mai_11b': 'ai_helpful_example',
    'mai_12': 'ai_principles_success',
    'mai_13': 'ai_practice_activity',
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

    Strips fenced code blocks first so documentation examples (e.g. the
    `<!-- SLIDE:m4_2 -->` example in methodology/README.md) are not picked up
    and used to overwrite real slide files.

    Returns list of (slide_id, content) tuples.
    """
    content_no_fences = re.sub(r'```.*?```', '', content, flags=re.DOTALL)
    pattern = r'<!--\s*SLIDE:(\w+)\s*-->(.*?)<!--\s*/SLIDE\s*-->'
    matches = re.findall(pattern, content_no_fences, re.DOTALL)

    results = []
    for slide_id, slide_content in matches:
        # Clean up the content (remove leading/trailing whitespace but preserve internal formatting)
        cleaned = slide_content.strip()
        results.append((slide_id, cleaned))

    return results


def parse_slide_id(slide_id):
    """
    Parse slide ID like 'm4_1' or 'm4_1a' into module number and topic number.

    Supports formats:
    - m4_1 -> (4, 1, '')
    - m4_1a -> (4, 1, 'a')
    - m4_1a2 -> (4, 1, 'a2')
    - m4_s1 -> (4, 's1', '') - condensed/summary slides
    - mai_1 -> ('ai', 1, '') - AI Assistant module

    Returns (module_num, topic_num, suffix) or (None, None, None) if invalid.
    """
    # AI Assistant format: mai_1, mai_2, mai_1a, mai_1ab, etc.
    match = re.match(r'^mai_(\d+)([a-z]*\d*)$', slide_id)
    if match:
        return 'ai', int(match.group(1)), match.group(2)

    # Standard format: m4_1, m4_1a, m4_1a2, m4_3ab, etc.
    match = re.match(r'^m(\d+)_(\d+)([a-z]*\d*)$', slide_id)
    if match:
        return int(match.group(1)), int(match.group(2)), match.group(3)

    # Summary/condensed format: m4_s1, m5_s2, m4_s3b, m4_s3bb, etc.
    match = re.match(r'^m(\d+)_(s\d+[a-z]*)$', slide_id)
    if match:
        return int(match.group(1)), match.group(2), ''

    return None, None, None


def get_output_path(slide_id, base_dir, language='en'):
    """
    Generate output file path for a slide ID.

    Example: 'm4_1' -> core_content/m4_data_quality_assessment/m4_1_approach_to_dqa.md
    Example: 'm0_2a' -> core_content/m0_introduction/m0_2a_implementation_steps.md

    For French (language='fr'):
    Example: 'm4_1' -> core_content_fr/m4_data_quality_assessment/m4_1_approach_to_dqa.md
    """
    module_num, topic_num, suffix = parse_slide_id(slide_id)

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
        # For slides with suffix, try base ID first
        base_id = f"m{module_num}_{topic_num}"
        if base_id in TOPIC_NAMES and suffix:
            topic_name = f"{TOPIC_NAMES[base_id]}_continued"
        else:
            topic_name = f"topic_{topic_num}{suffix}"
            print(f"   ℹ️  Using generic name for {slide_id}: {topic_name}")

    filename = f"{slide_id}_{topic_name}.md"

    # Determine output directory based on language
    output_dir = 'core_content' if language == 'en' else f'core_content_{language}'

    return os.path.join(base_dir, output_dir, module_folder, filename)


def fix_image_paths(content, source_file):
    """
    Fix image paths to be relative to core_content folder.

    Images in methodology use paths like: ../resources/diagrams/foo.svg
    These need to become: ../../resources/diagrams/foo.svg
    (adding one more ../ since core_content is one level deeper)
    """
    # Pattern for markdown images
    def replace_image(match):
        alt_text = match.group(1)
        img_path = match.group(2)

        # Skip URLs
        if img_path.startswith('http://') or img_path.startswith('https://'):
            return match.group(0)

        # Skip template variables like {{WORKSHOP_MEDIA}}/file.png
        if '{{' in img_path:
            return match.group(0)

        # Skip already-fixed paths (starts with ../../resources)
        if img_path.startswith('../../resources/'):
            return match.group(0)

        # Fix paths that reference ../resources/ (from methodology folder)
        if img_path.startswith('../resources/'):
            new_path = f"../{img_path}"  # Add one more ../
            return f"![{alt_text}]({new_path})"

        # Legacy: Fix old-style paths from methodology/images/
        if img_path.startswith('images/'):
            # Map to new resources structure
            filename = os.path.basename(img_path)
            new_path = f"../../resources/default_outputs/{filename}"
            return f"![{alt_text}]({new_path})"

        # Handle paths like resources/diagrams/ or resources/default_outputs/
        if img_path.startswith('resources/'):
            new_path = f"../../{img_path}"
            return f"![{alt_text}]({new_path})"

        # For other relative paths, try to map to resources
        new_path = f"../../resources/default_outputs/{os.path.basename(img_path)}"
        return f"![{alt_text}]({new_path})"

    return re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', replace_image, content)


def extract_slides(base_dir, language='en', prune=False):
    """
    Main extraction function.

    Scans methodology/*.md files and extracts slide content.

    Args:
        base_dir: Base directory of the fastr-resource-hub
        language: Language code ('en' for English, 'fr' for French, etc.)
        prune: If True, delete core_content slide files no longer produced by
            methodology markers. OFF by default — only safe once methodology is
            fully reconciled with core_content (today methodology has fewer
            markers than core_content has slides, so pruning would delete real
            content).
    """
    # Determine methodology directory based on language
    if language == 'en':
        methodology_dir = os.path.join(base_dir, 'methodology')
        output_dir_name = 'core_content'
    else:
        methodology_dir = os.path.join(base_dir, 'methodology', language)
        output_dir_name = f'core_content_{language}'

    if not os.path.exists(methodology_dir):
        print(f"❌ Error: {methodology_dir} folder not found")
        print("   Make sure you're running from the fastr-resource-hub directory")
        return False

    lang_label = f" ({language.upper()})" if language != 'en' else ""
    print("\n" + "═" * 70)
    print(f"              FASTR SLIDE EXTRACTION{lang_label}")
    print("═" * 70 + "\n")

    # Find all markdown files in methodology
    md_files = list(Path(methodology_dir).glob('*.md'))

    if not md_files:
        print(f"❌ No markdown files found in {methodology_dir}/")
        return False

    print(f"📂 Scanning {len(md_files)} methodology files from {methodology_dir}...")
    print(f"📁 Output directory: {output_dir_name}/\n")

    total_extracted = 0
    # Track which files we wrote, per module folder, so we can prune stale ones.
    written_by_folder = {}

    for md_file in sorted(md_files):
        filename = md_file.name

        with open(md_file, 'r', encoding='utf-8') as f:
            content = f.read()

        slides = find_slide_markers(content)

        if not slides:
            continue

        print(f"📄 {filename}")

        for slide_id, slide_content in slides:
            output_path = get_output_path(slide_id, base_dir, language)

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

            written_by_folder.setdefault(os.path.dirname(output_path), set()).add(os.path.basename(output_path))
            print(f"   ✓ {slide_id} → {os.path.basename(output_path)}")
            total_extracted += 1

    # Prune stale slide files (opt-in via --prune): in any folder we wrote to,
    # remove .md files we did NOT write this run. Only touches folders that were
    # extracted — manually-managed modules (m9*) get no markers, so their folders
    # are never in this set. WARNING: only safe once methodology fully covers
    # core_content; otherwise it deletes real, un-marked slides.
    pruned = 0
    if prune:
        for folder, kept in written_by_folder.items():
            for path in Path(folder).glob('*.md'):
                if path.name not in kept:
                    path.unlink()
                    print(f"   🗑  pruned stale: {os.path.relpath(path, base_dir)}")
                    pruned += 1

    print("\n" + "─" * 70)
    print(f"✅ Extracted {total_extracted} slide(s) to {output_dir_name}/" + (f"  ·  pruned {pruned} stale" if pruned else ""))
    print("─" * 70 + "\n")

    return True


# ═══════════════════════════════════════════════════════════════════════════════
# METADATA REGENERATION
# ═══════════════════════════════════════════════════════════════════════════════

def regenerate_meta(base_dir, languages):
    """Regenerate _meta.yaml files for all extracted content directories."""
    try:
        from migrate_to_meta import build_meta_yaml, folder_to_mod_id
        import yaml
    except ImportError:
        # Try importing from same directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        sys.path.insert(0, script_dir)
        try:
            from migrate_to_meta import build_meta_yaml, folder_to_mod_id
            import yaml
        except ImportError:
            print("⚠️  Could not import migrate_to_meta or PyYAML — skipping _meta.yaml regeneration")
            return

    print("📋 Regenerating _meta.yaml files...")
    meta_count = 0

    for language in languages:
        content_dir_name = 'core_content' if language == 'en' else f'core_content_{language}'
        content_dir = Path(base_dir) / content_dir_name
        if not content_dir.exists():
            continue

        label = language.upper()
        for module_dir in sorted(content_dir.iterdir()):
            if not module_dir.is_dir():
                continue

            mod_id = folder_to_mod_id(module_dir.name)
            if not mod_id:
                continue

            md_files = list(module_dir.glob('*.md'))
            if not md_files:
                continue

            meta = build_meta_yaml(module_dir, mod_id)
            meta_path = module_dir / '_meta.yaml'
            with open(meta_path, 'w', encoding='utf-8') as f:
                yaml.dump(meta, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
            meta_count += 1

    print(f"   ✅ Updated {meta_count} _meta.yaml files\n")


# ═══════════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='Extract slides from FASTR methodology files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  python3 tools/00_extract_slides.py              # Extract English slides
  python3 tools/00_extract_slides.py --lang fr    # Extract French slides
  python3 tools/00_extract_slides.py --lang fr --lang en  # Extract both
        '''
    )
    parser.add_argument(
        '--lang', '-l',
        action='append',
        dest='languages',
        choices=['en', 'fr'],
        help='Language(s) to extract (default: en). Can be specified multiple times.'
    )
    parser.add_argument(
        '--prune',
        action='store_true',
        help='Delete core_content slide files no longer produced by methodology '
             'markers. OFF by default — only safe once methodology fully covers '
             'core_content (otherwise it deletes real, un-marked slides).'
    )
    args = parser.parse_args()

    # Default to English if no language specified
    languages = args.languages if args.languages else ['en']

    # Determine base directory (parent of tools/)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(script_dir)

    all_success = True
    for language in languages:
        success = extract_slides(base_dir, language, prune=args.prune)
        if not success:
            all_success = False

    if all_success:
        # Regenerate _meta.yaml files to stay in sync
        regenerate_meta(base_dir, languages)

        output_dirs = ', '.join([
            'core_content' if lang == 'en' else f'core_content_{lang}'
            for lang in languages
        ])
        print(f"💡 Extracted files are in {output_dirs}/")
        print("   Open http://localhost:5173 to preview in the web app\n")

    sys.exit(0 if all_success else 1)


if __name__ == "__main__":
    main()
