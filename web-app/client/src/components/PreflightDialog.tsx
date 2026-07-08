import { AlertCircle, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { PreflightFinding, PreflightResult } from '../../lib/api'
import { t, TranslationKey } from '../i18n/translations'
import { useWorkshopStore } from '../stores/workshop'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'

interface PreflightDialogProps {
  result: PreflightResult | null
  loading: boolean
  /** When set, this export runs on "Export anyway". Absent for a standalone check. */
  pendingFormat?: 'html' | 'pdf' | 'pptx' | null
  onExportAnyway?: () => void
  onClose: () => void
}

/** Resolve a finding to human copy. message is a key; detail interpolates {x}. */
function findingText(f: PreflightFinding, lang: 'en' | 'fr' | 'pt'): string {
  const key: Record<string, TranslationKey> = {
    'placeholder': 'pfPlaceholder',
    'unsubstituted-var': 'pfUnfilledVar',
    'unfilled-objectives': 'pfUnfilledObjectives',
    'missing-image': 'pfMissingImage',
    'overflow-split': 'pfOverflowSplit',
    'overflow-flag': 'pfOverflowFlag',
    'stale-fork': 'pfStaleFork',
  }
  const tmpl = t(key[f.message] ?? 'pfPlaceholder', lang)
  return tmpl.replace('{x}', f.detail ?? '')
}

function Row({ finding }: { finding: PreflightFinding }) {
  const { contentLanguage } = useWorkshopStore()
  const isError = finding.severity === 'error'
  return (
    <li className="flex items-start gap-2 py-1.5">
      {isError
        ? <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
        : <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />}
      <div className="min-w-0">
        <div className="text-body-sm text-slate-800">{findingText(finding, contentLanguage)}</div>
        {(finding.sessionName || finding.dayNumber) && (
          <div className="text-caption text-slate-500">
            {finding.dayNumber ? `${t('day', contentLanguage)} ${finding.dayNumber}` : ''}
            {finding.sessionName ? ` · ${finding.sessionName}` : ''}
          </div>
        )}
      </div>
    </li>
  )
}

export function PreflightDialog({ result, loading, pendingFormat, onExportAnyway, onClose }: PreflightDialogProps) {
  const { contentLanguage } = useWorkshopStore()
  const errors = result?.findings.filter(f => f.severity === 'error') ?? []
  const warnings = result?.findings.filter(f => f.severity === 'warning') ?? []
  const clear = !loading && result && result.findings.length === 0

  return (
    <Modal
      open
      onClose={onClose}
      title={t('preflightTitle', contentLanguage)}
      size="md"
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            {pendingFormat ? t('cancel', contentLanguage) : t('close', contentLanguage)}
          </Button>
          {pendingFormat && onExportAnyway && (
            <Button variant="primary" onClick={onExportAnyway} disabled={loading}>
              {t('exportAnyway', contentLanguage)}
            </Button>
          )}
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center gap-2 text-body-sm text-slate-500 py-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          {t('buildingPreview', contentLanguage)}
        </div>
      ) : clear ? (
        <div className="flex items-center gap-2 text-body-sm text-slate-700 py-4">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          {t('preflightAllClear', contentLanguage)}
        </div>
      ) : (
        <div className="space-y-4">
          {errors.length > 0 && (
            <div>
              <div className="text-caption font-semibold uppercase tracking-wide text-slate-500 mb-1">
                {t('preflightErrorsLabel', contentLanguage)}
              </div>
              <ul className="divide-y divide-slate-100">
                {errors.map((f, i) => <Row key={`e${i}`} finding={f} />)}
              </ul>
            </div>
          )}
          {warnings.length > 0 && (
            <div>
              <div className="text-caption font-semibold uppercase tracking-wide text-slate-500 mb-1">
                {t('preflightWarningsLabel', contentLanguage)}
              </div>
              <ul className="divide-y divide-slate-100">
                {warnings.map((f, i) => <Row key={`w${i}`} finding={f} />)}
              </ul>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
