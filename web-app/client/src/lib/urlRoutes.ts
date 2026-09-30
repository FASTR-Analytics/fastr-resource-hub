/**
 * URL ↔ app-state mapping for the Deck Builder.
 *
 * The app keeps its navigation in state (`appMode`, the open workshop, the
 * preview toggle). These two pure functions translate that state to a path and
 * back, so the address bar, refresh, Back/Forward and shared links all work
 * without a router library. Kept dependency-free and side-effect-free so they
 * can be unit-tested.
 *
 *   /                        workshops list
 *   /library                 content library
 *   /settings                settings
 *   /workshops               builder with no workshop open (selector)
 *   /workshops/:id           builder for that workshop
 *   /workshops/:id/preview   the slide preview of that workshop
 *   /workshops/:id/import    the slide import wizard for that workshop
 */
export type AppMode = 'select' | 'workshop' | 'library' | 'import' | 'settings'

export interface RouteState {
  mode: AppMode
  workshopId: string | null
  preview: boolean
}

const ID = /^[A-Za-z0-9_.-]+$/

export function parsePath(pathname: string): RouteState {
  const parts = pathname.replace(/\/+$/, '').split('/').filter(Boolean).map(decodeURIComponent)
  if (parts.length === 0) return { mode: 'select', workshopId: null, preview: false }
  if (parts[0] === 'library' && parts.length === 1) return { mode: 'library', workshopId: null, preview: false }
  if (parts[0] === 'settings' && parts.length === 1) return { mode: 'settings', workshopId: null, preview: false }
  if (parts[0] === 'workshops') {
    if (parts.length === 1) return { mode: 'workshop', workshopId: null, preview: false }
    const id = parts[1]
    if (!ID.test(id)) return { mode: 'select', workshopId: null, preview: false }
    if (parts.length === 2) return { mode: 'workshop', workshopId: id, preview: false }
    if (parts.length === 3 && parts[2] === 'preview') return { mode: 'workshop', workshopId: id, preview: true }
    if (parts.length === 3 && parts[2] === 'import') return { mode: 'import', workshopId: id, preview: false }
  }
  return { mode: 'select', workshopId: null, preview: false }
}

export function pathFor(state: RouteState): string {
  const id = state.workshopId ? encodeURIComponent(state.workshopId) : null
  switch (state.mode) {
    case 'select': return '/'
    case 'library': return '/library'
    case 'settings': return '/settings'
    case 'import': return id ? `/workshops/${id}/import` : '/workshops'
    case 'workshop': return id ? `/workshops/${id}${state.preview ? '/preview' : ''}` : '/workshops'
  }
}
