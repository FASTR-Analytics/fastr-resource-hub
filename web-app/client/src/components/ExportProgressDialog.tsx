import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { t } from '../i18n/translations'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'

interface Props {
  format: 'html' | 'pdf' | 'pptx'
  startedAt: number
  onCancel: () => void
  contentLanguage: 'en' | 'fr' | 'pt'
}

/** Shown while an export request is in flight: what is being built, elapsed time, Cancel. */
export function ExportProgressDialog({ format, startedAt, onCancel, contentLanguage }: Props) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [])
  const seconds = Math.max(0, Math.round((now - startedAt) / 1000))
  const formatLabel = t(format === 'pdf' ? 'exportFormatPdf' : format === 'pptx' ? 'exportFormatPptx' : 'exportFormatHtml', contentLanguage)

  return (
    <Modal
      open
      onClose={onCancel}
      closeOnBackdrop={false}
      title={`${t('exportPreparing', contentLanguage)} · ${formatLabel}`}
      size="sm"
      footer={
        <div className="flex w-full items-center justify-end">
          <Button variant="secondary" onClick={onCancel}>{t('cancel', contentLanguage)}</Button>
        </div>
      }
    >
      <div role="status" aria-live="polite" className="flex items-start gap-3 py-2">
        <Loader2 className="w-5 h-5 mt-0.5 flex-shrink-0 animate-spin text-fastr-primary" />
        <div className="space-y-1">
          <p className="text-body-sm text-slate-700">{t('exportTakes', contentLanguage)}</p>
          <p className="text-caption text-slate-500 tabular-nums">{t('exportElapsed', contentLanguage)}: {seconds}s</p>
        </div>
      </div>
    </Modal>
  )
}
