import { describe, it, expect } from 'vitest'
import { parsePath, pathFor, RouteState } from './urlRoutes'

describe('urlRoutes', () => {
  const cases: Array<[string, RouteState]> = [
    ['/', { mode: 'select', workshopId: null, preview: false }],
    ['', { mode: 'select', workshopId: null, preview: false }],
    ['/library', { mode: 'library', workshopId: null, preview: false }],
    ['/settings/', { mode: 'settings', workshopId: null, preview: false }],
    ['/workshops', { mode: 'workshop', workshopId: null, preview: false }],
    ['/workshops/2026-senegal', { mode: 'workshop', workshopId: '2026-senegal', preview: false }],
    ['/workshops/2026-senegal/preview', { mode: 'workshop', workshopId: '2026-senegal', preview: true }],
    ['/workshops/2026-senegal/import', { mode: 'import', workshopId: '2026-senegal', preview: false }],
  ]

  it.each(cases)('parses %s', (path, expected) => {
    expect(parsePath(path)).toEqual(expected)
  })

  it.each(cases.filter(([p]) => p !== '' && p !== '/settings/'))('round-trips %s', (path, state) => {
    expect(pathFor(state)).toBe(path)
  })

  it('falls back to the list for unknown or unsafe paths', () => {
    expect(parsePath('/nope').mode).toBe('select')
    expect(parsePath('/workshops/../etc').mode).toBe('select')
    expect(parsePath('/workshops/2026-senegal/other').mode).toBe('select')
  })

  it('encodes ids in paths', () => {
    expect(pathFor({ mode: 'workshop', workshopId: 'a b', preview: false })).toBe('/workshops/a%20b')
  })
})
