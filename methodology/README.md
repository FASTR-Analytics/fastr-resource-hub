# methodology/

The single source of truth for FASTR methodology content. Edits here propagate
everywhere else.

## What this is

The canonical methodology documentation, authored in Markdown. From this folder:

- The **MkDocs site** is built (config in `mkdocs.yml`).
- The workshop **slide library** (`core_content/` and `core_content_fr/`) is
  extracted by `tools/00_extract_slides.py`.
- The methodology section of the **marketing site**
  ([`FASTR-Analytics/site`](https://github.com/FASTR-Analytics/site)) is vendored
  via `pnpm sync:methodology` from this same source.

So a change here flows into three downstream surfaces — fix once, ripple out.

## Layout

```
methodology/
├── 00_introduction.md             # one file per module — slide markers + content
├── 01_identify_questions_indicators.md
├── …
├── 11_user_guide.md
├── executive_summary.md           # site-level pages
├── disclaimer.md
├── index.md
├── mkdocs.yml                     # MkDocs site config
├── javascripts/                   # site enhancements
└── fr/                            # French mirror — same filenames, translated
```

Slide boundaries are marked with HTML comments the extractor reads:

```markdown
<!-- SLIDE:m4_2 -->
## Indicator completeness

…slide content…
<!-- /SLIDE -->
```

The marker id (`m4_2`) becomes the slide filename in `core_content/`.

## How to add/edit

1. Edit the EN file in `methodology/` (the source of truth).
2. Update the FR mirror at `methodology/fr/<same-filename>` — there is no
   English fallback on the site.
3. Re-run extraction so the slide library and metadata stay in sync:
   ```bash
   python3 tools/00_extract_slides.py
   python3 tools/00_extract_slides.py --lang fr
   ```
4. Preview the MkDocs site locally:
   ```bash
   cd methodology && mkdocs serve     # http://localhost:8000
   ```

## Key commands

```bash
mkdocs serve                                       # local docs preview (from methodology/)
python3 tools/00_extract_slides.py [--lang fr]     # re-extract slides
python3 tools/validate_content.py                  # drift guard
```

## Gotchas

- **Never hand-edit `core_content/`** — it's regenerated from here. Fix here.
- `--prune` on the extractor is destructive when `core_content/` has drifted
  from `methodology/`. Inspect the diff before committing.
- Renaming a `<!-- SLIDE:xxx -->` id renames the extracted file and breaks
  `_meta.yaml`/deck references — coordinate carefully.
- The marketing site vendors this folder. Renaming files or directories without
  coordinating with `sync-methodology.ts` will break the public site.
- FR content is the actual translation — don't leave English placeholders in
  `methodology/fr/`.
