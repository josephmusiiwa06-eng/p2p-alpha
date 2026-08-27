export function Greeting({ user }) {
  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  let emoji = '🌙'
  let greeting = 'Good evening'
  if (hour < 12) { emoji = '☀️'; greeting = 'Good morning' }
  else if (hour < 18) { emoji = '🌈'; greeting = 'Good afternoon' }

  return (
    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
      {/* Big emoji splat */}
      <div style={{
        width: '64px', height: '64px',
        background: 'linear-gradient(135deg, #FF6B00, #FF9A40)',
        borderRadius: '50%',
        border: '3px solid #E55A00',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.8rem',
        flexShrink: 0,
        animation: 'float-up-down 4s ease-in-out infinite',
      }}>{emoji}</div>
      <div>
        <h1 style={{
          fontFamily: "'Fredoka One', sans-serif",
          fontSize: '2.2rem',
          color: '#1A1A2E',
          margin: 0,
          lineHeight: 1.1,
        }}>
          {greeting}, <span style={{ color: '#FF6B00' }}>{name}</span>!
        </h1>
        <p style={{ color: '#9090A8', margin: 0, fontSize: '1rem', fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
          Here's what's buzzing in your school today 🎉
        </p>
      </div>
    </div>
  )
}
