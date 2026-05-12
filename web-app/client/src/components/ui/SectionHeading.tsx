import { ReactNode } from 'react'

interface SectionHeadingProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  level?: 'h1' | 'h2' | 'h3'
  className?: string
}

const levelClass: Record<'h1' | 'h2' | 'h3', string> = {
  h1: 'text-h1 text-slate-900',
  h2: 'text-h2 text-slate-900',
  h3: 'text-h3 text-slate-900',
}

export function SectionHeading({
  title,
  description,
  action,
  level = 'h2',
  className = '',
}: SectionHeadingProps) {
  const Heading = level
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0 flex-1">
        <Heading className={`${levelClass[level]} m-0`}>{title}</Heading>
        {description && <p className="text-body-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
