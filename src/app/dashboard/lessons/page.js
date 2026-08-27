'use client'

const PALETTE = {
  orange: { bg: '#FFF3E8', border: '#FF6B00', shadow: '5px 5px 0 rgba(255,107,0,0.22)' },
  green:  { bg: '#E8FFF2', border: '#00C853', shadow: '5px 5px 0 rgba(0,200,83,0.22)'  },
  blue:   { bg: '#E6F5FF', border: '#00A8E8', shadow: '5px 5px 0 rgba(0,168,232,0.22)' },
  purple: { bg: '#F3EEFF', border: '#9B59B6', shadow: '5px 5px 0 rgba(155,89,182,0.22)'},
  pink:   { bg: '#FFE8F2', border: '#FF4081', shadow: '5px 5px 0 rgba(255,64,129,0.22)' },
  yellow: { bg: '#FFFBE6', border: '#FFD600', shadow: '5px 5px 0 rgba(255,214,0,0.22)' },
}

const lessons = [
  {
    title: 'Hop, Skip & Jump Adventure',
    area: 'Physical Development',
    theme: 'Wild Animals',
    duration: '30 mins',
    status: 'ready',
    colour: 'orange',
    emoji: '🦁',
    activities: ['Animal walks warmup', 'Chalk circle hopping', 'Freeze tag cool-down'],
    resources: ['Chalk', 'Open space', 'Whistle']
  },
  {
    title: 'Sorting Local Foods',
    area: 'Mathematical Concepts',
    theme: 'My Community',
    duration: '20 mins',
    status: 'draft',
    colour: 'blue',
    emoji: '🍎',
    activities: ['Identify foods', 'Group by colour', 'Group by shape'],
    resources: ['Maize', 'Beans', 'Pumpkins', 'Baskets']
  },
  {
    title: 'Painting the Sky',
    area: 'Visual & Performing Arts',
    theme: 'Zimbabwe Weather',
    duration: '40 mins',
    status: 'delivered',
    colour: 'pink',
    emoji: '🌤️',
    activities: ['Sing rain song', 'Finger paint clouds', 'Wash hands game'],
    resources: ['Water paints', 'Paper', 'Aprons']
  }
]

export default function LessonsPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '2.2rem', color: '#1A1A2E', margin: 0 }}>
            📝 Magic Lesson Plans
          </h1>
          <p style={{ color: '#9090A8', fontWeight: 700, margin: '4px 0 0' }}>Plan, prepare, and deliver engaging activities</p>
        </div>
        <button style={{
          padding: '12px 24px', background: '#00C853', color: '#FFF',
          border: '3px solid #00A843', borderRadius: '999px',
          fontFamily: "'Fredoka One', sans-serif", fontSize: '1rem',
          cursor: 'pointer', boxShadow: '4px 4px 0 rgba(0,200,83,0.25)',
          transition: 'transform 0.2s',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <span style={{ fontSize: '1.2rem' }}>✨</span> AI Lesson Generator
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
        {lessons.map((lesson, i) => {
          const p = PALETTE[lesson.colour]
          const isDraft = lesson.status === 'draft'
          const isDelivered = lesson.status === 'delivered'
          
          let statusBg = '#00C853'
          let statusText = 'Ready to Teach!'
          let statusIcon = '✅'
          if (isDraft) { statusBg = '#FFD600'; statusText = 'Drafting...'; statusIcon = '✏️' }
          if (isDelivered) { statusBg = '#9B59B6'; statusText = 'Delivered & Logged'; statusIcon = '📚' }

          return (
            <div key={i} style={{
              background: p.bg, border: `3px solid ${p.border}`, borderRadius: '1.75rem',
              padding: '20px', boxShadow: p.shadow, transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
              position: 'relative', overflow: 'hidden'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              
              {/* Splat */}
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: `${p.border}18`, borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '2.4rem' }}>{lesson.emoji}</span>
                <span style={{
                  background: isDraft ? '#FFFBE6' : (isDelivered ? '#F3EEFF' : '#E8FFF2'),
                  color: isDraft ? '#E6BE00' : (isDelivered ? '#9B59B6' : '#00A843'),
                  border: `2px solid ${isDraft ? '#FFD600' : (isDelivered ? '#9B59B6' : '#00C853')}`,
                  padding: '4px 12px', borderRadius: '999px',
                  fontFamily: "'Fredoka One', sans-serif", fontSize: '0.75rem',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  {statusIcon} {statusText}
                </span>
              </div>

              <h2 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.2rem', color: '#1A1A2E', margin: '0 0 6px' }}>
                {lesson.title}
              </h2>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFF', background: p.border, padding: '2px 8px', borderRadius: '999px' }}>{lesson.area}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4A4A6A', background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: '999px' }}>{lesson.duration}</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.5)', border: `2px solid rgba(0,0,0,0.06)`, padding: '12px', borderRadius: '1rem', marginBottom: '16px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '0.8rem', fontFamily: "'Fredoka One', sans-serif", color: '#4A4A6A' }}>Activities</p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#4A4A6A', fontSize: '0.85rem', fontWeight: 600 }}>
                  {lesson.activities.map((act, j) => <li key={j} style={{ marginBottom: '4px' }}>{act}</li>)}
                </ul>
              </div>

              <button style={{
                width: '100%', padding: '10px', background: isDraft ? p.border : 'transparent',
                color: isDraft ? '#FFF' : p.border, border: `2.5px solid ${p.border}`,
                borderRadius: '999px', fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem',
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: isDraft ? `3px 3px 0 rgba(0,0,0,0.1)` : 'none'
              }}>
                {isDraft ? 'Continue Editing ✏️' : (isDelivered ? 'View Logbook 📖' : 'Start Lesson ▶️')}
              </button>

            </div>
          )
        })}
      </div>
    </div>
  )
}
