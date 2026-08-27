'use client'

import { useState, useEffect } from 'react'

export function PreviewSwitcher() {
  const [role, setRole] = useState('school_head')
  const [isPlaceholder, setIsPlaceholder] = useState(false)

  useEffect(() => {
    // Check if using placeholder credentials
    const isMock = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')
    setIsPlaceholder(isMock)

    // Get current preview role from cookies
    const match = document.cookie.match(/(?:^|; )preview_role=([^;]*)/)
    if (match) {
      setRole(match[1])
    }
  }, [])

  const toggleRole = () => {
    const newRole = role === 'school_head' ? 'teacher' : 'school_head'
    document.cookie = `preview_role=${newRole}; path=/; max-age=31536000`
    setRole(newRole)
    window.location.reload()
  }

  if (!isPlaceholder) return null

  return (
    <button 
      onClick={toggleRole}
      className="btn btn-outline"
      style={{
        fontSize: 'var(--font-size-xs)',
        padding: 'var(--space-1) var(--space-3)',
        borderColor: 'var(--color-primary)',
        color: 'var(--color-primary)'
      }}
    >
      Previewing: {role === 'school_head' ? 'School Head' : 'Teacher'} (Click to switch)
    </button>
  )
}
