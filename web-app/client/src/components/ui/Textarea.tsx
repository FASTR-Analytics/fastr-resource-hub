import { TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid = false, className = '', rows = 4, ...rest },
  ref,
) {
  const invalidClass = invalid
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : ''
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`input-base w-full resize-y leading-relaxed ${invalidClass} ${className}`}
      {...rest}
    />
  )
})
