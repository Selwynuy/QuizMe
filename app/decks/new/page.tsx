import { Footer } from '@/components/footer'
import { DeckForm } from '@/components/deck-form'
export default function NewDeckPage() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-6 py-10 grid gap-6 min-h-[calc(100vh-200px)]">
        <h1 className="text-2xl font-semibold">Create a new deck</h1>
        <DeckForm />
      </main>
      <Footer />
    </div>
  )
}
