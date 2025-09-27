import { Footer } from '@/components/footer'
import { ProgressDashboard } from '@/components/progress-dashboard'
import { UserGreeting } from '@/components/user-greeting'
import { DeckList } from '@/components/deck-list'
import { createClient } from '@/lib/server'
export default async function Dashboard() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  const { data: decks } = await supabase
    .from('decks')
    .select('id, title, description')
    .eq('owner_id', user.user?.id || '')
  return (
    <>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <UserGreeting name={user.user?.email} />
          <a className="rounded-md bg-[--color-accent] px-4 py-2 text-white" href="/decks/new">
            Create Deck
          </a>
        </div>

        <ProgressDashboard />

        <DeckList decks={(decks as any[]) || []} />
      </main>
      <Footer />
    </>
  )
}
