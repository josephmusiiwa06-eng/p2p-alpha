'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ModalShell, inputStyle, labelStyle, submitButtonStyle, errorText } from '@/components/ui/Modal'

const PARTICIPATION_OPTIONS = [
  { value: 'poor', label: 'Poor' },
  { value: 'fair', label: 'Fair' },
  { value: 'good', label: 'Good' },
  { value: 'excellent', label: 'Excellent' },
]

function NewEntryModal({ readyLessons, defaultLessonId, onClose, onSaved }) {
  const [lessonPlanId, setLessonPlanId] = useState(defaultLessonId || readyLessons[0]?.id || '')
  const [reflectionWorked, setReflectionWorked] = useState('')
  const [reflectionDifficult, setReflectionDifficult] = useState('')
  const [reflectionChange, setReflectionChange] = useState('')
  const [participationLevel, setParticipationLevel] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const selectedLesson = readyLessons.find(l => l.id === lessonPlanId)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!lessonPlanId || !selectedLesson) {
      setError('Please select a lesson to reflect on.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/logbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_plan_id: lessonPlanId,
          class_id: selectedLesson.class_id,
          reflection_worked: reflectionWorked,
          reflection_difficult: reflectionDifficult,
          reflection_change: reflectionChange,
          participation_level: participationLevel,
          notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save entry.')
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
    <ModalShell title="New Logbook Entry" emoji="📒" onClose={onClose} maxWidth="560px">
      {readyLessons.length === 0 ? (
        <p style={{ fontFamily: "'Nunito', sans-serif", color: '#9090A8' }}>
          No lessons are marked "Ready to Teach" yet. Go to Lessons and mark one as ready first.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label style={labelStyle()}>Lesson</label>
          <select style={inputStyle()} value={lessonPlanId} onChange={e => setLessonPlanId(e.target.value)}>
            {readyLessons.map(l => (
              <option key={l.id} value={l.id}>{l.title} — {l.classes?.name}</option>
            ))}
          </select>

          <label style={labelStyle()}>What worked well?</label>
          <textarea style={{ ...inputStyle(), minHeight: '60px' }} value={reflectionWorked} onChange={e => setReflectionWorked(e.target.value)} />

          <label style={labelStyle()}>What was difficult?</label>
          <textarea style={{ ...inputStyle(), minHeight: '60px' }} value={reflectionDifficult} onChange={e => setReflectionDifficult(e.target.value)} />

          <label style={labelStyle()}>What would you change next time?</label>
          <textarea style={{ ...inputStyle(), minHeight: '60px' }} value={reflectionChange} onChange={e => setReflectionChange(e.target.value)} />

          <label style={labelStyle()}>Participation Level</label>
          <select style={inputStyle()} value={participationLevel} onChange={e => setParticipationLevel(e.target.value)}>
            <option value="">Select...</option>
            {PARTICIPATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <label style={labelStyle()}>Additional Notes</label>
          <textarea style={{ ...inputStyle(), minHeight: '50px' }} value={notes} onChange={e => setNotes(e.target.value)} />

          {errorText(error)}

          <button type="submit" disabled={saving} style={submitButtonStyle(saving, '#00A8E8', '#0090CC')}>
            {saving ? 'Saving...' : '✅ Complete & Log Lesson'}
          </button>
        </form>
      )}
    </ModalShell>
  )
}

function LogbookContent() {
  const searchParams = useSearchParams()
  const preselectLesson = searchParams.get('lesson')

  const [entries, setEntries] = useState([])
  const [readyLessons, setReadyLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  async function loadData() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/logbook')
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to load logbook.')
      } else {
        setEntries(data.entries)
        setReadyLessons(data.readyLessons)
      }
    } catch {
      setError('Network error loading logbook.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (preselectLesson && !loading) setShowModal(true)
  }, [preselectLesson, loading])

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '2.2rem', color: '#1A1A2E', margin: 0 }}>
            📒 Digital Logbook
          </h1>
          <p style={{ color: '#9090A8', fontWeight: 700, margin: '4px 0 0' }}>Record lesson reflections and participation</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          padding: '12px 24px', background: '#00A8E8', color: '#FFF',
          border: '3px solid #0090CC', borderRadius: '999px',
          fontFamily: "'Fredoka One', sans-serif", fontSize: '1rem',
          cursor: 'pointer', boxShadow: '4px 4px 0 rgba(0,168,232,0.25)',
        }}>+ New Entry</button>
      </div>

      {loading && <p style={{ fontFamily: "'Nunito', sans-serif", color: '#9090A8' }}>Loading...</p>}
      {errorText(error)}

      {!loading && entries.length === 0 && !error && (
        <div style={{ padding: '40px', textAlign: 'center', background: '#E6F5FF', borderRadius: '1.5rem', border: '3px dashed #00A8E8' }}>
          <p style={{ fontFamily: "'Fredoka One', sans-serif", color: '#1A1A2E', fontSize: '1.1rem' }}>No entries yet!</p>
          <p style={{ color: '#9090A8', fontWeight: 700 }}>Mark a lesson "Ready to Teach" in Lessons, then log it here.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {entries.map(entry => (
          <div key={entry.id} style={{
            background: '#FFF', border: '3px solid #E6F5FF', borderRadius: '1.25rem', padding: '18px',
            boxShadow: '3px 3px 0 rgba(0,168,232,0.12)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontFamily: "'Fredoka One', sans-serif", color: '#1A1A2E', margin: 0, fontSize: '1.05rem' }}>
                {entry.lesson_plans?.title || 'Lesson'}
              </h3>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00A8E8', background: '#E6F5FF', padding: '3px 10px', borderRadius: '999px' }}>
                {entry.classes?.name}
              </span>
            </div>
            {entry.participation_level && (
              <p style={{ margin: '0 0 8px', fontSize: '0.8rem', fontWeight: 700, color: '#4A4A6A' }}>
                Participation: <span style={{ color: '#00C853' }}>{entry.participation_level.charAt(0).toUpperCase() + entry.participation_level.slice(1)}</span>
              </p>
            )}
            {entry.reflection_worked && (
              <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#4A4A6A' }}><strong>Worked well:</strong> {entry.reflection_worked}</p>
            )}
            {entry.reflection_difficult && (
              <p style={{ margin: '0 0 4px', fontSize: '0.85rem', color: '#4A4A6A' }}><strong>Difficult:</strong> {entry.reflection_difficult}</p>
            )}
            {entry.reflection_change && (
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#4A4A6A' }}><strong>Next time:</strong> {entry.reflection_change}</p>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <NewEntryModal
          readyLessons={readyLessons}
          defaultLessonId={preselectLesson}
          onClose={() => setShowModal(false)}
          onSaved={() => loadData()}
        />
      )}
    </div>
  )
}

export default function LogbookPage() {
  return (
    <Suspense fallback={<p style={{ fontFamily: "'Nunito', sans-serif", color: '#9090A8' }}>Loading...</p>}>
      <LogbookContent />
    </Suspense>
  )
}
