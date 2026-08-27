'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'

const PALETTE = {
  orange: { bg: '#FFF3E8', border: '#FF6B00', shadow: '5px 5px 0 rgba(255,107,0,0.22)' },
  green:  { bg: '#E8FFF2', border: '#00C853', shadow: '5px 5px 0 rgba(0,200,83,0.22)'  },
  blue:   { bg: '#E6F5FF', border: '#00A8E8', shadow: '5px 5px 0 rgba(0,168,232,0.22)' },
  purple: { bg: '#F3EEFF', border: '#9B59B6', shadow: '5px 5px 0 rgba(155,89,182,0.22)'},
  pink:   { bg: '#FFE8F2', border: '#FF4081', shadow: '5px 5px 0 rgba(255,64,129,0.22)' },
  yellow: { bg: '#FFFBE6', border: '#FFD600', shadow: '5px 5px 0 rgba(255,214,0,0.22)' },
}

const teachers = [
  {
    name: 'Mrs. Chipo Ndlovu',
    class: 'ECD A — Green Frogs 🐸',
    avatar: '👩‍🏫',
    colour: 'green',
    stars: 5,
    highlights: 'Successfully completed underarm bucket toss with all 15 toddlers! 🎯',
    challenges: 'Need more clean sand for the sandbox activity next week.',
    supportNeeded: false,
    progress: 95,
  },
  {
    name: 'Mr. Themba Moyo',
    class: 'ECD B — Golden Stars 🌟',
    avatar: '👨‍🏫',
    colour: 'blue',
    stars: 4,
    highlights: 'Children loved the Tyre Hop Obstacle Course. Great agility! 🦘',
    challenges: 'A few learners are still working on one-leg Flamingo balance.',
    supportNeeded: true,
    supportTopic: 'Flamingo Balance techniques',
    progress: 80,
  },
  {
    name: 'Miss Sharon Ncube',
    class: 'ECD A — Playful Pandas 🐼',
    avatar: '👩‍🎨',
    colour: 'pink',
    stars: 3,
    highlights: 'Beautiful paper tearing & collage pasting results! 🎨',
    challenges: 'Rhythm-clapping patterns taking longer than scheduled.',
    supportNeeded: true,
    supportTopic: 'Clapping games & rhythm techniques',
    progress: 65,
  },
]

function ProgressBar({ value, colour }) {
  const border = PALETTE[colour]?.border || '#FF6B00'
  return (
    <div style={{ background: 'rgba(0,0,0,0.07)', borderRadius: '999px', height: '12px', overflow: 'hidden', border: '2px solid rgba(0,0,0,0.06)', marginTop: '6px' }}>
      <div style={{ height: '100%', width: `${value}%`, background: border, borderRadius: '999px', transition: 'width 1s cubic-bezier(0.34,1.56,0.64,1)' }} />
    </div>
  )
}

export default function TeachersPage() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '2.2rem', color: '#1A1A2E', margin: 0 }}>
          🎈 Teacher Companions
        </h1>
        <p style={{ color: '#9090A8', fontWeight: 700, margin: '4px 0 0' }}>Check in on classroom smiles, challenges, and magic moments</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '28px' }}>
        {teachers.map(t => {
          const p = PALETTE[t.colour]
          return (
            <div key={t.name} style={{
              background: p.bg,
              borderRadius: '1.75rem',
              border: `3px solid ${p.border}`,
              boxShadow: p.shadow,
              padding: '22px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              {/* Decorative splat */}
              <div style={{ position: 'absolute', top: '-16px', right: '-16px', width: '70px', height: '70px', background: `${p.border}18`, borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' }} />

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '54px', height: '54px', borderRadius: '50%', fontSize: '1.6rem',
                  background: p.border, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '3px solid rgba(0,0,0,0.1)', boxShadow: '3px 3px 0 rgba(0,0,0,0.1)', flexShrink: 0,
                }}>{t.avatar}</div>
                <div>
                  <p style={{ margin: 0, fontFamily: "'Fredoka One', sans-serif", fontSize: '1.05rem', color: '#1A1A2E' }}>{t.name}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: p.border, fontWeight: 700 }}>{t.class}</p>
                  <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ fontSize: '0.85rem', color: i < t.stars ? '#FFD600' : 'rgba(0,0,0,0.15)' }}>★</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9090A8' }}>Weekly goal</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: p.border }}>{t.progress}%</span>
                </div>
                <ProgressBar value={t.progress} colour={t.colour} />
              </div>

              {/* Highlights */}
              <div style={{ marginBottom: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.6)', borderRadius: '1rem', border: '2px solid rgba(255,255,255,0.8)' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: p.border, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>✨ This Week's Win</p>
                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#4A4A6A' }}>{t.highlights}</p>
              </div>

              {/* Challenges */}
              <div style={{ marginBottom: '12px', padding: '10px 12px', background: 'rgba(255,255,255,0.4)', borderRadius: '1rem', border: '2px dashed rgba(0,0,0,0.08)' }}>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#9090A8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>🌧 Challenge</p>
                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: '#4A4A6A' }}>{t.challenges}</p>
              </div>

              {/* Support badge */}
              {t.supportNeeded ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#FFE8F2', border: '2px solid #FF4081', borderRadius: '999px' }}>
                  <span style={{ fontSize: '1rem' }}>🙋</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 800, color: '#FF4081', textTransform: 'uppercase' }}>Support Requested</p>
                    <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#1A1A2E' }}>{t.supportTopic}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: '#E8FFF2', border: '2px solid #00C853', borderRadius: '999px' }}>
                  <span style={{ fontSize: '1rem' }}>😊</span>
                  <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#00C853' }}>All Good — Rocking It!</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
        {[
          { emoji: '🎓', label: 'Total Teachers', value: '3', colour: 'orange' },
          { emoji: '🙋', label: 'Support Requests', value: '2', colour: 'pink' },
          { emoji: '⭐', label: 'Avg Confidence', value: '4.0 / 5', colour: 'green' },
        ].map(s => {
          const p = PALETTE[s.colour]
          return (
            <div key={s.label} style={{ background: p.bg, border: `3px solid ${p.border}`, borderRadius: '1.25rem', padding: '18px 20px', boxShadow: p.shadow, display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '2rem' }}>{s.emoji}</span>
              <div>
                <p style={{ margin: 0, fontFamily: "'Fredoka One', sans-serif", fontSize: '1.6rem', color: p.border }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#9090A8' }}>{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
