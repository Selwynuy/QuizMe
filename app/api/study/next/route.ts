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

  // Get all cards in the deck
  const { data: allCards } = await supabase
    .from('cards')
    .select('*')
    .eq('deck_id', deckId)
    .order('created_at', { ascending: true })

  if (!allCards || allCards.length === 0) {
    return NextResponse.json({ card: null, debug: { totalCards: 0 } })
  }

  // Simple approach: just exclude the current card
  const availableCards = allCards.filter((c) => !exclude || c.id !== exclude)

  // Debug info
  console.log(`Deck ${deckId} has ${allCards.length} cards total`)
  if (exclude) {
    console.log(`Excluding card ${exclude}`)
  }

  // 1) due cards
  {
    const { data: due } = await supabase
      .from('reviews')
      .select('card_id, due_at')
      .eq('user_id', user.user.id)
      .eq('deck_id', deckId)
      .lt('due_at', new Date().toISOString())
      .order('due_at', { ascending: true })

    const dueCardIds = (due || []).map((d) => d.card_id)
    const dueCards = availableCards.filter((c) => dueCardIds.includes(c.id))
    if (dueCards.length > 0) {
      card = dueCards[0]
    }
  }

  // 2) unseen (no reviews by this user)
  if (!card) {
    const { data: reviewedCards } = await supabase
      .from('reviews')
      .select('card_id')
      .eq('user_id', user.user.id)
      .eq('deck_id', deckId)

    const reviewedCardIds = (reviewedCards || []).map((r) => r.card_id)
    const unseenCards = availableCards.filter((c) => !reviewedCardIds.includes(c.id))
    if (unseenCards.length > 0) {
      card = unseenCards[0]
    }
  }

  // 3) any remaining available cards
  if (!card && availableCards.length > 0) {
    card = availableCards[0]
  }

  if (!card) return NextResponse.json({ card: null })
  return NextResponse.json({ card })
}
