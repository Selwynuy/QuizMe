import { NextResponse } from 'next/server'
import { createClient } from '@/lib/server'
import { computeNextReview } from '@/lib/srs'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await request.json().catch(() => null)) as {
    deckId: string
    cardId: string
    grade: 0 | 1 | 2 | 3
  } | null
  if (!body?.deckId || !body?.cardId)
    return NextResponse.json({ error: 'deckId and cardId required' }, { status: 400 })

  // get last review for this card
  const { data: last } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', user.user.id)
    .eq('card_id', body.cardId)
    .order('reviewed_at', { ascending: false })
    .limit(1)

  const prev = last && last.length > 0 ? last[0] : { interval_days: 0, ease_factor: 2.5 }
  const next = computeNextReview(
    prev.interval_days || 0,
    Number(prev.ease_factor) || 2.5,
    body.grade,
  )
  const dueAt = body.grade === 0 ? new Date() : new Date(Date.now() + next.intervalDays * 86400000)

  const { error } = await supabase.from('reviews').insert({
    user_id: user.user.id,
    deck_id: body.deckId,
    card_id: body.cardId,
    grade: body.grade,
    ease_factor: next.ease,
    interval_days: next.intervalDays,
    due_at: dueAt.toISOString(),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, nextDueAt: dueAt.toISOString(), ease: next.ease })
}
