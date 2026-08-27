'use client'

const PALETTE = {
  orange: { bg: '#FFF3E8', border: '#FF6B00', shadow: '5px 5px 0 rgba(255,107,0,0.22)' },
  green:  { bg: '#E8FFF2', border: '#00C853', shadow: '5px 5px 0 rgba(0,200,83,0.22)'  },
  blue:   { bg: '#E6F5FF', border: '#00A8E8', shadow: '5px 5px 0 rgba(0,168,232,0.22)' },
  purple: { bg: '#F3EEFF', border: '#9B59B6', shadow: '5px 5px 0 rgba(155,89,182,0.22)'},
  pink:   { bg: '#FFE8F2', border: '#FF4081', shadow: '5px 5px 0 rgba(255,64,129,0.22)' },
  yellow: { bg: '#FFFBE6', border: '#FFD600', shadow: '5px 5px 0 rgba(255,214,0,0.22)' },
}

const readinessChecklist = [
  { item: 'Term 1 Heritage Curriculum Plans', status: 'done', colour: 'green' },
  { item: 'Kinder Kinetics Equipment Audit', status: 'done', colour: 'green' },
  { item: 'ECD A & B Teacher Profiles Active', status: 'done', colour: 'green' },
  { item: 'First Week Lesson Logs Submitted', status: 'pending', colour: 'orange' },
  { item: 'Baseline Movement Assessments', status: 'pending', colour: 'orange' },
  { item: 'Parent Engagement Newsletters', status: 'missing', colour: 'pink' },
]

export default function ReportsPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '2.2rem', color: '#1A1A2E', margin: 0 }}>
            📊 Magic Reports & Readiness
          </h1>
          <p style={{ color: '#9090A8', fontWeight: 700, margin: '4px 0 0' }}>School pulse, MoPSE readiness, and AI advisor insights</p>
        </div>
        <button style={{
          padding: '12px 24px', background: '#9B59B6', color: '#FFF',
          border: '3px solid #7D3C98', borderRadius: '999px',
          fontFamily: "'Fredoka One', sans-serif", fontSize: '1rem',
          cursor: 'pointer', boxShadow: '4px 4px 0 rgba(155,89,182,0.25)',
          transition: 'transform 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          📥 Download PDF Report
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* MoPSE Checklist */}
        <div style={{ background: '#FFFBE6', border: '3px solid #FFD600', borderRadius: '1.75rem', padding: '24px', boxShadow: '5px 5px 0 rgba(255,214,0,0.22)' }}>
          <h2 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.4rem', color: '#1A1A2E', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>📋</span> Term Readiness Checklist
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {readinessChecklist.map((c, i) => {
              const p = PALETTE[c.colour]
              const icon = c.status === 'done' ? '✅' : c.status === 'pending' ? '⏳' : '❌'
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: p.bg, border: `2px solid ${p.border}`, borderRadius: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                    <span style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem', color: '#1A1A2E' }}>{c.item}</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: p.border, textTransform: 'uppercase', padding: '4px 10px', background: 'rgba(255,255,255,0.7)', borderRadius: '999px', border: `2px solid ${p.border}` }}>
                    {c.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* AI Advisor Deep Dive */}
        <div style={{ background: '#F3EEFF', border: '3px solid #9B59B6', borderRadius: '1.75rem', padding: '24px', boxShadow: '5px 5px 0 rgba(155,89,182,0.22)' }}>
          <h2 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.4rem', color: '#1A1A2E', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🦉</span> AI Advisor Deep Dive
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.8)', border: '2.5px solid #00A8E8', borderRadius: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.05rem', color: '#00A8E8', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏃 Movement Discrepancy
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#4A4A6A', fontWeight: 600, lineHeight: 1.5 }}>
                ECD A classes are logging 25% fewer jumping sessions than ECD B. 
                Consider sharing Mrs. Ndlovu's "Tyre Hop" lesson plan across the campus to boost engagement.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.8)', border: '2.5px solid #00C853', borderRadius: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.05rem', color: '#00C853', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌟 Curriculum Win
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#4A4A6A', fontWeight: 600, lineHeight: 1.5 }}>
                Excellent coverage of "Family & Heritage" outcomes! 100% of teachers have successfully integrated local languages into their storytelling sessions.
              </p>
            </div>

            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.8)', border: '2.5px solid #FF6B00', borderRadius: '1.25rem' }}>
              <h3 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.05rem', color: '#FF6B00', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠️ Logbook Flag
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#4A4A6A', fontWeight: 600, lineHeight: 1.5 }}>
                Two teachers have flagged "Lack of thick crayons" in their daily reflections. This is impacting fine motor skill assessments. 
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
