'use client'

const PALETTE = {
  orange: { bg: '#FFF3E8', border: '#FF6B00', shadow: '5px 5px 0 rgba(255,107,0,0.22)' },
  green:  { bg: '#E8FFF2', border: '#00C853', shadow: '5px 5px 0 rgba(0,200,83,0.22)'  },
  blue:   { bg: '#E6F5FF', border: '#00A8E8', shadow: '5px 5px 0 rgba(0,168,232,0.22)' },
  purple: { bg: '#F3EEFF', border: '#9B59B6', shadow: '5px 5px 0 rgba(155,89,182,0.22)'},
  pink:   { bg: '#FFE8F2', border: '#FF4081', shadow: '5px 5px 0 rgba(255,64,129,0.22)' },
  yellow: { bg: '#FFFBE6', border: '#FFD600', shadow: '5px 5px 0 rgba(255,214,0,0.22)' },
}

function RingMeter({ pct, colour }) {
  const p = PALETTE[colour]
  const r = 34, sw = 7, c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <svg width={80} height={80} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={40} cy={40} r={r} stroke="rgba(0,0,0,0.08)" strokeWidth={sw} fill="none" />
      <circle cx={40} cy={40} r={r} stroke={p.border} strokeWidth={sw} fill="none"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }} />
      <text x={40} y={44} textAnchor="middle" style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: '15px', fill: p.border, transform: 'rotate(90deg)', transformOrigin: '40px 40px' }}>
        {pct}%
      </text>
    </svg>
  )
}

function ProgressBar({ pct, colour }) {
  const p = PALETTE[colour]
  return (
    <div style={{ background: 'rgba(0,0,0,0.07)', borderRadius: '999px', height: '12px', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.06)' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: p.border, borderRadius: '999px', transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)' }} />
    </div>
  )
}

const areas = [
  { emoji: '🏃', name: 'Physical Development',      pct: 88, colour: 'orange', desc: 'Gross & fine motor games, animal walks, balance logs' },
  { emoji: '📖', name: 'Language & Literacy',        pct: 70, colour: 'blue',   desc: 'Rhymes, storytelling, alphabet songs & sound games' },
  { emoji: '🔢', name: 'Mathematical Concepts',      pct: 65, colour: 'purple', desc: 'Shapes, counting, ordering and pattern making' },
  { emoji: '🎨', name: 'Visual & Performing Arts',   pct: 92, colour: 'pink',   desc: 'Singing, painting, puppet shows & collage art' },
  { emoji: '👨‍👩‍👧', name: 'Family & Heritage Studies', pct: 78, colour: 'green',  desc: 'Zim culture, family roles, national symbols' },
  { emoji: '🔬', name: 'Science & Technology',       pct: 60, colour: 'yellow', desc: 'Weather, plants, animals & simple experiments' },
]

const themes = [
  { emoji: '🦁', name: 'Wild Animals', term: 1, weeks: 'Weeks 1–4', colour: 'orange', desc: 'Jungle walks, naming local birds, predator speed races.' },
  { emoji: '🌿', name: 'My Garden & Plants', term: 1, weeks: 'Weeks 5–8', colour: 'green', desc: 'Seeds, soil textures, watering cans & leaf art.' },
  { emoji: '🌤️', name: 'Zimbabwe Weather', term: 1, weeks: 'Weeks 9–12', colour: 'blue', desc: 'Rain sound rhythms, sunshine poses, choosing clothing.' },
  { emoji: '👨‍👩‍👧', name: 'My Family', term: 2, weeks: 'Weeks 1–4', colour: 'purple', desc: 'Family roles, extended family trees & heritage stories.' },
]

export default function CurriculumPage() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '2.2rem', color: '#1A1A2E', margin: 0 }}>
          📚 Storybook Curriculum
        </h1>
        <p style={{ color: '#9090A8', fontWeight: 700, margin: '4px 0 0' }}>Heritage-Based Curriculum — Term 1 Progress</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Learning Areas */}
        <div style={{ background: '#FFF9F5', border: '3px solid #FF6B00', borderRadius: '1.75rem', padding: '24px', boxShadow: '5px 5px 0 rgba(255,107,0,0.22)' }}>
          <h2 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.4rem', color: '#1A1A2E', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🏆 Learning Area Progress
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {areas.map(a => {
              const p = PALETTE[a.colour]
              return (
                <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 14px', background: p.bg, border: `2.5px solid ${p.border}`, borderRadius: '1.25rem', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(6px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                  <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{a.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <p style={{ margin: 0, fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem', color: '#1A1A2E' }}>{a.name}</p>
                      <span style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '0.9rem', color: p.border }}>{a.pct}%</span>
                    </div>
                    <ProgressBar pct={a.pct} colour={a.colour} />
                    <p style={{ margin: '4px 0 0', fontSize: '0.72rem', fontWeight: 700, color: '#9090A8' }}>{a.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active Themes */}
        <div style={{ background: '#F3EEFF', border: '3px solid #9B59B6', borderRadius: '1.75rem', padding: '24px', boxShadow: '5px 5px 0 rgba(155,89,182,0.22)' }}>
          <h2 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.4rem', color: '#1A1A2E', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✨ Interactive Themes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {themes.map(t => {
              const p = PALETTE[t.colour]
              return (
                <div key={t.name} style={{ padding: '14px 16px', background: p.bg, border: `2.5px solid ${p.border}`, borderRadius: '1.25rem', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(6px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <p style={{ margin: 0, fontFamily: "'Fredoka One', sans-serif", fontSize: '1rem', color: '#1A1A2E' }}>{t.emoji} {t.name}</p>
                    <span style={{ background: p.border, color: '#FFF', padding: '3px 12px', borderRadius: '999px', fontFamily: "'Fredoka One', sans-serif", fontSize: '0.72rem' }}>{t.weeks}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#9090A8' }}>{t.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Overall summary chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}>
        {[
          { emoji: '📋', label: 'Active Themes', value: '4', colour: 'purple' },
          { emoji: '🎯', label: 'Outcomes Logged', value: '54 / 73', colour: 'orange' },
          { emoji: '📅', label: 'Current Term', value: 'Term 1', colour: 'blue' },
          { emoji: '🏆', label: 'Top Performer', value: 'Arts 🎨', colour: 'pink' },
        ].map(s => {
          const p = PALETTE[s.colour]
          return (
            <div key={s.label} style={{ background: p.bg, border: `3px solid ${p.border}`, borderRadius: '1.25rem', padding: '16px 18px', boxShadow: p.shadow }}>
              <p style={{ margin: 0, fontSize: '1.6rem' }}>{s.emoji}</p>
              <p style={{ margin: '6px 0 2px', fontFamily: "'Fredoka One', sans-serif", fontSize: '1.3rem', color: p.border }}>{s.value}</p>
              <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: '#9090A8' }}>{s.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
