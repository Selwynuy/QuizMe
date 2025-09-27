import { NextResponse, type NextRequest } from 'next/server'
import { SessionManager } from '@/lib/session'

export async function authMiddleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  // Get session token from cookie
  const sessionToken = request.cookies.get('session_token')?.value

  if (!sessionToken) {
    // No session token, redirect to login if accessing protected route
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return redirectToLogin(request)
    }
    return response
  }

  // Validate session
  try {
    const session = await SessionManager.getSession(sessionToken)

    if (!session) {
      // Invalid or expired session, clear cookie and redirect
      response.cookies.delete('session_token')
      if (isProtectedRoute(request.nextUrl.pathname)) {
        return redirectToLogin(request)
      }
      return response
    }

    // Valid session - add user info to headers for downstream use
    response.headers.set('x-user-id', session.user_id)
  } catch (error) {
    console.error('Session validation error:', error)
    // If session validation fails (e.g., database not ready), fall back to standard auth
    // Don't redirect to login, let the request continue
  }

  return response
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/dashboard', '/decks', '/study', '/profile', '/protected']

  return protectedRoutes.some((route) => pathname.startsWith(route))
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/auth/login'
  return NextResponse.redirect(url)
}
