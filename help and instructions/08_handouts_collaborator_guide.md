# Collaborator guide — Handouts

This guide is for a teammate working on FASTR workshop handouts — drafting new ones, trimming existing ones for a specific workshop, or any mix of the two. It explains how the handout system is laid out and how to drive Claude Code through that work without anything landing on the live web app by accident.

---

## 1. The pipeline — methodology to PDF, and where Claude Code fits

The middle column is the pipeline. The right column shows what Claude Code
should do at each step.

```
┌──────────────────────────────────────────────────┐    Claude Code role
│  methodology/<NN>_<topic>.md                     │
│  Source of truth — hand-edited.                  │   READ — never write
│  Slides live as fenced sections inside chapters. │   unless Claire asks.
└────────────────────────┬─────────────────────────┘
                         │
                         │   tools/00_extract_slides.py
                         │   (automatic — re-run when methodology changes)
                         ▼
┌──────────────────────────────────────────────────┐
│  core_content/m{N}_*/                            │   READ ONLY.
│    m{N}_<name>.md     (full slide)               │   Auto-generated —
│    m{N}_s<name>.md    (condensed variant)        │   never hand-edit
└────────────────────────┬─────────────────────────┘   and never let
                         │                              Claude edit these.
                         │   Editorial step (your work, with Claude Code).
                         │   Claude reads the slide, the methodology chapter,
                         │   the audit row, and any existing handout for the
                         │   topic; produces handout markdown.
                         ▼
┌──────────────────────────────────────────────────┐
│  handouts/_drafts/<lang>/m{N}/                   │   WRITES HERE.
│    h_m{N}_<name>.md  (EN, FR, PT — same name)    │   Work-in-progress.
│                                                  │   Ignored by CI and
│                                                  │   the web app.
└────────────────────────┬─────────────────────────┘
                         │
                         │   Human review. When approved:
                         │     git mv handouts/_drafts/<lang>/m{N}/file.md
                         │            handouts/<lang>/m{N}/file.md
                         │   (for each of en, fr, pt) + add to _order.yaml
                         ▼
┌──────────────────────────────────────────────────┐
│  handouts/<lang>/<module>/                       │   DO NOT WRITE HERE.
│    h_m{N}_<name>.md                              │   Published location.
│                                                  │   We promote as a team
│                                                  │   once we decide it's
│                                                  │   worth putting on the
│                                                  │   web app.
└────────────────────────┬─────────────────────────┘
                         │
                         │   tools/render_handout.sh <file.md>             ┐
                         │     → single-file preview while you author       │  Claude RUNS
                         │   tools/build_handout_pdfs.py                    │  these scripts.
                         │     → booklet build, runs in CI on push to main  │
                         │     (Marp renders the markdown via headless     │
                         │      Chromium)                                   ┘
                         ▼
┌──────────────────────────────────────────────────┐
│  handouts/_out/<lang>/<module>/                  │   READ ONLY.
│    NN_<name>.pdf                                 │   Generated output.
└──────────────────────────────────────────────────┘
```

Two things to flag for Claude Code:

- **The only place Claude writes new content is
  `handouts/_drafts/<lang>/m{N}/`.** Everything else is either auto-generated
  (`core_content/`, `handouts/_out/`), promoted as a team
  (`handouts/<lang>/`), or canonical source needing human authorship
  (`methodology/`).
- **The only scripts Claude runs are `tools/render_handout.sh`,
  `tools/translate.py`, and (rarely) `tools/check_handout_overflow.py`.**
  Anything else — `00_extract_slides.py`, `build_handout_pdfs.py`,
  `migrate_to_meta.py` — has side effects across the repo and should only run
  with team approval.

---

## 2. The brief — `content-strategy/handout-audit.md`

Every slide in the workshop deck was audited once and tagged in
[`content-strategy/handout-audit.md`](../content-strategy/handout-audit.md):

- **THEORY** — stays as a slide, no handout
- **ACTIVITY** — becomes a participant handout (worksheet)
- **DEMO** — becomes a facilitator-only click-through script
- **HYBRID** — theory stays on the slide; the activity ask moves to a handout

Each row also has the suggested pointer-slide text and a short note on how
to split a HYBRID row. Treat the audit as your reference for what each
slide expects in handout form.

---

## 3. The Claude Code prompt

Open Claude Code from inside the repo so it picks up `CLAUDE.md`
automatically. Paste this as the **first message**, then describe the
actual task you're working on:

> I'll be working on FASTR workshop handouts. Before we start, read these
> so you know the conventions:
>
> - `handouts/README.md` — folder layout, filename pattern
>   (`h_m{N}_<short_name>.md`), template choice, pointer-slide rule
> - `handouts/_order.yaml` — canonical display order of the library by
>   module
> - `handouts/en/`, `handouts/fr/`, `handouts/pt/` — the existing handout
>   library (read-only source material)
> - `handouts/templates/` — three starting templates for brand-new
>   handouts
> - `content-strategy/handout-audit.md` — the audit that tags every
>   workshop slide as THEORY / ACTIVITY / DEMO / HYBRID and says what
>   handout shape it expects
> - `methodology/` — canonical chapter source for any factual claim,
>   definition, or methodology description
> - `core_content/m{N}_*/` — the workshop slides (`_s`-prefixed files are
>   condensed variants)
> - `CLAUDE.md` and `help and instructions/05_style_guide.md` — FASTR
>   conventions and style
>
> Rules for every handout:
>
> - **Where you can write:** only `handouts/_drafts/<lang>/m{N}/`.
>   Treat everything else as read-only: `methodology/` is the canonical
>   source (don't edit without me asking), `core_content/` is
>   auto-generated (never edit), `handouts/<lang>/m{N}/` is the published
>   folder (we promote drafts there as a team once we decide they're worth
>   putting on the web app — never write to it directly).
> - **Scripts you can run:** `tools/render_handout.sh`,
>   `tools/translate.py`, and `tools/check_handout_overflow.py`. Anything
>   else (`00_extract_slides.py`, `build_handout_pdfs.py`,
>   `migrate_to_meta.py`, etc.) — check with me first.
> - **Save drafts in `handouts/_drafts/<lang>/m{N}/`**, not in
>   `handouts/<lang>/m{N}/`. CI and the web app skip `_drafts/`; the
>   published folder goes live within minutes of merge.
> - **Brand-new handouts start from a `handouts/templates/` file.** Don't
>   invent a new structure. For edits to existing handouts, copy the file
>   from `handouts/<lang>/m{N}/` into `_drafts/` first and modify the copy.
> - **EN first, then FR and PT.** Don't write FR/PT from scratch — use
>   `tools/translate.py` with the glossary at `translations/glossary.yml`
>   (see `help and instructions/07_translation_workflow.md`).
> - **All three languages must mirror exactly**: same filename, same folder
>   shape, same headings, same number of worksheet rows, same images.
> - **Preview as PDF** with `tools/render_handout.sh <file.md>` before I
>   consider a draft done. Target one or two A4 pages per handout. **Check
>   the end of every page** — if a sentence, table row, image, or worksheet
>   row is cut off, fix it (shorten copy, reduce image height, drop a row,
>   add a page break) and re-render. Don't ship a PDF with mid-content
>   clipping.
> - **Don't invent numbers, methodology, or acronym expansions.** If
>   anything is unclear, check `methodology/` or ask me.
> - **Don't bulk-delete or rename existing handouts, slides, or
>   `_meta.yaml` entries.** Flag, don't fix silently.
> - **Screenshots:** while drafting, put a
>   `<div class="screenshot-placeholder">` block where a real platform
>   screenshot will go. When I'm ready for a real shot, use the Playwright
>   MCP against `demo.fastr-analytics.org` (or `demo-fr.fastr-analytics.org`
>   for FR). Save under `resources/screenshots/<path>/<filename>.jpeg` and
>   replace the placeholder with
>   `![alt h:160](../../../resources/screenshots/<path>/<filename>.jpeg)`.
> - **Don't push or commit to `main`.** I work on my own branch — check
>   with `git branch --show-current` before any commit.
>
> Confirm you've read these, then wait for me to describe the task.

After each render, **read the PDF end-to-end and check every page's
bottom edge.** If anything is cut off — a sentence trailing into nothing,
a worksheet row clipped, an image whose caption fell off — describe what's
cut to Claude Code and iterate. Don't ship a PDF with mid-content
clipping.

---

## 4. Languages — EN, FR, PT

The FR and PT drafts come from `tools/translate.py`, which calls DeepL and
applies the FASTR glossary at `translations/glossary.yml`:

```bash
python3 tools/translate.py handouts/_drafts/en/m4/h_m4_my_handout.md \
        --target-lang FR \
        --output handouts/_drafts/fr/m4/h_m4_my_handout.md

python3 tools/translate.py handouts/_drafts/en/m4/h_m4_my_handout.md \
        --target-lang PT \
        --output handouts/_drafts/pt/m4/h_m4_my_handout.md
```

Full workflow + the `<!-- REVIEWED -->` marker (which protects your human
edits from being overwritten on re-runs) is in
[`07_translation_workflow.md`](07_translation_workflow.md).

**Always human-review the machine draft.** DeepL plus the glossary gets you
~80% there; the last 20% is FASTR-specific phrasing and tone.

Setup is one-time: `pip3 install requests pyyaml`, then put
`DEEPL_API_KEY=...` in a `.env` at the repo root. Ask Claire if the team
has a shared key.

---

## 5. Keeping drafts off the live app

Two things go live the moment something lands on `main`:

1. The handouts CI rebuilds all PDFs (`build-handouts.yml`).
2. The Deck Builder web app picks up new handouts within minutes.

Both of them only look inside `handouts/en/`, `handouts/fr/`,
`handouts/pt/`. They **ignore `handouts/_drafts/`** — the CI globs don't
match it, and the web app's loader skips any folder starting with `_`.

So the rule is:

- **In-progress drafts → `handouts/_drafts/<lang>/m{N}/h_m{N}_<name>.md`**
- **Approved handouts → `handouts/<lang>/m{N}/h_m{N}_<name>.md`** (the
  team promotes via `git mv` once we decide it's worth putting on the web
  app, and adds the filename to `handouts/_order.yaml`)

Even so, **don't push to `main` directly**. Work on your own branch
(e.g. `<yourname>/handouts`). Push the branch, open a pull request, the
team reviews and decides whether to promote out of `_drafts/`.

For the local install (Git, Python, Node, Marp) see
[`02_local_setup.md`](02_local_setup.md).

---

## 6. VS Code + Claude Code + Playwright MCP

Recommended editor setup. **Every collaborator should do this once.**

### VS Code extensions

Open the repo in VS Code. The workspace already recommends two extensions
(`marp-team.marp-vscode`, `ms-python.python`) — VS Code will prompt you
to install them. Accept.

You also want the Claude Code VS Code extension:

- Install from the VS Code marketplace: **Claude Code** (publisher:
  Anthropic). It runs Claude Code inside a side panel and respects the
  same `CLAUDE.md` and MCP config as the CLI.

### Playwright MCP — for screenshots

Handouts use real platform screenshots from `demo.fastr-analytics.org`.
Claude Code captures them via the **Playwright MCP server**, which drives
a headless browser. It's an extra MCP server you have to install
separately — Claude Code on its own can't open browsers.

**One-time install** (in any terminal):

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

That registers a local Playwright MCP server with Claude Code. The first
time Claude uses it, it downloads a Chromium binary (~150 MB) — that's
normal.

Verify it's working: open Claude Code in the repo and ask
*"Use the Playwright MCP to open `https://demo.fastr-analytics.org` and
take a screenshot."* You should see Claude open the browser and return a
screenshot tool result.

### Workflow for capturing a real screenshot

Once you have a handout draft with `screenshot-placeholder` blocks where
images should go, ask Claude Code something like:

> *"Open `demo.fastr-analytics.org`, log in, navigate to the Data → Admin
> areas page, take a screenshot of the import form, save it as
> `resources/screenshots/m9a_setup/03_admin_units_menu.jpeg`, then replace
> the matching `screenshot-placeholder` in
> `handouts/_drafts/en/m9a/h_m9a_admin_areas.md` with the image
> reference."*

Use the demo instances only: `demo.fastr-analytics.org` (EN) or
`demo-fr.fastr-analytics.org` (FR).
