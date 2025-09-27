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
    <div className="min-h-screen bg-gray-50">
      <StudyRunner deckId={id} deckTitle={deck?.title} />
    </div>
  )
}
