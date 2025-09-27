import { NextResponse } from 'next/server'
import { createClient } from '@/lib/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const deckId = searchParams.get('deckId')
  const q = searchParams.get('q')?.trim()
  const sort = searchParams.get('sort') || 'created_at'
  if (!deckId) return NextResponse.json({ error: 'deckId required' }, { status: 400 })
  let query = supabase.from('cards').select('*').eq('deck_id', deckId)
  if (q && q.length > 0) {
    // simple text match on front or back
    query = query.or(`front.ilike.%${q}%,back.ilike.%${q}%`)
  }
  const orderColumn = ['created_at', 'updated_at'].includes(sort) ? sort : 'created_at'
  const { data, error } = await query.order(orderColumn as any, { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ cards: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = (await request.json().catch(() => null)) as {
    deckId: string
    front: string
    back: string
  } | null
  if (!body?.deckId || !body?.front || !body?.back)
    return NextResponse.json({ error: 'deckId, front, back required' }, { status: 400 })
  const { data, error } = await supabase
    .from('cards')
    .insert({ deck_id: body.deckId, front: body.front, back: body.back })
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ card: data })
}
