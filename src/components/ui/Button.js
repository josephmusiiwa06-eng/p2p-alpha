import clsx from 'clsx'
import { forwardRef } from 'react'

export const Button = forwardRef(({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={clsx(
        'btn',
        `btn-${variant}`,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = 'Button'
