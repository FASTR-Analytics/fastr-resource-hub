import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid = false, className = '', ...rest },
  ref,
) {
  const invalidClass = invalid
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : ''
  return (
    <input
      ref={ref}
      className={`input-base w-full ${invalidClass} ${className}`}
      {...rest}
    />
  )
})
