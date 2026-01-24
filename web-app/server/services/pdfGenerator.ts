import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REPO_ROOT = path.resolve(__dirname, '../../..')

/**
 * Generate PDF from markdown using Marp CLI
 */
export async function generatePDF(mdPath: string, pdfPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Find marp executable
    const marpPaths = [
      '/opt/homebrew/bin/marp',
      '/usr/local/bin/marp',
      'marp',
      path.join(REPO_ROOT, 'node_modules/.bin/marp'),
    ]

    let marpPath = 'marp'
    for (const p of marpPaths) {
      if (p === 'marp' || fs.existsSync(p)) {
        marpPath = p
        break
      }
    }

    // Theme path
    const themePath = path.join(REPO_ROOT, 'fastr-theme.css')

    // Build args
    const args = [
      '--no-config',
      '--html',
      '--pdf',
      '--allow-local-files',
      mdPath,
      '-o', pdfPath,
    ]

    // Add theme if it exists
    if (fs.existsSync(themePath)) {
      args.unshift('--theme', themePath)
    }

    console.log('Running Marp:', marpPath, args.join(' '))

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
        console.log('PDF generated successfully:', pdfPath)
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
    const marpPaths = [
      '/opt/homebrew/bin/marp',
      '/usr/local/bin/marp',
      'marp',
    ]

    let marpPath = 'marp'
    for (const p of marpPaths) {
      if (p === 'marp' || fs.existsSync(p)) {
        marpPath = p
        break
      }
    }

    const themePath = path.join(REPO_ROOT, 'fastr-theme.css')

    const args = [
      '--no-config',
      '--html',
      '--allow-local-files',
      mdPath,
      '-o', htmlPath,
    ]

    if (fs.existsSync(themePath)) {
      args.unshift('--theme', themePath)
    }

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
