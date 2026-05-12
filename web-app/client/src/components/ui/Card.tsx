import { HTMLAttributes, forwardRef } from 'react'

type CardVariant = 'default' | 'flat' | 'inspector'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

const variantClass: Record<CardVariant, string> = {
  // Canonical: white, 16px radius, slate-200 border, ring-1 black/5, shadow-sm
  default: 'card-elevated',
  // No shadow/ring — just border. Useful for nested cards.
  flat: 'bg-white rounded-2xl border border-slate-200',
  // Right-rail inspector / panel — flat top, slim border
  inspector: 'bg-white border border-slate-200 rounded-xl',
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', className = '', children, ...rest },
  ref,
) {
  return (
    <div ref={ref} className={`${variantClass[variant]} ${className}`} {...rest}>
      {children}
    </div>
  )
})
