'use client'

const PALETTE = {
  orange: { bg: '#FFF3E8', border: '#FF6B00', shadow: '5px 5px 0 rgba(255,107,0,0.22)' },
  green:  { bg: '#E8FFF2', border: '#00C853', shadow: '5px 5px 0 rgba(0,200,83,0.22)'  },
  blue:   { bg: '#E6F5FF', border: '#00A8E8', shadow: '5px 5px 0 rgba(0,168,232,0.22)' },
  purple: { bg: '#F3EEFF', border: '#9B59B6', shadow: '5px 5px 0 rgba(155,89,182,0.22)'},
  pink:   { bg: '#FFE8F2', border: '#FF4081', shadow: '5px 5px 0 rgba(255,64,129,0.22)' },
  yellow: { bg: '#FFFBE6', border: '#FFD600', shadow: '5px 5px 0 rgba(255,214,0,0.22)' },
}

function ProgressBar({ pct, colour }) {
  const p = PALETTE[colour]
  return (
    <div style={{ background: 'rgba(0,0,0,0.07)', borderRadius: '999px', height: '14px', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.06)' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: p.border, borderRadius: '999px', transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)', position: 'relative' }}>
        <div style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', fontSize: '8px', color: '#FFF', fontWeight: 900 }}>
          {pct >= 25 ? `${pct}%` : ''}
        </div>
      </div>
    </div>
  )
}

const skills = [
  { emoji: '🏃', name: 'Running',      sessions: 5, target: 5, colour: 'orange', classes: ['ECD A Green Frogs', 'ECD B Gold Stars'], activities: ['Animal Walks', 'Traffic Light Tag', 'Shadow Chase', 'Relay Races', 'Obstacle Weave'] },
  { emoji: '🦘', name: 'Jumping',      sessions: 3, target: 5, colour: 'blue',   classes: ['ECD B Gold Stars'],                       activities: ['Tyre Hop Course', 'Chalk Island Jumps', 'Frog Pond Game'] },
  { emoji: '⚖️', name: 'Balance',      sessions: 4, target: 4, colour: 'green',  classes: ['ECD A Playful Pandas', 'ECD A Green Frogs'], activities: ['Chalk Tightrope Walk', 'Beanbag Head Balance', 'Statue Freeze', 'One-Leg Flamingo'] },
  { emoji: '🏀', name: 'Catching',     sessions: 2, target: 5, colour: 'pink',   classes: ['ECD A Playful Pandas'],                   activities: ['Partner Roll & Receive', 'Scarf Float Catch'] },
  { emoji: '🎯', name: 'Throwing',     sessions: 4, target: 4, colour: 'purple', classes: ['ECD B Gold Stars'],                       activities: ['Bucket Toss', 'Underarm Bowling', 'Target Throw', 'Distance Challenge'] },
  { emoji: '🎵', name: 'Rhythm',       sessions: 5, target: 5, colour: 'yellow', classes: ['ECD A Green Frogs', 'ECD B Gold Stars'], activities: ['Drum Circle Clapping', 'Musical Statues', 'African Dance Follow-the-Leader', 'Rhythm Marching', 'Shake & Stop'] },
  { emoji: '🤝', name: 'Coordination', sessions: 3, target: 5, colour: 'orange', classes: ['ECD B Gold Stars'],                       activities: ['Cross-Body Marching', 'Partner Mirror Game', 'Egg-and-Spoon Relay'] },
  { emoji: '✏️', name: 'Fine Motor',   sessions: 5, target: 5, colour: 'green',  classes: ['ECD A Green Frogs', 'ECD A Playful Pandas'], activities: ['Playdough Squeeze', 'Sand Letter Tracing', 'Threading Beads', 'Paper Tearing & Pasting', 'Clothes Peg Pick-Up'] },
]

export default function MovementPage() {
  const totalSessions = skills.reduce((s, k) => s + k.sessions, 0)
  const maxSessions   = skills.reduce((s, k) => s + k.target, 0)
  const overallPct    = Math.round((totalSessions / maxSessions) * 100)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '2.2rem', color: '#1A1A2E', margin: 0 }}>
            🤸 Kinder Kinetics Playground
          </h1>
          <p style={{ color: '#9090A8', fontWeight: 700, margin: '4px 0 0' }}>Track active physical movement sessions this week</p>
        </div>
        <button style={{
          padding: '12px 24px', background: '#FF6B00', color: '#FFF',
          border: '3px solid #E55A00', borderRadius: '999px',
          fontFamily: "'Fredoka One', sans-serif", fontSize: '1rem',
          cursor: 'pointer', boxShadow: '4px 4px 0 rgba(255,107,0,0.25)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          + Log New Session 🎯
        </button>
      </div>

      {/* Overall stat */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { emoji: '⚡', label: 'Overall Progress', value: `${overallPct}%`, colour: 'orange' },
          { emoji: '📅', label: 'Sessions This Week', value: `${totalSessions}/${maxSessions}`, colour: 'green' },
          { emoji: '🏅', label: 'On-Target Categories', value: `${skills.filter(k => k.sessions >= k.target).length}/${skills.length}`, colour: 'blue' },
          { emoji: '🌟', label: 'Star Category', value: 'Rhythm 🎵', colour: 'yellow' },
        ].map(s => {
          const p = PALETTE[s.colour]
          return (
            <div key={s.label} style={{ background: p.bg, border: `3px solid ${p.border}`, borderRadius: '1.25rem', padding: '16px 18px', boxShadow: p.shadow }}>
              <p style={{ margin: 0, fontSize: '1.6rem' }}>{s.emoji}</p>
              <p style={{ margin: '4px 0 2px', fontFamily: "'Fredoka One', sans-serif", fontSize: '1.4rem', color: p.border }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#9090A8' }}>{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Skill categories grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '18px' }}>
        {skills.map(k => {
          const p = PALETTE[k.colour]
          const pct = Math.round((k.sessions / k.target) * 100)
          const onTarget = k.sessions >= k.target
          return (
            <div key={k.name} style={{
              background: p.bg, border: `3px solid ${p.border}`,
              borderRadius: '1.75rem', padding: '20px',
              boxShadow: p.shadow, transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-7px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              {/* Title row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{k.emoji}</span>
                  <p style={{ margin: 0, fontFamily: "'Fredoka One', sans-serif", fontSize: '1.1rem', color: '#1A1A2E' }}>{k.name}</p>
                </div>
                <span style={{
                  background: onTarget ? '#00C853' : p.border, color: '#FFF',
                  padding: '4px 12px', borderRadius: '999px',
                  fontFamily: "'Fredoka One', sans-serif", fontSize: '0.78rem',
                }}>{k.sessions}/{k.target} {onTarget ? '✅' : '🔶'}</span>
              </div>

              {/* Progress bar */}
              <ProgressBar pct={pct} colour={k.colour} />

              {/* Classes */}
              <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {k.classes.map(cls => (
                  <span key={cls} style={{ background: 'rgba(255,255,255,0.7)', border: `2px solid ${p.border}`, padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, color: p.border }}>
                    {cls}
                  </span>
                ))}
              </div>

              {/* Activities */}
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {k.activities.map(act => (
                  <div key={act} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'rgba(255,255,255,0.5)', borderRadius: '0.75rem', border: '1.5px solid rgba(0,0,0,0.06)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: p.border, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#4A4A6A' }}>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
