'use server'

import { createClient } from '@/lib/server'

export type Card = {
  id: string
  deck_id: string
  front: string
  back: string
  hint: string | null
  image_url: string | null
  audio_url: string | null
  created_at: string
  updated_at: string
}

export async function getCards(
  deckId: string,
): Promise<{ data: Card[] | null; error: string | null }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at', { ascending: true })
  return { data: (data as Card[]) ?? null, error: error?.message ?? null }
}

export async function createCard(input: {
  deckId: string
  front: string
  back: string
  hint?: string | null
  imageUrl?: string | null
  audioUrl?: string | null
}): Promise<{ data: Card | null; error: string | null }> {
  const supabase = await createClient()
  const payload = {
    deck_id: input.deckId,
    front: input.front.trim(),
    back: input.back.trim(),
    hint: input.hint ?? null,
    image_url: input.imageUrl ?? null,
    audio_url: input.audioUrl ?? null,
  }
  const { data, error } = await supabase.from('cards').insert(payload).select('*').single()
  return { data: (data as Card) ?? null, error: error?.message ?? null }
}

export async function updateCard(
  id: string,
  patch: Partial<Omit<Card, 'id' | 'created_at' | 'updated_at'>>,
): Promise<{ data: Card | null; error: string | null }> {
  const supabase = await createClient()
  const updates: Record<string, unknown> = {}
  if (patch.front !== undefined) updates.front = patch.front.trim()
  if (patch.back !== undefined) updates.back = patch.back.trim()
  if (patch.hint !== undefined) updates.hint = patch.hint
  if (patch.image_url !== undefined) updates.image_url = patch.image_url
  if (patch.audio_url !== undefined) updates.audio_url = patch.audio_url
  const { data, error } = await supabase
    .from('cards')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()
  return { data: (data as Card) ?? null, error: error?.message ?? null }
}

export async function deleteCard(id: string): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.from('cards').delete().eq('id', id)
  return { ok: !error, error: error?.message ?? null }
}
