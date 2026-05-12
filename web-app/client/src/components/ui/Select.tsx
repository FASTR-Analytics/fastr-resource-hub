import { SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid = false, className = '', children, ...rest },
  ref,
) {
  const invalidClass = invalid
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : ''
  return (
    <div className="relative">
      <select
        ref={ref}
        className={`input-base w-full appearance-none pr-8 ${invalidClass} ${className}`}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
        aria-hidden
      />
    </div>
  )
})
