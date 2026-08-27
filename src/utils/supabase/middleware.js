import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')
  let user = null

  if (!isPlaceholder) {
    try {
      const { data } = await supabase.auth.getUser()
      user = data?.user || null
    } catch (e) {
      console.warn('Supabase auth failed, using guest mode')
    }
  }

  const url = request.nextUrl.clone()
  const isAuthRoute = url.pathname.startsWith('/login')
  const isPublicRoute = url.pathname === '/' || url.pathname.startsWith('/api') || url.pathname.startsWith('/_next')

  if (!user && !isPublicRoute && !isAuthRoute && !isPlaceholder) {
    // no user, potentially respond by redirecting the user to the login page
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    // User is already logged in, redirect them based on their role
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
