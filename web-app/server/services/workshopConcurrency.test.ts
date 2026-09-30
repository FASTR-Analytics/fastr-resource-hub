import { describe, it, expect } from 'vitest'
import { checkExpectedUpdatedAt, parseTimestampMs, sqliteTimestampToIso } from './workshopConcurrency'

describe('workshopConcurrency — timestamp parsing', () => {
  it('parses SQLite CURRENT_TIMESTAMP form as UTC', () => {
    expect(sqliteTimestampToIso('2026-09-30 10:00:00')).toBe('2026-09-30T10:00:00.000Z')
  })

  it('parses SQLite strftime %f form with milliseconds', () => {
    expect(sqliteTimestampToIso('2026-09-30 10:00:00.123')).toBe('2026-09-30T10:00:00.123Z')
  })

  it('passes ISO strings through', () => {
    expect(sqliteTimestampToIso('2026-09-30T10:00:00.500Z')).toBe('2026-09-30T10:00:00.500Z')
  })

  it('returns null for empty or garbage input', () => {
    expect(sqliteTimestampToIso(null)).toBeNull()
    expect(sqliteTimestampToIso('')).toBeNull()
    expect(parseTimestampMs('not a date')).toBeNull()
  })
})

describe('workshopConcurrency — checkExpectedUpdatedAt (409 logic)', () => {
  const stored = '2026-09-30 10:00:00.250'

  it('allows the write when no expectation is sent (legacy clients)', () => {
    expect(checkExpectedUpdatedAt(stored, undefined)).toEqual({ conflict: false })
    expect(checkExpectedUpdatedAt(stored, '')).toEqual({ conflict: false })
  })

  it('allows the write when the client saw the current version', () => {
    expect(checkExpectedUpdatedAt(stored, '2026-09-30T10:00:00.250Z')).toEqual({ conflict: false })
  })

  it('allows the write when the expectation is somehow newer than stored', () => {
    expect(checkExpectedUpdatedAt(stored, '2026-09-30T10:00:01.000Z')).toEqual({ conflict: false })
  })

  it('rejects the write when the row changed after the client last read it', () => {
    const result = checkExpectedUpdatedAt(stored, '2026-09-30T09:59:59.000Z')
    expect(result).toEqual({ conflict: true, updatedAt: '2026-09-30T10:00:00.250Z' })
  })

  it('detects sub-second conflicts', () => {
    const result = checkExpectedUpdatedAt(stored, '2026-09-30T10:00:00.100Z')
    expect(result.conflict).toBe(true)
  })

  it('treats a legacy second-precision row as equal to its ISO echo', () => {
    expect(checkExpectedUpdatedAt('2026-09-30 10:00:00', '2026-09-30T10:00:00.000Z')).toEqual({ conflict: false })
  })

  it('rejects an unparseable expectation so a broken client cannot bypass the check', () => {
    const result = checkExpectedUpdatedAt(stored, 'yesterday')
    expect(result.conflict).toBe(true)
  })

  it('allows the write when the stored timestamp is missing', () => {
    expect(checkExpectedUpdatedAt(null, '2026-09-30T10:00:00.000Z')).toEqual({ conflict: false })
  })
})
