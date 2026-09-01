'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ModalShell, inputStyle, submitButtonStyle } from '@/components/ui/Modal'

// Colour palettes for each card variant
const PALETTE = {
  orange: { bg: '#FFF3E8', border: '#FF6B00', bar: '#FF6B00', shadow: '5px 5px 0 rgba(255,107,0,0.25)', badge: { bg: '#FF6B00', text: '#FFF' } },
  green: { bg: '#E8FFF2', border: '#00C853', bar: '#00C853', shadow: '5px 5px 0 rgba(0,200,83,0.25)', badge: { bg: '#00C853', text: '#FFF' } },
  blue: { bg: '#E6F5FF', border: '#00A8E8', bar: '#00A8E8', shadow: '5px 5px 0 rgba(0,168,232,0.25)', badge: { bg: '#00A8E8', text: '#FFF' } },
  purple: { bg: '#F3EEFF', border: '#9B59B6', bar: '#9B59B6', shadow: '5px 5px 0 rgba(155,89,182,0.25)', badge: { bg: '#9B59B6', text: '#FFF' } },
  yellow: { bg: '#FFFBE6', border: '#FFD600', bar: '#FFD600', shadow: '5px 5px 0 rgba(255,214,0,0.25)', badge: { bg: '#FFD600', text: '#1A1A2E' } },
  pink: { bg: '#FFE8F2', border: '#FF4081', bar: '#FF4081', shadow: '5px 5px 0 rgba(255,64,129,0.25)', badge: { bg: '#FF4081', text: '#FFF' } },
}

function NickCard({ title, subtitle, emoji, colour = 'orange', value, valueLabel, badgeText, badgeOk, link, children, accent }) {
  const p = PALETTE[colour]
  return (
    <div style={{
      background: p.bg,
      borderRadius: '1.75rem',
      border: `3px solid ${p.border}`,
      boxShadow: p.shadow,
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s',
      cursor: link ? 'pointer' : 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = `7px 12px 0 rgba(0,0,0,0.12)` }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = p.shadow }}>
      {/* Decorative splat */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '80px', height: '80px',
        background: `${p.border}18`,
        borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>{emoji}</span>
          <div>
            <h3 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.05rem', color: '#1A1A2E', margin: 0 }}>{title}</h3>
            {subtitle && <p style={{ fontSize: '0.78rem', color: '#9090A8', margin: 0, fontWeight: 600 }}>{subtitle}</p>}
          </div>
        </div>
        {badgeText && (
          <span style={{
            background: badgeOk ? '#00C853' : p.bar,
            color: badgeOk ? '#FFF' : p.badge.text,
            padding: '4px 12px', borderRadius: '999px',
            fontFamily: "'Fredoka One', sans-serif", fontSize: '0.78rem',
            border: `2px solid rgba(0,0,0,0.1)`,
          }}>{badgeText}</span>
        )}
      </div>

      {value !== undefined && (
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '2.4rem', color: p.border }}>{value}</span>
          {valueLabel && <span style={{ fontSize: '0.85rem', color: '#9090A8', marginLeft: '6px', fontWeight: 700 }}>{valueLabel}</span>}
        </div>
      )}

      {children}
    </div>
  )
}

function ProgressBar({ value, colour = 'orange' }) {
  const p = PALETTE[colour]
  return (
    <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: '999px', height: '14px', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.06)', marginTop: '8px' }}>
      <div style={{
        height: '100%',
        width: `${value}%`,
        background: p.bar,
        borderRadius: '999px',
        transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  )
}

// ─── School Head Dashboard ───────────────────────────────────────────────────
export function HeadDashboard({ user }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Row 1 — Pulse + AI Briefing */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Pulse */}
        <NickCard emoji="⚡" title="School Pulse Score" subtitle="This week" colour="orange" badgeText="+5% 🚀" badgeOk>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '100px', height: '100px', borderRadius: '50%',
              border: '6px solid #FF6B00', background: '#FFF3E8',
              boxShadow: '4px 4px 0 rgba(255,107,0,0.2)',
              fontFamily: "'Fredoka One', sans-serif", fontSize: '2.8rem', color: '#FF6B00',
              margin: '0 auto',
            }}>92</div>
            <p style={{ marginTop: '10px', fontFamily: "'Fredoka One', sans-serif", fontSize: '0.9rem', color: '#9090A8', marginBottom: 0 }}>Campus Score</p>
          </div>
        </NickCard>

        {/* AI Briefing — spans 2 cols */}
        <div style={{ gridColumn: 'span 2' }}>
          <NickCard emoji="🧠" title="AI Morning Briefing" subtitle="Powered by Gemini ✨" colour="purple" badgeText="Today">
            <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#4A4A6A', marginBottom: '12px', lineHeight: 1.6 }}>
              ✨ <strong>Sparkle Alert!</strong> School energy is at <strong>92%</strong>!
              ECD&nbsp;B Blue is <span style={{ color: '#00C853' }}>crushing</span> Jumping milestones.
              Mrs. Ndlovu's little explorers are gearing up for the <em>Wild Animals</em> theme. 🦁
              Quick win: approve the improvised rope ladders for the outdoor track! 🤸‍♂️
            </p>
            <button style={{
              padding: '8px 20px', background: '#9B59B6', color: '#FFF', border: '2.5px solid #7D3C98',
              borderRadius: '999px', fontFamily: "'Fredoka One', sans-serif", fontSize: '0.9rem',
              cursor: 'pointer', boxShadow: '3px 3px 0 rgba(0,0,0,0.12)',
            }}>Ask the Advisor 💬</button>
          </NickCard>
        </div>
      </div>

      {/* Row 2 — 3 snapshot metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        <NickCard emoji="📚" title="Curriculum Coverage" subtitle="Term 2 outcomes" colour="blue" badgeText="74%" badgeOk={false}>
          <ProgressBar value={74} colour="blue" />
          <p style={{ fontSize: '0.8rem', color: '#9090A8', marginTop: '8px', marginBottom: 0, fontWeight: 700 }}>74 of 100 learning area goals met</p>
        </NickCard>

        <NickCard emoji="🤸" title="Kinder Kinetics" subtitle="Weekly movement sessions" colour="green" badgeText="88%" badgeOk>
          <ProgressBar value={88} colour="green" />
          <p style={{ fontSize: '0.8rem', color: '#9090A8', marginTop: '8px', marginBottom: 0, fontWeight: 700 }}>4 of 5 classes on track this week</p>
        </NickCard>

        <NickCard emoji="📒" title="Logbook Compliance" subtitle="Lesson records filed" colour="yellow" badgeText="95%" badgeOk>
          <ProgressBar value={95} colour="yellow" />
          <p style={{ fontSize: '0.8rem', color: '#9090A8', marginTop: '8px', marginBottom: 0, fontWeight: 700 }}>Only 1 logbook entry outstanding</p>
        </NickCard>
      </div>

      {/* Row 3 — Attention centre */}
      <NickCard emoji="🎈" title="Attention Centre" subtitle="Items needing your eyes" colour="orange">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          {[
            { icon: '🔥', title: 'ECD A Adventure Sandbox', desc: 'Term 2 "Wild Animals" materials are missing interactive textures.', severity: 'danger', link: '/dashboard/teachers', label: 'Needs Magic' },
            { icon: '🔶', title: 'ECD B Blue Tyres Course', desc: 'Only 2 of 5 movement tracks logged this week. Get those little legs moving!', severity: 'warning', link: '/dashboard/movement', label: 'Needs Review' },
            { icon: '✅', title: 'Little Stars Safety Check', desc: 'All physical safety checks on the improvised balancing logs ✔ done!', severity: 'success', link: '/dashboard/curriculum', label: 'Tiptop Space' },
          ].map((item, i) => (
            <Link href={item.link} key={i} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 16px', borderRadius: '1.25rem',
                background: item.severity === 'danger' ? '#FFE8F2' : item.severity === 'warning' ? '#FFFBE6' : '#E8FFF2',
                border: `2.5px solid ${item.severity === 'danger' ? '#FF4081' : item.severity === 'warning' ? '#FFD600' : '#00C853'}`,
                transition: 'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(6px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontFamily: "'Fredoka One', sans-serif", fontSize: '1rem', color: '#1A1A2E' }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#9090A8', fontWeight: 600 }}>{item.desc}</p>
                </div>
                <span style={{
                  background: item.severity === 'danger' ? '#FF4081' : item.severity === 'warning' ? '#FFD600' : '#00C853',
                  color: item.severity === 'warning' ? '#1A1A2E' : '#FFF',
                  padding: '4px 14px', borderRadius: '999px',
                  fontFamily: "'Fredoka One', sans-serif", fontSize: '0.78rem',
                  flexShrink: 0,
                }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </NickCard>

    </div>
  )
}

// ─── Teacher Dashboard ───────────────────────────────────────────────────────

function LessonGeneratorModal({ onClose }) {
  const [theme, setTheme] = useState('')
  const [learningArea, setLearningArea] = useState('')
  const [classLevel, setClassLevel] = useState('')
  const [duration, setDuration] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [plan, setPlan] = useState(null)

  async function handleGenerate(e) {
    e.preventDefault()
    setError('')
    setPlan(null)

    if (!theme.trim() || !learningArea.trim()) {
      setError('Please fill in Theme and Learning Area.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/ai/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, learningArea, classLevel, duration: Number(duration) || 30 }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong generating the lesson.')
      } else {
        setPlan(data)
      }
    } catch (err) {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell title="Plan a Playful Lesson" emoji="📝" onClose={onClose}>
      {!plan ? (
        <form onSubmit={handleGenerate}>
          <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#4A4A6A' }}>Theme</label>
          <input style={inputStyle()} value={theme} onChange={e => setTheme(e.target.value)} placeholder="e.g. Wild Animals" />

          <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#4A4A6A' }}>Learning Area</label>
          <input style={inputStyle()} value={learningArea} onChange={e => setLearningArea(e.target.value)} placeholder="e.g. Physical Development" />

          <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#4A4A6A' }}>Class Level (optional)</label>
          <input style={inputStyle()} value={classLevel} onChange={e => setClassLevel(e.target.value)} placeholder="e.g. ECD B" />

          <label style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#4A4A6A' }}>Duration (minutes)</label>
          <input style={inputStyle()} type="number" value={duration} onChange={e => setDuration(e.target.value)} />

          {error && <p style={{ color: '#E0306A', fontWeight: 700, fontSize: '0.85rem' }}>{error}</p>}

          <button type="submit" disabled={loading} style={submitButtonStyle(loading)}>
            {loading ? 'Generating...' : '✨ Generate Lesson'}
          </button>
        </form>
      ) : (
        <div>
          <h3 style={{ fontFamily: "'Fredoka One', sans-serif", color: '#1A1A2E' }}>{plan.title}</h3>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: '#4A4A6A', fontWeight: 700 }}>{plan.objectives}</p>

          <h4 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem', color: '#1A1A2E', marginTop: '16px' }}>Activities</h4>
          {(plan.activities || []).map((a, i) => (
            <div key={i} style={{ marginBottom: '8px', padding: '10px 14px', background: '#FFF3E8', borderRadius: '0.9rem' }}>
              <strong style={{ fontFamily: "'Nunito', sans-serif" }}>{a.name}</strong> ({a.duration} min)
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#4A4A6A' }}>{a.description}</p>
            </div>
          ))}

          <h4 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem', color: '#1A1A2E', marginTop: '16px' }}>Resources</h4>
          <ul style={{ fontFamily: "'Nunito', sans-serif", color: '#4A4A6A', fontSize: '0.85rem' }}>
            {(plan.resources || []).map((r, i) => <li key={i}>{r}</li>)}
          </ul>

          <h4 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem', color: '#1A1A2E', marginTop: '16px' }}>Assessment Notes</h4>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: '#4A4A6A', fontSize: '0.85rem' }}>{plan.assessment_notes}</p>

          <button onClick={() => setPlan(null)} style={{ ...submitButtonStyle(false), marginTop: '12px' }}>
            ↻ Generate Another
          </button>
        </div>
      )}
    </ModalShell>
  )
}

function CoachModal({ onClose, initialPrompt = '' }) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [response, setResponse] = useState('')

  async function handleAsk(e) {
    e.preventDefault()
    setError('')
    if (!prompt.trim()) {
      setError('Please type a question first.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setResponse(data.response)
      }
    } catch (err) {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalShell title="Pixie-Dust Teaching Coach" emoji="🪄" onClose={onClose}>
      <form onSubmit={handleAsk}>
        <textarea
          style={{ ...inputStyle(), minHeight: '90px', resize: 'vertical' }}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Ask about a classroom challenge, activity idea, or lesson tweak..."
        />
        {error && <p style={{ color: '#E0306A', fontWeight: 700, fontSize: '0.85rem' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ ...submitButtonStyle(loading), background: loading ? '#C0C0D0' : '#FF4081', borderColor: loading ? '#B0B0C0' : '#E0306A' }}>
          {loading ? 'Thinking...' : '💬 Ask'}
        </button>
      </form>
      {response && (
        <div style={{ marginTop: '16px', padding: '14px', background: '#FFE8F2', borderRadius: '0.9rem' }}>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: '#4A4A6A', whiteSpace: 'pre-wrap', margin: 0 }}>{response}</p>
        </div>
      )}
    </ModalShell>
  )
}

export function TeacherDashboard({ user }) {
  const [activeModal, setActiveModal] = useState(null) // null | 'lesson' | 'coach' | 'ideas'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Row 1 — AI Coach + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <NickCard emoji="🪄" title="Pixie-Dust Teaching Coach" subtitle="AI Powered · Gemini ✨" colour="pink" badgeText="Live Advice">
          <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: '#4A4A6A', lineHeight: 1.7, marginBottom: '14px' }}>
            🎉 <strong>Bibbidi-Bobbidi-Boo!</strong> You've logged <strong>4 of 5</strong> Kinder Kinetics sessions this week — amazing work!
            For today's <em>Hop, Skip &amp; Jump Adventure</em>, swap plastic cones for colourful chalk circles on the concrete track.
            Low-resource, high-magic! 🤸‍♀️
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setActiveModal('coach')} style={{
              padding: '10px 20px', background: '#FF4081', color: '#FFF',
              border: '2.5px solid #E0306A', borderRadius: '999px',
              fontFamily: "'Fredoka One', sans-serif", fontSize: '0.9rem',
              cursor: 'pointer', boxShadow: '3px 3px 0 rgba(0,0,0,0.12)',
            }}>Ask a Question 💬</button>
            <button onClick={() => setActiveModal('ideas')} style={{
              padding: '10px 20px', background: 'transparent', color: '#FF4081',
              border: '2.5px solid #FF4081', borderRadius: '999px',
              fontFamily: "'Fredoka One', sans-serif", fontSize: '0.9rem',
              cursor: 'pointer',
            }}>Generate Ideas 💡</button>
          </div>
        </NickCard>

        <NickCard emoji="🎒" title="Magic Chest" subtitle="Quick actions" colour="orange">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            {[
              { emoji: '📝', label: 'Plan a Playful Lesson', bg: '#FF6B00', border: '#E55A00', action: () => setActiveModal('lesson') },
              { emoji: '🤸', label: 'Log Kinder Kinetics', bg: '#00C853', border: '#00A843', href: '/dashboard/movement' },
              { emoji: '📒', label: 'Open Logbook', bg: '#00A8E8', border: '#0090CC', href: '/dashboard/logbook' },
            ].map(btn => {
              const commonStyle = {
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 16px', background: btn.bg, color: '#FFF',
                border: `2.5px solid ${btn.border}`, borderRadius: '999px',
                fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem',
                width: '100%', cursor: 'pointer',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.12)',
                transition: 'transform 0.2s',
                textDecoration: 'none', boxSizing: 'border-box',
              }
              const hoverProps = {
                onMouseEnter: e => e.currentTarget.style.transform = 'translateY(-3px)',
                onMouseLeave: e => e.currentTarget.style.transform = 'translateY(0)',
              }
              return btn.href ? (
                <Link key={btn.label} href={btn.href} style={commonStyle} {...hoverProps}>
                  {btn.emoji} {btn.label}
                </Link>
              ) : (
                <button key={btn.label} onClick={btn.action} style={commonStyle} {...hoverProps}>
                  {btn.emoji} {btn.label}
                </button>
              )
            })}
          </div>
        </NickCard>
      </div>

      {/* Row 2 — Today's lessons */}
      <div>
        <h2 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.5rem', color: '#1A1A2E', marginBottom: '14px' }}>
          🌈 Today's Adventure
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { time: '09:00–09:30', emoji: '🦁', title: 'Hop, Skip & Jump Adventure', area: 'Physical Development', class: 'ECD B Gold Stars', colour: 'green', status: 'ready' },
            { time: '10:00–10:30', emoji: '🔢', title: 'Sorting Local Foods', area: 'Mathematical Concepts', class: 'ECD B Gold Stars', colour: 'blue', status: 'draft' },
            { time: '11:00–11:30', emoji: '🎨', title: 'Painting Wild Animals', area: 'Visual & Performing Arts', class: 'ECD A Green Frogs', colour: 'pink', status: 'ready' },
          ].map((lesson, i) => {
            const p = PALETTE[lesson.colour]
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '16px 20px',
                background: p.bg,
                borderRadius: '1.25rem',
                border: `3px solid ${p.border}`,
                boxShadow: p.shadow,
                transition: 'transform 0.25s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(6px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>{lesson.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontFamily: "'Fredoka One', sans-serif", fontSize: '1.1rem', color: '#1A1A2E' }}>{lesson.title}</p>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#9090A8', fontWeight: 700 }}>{lesson.time} · {lesson.class} · {lesson.area}</p>
                </div>
                <span style={{
                  background: lesson.status === 'ready' ? '#00C853' : '#9090A8',
                  color: '#FFF', padding: '6px 16px', borderRadius: '999px',
                  fontFamily: "'Fredoka One', sans-serif", fontSize: '0.82rem',
                  flexShrink: 0,
                }}>{lesson.status === 'ready' ? '✅ Ready' : '✏️ Draft'}</span>
                <Link href="/dashboard/lessons" style={{
                  padding: '8px 18px', background: p.border, color: '#FFF',
                  border: 'none', borderRadius: '999px',
                  fontFamily: "'Fredoka One', sans-serif", fontSize: '0.88rem',
                  cursor: 'pointer', flexShrink: 0, textDecoration: 'none',
                  boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
                }}>Start ▶</Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Row 3 — Weekly progress chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        {[
          { emoji: '🤸', label: 'Movement Sessions', value: '4/5', colour: 'green', pct: 80 },
          { emoji: '📒', label: 'Logbook Entries', value: '9/10', colour: 'blue', pct: 90 },
          { emoji: '📚', label: 'Lessons Delivered', value: '12/15', colour: 'orange', pct: 80 },
        ].map(stat => (
          <NickCard key={stat.label} emoji={stat.emoji} title={stat.label} colour={stat.colour} badgeText={stat.value} badgeOk={stat.pct >= 80}>
            <ProgressBar value={stat.pct} colour={stat.colour} />
          </NickCard>
        ))}
      </div>

      {activeModal === 'lesson' && <LessonGeneratorModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'coach' && <CoachModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'ideas' && (
        <CoachModal
          onClose={() => setActiveModal(null)}
          initialPrompt="Give me 3 creative, low-resource activity ideas for today's lesson."
        />
      )}

    </div>
  )
}