import { Footer } from '@/components/footer'
import { ProgressDashboard } from '@/components/progress-dashboard'
import { UserGreeting } from '@/components/user-greeting'
import { DeckList } from '@/components/deck-list'
import { createClient } from '@/lib/server'
import { Card } from '@/components/ui/card'
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
        <div className="flex items-start justify-between gap-4">
          <UserGreeting name={user.user?.email} />
          <a className="rounded-md bg-[--color-accent] px-4 py-2 text-white h-10" href="/decks/new">
            Create Deck
          </a>
        </div>

        <ProgressDashboard />

        <DeckList decks={(decks as any[]) || []} />

        <section>
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <Card className="p-5 text-sm text-[--color-text-secondary]">
            Coming soon: recently studied decks, cards added, and suggestions.
          </Card>
        </section>
      </main>
      <Footer />
    </>
  )
}
