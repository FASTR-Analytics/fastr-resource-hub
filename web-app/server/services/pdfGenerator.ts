import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Different path depth in dev vs prod due to TypeScript compilation
const REPO_ROOT = process.env.NODE_ENV === 'production'
  ? path.resolve(__dirname, '../../../..')
  : path.resolve(__dirname, '../../..')

/**
 * Generate PDF from markdown using Marp CLI
 */
export async function generatePDF(mdPath: string, pdfPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Find marp executable - check web-app's node_modules first
    const WEB_APP_ROOT = process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, '../../..')  // dist/server/services -> web-app
      : path.resolve(__dirname, '../..')      // server/services -> web-app

    const marpPaths = [
      path.join(WEB_APP_ROOT, 'node_modules/.bin/marp'),
      path.join(REPO_ROOT, 'node_modules/.bin/marp'),
      '/opt/homebrew/bin/marp',
      '/usr/local/bin/marp',
      'marp',
    ]

    let marpPath = ''
    for (const p of marpPaths) {
      if (fs.existsSync(p)) {
        marpPath = p
        break
      }
    }

    if (!marpPath) {
      throw new Error('Marp CLI not found. Install with: npm install @marp-team/marp-cli')
    }

    // Theme path — the single FASTR deck theme
    const themeFiles = ['fastr-theme.css']

    // Build args — use --theme-set (array) instead of multiple --theme flags (Marp CLI v4+)
    const themePaths = themeFiles
      .map(tf => path.join(REPO_ROOT, tf))
      .filter(tp => fs.existsSync(tp))

    const args = [
      '--no-config',
      '--html',
      '--pdf',
      '--allow-local-files',
      ...(themePaths.length > 0 ? ['--theme-set', ...themePaths] : []),
      '--', mdPath,
      '-o', pdfPath,
    ]

    const marpProcess = spawn(marpPath, args, {
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stdout = ''
    let stderr = ''

    marpProcess.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    marpProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    // Timeout after 120 seconds
    const timeout = setTimeout(() => {
      marpProcess.kill('SIGTERM')
      reject(new Error('PDF generation timed out after 120 seconds'))
    }, 120000)

    marpProcess.on('close', (code) => {
      clearTimeout(timeout)
      if (code === 0) {
        resolve()
      } else {
        console.error('PDF generation failed:', stderr || stdout)
        reject(new Error(`Marp exited with code ${code}: ${stderr || stdout}`))
      }
    })

    marpProcess.on('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
  })
}

/**
 * Generate HTML from markdown using Marp CLI
 */
export async function generateHTML(mdPath: string, htmlPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Find marp executable - check web-app's node_modules first
    const WEB_APP_ROOT = process.env.NODE_ENV === 'production'
      ? path.resolve(__dirname, '../../..')
      : path.resolve(__dirname, '../..')

    const marpPaths = [
      path.join(WEB_APP_ROOT, 'node_modules/.bin/marp'),
      path.join(REPO_ROOT, 'node_modules/.bin/marp'),
      '/opt/homebrew/bin/marp',
      '/usr/local/bin/marp',
    ]

    let marpPath = ''
    for (const p of marpPaths) {
      if (fs.existsSync(p)) {
        marpPath = p
        break
      }
    }

    if (!marpPath) {
      throw new Error('Marp CLI not found. Install with: npm install @marp-team/marp-cli')
    }

    const htmlThemeFiles = ['fastr-theme.css']

    // Use --theme-set (array) instead of multiple --theme flags (Marp CLI v4+)
    const htmlThemePaths = htmlThemeFiles
      .map(tf => path.join(REPO_ROOT, tf))
      .filter(tp => fs.existsSync(tp))

    const args = [
      '--no-config',
      '--html',
      '--allow-local-files',
      ...(htmlThemePaths.length > 0 ? ['--theme-set', ...htmlThemePaths] : []),
      '--', mdPath,
      '-o', htmlPath,
    ]

    const marpProcess = spawn(marpPath, args, {
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    })

    let stderr = ''

    marpProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    const timeout = setTimeout(() => {
      marpProcess.kill('SIGTERM')
      reject(new Error('HTML generation timed out'))
    }, 60000)

    marpProcess.on('close', (code) => {
      clearTimeout(timeout)
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Marp exited with code ${code}: ${stderr}`))
      }
    })

    marpProcess.on('error', (error) => {
      clearTimeout(timeout)
      reject(error)
    })
  })
}
