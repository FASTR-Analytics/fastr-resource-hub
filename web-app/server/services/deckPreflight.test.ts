import { describe, it, expect, vi } from 'vitest'

// getCustomSlides hits the DB; stub it so the preflight tests stay unit-level.
vi.mock('../db/database.js', async (orig) => {
  const actual = await orig<any>()
  return { ...actual, getCustomSlides: vi.fn(async () => []) }
})

import { runPreflight } from './deckPreflight'
import { getCustomSlides } from '../db/database'
import type { WorkshopConfig } from '../db/database'

const mockedGetCustomSlides = vi.mocked(getCustomSlides)

const baseConfig: WorkshopConfig = {
  workshop: { name: 'Test', country: 'T', location: '', date: '', facilitators: 'T' },
  schedule: { days: 1 },
  content: { modules: [], custom_slides: [] },
} as any

function configWith(day1: any[]): WorkshopConfig {
  return { ...baseConfig, schedule: { days: 1, day1 } } as any
}

describe('runPreflight — deck health check', () => {
  it('flags a placeholder (empty) session as an error', async () => {
    const result = await runPreflight('w', configWith([
      { _id: 's1', session: 'Empty session' },
    ]), 'en')
    const placeholder = result.findings.find(f => f.code === 'placeholder')
    expect(placeholder).toBeTruthy()
    expect(placeholder!.severity).toBe('error')
    expect(placeholder!.sessionName).toBe('Empty session')
  })

  it('flags a leaked template token as an unsubstituted-var error', async () => {
    mockedGetCustomSlides.mockResolvedValueOnce([
      { filename: 'x.md', content: '# Title\n\nLeftover {{DAY_1}} token', source_ref: null, source_hash: null } as any,
    ])
    const result = await runPreflight('w', configWith([
      { _id: 's1', session: 'Custom', slides: ['custom_slides/x.md'] },
    ]), 'en')
    const leaked = result.findings.find(f => f.code === 'unsubstituted-var')
    expect(leaked).toBeTruthy()
    expect(leaked!.severity).toBe('error')
    expect(leaked!.detail).toBe('{{DAY_1}}')
  })

  it('flags a missing image as a warning', async () => {
    mockedGetCustomSlides.mockResolvedValueOnce([
      { filename: 'y.md', content: '# T\n\n![x](../../resources/diagrams/nope_xyz.png)', source_ref: null, source_hash: null } as any,
    ])
    const result = await runPreflight('w', configWith([
      { _id: 's1', session: 'Custom', slides: ['custom_slides/y.md'] },
    ]), 'en')
    const missing = result.findings.find(f => f.code === 'missing-image')
    expect(missing).toBeTruthy()
    expect(missing!.severity).toBe('warning')
  })

  it('reports a clean deck with no findings', async () => {
    const result = await runPreflight('w', configWith([
      { _id: 's1', session: 'Intro', topics: ['m0_1'] },
    ]), 'en')
    expect(result.slideCount).toBeGreaterThan(0)
    // m0_1 is real library content with no placeholders/leaked vars/missing imgs
    expect(result.findings.filter(f => f.code === 'placeholder')).toHaveLength(0)
  })

  it('counts slides across the deck', async () => {
    const result = await runPreflight('w', configWith([
      { _id: 's1', session: 'Empty A' },
      { _id: 's2', session: 'Empty B' },
    ]), 'en')
    expect(result.slideCount).toBe(2)
  })
})
