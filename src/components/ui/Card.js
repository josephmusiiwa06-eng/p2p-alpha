import clsx from 'clsx'

export function Card({ children, className, interactive = false, ...props }) {
  return (
    <div 
      className={clsx(
        'card', 
        interactive && 'card-interactive cursor-pointer',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={clsx('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }) {
  return <h3 className={clsx('text-lg font-semibold m-0', className)}>{children}</h3>
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>
}
