import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  children?: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-caption',
  md: 'px-3 py-1.5 text-body-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled,
    className = '',
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isIconOnly = !children && Icon
  const iconSize = size === 'sm' ? 14 : 16
  const sizeOverride = isIconOnly ? (size === 'sm' ? 'p-1.5' : 'p-2') : sizeClass[size]

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${variantClass[variant]} ${sizeOverride} ${className}`}
      {...rest}
    >
      {Icon && iconPosition === 'left' && <Icon size={iconSize} aria-hidden />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={iconSize} aria-hidden />}
    </button>
  )
})
