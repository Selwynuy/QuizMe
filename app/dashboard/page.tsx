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
  const { data: decks } = await supabase
    .from('decks')
    .select('id, title, description')
    .eq('owner_id', user.user?.id || '')
  return (
    <>
      <main className="mx-auto max-w-6xl px-6 py-10 grid gap-8">
        <section className="rounded-xl border bg-gradient-to-r from-blue-50 to-purple-50 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <UserGreeting name={user.user?.email} />
            </div>
            <a
              className="rounded-md bg-[--color-accent] px-4 py-2 text-white h-10"
              href="/decks/new"
            >
              Create Deck
            </a>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-[--color-text-secondary]">
            <Flame className="h-4 w-4 text-red-500" />
            Keep it up! Your next review is waiting.
          </div>
        </section>

        <ProgressDashboard />

        <DeckList decks={(decks as any[]) || []} />

        <section>
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <Card className="p-5">
            <ul className="space-y-2 text-sm text-[--color-text-secondary]">
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
            </ul>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  )
}
