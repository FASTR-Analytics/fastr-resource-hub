import { ReactNode } from 'react'
import { Sidebar, type SidebarNavId } from './Sidebar'
import { TopBar } from './TopBar'

interface AppShellProps {
  // sidebar
  activeNav: SidebarNavId
  onNavChange: (id: SidebarNavId) => void
  workshopsLabel: string
  libraryLabel: string
  settingsLabel: string
  language: 'en' | 'fr'
  onLanguageChange: (lang: 'en' | 'fr') => void
  signOutLabel: string
  onSignOut: () => void
  sidebarFooterExtra?: ReactNode
  // topbar
  section: string
  breadcrumb?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  primaryAction?: ReactNode
  topbarActions?: ReactNode
  // body
  children: ReactNode
}

export function AppShell({
  activeNav,
  onNavChange,
  workshopsLabel,
  libraryLabel,
  settingsLabel,
  language,
  onLanguageChange,
  signOutLabel,
  onSignOut,
  sidebarFooterExtra,
  section,
  breadcrumb,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  primaryAction,
  topbarActions,
  children,
}: AppShellProps) {
  return (
    <div className="h-screen flex bg-slate-50">
      <Sidebar
        active={activeNav}
        onNavChange={onNavChange}
        workshopsLabel={workshopsLabel}
        libraryLabel={libraryLabel}
        settingsLabel={settingsLabel}
        language={language}
        onLanguageChange={onLanguageChange}
        signOutLabel={signOutLabel}
        onSignOut={onSignOut}
        footerExtra={sidebarFooterExtra}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          section={section}
          breadcrumb={breadcrumb}
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          primaryAction={primaryAction}
          actions={topbarActions}
        />
        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

export type { SidebarNavId }
