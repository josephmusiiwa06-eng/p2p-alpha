import clsx from 'clsx'

export function StatusIndicator({ status, pulse = false, className }) {
  // status: 'success', 'warning', 'danger', 'info'
  const style = { backgroundColor: `var(--color-status-${status})` }

  return (
    <div className={clsx('relative flex items-center justify-center', className)} style={{ width: '12px', height: '12px' }}>
      {pulse && (
        <div 
          className="absolute w-full h-full rounded-full opacity-50"
          style={{ ...style, animation: 'pulse-ring 2s infinite' }}
        />
      )}
      <div 
        className="w-full h-full rounded-full z-10" 
        style={style} 
      />
    </div>
  )
}
