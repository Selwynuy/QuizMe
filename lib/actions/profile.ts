'use server'

import { createClient } from '@/lib/server'

export type Profile = {
  id: string
  email: string | null
  full_name: string | null
  email_notifications: boolean
  push_notifications: boolean
}

export async function getMyProfile(): Promise<{ data: Profile | null; error: string | null }> {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return { data: null, error: 'Not authenticated' }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.user.id)
    .single()
  if (error && error.code === 'PGRST116') {
    // create default row lazily
    const { data: created, error: insertErr } = await supabase
      .from('profiles')
      .insert({ id: user.user.id, email: user.user.email })
      .select('*')
      .single()
    return { data: (created as any) ?? null, error: insertErr?.message ?? null }
  }
  return { data: (data as any) ?? null, error: error?.message ?? null }
}

export async function updateMyProfile(
  patch: Partial<Profile>,
): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return { ok: false, error: 'Not authenticated' }
  const updates: Record<string, unknown> = {}
  if (patch.full_name !== undefined) updates.full_name = patch.full_name
  if (patch.email_notifications !== undefined)
    updates.email_notifications = patch.email_notifications
  if (patch.push_notifications !== undefined) updates.push_notifications = patch.push_notifications
  const { error } = await supabase.from('profiles').update(updates).eq('id', user.user.id)
  return { ok: !error, error: error?.message ?? null }
}
