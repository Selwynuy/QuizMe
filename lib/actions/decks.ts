'use server'

import { createClient } from '@/lib/server'

export type Deck = {
  id: string
  owner_id: string
  title: string
  description: string | null
  is_public: boolean
  created_at: string
  updated_at: string
}

export async function getMyDecks(): Promise<{ data: Deck[] | null; error: string | null }> {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return { data: [], error: null }
  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .eq('owner_id', user.user.id)
    .order('updated_at', { ascending: false })
  return { data: (data as Deck[]) ?? null, error: error?.message ?? null }
}

export async function getDeckById(
  id: string,
): Promise<{ data: Deck | null; error: string | null }> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('decks').select('*').eq('id', id).single()
  return { data: (data as Deck) ?? null, error: error?.message ?? null }
}

export async function createDeck(input: {
  title: string
  description?: string | null
  is_public?: boolean
  cards?: { front: string; back: string }[]
}): Promise<{ data: Deck | null; error: string | null }> {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return { data: null, error: 'Not authenticated' }
  const payload = {
    owner_id: user.user.id,
    title: input.title.trim(),
    description: input.description ?? null,
    is_public: Boolean(input.is_public),
  }
  const { data, error } = await supabase.from('decks').insert(payload).select('*').single()
  if (error) return { data: null, error: error.message }
  const deck = data as Deck
  if (input.cards && input.cards.length > 0) {
    const rows = input.cards.map((c) => ({ deck_id: deck.id, front: c.front, back: c.back }))
    const { error: cardsError } = await supabase.from('cards').insert(rows)
    if (cardsError)
      return { data: deck, error: `Deck created, but failed to add cards: ${cardsError.message}` }
  }
  return { data: deck, error: null }
}

export async function updateDeck(
  id: string,
  patch: {
    title?: string
    description?: string | null
    is_public?: boolean
  },
): Promise<{ data: Deck | null; error: string | null }> {
  const supabase = await createClient()
  const updates: Record<string, unknown> = {}
  if (patch.title !== undefined) updates.title = patch.title.trim()
  if (patch.description !== undefined) updates.description = patch.description
  if (patch.is_public !== undefined) updates.is_public = patch.is_public
  const { data, error } = await supabase
    .from('decks')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single()
  return { data: (data as Deck) ?? null, error: error?.message ?? null }
}

export async function deleteDeck(id: string): Promise<{ ok: boolean; error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.from('decks').delete().eq('id', id)
  return { ok: !error, error: error?.message ?? null }
}

export async function setDeckPublic(
  id: string,
  isPublic: boolean,
): Promise<{ data: Deck | null; error: string | null }> {
  return updateDeck(id, { is_public: isPublic })
}
