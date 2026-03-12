import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { CheckCircle, XCircle, Info } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(0)

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId.current++
    setToasts(prev => [...prev, { id, message, type }])

    const duration = type === 'error' ? 6000 : 4000
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </ToastContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Container + individual toast
// ─────────────────────────────────────────────────────────────────────────────

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger slide-in on mount
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const typeStyles: Record<ToastType, string> = {
    success: 'bg-teal-600 text-white shadow-teal-500/25',
    error: 'bg-red-600 text-white shadow-red-500/25',
    info: 'bg-gray-800 text-white shadow-gray-800/25',
  }

  const IconComponent: Record<ToastType, typeof CheckCircle> = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }

  const Icon = IconComponent[toast.type]

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg max-w-sm transition-all duration-300 ease-out ${
        typeStyles[toast.type]
      } ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 opacity-90" />
      <p className="text-sm flex-1">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-white/70 hover:text-white ml-2 flex-shrink-0 text-lg leading-none transition-colors duration-200"
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  )
}
