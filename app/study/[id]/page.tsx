import { Footer } from '@/components/footer'
import { StudyRunner } from '@/components/study-runner'
import { createClient } from '@/lib/server'

type Props = { params: Promise<{ id: string }> }

export default async function StudyPage({ params }: Props) {
  const { id } = await params

  // Fetch deck title
  const supabase = await createClient()
  const { data: deck } = await supabase.from('decks').select('title').eq('id', id).single()

  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Study Deck: {deck?.title || 'Loading...'}</h1>
          <div className="text-sm text-[--color-text-secondary]">Session</div>
        </div>
        <StudyRunner deckId={id} />
      </main>
      <Footer />
    </>
  )
}
