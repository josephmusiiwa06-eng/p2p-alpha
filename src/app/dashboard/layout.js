import { AppLayout } from '@/components/layout/AppLayout'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()
  const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')
  let user = null
  let role = 'school_head'

  if (!isPlaceholder) {
    try {
      const { data } = await supabase.auth.getUser()
      user = data?.user
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile) {
          role = profile.role
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (!user) {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    role = cookieStore.get('preview_role')?.value || 'school_head'
    user = {
      id: 'mock-user-id',
      email: 'preview@school.ac.zw',
      user_metadata: {
        full_name: role === 'school_head' ? 'Principal Sibanda' : 'Mrs. Chipo Ndlovu',
        role: role
      }
    }
  } else {
    user.user_metadata = { ...user.user_metadata, role }
  }

  return <AppLayout user={user}>{children}</AppLayout>
}
