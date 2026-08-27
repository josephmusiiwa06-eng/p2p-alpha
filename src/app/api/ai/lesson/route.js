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

    const { theme, learningArea, classLevel, duration = 30 } = await request.json()

    if (!theme || !learningArea) {
      return NextResponse.json({ error: 'Theme and Learning Area are required' }, { status: 400 })
    }

    const systemInstruction = `You are an expert ECD teacher in Zimbabwe following the Heritage-Based Curriculum.
Generate a practical, low-resource lesson plan in JSON format.
Do NOT use markdown block formatting for the JSON, just return raw JSON so it can be parsed.
Return an object with the following keys:
- "title": String (Lesson title)
- "objectives": String (What learners will achieve)
- "activities": Array of objects [{ name: String, duration: Number, description: String }]
- "resources": Array of Strings (low-resource materials needed)
- "assessment_notes": String (How the teacher should evaluate learning)`

    const prompt = `Create a ${duration}-minute lesson plan for ${classLevel || 'ECD'} learners. 
Theme: ${theme}. Learning Area: ${learningArea}.`

    const responseText = await generateAIResponse(systemInstruction, prompt)
    
    let lessonPlan;
    try {
      // Remove any markdown code blocks if the AI accidentally included them
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      lessonPlan = JSON.parse(cleanJson)
    } catch (e) {
      console.error('Failed to parse AI response as JSON', responseText)
      return NextResponse.json({ error: 'Failed to generate valid lesson plan format' }, { status: 500 })
    }

    await supabase.from('ai_generated_content').insert({
      teacher_id: user.id,
      prompt: prompt,
      response: JSON.stringify(lessonPlan),
      content_type: 'lesson_plan',
      model_used: 'gemini-2.0-flash'
    })

    return NextResponse.json(lessonPlan)
  } catch (error) {
    console.error('AI Lesson API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
