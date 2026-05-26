# templates/ + templates_fr/

Workshop slide templates — the structural slides (covers, breaks, agenda,
expectations, webinar prompts, etc.) that the deck builder injects around the
module content.

## What this is

Reusable slide source files that the deck builder pulls from when assembling a
workshop deck. Each file is a single Marp slide with `{{PLACEHOLDER}}` tokens
the builder substitutes (workshop name, dates, location, durations, etc.).
EN lives in `templates/`, FR in `templates_fr/` — they mirror file-for-file
(28 files each).

## Layout (selected)

```
templates/
├── title_slide.md              # workshop cover (title-cover class)
├── section_divider.md          # mid-deck section cover
├── day_title.md  day_recap.md  day_end.md
├── breaks.md  tea_break.md  lunch_break.md   # break design (warm field, big duration)
├── closing.md
├── activity_divider.md         # activity-pointer class (replaced by handout pointer)
├── webinar_*.md                # 8 webinar prompt slides (poll, qa, icebreaker, …)
├── meeting_norms.md  expectations_slide.md  objectives_slide.md
└── …
```

`templates_fr/` mirrors the same 28 filenames with French content.

## How to add/edit

1. Pick the slide class with `<!-- _class: ... -->`. Common classes:
   `title-cover`, `section-cover`, `break`, `centered`, `compact`,
   `activity-pointer`, `two-panel`, `dense-table`.
2. Use `{{TITLE}}`, `{{SUBTITLE}}`, `{{COUNTRY}}`, `{{LOCATION}}`, `{{DATE}}`,
   `{{DAY_TITLE}}`, `{{ACTIVITY_NAME}}`, `{{DURATION}}`,
   `{{TEA_RESUME_TIME}}`, `{{LUNCH_RESUME_TIME}}`, `{{LAST_DAY}}` for
   variables the builder substitutes.
3. Image paths from a template resolve as `../../resources/<dir>/<file>`.
4. **Mirror every change to `templates_fr/`** — same filename, translated text.
5. Test by exporting a workshop from the web app or
   `npx tsx web-app/scripts/build_deck.mts <id> pdf`.

## Gotchas

- Covers (`title-cover` / `section-cover` / `break` / `lead`) suppress the deck
  chrome (kicker, locator, footer) — don't expect them on those slides.
- Break templates use the new `_class: break` design (warm field + big duration).
  The deck builder also generates breaks dynamically from config —
  `tea_break.md` / `lunch_break.md` / `breaks.md` are for manual library inserts.
- The 8 webinar slides use `_class: centered`. Don't switch back to the old
  unstyled `engagement` class.
- `title_slide.md` has absolutely-positioned logo `<div>`s — touch carefully
  and re-export PDF + PPTX to verify.
