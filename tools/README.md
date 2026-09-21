# tools/

Scripts that build, validate, and maintain the FASTR content pipeline.

## What this is

A grab-bag of small CLIs for extracting slides, building handout PDFs,
validating content, measuring slide overflow, and regenerating
catalogs/metadata. Most are Python (`*.py`); a few are Node (`*.mjs`) or
shell (`*.sh`). Run them from the repo root.

## Index

### Content extraction & metadata

| Script | What it does |
|--------|--------------|
| `00_extract_slides.py` | Extract slides from `methodology/` → `core_content/`. `--prune` removes stale files; `--lang fr` for the FR mirror. |
| `migrate_to_meta.py` | Generate / regenerate `modules.yaml` and per-module `_meta.yaml`. |
| `generate_catalog.py` | Regenerate the human-readable `CATALOG.md`. |
| `validate_content.py` | Validate content + drift guard (flags `core_content` slides with no methodology source, id collisions). |
| `check_content_freshness.py` | Surface stale slides across the curriculum. |

### Slide rendering & overflow

| Script | What it does |
|--------|--------------|
| `check_overflow.mjs` | Render a deck markdown and report slides taller than the 720px box. |
| `measure_overflow.mjs` | Render every `core_content` slide, classify which can be rescued by `.compact`, write `tools/overflow_map.json`. Re-run after editing slide content or the theme. |
| `check_slide_overflow.mjs` | Older overflow detector — superseded by `check_overflow.mjs`. |

### Handouts

| Script | What it does |
|--------|--------------|
| `build_handout_pdfs.py` | Build every handout PDF into `handouts/_out/<lang>/<module>/NN_*.pdf`. `--lang en`, `--module m7` to scope. |
| `render_handout.sh` | Render one handout `.md` to A4 PDF via Marp CLI. |

### Diagrams & translation

| Script | What it does |
|--------|--------------|
| `build_fastr_diagrams.py` | Generate translatable FASTR diagrams from the official GFF SVGs. |
| `translate.py`, `translate_docs.py` | Auto-translate methodology / docs to French. |

### Platform drift

| Script | What it does |
|--------|--------------|
| `check_platform_drift.py` | Compare the FASTR platform and modules repos (CHANGELOG + commits) with the last-seen state in `.github/platform_watch_state.json`, group the user-facing entries by content area (`CONTENT_MAP`), and open one labelled `platform-drift` issue listing the handouts / slides likely affected. Run weekly by `.github/workflows/platform-drift-check.yml`; needs `GH_TOKEN`. |

The workflow then runs a Claude Code triage job (`.github/drift_triage_prompt.md`)
that greps the repo for the old labels, edits handouts and methodology on a
`drift/issue-N` branch and opens a pull request for a human to merge, or closes
the issue when nothing is affected. It only checks the entries listed in that
issue; changes older than the last check are not revisited, so do a full audit
against the platform CHANGELOG now and then (last one: September 2026, see the
`platform_staleness` notes in git history). Secrets: `ANTHROPIC_API_KEY`
(required, otherwise the triage step is skipped and the issue still opens) and
`DRIFT_PR_TOKEN` (optional fine-grained PAT with contents + pull-requests write;
without it the organization blocks `GITHUB_TOKEN` from creating PRs and the job
posts a compare link on the issue instead). Re-triage an existing issue from the
Actions tab with "Run workflow" and the `issue_number` input.

## How to add a script

1. Drop it in `tools/` with a clear verb-noun filename.
2. **First line of the docstring is mandatory** — a one-sentence purpose, so it
   can be auto-listed here.
3. `argparse` for any options; `--help` should explain everything.
4. Add a row to the relevant table above.

## Gotchas

- `00_extract_slides.py --prune` can delete a lot if `core_content/` has drifted
  from `methodology/`. Inspect the diff before committing.
- `measure_overflow.mjs` resolves `@marp-team/marp-core` from `web-app/`'s
  `node_modules` (via `createRequire`) and Playwright from `/tmp/node_modules` —
  both must be installed.
- Most scripts assume the repo root as CWD; running from `tools/` may break
  relative paths.
