import { createClient } from '@/utils/supabase/server'
import { HeadDashboard } from '@/components/dashboard/HeadDashboard'
import { TeacherDashboard } from '@/components/dashboard/TeacherDashboard'
import { Greeting } from '@/components/ui/Greeting'
export default async function DashboardPage() {
  const supabase = await createClient()
  const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')
  let user = null
  let profile = null

  if (!isPlaceholder) {
    try {
      const { data } = await supabase.auth.getUser()
      user = data?.user
      if (user) {
        const { data: p } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        profile = p
      }
    } catch (e) {
      // ignore
    }
  }

  if (!user) {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const role = cookieStore.get('preview_role')?.value || 'school_head'
    profile = {
      role,
      full_name: role === 'school_head' ? 'Principal Sibanda' : 'Mrs. Chipo Ndlovu'
    }
    user = {
      id: 'mock-user-id',
      email: 'preview@school.ac.zw',
      user_metadata: profile
    }
  }

  const fullUser = { ...user, user_metadata: { ...user.user_metadata, ...profile } }
  const role = profile?.role || 'school_head'

  return (
    <div>
      <Greeting user={fullUser} />
      {role === 'school_head' ? (
        <HeadDashboard user={fullUser} />
      ) : (
        <TeacherDashboard user={fullUser} />
      )}
    </div>
  )
}
