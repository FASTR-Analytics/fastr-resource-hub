import session from 'express-session'
import { createClient, Client } from '@libsql/client'

/**
 * Turso-based session store for express-session
 * Stores sessions in Turso cloud database for persistence across deploys
 */
export class TursoSessionStore extends session.Store {
  private db: Client
  private tableName: string = 'sessions'

  constructor(options: { url: string; authToken: string }) {
    super()
    this.db = createClient({
      url: options.url,
      authToken: options.authToken,
    })
  }

  async initialize(): Promise<void> {
    // Create sessions table if not exists
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        sid TEXT PRIMARY KEY,
        sess TEXT NOT NULL,
        expire INTEGER NOT NULL
      )
    `)

    // Create index for cleanup
    try {
      await this.db.execute(`CREATE INDEX idx_sessions_expire ON ${this.tableName}(expire)`)
    } catch (e) {
      // Index already exists
    }

    // Start cleanup interval (every 15 minutes)
    setInterval(() => this.cleanup(), 15 * 60 * 1000)

    console.log('✓ Turso session store initialized')
  }

  private async cleanup(): Promise<void> {
    const now = Math.floor(Date.now() / 1000)
    try {
      await this.db.execute({
        sql: `DELETE FROM ${this.tableName} WHERE expire < ?`,
        args: [now]
      })
    } catch (e) {
      console.error('Session cleanup error:', e)
    }
  }

  get(sid: string, callback: (err: any, session?: session.SessionData | null) => void): void {
    const now = Math.floor(Date.now() / 1000)

    this.db.execute({
      sql: `SELECT sess FROM ${this.tableName} WHERE sid = ? AND expire > ?`,
      args: [sid, now]
    })
      .then(result => {
        if (result.rows.length === 0) {
          return callback(null, null)
        }
        try {
          const sess = JSON.parse(result.rows[0].sess as string)
          callback(null, sess)
        } catch (e) {
          callback(e)
        }
      })
      .catch(err => callback(err))
  }

  set(sid: string, sess: session.SessionData, callback?: (err?: any) => void): void {
    const maxAge = sess.cookie?.maxAge || 86400000 // Default 24 hours
    const expire = Math.floor((Date.now() + maxAge) / 1000)
    const sessStr = JSON.stringify(sess)

    this.db.execute({
      sql: `INSERT OR REPLACE INTO ${this.tableName} (sid, sess, expire) VALUES (?, ?, ?)`,
      args: [sid, sessStr, expire]
    })
      .then(() => callback?.())
      .catch(err => callback?.(err))
  }

  destroy(sid: string, callback?: (err?: any) => void): void {
    this.db.execute({
      sql: `DELETE FROM ${this.tableName} WHERE sid = ?`,
      args: [sid]
    })
      .then(() => callback?.())
      .catch(err => callback?.(err))
  }

  touch(sid: string, sess: session.SessionData, callback?: (err?: any) => void): void {
    const maxAge = sess.cookie?.maxAge || 86400000
    const expire = Math.floor((Date.now() + maxAge) / 1000)

    this.db.execute({
      sql: `UPDATE ${this.tableName} SET expire = ? WHERE sid = ?`,
      args: [expire, sid]
    })
      .then(() => callback?.())
      .catch(err => callback?.(err))
  }

  all(callback: (err: any, sessions?: session.SessionData[] | { [sid: string]: session.SessionData }) => void): void {
    const now = Math.floor(Date.now() / 1000)

    this.db.execute({
      sql: `SELECT sid, sess FROM ${this.tableName} WHERE expire > ?`,
      args: [now]
    })
      .then(result => {
        const sessions: { [sid: string]: session.SessionData } = {}
        for (const row of result.rows) {
          try {
            sessions[row.sid as string] = JSON.parse(row.sess as string)
          } catch (e) {
            // Skip invalid sessions
          }
        }
        callback(null, sessions)
      })
      .catch(err => callback(err))
  }

  length(callback: (err: any, length?: number) => void): void {
    const now = Math.floor(Date.now() / 1000)

    this.db.execute({
      sql: `SELECT COUNT(*) as count FROM ${this.tableName} WHERE expire > ?`,
      args: [now]
    })
      .then(result => {
        callback(null, result.rows[0].count as number)
      })
      .catch(err => callback(err))
  }

  clear(callback?: (err?: any) => void): void {
    this.db.execute(`DELETE FROM ${this.tableName}`)
      .then(() => callback?.())
      .catch(err => callback?.(err))
  }
}
