import { Footer } from '@/components/footer'
import { ProgressDashboard } from '@/components/progress-dashboard'
import { UserGreeting } from '@/components/user-greeting'
import { DeckList } from '@/components/deck-list'
import { createClient } from '@/lib/server'
import { Card } from '@/components/ui/card'
import { Flame } from 'lucide-react'
export default async function Dashboard() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  const userId = user.user?.id || ''
  const { data: decks } = await supabase
    .from('decks')
    .select('id, title, description')
    .eq('owner_id', userId)

  // Per-deck card counts
  const { data: cardCounts } = await supabase
    .from('cards')
    .select('deck_id, id')
    .in(
      'deck_id',
      (decks || []).map((d: any) => d.id),
    )

  const deckIdToCardCount: Record<string, number> = {}
  ;(cardCounts || []).forEach((c: any) => {
    deckIdToCardCount[c.deck_id] = (deckIdToCardCount[c.deck_id] || 0) + 1
  })

  // Per-deck last reviewed by this user
  const { data: lastReviews } = await supabase
    .from('reviews')
    .select('deck_id, reviewed_at')
    .eq('user_id', userId)
    .in(
      'deck_id',
      (decks || []).map((d: any) => d.id),
    )
    .order('reviewed_at', { ascending: false })

  const deckIdToLastReviewed: Record<string, string> = {}
  ;(lastReviews || []).forEach((r: any) => {
    if (!deckIdToLastReviewed[r.deck_id]) deckIdToLastReviewed[r.deck_id] = r.reviewed_at
  })

  const decksWithMeta = (decks || []).map((d: any) => ({
    ...d,
    cardsCount: deckIdToCardCount[d.id] || 0,
    lastReviewedAt: deckIdToLastReviewed[d.id] || null,
  }))

  // Recent activity (static fallback if none)
  const { data: recentReviews } = await supabase
    .from('reviews')
    .select('deck_id, reviewed_at, grade')
    .eq('user_id', userId)
    .order('reviewed_at', { ascending: false })
    .limit(3)

  const { data: recentCards } = await supabase
    .from('cards')
    .select('deck_id, created_at')
    .in(
      'deck_id',
      (decks || []).map((d: any) => d.id),
    )
    .order('created_at', { ascending: false })
    .limit(3)
  return (
    <>
      <main className="mx-auto max-w-6xl px-6 py-10 grid gap-8">
        <section className="rounded-xl border bg-gradient-to-r from-blue-50 to-purple-50 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <UserGreeting name={user.user?.email} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-[--color-text-secondary]">
            <Flame className="h-4 w-4 text-red-500" />
            Keep it up! Your next review is waiting.
          </div>
        </section>

        <ProgressDashboard />

        <DeckList decks={(decksWithMeta as any[]) || []} />

        <section>
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <Card className="p-5">
            <ul className="space-y-2 text-sm text-[--color-text-secondary]">
              {(recentReviews && recentReviews.length > 0) ||
              (recentCards && recentCards.length > 0) ? (
                <>
                  {(recentReviews || []).map((r: any, idx: number) => (
                    <li key={`rev-${idx}`}>
                      Reviewed a deck{' '}
                      <span className="text-xs">{new Date(r.reviewed_at).toLocaleString()}</span>
                    </li>
                  ))}
                  {(recentCards || []).map((c: any, idx: number) => (
                    <li key={`add-${idx}`}>
                      Added cards{' '}
                      <span className="text-xs">{new Date(c.created_at).toLocaleString()}</span>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  <li>
                    Studied: <span className="font-medium text-[--color-text]">First Deck</span>{' '}
                    <span className="text-xs">30m ago</span>
                  </li>
                  <li>
                    Added <span className="font-medium text-[--color-text]">5 cards</span> to{' '}
                    <span className="font-medium text-[--color-text]">Biology</span>
                  </li>
                  <li>
                    Reviewed <span className="font-medium text-[--color-text]">12 cards</span> —{' '}
                    <span className="font-medium text-green-600">92% accuracy</span>
                  </li>
                </>
              )}
            </ul>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  )
}
