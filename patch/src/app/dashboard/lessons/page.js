'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ModalShell, inputStyle, labelStyle, submitButtonStyle, errorText } from '@/components/ui/Modal'

const PALETTE = {
  orange: { bg: '#FFF3E8', border: '#FF6B00', shadow: '5px 5px 0 rgba(255,107,0,0.22)' },
  green:  { bg: '#E8FFF2', border: '#00C853', shadow: '5px 5px 0 rgba(0,200,83,0.22)'  },
  blue:   { bg: '#E6F5FF', border: '#00A8E8', shadow: '5px 5px 0 rgba(0,168,232,0.22)' },
  purple: { bg: '#F3EEFF', border: '#9B59B6', shadow: '5px 5px 0 rgba(155,89,182,0.22)'},
  pink:   { bg: '#FFE8F2', border: '#FF4081', shadow: '5px 5px 0 rgba(255,64,129,0.22)' },
}
const STATUS_COLOUR = { draft: 'blue', ready: 'orange', delivered: 'pink' }

function LessonGeneratorModal({ classes, onClose, onSaved }) {
  const [step, setStep] = useState('form')
  const [theme, setTheme] = useState('')
  const [learningArea, setLearningArea] = useState('')
  const [classId, setClassId] = useState(classes[0]?.id || '')
  const [duration, setDuration] = useState(30)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [plan, setPlan] = useState(null)

  const selectedClass = classes.find(c => c.id === classId)

  async function handleGenerate(e) {
    e.preventDefault()
    setError('')
    if (!theme.trim() || !learningArea.trim()) {
      setError('Please fill in Theme and Learning Area.')
      return
    }
    if (!classId) {
      setError('Please select a class.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ai/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, learningArea, classLevel: selectedClass?.name, duration: Number(duration) || 30 }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong generating the lesson.')
      } else {
        setPlan(data)
        setStep('preview')
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: classId,
          title: plan.title,
          objectives: plan.objectives,
          activities: plan.activities,
          resources: plan.resources,
          assessment_notes: plan.assessment_notes,
          duration_minutes: Number(duration) || 30,
          learning_area_name: learningArea,
          status: 'draft',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save lesson.')
      } else {
        onSaved(data)
        onClose()
      }
    } catch {
      setError('Network error while saving — please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalShell title="AI Lesson Generator" emoji="✨" onClose={onClose}>
      {step === 'form' ? (
        <form onSubmit={handleGenerate}>
          <label style={labelStyle()}>Theme</label>
          <input style={inputStyle()} value={theme} onChange={e => setTheme(e.target.value)} placeholder="e.g. Wild Animals" />

          <label style={labelStyle()}>Learning Area</label>
          <input style={inputStyle()} value={learningArea} onChange={e => setLearningArea(e.target.value)} placeholder="e.g. Physical Development" />

          <label style={labelStyle()}>Class</label>
          <select style={inputStyle()} value={classId} onChange={e => setClassId(e.target.value)}>
            {classes.length === 0 && <option value="">No classes found</option>}
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          <label style={labelStyle()}>Duration (minutes)</label>
          <input style={inputStyle()} type="number" value={duration} onChange={e => setDuration(e.target.value)} />

          {errorText(error)}

          <button type="submit" disabled={loading || classes.length === 0} style={submitButtonStyle(loading || classes.length === 0)}>
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

          {errorText(error)}

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button onClick={() => setStep('form')} style={{ ...submitButtonStyle(false, 'transparent', '#9090A8'), color: '#4A4A6A' }}>
              ← Back
            </button>
            <button onClick={handleSave} disabled={saving} style={submitButtonStyle(saving, '#00C853', '#00A843')}>
              {saving ? 'Saving...' : '💾 Save as Draft'}
            </button>
          </div>
        </div>
      )}
    </ModalShell>
  )
}

function EditLessonModal({ lesson, onClose, onSaved }) {
  const [title, setTitle] = useState(lesson.title)
  const [objectives, setObjectives] = useState(lesson.objectives || '')
  const [assessmentNotes, setAssessmentNotes] = useState(lesson.assessment_notes || '')
  const [duration, setDuration] = useState(lesson.duration_minutes || 30)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(markReady) {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, objectives, assessment_notes: assessmentNotes,
          duration_minutes: Number(duration) || 30,
          ...(markReady ? { status: 'ready' } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to update lesson.')
      } else {
        onSaved(data)
        onClose()
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ModalShell title="Continue Editing" emoji="✏️" onClose={onClose}>
      <label style={labelStyle()}>Title</label>
      <input style={inputStyle()} value={title} onChange={e => setTitle(e.target.value)} />

      <label style={labelStyle()}>Objectives</label>
      <textarea style={{ ...inputStyle(), minHeight: '70px' }} value={objectives} onChange={e => setObjectives(e.target.value)} />

      <label style={labelStyle()}>Assessment Notes</label>
      <textarea style={{ ...inputStyle(), minHeight: '70px' }} value={assessmentNotes} onChange={e => setAssessmentNotes(e.target.value)} />

      <label style={labelStyle()}>Duration (minutes)</label>
      <input style={inputStyle()} type="number" value={duration} onChange={e => setDuration(e.target.value)} />

      {errorText(error)}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => handleSave(false)} disabled={saving} style={submitButtonStyle(saving, 'transparent', '#00A8E8')}>
          {saving ? 'Saving...' : '💾 Save Draft'}
        </button>
        <button onClick={() => handleSave(true)} disabled={saving} style={submitButtonStyle(saving, '#00C853', '#00A843')}>
          {saving ? 'Saving...' : '✅ Mark as Ready'}
        </button>
      </div>
    </ModalShell>
  )
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showGenerator, setShowGenerator] = useState(false)
  const [editingLesson, setEditingLesson] = useState(null)

  async function loadLessons() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/lessons')
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to load lessons.')
      } else {
        setLessons(data.lessons)
        setClasses(data.classes)
      }
    } catch {
      setError('Network error loading lessons.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadLessons() }, [])

  function handleLessonSaved(updated) {
    setLessons(prev => {
      const idx = prev.findIndex(l => l.id === updated.id)
      if (idx === -1) return [updated, ...prev]
      const copy = [...prev]
      copy[idx] = updated
      return copy
    })
  }

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '2.2rem', color: '#1A1A2E', margin: 0 }}>
            📝 Magic Lesson Plans
          </h1>
          <p style={{ color: '#9090A8', fontWeight: 700, margin: '4px 0 0' }}>Plan, prepare, and deliver engaging activities</p>
        </div>
        <button onClick={() => setShowGenerator(true)} style={{
          padding: '12px 24px', background: '#00C853', color: '#FFF',
          border: '3px solid #00A843', borderRadius: '999px',
          fontFamily: "'Fredoka One', sans-serif", fontSize: '1rem',
          cursor: 'pointer', boxShadow: '4px 4px 0 rgba(0,200,83,0.25)',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>✨</span> AI Lesson Generator
        </button>
      </div>

      {loading && <p style={{ fontFamily: "'Nunito', sans-serif", color: '#9090A8' }}>Loading lessons...</p>}
      {errorText(error)}

      {!loading && lessons.length === 0 && !error && (
        <div style={{ padding: '40px', textAlign: 'center', background: '#FFF3E8', borderRadius: '1.5rem', border: '3px dashed #FF6B00' }}>
          <p style={{ fontFamily: "'Fredoka One', sans-serif", color: '#1A1A2E', fontSize: '1.1rem' }}>No lessons yet!</p>
          <p style={{ color: '#9090A8', fontWeight: 700 }}>Click "AI Lesson Generator" to create your first one.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
        {lessons.map((lesson) => {
          const p = PALETTE[STATUS_COLOUR[lesson.status] || 'blue']
          const isDraft = lesson.status === 'draft'
          const isDelivered = lesson.status === 'delivered'

          let statusText = 'Ready to Teach!', statusIcon = '✅'
          if (isDraft) { statusText = 'Drafting...'; statusIcon = '✏️' }
          if (isDelivered) { statusText = 'Delivered & Logged'; statusIcon = '📚' }

          return (
            <div key={lesson.id} style={{
              background: p.bg, border: `3px solid ${p.border}`, borderRadius: '1.75rem',
              padding: '20px', boxShadow: p.shadow, position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontSize: '2.4rem' }}>📘</span>
                <span style={{
                  background: '#FFF', color: p.border, border: `2px solid ${p.border}`,
                  padding: '4px 12px', borderRadius: '999px',
                  fontFamily: "'Fredoka One', sans-serif", fontSize: '0.75rem',
                }}>
                  {statusIcon} {statusText}
                </span>
              </div>

              <h2 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.2rem', color: '#1A1A2E', margin: '0 0 6px' }}>
                {lesson.title}
              </h2>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FFF', background: p.border, padding: '2px 8px', borderRadius: '999px' }}>
                  {lesson.classes?.name || 'No class'}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4A4A6A', background: 'rgba(255,255,255,0.7)', border: '1.5px solid rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: '999px' }}>
                  {lesson.duration_minutes} mins
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.5)', border: '2px solid rgba(0,0,0,0.06)', padding: '12px', borderRadius: '1rem', marginBottom: '16px', minHeight: '60px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '0.8rem', fontFamily: "'Fredoka One', sans-serif", color: '#4A4A6A' }}>Activities</p>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#4A4A6A', fontSize: '0.85rem', fontWeight: 600 }}>
                  {(lesson.activities || []).map((act, j) => <li key={j} style={{ marginBottom: '4px' }}>{act.name || act}</li>)}
                </ul>
              </div>

              {isDraft && (
                <button onClick={() => setEditingLesson(lesson)} style={{
                  width: '100%', padding: '10px', background: p.border, color: '#FFF', border: `2.5px solid ${p.border}`,
                  borderRadius: '999px', fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem', cursor: 'pointer',
                }}>Continue Editing ✏️</button>
              )}
              {lesson.status === 'ready' && (
                <Link href={`/dashboard/logbook?lesson=${lesson.id}&class=${lesson.class_id}`} style={{
                  display: 'block', textAlign: 'center', width: '100%', padding: '10px', boxSizing: 'border-box',
                  background: p.border, color: '#FFF', border: `2.5px solid ${p.border}`,
                  borderRadius: '999px', fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem',
                  textDecoration: 'none',
                }}>Start Lesson ▶️</Link>
              )}
              {isDelivered && (
                <Link href="/dashboard/logbook" style={{
                  display: 'block', textAlign: 'center', width: '100%', padding: '10px', boxSizing: 'border-box',
                  background: 'transparent', color: p.border, border: `2.5px solid ${p.border}`,
                  borderRadius: '999px', fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem',
                  textDecoration: 'none',
                }}>View Logbook 📖</Link>
              )}
            </div>
          )
        })}
      </div>

      {showGenerator && (
        <LessonGeneratorModal classes={classes} onClose={() => setShowGenerator(false)} onSaved={handleLessonSaved} />
      )}
      {editingLesson && (
        <EditLessonModal lesson={editingLesson} onClose={() => setEditingLesson(null)} onSaved={handleLessonSaved} />
      )}
    </div>
  )
}
