# French Translation & Multi-language Support

**Status: IMPLEMENTED**

See **[09_translation_workflow.md](09_translation_workflow.md)** for the complete user guide.

---

## What Was Implemented

### 1. Site Translation (mkdocs-static-i18n)

- Plugin configured in `methodology/mkdocs.yml`
- Language toggle (EN ↔ FR) in site header
- French nav labels configured
- French search enabled
- Fallback to English when French doesn't exist

### 2. Translation Tools

| Tool | Purpose |
|------|---------|
| `tools/translate.py` | Core DeepL translation module with caching |
| `tools/translate_docs.py` | Translate methodology docs with REVIEWED protection |
| Web app (language selector) | Build workshop decks in French |

### 3. REVIEWED Marker System

Files marked with `<!-- REVIEWED -->` are protected:
- Existing content never overwritten
- New English sections auto-translated and appended

---

## Quick Reference

```bash
# Check translation status
python3 tools/translate_docs.py --lang fr --status

# Translate methodology docs
python3 tools/translate_docs.py --lang fr

# Build French workshop deck: use the web app
# cd web-app && ./dev.sh start → select French language → Export

# Check DeepL API quota
python3 tools/translate.py --check
```

---

## File Structure

```
methodology/
├── executive_summary.md        # English (source)
├── executive_summary.fr.md     # French (translated)
└── ...

translations/
└── glossary.yml                # FASTR terminology (EN → FR)
```

---

## Next Steps

1. Translate remaining 11 methodology docs
2. Review each file and add `<!-- REVIEWED -->` marker
3. Keep English as source of truth, run translation when updated
