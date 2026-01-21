#!/usr/bin/env python3
"""
FASTR Translation Module
Translates markdown content using DeepL API with caching.

Usage:
    from translate import translate_content, translate_file

    # Translate a string
    french_text = translate_content(english_text, target_lang='FR')

    # Translate a file
    translate_file('input.md', 'output.fr.md', target_lang='FR')

Setup:
    1. Sign up at https://www.deepl.com/pro-api (free tier available)
    2. Set environment variable: export DEEPL_API_KEY=your-key-here

Author: FASTR Project
"""

import os
import sys
import json
import hashlib
import re
from datetime import datetime
from pathlib import Path
from typing import Optional, Tuple, Dict

# Try to import yaml for glossary loading
try:
    import yaml
except ImportError:
    yaml = None

# Try to import requests, provide helpful error if not installed
try:
    import requests
except ImportError:
    print("Error: 'requests' library required. Install with: pip3 install requests")
    sys.exit(1)


# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

# DeepL API endpoints
DEEPL_API_URL = "https://api-free.deepl.com/v2/translate"  # Free tier
DEEPL_API_URL_PRO = "https://api.deepl.com/v2/translate"   # Pro tier

# Cache directory (relative to repo root)
CACHE_DIR = Path(__file__).parent.parent / ".translation_cache"

# Glossary file (relative to repo root)
GLOSSARY_FILE = Path(__file__).parent.parent / "translations" / "glossary.yml"

# Supported languages
SUPPORTED_LANGUAGES = {
    'FR': 'French',
    'ES': 'Spanish',
    'DE': 'German',
    'PT-BR': 'Portuguese (Brazilian)',
    'PT-PT': 'Portuguese (European)',
}


# ═══════════════════════════════════════════════════════════════════════════
# API KEY MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════════

def get_api_key() -> Optional[str]:
    """
    Get DeepL API key from environment or .env file.
    Returns None if not found.
    """
    # Check environment variable first
    api_key = os.environ.get('DEEPL_API_KEY')
    if api_key:
        return api_key

    # Check .env file in repo root
    env_file = Path(__file__).parent.parent / ".env"
    if env_file.exists():
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line.startswith('DEEPL_API_KEY='):
                    return line.split('=', 1)[1].strip().strip('"\'')

    return None


def validate_api_key(api_key: str) -> Tuple[bool, str]:
    """
    Validate the API key by checking usage.
    Returns (is_valid, message).
    """
    # Determine endpoint based on key format
    # Free keys end with ":fx"
    if api_key.endswith(':fx'):
        url = "https://api-free.deepl.com/v2/usage"
    else:
        url = "https://api.deepl.com/v2/usage"

    headers = {"Authorization": f"DeepL-Auth-Key {api_key}"}

    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            usage = response.json()
            char_count = usage.get('character_count', 0)
            char_limit = usage.get('character_limit', 500000)
            remaining = char_limit - char_count
            return True, f"Valid. {remaining:,} characters remaining this month."
        elif response.status_code == 403:
            return False, "Invalid API key."
        else:
            return False, f"API error: {response.status_code}"
    except Exception as e:
        return False, f"Connection error: {e}"


# ═══════════════════════════════════════════════════════════════════════════
# CACHING
# ═══════════════════════════════════════════════════════════════════════════

def get_cache_path(content_hash: str, target_lang: str) -> Path:
    """Get the cache file path for a given content hash and language."""
    cache_dir = CACHE_DIR / target_lang.lower()
    cache_dir.mkdir(parents=True, exist_ok=True)
    return cache_dir / f"{content_hash}.json"


def compute_hash(text: str) -> str:
    """Compute SHA-256 hash of text content."""
    return hashlib.sha256(text.encode('utf-8')).hexdigest()[:16]


def get_cached_translation(text: str, target_lang: str) -> Optional[str]:
    """
    Check if translation exists in cache.
    Returns translated text if found, None otherwise.
    """
    content_hash = compute_hash(text)
    cache_path = get_cache_path(content_hash, target_lang)

    if cache_path.exists():
        try:
            with open(cache_path, 'r', encoding='utf-8') as f:
                cache_entry = json.load(f)
                return cache_entry.get('translated_text')
        except (json.JSONDecodeError, IOError):
            # Invalid cache file, ignore
            pass

    return None


def save_to_cache(text: str, translated_text: str, target_lang: str) -> None:
    """Save translation to cache."""
    content_hash = compute_hash(text)
    cache_path = get_cache_path(content_hash, target_lang)

    cache_entry = {
        "source_hash": content_hash,
        "target_lang": target_lang,
        "translated_text": translated_text,
        "timestamp": datetime.now().isoformat(),
        "char_count": len(text)
    }

    with open(cache_path, 'w', encoding='utf-8') as f:
        json.dump(cache_entry, f, ensure_ascii=False, indent=2)


def clear_cache(target_lang: Optional[str] = None) -> int:
    """
    Clear translation cache.
    If target_lang is specified, only clear that language.
    Returns number of cache entries deleted.
    """
    count = 0

    if target_lang:
        cache_dir = CACHE_DIR / target_lang.lower()
        if cache_dir.exists():
            for f in cache_dir.glob("*.json"):
                f.unlink()
                count += 1
    else:
        if CACHE_DIR.exists():
            for lang_dir in CACHE_DIR.iterdir():
                if lang_dir.is_dir():
                    for f in lang_dir.glob("*.json"):
                        f.unlink()
                        count += 1

    return count


# ═══════════════════════════════════════════════════════════════════════════
# MARKDOWN PROCESSING
# ═══════════════════════════════════════════════════════════════════════════

def extract_frontmatter(text: str) -> Tuple[str, str]:
    """
    Extract YAML frontmatter from markdown.
    Returns (frontmatter, remaining_text).
    Frontmatter is returned with delimiters intact.
    """
    if text.startswith('---'):
        # Find the closing ---
        match = re.match(r'^(---\n.*?\n---\n?)', text, re.DOTALL)
        if match:
            frontmatter = match.group(1)
            remaining = text[len(frontmatter):]
            return frontmatter, remaining

    return '', text


def protect_code_blocks(text: str) -> Tuple[str, dict]:
    """
    Replace code blocks, inline code, file paths, citations, and special commands
    with placeholders to protect from translation.
    Returns (protected_text, placeholder_map).
    """
    placeholders = {}
    counter = [0]  # Use list to allow modification in nested function

    def replace_block(match):
        placeholder = f"__CODE_BLOCK_{counter[0]}__"
        placeholders[placeholder] = match.group(0)
        counter[0] += 1
        return placeholder

    def replace_path(match):
        # For images/links, only protect the path portion, not the alt text
        placeholder = f"__PATH_{counter[0]}__"
        placeholders[placeholder] = match.group(2)  # Just the path
        counter[0] += 1
        prefix = match.group(1)  # "![" or "["
        suffix = ")"
        return f"{prefix}{placeholder}{suffix}"

    def replace_citation(match):
        placeholder = f"__CITE_{counter[0]}__"
        placeholders[placeholder] = match.group(0)
        counter[0] += 1
        return placeholder

    def replace_command(match):
        placeholder = f"__CMD_{counter[0]}__"
        placeholders[placeholder] = match.group(0)
        counter[0] += 1
        return placeholder

    def replace_footnote(match):
        placeholder = f"__FN_{counter[0]}__"
        placeholders[placeholder] = match.group(0)
        counter[0] += 1
        return placeholder

    # Protect fenced code blocks (```...```)
    protected = re.sub(r'```[\s\S]*?```', replace_block, text)

    # Protect inline code (`...`)
    protected = re.sub(r'`[^`]+`', replace_block, protected)

    # Protect citation keys: [@key], [@key1; @key2], @key
    # Bracketed citations like [@rowe2009potential; @smith2020]
    protected = re.sub(r'\[@[^\]]+\]', replace_citation, protected)
    # Standalone citations like @rowe2009potential (word boundary after)
    protected = re.sub(r'@[a-zA-Z][a-zA-Z0-9_-]+(?=\s|[;,.\)\]]|$)', replace_citation, protected)

    # Protect footnote references: [^footnote_key]
    protected = re.sub(r'\[\^[^\]]+\]', replace_footnote, protected)

    # Protect LaTeX/mkdocs commands: \full_bibliography, \newpage, etc.
    protected = re.sub(r'\\[a-zA-Z_]+', replace_command, protected)

    # Protect markdown image paths: ![alt text](path/to/image.png)
    # Captures: group(1)=![alt text](  group(2)=path/to/image.png
    protected = re.sub(r'(!\[[^\]]*\]\()([^)]+)\)', replace_path, protected)

    # Protect markdown link paths that look like file paths (contain . or /)
    # Captures: group(1)=[text](  group(2)=path/or/url
    protected = re.sub(r'(\[[^\]]*\]\()([^)]*[./][^)]*)\)', replace_path, protected)

    # Protect HTML src attributes: src="path/to/file"
    def replace_src(match):
        placeholder = f"__SRC_{counter[0]}__"
        placeholders[placeholder] = match.group(1)
        counter[0] += 1
        return f'src="{placeholder}"'
    protected = re.sub(r'src="([^"]+)"', replace_src, protected)

    return protected, placeholders


def restore_code_blocks(text: str, placeholders: dict) -> str:
    """Restore code blocks, paths, and src attributes from placeholders."""
    for placeholder, original in placeholders.items():
        text = text.replace(placeholder, original)
    return text


# ═══════════════════════════════════════════════════════════════════════════
# GLOSSARY
# ═══════════════════════════════════════════════════════════════════════════

_glossary_cache: Dict[str, Dict[str, str]] = {}


def load_glossary(target_lang: str) -> Dict[str, str]:
    """
    Load glossary for target language.
    Returns dict mapping English terms to translated terms.
    """
    target_lang = target_lang.lower()

    # Return cached glossary if available
    if target_lang in _glossary_cache:
        return _glossary_cache[target_lang]

    # Check if yaml is available
    if yaml is None:
        return {}

    # Load glossary file
    if not GLOSSARY_FILE.exists():
        return {}

    try:
        with open(GLOSSARY_FILE, 'r', encoding='utf-8') as f:
            glossary_data = yaml.safe_load(f)

        if glossary_data and target_lang in glossary_data:
            _glossary_cache[target_lang] = glossary_data[target_lang]
            return _glossary_cache[target_lang]
    except Exception:
        pass

    return {}


def apply_glossary(text: str, target_lang: str) -> str:
    """
    Apply glossary corrections to translated text.
    Replaces terms that DeepL may have translated differently.
    """
    glossary = load_glossary(target_lang)

    if not glossary:
        return text

    # Sort by length (longest first) to avoid partial replacements
    sorted_terms = sorted(glossary.items(), key=lambda x: len(x[0]), reverse=True)

    for en_term, translated_term in sorted_terms:
        # Case-insensitive replacement while preserving boundaries
        # Use word boundaries to avoid replacing partial words
        pattern = re.compile(re.escape(en_term), re.IGNORECASE)
        text = pattern.sub(translated_term, text)

    return text


# ═══════════════════════════════════════════════════════════════════════════
# TRANSLATION
# ═══════════════════════════════════════════════════════════════════════════

def translate_text_deepl(text: str, target_lang: str, api_key: str) -> str:
    """
    Translate text using DeepL API.
    """
    # Determine endpoint based on key format
    if api_key.endswith(':fx'):
        url = DEEPL_API_URL
    else:
        url = DEEPL_API_URL_PRO

    headers = {
        "Authorization": f"DeepL-Auth-Key {api_key}",
        "Content-Type": "application/json"
    }

    data = {
        "text": [text],
        "target_lang": target_lang,
        "source_lang": "EN",
        "preserve_formatting": True,
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        result = response.json()
        return result['translations'][0]['text']
    elif response.status_code == 456:
        raise Exception("DeepL quota exceeded. Wait until next month or upgrade to Pro.")
    elif response.status_code == 403:
        raise Exception("Invalid DeepL API key.")
    else:
        raise Exception(f"DeepL API error: {response.status_code} - {response.text}")


def translate_content(
    text: str,
    target_lang: str = 'FR',
    use_cache: bool = True,
    api_key: Optional[str] = None
) -> str:
    """
    Translate markdown content to target language.

    Args:
        text: The markdown text to translate
        target_lang: Target language code (FR, ES, DE, etc.)
        use_cache: Whether to use translation cache
        api_key: Optional API key (uses env var if not provided)

    Returns:
        Translated text with markdown formatting preserved
    """
    if not text or not text.strip():
        return text

    target_lang = target_lang.upper()

    # Check cache first
    if use_cache:
        cached = get_cached_translation(text, target_lang)
        if cached:
            return cached

    # Get API key
    if not api_key:
        api_key = get_api_key()

    if not api_key:
        raise ValueError(
            "DeepL API key not found. Set DEEPL_API_KEY environment variable "
            "or create a .env file in the repository root."
        )

    # Extract frontmatter (don't translate YAML)
    frontmatter, body = extract_frontmatter(text)

    # Protect code blocks
    protected_body, placeholders = protect_code_blocks(body)

    # Translate the body
    translated_body = translate_text_deepl(protected_body, target_lang, api_key)

    # Restore code blocks
    translated_body = restore_code_blocks(translated_body, placeholders)

    # Apply glossary corrections (post-processing)
    translated_body = apply_glossary(translated_body, target_lang)

    # Recombine with frontmatter
    result = frontmatter + translated_body

    # Save to cache
    if use_cache:
        save_to_cache(text, result, target_lang)

    return result


def translate_file(
    input_path: str,
    output_path: str,
    target_lang: str = 'FR',
    use_cache: bool = True
) -> Tuple[bool, str]:
    """
    Translate a markdown file.

    Args:
        input_path: Path to input markdown file
        output_path: Path to output translated file
        target_lang: Target language code
        use_cache: Whether to use translation cache

    Returns:
        (success, message) tuple
    """
    try:
        # Read input file
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Translate
        translated = translate_content(content, target_lang, use_cache)

        # Write output file
        output_dir = Path(output_path).parent
        output_dir.mkdir(parents=True, exist_ok=True)

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(translated)

        return True, f"Translated to {output_path}"

    except Exception as e:
        return False, f"Error: {e}"


# ═══════════════════════════════════════════════════════════════════════════
# CLI
# ═══════════════════════════════════════════════════════════════════════════

def main():
    """Command-line interface for translation module."""
    import argparse

    parser = argparse.ArgumentParser(
        description="Translate markdown files using DeepL API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s --check                     Check API key and usage
  %(prog)s input.md output.fr.md       Translate file to French
  %(prog)s input.md -o output.md -l ES Translate to Spanish
  %(prog)s --clear-cache               Clear translation cache
        """
    )

    parser.add_argument('input', nargs='?', help='Input markdown file')
    parser.add_argument('output', nargs='?', help='Output markdown file')
    parser.add_argument('-o', '--output', dest='output_flag',
                        help='Output file (alternative syntax)')
    parser.add_argument('-l', '--lang', default='FR',
                        choices=list(SUPPORTED_LANGUAGES.keys()),
                        help='Target language (default: FR)')
    parser.add_argument('--check', action='store_true',
                        help='Check API key and show usage')
    parser.add_argument('--clear-cache', action='store_true',
                        help='Clear translation cache')
    parser.add_argument('--no-cache', action='store_true',
                        help='Skip cache (force re-translation)')

    args = parser.parse_args()

    # Check API key
    if args.check:
        api_key = get_api_key()
        if not api_key:
            print("No API key found.")
            print("\nSetup instructions:")
            print("1. Go to https://www.deepl.com/pro-api")
            print("2. Sign up for 'DeepL API Free' (no credit card required)")
            print("3. Get your API key from account settings")
            print("4. Set environment variable:")
            print("   export DEEPL_API_KEY=your-key-here")
            return 1

        is_valid, message = validate_api_key(api_key)
        if is_valid:
            print(f"API Key: {message}")
        else:
            print(f"API Key: {message}")
            return 1
        return 0

    # Clear cache
    if args.clear_cache:
        count = clear_cache(args.lang if args.lang != 'FR' else None)
        print(f"Cleared {count} cache entries.")
        return 0

    # Translate file
    if not args.input:
        parser.print_help()
        return 1

    output_path = args.output or args.output_flag
    if not output_path:
        # Default output: add language suffix
        base = Path(args.input).stem
        suffix = Path(args.input).suffix
        output_path = f"{base}.{args.lang.lower()}{suffix}"

    print(f"Translating {args.input} -> {output_path} ({SUPPORTED_LANGUAGES[args.lang]})")

    success, message = translate_file(
        args.input,
        output_path,
        args.lang,
        use_cache=not args.no_cache
    )

    if success:
        print(f"Done: {message}")
        return 0
    else:
        print(f"Error: {message}")
        return 1


if __name__ == '__main__':
    sys.exit(main())
