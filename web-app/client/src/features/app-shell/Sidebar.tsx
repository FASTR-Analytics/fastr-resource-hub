import { ReactNode } from 'react'
import {
  Calendar,
  Library,
  Settings as SettingsIcon,
  LogOut,
  type LucideIcon,
} from 'lucide-react'

export type SidebarNavId = 'workshops' | 'library' | 'settings'

interface SidebarProps {
  active: SidebarNavId
  onNavChange: (id: SidebarNavId) => void
  workshopsLabel: string
  libraryLabel: string
  settingsLabel: string
  // Footer
  language: 'en' | 'fr'
  onLanguageChange: (lang: 'en' | 'fr') => void
  signOutLabel: string
  onSignOut: () => void
  // Optional extra footer content (rendered above lang/signout row)
  footerExtra?: ReactNode
}

const navItems: { id: SidebarNavId; icon: LucideIcon }[] = [
  { id: 'workshops', icon: Calendar },
  { id: 'library', icon: Library },
  { id: 'settings', icon: SettingsIcon },
]

export function Sidebar({
  active,
  onNavChange,
  workshopsLabel,
  libraryLabel,
  settingsLabel,
  language,
  onLanguageChange,
  signOutLabel,
  onSignOut,
  footerExtra,
}: SidebarProps) {
  const labels: Record<SidebarNavId, string> = {
    workshops: workshopsLabel,
    library: libraryLabel,
    settings: settingsLabel,
  }

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col">
      {/* Brand mark */}
      <div className="px-5 py-5 border-b border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-fastr-primary flex items-center justify-center text-white font-bold text-body-sm tracking-tight">
          F
        </div>
        <div className="leading-tight">
          <div className="font-bold text-fastr-primary text-body-sm">FASTR</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500">Deck Builder</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-3 flex flex-col gap-0.5">
        {navItems.map(({ id, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onNavChange(id)}
              data-tour={`nav-${id}`}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-body-sm font-semibold text-left transition-colors focus-ring ${
                isActive
                  ? 'bg-fastr-light text-fastr-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-fastr-primary'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden />
              <span>{labels[id]}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-slate-200 space-y-2">
        {footerExtra}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center bg-slate-50 rounded-md border border-slate-200 p-0.5" data-tour="language-toggle">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors ${
                language === 'en' ? 'bg-fastr-primary text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('fr')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors ${
                language === 'fr' ? 'bg-fastr-primary text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              FR
            </button>
          </div>
          <button
            onClick={onSignOut}
            data-tour="sign-out"
            title={signOutLabel}
            aria-label={signOutLabel}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors focus-ring"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

interface SidebarSlotProps {
  children?: ReactNode
}

// `SidebarFooterSlot` is unused for now — exposed for future "Help" / "Sign out"
// buttons to slot in below the nav.
export function SidebarFooterSlot({ children }: SidebarSlotProps) {
  return <div className="p-3 border-t border-slate-200 flex flex-col gap-1">{children}</div>
}
