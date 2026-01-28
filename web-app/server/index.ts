import express from 'express'
import cors from 'cors'
import session from 'express-session'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Routes
import workshopsRouter from './routes/workshops.js'
import contentRouter from './routes/content.js'
import aiRouter from './routes/ai.js'
import exportRouter from './routes/export.js'
import assetsRouter from './routes/assets.js'

// Services
import { initializeMarp } from './services/marpService.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Trust proxy (required for secure cookies on Render/Heroku/etc)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

// Team password from environment variable
const TEAM_PASSWORD = process.env.TEAM_PASSWORD || 'fastr2026'

// Initialize session store (try SQLite, fall back to MemoryStore)
async function createSessionStore(): Promise<session.Store | undefined> {
  try {
    const Database = (await import('better-sqlite3')).default
    const SqliteStoreFactory = (await import('better-sqlite3-session-store')).default
    const SqliteStore = SqliteStoreFactory(session)

    const SESSION_DB_PATH = process.env.NODE_ENV === 'production'
      ? '/tmp/sessions.db'
      : path.join(__dirname, '../sessions.db')

    console.log('Session database path:', SESSION_DB_PATH)
    const sessionsDb = new Database(SESSION_DB_PATH)

    console.log('✓ Using SQLite session store')
    return new SqliteStore({
      client: sessionsDb,
      expired: {
        clear: true,
        intervalMs: 15 * 60 * 1000
      }
    })
  } catch (err) {
    console.warn('⚠ SQLite session store unavailable, using MemoryStore:', (err as Error).message)
    console.warn('  Sessions will be lost on server restart')
    return undefined
  }
}

// Async initialization
const sessionStore = await createSessionStore()

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Session middleware
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'fastr-deck-builder-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax'
  }
}))

// Extend session type
declare module 'express-session' {
  interface SessionData {
    authenticated: boolean
  }
}

// Auth routes (must be before auth middleware)
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body
  if (password === TEAM_PASSWORD) {
    req.session.authenticated = true
    // Explicitly save session before responding to avoid race conditions
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err)
        return res.status(500).json({ error: 'Session error' })
      }
      res.json({ success: true })
    })
  } else {
    res.status(401).json({ error: 'Invalid password' })
  }
})

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Failed to logout' })
    } else {
      res.json({ success: true })
    }
  })
})

app.get('/api/auth/status', (req, res) => {
  res.json({ authenticated: req.session.authenticated === true })
})

// Auth middleware - protect all API routes except auth
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Allow auth routes
  if (req.path.startsWith('/api/auth')) {
    return next()
  }
  // Allow health check
  if (req.path === '/api/health') {
    return next()
  }
  // Check authentication for all other API routes
  if (req.path.startsWith('/api/') && req.session.authenticated !== true) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

app.use(authMiddleware)

// Serve static resources (images, diagrams, etc.)
// In dev: __dirname is web-app/server, go up 2 levels
// In prod: __dirname is web-app/dist/server, go up 3 levels
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../..')
  : path.resolve(__dirname, '../..')
console.log('REPO_ROOT:', REPO_ROOT)
console.log('Resources path:', path.join(REPO_ROOT, 'resources'))
app.use('/resources', express.static(path.join(REPO_ROOT, 'resources')))
app.use('/fastr-theme.css', (_req, res) => {
  res.sendFile(path.join(REPO_ROOT, 'fastr-theme.css'))
})

// Initialize Marp service (reused across all render requests)
await initializeMarp()

// API Routes
app.use('/api/workshops', workshopsRouter)
app.use('/api/content', contentRouter)
app.use('/api/ai', aiRouter)
app.use('/api/export', exportRouter)
app.use('/api/assets', assetsRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // In production, server runs from dist/server, client build is in dist/client
  const clientPath = path.join(__dirname, '../client')
  app.use(express.static(clientPath))

  // SPA fallback
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'))
  })
}

// Error handling
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
