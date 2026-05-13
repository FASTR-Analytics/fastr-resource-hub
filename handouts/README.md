# FASTR Handouts

Source files for printable A4 handouts that accompany the FASTR workshop slides. Rendered to PDF via Marp.

## Folder layout

```
handouts/
├── README.md             # this file
├── templates/            # three blank templates — copy these to start a new handout
│   ├── participant_activity.md   # for participant ACTIVITY content (worksheets, group exercises)
│   ├── facilitator_demo.md       # for DEMO content (facilitator click-through scripts)
│   └── webinar_worksheet.md      # for pre/post-webinar worksheets (solo work)
├── en/                   # English handouts, mirroring core_content/ structure
│   ├── m9a/
│   ├── m7/
│   └── ...
├── fr/                   # French handouts, mirroring core_content_fr/
└── _out/                 # rendered PDFs (gitignored — local only)
```

Each handout lives at `handouts/<lang>/<module>/<filename>.md`. Filenames follow the audit doc convention: `h_<module>_<short_name>.md` (e.g., `h_m9a_admin_areas.md`).

EN and FR versions share the same filename across the two language trees. When updating one, update the other in the same commit.

**Naming convention for the reader.** The filename uses internal module codes (`h_m9a_admin_areas.md`) so the file system stays sortable. **The content visible to participants never shows internal codes** — use human-readable module names instead (e.g., write "Instance Setup", not "M9a"). The `{{MODULE_NAME}}` placeholder in templates is the human-readable name; there is no `{{MODULE_ID}}` placeholder anywhere in the visible body or footer.

## Choosing a template

Three handout shapes, three templates. Match the slide's audit tag (see `content-strategy/handout-audit.md`) to a template:

| Audit tag | Audience | Template | Notes |
|-----------|----------|----------|-------|
| ACTIVITY  | Participants | `participant_activity.md` | Worksheets, prompts, instructions participants do hands-on |
| DEMO      | Facilitators | `facilitator_demo.md`     | Click-through script + talking points; not for participants |
| (Webinar) | Participants | `webinar_worksheet.md`    | Pre/post-webinar solo reflection; delivered as a download link |

Hybrid slides (audit-tagged HYBRID) usually become a participant activity handout — the theory part stays on the slide.

## Authoring a new handout

1. Pick the right template from `templates/` and copy it into the appropriate language + module folder.
2. Rename the file using the `h_<module>_<short_name>.md` convention.
3. Fill in every `{{PLACEHOLDER}}` — title, duration, instructions, etc.
4. Match the structure across EN and FR — same heading levels, same number of worksheet rows, same image references.
5. Test-render to PDF (see below) before committing.

## Rendering to PDF

Use the helper script at repo root:

```bash
tools/render_handout.sh handouts/en/m9a/h_m9a_admin_areas.md
```

Renders an A4 PDF next to the markdown file. To customise the output path:

```bash
tools/render_handout.sh handouts/en/m9a/h_m9a_admin_areas.md handouts/_out/admin_areas_en.pdf
```

The script invokes `@marp-team/marp-cli` with the `fastr-handout.css` theme (at repo root). Marp's PDF mode requires Chromium; if you don't have it locally, the first run will download it via Puppeteer.

To render all handouts in a folder:

```bash
for f in handouts/en/m9a/*.md; do tools/render_handout.sh "$f"; done
```

## Pointer slides

Each handout replaces a slide in the deck. The slide gets a minimal "pointer" — e.g.:

```markdown
## Activity: Setting up admin areas

**See your handout · ~25 min**

![h:200](../../resources/icons/hands_on.svg)
```

The audit doc (`content-strategy/handout-audit.md`) tracks the suggested pointer slide text per activity. When a handout ships, replace the corresponding slide in `core_content/<module>/` with the pointer version.

## Theme

`fastr-handout.css` (at repo root, next to `fastr-theme.css`) is the Marp theme. A4 portrait (210mm × 297mm), Poppins font, FASTR brand colors. Each `---` separator in the markdown creates a new A4 page.

To customise styling without touching the canonical theme, copy `fastr-handout.css` to a local variant and pass it via `--theme-set` to `marp-cli` directly.
