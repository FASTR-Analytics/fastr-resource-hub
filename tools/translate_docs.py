#!/usr/bin/env python3
"""
FASTR Documentation Translation Script

SAFETY: Files marked with <!-- REVIEWED --> are protected.
        New sections are appended, existing content never overwritten.

Usage:
    python3 tools/translate_docs.py --lang fr
    python3 tools/translate_docs.py --lang fr --status
    python3 tools/translate_docs.py --lang fr --dry-run

Workflow:
    1. Run translation → creates fr/file.md files in language folder
    2. Human reviews and edits French file
    3. Human adds <!-- REVIEWED --> at top
    4. Future runs:
       - SKIP if no changes in English
       - APPEND if new sections added to English
       - NEVER overwrite reviewed content

Author: FASTR Project
"""

import os
import sys
import re
import argparse
from pathlib import Path

# Add tools directory to path for translate module
sys.path.insert(0, str(Path(__file__).parent))
from translate import translate_content, get_api_key, validate_api_key

# Directories
REPO_ROOT = Path(__file__).parent.parent
METHODOLOGY_DOCS = REPO_ROOT / "methodology"

# Markers
REVIEWED_MARKER = "<!-- REVIEWED -->"
NEW_CONTENT_MARKER = "<!-- NEW CONTENT - needs review -->"

# Language folder names (for folder-based i18n structure)
LANG_FOLDERS = ['fr', 'es', 'de', 'pt']

# Legacy language suffix patterns (for backwards compatibility detection)
LANG_SUFFIXES = ['.fr.', '.es.', '.de.', '.pt.']


def extract_headings(content: str) -> set:
    """Extract all markdown headings from content."""
    headings = set()
    for line in content.split('\n'):
        match = re.match(r'^(#{1,6})\s+(.+)$', line.strip())
        if match:
            level = len(match.group(1))
            text = match.group(2).strip()
            headings.add((level, text))
    return headings


def extract_sections_by_heading(content: str) -> dict:
    """
    Parse content into sections keyed by heading.
    Returns {(level, heading_text): section_content}
    """
    lines = content.split('\n')
    sections = {}
    current_heading = None
    current_content = []

    for line in lines:
        match = re.match(r'^(#{1,6})\s+(.+)$', line.strip())
        if match:
            # Save previous section
            if current_heading:
                sections[current_heading] = '\n'.join(current_content).strip()
            # Start new section
            level = len(match.group(1))
            text = match.group(2).strip()
            current_heading = (level, text)
            current_content = [line]
        else:
            current_content.append(line)

    # Save last section
    if current_heading:
        sections[current_heading] = '\n'.join(current_content).strip()

    return sections


def is_reviewed(file_path: Path) -> bool:
    """Check if file has been marked as reviewed."""
    if not file_path.exists():
        return False
    with open(file_path, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f):
            if i > 10:
                break
            if REVIEWED_MARKER in line:
                return True
    return False


def get_translatable_files(docs_dir: Path) -> list:
    """Get list of English markdown files (excludes language folders and legacy suffixes)."""
    files = []
    for md_file in docs_dir.rglob("*.md"):
        # Skip files in language folders (e.g., fr/, es/)
        rel_parts = md_file.relative_to(docs_dir).parts
        if rel_parts and rel_parts[0] in LANG_FOLDERS:
            continue
        # Skip legacy suffix files (e.g., file.fr.md)
        is_translation = any(suffix in md_file.name for suffix in LANG_SUFFIXES)
        if is_translation:
            continue
        files.append(md_file)
    return sorted(files)


def get_output_path(input_path: Path, target_lang: str, docs_dir: Path = None) -> Path:
    """Get output path using folder structure: input.md -> fr/input.md"""
    if docs_dir is None:
        docs_dir = METHODOLOGY_DOCS
    # Get relative path from docs_dir
    try:
        rel_path = input_path.relative_to(docs_dir)
    except ValueError:
        rel_path = Path(input_path.name)
    # Output to language subfolder
    return docs_dir / target_lang.lower() / rel_path


def find_new_sections(en_content: str, fr_content: str) -> list:
    """
    Find sections in English that don't exist in French.
    Returns list of (level, heading, content) tuples.
    """
    en_sections = extract_sections_by_heading(en_content)
    fr_headings = extract_headings(fr_content)

    new_sections = []
    for (level, heading), content in en_sections.items():
        if (level, heading) not in fr_headings:
            new_sections.append((level, heading, content))

    return new_sections


def translate_file_full(input_path: Path, output_path: Path, target_lang: str) -> tuple:
    """Full translation of a file."""
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()

        translated = translate_content(content, target_lang.upper())

        header = f"<!-- AUTO-TRANSLATED from {input_path.name} -->\n"
        header += "<!-- Add REVIEWED marker after human review to protect from overwrite -->\n\n"

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(header + translated)

        return True, "Translated"

    except Exception as e:
        return False, f"Error: {e}"


def append_new_sections(input_path: Path, output_path: Path, target_lang: str) -> tuple:
    """
    Find new sections in English and append translations to French file.
    Returns (success, message, count).
    """
    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            en_content = f.read()
        with open(output_path, 'r', encoding='utf-8') as f:
            fr_content = f.read()

        new_sections = find_new_sections(en_content, fr_content)

        if not new_sections:
            return True, "Up to date", 0

        # Translate new sections
        new_content_parts = []
        for level, heading, content in new_sections:
            new_content_parts.append(content)

        combined_new = "\n\n".join(new_content_parts)
        translated_new = translate_content(combined_new, target_lang.upper())

        # Append to French file
        with open(output_path, 'a', encoding='utf-8') as f:
            f.write(f"\n\n{NEW_CONTENT_MARKER}\n\n")
            f.write(translated_new)

        section_names = [h for (l, h, c) in new_sections[:3]]
        more = f" (+{len(new_sections)-3} more)" if len(new_sections) > 3 else ""
        return True, f"Appended: {', '.join(section_names)}{more}", len(new_sections)

    except Exception as e:
        return False, f"Error: {e}", 0


def main():
    parser = argparse.ArgumentParser(
        description="Translate FASTR docs with protection for reviewed content",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
How it works:
  ┌─────────────────────────────────────────────────────────────┐
  │ File Status          │ Action                               │
  ├─────────────────────────────────────────────────────────────┤
  │ No fr/file.md exists │ Full translation                     │
  │ fr/file.md, no marker│ Re-translate (overwrite)             │
  │ fr/file.md + REVIEWED│ Check for new EN sections → append   │
  └─────────────────────────────────────────────────────────────┘

Workflow:
  1. python3 tools/translate_docs.py --lang fr
  2. Human reviews French files
  3. Add <!-- REVIEWED --> at top of reviewed files
  4. When English is updated with new sections, re-run:
     → New sections translated and appended
     → Existing reviewed content untouched

Examples:
  %(prog)s --lang fr                    Translate/update all docs
  %(prog)s --lang fr --status           Show status of all files
  %(prog)s --lang fr --dry-run          Preview without changes
        """
    )

    parser.add_argument('--lang', '-l', required=True,
                        choices=['fr', 'es', 'de', 'pt'],
                        help='Target language')
    parser.add_argument('--file', '-f',
                        help='Process specific file only')
    parser.add_argument('--status', '-s', action='store_true',
                        help='Show translation/review status')
    parser.add_argument('--dry-run', '-n', action='store_true',
                        help='Preview without making changes')
    parser.add_argument('--force', action='store_true',
                        help='Force full re-translate (OVERWRITES reviewed files)')
    parser.add_argument('--docs-dir', '-d',
                        help=f'Docs directory (default: {METHODOLOGY_DOCS})')

    args = parser.parse_args()

    # Check API key
    if not args.status:
        api_key = get_api_key()
        if not api_key:
            print("Error: No DeepL API key found.")
            return 1
        if not args.dry_run:
            is_valid, message = validate_api_key(api_key)
            if not is_valid:
                print(f"Error: {message}")
                return 1
            print(f"API Key: {message}\n")

    docs_dir = Path(args.docs_dir) if args.docs_dir else METHODOLOGY_DOCS
    if not docs_dir.exists():
        print(f"Error: Directory not found: {docs_dir}")
        return 1

    target_lang = args.lang.lower()

    # Get files
    if args.file:
        input_path = Path(args.file)
        if not input_path.is_absolute():
            input_path = docs_dir / input_path
        if not input_path.exists():
            print(f"Error: File not found: {input_path}")
            return 1
        files = [input_path]
    else:
        files = get_translatable_files(docs_dir)

    if not files:
        print("No files found.")
        return 0

    # Status mode
    if args.status:
        print(f"Translation status ({target_lang.upper()}):\n")

        for input_path in files:
            output_path = get_output_path(input_path, target_lang, docs_dir)

            if not output_path.exists():
                print(f"  ○ {input_path.name} → not translated (would create {output_path.relative_to(docs_dir)})")
            else:
                reviewed = is_reviewed(output_path)

                # Check for new sections
                with open(input_path, 'r') as f:
                    en_content = f.read()
                with open(output_path, 'r') as f:
                    fr_content = f.read()
                new_sections = find_new_sections(en_content, fr_content)

                if reviewed:
                    if new_sections:
                        print(f"  ⚡ {input_path.name} → REVIEWED + {len(new_sections)} new section(s) in EN")
                        for (l, h, c) in new_sections[:3]:
                            print(f"       + {h}")
                        if len(new_sections) > 3:
                            print(f"       + ... and {len(new_sections)-3} more")
                    else:
                        print(f"  ✓ {input_path.name} → REVIEWED (up to date)")
                else:
                    if new_sections:
                        print(f"  ⚠ {input_path.name} → needs review + {len(new_sections)} new")
                    else:
                        print(f"  ⚠ {input_path.name} → needs review")

        print("\n" + "─" * 50)
        print("Legend:")
        print("  ○  Not translated yet")
        print("  ⚠  Translated but not reviewed (will be overwritten)")
        print("  ✓  Reviewed and protected")
        print("  ⚡ Reviewed + new English sections (will be appended)")
        return 0

    # Translation mode
    print(f"Translating to {target_lang.upper()}...")
    print("─" * 50)

    stats = {"translated": 0, "appended": 0, "skipped": 0, "errors": 0}

    for input_path in files:
        output_path = get_output_path(input_path, target_lang, docs_dir)
        reviewed = is_reviewed(output_path)

        # Force mode - full re-translate
        if args.force:
            if args.dry_run:
                print(f"  → {input_path.name}: would force re-translate")
                stats["translated"] += 1
            else:
                success, msg = translate_file_full(input_path, output_path, target_lang)
                print(f"  {'✓' if success else '✗'} {input_path.name}: {msg}")
                stats["translated" if success else "errors"] += 1
            continue

        # New file - full translate
        if not output_path.exists():
            if args.dry_run:
                print(f"  → {input_path.name}: would translate (new)")
                stats["translated"] += 1
            else:
                success, msg = translate_file_full(input_path, output_path, target_lang)
                print(f"  {'✓' if success else '✗'} {input_path.name}: {msg}")
                stats["translated" if success else "errors"] += 1
            continue

        # Reviewed file - check for new sections to append
        if reviewed:
            with open(input_path, 'r') as f:
                en_content = f.read()
            with open(output_path, 'r') as f:
                fr_content = f.read()
            new_sections = find_new_sections(en_content, fr_content)

            if not new_sections:
                print(f"  ✓ {input_path.name}: REVIEWED (up to date)")
                stats["skipped"] += 1
            else:
                if args.dry_run:
                    print(f"  → {input_path.name}: would append {len(new_sections)} new section(s)")
                    stats["appended"] += 1
                else:
                    success, msg, count = append_new_sections(input_path, output_path, target_lang)
                    print(f"  {'⚡' if success else '✗'} {input_path.name}: {msg}")
                    stats["appended" if success else "errors"] += 1
            continue

        # Not reviewed - full re-translate
        if args.dry_run:
            print(f"  → {input_path.name}: would re-translate (not reviewed)")
            stats["translated"] += 1
        else:
            success, msg = translate_file_full(input_path, output_path, target_lang)
            print(f"  {'✓' if success else '✗'} {input_path.name}: {msg}")
            stats["translated" if success else "errors"] += 1

    print("─" * 50)
    parts = []
    if stats["translated"]:
        parts.append(f"{stats['translated']} translated")
    if stats["appended"]:
        parts.append(f"{stats['appended']} appended")
    if stats["skipped"]:
        parts.append(f"{stats['skipped']} up to date")
    if stats["errors"]:
        parts.append(f"{stats['errors']} errors")
    print(f"Done: {', '.join(parts) or 'nothing to do'}")

    if args.dry_run:
        print("\n(Dry run - no files modified)")

    return 0 if stats["errors"] == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
