#!/usr/bin/env python3
"""
Validate content consistency between methodology sources and core_content files.

USAGE:
    python3 tools/validate_content.py          # Check for issues
    python3 tools/validate_content.py --fix    # Auto-fix what can be fixed

Checks:
1. SLIDE markers in methodology that have no matching core_content file (orphaned markers)
2. Duplicate slides (same heading appearing in multiple modules)
3. Broken image references
4. EN slides missing FR translations and vice versa
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

PROJECT_ROOT = Path(__file__).resolve().parent.parent
METHODOLOGY_DIR = PROJECT_ROOT / 'methodology'
CORE_CONTENT_DIR = PROJECT_ROOT / 'core_content'
CORE_CONTENT_FR_DIR = PROJECT_ROOT / 'core_content_fr'
RESOURCES_DIR = PROJECT_ROOT / 'resources'

def find_slide_markers():
    """Find all SLIDE markers in methodology files."""
    markers = {}
    for md_file in METHODOLOGY_DIR.glob('*.md'):
        content = md_file.read_text()
        for match in re.finditer(r'<!-- SLIDE:([\w]+) -->(.*?)<!-- /SLIDE -->', content, re.DOTALL):
            slide_id = match.group(1)
            slide_content = match.group(2).strip()
            heading = ''
            heading_match = re.search(r'^##\s+(.+)$', slide_content, re.MULTILINE)
            if heading_match:
                heading = heading_match.group(1).strip()
            markers[slide_id] = {
                'source': md_file.name,
                'heading': heading,
                'content': slide_content,
            }
    return markers


def find_core_content_files(base_dir):
    """Find all slide files in a core_content directory."""
    files = {}
    if not base_dir.exists():
        return files
    for module_dir in sorted(base_dir.iterdir()):
        if not module_dir.is_dir():
            continue
        for md_file in sorted(module_dir.glob('*.md')):
            content = md_file.read_text()
            heading = ''
            heading_match = re.search(r'^##\s+(.+)$', content, re.MULTILINE)
            if heading_match:
                heading = heading_match.group(1).strip()
            rel_path = md_file.relative_to(base_dir)
            files[str(rel_path)] = {
                'path': md_file,
                'heading': heading,
                'content': content,
                'module': module_dir.name,
            }
    return files


def find_broken_images(base_dir):
    """Find broken image references in slide files."""
    broken = []
    for module_dir in sorted(base_dir.iterdir()):
        if not module_dir.is_dir():
            continue
        for md_file in sorted(module_dir.glob('*.md')):
            content = md_file.read_text()
            # Match ![...](path) but not URLs
            for match in re.finditer(r'!\[.*?\]\(([^)]+)\)', content):
                img_path = match.group(1)
                # Skip URLs
                if img_path.startswith('http://') or img_path.startswith('https://'):
                    continue
                # Strip Marp size hints (e.g., "h:300" or "w:600")
                clean_path = re.sub(r'\s+[hw]:\d+', '', img_path).strip()
                # Resolve relative to the markdown file
                resolved = (md_file.parent / clean_path).resolve()
                if not resolved.exists():
                    rel = md_file.relative_to(base_dir)
                    broken.append((str(rel), img_path, str(resolved)))
    return broken


def find_duplicates(en_files):
    """Find slides with identical headings across different modules."""
    heading_to_files = defaultdict(list)
    for rel_path, info in en_files.items():
        if info['heading']:
            heading_to_files[info['heading']].append(rel_path)
    return {h: paths for h, paths in heading_to_files.items() if len(paths) > 1}


def check_translations(en_files, fr_files):
    """Check for EN files missing FR translations."""
    missing_fr = []
    for rel_path in en_files:
        if rel_path not in fr_files:
            missing_fr.append(rel_path)
    missing_en = []
    for rel_path in fr_files:
        if rel_path not in en_files:
            missing_en.append(rel_path)
    return missing_fr, missing_en


def main():
    fix_mode = '--fix' in sys.argv
    issues = 0

    print('=' * 60)
    print('  FASTR Content Validation')
    print('=' * 60)

    # 1. Check for orphaned SLIDE markers
    print('\n--- Checking SLIDE markers in methodology ---')
    markers = find_slide_markers()
    en_files = find_core_content_files(CORE_CONTENT_DIR)

    orphaned = []
    for slide_id, info in markers.items():
        # Check if any core_content file matches this slide ID
        found = False
        for rel_path in en_files:
            filename = Path(rel_path).name
            if filename.startswith(slide_id + '_') or filename == slide_id + '.md':
                found = True
                break
        if not found:
            orphaned.append((slide_id, info))

    if orphaned:
        print(f'\n  WARNING: {len(orphaned)} orphaned SLIDE marker(s) in methodology')
        print('  These markers exist in methodology but have no core_content file.')
        print('  They will be recreated if the extraction script runs!\n')
        for slide_id, info in orphaned:
            print(f'    SLIDE:{slide_id} in {info["source"]}')
            if info['heading']:
                print(f'      Heading: "{info["heading"]}"')
            if fix_mode:
                # Remove the marker from the methodology file
                src_path = METHODOLOGY_DIR / info['source']
                content = src_path.read_text()
                pattern = rf'<!-- SLIDE:{re.escape(slide_id)} -->.*?<!-- /SLIDE -->\s*'
                new_content = re.sub(pattern, '', content, flags=re.DOTALL)
                if new_content != content:
                    src_path.write_text(new_content)
                    print(f'      FIXED: Removed marker from {info["source"]}')
        issues += len(orphaned)
    else:
        print('  OK: All SLIDE markers have matching core_content files')

    # 2. Check for duplicate headings
    print('\n--- Checking for duplicate slides ---')
    duplicates = find_duplicates(en_files)
    if duplicates:
        print(f'\n  WARNING: {len(duplicates)} heading(s) appear in multiple modules:\n')
        for heading, paths in duplicates.items():
            print(f'    "{heading}"')
            for p in paths:
                print(f'      - {p}')
        issues += len(duplicates)
    else:
        print('  OK: No duplicate headings across modules')

    # 3. Check for broken images
    print('\n--- Checking for broken image references (EN) ---')
    broken_en = find_broken_images(CORE_CONTENT_DIR)
    if broken_en:
        print(f'\n  WARNING: {len(broken_en)} broken image reference(s):\n')
        for rel_path, img_ref, resolved in broken_en:
            print(f'    {rel_path}')
            print(f'      -> {img_ref}')
        issues += len(broken_en)
    else:
        print('  OK: All image references resolve')

    print('\n--- Checking for broken image references (FR) ---')
    broken_fr = find_broken_images(CORE_CONTENT_FR_DIR)
    if broken_fr:
        print(f'\n  WARNING: {len(broken_fr)} broken image reference(s):\n')
        for rel_path, img_ref, resolved in broken_fr:
            print(f'    {rel_path}')
            print(f'      -> {img_ref}')
        issues += len(broken_fr)
    else:
        print('  OK: All image references resolve')

    # 4. Check translations
    print('\n--- Checking EN/FR translation coverage ---')
    fr_files = find_core_content_files(CORE_CONTENT_FR_DIR)
    missing_fr, missing_en = check_translations(en_files, fr_files)
    if missing_fr:
        print(f'\n  INFO: {len(missing_fr)} EN file(s) without FR translation:')
        for p in sorted(missing_fr)[:20]:
            print(f'    {p}')
        if len(missing_fr) > 20:
            print(f'    ... and {len(missing_fr) - 20} more')
    if missing_en:
        print(f'\n  WARNING: {len(missing_en)} FR file(s) without EN equivalent:')
        for p in sorted(missing_en):
            print(f'    {p}')
        issues += len(missing_en)
    if not missing_fr and not missing_en:
        print('  OK: Full translation coverage')

    # Summary
    print('\n' + '=' * 60)
    if issues:
        print(f'  {issues} issue(s) found')
        if not fix_mode:
            print('  Run with --fix to auto-fix orphaned markers')
    else:
        print('  All checks passed!')
    print('=' * 60)

    return 1 if issues else 0


if __name__ == '__main__':
    sys.exit(main())
