export function ProgressRing({ radius = 40, stroke = 8, progress = 0, color = 'var(--color-primary)' }) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: radius * 2, height: radius * 2 }}>
      <svg
        height={radius * 2}
        width={radius * 2}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          stroke="var(--color-bg-base)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, left: 0, right: 0, bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-primary)'
        }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
}
