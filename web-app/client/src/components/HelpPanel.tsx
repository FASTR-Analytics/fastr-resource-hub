import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  Compass,
  Plus,
  Calendar,
  Library,
  Globe,
  Sparkles,
  Download,
  BookOpen,
  FileText,
  HardDrive,
  Info,
  type LucideIcon,
} from 'lucide-react'
import { t, type Language, type TranslationKey } from '../i18n/translations'

interface HelpPanelProps {
  open: boolean
  onClose: () => void
  language: Language
  view: 'landing' | 'builder' | 'library' | 'settings'
  onStartTour: () => void
}

interface Tip {
  icon: LucideIcon
  titleKey: TranslationKey
  descKey: TranslationKey
}

const LANDING_TIPS: Tip[] = [
  { icon: Plus, titleKey: 'tourLandingCardsTitle', descKey: 'tourLandingCardsDesc' },
  { icon: Calendar, titleKey: 'tourExistingDecksTitle', descKey: 'tourExistingDecksDesc' },
  { icon: Library, titleKey: 'tourNavLibraryTitle', descKey: 'tourNavLibraryDesc' },
  { icon: Globe, titleKey: 'tourLanguageToggleTitle', descKey: 'tourLanguageToggleDesc' },
]

const BUILDER_TIPS: Tip[] = [
  { icon: Calendar, titleKey: 'tourScheduleTitle', descKey: 'tourScheduleDesc' },
  { icon: Plus, titleKey: 'tourAddSessionTitle', descKey: 'tourAddSessionDesc' },
  { icon: Sparkles, titleKey: 'tourAiTitle', descKey: 'tourAiDesc' },
  { icon: Download, titleKey: 'tourExportTitle', descKey: 'tourExportDesc' },
]

const LIBRARY_TIPS: Tip[] = [
  { icon: BookOpen, titleKey: 'helpLibBrowseTitle', descKey: 'helpLibBrowseDesc' },
  { icon: FileText, titleKey: 'helpLibHandoutsTitle', descKey: 'helpLibHandoutsDesc' },
  { icon: Download, titleKey: 'helpLibExportTitle', descKey: 'helpLibExportDesc' },
]

const SETTINGS_TIPS: Tip[] = [
  { icon: Globe, titleKey: 'settingsLanguage', descKey: 'settingsLanguageDesc' },
  { icon: HardDrive, titleKey: 'settingsStorage', descKey: 'settingsStorageDesc' },
  { icon: Info, titleKey: 'settingsAbout', descKey: 'settingsAboutDesc' },
]

const TIPS_BY_VIEW: Record<HelpPanelProps['view'], Tip[]> = {
  landing: LANDING_TIPS,
  builder: BUILDER_TIPS,
  library: LIBRARY_TIPS,
  settings: SETTINGS_TIPS,
}

export function HelpPanel({ open, onClose, language, view, onStartTour }: HelpPanelProps) {
  // Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const tips = TIPS_BY_VIEW[view]

  const panel = (
    <div
      className={`fixed inset-0 z-[9000] ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('helpPanelTitle', language)}
        className={`absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-elevated border-l border-slate-200 flex flex-col transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-200">
          <h2 className="text-h2 text-slate-900 m-0">{t('helpPanelTitle', language)}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus-ring"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Guided tour CTA */}
          <button
            type="button"
            onClick={() => {
              onClose()
              onStartTour()
            }}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-fastr-light text-left hover:bg-fastr-light/70 transition-colors focus-ring"
          >
            <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-fastr-primary text-white flex items-center justify-center">
              <Compass className="w-5 h-5" aria-hidden />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-body-sm font-semibold text-fastr-primary">
                {t('helpPanelTourCta', language)}
              </span>
              <span className="block text-caption text-slate-500 mt-0.5">
                {t('helpPanelTourDesc', language)}
              </span>
            </span>
          </button>

          {/* Quick tips */}
          <div>
            <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              {t('helpPanelTipsHeading', language)}
            </h3>
            <ul className="space-y-3">
              {tips.map(({ icon: Icon, titleKey, descKey }) => (
                <li key={titleKey} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center mt-0.5">
                    <Icon className="w-4 h-4" aria-hidden />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-body-sm font-semibold text-slate-900">
                      {t(titleKey, language)}
                    </div>
                    <p className="text-body-sm text-slate-500 mt-0.5">{t(descKey, language)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(panel, document.body)
}
