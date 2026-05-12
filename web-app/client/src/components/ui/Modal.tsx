import { ReactNode, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  initialFocusRef?: React.RefObject<HTMLElement>
  className?: string
  bodyClassName?: string
  children?: ReactNode
}

const sizeClass: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] max-h-[95vh]',
}

// Focusable selector matches what most a11y libs use
const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  initialFocusRef,
  className = '',
  bodyClassName = '',
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  // Track previously focused element + restore on close
  useEffect(() => {
    if (!open) return
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null
    // Focus initial element or first focusable
    const focusTarget =
      initialFocusRef?.current ||
      dialogRef.current?.querySelector<HTMLElement>(focusableSelector)
    focusTarget?.focus()
    return () => {
      previouslyFocusedRef.current?.focus?.()
    }
  }, [open, initialFocusRef])

  // Body scroll lock while open
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape' && closeOnEscape) {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      // Focus trap
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector)
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [closeOnEscape, onClose],
  )

  if (!open) return null

  const modal = (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      aria-hidden={false}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden
      />
      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        onKeyDown={handleKeyDown}
        className={`relative w-full ${sizeClass[size]} bg-white rounded-2xl border border-slate-200 shadow-elevated ring-1 ring-black/5 flex flex-col max-h-[90vh] ${className}`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200">
            <div className="min-w-0 flex-1">
              {title && (
                <h2 id="modal-title" className="text-h2 text-slate-900 m-0">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="text-body-sm text-slate-500 mt-1">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex-shrink-0 p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus-ring"
              >
                <X size={18} aria-hidden />
              </button>
            )}
          </div>
        )}

        <div className={`flex-1 overflow-y-auto px-6 py-5 ${bodyClassName}`}>{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-200 bg-slate-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
