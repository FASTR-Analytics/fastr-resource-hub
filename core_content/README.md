# core_content/ — DO NOT HAND-EDIT

Auto-generated workshop slide library, one folder per module. **Source of truth
is `methodology/`** — fix there and re-extract.

## What this is

Every slide the web-app's deck builder can pick from. Files here are produced
by `tools/00_extract_slides.py` from the `<!-- SLIDE:m<id> -->` markers in
`methodology/<module>.md`. The French mirror lives at `core_content_fr/` and is
generated from `methodology/fr/<module>.md`.

A per-module `_meta.yaml` lists each slide's `file`, `order`, `variant`
(`full` / `condensed`), and `title` — that's what the web-app reads when
building a deck.

## Layout

```
core_content/
├── m0_introduction/
│   ├── _meta.yaml                        # ordered slide manifest for this module
│   ├── m0_0_what_are_we_trying_to_achieve.md
│   ├── m0_3_fastr_approach_rmncahn.md
│   └── …
├── m1_identify_questions_indicators/
├── m2_data_extraction/
├── … one folder per module …
└── mw_webinar/
```

`core_content_fr/` mirrors the same module folders + filenames in French.

## How to edit content

**You don't — edit `methodology/` and re-extract.**

```bash
# Edit methodology/<module>.md (and methodology/fr/<module>.md for FR)
python3 tools/00_extract_slides.py
python3 tools/00_extract_slides.py --lang fr
```

If you genuinely need to add/remove a slide structurally (rare — usually do this
via methodology + extract), update `_meta.yaml` to match the new file list and
keep `order` consistent.

## Gotchas

- `tools/00_extract_slides.py --prune` will delete any `core_content` file no
  longer produced by methodology. Inspect the diff before committing — drift
  between methodology and `core_content` is real and prune can nuke
  unrelated slides.
- Renaming a slide file means renaming its `<!-- SLIDE:m... -->` id upstream in
  methodology and updating `_meta.yaml`. Coordinate with the deck builder
  (`deckBuilder.ts`) and any handout pointer slides.
- The compact auto-tier (`tools/measure_overflow.mjs`) hashes content here to
  produce `tools/overflow_map.json`. Re-run after content edits.
- See [`../methodology/README.md`](../methodology/README.md) for the upstream
  workflow.
