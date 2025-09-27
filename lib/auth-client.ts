import { createClient } from '@/lib/client'

export class AuthClient {
  private static instance: AuthClient
  private supabase = createClient()

  static getInstance(): AuthClient {
    if (!AuthClient.instance) {
      AuthClient.instance = new AuthClient()
    }
    return AuthClient.instance
  }

  async signInWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: 'select_account' },
      },
    })

    if (error) {
      throw error
    }
  }

  async signOut() {
    // Delete server-side session
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to delete server session:', error)
    }

    // Sign out from Supabase
    const { error } = await this.supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser()
    if (error) {
      throw error
    }
    return user
  }

  async createServerSession() {
    const response = await fetch('/api/auth/session', { method: 'POST' })
    if (!response.ok) {
      throw new Error('Failed to create server session')
    }
    return response.json()
  }

  onAuthStateChange(callback: (user: any) => void) {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Create server-side session when user signs in
        this.createServerSession().catch(console.error)
      }
      callback(session?.user || null)
    })
  }
}
