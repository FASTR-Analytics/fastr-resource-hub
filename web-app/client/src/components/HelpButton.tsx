import { t, type Language } from '../i18n/translations'

interface HelpButtonProps {
  onClick: () => void
  language: Language
}

export function HelpButton({ onClick, language }: HelpButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full bg-fastr-primary text-white shadow-lg hover:bg-fastr-primary-light hover:shadow-xl transition-all duration-200 flex items-center justify-center text-lg font-bold"
      title={t('tourHelpButton', language)}
      aria-label={t('tourHelpButton', language)}
    >
      ?
    </button>
  )
}
