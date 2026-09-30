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
  language: 'en' | 'fr' | 'pt'
  onLanguageChange: (lang: 'en' | 'fr' | 'pt') => void
  signOutLabel: string
  onSignOut: () => void
  sidebarFooterExtra?: ReactNode
  sidebarCollapsed?: boolean
  onToggleSidebar?: () => void
  collapseLabel?: string
  expandLabel?: string
  /** Screens with their own toolbar (the builder) skip the standard topbar. */
  hideTopBar?: boolean
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
  sidebarCollapsed,
  onToggleSidebar,
  collapseLabel,
  expandLabel,
  hideTopBar,
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
        collapsed={sidebarCollapsed}
        onToggleCollapse={onToggleSidebar}
        collapseLabel={collapseLabel}
        expandLabel={expandLabel}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {!hideTopBar && (
          <TopBar
            section={section}
            breadcrumb={breadcrumb}
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            primaryAction={primaryAction}
            actions={topbarActions}
          />
        )}
        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

export type { SidebarNavId }
