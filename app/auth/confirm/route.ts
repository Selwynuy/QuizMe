import { createClient } from '@/lib/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { SessionManager } from '@/lib/session'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const _next = searchParams.get('next')
  const next = _next?.startsWith('/') ? _next : '/dashboard'

  if (token_hash && type) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error && data.user && data.session) {
      try {
        // Create server-side session with the OAuth data
        const sessionToken = await SessionManager.createSession(data.user.id, data.session)

        // Create redirect response with session cookie
        const response = new Response(null, {
          status: 302,
          headers: {
            Location: next,
            'Set-Cookie': `session_token=${sessionToken}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}; Path=/`,
          },
        })

        return response
      } catch (sessionError) {
        console.error('Session creation error:', sessionError)
        redirect(`/auth/error?error=${encodeURIComponent('Failed to create session')}`)
      }
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/auth/error?error=${error?.message || 'Authentication failed'}`)
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/auth/error?error=${encodeURIComponent('No token hash or type')}`)
}
