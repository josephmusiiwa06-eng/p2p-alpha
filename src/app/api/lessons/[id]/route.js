import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const allowedFields = ['title', 'objectives', 'activities', 'resources', 'assessment_notes', 'duration_minutes', 'status', 'scheduled_date']
    const updates = {}
    for (const key of allowedFields) {
      if (key in body) updates[key] = body[key]
    }
    updates.updated_at = new Date().toISOString()

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('lesson_plans')
      .update(updates)
      .eq('id', id)
      .eq('teacher_id', user.id)
      .select('*, classes(name)')
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('PATCH /api/lessons/[id] error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
