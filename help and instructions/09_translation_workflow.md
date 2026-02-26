# Translation Workflow Guide

## Overview

The FASTR project supports multilingual documentation using:
- **mkdocs-static-i18n plugin** for site structure (`.fr.md` suffix convention)
- **DeepL API** via `tools/translate_docs.py` for automated translation
- **REVIEWED marker system** to protect human-edited content from overwrite

## Quick Start

### Step 1: Set up DeepL API

1. Sign up at https://www.deepl.com/pro-api (free tier: 500,000 chars/month)
2. Get your API key from account settings
3. Create `.env` file in repository root:
   ```
   DEEPL_API_KEY=your-key-here
   ```

### Step 2: Check Translation Status

```bash
python3 tools/translate_docs.py --lang fr --status
```

**Output legend:**
- `○` Not translated yet
- `⚠` Translated but not reviewed (will be overwritten on re-run)
- `✓` Reviewed and protected
- `⚡` Reviewed + new English sections (new content will be appended)

### Step 3: Run Translation

```bash
# Translate all methodology docs
python3 tools/translate_docs.py --lang fr

# Translate specific file
python3 tools/translate_docs.py --lang fr --file 00_introduction.md

# Preview without making changes
python3 tools/translate_docs.py --lang fr --dry-run
```

---

## The REVIEWED Marker System

### Purpose

The `<!-- REVIEWED -->` marker protects human-edited translations from being overwritten.

### How It Works

| File State | What Happens on Re-run |
|------------|------------------------|
| No `.fr.md` exists | Full translation created |
| `.fr.md` exists, no marker | Complete re-translation (overwrites) |
| `.fr.md` with `<!-- REVIEWED -->` | New sections appended, existing content preserved |

### Workflow

1. **Initial Translation**: Run `translate_docs.py` to create `.fr.md` files
2. **Human Review**: Check the French translation for:
   - Technical accuracy (FASTR terminology)
   - Natural French phrasing
   - Proper formatting preservation
3. **Mark as Reviewed**: Add `<!-- REVIEWED -->` in the first 10 lines
4. **Ongoing Updates**: When English source is updated:
   - New sections auto-translated and appended with `<!-- NEW CONTENT - needs review -->`
   - Existing reviewed content is never modified

### Example File Header

```markdown
<!-- REVIEWED -->
<!-- Reviewed by [Name] on [Date] -->

# Résumé exécutif

...
```

---

## File Naming Convention

The mkdocs-static-i18n plugin uses suffix-based file structure:

```
methodology/
├── index.md                    # English (default)
├── index.fr.md                 # French
├── executive_summary.md        # English
├── executive_summary.fr.md     # French
└── ...
```

---

## Supported Languages

| Code | Language | Command |
|------|----------|---------|
| `fr` | French | `--lang fr` |
| `es` | Spanish | `--lang es` |
| `de` | German | `--lang de` |
| `pt` | Portuguese | `--lang pt` |

---

## Workshop Slides Translation

Workshop decks can be built in French using the web app:

1. Start the web app: `cd web-app && ./dev.sh start`
2. Open http://localhost:5173
3. Create or open a workshop
4. Select French as the language
5. Export to Markdown, PDF, or PowerPoint

The web app reads French content from `core_content_fr/` and uses French templates from `templates_fr/`.

---

## Troubleshooting

### Check API Key and Quota
```bash
python3 tools/translate.py --check
```

### Clear Translation Cache
```bash
python3 tools/translate.py --clear-cache
```

### Force Re-translation (Caution!)
```bash
# WARNING: Overwrites even REVIEWED files!
python3 tools/translate_docs.py --lang fr --force
```

---

## Translation Quality Tips

1. **Verify technical terms** - FASTR-specific terminology should be consistent
2. **Check code blocks** - Should remain unchanged
3. **Verify links** - Internal links should work in French context
4. **Tables and formatting** - Ensure markdown structure preserved
5. **Acronyms** - Consider whether to translate or keep English (e.g., RMNCAH-N → SRMNIA-N)

---

## References

- [DeepL API Documentation](https://www.deepl.com/docs-api)
- [mkdocs-static-i18n Plugin](https://ultrabug.github.io/mkdocs-static-i18n/)
- [Material for MkDocs i18n](https://squidfunk.github.io/mkdocs-material/setup/changing-the-language/)
