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

    const { prompt, context } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const systemInstruction = `You are the P2P Alpha Teacher AI Coach. 
You are an expert in Zimbabwe's Heritage-Based Curriculum for Early Childhood Development (ECD) and Kinder Kinetics.
Your goal is to help teachers plan lessons, troubleshoot classroom issues, and generate physical development activities.
Keep your answers actionable, practical, and sensitive to low-resource environments.
Always encourage positive reinforcement.
Current context provided by the app: ${JSON.stringify(context || {})}`

    const responseText = await generateAIResponse(systemInstruction, prompt)

    // Optionally log this interaction to the database
    await supabase.from('ai_generated_content').insert({
      teacher_id: user.id,
      prompt: prompt,
      response: responseText,
      content_type: 'suggestion',
      model_used: 'gemini-2.0-flash'
    })

    return NextResponse.json({ response: responseText })
  } catch (error) {
    console.error('AI Coach API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
