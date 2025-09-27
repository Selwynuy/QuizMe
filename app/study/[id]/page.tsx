import { Footer } from '@/components/footer'
import { StudyRunner } from '@/components/study-runner'
type Props = { params: Promise<{ id: string }> }

export default async function StudyPage({ params }: Props) {
  const { id } = await params
  return (
    <>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Study Deck {id}</h1>
          <div className="text-sm text-[--color-text-secondary]">Session</div>
        </div>
        <StudyRunner deckId={id} />
      </main>
      <Footer />
    </>
  )
}
