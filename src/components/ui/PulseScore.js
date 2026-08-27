import clsx from 'clsx'

export function PulseScore({ score, label, trend, className }) {
  // Determine color based on score (0-100)
  let statusColor = 'var(--color-status-success)'
  if (score < 60) statusColor = 'var(--color-status-danger)'
  else if (score < 80) statusColor = 'var(--color-status-warning)'

  return (
    <div className={clsx('flex flex-col items-center justify-center text-center', className)}>
      <div 
        className="font-bold mb-2"
        style={{ 
          fontSize: 'var(--font-size-4xl)', 
          color: statusColor,
          lineHeight: 1
        }}
      >
        {score}
      </div>
      {label && <div className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>}
      {trend && (
        <div className="text-xs mt-1" style={{ color: trend > 0 ? 'var(--color-status-success)' : 'var(--color-status-danger)' }}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
        </div>
      )}
    </div>
  )
}
