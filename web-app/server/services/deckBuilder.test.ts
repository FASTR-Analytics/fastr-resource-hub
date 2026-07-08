import { describe, it, expect } from 'vitest'
import { buildSessionMarkdown, buildSessionMarkdownWithSources, countRenderedSlides, resolveLibrarySlideContent, hashLibrarySource } from './deckBuilder'
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

  it('keeps all slides of a multi-slide file without frontmatter (regression: the old multiline regex ate the content between the first two internal --- separators)', async () => {
    const customSlideMap = new Map<string, string>([
      ['multi.md', '# Slide one\n\nFirst body\n\n---\n\n# Slide two\n\nSecond body\n\n---\n\n# Slide three\n\nThird body\n'],
    ])

    const result = await buildSessionMarkdown(
      { session: 'Multi', slides: ['custom_slides/multi.md'] },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    expect(result).toContain('# Slide one')
    expect(result).toContain('# Slide two')
    expect(result).toContain('# Slide three')
    expect(result).toContain('Second body')
  })

  it('still strips frontmatter from a multi-slide file that has it', async () => {
    const customSlideMap = new Map<string, string>([
      ['multi_fm.md', '---\nmarp: true\n---\n\n# Slide one\n\n---\n\n# Slide two\n'],
    ])

    const result = await buildSessionMarkdown(
      { session: 'Multi', slides: ['custom_slides/multi_fm.md'] },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    expect(result).not.toContain('marp: true')
    expect(result).toContain('# Slide one')
    expect(result).toContain('# Slide two')
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

describe('buildSessionMarkdownWithSources — slide overrides + provenance', () => {
  it('applies a slideOverride in the slides[] path and flags the chunk overridden', async () => {
    const customSlideMap = new Map<string, string>([
      ['fork_welcome_slide.md', '# Edited welcome\n\nPer-workshop version'],
    ])

    const result = await buildSessionMarkdownWithSources(
      {
        session: 'Welcome',
        slides: ['welcome_slide.md'],
        slideOverrides: { 'welcome_slide.md': 'custom_slides/fork_welcome_slide.md' },
      },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    expect(result).toBeTruthy()
    expect(result!.markdown).toContain('# Edited welcome')
    expect(result!.chunks).toHaveLength(1)
    expect(result!.chunks[0].source).toMatchObject({
      ref: 'welcome_slide.md',
      kind: 'library',
      editable: true,
      overridden: true,
    })
  })

  it('substitutes {{VAR}} placeholders inside override content', async () => {
    const customSlideMap = new Map<string, string>([
      ['fork_welcome_slide.md', '# {{WORKSHOP_NAME}}\n\nEdited'],
    ])

    const result = await buildSessionMarkdownWithSources(
      {
        session: 'Welcome',
        slides: ['welcome_slide.md'],
        slideOverrides: { 'welcome_slide.md': 'custom_slides/fork_welcome_slide.md' },
      },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    expect(result!.markdown).toContain('# Rwanda 2026')
    expect(result!.markdown).not.toContain('{{WORKSHOP_NAME}}')
  })

  it('applies a slideOverride in the topics path (library module file)', async () => {
    const customSlideMap = new Map<string, string>([
      ['fork_m0_1_what_is_fastr.md', '# What is FASTR (edited)\n\nWorkshop-specific framing'],
    ])

    const result = await buildSessionMarkdownWithSources(
      {
        session: 'Intro',
        topics: ['m0_1'],
        slideOverrides: { 'm0_1_what_is_fastr.md': 'custom_slides/fork_m0_1_what_is_fastr.md' },
      },
      baseConfig,
      1,
      undefined,
      'en',
      customSlideMap,
    )

    expect(result).toBeTruthy()
    expect(result!.markdown).toContain('# What is FASTR (edited)')
    const topicChunk = result!.chunks.find(c => c.source.ref === 'm0_1_what_is_fastr.md')
    expect(topicChunk?.source).toMatchObject({ kind: 'library', editable: true, overridden: true })
  })

  it('marks computed and generated chunks non-editable', async () => {
    const result = await buildSessionMarkdownWithSources(
      { session: 'Break', type: 'break', duration: 15 },
      baseConfig,
      1,
      undefined,
      'en',
    )
    expect(result!.chunks).toHaveLength(1)
    expect(result!.chunks[0].source).toMatchObject({ ref: null, kind: 'computed', editable: false })

    const topicResult = await buildSessionMarkdownWithSources(
      { session: 'Intro', topics: ['m0_1'] },
      baseConfig,
      1,
      undefined,
      'en',
    )
    // Section cover chunk is generated/non-editable; the topic file chunk is editable
    expect(topicResult!.chunks[0].source).toMatchObject({ ref: null, kind: 'generated', editable: false })
    expect(topicResult!.chunks[1].source.editable).toBe(true)
    expect(topicResult!.chunks[1].source.overridden).toBe(false)
  })

  it('classifies a day_title cover slide as non-editable (edit in Settings)', async () => {
    const result = await buildSessionMarkdownWithSources(
      { session: 'Cover', type: 'day_title', slides: ['title_slide.md'] },
      baseConfig,
      1,
      undefined,
      'en',
    )
    expect(result).toBeTruthy()
    expect(result!.chunks[0].source).toMatchObject({ kind: 'cover', editable: false })
  })
})

describe('hashLibrarySource — stale-fork detection', () => {
  it('returns a stable md5 for a real library slide, invariant to frontmatter', async () => {
    const a = await hashLibrarySource('m0_1_what_is_fastr.md', 'en')
    const b = await hashLibrarySource('m0_1_what_is_fastr.md', 'en')
    expect(a).toBeTruthy()
    expect(a).toMatch(/^[0-9a-f]{32}$/)
    expect(a).toBe(b)
  })

  it('returns null for an unresolvable ref', async () => {
    expect(await hashLibrarySource('does_not_exist_xyz.md', 'en')).toBeNull()
  })

  it('returns null for a computed ref (not source-backed)', async () => {
    expect(await hashLibrarySource('day1_agenda', 'en')).toBeNull()
  })
})

describe('countRenderedSlides — chunk → rendered-slide mapping', () => {
  it('counts 1 for a chunk with no separators', () => {
    expect(countRenderedSlides('# One slide\n\nBody text')).toBe(1)
  })

  it('counts internal --- separators', () => {
    expect(countRenderedSlides('# A\n\n---\n\n# B\n\n---\n\n# C')).toBe(3)
  })

  it('ignores --- inside code fences', () => {
    expect(countRenderedSlides('# A\n\n```\n---\n```\n\n# still slide A')).toBe(1)
  })

  it('treats --- directly after text as a setext heading, not a separator', () => {
    expect(countRenderedSlides('Heading text\n---\n\nBody')).toBe(1)
  })

  it('counts *** and ___ as separators', () => {
    expect(countRenderedSlides('# A\n\n***\n\n# B')).toBe(2)
    expect(countRenderedSlides('# A\n\n___\n\n# B')).toBe(2)
  })
})

describe('resolveLibrarySlideContent — fork-on-edit source resolver', () => {
  it('resolves a custom_slides/ ref from the supplied map', () => {
    const map = new Map<string, string>([['my_edit.md', '# My edit']])
    const res = resolveLibrarySlideContent('custom_slides/my_edit.md', 'en', map)
    expect(res).not.toBeNull()
    expect(res!.source).toBe('custom')
    expect(res!.filename).toBe('my_edit.md')
    expect(res!.content).toBe('# My edit')
  })

  it('returns null for a custom_slides/ ref that is missing from the map', () => {
    const res = resolveLibrarySlideContent('custom_slides/missing.md', 'en', new Map())
    expect(res).toBeNull()
  })

  it('resolves a real library slide from core_content/<module>/<file>', () => {
    // Using a known-existing module slide from the m4 folder.
    const res = resolveLibrarySlideContent('m4_1_approach_to_dqa.md', 'en')
    expect(res).not.toBeNull()
    expect(res!.source).toBe('library')
    expect(res!.filename).toBe('m4_1_approach_to_dqa.md')
    expect(res!.content.length).toBeGreaterThan(0)
  })

  it('returns null for dynamic computed slides (day1_agenda etc.)', () => {
    expect(resolveLibrarySlideContent('day1_agenda', 'en')).toBeNull()
    expect(resolveLibrarySlideContent('day3_recap', 'fr')).toBeNull()
  })

  it('returns null for an unresolvable ref', () => {
    expect(resolveLibrarySlideContent('m4_nonexistent_slide_xyz.md', 'en')).toBeNull()
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
