import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/server'
import { SessionManager } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get the current user from Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get the full OAuth data from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Create server-side session
    const sessionToken = await SessionManager.createSession(
      user.id,
      session, // Store the full OAuth data server-side
    )

    // Set a small session cookie (just the token)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    })

    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session_token')?.value

    if (sessionToken) {
      await SessionManager.deleteSession(sessionToken)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete('session_token')

    return response
  } catch (error) {
    console.error('Session deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 })
  }
}
