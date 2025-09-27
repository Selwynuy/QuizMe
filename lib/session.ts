import { createClient } from '@/lib/server'
import { randomBytes } from 'crypto'

export interface SessionData {
  user_id: string
  oauth_data?: any
  expires_at: Date
}

export class SessionManager {
  private static readonly SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in ms

  static generateSessionToken(): string {
    return randomBytes(32).toString('hex')
  }

  static async createSession(userId: string, oauthData?: any): Promise<string> {
    const supabase = await createClient()
    const sessionToken = this.generateSessionToken()
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION)

    const { error } = await supabase.from('user_sessions').insert({
      user_id: userId,
      session_token: sessionToken,
      oauth_data: oauthData,
      expires_at: expiresAt.toISOString(),
    })

    if (error) {
      console.error('Failed to create session:', error)
      throw new Error('Failed to create session')
    }

    return sessionToken
  }

  static async getSession(sessionToken: string): Promise<SessionData | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('user_sessions')
      .select('user_id, oauth_data, expires_at')
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return null
    }

    return {
      user_id: data.user_id,
      oauth_data: data.oauth_data,
      expires_at: new Date(data.expires_at),
    }
  }

  static async updateSession(sessionToken: string, oauthData?: any): Promise<void> {
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION)

    const { error } = await supabase
      .from('user_sessions')
      .update({
        oauth_data: oauthData,
        expires_at: expiresAt.toISOString(),
      })
      .eq('session_token', sessionToken)

    if (error) {
      console.error('Failed to update session:', error)
    }
  }

  static async deleteSession(sessionToken: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .eq('session_token', sessionToken)

    if (error) {
      console.error('Failed to delete session:', error)
    }
  }

  static async cleanupExpiredSessions(): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from('user_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString())

    if (error) {
      console.error('Failed to cleanup expired sessions:', error)
    }
  }
}
