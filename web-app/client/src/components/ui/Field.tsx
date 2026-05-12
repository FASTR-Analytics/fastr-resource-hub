import { ReactNode } from 'react'

interface FieldProps {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  htmlFor?: string
  className?: string
  children: ReactNode
}

export function Field({ label, hint, error, required, htmlFor, className = '', children }: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-caption text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-caption text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}
