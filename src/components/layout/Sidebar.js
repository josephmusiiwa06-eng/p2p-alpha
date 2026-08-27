'use client'

import Link from 'next/link'
import { Home, Users, BookOpen, Activity, BarChart, Settings, LogOut, Zap } from 'lucide-react'
import { signout } from '@/app/login/actions'

export function Sidebar({ role = 'school_head' }) {
  const headLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Teachers', href: '/dashboard/teachers', icon: Users },
    { name: 'Curriculum', href: '/dashboard/curriculum', icon: BookOpen },
    { name: 'Movement', href: '/dashboard/movement', icon: Activity },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart },
  ]
  const teacherLinks = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'My Lessons', href: '/dashboard/lessons', icon: BookOpen },
    { name: 'Logbook', href: '/dashboard/logbook', icon: Activity },
  ]
  const links = role === 'school_head' ? headLinks : teacherLinks

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-1">
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '1.25rem',
          padding: '10px 18px',
          border: '3px solid rgba(255,255,255,0.35)',
          boxShadow: '4px 4px 0 rgba(0,0,0,0.12)',
          display: 'inline-block',
        }}>
          <span style={{
            fontFamily: "'Fredoka One', sans-serif",
            fontSize: '2rem',
            color: '#FFFFFF',
            letterSpacing: '1px',
            lineHeight: 1,
          }}>P2P</span>
        </div>
        <span style={{
          fontFamily: "'Fredoka One', sans-serif",
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.75)',
          letterSpacing: '0.5px',
        }}>Alpha</span>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1 }}>
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.name} href={link.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '12px',
                color: 'rgba(255,255,255,0.88)',
                fontFamily: "'Fredoka One', sans-serif",
                fontSize: '1.05rem',
                marginBottom: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '2px solid transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.22)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'
                e.currentTarget.style.transform = 'translateX(6px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.transform = 'translateX(0)'
              }}>
                <Icon size={20} />
                {link.name}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div style={{ borderTop: '2px solid rgba(255,255,255,0.2)', paddingTop: '16px', marginTop: '8px' }}>
        <form action={signout}>
          <button type="submit" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', borderRadius: '12px',
            color: 'rgba(255,255,255,0.75)', fontFamily: "'Fredoka One', sans-serif",
            fontSize: '1rem', width: '100%', background: 'transparent',
            border: '2px solid transparent', cursor: 'pointer',
          }}>
            <LogOut size={18} /> Log Out
          </button>
        </form>
      </div>
    </aside>
  )
}
