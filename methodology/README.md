# methodology/

The single source of truth for FASTR methodology content. Edits here propagate
everywhere else.

## What this is

The canonical methodology documentation, authored in Markdown. From this folder:

- The public documentation site at **<https://fastr-analytics.org>** is built
  from [`FASTR-Analytics/site`](https://github.com/FASTR-Analytics/site), which
  vendors this folder via `pnpm sync:methodology` (see `sync-methodology.ts` in
  that repo).
- The workshop **slide library** (`core_content/` and `core_content_fr/`) is
  extracted by `tools/00_extract_slides.py`.
- **The local MkDocs build is retired.** `mkdocs.yml` still exists, but it now
  serves a redirect to fastr-analytics.org (`javascripts/redirect.js` +
  `overrides/main.html`). Don't add new MkDocs features — fix content here and
  it lands on the new site on the next sync.

So a change here flows into two live downstream surfaces — fix once, ripple out.

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
4. To preview your edit, push and watch the
   [site repo's](https://github.com/FASTR-Analytics/site) next
   `pnpm sync:methodology` pick it up, or run the site locally per its README.

## Key commands

```bash
python3 tools/00_extract_slides.py [--lang fr]     # re-extract slides
python3 tools/validate_content.py                  # drift guard
```

(Local docs preview now lives in the [site repo](https://github.com/FASTR-Analytics/site) — see its README.)

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
