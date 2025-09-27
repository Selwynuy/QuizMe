import { NextResponse } from 'next/server'
import { createClient } from '@/lib/server'

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export async function GET() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const since = new Date(Date.now() - 7 * 86400000).toISOString()
  const { data: last7 } = await supabase
    .from('reviews')
    .select('grade, reviewed_at')
    .eq('user_id', user.user.id)
    .gte('reviewed_at', since)

  const total = last7?.length ?? 0
  const correct = (last7 || []).filter((r: any) => Number(r.grade) >= 2).length
  const accuracy = total ? Math.round((correct / total) * 100) : 0

  // streak: consecutive days with at least one review ending today
  const days = new Map<string, number>()
  ;(last7 || []).forEach((r: any) => {
    const d = startOfDay(new Date(r.reviewed_at)).toISOString()
    days.set(d, (days.get(d) || 0) + 1)
  })
  let streak = 0
  for (let i = 0; i < 7; i++) {
    const d = startOfDay(new Date(Date.now() - i * 86400000)).toISOString()
    if ((i === 0 || streak > 0) && days.get(d)) streak++
    else if (i !== 0) break
  }

  return NextResponse.json({ totalReviews7d: total, accuracy, streak })
}
