'use client'

import { useEffect, useState } from 'react'
import { ModalShell, inputStyle, labelStyle, submitButtonStyle, errorText } from '@/components/ui/Modal'

const COLOUR_HEX = {
  orange: { border: '#FF6B00', bg: '#FFF3E8' },
  blue:   { border: '#00A8E8', bg: '#E6F5FF' },
  green:  { border: '#00C853', bg: '#E8FFF2' },
  pink:   { border: '#FF4081', bg: '#FFE8F2' },
  purple: { border: '#9B59B6', bg: '#F3EEFF' },
  yellow: { border: '#F4C300', bg: '#FFFBE6' },
}

function LogSessionModal({ classes, onClose, onLogged }) {
  const [classId, setClassId] = useState(classes[0]?.id || '')
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10))
  const [duration, setDuration] = useState(15)
  const [selectedSkills, setSelectedSkills] = useState([])
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const SKILL_OPTIONS = [
    { key: 'running', label: '🏃 Running' },
    { key: 'jumping', label: '🦘 Jumping' },
    { key: 'balance', label: '⚖️ Balance' },
    { key: 'catching', label: '🏀 Catching' },
    { key: 'throwing', label: '🎯 Throwing' },
    { key: 'rhythm', label: '🎵 Rhythm' },
    { key: 'coordination', label: '🤝 Coordination' },
    { key: 'fine_motor', label: '✏️ Fine Motor' },
  ]

  function toggleSkill(key) {
    setSelectedSkills(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!classId) { setError('Please select a class.'); return }
    if (selectedSkills.length === 0) { setError('Please select at least one skill covered.'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/movement/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId, session_date: sessionDate,
          duration_minutes: Number(duration) || 15,
          skills: selectedSkills, notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to log session.')
      } else {
        onLogged()
        onClose()
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalShell title="Log New Session" emoji="🤸" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle()}>Class</label>
        <select style={inputStyle()} value={classId} onChange={e => setClassId(e.target.value)}>
          {classes.length === 0 && <option value="">No classes found</option>}
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label style={labelStyle()}>Date</label>
        <input style={inputStyle()} type="date" value={sessionDate} onChange={e => setSessionDate(e.target.value)} />

        <label style={labelStyle()}>Duration (minutes)</label>
        <input style={inputStyle()} type="number" value={duration} onChange={e => setDuration(e.target.value)} />

        <label style={labelStyle()}>Skills Covered</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          {SKILL_OPTIONS.map(opt => {
            const active = selectedSkills.includes(opt.key)
            return (
              <button type="button" key={opt.key} onClick={() => toggleSkill(opt.key)} style={{
                padding: '6px 14px', borderRadius: '999px',
                border: `2px solid ${active ? '#00C853' : '#E0E0E8'}`,
                background: active ? '#00C853' : '#FFF',
                color: active ? '#FFF' : '#4A4A6A',
                fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer',
              }}>{opt.label}</button>
            )
          })}
        </div>

        <label style={labelStyle()}>Notes (optional)</label>
        <textarea style={{ ...inputStyle(), minHeight: '60px' }} value={notes} onChange={e => setNotes(e.target.value)} />

        {errorText(error)}

        <button type="submit" disabled={saving} style={submitButtonStyle(saving, '#00C853', '#00A843')}>
          {saving ? 'Logging...' : '✅ Log Session'}
        </button>
      </form>
    </ModalShell>
  )
}

export default function MovementPage() {
  const [skills, setSkills] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showLogModal, setShowLogModal] = useState(false)

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/movement')
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to load movement data.')
      } else {
        setSkills(data.skills)
        setClasses(data.classes)
      }
    } catch {
      setError('Network error loading movement data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '2.2rem', color: '#1A1A2E', margin: 0 }}>
            🤸 Kinder Kinetics
          </h1>
          <p style={{ color: '#9090A8', fontWeight: 700, margin: '4px 0 0' }}>This week's movement & physical development coverage</p>
        </div>
        <button onClick={() => setShowLogModal(true)} style={{
          padding: '12px 24px', background: '#00C853', color: '#FFF',
          border: '3px solid #00A843', borderRadius: '999px',
          fontFamily: "'Fredoka One', sans-serif", fontSize: '1rem',
          cursor: 'pointer', boxShadow: '4px 4px 0 rgba(0,200,83,0.25)',
        }}>+ Log New Session</button>
      </div>

      {loading && <p style={{ fontFamily: "'Nunito', sans-serif", color: '#9090A8' }}>Loading...</p>}
      {errorText(error)}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
        {skills.map(skill => {
          const c = COLOUR_HEX[skill.colour] || COLOUR_HEX.orange
          const pct = Math.min(100, Math.round((skill.sessions / skill.target) * 100))
          return (
            <div key={skill.key} style={{
              background: c.bg, border: `3px solid ${c.border}`, borderRadius: '1.5rem', padding: '18px',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{skill.emoji}</div>
              <h3 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1rem', color: '#1A1A2E', margin: '0 0 8px' }}>{skill.name}</h3>
              <p style={{ margin: '0 0 8px', fontFamily: "'Nunito', sans-serif", fontWeight: 800, color: c.border }}>
                {skill.sessions} / {skill.target} sessions
              </p>
              <div style={{ background: 'rgba(255,255,255,0.6)', borderRadius: '999px', height: '10px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: c.border, borderRadius: '999px' }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {skill.classes.length === 0 ? (
                  <span style={{ fontSize: '0.7rem', color: '#9090A8', fontWeight: 700 }}>No sessions logged yet</span>
                ) : skill.classes.map((cls, i) => (
                  <span key={i} style={{ fontSize: '0.7rem', fontWeight: 700, color: c.border, background: '#FFF', border: `1.5px solid ${c.border}`, padding: '2px 8px', borderRadius: '999px' }}>{cls}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {showLogModal && (
        <LogSessionModal classes={classes} onClose={() => setShowLogModal(false)} onLogged={loadData} />
      )}
    </div>
  )
}
