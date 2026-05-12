import { HTMLAttributes, ReactNode } from 'react'
import { Info, AlertTriangle, AlertOctagon, CheckCircle2, LucideIcon } from 'lucide-react'

type CalloutTone = 'info' | 'warning' | 'error' | 'success'

interface CalloutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: CalloutTone
  title?: ReactNode
  icon?: LucideIcon | false
  children?: ReactNode
}

// Mirrors `preview/12_callouts.html`: 4px solid left rail + tinted bg
const toneStyles: Record<CalloutTone, { bar: string; bg: string; text: string; icon: LucideIcon }> = {
  info:    { bar: 'border-l-sky-500',    bg: 'bg-sky-50',    text: 'text-sky-900',    icon: Info },
  warning: { bar: 'border-l-amber-500',  bg: 'bg-amber-50',  text: 'text-amber-900',  icon: AlertTriangle },
  error:   { bar: 'border-l-red-500',    bg: 'bg-red-50',    text: 'text-red-900',    icon: AlertOctagon },
  success: { bar: 'border-l-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-900', icon: CheckCircle2 },
}

export function Callout({
  tone = 'info',
  title,
  icon,
  className = '',
  children,
  ...rest
}: CalloutProps) {
  const { bar, bg, text, icon: DefaultIcon } = toneStyles[tone]
  const Icon = icon === false ? null : icon || DefaultIcon
  return (
    <div
      role="note"
      className={`flex gap-3 border border-slate-200 border-l-4 ${bar} ${bg} ${text} rounded-md p-3 text-body-sm ${className}`}
      {...rest}
    >
      {Icon && <Icon size={18} className="flex-shrink-0 mt-0.5 opacity-90" aria-hidden />}
      <div className="flex-1 min-w-0">
        {title && <div className="font-semibold mb-0.5">{title}</div>}
        {children}
      </div>
    </div>
  )
}
