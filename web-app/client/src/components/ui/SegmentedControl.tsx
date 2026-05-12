import { ReactNode } from 'react'

interface SegmentedOption<V extends string> {
  value: V
  label: ReactNode
}

interface SegmentedControlProps<V extends string> {
  value: V
  onChange: (value: V) => void
  options: SegmentedOption<V>[]
  size?: 'sm' | 'md'
  className?: string
  ariaLabel?: string
}

export function SegmentedControl<V extends string>({
  value,
  onChange,
  options,
  size = 'md',
  className = '',
  ariaLabel,
}: SegmentedControlProps<V>) {
  const sizeClass = size === 'sm' ? 'text-caption py-1 px-2' : 'text-body-sm py-1.5 px-3'
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-stretch border border-slate-200 bg-white rounded-lg p-0.5 ${className}`}
    >
      {options.map(opt => {
        const isActive = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={`flex-1 rounded-md font-semibold transition-colors ${sizeClass} ${
              isActive
                ? 'bg-fastr-primary text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
