import { Footer } from '@/components/footer'
import { setDeckPublic, getDeckById } from '@/lib/actions/decks'
import { Button } from '@/components/ui/button'
import { ShareButton } from '@/components/share-button'
import { CardList } from '@/components/card-list'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/server'
import { CardSearchAndList } from '@/components/card-search-and-list'
import { Pencil, Globe2, Lock } from 'lucide-react'
type Props = { params: Promise<{ id: string }> }

export default async function DeckDetailPage({ params }: Props) {
  const { id } = await params
  return (
    <>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <DeckHeader id={id} />

        <StudyActionsBar id={id} />

        <ProgressOverview id={id} />

        <CardSearchAndList deckId={id} />

        <MobileStickyActions id={id} />
      </main>
      <Footer />
    </>
  )
}

async function DeckHeader({ id }: { id: string }) {
  const { data: deck } = await getDeckById(id)
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/decks/${id}`
  const supabase = await createClient()
  const { count: totalCards } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('deck_id', id)
  async function togglePublic(formData: FormData) {
    'use server'
    const next = formData.get('next') === 'true'
    await setDeckPublic(id, next)
  }
  async function copyLink() {
    'use server'
    // no-op on server; kept to show intent
  }
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-2xl font-semibold">{deck?.title || `Deck ${id}`}</h1>
          {deck?.is_public ? (
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
              Public
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
              Private
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600">{deck?.description || ''}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 ring-1 ring-inset ring-slate-200">
            Total cards: {totalCards ?? 0}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <a
          className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-slate-50"
          href="#"
          aria-label="Edit"
          title="Edit"
        >
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </a>
        <form action={togglePublic} className="inline">
          <input type="hidden" name="next" value={(!deck?.is_public).toString()} />
          <Button
            variant="outline"
            type="submit"
            aria-label={deck?.is_public ? 'Make private' : 'Make public'}
            title={deck?.is_public ? 'Make private' : 'Make public'}
          >
            {deck?.is_public ? <Lock className="h-4 w-4" /> : <Globe2 className="h-4 w-4" />}
            <span className="sr-only">{deck?.is_public ? 'Make private' : 'Make public'}</span>
          </Button>
        </form>
        <ShareButton url={shareUrl} />
      </div>
    </div>
  )
}

async function StudyActionsBar({ id }: { id: string }) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const userId = auth.user?.id
  let dueNow = 0
  if (userId) {
    const { count } = await supabase
      .from('reviews')
      .select('card_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('deck_id', id)
      .lt('due_at', new Date().toISOString())
    dueNow = count || 0
  }
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-lg border bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <label htmlFor="mode" className="text-sm font-medium text-slate-900">
          Study mode
        </label>
        <select id="mode" className="h-9 rounded-md border bg-white px-2 text-sm">
          <option>Flashcards</option>
          <option>Quick Review</option>
          <option>Test Me</option>
        </select>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          className="h-10 rounded-md bg-emerald-500 px-6 text-base hover:bg-emerald-600"
          asChild
        >
          <a href={`/study/${id}`}>Study now</a>
        </Button>
        <Button variant="outline" asChild>
          <a href={`/study/${id}`}>Review due ({dueNow})</a>
        </Button>
      </div>
    </div>
  )
}

async function ProgressOverview({ id }: { id: string }) {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const userId = auth.user?.id

  const nowIso = new Date().toISOString()

  const { count: totalCards } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true })
    .eq('deck_id', id)

  let dueNow = 0
  let nextReview: string | null = null
  let lastStudied: string | null = null
  let retentionPct = 0

  if (userId) {
    const { count: dueCount } = await supabase
      .from('reviews')
      .select('card_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('deck_id', id)
      .lt('due_at', nowIso)
    dueNow = dueCount || 0

    const { data: next } = await supabase
      .from('reviews')
      .select('due_at')
      .eq('user_id', userId)
      .eq('deck_id', id)
      .not('due_at', 'is', null)
      .order('due_at', { ascending: true })
      .limit(1)
    nextReview = next?.[0]?.due_at ?? null

    const { data: last } = await supabase
      .from('reviews')
      .select('grade, reviewed_at')
      .eq('user_id', userId)
      .eq('deck_id', id)
      .order('reviewed_at', { ascending: false })
      .limit(50)
    lastStudied = last?.[0]?.reviewed_at ?? null
    if (last && last.length > 0) {
      const correct = last.filter((r) => (r as any).grade >= 2).length
      retentionPct = Math.round((correct / last.length) * 100)
    }
  }

  const progressPct = totalCards
    ? Math.min(100, Math.round(((totalCards - dueNow) / totalCards) * 100))
    : 0

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-900">📈 Progress</span>
          <span className="text-sm text-slate-600">{progressPct}%</span>
        </div>
        <Progress value={progressPct} />
        <p className="mt-2 text-xs text-slate-500">
          Last studied: {lastStudied ? new Date(lastStudied).toLocaleString() : '—'}
        </p>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-900">🧠 Retention (last 50)</span>
          <span className="text-sm text-slate-600">{retentionPct}%</span>
        </div>
        <Progress value={retentionPct} />
        <p className="mt-2 text-xs text-slate-500">
          Next review: {nextReview ? new Date(nextReview).toLocaleString() : '—'}
        </p>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 text-sm font-medium text-slate-900">⏰ Due now</div>
        <div className="text-2xl font-semibold">{dueNow}</div>
        <p className="mt-2 text-xs text-slate-500">Total cards: {totalCards ?? 0}</p>
      </div>
    </div>
  )
}

// moved to client component: components/card-search-and-list.tsx

function MobileStickyActions({ id }: { id: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600" asChild>
          <a href={`/study/${id}`}>Study</a>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <a href={`#add`}>Add card</a>
        </Button>
      </div>
    </div>
  )
}
