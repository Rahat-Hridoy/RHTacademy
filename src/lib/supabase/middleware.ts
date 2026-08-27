import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isPortalRoute = request.nextUrl.pathname.startsWith('/portal')

  // If user is not logged in and tries to access protected routes, redirect to login
  if (!user && isAdminRoute && request.nextUrl.pathname !== '/admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  if (!user && isPortalRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // If user is logged in
  if (user) {
    // Check if they are trying to access auth or admin login pages
    if (isAuthRoute || request.nextUrl.pathname === '/admin') {
      // Need to fetch profile role to redirect correctly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_approved')
        .eq('id', user.id)
        .single()
        
      if (profile?.role === 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
      } else if (profile?.is_approved) {
        const url = request.nextUrl.clone()
        url.pathname = `/portal/${user.id}`
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
