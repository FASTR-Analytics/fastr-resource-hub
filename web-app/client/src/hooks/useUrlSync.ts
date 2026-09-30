import React, { useEffect, useRef } from 'react'
import { parsePath, pathFor, AppMode } from '../lib/urlRoutes'

interface Args {
  enabled: boolean
  /** True while a workshop is being fetched: no intermediate path is pushed. */
  loading: boolean
  appMode: AppMode
  setAppMode: (m: AppMode) => void
  currentWorkshopId: string | null
  selectWorkshop: (id: string) => Promise<void>
  showPreview: boolean
  setShowPreview: (v: boolean) => void
  onWorkshopNotFound: (id: string) => void
}

/**
 * Two-way binding between the address bar and the app's navigation state.
 *
 * - On first enable (after sign-in) and on every Back/Forward, the path is
 *   parsed into state; a workshop named in the path is opened.
 * - When state changes for any other reason, the path is pushed so refresh
 *   and links keep working. While a workshop from the URL is still loading,
 *   nothing is pushed, so the intermediate "no workshop" state never lands
 *   in history.
 */
export function useUrlSync(a: Args): { urlPending: React.MutableRefObject<string | null> } {
  const pending = useRef<string | null>(null)
  const started = useRef(false)
  const latest = useRef(a)
  latest.current = a

  const applyPath = (pathname: string) => {
    const r = parsePath(pathname)
    const { setAppMode, setShowPreview, currentWorkshopId, selectWorkshop, onWorkshopNotFound } = latest.current
    // Start the fetch before switching mode: the store flags isLoading
    // synchronously, so the builder never sees "no workshop, not loading" and
    // does not open the selector over a deep link.
    if (r.workshopId && r.workshopId !== currentWorkshopId) {
      pending.current = r.workshopId
      selectWorkshop(r.workshopId).catch(() => {
        pending.current = null
        onWorkshopNotFound(r.workshopId!)
      })
    }
    setAppMode(r.mode)
    setShowPreview(r.preview)
  }

  // First run after sign-in: the URL wins over the default state.
  useEffect(() => {
    if (!a.enabled || started.current) return
    started.current = true
    applyPath(window.location.pathname)
    const onPop = () => applyPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a.enabled])

  // State → URL.
  useEffect(() => {
    if (!a.enabled || !started.current) return
    if (pending.current) {
      if (a.currentWorkshopId !== pending.current) return
      pending.current = null
    }
    if (a.appMode === 'workshop' && !a.currentWorkshopId && a.loading) return
    const path = pathFor({ mode: a.appMode, workshopId: a.appMode === 'select' || a.appMode === 'library' || a.appMode === 'settings' ? null : a.currentWorkshopId, preview: a.showPreview })
    if (path !== window.location.pathname) window.history.pushState({}, '', path)
  }, [a.enabled, a.loading, a.appMode, a.currentWorkshopId, a.showPreview])

  return { urlPending: pending }
}
