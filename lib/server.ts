import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SessionManager } from '@/lib/session'

/**
 * If using Fluid compute: Don't put this client in a global variable. Always create a new client within each
 * function when using it.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Skip setting large cookies - we now use server-side sessions
              if (value && value.length > 1000) {
                console.warn(
                  `Skipping large cookie in server: ${name} (${value.length} chars) - using server-side sessions`,
                )
                return
              }

              cookieStore.set(name, value, {
                ...options,
                maxAge: 60 * 60 * 24 * 7, // 7 days
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
              })
            })
          } catch (error) {
            console.error('Failed to set cookies in server component:', error)
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}

/**
 * Get current user from session token
 */
export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session_token')?.value

  if (!sessionToken) {
    return null
  }

  const session = await SessionManager.getSession(sessionToken)
  return session ? { id: session.user_id } : null
}
