import { NextResponse } from 'next/server'
import { createClient } from '@/lib/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const deckId = searchParams.get('deckId')
  const exclude = searchParams.get('exclude')
  if (!deckId) return NextResponse.json({ error: 'deckId required' }, { status: 400 })
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let card

  // 1) due cards excluding current
  {
    const { data: due } = await supabase
      .from('reviews')
      .select('card_id, due_at')
      .eq('user_id', user.user.id)
      .eq('deck_id', deckId)
      .lt('due_at', new Date().toISOString())
      .order('due_at', { ascending: true })
      .limit(10)
    const candidate = (due || []).find((d) => !exclude || d.card_id !== exclude)
    if (candidate) {
      const { data } = await supabase.from('cards').select('*').eq('id', candidate.card_id).single()
      card = data
    }
  }

  // 2) unseen (no reviews by anyone) excluding current
  if (!card) {
    const { data: unseen } = await supabase
      .from('cards')
      .select('id, front, back, deck_id, created_at, updated_at, reviews!left(id)')
      .eq('deck_id', deckId)
      .is('reviews.id', null)
      .order('created_at', { ascending: true })
      .limit(10)
    const candidate = (unseen || []).find((c) => !exclude || c.id !== exclude)
    if (candidate) {
      const { data } = await supabase.from('cards').select('*').eq('id', candidate.id).single()
      card = data
    }
  }

  // 3) soonest upcoming for this user excluding current
  if (!card) {
    const { data: upcoming } = await supabase
      .from('reviews')
      .select('card_id, due_at')
      .eq('user_id', user.user.id)
      .eq('deck_id', deckId)
      .order('due_at', { ascending: true })
      .limit(10)
    const candidate = (upcoming || []).find((u) => !exclude || u.card_id !== exclude)
    if (candidate) {
      const { data } = await supabase.from('cards').select('*').eq('id', candidate.card_id).single()
      card = data
    }
  }

  if (!card) return NextResponse.json({ card: null })
  return NextResponse.json({ card })
}
