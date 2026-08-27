import { redirect } from 'next/navigation'

export default function Home() {
  const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')
  
  if (isPlaceholder) {
    redirect('/dashboard')
  }
  
  redirect('/login')
}
