/**
 * Optimistic-concurrency helpers for workshop saves.
 *
 * The workshops table stores `updated_at` as a SQLite text timestamp in UTC
 * (`YYYY-MM-DD HH:MM:SS` for rows written with CURRENT_TIMESTAMP, or
 * `YYYY-MM-DD HH:MM:SS.SSS` for rows written by updateWorkshop, which uses
 * strftime('%f') for millisecond precision). The API exposes it to clients as
 * an ISO 8601 string; clients echo that string back on PUT so the server can
 * refuse a write that would clobber a newer version.
 *
 * Pure functions, no DB access — unit-tested in workshopConcurrency.test.ts.
 */

/** Convert a SQLite UTC timestamp (or an ISO string) to ISO 8601. */
export function sqliteTimestampToIso(raw: string | null | undefined): string | null {
  if (!raw) return null
  const ms = parseTimestampMs(raw)
  return ms === null ? null : new Date(ms).toISOString()
}

/** Epoch ms for a SQLite UTC timestamp or an ISO string; null if unparseable. */
export function parseTimestampMs(raw: string | null | undefined): number | null {
  if (!raw) return null
  const s = raw.trim()
  // SQLite form: "2026-09-30 10:00:00" / "2026-09-30 10:00:00.123" — UTC, no zone.
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/.test(s)
    ? s.replace(' ', 'T') + 'Z'
    : s
  const ms = Date.parse(normalized)
  return Number.isNaN(ms) ? null : ms
}

export type ConflictCheck =
  | { conflict: false }
  | { conflict: true; updatedAt: string | null }

/**
 * Decide whether a PUT carrying `expectedUpdatedAt` (the version the client
 * last saw) may overwrite a row whose stored timestamp is `storedUpdatedAt`.
 *
 * - No expectation sent → legacy client, no check (write allowed).
 * - Stored timestamp strictly newer than expected → conflict.
 * - Unparseable expectation → conflict (the client must reload to obtain a
 *   valid version; silently allowing the write would defeat the check).
 */
export function checkExpectedUpdatedAt(
  storedUpdatedAt: string | null | undefined,
  expectedUpdatedAt: string | null | undefined
): ConflictCheck {
  if (!expectedUpdatedAt) return { conflict: false }
  const stored = parseTimestampMs(storedUpdatedAt)
  const expected = parseTimestampMs(expectedUpdatedAt)
  if (expected === null) {
    return { conflict: true, updatedAt: sqliteTimestampToIso(storedUpdatedAt) }
  }
  if (stored === null) return { conflict: false }
  if (stored > expected) {
    return { conflict: true, updatedAt: sqliteTimestampToIso(storedUpdatedAt) }
  }
  return { conflict: false }
}
