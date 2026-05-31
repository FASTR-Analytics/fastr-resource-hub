# FASTR Deck Builder - Architecture

A web application for building custom FASTR workshop presentations.

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                      Express.js Server                          │
├──────────────────┬──────────────────┬──────────────────────────┤
│  Turso Database  │  File System     │  External APIs           │
│  (workshops)     │  (content)       │  (Anthropic AI)          │
└──────────────────┴──────────────────┴──────────────────────────┘
```

---

## Tech Stack Explained

### React

**What:** A JavaScript library for building user interfaces

**The idea:** Break your UI into reusable "components" - small pieces that manage their own logic and appearance.

```
┌─────────────────────────────────────┐
│ App                                 │
│  ┌─────────────┐  ┌──────────────┐  │
│  │ Sidebar     │  │ MainPanel    │  │
│  │  ┌───────┐  │  │  ┌────────┐  │  │
│  │  │Button │  │  │  │Card    │  │  │
│  │  └───────┘  │  │  └────────┘  │  │
│  └─────────────┘  └──────────────┘  │
└─────────────────────────────────────┘
```

**Example component:**
```jsx
function Button({ label, onClick }) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  )
}

// Use it anywhere:
<Button label="Save" onClick={handleSave} />
<Button label="Delete" onClick={handleDelete} />
```

**Why use it:**
- Reusable pieces (write once, use everywhere)
- Only updates what changes (fast)
- Huge ecosystem of libraries
- Used by Facebook, Netflix, Airbnb

---

### TypeScript

**What:** JavaScript with types - catches errors before you run the code

**The idea:** Tell the code what shape your data should be. The editor warns you if something's wrong.

```typescript
// Without TypeScript (JavaScript) - errors at runtime, crashes for users
function greet(user) {
  return "Hello " + user.name  // crashes if user is undefined
}

// With TypeScript - errors while you code, before anyone sees it
function greet(user: { name: string }) {
  return "Hello " + user.name  // editor warns if wrong type
}
```

**Example from our app:**
```typescript
interface Workshop {
  id: string
  name: string
  country: string
  days: number
}

// Now the editor knows what a Workshop looks like
// Autocomplete works, typos get caught
const w: Workshop = {
  id: "2026-zambia",
  name: "FASTR Training",
  country: "Zambia",
  days: 3
}
```

**Why use it:**
- Catch bugs before users see them
- Better autocomplete in your editor
- Code documents itself
- Easier to refactor large codebases

---

### Tailwind CSS

**What:** Utility classes for styling (instead of writing separate CSS files)

**The idea:** Style directly in your HTML/JSX with small, predictable class names.

```html
<!-- Traditional CSS - two files to manage -->
<button class="primary-button">Save</button>

<style>
.primary-button {
  background-color: blue;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}
</style>

<!-- Tailwind CSS - all in one place -->
<button class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
```

**Common Tailwind classes:**

| Class | What it does |
|-------|--------------|
| `bg-blue-500` | Blue background |
| `text-white` | White text |
| `p-4` | Padding all sides (16px) |
| `px-4` | Padding left + right |
| `py-2` | Padding top + bottom |
| `rounded` | Rounded corners |
| `rounded-lg` | More rounded corners |
| `flex` | Flexbox layout |
| `grid` | Grid layout |
| `hover:bg-blue-600` | Darker blue on hover |
| `w-full` | Full width |
| `h-screen` | Full viewport height |

**Why use it:**
- Fast to write (no switching files)
- Consistent spacing/colors
- Small final CSS file (only includes what you use)
- Easy to read once you learn the patterns

---

### Express.js

**What:** A web server framework for Node.js - handles HTTP requests

**The idea:** Define "routes" that respond when the browser asks for something.

```
Browser                          Express Server
   │                                   │
   │── GET /api/workshops ────────────▶│
   │                                   │ (runs your code)
   │◀─────────── JSON response ────────│
```

**Example route:**
```javascript
import express from 'express'
const app = express()

// When someone visits /api/workshops, run this function
app.get('/api/workshops', (req, res) => {
  const workshops = getWorkshopsFromDatabase()
  res.json(workshops)  // Send back JSON
})

// When someone POSTs to /api/workshops, create a new one
app.post('/api/workshops', (req, res) => {
  const newWorkshop = req.body  // Data from browser
  saveToDatabase(newWorkshop)
  res.json({ success: true })
})

app.listen(3001)  // Start server on port 3001
```

**HTTP methods we use:**

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Read data | Get list of workshops |
| POST | Create new | Create new workshop |
| PUT | Update existing | Save workshop changes |
| DELETE | Remove | Delete a workshop |
| PATCH | Partial update | Lock/unlock workshop |

**Why use it:**
- Simple and minimal (not opinionated)
- Huge ecosystem of middleware
- Easy to understand request/response flow
- Industry standard for Node.js APIs

---

### Marp

**What:** Markdown to presentation converter - turns text into slides

**The idea:** Write slides in simple Markdown, Marp converts to HTML/PDF/PowerPoint.

**Input (Markdown):**
```markdown
---
marp: true
theme: fastr
---

# Welcome to FASTR

Training workshop for health analytics

---

## Agenda

- Introduction
- Data Quality
- Analysis
- Results

---

## Questions?

Contact: facilitator@example.com
```

**Output:** Beautiful slides with consistent styling

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│                     │  │                     │  │                     │
│  Welcome to FASTR   │  │  Agenda             │  │  Questions?         │
│                     │  │  • Introduction     │  │                     │
│  Training workshop  │  │  • Data Quality     │  │  Contact: ...       │
│  for health...      │  │  • Analysis         │  │                     │
│                     │  │  • Results          │  │                     │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
     Slide 1                  Slide 2                  Slide 3
```

**How we use it:**

```javascript
import { Marp } from '@marp-team/marp-core'

const marp = new Marp()

// Convert markdown to HTML
const { html, css } = marp.render(markdownContent)

// Now we can display in browser or convert to PDF/PPTX
```

**Slide separators:**
- `---` starts a new slide
- Front matter (between `---` at top) sets options

**Why use it:**
- Write content in simple text (no PowerPoint clicking)
- Version control friendly (it's just text files)
- Consistent styling via themes
- Export to HTML, PDF, or PowerPoint

---

### Turso

**What:** SQLite database in the cloud - stores your data permanently

**The idea:** SQLite is a simple file-based database. Turso hosts it in the cloud so it persists across server restarts.

```
Local SQLite                    Turso (Cloud SQLite)
─────────────                   ────────────────────
- File on disk                  - Hosted service
- Lost on server restart        - Persists forever
- Good for development          - Good for production
```

**How we use it:**

```typescript
import { createClient } from '@libsql/client'

// Connect to Turso
const db = createClient({
  url: 'libsql://your-db.turso.io',
  authToken: 'your-token'
})

// Query data
const result = await db.execute('SELECT * FROM workshops')

// Insert data
await db.execute({
  sql: 'INSERT INTO workshops (id, name) VALUES (?, ?)',
  args: ['2026-zambia', 'FASTR Zambia']
})
```

**Our tables:**

```
workshops                        custom_slides
─────────────────────────        ─────────────────────────
id mod                           id (auto)
name                             workshop_id → workshops.id
country                          filename
config (JSON)                    content (markdown)
locked                           created_at
created_at                       updated_at
updated_at
```

**Why use it:**
- Free tier (9GB, 500M reads/month)
- SQLite compatible (simple queries)
- Data persists forever
- Can place database near users (we use Tokyo for Australia)

---

### Zustand

**What:** State management for React - keeps track of app data

**The idea:** A central "store" that all components can read from and write to.

```
┌─────────────────────────────────────────────┐
│                Zustand Store                │
│  ┌─────────────────────────────────────┐   │
│  │ currentWorkshop: { ... }            │   │
│  │ sessions: [ ... ]                   │   │
│  │ selectedDay: 1                      │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
        ▲              ▲              ▲
        │              │              │
   ┌────┴────┐   ┌────┴────┐   ┌────┴────┐
   │ Sidebar │   │ DayView │   │ Header  │
   └─────────┘   └─────────┘   └─────────┘

   All components see the same data
   Any component can update it
```

**Example:**

```typescript
// Define the store
const useWorkshopStore = create((set) => ({
  // State
  currentWorkshop: null,
  sessions: [],

  // Actions
  setWorkshop: (workshop) => set({ currentWorkshop: workshop }),
  addSession: (session) => set((state) => ({
    sessions: [...state.sessions, session]
  })),
}))

// Use in any component
function Header() {
  const workshop = useWorkshopStore(state => state.currentWorkshop)
  return <h1>{workshop?.name}</h1>
}

function Sidebar() {
  const addSession = useWorkshopStore(state => state.addSession)
  return <button onClick={() => addSession(newSession)}>Add</button>
}
```

**Why use it:**
- Simpler than Redux (less boilerplate)
- Works great with TypeScript
- No "provider" wrapper needed
- Small bundle size

---

### Anthropic Claude API

**What:** AI assistant that can understand and generate text

**The idea:** Send a message, get an intelligent response. Can also use "tools" to take actions.

```
Your App                    Claude API
   │                            │
   │── "Create a 3-day        ─▶│
   │    workshop schedule"      │
   │                            │ (AI thinks)
   │◀── Here's a schedule: ────│
   │    Day 1: Intro...         │
   │    Day 2: Data...          │
```

**How we use it:**

```typescript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const response = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [
    { role: 'user', content: 'Create a 3-day FASTR workshop schedule' }
  ]
})

console.log(response.content[0].text)
```

**Tools (function calling):**

The AI can call functions in our app:

```typescript
// Define tools the AI can use
const tools = [
  {
    name: 'add_session',
    description: 'Add a session to the workshop',
    parameters: {
      day: { type: 'number' },
      name: { type: 'string' },
      duration: { type: 'number' }
    }
  }
]

// AI decides to call: add_session({ day: 1, name: "Introduction", duration: 60 })
// Our code executes that function
```

**Why use it:**
- Natural language understanding
- Can generate workshop content
- Tool use enables AI to modify the app
- High quality responses

---

## How They All Work Together

```
User clicks "Add Session"
         │
         ▼
    React Component (SessionCard.tsx)
    - Handles click event
    - Styled with Tailwind classes
    - TypeScript ensures correct data shape
         │
         ▼
    Zustand Store (workshop.ts)
    - Updates local state
    - Triggers API call
         │
         ▼
    API Client (api.ts)
    - fetch() to Express server
         │
         ▼
    Express Route (workshops.ts)
    - Receives POST request
    - Validates data
         │
         ▼
    Turso Database
    - Saves to cloud
    - Persists forever
         │
         ▼
    Response back up the chain
    - Express sends JSON
    - React re-renders
    - User sees new session
```

---

## Directory Structure

```
web-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   │   ├── App.tsx              # Main layout
│   │   │   ├── ContentLibrary.tsx   # Browse slides
│   │   │   ├── SlideSorter.tsx      # Preview/reorder
│   │   │   ├── AIAssistant.tsx      # Chat panel
│   │   │   └── ...
│   │   └── stores/
│   │       └── workshop.ts  # Zustand store
│   └── lib/
│       └── api.ts           # API client functions
│
├── server/                  # Express backend
│   ├── index.ts             # Server entry point
│   ├── db/
│   │   └── database.ts      # Turso connection
│   ├── routes/
│   │   ├── workshops.ts     # Workshop CRUD
│   │   ├── content.ts       # Content library
│   │   ├── export.ts        # Deck building
│   │   ├── ai.ts            # AI assistant
│   │   └── assets.ts        # File uploads
│   └── services/
│       ├── marpService.ts   # Slide rendering
│       ├── deckBuilder.ts   # Markdown assembly
│       ├── pdfGenerator.ts  # PDF export
│       └── pptxGenerator.ts # PowerPoint export
│
├── outputs/                 # Generated decks
└── data/                    # Local SQLite (dev only)
```

---

## Data Flow

### Content Pipeline

```
methodology/*.md          # English source of truth (you edit this)
       │
       ├──────────────────▼ (python tools/translate_docs.py --lang fr / pt)
       │                  │
       │           methodology/fr/*.md, methodology/pt/*.md
       │                  │     DeepL-translated, AUTO-TRANSLATED marker,
       │                  │     promoted to REVIEWED after human pass
       │                  │
       ▼ (python tools/00_extract_slides.py [--lang en|fr|pt])
       │
core_content/             # EN — extracted slides per module
core_content_fr/          # FR — extracted slides per module
core_content_pt/          # PT — extracted slides per module (European)
       │
       ▼ (server reads on startup)
       │
Content Library API       # Serves to frontend, language-aware
       │
       ▼ (user browses & selects, picks workshop language)
       │
Workshop Config           # Saved to Turso database
       │
       ▼ (user clicks Export — buildMarkdown(id, config, lang))
       │
Final Deck (PPTX/PDF)     # Built from config + per-language content
```

### Languages (i18n)

The app supports three workshop languages:

| Code | Language | Content folders | Workshop-chrome strings |
|------|----------|-----------------|------------------------|
| `en` | English (American) | `core_content/`, `templates/` | EN — source |
| `fr` | French | `core_content_fr/`, `templates_fr/` | FR — manually maintained |
| `pt` | Portuguese (European, PT-PT) | `core_content_pt/`, `templates_pt/` | PT — manually maintained |

**Per-language content lives in parallel folders:**
- `methodology/`, `methodology/fr/`, `methodology/pt/` — methodology source (Markdown)
- `core_content/`, `core_content_fr/`, `core_content_pt/` — extracted slides
- `templates/`, `templates_fr/`, `templates_pt/` — workshop scaffolding (title, day_title, breaks, agenda, day_recap, day_end, welcome, meeting_norms, etc.)
- `resources/diagrams/`, `resources/diagrams_fr/`, `resources/diagrams_pt/` — language-specific diagrams. EN is the default; FR and PT have partial sets — when a language-specific diagram is missing the slide should reference the EN copy explicitly (we don't yet auto-fallback at render time).

**Workshop-chrome strings** (agenda headers, "Coffee break", "Day N Recap", "Resume at", "Presented by", etc.) live in a single `CHROME_I18N` table at the top of `server/services/deckBuilder.ts`. Adding a new key requires filling EN + FR + PT.

**The deck builder picks the language at render time:**
```ts
buildMarkdown(workshopId, config, language)   // language: 'en' | 'fr' | 'pt'
```
The `language` arg overrides `config.workshop.language` so the same workshop config can be exported in any language. Adding a fourth language requires:
1. Adding it to `Language` type in `deckBuilder.ts`
2. Adding entries to `CHROME_I18N`
3. Creating `core_content_<lang>/` and `templates_<lang>/`
4. Adding the locale to the date/time formatter
5. Adding it to `--lang` choices in `tools/00_extract_slides.py` and `tools/translate.py`
6. Adding `<lang>:` names to `modules.yaml`

### Request Flow Example

```
Browser                    Server                      Database
   │                          │                           │
   │── GET /api/workshops ───▶│                           │
   │                          │── SELECT * FROM... ──────▶│
   │                          │◀── rows ─────────────────│
   │◀── JSON [{...}, {...}] ──│                           │
   │                          │                           │
   │── PUT /api/workshops/x ─▶│                           │
   │   { name: "New name" }   │── UPDATE workshops... ───▶│
   │                          │◀── success ──────────────│
   │◀── { success: true } ────│                           │
```

---

## Database Schema

### workshops table

```sql
CREATE TABLE workshops (
  id TEXT PRIMARY KEY,           -- e.g., "2026-zambia"
  name TEXT NOT NULL,            -- "FASTR Training - Zambia"
  country TEXT NOT NULL,         -- "Zambia"
  location TEXT,                 -- "Lusaka"
  date TEXT,                     -- "2026-03-15"
  facilitators TEXT,             -- "John, Jane"
  config TEXT NOT NULL,          -- Full JSON config
  locked INTEGER DEFAULT 0,      -- 0 = editable, 1 = locked
  created_at DATETIME,
  updated_at DATETIME
);
```

### custom_slides table

```sql
CREATE TABLE custom_slides (
  id INTEGER PRIMARY KEY,
  workshop_id TEXT NOT NULL,     -- Links to workshops.id
  filename TEXT NOT NULL,        -- "activity_dq.md"
  content TEXT NOT NULL,         -- Markdown content
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (workshop_id) REFERENCES workshops(id)
);
```

---

## API Endpoints

### Workshops
```
GET    /api/workshops              # List all workshops
GET    /api/workshops/:id          # Get workshop config
POST   /api/workshops              # Create workshop
PUT    /api/workshops/:id          # Update workshop
DELETE /api/workshops/:id          # Delete workshop
PATCH  /api/workshops/:id/lock     # Lock/unlock
```

### Content Library
```
GET    /api/content/modules        # List all modules & topics
GET    /api/content/topic/:id      # Get topic slide content
GET    /api/content/templates      # List slide templates
GET    /api/content/template/:id   # Get template content
```

### Export
```
POST   /api/export/:id/markdown    # Build markdown deck
POST   /api/export/:id/html        # Build HTML preview
POST   /api/export/:id/pdf         # Build PDF
POST   /api/export/:id/pptx        # Build PowerPoint
GET    /api/export/:id/download/:format  # Download file
```

### AI Assistant
```
POST   /api/ai/chat                # Chat with AI (supports tools)
POST   /api/ai/generate            # Simple text generation
POST   /api/ai/objectives          # Generate workshop objectives
POST   /api/ai/schedule            # Generate suggested schedule
```

---

## Configuration

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `PASSWORD` | Login password | Yes |
| `TURSO_DATABASE_URL` | Turso connection URL | Production |
| `TURSO_AUTH_TOKEN` | Turso auth token | Production |
| `ANTHROPIC_API_KEY` | AI features | Optional |
| `NODE_ENV` | production/development | Yes |
| `PORT` | Server port (default 3001) | No |

### Local Development

```bash
# Terminal 1: Start backend
cd web-app
npm install
npm run dev          # Starts Express on :3001

# Terminal 2: Start frontend
cd web-app/client
npm run dev          # Starts Vite on :5173 (proxies API to :3001)
```

Open http://localhost:5175 in browser.

### Production Build

```bash
cd web-app
npm run build        # Compiles TypeScript + builds React
npm start            # Runs production server
```

---

## Caching Strategy

### Server-side Caches

| Cache | TTL | Purpose |
|-------|-----|---------|
| Modules metadata | 5 min | Avoid re-scanning core_content/ |
| Rendered slides | 1 hour | Avoid re-rendering same markdown |
| Session renders | 30 min | Speed up deck preview |

Caches use MD5 hash of content as key - identical content = cache hit.

---

## Authentication

Simple password-based session auth:

1. User enters team password on login page
2. Server validates and creates session
3. Session cookie sent with every request
4. All API routes check for valid session
5. Sessions stored in Turso (persist across restarts)

---

## Deployment

**Hosted on Render.com:**
- Auto-deploys when you push to main branch
- Database: Turso (Tokyo region, closest to Australia)
- Static files served by Express in production

**Deploy process:**
```
git push origin main
      │
      ▼
Render detects push
      │
      ▼
Runs: npm install && npm run build
      │
      ▼
Runs: npm start
      │
      ▼
App live at https://fastr-deck-builder.onrender.com
```

---

## Summary

| Technology | Role |
|------------|------|
| **React** | UI components |
| **TypeScript** | Type safety, fewer bugs |
| **Tailwind** | Styling |
| **Express** | API server |
| **Marp** | Markdown → slides |
| **Turso** | Cloud database |
| **Zustand** | App state |
| **Claude API** | AI assistant |

---

## AI Tools & Endpoints

The AI assistant can both answer questions AND directly modify the workshop using tools.

### AI Endpoints

| Endpoint | Purpose | Uses Tools |
|----------|---------|------------|
| `POST /api/ai/chat` | Interactive chat, can modify deck | Yes |
| `POST /api/ai/generate` | Simple text generation | No |
| `POST /api/ai/objectives` | Generate workshop objectives | No |
| `POST /api/ai/schedule` | Generate suggested schedule | No |
| `POST /api/ai/generate-workshop` | Create complete workshop from prompt | No |

### AI Tools (Function Calling)

When you chat with the AI, it can call these functions to modify your workshop:

| Tool | What it does | Parameters |
|------|--------------|------------|
| `add_module` | Add a FASTR module to a day | `day`, `module_number`, `duration` |
| `add_break` | Add tea or lunch break | `day`, `break_type` (tea/lunch), `duration` |
| `add_custom_session` | Add custom session (opening remarks, group work, etc.) | `day`, `session_name`, `duration` |
| `update_workshop_settings` | Update objectives, facilitators, venue, etc. | `objectives`, `facilitators`, `venue`, `contact_email`, `website` |
| `move_session` | Reorder sessions within a day | `day`, `from_position`, `to_position` |
| `remove_session` | Remove a session | `day`, `position` |
| `restructure_schedule` | Major schedule changes (change days) | `new_num_days`, `strategy` |

### How Tool Calling Works

```
User: "Add Module 4 to Day 2"
         │
         ▼
    AI receives message + tool definitions
         │
         ▼
    AI decides to call: add_module({ day: 2, module_number: 4 })
         │
         ▼
    Server receives tool call
         │
         ▼
    Frontend executes the action (updates Zustand store)
         │
         ▼
    AI confirms: "I've added Data Quality Assessment to Day 2"
```

### Example AI Interactions

**Adding content:**
```
User: "Add the data extraction module after lunch on day 1"
AI: [Calls add_module tool] → "I've added Module 2: Data Extraction to Day 1"
```

**Reorganizing:**
```
User: "Move the tea break to after the first module"
AI: [Calls move_session tool] → "Done, tea break is now after Introduction"
```

**Generating a workshop:**
```
User: "Create a 3-day workshop in Zambia covering modules 0-6"
AI: [Returns JSON config] → Full schedule with objectives
```

### Module Reference

The AI knows about these FASTR modules:

| Module | Name | Typical Duration |
|--------|------|------------------|
| 0 | Introduction to FASTR | 45-60 min |
| 1 | Identify Questions & Indicators | 60-90 min |
| 2 | Data Extraction | 90-120 min |
| 3 | FASTR Analytics Platform | 120-180 min |
| 4 | Data Quality Assessment | 90-120 min |
| 5 | Data Quality Adjustment | 60-90 min |
| 6 | Data Analysis | 180-240 min |
| 7 | Results Communication | 90-120 min |

---

## Future Improvements

- [ ] Auto-extract slides when methodology files change
- [ ] Real-time collaboration (multiple users editing)
- [ ] Version history for workshops
- [ ] Offline support (PWA)
- [ ] More AI tools (reorder, suggest improvements)
