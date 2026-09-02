import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('school_id, campus_id, role')
      .eq('id', user.id)
      .single()

    const { data: lessons, error: lessonsError } = await supabase
      .from('lesson_plans')
      .select('*, classes(name)')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false })

    if (lessonsError) throw lessonsError

    let classesQuery = supabase.from('classes').select('id, name, level')
    if (profile?.role === 'teacher') {
      classesQuery = classesQuery.eq('teacher_id', user.id)
    } else if (profile?.school_id) {
      classesQuery = classesQuery.eq('school_id', profile.school_id)
    }
    const { data: classes, error: classesError } = await classesQuery
    if (classesError) throw classesError

    return NextResponse.json({ lessons: lessons || [], classes: classes || [] })
  } catch (error) {
    console.error('GET /api/lessons error:', error)
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
      class_id, title, objectives, activities, resources,
      assessment_notes, duration_minutes, learning_area_name, status,
    } = body

    if (!class_id || !title) {
      return NextResponse.json({ error: 'class_id and title are required' }, { status: 400 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('school_id')
      .eq('id', user.id)
      .single()

    let learning_area_id = null
    if (learning_area_name && profile?.school_id) {
      const { data: match } = await supabase
        .from('learning_areas')
        .select('id')
        .eq('school_id', profile.school_id)
        .ilike('name', learning_area_name)
        .maybeSingle()
      learning_area_id = match?.id || null
    }

    const { data: inserted, error: insertError } = await supabase
      .from('lesson_plans')
      .insert({
        teacher_id: user.id,
        class_id,
        learning_area_id,
        title,
        objectives: objectives || '',
        activities: activities || [],
        resources: resources || [],
        assessment_notes: assessment_notes || '',
        duration_minutes: duration_minutes || 30,
        status: status || 'draft',
      })
      .select('*, classes(name)')
      .single()

    if (insertError) throw insertError

    return NextResponse.json(inserted)
  } catch (error) {
    console.error('POST /api/lessons error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
