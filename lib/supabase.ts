import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

// --- Types ---
export type School = {
  id: string
  name: string
  location: string | null
  contact_email: string | null
  created_at: string
}

export type Child = {
  id: string
  school_id: string
  full_name: string
  date_of_birth: string
  gender: 'male' | 'female' | 'other'
  unique_code: string
  notes: string | null
  created_at: string
  schools?: School
}

export type AssessmentResult = {
  id: string
  assessment_id: string
  test_name: 'balance' | 'shuttle_run' | 'throw_catch' | 'jump'
  raw_value: number
  unit: string
  score_points: number
  rating: 'Good' | 'Average' | 'Needs work'
}

export type Assessment = {
  id: string
  child_id: string
  coach_id: string | null
  assessed_on: string
  session_label: string | null
  motor_score: number
  overall_rating: 'Excellent' | 'Good' | 'Average' | 'Needs Support'
  created_at: string
  assessment_results?: AssessmentResult[]
  children?: Child
}

// --- Scoring Engine ---
const STANDARDS: Record<string, Record<number, [number, number]>> = {
  balance:    { 3:[4,8],  4:[6,11], 5:[8,14],  6:[10,18], 7:[12,22] },
  shuttle_run:{ 3:[13,16],4:[11,14],5:[9,12],  6:[8,10],  7:[7,9]   },
  throw_catch:{ 3:[2,5],  4:[4,7],  5:[5,8],   6:[6,9],   7:[7,10]  },
  jump:       { 3:[45,65],4:[60,80],5:[75,95],  6:[90,115],7:[105,130]},
}

export function rateTest(
  test: string, value: number, age: number
): { rating: 'Good' | 'Average' | 'Needs work'; points: number } {
  const age_key = Math.min(7, Math.max(3, age))
  const [avg, good] = STANDARDS[test]?.[age_key] ?? [0, 0]
  const isLower = test === 'shuttle_run'
  if (isLower) {
    if (value <= good) return { rating: 'Good', points: 3 }
    if (value <= avg)  return { rating: 'Average', points: 2 }
    return { rating: 'Needs work', points: 1 }
  } else {
    if (value >= good) return { rating: 'Good', points: 3 }
    if (value >= avg)  return { rating: 'Average', points: 2 }
    return { rating: 'Needs work', points: 1 }
  }
}

export function calcMotorScore(points: number[]): {
  score: number
  grade: 'Excellent' | 'Good' | 'Average' | 'Needs Support'
} {
  if (!points.length) return { score: 0, grade: 'Average' }
  const avg = points.reduce((a, b) => a + b, 0) / points.length
  // map 1–3 scale to 0–100
  const score = Math.round(((avg - 1) / 2) * 60 + 40)
  const grade =
    score >= 85 ? 'Excellent' :
    score >= 70 ? 'Good' :
    score >= 55 ? 'Average' : 'Needs Support'
  return { score, grade }
}

export function getAge(dob: string): number {
  const birth = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) age--
  return age
}
