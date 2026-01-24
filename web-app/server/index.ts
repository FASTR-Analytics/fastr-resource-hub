import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Routes
import workshopsRouter from './routes/workshops.js'
import contentRouter from './routes/content.js'
import aiRouter from './routes/ai.js'
import exportRouter from './routes/export.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// API Routes
app.use('/api/workshops', workshopsRouter)
app.use('/api/content', contentRouter)
app.use('/api/ai', aiRouter)
app.use('/api/export', exportRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.join(__dirname, '../client/dist')
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
