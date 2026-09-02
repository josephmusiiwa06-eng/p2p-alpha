'use client'

export function ModalShell({ title, emoji, onClose, children, maxWidth = '480px' }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px',
    }} onClick={onClose}>
      <div style={{
        background: '#FFF', borderRadius: '1.5rem', padding: '28px',
        maxWidth, width: '100%', maxHeight: '85vh', overflowY: 'auto',
        border: '3px solid #1A1A2E', boxShadow: '6px 6px 0 rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '1.3rem', color: '#1A1A2E', margin: 0 }}>
            {emoji} {title}
          </h2>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#9090A8',
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function inputStyle() {
  return {
    width: '100%', padding: '10px 14px', borderRadius: '0.9rem',
    border: '2px solid #E0E0E8', fontFamily: "'Nunito', sans-serif",
    fontSize: '0.95rem', marginBottom: '12px', boxSizing: 'border-box',
  }
}

export function labelStyle() {
  return { fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#4A4A6A', display: 'block', marginBottom: '4px' }
}

export function submitButtonStyle(disabled, colour = '#FF6B00', border = '#E55A00') {
  return {
    padding: '10px 20px', background: disabled ? '#C0C0D0' : colour, color: '#FFF',
    border: `2.5px solid ${disabled ? '#B0B0C0' : border}`, borderRadius: '999px',
    fontFamily: "'Fredoka One', sans-serif", fontSize: '0.9rem',
    cursor: disabled ? 'not-allowed' : 'pointer', width: '100%',
  }
}

export function errorText(msg) {
  if (!msg) return null
  return <p style={{ color: '#E0306A', fontWeight: 700, fontSize: '0.85rem' }}>{msg}</p>
}
