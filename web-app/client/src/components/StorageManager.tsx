import { useState, useEffect } from 'react'
import { storageAPI } from '../../lib/api'
import { t, type Language } from '../i18n/translations'
import { useToast } from './Toast'
import { Loader2, FileOutput, Trash2 } from 'lucide-react'
import { Modal } from './ui/Modal'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface StorageManagerProps {
  language: Language
  onClose: () => void
}

export function StorageManager({ language, onClose }: StorageManagerProps) {
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

  useEffect(() => { load() }, [])

  async function handleClear() {
    if (!confirm(t('confirmClearExports', language))) return
    setClearing(true)
    try {
      await storageAPI.clearOutputs()
      await load()
      showToast('Cleared', 'success')
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setClearing(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={t('manageStorage', language)} size="sm">
      {loading ? (
        <div className="flex items-center justify-center py-6 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          {t('loading', language)}
        </div>
      ) : fileCount === 0 ? (
        <div className="text-center py-6">
          <FileOutput className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-body-sm text-slate-500">{t('exportCacheEmpty', language)}</p>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <FileOutput className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-body-sm font-semibold text-slate-800">{t('exportCache', language)}</p>
              <p className="text-caption text-slate-500">
                {fileCount} {fileCount === 1 ? 'file' : 'files'} &middot; {formatBytes(totalSize)}
              </p>
            </div>
          </div>
          <button
            onClick={handleClear}
            disabled={clearing}
            className="flex items-center gap-1.5 text-body-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 focus-ring"
          >
            {clearing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                {t('clearAll', language)}
              </>
            )}
          </button>
        </div>
      )}
    </Modal>
  )
}
