type Deck = {
  id: string
  title: string
  description: string | null
  cardsCount?: number
  lastReviewedAt?: string | null
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookMarked } from 'lucide-react'

export function DeckList({ decks }: { decks: Deck[] }) {
  if (!decks?.length) {
    return (
      <div className="mt-8 rounded-lg border bg-white p-6 text-sm text-[--color-text-secondary]">
        No decks yet. Create your first one!
      </div>
    )
  }
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Your Decks</h2>
        <a href="/decks/new" className="hidden sm:block">
          <Button size="sm">Create Deck</Button>
        </a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {decks.map((d) => (
          <Card key={d.id} className="hover:shadow rounded-xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookMarked className="h-4 w-4 text-blue-600" /> {d.title}
                </span>
                {typeof d.cardsCount === 'number' && (
                  <span className="text-xs font-normal text-[--color-text-secondary]">
                    {d.cardsCount} cards
                  </span>
                )}
              </CardTitle>
              {d.description && <CardDescription>{d.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-2">
                <a href={`/study/${d.id}`}>
                  <Button size="sm" className="bg-[--color-accent] text-white">
                    Study Now
                  </Button>
                </a>
                <a href={`/decks/${d.id}`}>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </a>
              </div>
              {d.lastReviewedAt && (
                <div className="mt-3 text-xs text-[--color-text-secondary]">
                  Last reviewed {new Date(d.lastReviewedAt).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
