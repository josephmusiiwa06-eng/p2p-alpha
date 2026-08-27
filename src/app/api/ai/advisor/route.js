import { NextResponse } from 'next/server'
import { generateAIResponse } from '@/utils/ai/gemini'
import { createClient } from '@/utils/supabase/server'

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, schoolStats } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const systemInstruction = `You are the P2P Alpha School Advisor for School Heads.
Your goal is to analyze school data, identify trends, and provide actionable leadership advice.
You understand the operational constraints of ECD schools in Zimbabwe and the importance of the Heritage-Based Curriculum and Movement Programmes.
Current school statistics provided by the dashboard: ${JSON.stringify(schoolStats || {})}`

    const responseText = await generateAIResponse(systemInstruction, prompt)

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error('AI Advisor API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
