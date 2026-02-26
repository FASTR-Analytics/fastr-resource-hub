#!/usr/bin/env python3
"""
Generate YAML metadata files from current system state.

USAGE:
    python3 tools/migrate_to_meta.py

Generates:
1. modules.yaml at repo root - single source of truth for all module definitions
2. _meta.yaml in each core_content/ and core_content_fr/ module folder - slide ordering/metadata
"""

import os
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: PyYAML not installed. Run: pip3 install pyyaml")
    sys.exit(1)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CORE_CONTENT_DIR = PROJECT_ROOT / 'core_content'
CORE_CONTENT_FR_DIR = PROJECT_ROOT / 'core_content_fr'

# ─────────────────────────────────────────────────────────────────────────────
# Data from content.ts MODULE_NAMES
# ─────────────────────────────────────────────────────────────────────────────
MODULE_NAMES_EN = {
    '0': 'Introduction to FASTR',
    '1': 'Identify Questions & Indicators',
    '2': 'Data Extraction',
    '3': 'FASTR Analytics Platform',
    '4': 'Data Quality Assessment',
    '5': 'Data Quality Adjustment',
    '6': 'Data Analysis',
    '7': 'Results Communication',
    '8': 'Survey & HFA',
    '9a': 'Instance Setup',
    '9b': 'Getting Started',
    '9c': 'Visualizations & Interpretation',
    '9d': 'Slide Decks',
    '9e': 'Disruption Report',
    '9f': 'Prompting Techniques',
    '9g': 'FASTR Quiz',
    '9h': 'Platform Demo',
    '3b': 'AI Assistant',
}

MODULE_NAMES_FR = {
    '0': 'Introduction à FASTR',
    '1': 'Identifier les questions et indicateurs',
    '2': 'Extraction des données',
    '3': 'Plateforme analytique FASTR',
    '4': 'Évaluation de la qualité des données',
    '5': 'Ajustement de la qualité des données',
    '6': 'Analyse des données',
    '7': 'Communication des résultats',
    '8': 'Enquêtes et EFS',
    '9a': 'Configuration de l\'instance',
    '9b': 'Prise en main',
    '9c': 'Visualisations & Interprétation',
    '9d': 'Présentations',
    '9e': 'Rapport de perturbations',
    '9f': 'Techniques de prompting',
    '9g': 'Quiz FASTR',
    '9h': 'Démo de la plateforme',
    '3b': 'Assistant IA',
}

# ─────────────────────────────────────────────────────────────────────────────
# Data from deckBuilder.ts MODULE_FOLDERS
# ─────────────────────────────────────────────────────────────────────────────
MODULE_FOLDERS = {
    'm0': 'm0_introduction',
    'm1': 'm1_identify_questions_indicators',
    'm2': 'm2_data_extraction',
    'm3': 'm3_fastr_analytics_platform',
    'm4': 'm4_data_quality_assessment',
    'm5': 'm5_data_quality_adjustment',
    'm6': 'm6_data_analysis',
    'm7': 'm7_results_communication',
    'm8': 'm8_survey_hfa',
    'm9a': 'm9a_instance_setup',
    'm9b': 'm9b_getting_started',
    'm9c': 'm9c_visualizations_interpretation',
    'm9d': 'm9d_slide_decks',
    'm9e': 'm9e_disruption_report',
    'm9f': 'm9f_prompting_techniques',
    'm9g': 'm9g_fastr_quiz',
    'm9h': 'm9h_platform_demo',
    'mai': 'mai_ai_assistant',
}

# ─────────────────────────────────────────────────────────────────────────────
# Data from ai.ts MODULE_DETAILS
# ─────────────────────────────────────────────────────────────────────────────
MODULE_AI_CONTEXT = {
    '0': {
        'description': 'Overview of the FASTR methodology, why rapid-cycle analytics matters for RMNCAH-N programs.',
        'topics': ['Introduction to FASTR approach', 'RMNCAH-N service use monitoring', 'Why rapid-cycle analytics'],
        'duration': '45-60 min',
    },
    '1': {
        'description': 'How to identify priority analytical questions, develop data use cases, and prepare indicator frameworks.',
        'topics': ['FASTR gaps and challenges', 'Development of data use case', 'Defining priority questions'],
        'duration': '60-90 min',
    },
    '2': {
        'description': 'Technical module on extracting data from DHIS2 and other health information systems.',
        'topics': ['Why extract data', 'DHIS2 data structure', 'Data Downloader tool', 'API-based extraction'],
        'duration': '90-120 min',
    },
    '3': {
        'description': 'Hands-on introduction to the FASTR Analytics Platform.',
        'topics': ['Platform overview', 'Accessing the platform', 'Importing datasets', 'Running analysis modules'],
        'duration': '120-180 min',
    },
    '4': {
        'description': 'Systematic approach to assessing data quality: completeness, outliers, internal consistency.',
        'topics': ['Approach to DQA', 'Indicator completeness', 'Outlier detection', 'Internal consistency checks'],
        'duration': '90-120 min',
    },
    '5': {
        'description': 'Methods for adjusting data to account for quality issues before analysis.',
        'topics': ['Approach to adjustment', 'Adjustment for outliers', 'Adjustment for completeness'],
        'duration': '60-90 min',
    },
    '6': {
        'description': 'Core analytical methods: service utilization trends, coverage estimation.',
        'topics': ['Service utilization analysis', 'Year-over-year change', 'Coverage introduction', 'Interpreting outputs'],
        'duration': '180-240 min',
    },
    '7': {
        'description': 'How to interpret findings, create visualizations, and communicate results.',
        'topics': ['Analytical thinking', 'Data visualization principles', 'Using data for decisions'],
        'duration': '90-120 min',
    },
    '8': {
        'description': 'Integration of survey data and health facility assessments with routine data.',
        'topics': ['Survey data integration', 'Health facility assessments', 'Triangulating data sources'],
        'duration': '60-90 min',
    },
    '9': {
        'description': 'Hands-on activities and exercises for workshop participants.',
        'topics': ['Group exercises', 'Data interpretation activities', 'Country-specific work'],
        'duration': '60-120 min',
    },
}


def module_sort_key(mod_num_str):
    """Sort key for module numbers: 0, 1, 2, 3, 3b, 4, ..., 9a, 9b, ..."""
    match = re.match(r'^(\d+)([a-z])?$', mod_num_str)
    if not match:
        return 100
    base = int(match.group(1))
    suffix = (ord(match.group(2)) - 96) * 0.01 if match.group(2) else 0
    return base + suffix


def mod_num_to_id(mod_num_str):
    """Convert module number string to module ID (e.g., '3b' -> 'm3b', '4' -> 'm4')."""
    return f'm{mod_num_str}'


def mod_id_to_num(mod_id):
    """Convert module ID to number string (e.g., 'm3b' -> '3b', 'mai' -> '3b')."""
    if mod_id == 'mai':
        return '3b'
    return mod_id[1:]  # strip leading 'm'


def folder_to_mod_id(folder_name):
    """Extract module ID from folder name (e.g., 'm4_data_quality_assessment' -> 'm4')."""
    if folder_name.startswith('mai_'):
        return 'mai'
    match = re.match(r'^(m\d+[a-z]?)_', folder_name)
    if match:
        return match.group(1)
    if folder_name.startswith('overview_'):
        return 'overview'
    return None


def parse_slide_file(filepath):
    """Extract title from first ## heading in a markdown file."""
    try:
        content = filepath.read_text(encoding='utf-8')
        heading_match = re.search(r'^##\s+(.+)$', content, re.MULTILINE)
        if heading_match:
            title = heading_match.group(1).strip()
            # Remove module suffix like "- Module 4"
            title = re.sub(r'\s*-\s*Module\s*\d+$', '', title, flags=re.IGNORECASE).strip()
            return title
    except Exception:
        pass
    return ''


def determine_variant(filename, mod_id):
    """Determine if a file is 'full' or 'condensed' variant."""
    if mod_id == 'overview':
        return 'full'  # overview has no condensed variant
    if mod_id == 'mai':
        return 'full'  # AI module has no condensed variant
    # Condensed files have _s pattern: m4_s1_xxx.md
    if re.match(r'^m\d+[a-z]?_s\d+', filename):
        return 'condensed'
    return 'full'


def extract_order(filename, mod_id):
    """Extract sort order number from filename."""
    # Overview module: 01_xxx.md, 04b_xxx.md
    if mod_id == 'overview':
        match = re.match(r'^(\d+)([a-z])?_', filename)
        if match:
            base = int(match.group(1))
            suffix = match.group(2) or ''
            # e.g., 04 -> 4.0, 04b -> 4.02
            sub = (ord(suffix) - 96) * 0.01 if suffix else 0
            return base + sub
        return 0

    # AI module: mai_1_xxx.md, mai_5a_xxx.md
    if mod_id == 'mai':
        match = re.match(r'^mai_(\d+)([a-z]?)_', filename)
        if match:
            base = int(match.group(1))
            suffix = match.group(2) or ''
            sub = (ord(suffix) - 96) * 0.01 if suffix else 0
            return base + sub
        return 0

    # Condensed: m4_s1_xxx.md, m4_s3b_xxx.md
    match = re.match(r'^m\d+[a-z]?_s(\d+)([a-z]?)_', filename)
    if match:
        base = int(match.group(1))
        suffix = match.group(2) or ''
        sub = (ord(suffix) - 96) * 0.01 if suffix else 0
        return base + sub

    # Standard: m4_0_xxx.md, m4_1a_xxx.md, m4_1a2_xxx.md
    match = re.match(r'^m\d+[a-z]?_(\d+)([a-z]?\d*)_', filename)
    if match:
        base = int(match.group(1))
        suffix = match.group(2) or ''
        # Parse suffix like 'a' -> 0.01, 'a2' -> 0.012, 'b' -> 0.02
        sub = 0
        if suffix:
            sub = (ord(suffix[0]) - 96) * 0.01
            if len(suffix) > 1:
                sub += int(suffix[1:]) * 0.001
        return base + sub

    # m9a_0_xxx.md pattern
    match = re.match(r'^m\d+[a-z]_(\d+)_', filename)
    if match:
        return int(match.group(1))

    return 0


def build_meta_yaml(module_dir, mod_id):
    """Build _meta.yaml content for a module folder."""
    slides = []
    md_files = sorted(module_dir.glob('*.md'))

    for f in md_files:
        if f.name == '_meta.yaml' or f.name.startswith('.'):
            continue

        variant = determine_variant(f.name, mod_id)
        order = extract_order(f.name, mod_id)
        title = parse_slide_file(f)

        slides.append({
            'file': f.name,
            'order': order,
            'variant': variant,
            'title': title,
        })

    # Sort by variant then order
    slides.sort(key=lambda s: (0 if s['variant'] == 'full' else 1, s['order']))

    return {'slides': slides}


def build_modules_yaml():
    """Build the top-level modules.yaml from all known sources."""
    # Collect all known module numbers from all sources
    all_mod_nums = set()

    # From MODULE_NAMES
    all_mod_nums.update(MODULE_NAMES_EN.keys())

    # From MODULE_FOLDERS (convert m4 -> '4', mai -> '3b')
    for mod_id in MODULE_FOLDERS:
        all_mod_nums.add(mod_id_to_num(mod_id))

    # From filesystem scan (core_content/)
    if CORE_CONTENT_DIR.exists():
        for d in CORE_CONTENT_DIR.iterdir():
            if d.is_dir():
                mid = folder_to_mod_id(d.name)
                if mid and mid != 'overview':
                    all_mod_nums.add(mod_id_to_num(mid))

    # Also check core_content_fr for modules only in FR
    if CORE_CONTENT_FR_DIR.exists():
        for d in CORE_CONTENT_FR_DIR.iterdir():
            if d.is_dir():
                mid = folder_to_mod_id(d.name)
                if mid == 'overview':
                    all_mod_nums.add('overview')
                elif mid:
                    all_mod_nums.add(mod_id_to_num(mid))

    # Build module definitions sorted by module number
    modules = []
    for mod_num in sorted(all_mod_nums, key=lambda x: module_sort_key(x) if x != 'overview' else 999):
        mod_id = mod_num if mod_num == 'overview' else mod_num_to_id(mod_num)

        # Determine folder
        if mod_num == 'overview':
            folder = 'overview_20min'
        elif mod_num == '3b':
            folder = MODULE_FOLDERS.get('mai', 'mai_ai_assistant')
        else:
            folder = MODULE_FOLDERS.get(mod_id, '')

        # If folder not in known dict, try to find on disk
        if not folder and CORE_CONTENT_DIR.exists():
            for d in CORE_CONTENT_DIR.iterdir():
                if d.is_dir() and folder_to_mod_id(d.name) == mod_id:
                    folder = d.name
                    break

        # Overview module has its own name (not in MODULE_NAMES dicts)
        if mod_num == 'overview':
            name_en = 'FASTR 20-Minute Overview'
            name_fr = 'Aperçu FASTR en 20 minutes'
        else:
            name_en = MODULE_NAMES_EN.get(mod_num, f'Module {mod_num}')
            name_fr = MODULE_NAMES_FR.get(mod_num, name_en)

        entry = {
            'id': mod_id,
            'number': mod_num,
            'folder': folder,
            'name': {
                'en': name_en,
                'fr': name_fr,
            },
        }

        # Add AI context if available
        ai_key = mod_num
        if ai_key in MODULE_AI_CONTEXT:
            entry['ai_context'] = MODULE_AI_CONTEXT[ai_key]

        modules.append(entry)

    return {'modules': modules}


def validate(modules_data):
    """Validate generated metadata against filesystem."""
    errors = []
    warnings = []

    for mod in modules_data['modules']:
        folder = mod['folder']
        mod_id = mod['id']

        # Check EN folder exists
        en_path = CORE_CONTENT_DIR / folder
        if not en_path.exists():
            if mod_id != 'overview':
                warnings.append(f"  EN folder missing: {folder}")
            continue

        # Check _meta.yaml was generated
        meta_path = en_path / '_meta.yaml'
        if not meta_path.exists():
            errors.append(f"  _meta.yaml not generated for {folder}")
            continue

        # Check all .md files are listed in _meta.yaml
        meta = yaml.safe_load(meta_path.read_text())
        meta_files = {s['file'] for s in meta.get('slides', [])}
        disk_files = {f.name for f in en_path.glob('*.md')}

        unlisted = disk_files - meta_files
        if unlisted:
            errors.append(f"  {folder}: files on disk not in _meta.yaml: {unlisted}")

        stale = meta_files - disk_files
        if stale:
            errors.append(f"  {folder}: files in _meta.yaml not on disk: {stale}")

    # Check FR _meta.yaml too
    if CORE_CONTENT_FR_DIR.exists():
        for d in CORE_CONTENT_FR_DIR.iterdir():
            if not d.is_dir():
                continue
            meta_path = d / '_meta.yaml'
            if not meta_path.exists():
                continue
            meta = yaml.safe_load(meta_path.read_text())
            meta_files = {s['file'] for s in meta.get('slides', [])}
            disk_files = {f.name for f in d.glob('*.md')}
            unlisted = disk_files - meta_files
            if unlisted:
                errors.append(f"  {d.name} (FR): files on disk not in _meta.yaml: {unlisted}")
            stale = meta_files - disk_files
            if stale:
                errors.append(f"  {d.name} (FR): files in _meta.yaml not on disk: {stale}")

    # Report translation gaps
    en_folders = {d.name for d in CORE_CONTENT_DIR.iterdir() if d.is_dir()} if CORE_CONTENT_DIR.exists() else set()
    fr_folders = {d.name for d in CORE_CONTENT_FR_DIR.iterdir() if d.is_dir()} if CORE_CONTENT_FR_DIR.exists() else set()

    missing_fr = en_folders - fr_folders
    if missing_fr:
        warnings.append(f"  EN modules without FR translation: {missing_fr}")

    extra_fr = fr_folders - en_folders
    if extra_fr:
        warnings.append(f"  FR-only modules (no EN equivalent): {extra_fr}")

    return errors, warnings


def main():
    print('=' * 60)
    print('  FASTR Metadata Migration')
    print('=' * 60)

    # 1. Generate modules.yaml
    print('\n--- Generating modules.yaml ---')
    modules_data = build_modules_yaml()
    modules_path = PROJECT_ROOT / 'modules.yaml'
    with open(modules_path, 'w', encoding='utf-8') as f:
        yaml.dump(modules_data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
    print(f'  Written {len(modules_data["modules"])} module definitions to modules.yaml')

    # 2. Generate _meta.yaml for each module folder
    print('\n--- Generating _meta.yaml files ---')
    meta_count = 0

    for content_dir in [CORE_CONTENT_DIR, CORE_CONTENT_FR_DIR]:
        if not content_dir.exists():
            continue
        label = 'EN' if content_dir == CORE_CONTENT_DIR else 'FR'
        for module_dir in sorted(content_dir.iterdir()):
            if not module_dir.is_dir():
                continue

            mod_id = folder_to_mod_id(module_dir.name)
            if not mod_id:
                print(f'  SKIP: {module_dir.name} (unrecognized folder pattern)')
                continue

            md_files = list(module_dir.glob('*.md'))
            if not md_files:
                continue

            meta = build_meta_yaml(module_dir, mod_id)
            meta_path = module_dir / '_meta.yaml'
            with open(meta_path, 'w', encoding='utf-8') as f:
                yaml.dump(meta, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
            print(f'  {label}: {module_dir.name}/_meta.yaml ({len(meta["slides"])} slides)')
            meta_count += 1

    print(f'\n  Generated {meta_count} _meta.yaml files')

    # 3. Validate
    print('\n--- Validating ---')
    errors, warnings = validate(modules_data)

    if warnings:
        print('\n  Warnings:')
        for w in warnings:
            print(f'    {w}')

    if errors:
        print('\n  ERRORS:')
        for e in errors:
            print(f'    {e}')
        print(f'\n  {len(errors)} error(s) found')
        return 1

    print('  All checks passed!')
    print('\n' + '=' * 60)
    return 0


if __name__ == '__main__':
    sys.exit(main())
