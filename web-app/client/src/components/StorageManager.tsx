import { useState, useEffect } from 'react'
import { storageAPI } from '../../lib/api'
import { t, type Language } from '../i18n/translations'
import { useToast } from './Toast'
import { X, Loader2, FileOutput, Trash2 } from 'lucide-react'

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
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('manageStorage', language)}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              {t('loading', language)}
            </div>
          ) : fileCount === 0 ? (
            <div className="text-center py-6">
              <FileOutput className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">{t('exportCacheEmpty', language)}</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileOutput className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{t('exportCache', language)}</p>
                  <p className="text-xs text-gray-500">
                    {fileCount} {fileCount === 1 ? 'file' : 'files'} &middot; {formatBytes(totalSize)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClear}
                disabled={clearing}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
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
        </div>
      </div>
    </div>
  )
}
