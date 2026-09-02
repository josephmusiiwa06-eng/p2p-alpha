import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const SKILL_KEYS = ['running', 'jumping', 'balance', 'throwing', 'catching', 'coordination', 'fine_motor', 'rhythm']

function getMonday(dateStr) {
  const date = dateStr ? new Date(dateStr) : new Date()
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  return date.toISOString().slice(0, 10)
}

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { class_id, session_date, duration_minutes, skills, notes } = body

    if (!class_id || !session_date || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ error: 'class_id, session_date, and at least one skill are required' }, { status: 400 })
    }

    const validSkills = skills.filter(s => SKILL_KEYS.includes(s))
    if (validSkills.length === 0) {
      return NextResponse.json({ error: 'No valid skill categories provided' }, { status: 400 })
    }

    const { error: sessionError } = await supabase
      .from('class_sessions')
      .insert({
        class_id,
        teacher_id: user.id,
        session_date,
        duration_minutes: duration_minutes || 15,
        activities: [],
        skill_categories_covered: validSkills,
        notes: notes || '',
      })
    if (sessionError) throw sessionError

    const weekStart = getMonday(session_date)

    const { data: existing, error: fetchError } = await supabase
      .from('programme_coverage')
      .select('*')
      .eq('class_id', class_id)
      .eq('week_start', weekStart)
      .maybeSingle()
    if (fetchError) throw fetchError

    if (existing) {
      const updates = { total_sessions: (existing.total_sessions || 0) + 1 }
      for (const skill of validSkills) {
        updates[skill] = (existing[skill] || 0) + 1
      }
      const { error: updateError } = await supabase
        .from('programme_coverage')
        .update(updates)
        .eq('id', existing.id)
      if (updateError) throw updateError
    } else {
      const newRow = { class_id, week_start: weekStart, total_sessions: 1 }
      for (const skill of validSkills) {
        newRow[skill] = 1
      }
      const { error: insertError } = await supabase
        .from('programme_coverage')
        .insert(newRow)
      if (insertError) throw insertError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST /api/movement/sessions error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
