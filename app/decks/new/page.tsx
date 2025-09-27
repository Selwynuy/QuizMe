import { NavBar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { DeckForm } from '@/components/deck-form'
export default function NewDeckPage() {
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-3xl px-6 py-10 grid gap-6">
        <h1 className="text-2xl font-semibold">Create a new deck</h1>
        <DeckForm />
      </main>
      <Footer />
    </>
  )
}
