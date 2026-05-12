# Web UI kit · Deck Builder

Recreation of the FASTR Deck Builder web app — a workshop-deck assembly tool where a curriculum team picks modules from a library, arranges them into a deck, edits slide content inline, and exports to PowerPoint.

**Source** — `web-app/client/` in the `FASTR-Analytics/fastr-resource-hub` repo (React + Vite + Tailwind).

**Type** · Inter 400/500/600/700
**Palette** · navy `#1B365D` + teal `#00A9CE` + orange `#F7941D` (export accent) + slate neutrals
**Icons** · Lucide (loaded from `unpkg.com/lucide-static`)
**Cards** · `rounded-2xl` (16px), 1px slate-200 border + `ring-1 black/5`, `shadow-sm`

## Files

| File | What it is |
|---|---|
| `index.html` | Self-contained mockup — sidebar + topbar + slide rail + deck preview + inspector + content-library view. Switch between views by clicking sidebar items. |
| `components.jsx` | `Sidebar`, `TopBar`, `ModuleCard`, `SlideRail`, `DeckPreview`, `Inspector` — small, single-responsibility pieces shared globally via `Object.assign(window, …)`. |

## What's wired up

- Sidebar nav switches between the **Builder** view (default) and the **Content library** view
- Slide rail thumbnails are clickable — selecting one updates the preview canvas
- Inspector swatches, layout dropdown, and variant segmented control are visible but not yet bound to state

## What was cut

- Workshop list/calendar surface (Workshops nav item is decorative)
- Templates / Assets / Settings surfaces
- Real PPTX export — the button is a button, not a flow
- Drag-and-drop slide reordering

These can be added without redesigning anything; the components in `components.jsx` are factored to compose into them.
