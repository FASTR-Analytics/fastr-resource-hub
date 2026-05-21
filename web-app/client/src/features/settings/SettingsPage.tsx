import { useEffect, useState } from 'react'
import {
  Cog,
  HardDrive,
  Info,
  Loader2,
  Trash2,
  Globe,
  ExternalLink,
} from 'lucide-react'
import { useWorkshopStore } from '../../stores/workshop'
import { t, type Language } from '../../i18n/translations'
import { storageAPI } from '../../../lib/api'
import { useToast } from '../../components/Toast'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { SegmentedControl } from '../../components/ui/SegmentedControl'
import { Pill } from '../../components/ui/Pill'

type SettingsTab = 'general' | 'storage' | 'about'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// SettingsPage renders inside AppShell — no outer h-screen wrapper or topbar.
// It provides its own secondary sub-nav (General / Storage / About) within
// the shell's content area.
export function SettingsPage() {
  const { contentLanguage, setContentLanguage } = useWorkshopStore()
  const [tab, setTab] = useState<SettingsTab>('general')

  return (
    <div className="h-full flex bg-slate-50">
      {/* Secondary sub-nav (sits beside the main AppShell sidebar) */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 p-3 space-y-1" data-tour="settings-subnav">
        <SettingsNavItem
          label={t('settingsGeneral', contentLanguage)}
          active={tab === 'general'}
          icon={Cog}
          onClick={() => setTab('general')}
        />
        <SettingsNavItem
          label={t('settingsStorage', contentLanguage)}
          active={tab === 'storage'}
          icon={HardDrive}
          onClick={() => setTab('storage')}
        />
        <SettingsNavItem
          label={t('settingsAbout', contentLanguage)}
          active={tab === 'about'}
          icon={Info}
          onClick={() => setTab('about')}
        />
      </aside>

      {/* Pane content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl space-y-6">
          {tab === 'general' && (
            <GeneralPane
              contentLanguage={contentLanguage}
              onLanguageChange={setContentLanguage}
            />
          )}
          {tab === 'storage' && <StoragePane language={contentLanguage} />}
          {tab === 'about' && <AboutPane language={contentLanguage} />}
        </div>
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar nav item
// ─────────────────────────────────────────────────────────────────────────────

interface SettingsNavItemProps {
  label: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
  onClick: () => void
}

function SettingsNavItem({ label, icon: Icon, active, onClick }: SettingsNavItemProps) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-body-sm font-semibold transition-colors focus-ring ${
        active
          ? 'bg-fastr-primary text-white'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// General pane — language preference
// ─────────────────────────────────────────────────────────────────────────────

interface GeneralPaneProps {
  contentLanguage: Language
  onLanguageChange: (lang: Language) => void
}

function GeneralPane({ contentLanguage, onLanguageChange }: GeneralPaneProps) {
  return (
    <>
      <SectionHeading
        title={t('settingsGeneral', contentLanguage)}
        description={t('settingsGeneralDesc', contentLanguage)}
      />
      <Card className="p-5">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-slate-400 mt-0.5" aria-hidden />
          <div className="flex-1">
            <div className="text-body font-semibold text-slate-900">
              {t('settingsLanguage', contentLanguage)}
            </div>
            <p className="text-body-sm text-slate-500 mt-1 mb-4">
              {t('settingsLanguageDesc', contentLanguage)}
            </p>
            <SegmentedControl<Language>
              value={contentLanguage}
              onChange={onLanguageChange}
              options={[
                { value: 'en', label: 'English' },
                { value: 'fr', label: 'Français' },
              ]}
              ariaLabel={t('settingsLanguage', contentLanguage)}
            />
          </div>
        </div>
      </Card>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Storage pane — view + clear exports
// ─────────────────────────────────────────────────────────────────────────────

function StoragePane({ language }: { language: Language }) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [totalSize, setTotalSize] = useState(0)
  const [fileCount, setFileCount] = useState(0)
  const [clearing, setClearing] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await storageAPI.listOutputs()
      setTotalSize(res.totalSize)
      setFileCount(res.files.length)
    } catch (err: any) {
      showToast(err.message || 'Failed to load storage info', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleClear() {
    if (!confirm(t('confirmClearExports', language))) return
    setClearing(true)
    try {
      await storageAPI.clearOutputs()
      await load()
      showToast(t('exportsCleared', language), 'success')
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setClearing(false)
    }
  }

  return (
    <>
      <SectionHeading
        title={t('settingsStorage', contentLanguage(language))}
        description={t('settingsStorageDesc', language)}
      />
      <Card className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <HardDrive className="w-5 h-5 text-slate-400 mt-0.5" aria-hidden />
          <div className="flex-1">
            <div className="text-body font-semibold text-slate-900">{t('exportedFiles', language)}</div>
            {loading ? (
              <div className="flex items-center gap-2 text-body-sm text-slate-500 mt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('loading', language)}
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <Pill tone="neutral">{fileCount} {fileCount === 1 ? t('file', language) : t('files', language)}</Pill>
                <Pill tone="neutral">{formatBytes(totalSize)}</Pill>
              </div>
            )}
            <p className="text-body-sm text-slate-500 mt-3">{t('exportedFilesDesc', language)}</p>
          </div>
        </div>
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button
            variant="danger"
            onClick={handleClear}
            disabled={loading || clearing || fileCount === 0}
            icon={clearing ? undefined : Trash2}
          >
            {clearing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('clearing', language)}
              </>
            ) : (
              t('clearAllExports', language)
            )}
          </Button>
        </div>
      </Card>
    </>
  )
}

// `contentLanguage()` is a tiny helper — Storage pane reads `language` directly,
// but SectionHeading needs an identifier in scope. Kept inline to avoid
// over-decomposing the file.
function contentLanguage(lang: Language): Language {
  return lang
}

// ─────────────────────────────────────────────────────────────────────────────
// About pane
// ─────────────────────────────────────────────────────────────────────────────

function AboutPane({ language }: { language: Language }) {
  return (
    <>
      <SectionHeading
        title={t('settingsAbout', language)}
        description={t('settingsAboutDesc', language)}
      />
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-body-sm font-semibold text-slate-700">FASTR Deck Builder</span>
          <Pill tone="teal">v1.0</Pill>
        </div>
        <p className="text-body-sm text-slate-600">{t('aboutAppDesc', language)}</p>
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <AboutLink
            label={t('aboutDocs', language)}
            href="https://data.gffportal.org/key-theme/FASTR"
          />
          <AboutLink
            label={t('aboutDesignSystem', language)}
            href="../FASTR Design System/README.md"
          />
        </div>
      </Card>
    </>
  )
}

function AboutLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-body-sm text-fastr-secondary hover:text-fastr-primary transition-colors focus-ring"
    >
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5" />
    </a>
  )
}
