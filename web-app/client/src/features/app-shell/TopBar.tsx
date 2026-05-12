import { ReactNode } from 'react'
import { Search } from 'lucide-react'

interface TopBarProps {
  section: string
  breadcrumb?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  primaryAction?: ReactNode
  actions?: ReactNode
}

export function TopBar({
  section,
  breadcrumb,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  primaryAction,
  actions,
}: TopBarProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-5 flex items-center justify-between gap-4">
      {/* Left: breadcrumb */}
      <div className="flex items-baseline gap-2 min-w-0">
        <h1 className="text-body font-semibold text-fastr-primary m-0 truncate">{section}</h1>
        {breadcrumb && (
          <>
            <span className="text-caption text-slate-300">/</span>
            <span className="text-caption text-slate-500 truncate">{breadcrumb}</span>
          </>
        )}
      </div>

      {/* Right: search + actions + primary CTA */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {onSearchChange && (
          <div className="relative hidden md:block">
            <Search
              className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              aria-hidden
            />
            <input
              type="search"
              value={searchValue ?? ''}
              onChange={e => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-body-sm w-64 focus:outline-none focus:border-fastr-secondary focus:ring-2 focus:ring-fastr-secondary/20"
            />
          </div>
        )}
        {actions}
        {primaryAction}
      </div>
    </header>
  )
}
