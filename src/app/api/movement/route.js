import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const SKILL_KEYS = ['running', 'jumping', 'balance', 'throwing', 'catching', 'coordination', 'fine_motor', 'rhythm']
const SKILL_META = {
  running:      { emoji: '🏃', name: 'Running',      colour: 'orange' },
  jumping:      { emoji: '🦘', name: 'Jumping',      colour: 'blue' },
  balance:      { emoji: '⚖️', name: 'Balance',      colour: 'green' },
  catching:     { emoji: '🏀', name: 'Catching',     colour: 'pink' },
  throwing:     { emoji: '🎯', name: 'Throwing',     colour: 'purple' },
  rhythm:       { emoji: '🎵', name: 'Rhythm',       colour: 'yellow' },
  coordination: { emoji: '🤝', name: 'Coordination', colour: 'orange' },
  fine_motor:   { emoji: '✏️', name: 'Fine Motor',   colour: 'green' },
}
const TARGET_PER_SKILL = 5

function getMonday(d = new Date()) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  return date.toISOString().slice(0, 10)
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('school_id, role')
      .eq('id', user.id)
      .single()

    let classesQuery = supabase.from('classes').select('id, name, level')
    if (profile?.role === 'teacher') {
      classesQuery = classesQuery.eq('teacher_id', user.id)
    } else if (profile?.school_id) {
      classesQuery = classesQuery.eq('school_id', profile.school_id)
    }
    const { data: classes, error: classesError } = await classesQuery
    if (classesError) throw classesError

    const classIds = (classes || []).map(c => c.id)
    const weekStart = getMonday()

    let coverage = []
    if (classIds.length > 0) {
      const { data, error } = await supabase
        .from('programme_coverage')
        .select('*')
        .in('class_id', classIds)
        .eq('week_start', weekStart)
      if (error) throw error
      coverage = data || []
    }

    const classById = Object.fromEntries((classes || []).map(c => [c.id, c.name]))

    const skills = SKILL_KEYS.map(key => {
      const meta = SKILL_META[key]
      let sessions = 0
      const classNames = []
      for (const row of coverage) {
        const val = row[key] || 0
        sessions += val
        if (val > 0 && classById[row.class_id]) classNames.push(classById[row.class_id])
      }
      return {
        key, emoji: meta.emoji, name: meta.name, colour: meta.colour,
        sessions, target: TARGET_PER_SKILL, classes: classNames,
      }
    })

    return NextResponse.json({ skills, classes: classes || [], weekStart })
  } catch (error) {
    console.error('GET /api/movement error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
