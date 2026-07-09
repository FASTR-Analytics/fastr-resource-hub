import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { COLORS, CSS_VAR_MAP, ColorToken, THEMES, getThemeSpec } from './themeTokens'

/**
 * Drift guard: the FASTR palette is necessarily duplicated across render
 * surfaces (the Marp deck CSS, the design-system doc, and the PPTX generator).
 * COLORS in themeTokens.ts is the canonical copy; this test fails loudly if any
 * CSS file's custom property drifts from it, so a palette change made in one
 * place can't silently miss another.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '../../..')

/** Read `--var-name: #HEX;` from a CSS file, normalized to bare uppercase hex. */
function readCssVar(css: string, varName: string): string | null {
  const m = css.match(new RegExp(`${varName}\\s*:\\s*#?([0-9a-fA-F]{6})\\b`))
  return m ? m[1].toUpperCase() : null
}

describe('themeTokens — CSS palette drift guard', () => {
  for (const [relPath, varMap] of Object.entries(CSS_VAR_MAP)) {
    describe(relPath, () => {
      const css = fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf-8')

      for (const [token, varName] of Object.entries(varMap)) {
        it(`${varName} matches COLORS.${token}`, () => {
          const expected = COLORS[token as ColorToken].toUpperCase()
          const actual = readCssVar(css, varName as string)
          expect(actual, `${varName} not found in ${relPath}`).not.toBeNull()
          expect(actual).toBe(expected)
        })
      }
    })
  }

  it('every mapped token exists in COLORS', () => {
    for (const varMap of Object.values(CSS_VAR_MAP)) {
      for (const token of Object.keys(varMap)) {
        expect(COLORS).toHaveProperty(token)
      }
    }
  })
})

describe('getThemeSpec — theme resolution', () => {
  it('resolves known theme ids', () => {
    expect(getThemeSpec('classic').marpTheme).toBe('fastr')
    expect(getThemeSpec('fastr2026').marpTheme).toBe('fastr-2026')
    expect(getThemeSpec('minimal').marpTheme).toBe('fastr-minimal')
  })

  it('falls back to classic for legacy/unknown/absent ids', () => {
    expect(getThemeSpec(undefined).id).toBe('classic')
    expect(getThemeSpec(null).id).toBe('classic')
    expect(getThemeSpec('clean').id).toBe('classic')   // legacy stub value
    expect(getThemeSpec('bold').id).toBe('classic')    // legacy stub value
    expect(getThemeSpec('nonsense').id).toBe('classic')
  })

  it('every theme CSS file exists at the repo root', () => {
    for (const spec of Object.values(THEMES)) {
      expect(fs.existsSync(path.join(REPO_ROOT, spec.cssFile)), spec.cssFile).toBe(true)
    }
  })

  it('every theme background asset exists', () => {
    for (const spec of Object.values(THEMES)) {
      for (const bg of [spec.coverBg, spec.sectionBg]) {
        expect(
          fs.existsSync(path.join(REPO_ROOT, 'resources', 'backgrounds', bg)),
          `${spec.id}: ${bg}`,
        ).toBe(true)
      }
    }
  })
})
