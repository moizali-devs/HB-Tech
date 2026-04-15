// Admin authentication middleware.
// Runs on every request except static assets and API routes (see matcher below).
//
// Two-tier auth check:
//   1. Supabase session -- ensures the user is signed in.
//   2. Admins table check -- ensures the signed-in user is in our admins table.
//      A valid Supabase session alone is not enough; the user must also exist
//      in the admins table. This prevents regular Supabase users from accessing
//      the panel if they somehow obtain credentials.

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  // Build a response object first so we can attach updated cookies to it.
  // @supabase/ssr needs this to refresh the session token automatically.
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = request.nextUrl

  // /login is the only public route. Redirect authenticated users to dashboard.
  if (pathname === '/login') {
    if (session) return NextResponse.redirect(new URL('/dashboard', request.url))
    return response
  }

  // No session -- redirect to login without further DB queries.
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Session exists -- verify the user is in the admins table.
  const { data: admin } = await supabase
    .from('admins')
    .select('id')
    .eq('id', session.user.id)
    .single()

  if (!admin) {
    // Sign the user out so the invalid session cookie is cleared.
    await supabase.auth.signOut()
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('reason', 'not_admin')
    const redirectRes = NextResponse.redirect(loginUrl)
    // Copy cookie updates from the signOut call onto the redirect response,
    // otherwise the browser never learns the session was cleared.
    response.cookies.getAll().forEach((c) => redirectRes.cookies.set(c.name, c.value, c))
    return redirectRes
  }

  return response
}

export const config = {
  // Exclude Next.js internals, static files, and API routes from the middleware.
  // API routes have their own auth via the service-role client.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
