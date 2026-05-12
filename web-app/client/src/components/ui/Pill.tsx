import { HTMLAttributes, ReactNode } from 'react'

type PillTone = 'teal' | 'cyan' | 'gold' | 'plum' | 'neutral' | 'success' | 'danger'

interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: PillTone
  size?: 'sm' | 'md'
  children?: ReactNode
}

const toneClass: Record<PillTone, string> = {
  teal: 'bg-fastr-light text-fastr-primary',
  cyan: 'bg-cyan-50 text-cyan-700',
  gold: 'bg-amber-50 text-amber-700',
  plum: 'bg-violet-50 text-violet-700',
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-50 text-emerald-700',
  danger: 'bg-red-50 text-red-700',
}

export function Pill({
  tone = 'neutral',
  size = 'md',
  className = '',
  children,
  ...rest
}: PillProps) {
  const sizeClass = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-caption px-3 py-1'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill font-semibold uppercase tracking-wide ${toneClass[tone]} ${sizeClass} ${className}`}
      {...rest}
    >
      {children}
    </span>
  )
}
