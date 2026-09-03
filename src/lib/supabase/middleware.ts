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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname.startsWith('/auth')
  // Exact /admin path is the public login page — not a protected route
  const isAdminLoginPage = pathname === '/admin'
  const isAdminDashboardRoute = pathname.startsWith('/admin/dashboard')
  const isPortalRoute = pathname.startsWith('/portal')

  // Guard protected admin dashboard routes — redirect to login if not authenticated
  if (!user && isAdminDashboardRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  // Guard student portal routes
  if (!user && isPortalRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // If a logged-in user visits a login/auth page, redirect them to the right place.
  // Use user_metadata.role (stored in JWT) to avoid an extra DB round-trip on every
  // request. Only fall back to the DB if the metadata hasn't been stamped yet.
  if (user && (isAuthRoute || isAdminLoginPage)) {
    const metaRole = user.user_metadata?.role as string | undefined
    const metaApproved = user.user_metadata?.is_approved as boolean | undefined

    if (metaRole === 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }

    if (metaRole === 'student' && metaApproved) {
      const url = request.nextUrl.clone()
      url.pathname = `/portal/${user.id}/dashboard`
      return NextResponse.redirect(url)
    }

    // Fallback: metadata not stamped yet — fetch from DB once
    if (!metaRole) {
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
        url.pathname = `/portal/${user.id}/dashboard`
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
