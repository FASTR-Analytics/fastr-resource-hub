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
5. Metadata consistency (_meta.yaml vs files on disk)
6. modules.yaml entries have existing folders
7. No duplicate order values within same variant in _meta.yaml
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

try:
    import yaml
    HAS_YAML = True
except ImportError:
    HAS_YAML = False

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


def check_meta_yaml(base_dir, label='EN'):
    """Check _meta.yaml consistency for all modules in a content directory."""
    issues = []
    if not base_dir.exists():
        return issues

    for module_dir in sorted(base_dir.iterdir()):
        if not module_dir.is_dir():
            continue

        meta_path = module_dir / '_meta.yaml'
        md_files = {f.name for f in module_dir.glob('*.md')}

        if not meta_path.exists():
            if md_files:
                issues.append(f'{label}: {module_dir.name} has {len(md_files)} .md files but no _meta.yaml')
            continue

        meta = yaml.safe_load(meta_path.read_text())
        if not meta or 'slides' not in meta:
            issues.append(f'{label}: {module_dir.name}/_meta.yaml is empty or malformed')
            continue

        meta_files = {s['file'] for s in meta['slides']}

        # Files on disk not listed in _meta.yaml
        unlisted = md_files - meta_files
        if unlisted:
            issues.append(f'{label}: {module_dir.name} has unlisted files: {", ".join(sorted(unlisted))}')

        # Stale entries in _meta.yaml (file doesn't exist)
        stale = meta_files - md_files
        if stale:
            issues.append(f'{label}: {module_dir.name}/_meta.yaml lists missing files: {", ".join(sorted(stale))}')

        # Duplicate order values within same variant
        by_variant = defaultdict(list)
        for s in meta['slides']:
            by_variant[s.get('variant', 'full')].append(s.get('order', 0))
        for variant, orders in by_variant.items():
            seen = defaultdict(int)
            for o in orders:
                seen[o] += 1
            dupes = [str(o) for o, count in seen.items() if count > 1]
            if dupes:
                issues.append(f'{label}: {module_dir.name} has duplicate order values in {variant}: {", ".join(dupes)}')

    return issues


def check_modules_yaml():
    """Check modules.yaml entries have existing folders."""
    issues = []
    modules_path = PROJECT_ROOT / 'modules.yaml'

    if not modules_path.exists():
        issues.append('modules.yaml not found at project root')
        return issues

    data = yaml.safe_load(modules_path.read_text())
    if not data or 'modules' not in data:
        issues.append('modules.yaml is empty or malformed')
        return issues

    for mod in data['modules']:
        folder = mod.get('folder', '')
        mod_id = mod.get('id', '?')
        en_path = CORE_CONTENT_DIR / folder
        fr_path = CORE_CONTENT_FR_DIR / folder

        if not en_path.exists() and not fr_path.exists():
            issues.append(f'modules.yaml: {mod_id} references folder "{folder}" which does not exist in EN or FR')

    return issues


def check_slide_density(content_dir):
    """Check slide content density and flag overflow risks.

    Guidelines (Marp 16:9 at 720px height):
    - Max ~12 visible bullet points per slide (with compact class ~16)
    - Content after a closing </div> of a columns layout risks overflow
    - Slides with 0 content elements (empty) are flagged
    - Very dense slides without 'compact' class are flagged
    """
    issues = []
    for module_dir in sorted(content_dir.iterdir()):
        if not module_dir.is_dir():
            continue
        for md_file in sorted(module_dir.glob('*.md')):
            content = md_file.read_text()
            rel_path = md_file.relative_to(PROJECT_ROOT)

            # Split into slides (--- separator)
            slides = re.split(r'^---\s*$', content, flags=re.MULTILINE)

            for slide_idx, slide in enumerate(slides):
                # Skip frontmatter (first section)
                if slide_idx == 0 and ('marp:' in slide or 'theme:' in slide):
                    continue

                # Strip presenter notes (HTML comments)
                visible = re.sub(r'<!--[\s\S]*?-->', '', slide).strip()
                if not visible:
                    continue

                has_compact = 'compact' in slide and '_class' in slide
                has_dense_table = 'dense-table' in slide

                # Count visible bullets
                bullets = len(re.findall(r'^\s*[-*]\s', visible, re.MULTILINE))
                # Count numbered list items
                numbered = len(re.findall(r'^\s*\d+\.\s', visible, re.MULTILINE))
                # Count bold section headers (like **1. Title**)
                bold_sections = len(re.findall(r'\*\*\d+\.', visible))
                total_items = bullets + numbered

                # Check for content after columns div closes
                # Find last </div> that closes a columns layout
                columns_match = re.search(
                    r'<div\s+class="(?:columns|columns-image-right|columns-text-left)[^"]*">'
                    r'[\s\S]*?</div>\s*</div>\s*\n+(.*)',
                    visible, re.DOTALL
                )
                if columns_match:
                    after_content = columns_match.group(1).strip()
                    if after_content and len(after_content) > 10:
                        if not has_compact:
                            issues.append(
                                f'{rel_path} (slide {slide_idx}): '
                                f'Content after columns div may overflow — '
                                f'consider adding compact class'
                            )

                # Check bullet density
                max_items = 16 if has_compact else 12
                if total_items > max_items:
                    issues.append(
                        f'{rel_path} (slide {slide_idx}): '
                        f'{total_items} list items (max {max_items}) — '
                        f'consider splitting into two slides'
                    )
                elif total_items > 10 and not has_compact and not has_dense_table:
                    issues.append(
                        f'{rel_path} (slide {slide_idx}): '
                        f'{total_items} list items without compact class — '
                        f'consider adding <!-- _class: compact -->'
                    )

    return issues


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

    # 1b. Reverse check (drift guard): core_content slides with NO methodology
    #     marker. These exist in core_content but not in methodology, so the
    #     docs are out of date and a re-extraction would lose them.
    print('\n--- Checking every core_content slide has a methodology source ---')

    def _mod_of(name):
        m = re.match(r'^(mai|m\d+)', name)
        return m.group(1) if m else None

    extracted_mods = {_mod_of(sid) for sid in markers}
    extracted_mods.discard(None)
    unsourced = []
    matches_per_marker = {}
    for rel_path in en_files:
        filename = Path(rel_path).name
        mod = _mod_of(filename)
        if mod not in extracted_mods:
            continue  # manually-managed module (e.g. m9*) — no methodology source expected
        matched = [sid for sid in markers
                   if filename.startswith(sid + '_') or filename == sid + '.md']
        if not matched:
            unsourced.append(rel_path)
        else:
            best = max(matched, key=len)
            matches_per_marker[best] = matches_per_marker.get(best, 0) + 1

    collisions = {sid: c for sid, c in matches_per_marker.items() if c > 1}
    if unsourced or collisions:
        if unsourced:
            print(f'\n  WARNING: {len(unsourced)} core_content slide(s) have NO methodology marker')
            print('  These live in core_content but not in methodology — methodology is out of date.')
            print('  Add a <!-- SLIDE:id --> block in the matching methodology/*.md (back-fill).\n')
            for rel_path in sorted(unsourced):
                print(f'    {rel_path}')
            issues += len(unsourced)
        if collisions:
            print(f'\n  WARNING: {len(collisions)} marker(s) map to multiple core_content files (id collision)')
            for sid, c in sorted(collisions.items()):
                print(f'    SLIDE:{sid} -> {c} files (each needs a unique id)')
            issues += len(collisions)
    else:
        print('  OK: every core_content slide has a methodology marker')

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

    # 5-7. Metadata checks (requires PyYAML)
    if HAS_YAML:
        print('\n--- Checking _meta.yaml consistency (EN) ---')
        meta_issues_en = check_meta_yaml(CORE_CONTENT_DIR, 'EN')
        if meta_issues_en:
            print(f'\n  WARNING: {len(meta_issues_en)} _meta.yaml issue(s):\n')
            for issue in meta_issues_en:
                print(f'    {issue}')
            issues += len(meta_issues_en)
        else:
            print('  OK: All _meta.yaml files consistent with disk')

        print('\n--- Checking _meta.yaml consistency (FR) ---')
        meta_issues_fr = check_meta_yaml(CORE_CONTENT_FR_DIR, 'FR')
        if meta_issues_fr:
            print(f'\n  WARNING: {len(meta_issues_fr)} _meta.yaml issue(s):\n')
            for issue in meta_issues_fr:
                print(f'    {issue}')
            issues += len(meta_issues_fr)
        else:
            print('  OK: All _meta.yaml files consistent with disk')

        print('\n--- Checking modules.yaml ---')
        mod_issues = check_modules_yaml()
        if mod_issues:
            print(f'\n  WARNING: {len(mod_issues)} modules.yaml issue(s):\n')
            for issue in mod_issues:
                print(f'    {issue}')
            issues += len(mod_issues)
        else:
            print('  OK: All modules.yaml entries valid')
    else:
        print('\n--- Skipping metadata checks (PyYAML not installed) ---')

    # 8. Slide density/balance audit
    print('\n--- Checking slide density and balance ---')
    density_issues = check_slide_density(CORE_CONTENT_DIR)
    if density_issues:
        print(f'\n  WARNING: {len(density_issues)} slide density issue(s):\n')
        for issue in density_issues:
            print(f'    {issue}')
        issues += len(density_issues)
    else:
        print('  OK: All slides within density guidelines')

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
