'use client'

import { PreviewSwitcher } from './PreviewSwitcher'
import { Bell, Search, User } from 'lucide-react';
import { useState } from 'react';

export function Topbar({ user }) {
  const role = user?.user_metadata?.role || 'school_head'
  const name = user?.user_metadata?.full_name || 'Principal'
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const avatarColors = {
    school_head: { bg: '#FF6B00', border: '#E55A00' },
    teacher: { bg: '#00C853', border: '#00A843' },
  }
  const av = avatarColors[role] || avatarColors.school_head

  return (
    <header className="app-header" style={{ justifyContent: 'space-between' }}>
      {/* Search */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={16} style={{ position: 'absolute', left: 12, color: '#9090A8', pointerEvents: 'none' }} />
        <input
          type="text"
          placeholder="Search the classroom…"
          style={{
            paddingLeft: '36px', paddingRight: '16px',
            paddingTop: '8px', paddingBottom: '8px',
            border: '2.5px solid rgba(0,0,0,0.1)',
            borderRadius: '999px',
            fontFamily: "'Nunito', sans-serif",
            fontSize: '0.9rem',
            background: '#FFF9F5',
            width: '260px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#FF6B00'}
          onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
        />
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <PreviewSwitcher />

        {/* Bell */}
                {/* Notification Bell */}
        <NotificationBell />

        {/* Avatar + name */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          paddingLeft: '16px', borderLeft: '2.5px solid rgba(0,0,0,0.06)',
        }}>
          <div style={{ textAlign: 'right', display: 'none' }}>
            <p style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem', color: '#1A1A2E' }}>{name}</p>
            <p style={{ fontSize: '0.75rem', color: '#9090A8', textTransform: 'capitalize' }}>{role.replace('_', ' ')}</p>
          </div>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: av.bg,
            border: `3px solid ${av.border}`,
            boxShadow: '3px 3px 0 rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Fredoka One', sans-serif",
            fontSize: '1rem', color: '#FFFFFF',
          }}>
            {initials || <User size={16} />}
          </div>
          <div>
            <p style={{ fontFamily: "'Fredoka One', sans-serif", fontSize: '0.95rem', color: '#1A1A2E', margin: 0 }}>{name}</p>
            <p style={{ fontSize: '0.75rem', color: '#9090A8', textTransform: 'capitalize', margin: 0 }}>{role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
