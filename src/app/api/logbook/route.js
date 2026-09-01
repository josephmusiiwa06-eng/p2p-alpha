import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: entries, error: entriesError } = await supabase
      .from('logbook_entries')
      .select('*, lesson_plans(title), classes(name)')
      .eq('teacher_id', user.id)
      .order('completed_at', { ascending: false })
    if (entriesError) throw entriesError

    const { data: readyLessons, error: lessonsError } = await supabase
      .from('lesson_plans')
      .select('id, title, class_id, classes(name)')
      .eq('teacher_id', user.id)
      .eq('status', 'ready')
      .order('created_at', { ascending: false })
    if (lessonsError) throw lessonsError

    return NextResponse.json({ entries: entries || [], readyLessons: readyLessons || [] })
  } catch (error) {
    console.error('GET /api/logbook error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      lesson_plan_id, class_id, reflection_worked,
      reflection_difficult, reflection_change, participation_level, notes,
    } = body

    if (!lesson_plan_id || !class_id) {
      return NextResponse.json({ error: 'lesson_plan_id and class_id are required' }, { status: 400 })
    }

    const { data: entry, error: insertError } = await supabase
      .from('logbook_entries')
      .insert({
        lesson_plan_id,
        class_id,
        teacher_id: user.id,
        reflection_worked: reflection_worked || '',
        reflection_difficult: reflection_difficult || '',
        reflection_change: reflection_change || '',
        participation_level: participation_level ? participation_level : null,
        notes: notes || '',
      })
      .select('*, lesson_plans(title), classes(name)')
      .single()
    if (insertError) throw insertError

    const { error: updateError } = await supabase
      .from('lesson_plans')
      .update({ status: 'delivered', updated_at: new Date().toISOString() })
      .eq('id', lesson_plan_id)
      .eq('teacher_id', user.id)
    if (updateError) throw updateError

    return NextResponse.json(entry)
  } catch (error) {
    console.error('POST /api/logbook error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
