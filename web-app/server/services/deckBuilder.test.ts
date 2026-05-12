import { describe, it, expect } from 'vitest'
import { buildSessionMarkdown } from './deckBuilder'
import type { WorkshopConfig } from '../db/database'

/**
 * Tests for the custom-slide build path.
 *
 * The bug we're guarding against: custom slides are stored in the `custom_slides`
 * DB table (by workshop id + filename) but `loadSlideContent` historically only
 * read from disk — so any slide referenced as `custom_slides/{filename}` was
 * silently dropped from PDF/PPTX exports.
 *
 * The fix threads a pre-fetched `Map<filename, content>` from `buildMarkdown`
 * down through `buildSessionSlides` → `loadSlideContent`. These tests exercise
 * that path via the public `buildSessionMarkdown` entry point so the regression
 * surfaces without spinning up the DB.
 */

const baseConfig: WorkshopConfig = {
  workshop: {
    name: 'Rwanda 2026',
    country: 'Rwanda',
    location: 'Kigali',
    date: '2026-05-10',
    facilitators: 'A. Niang',
  },
  schedule: { days: 1 },
  content: { modules: [], custom_slides: [] },
}

describe('buildSessionMarkdown — custom slide resolution', () => {
  it('returns the custom slide content when the filename is in the map', async () => {
    const customSlideMap = new Map<string, string>([
      [
        'diagram_123.md',
        '---\nmarp: true\ntheme: fastr\n---\n\n# My Diagram\n\n![h:500](../../resources/diagrams/foo.svg)\n',
      ],
    ])

    const result = await buildSessionMarkdown(
      { session: 'Diagram', slides: ['custom_slides/diagram_123.md'] },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    expect(result).toBeTruthy()
    expect(result).toContain('# My Diagram')
    expect(result).toContain('![h:500](../../resources/diagrams/foo.svg)')
  })

  it('strips frontmatter from custom slide content', async () => {
    const customSlideMap = new Map<string, string>([
      ['x.md', '---\nmarp: true\ntheme: fastr\npaginate: true\n---\n\n# Body only'],
    ])

    const result = await buildSessionMarkdown(
      { session: 'X', slides: ['custom_slides/x.md'] },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    expect(result).not.toContain('marp: true')
    expect(result).not.toContain('theme: fastr')
    expect(result).not.toContain('paginate: true')
    expect(result).toContain('# Body only')
  })

  it('strips a trailing slide separator so deck joining stays clean', async () => {
    const customSlideMap = new Map<string, string>([
      ['x.md', '# Slide\n\nSome body\n\n---'],
    ])

    const result = await buildSessionMarkdown(
      { session: 'X', slides: ['custom_slides/x.md'] },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    // Body keeps its trailing newline trim but no orphan `---` at the end.
    expect(result?.trim().endsWith('---')).toBe(false)
    expect(result).toContain('Some body')
  })

  it('substitutes {{WORKSHOP_NAME}} and other variables inside custom slides', async () => {
    const customSlideMap = new Map<string, string>([
      ['x.md', '# {{WORKSHOP_NAME}}\n\nLocation: {{LOCATION}}\n'],
    ])

    const result = await buildSessionMarkdown(
      { session: 'X', slides: ['custom_slides/x.md'] },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    expect(result).toContain('# Rwanda 2026')
    expect(result).toContain('Location: Kigali')
    expect(result).not.toContain('{{WORKSHOP_NAME}}')
  })

  it('falls back to a placeholder when the custom slide is missing from the map', async () => {
    // When a slide file can't be resolved at all, deckBuilder emits a
    // PLACEHOLDER stub rather than dropping the session silently. The
    // important regression guard is that the *other* slide's content is not
    // accidentally injected.
    const customSlideMap = new Map<string, string>([
      ['other.md', '# Some other slide'],
    ])

    const result = await buildSessionMarkdown(
      { session: 'Missing', slides: ['custom_slides/missing.md'] },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    expect(result).toBeTruthy()
    expect(result).toContain('PLACEHOLDER')
    expect(result).not.toContain('Some other slide')
  })

  it('falls back to a placeholder when no map is supplied at all', async () => {
    // Without a map and without a disk match, buildSessionSlides falls through
    // to the placeholder slide. Important: it must not throw.
    const result = await buildSessionMarkdown(
      { session: 'Diagram', slides: ['custom_slides/whatever.md'] },
      baseConfig,
      1,
      // intentionally no customSlideMap arg
    )

    expect(result).toBeTruthy()
    expect(result).toContain('PLACEHOLDER')
  })

  it('emits a placeholder for an empty session with no slides and no module', async () => {
    const result = await buildSessionMarkdown(
      { session: 'Empty' },
      baseConfig,
      1,
    )

    expect(result).toBeTruthy()
    expect(result).toContain('PLACEHOLDER')
  })
})

describe('buildSessionMarkdown — diagram session shape (regression guard)', () => {
  it('produces a content slide (H1 + inline image) from a diagram-as-slide markdown', async () => {
    // This is the exact markdown shape that AddContentDrawer.handleDiagramSaved
    // writes. The slide is editable content (not full-bleed background).
    const diagramSlide = `---
marp: true
theme: fastr
paginate: true
---

# My Process

![h:500](../../resources/diagrams/my_process.svg)
`
    const customSlideMap = new Map<string, string>([
      ['diagram_1.md', diagramSlide],
    ])

    const result = await buildSessionMarkdown(
      { session: 'My Process', slides: ['custom_slides/diagram_1.md'] },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    expect(result).toBeTruthy()
    expect(result).toContain('# My Process')
    expect(result).toContain('![h:500](../../resources/diagrams/my_process.svg)')
    // Not a full-bleed background slide
    expect(result).not.toContain('![bg ')
    expect(result).not.toContain('![bg fit]')
  })
})
