import clsx from 'clsx'

export function Badge({ children, variant = 'primary', className }) {
  return (
    <span className={clsx('badge', `badge-${variant}`, className)}>
      {children}
    </span>
  )
}
