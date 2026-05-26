# web-app/ — FASTR Deck Builder

A web app for assembling FASTR workshop decks (HTML / PDF / PPTX) from the
shared slide library.

> Two longer docs live next to this README:
> - **[ABOUT.md](ABOUT.md)** — user-facing overview (what it does, who it's for).
> - **[ARCHITECTURE.md](ARCHITECTURE.md)** — tech stack, data flow, key services.

## Quickstart

```bash
cd web-app
./dev.sh start      # frontend (Vite :5173) + backend (Express/tsx :3001)
./dev.sh restart    # use this after editing CSS — themes are cached at startup
./dev.sh stop
./dev.sh status
```

Tail logs:

```bash
tail -f /tmp/fastr-backend.log
tail -f /tmp/fastr-frontend.log
```

Build a single deck from the CLI (no UI):

```bash
npx tsx scripts/build_deck.mts <workshop-id> [pdf|html|md]
npx tsx scripts/build_deck.mts                    # list available workshop ids
```

## Layout

```
web-app/
├── client/         # React frontend (Vite)
├── server/         # Express + tsx (TypeScript)
│   ├── routes/     # API endpoints (content, export, ai, …)
│   ├── services/   # deckBuilder, pptxGenerator, pdfGenerator, marpService, …
│   └── db/         # SQLite layer
├── scripts/        # one-off helpers (build_deck.mts, …)
├── data/           # SQLite databases (workshops.db, sessions.db)
├── outputs/        # generated decks (md/pdf/pptx)
└── dev.sh          # start/stop/restart/status wrapper
```

## How to add/edit

- **A new render path** (another export format, etc.) → add a service in
  `server/services/` and a route in `server/routes/`. Mirror the patterns in
  `pdfGenerator.ts` / `pptxGenerator.ts`.
- **A new content type** in the picker → update `server/routes/assets.ts` plus
  the relevant loader in `server/services/deckBuilder.ts`. The slide library
  reads from `core_content/` + `_meta.yaml` upstream.
- **Theme/CSS changes** → edit `fastr-theme.css` at the repo root and
  **restart the backend** (`./dev.sh restart`) — the theme is read once at
  process start.

## Gotchas

- The backend caches `fastr-theme.css` at startup. `tsx watch` reloads `.ts`
  changes but **not** CSS — restart after CSS edits.
- `deckBuilder.ts` resolves slide filenames against `core_content/` and
  `core_content_fr/`; both must be in sync (regenerate from `methodology/`
  via `tools/00_extract_slides.py`).
- PPTX layout is computed in code (`pptxGenerator.ts`), independent of the CSS
  theme — chrome/title math lives there too. Update both when changing visual
  conventions.
- The compact auto-tier (overflow rescue) reads `tools/overflow_map.json`.
  After editing slide content or the theme, re-run
  `node tools/measure_overflow.mjs`.
- Workshop configs live in `data/workshops.db` (SQLite). Use the CLI or the UI
  to mutate — don't edit the database file by hand.
