type Deck = { id: string; title: string; description: string | null }
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export function DeckList({ decks }: { decks: Deck[] }) {
  if (!decks?.length) {
    return (
      <div className="mt-8 rounded-lg border bg-white p-6 text-sm text-[--color-text-secondary]">
        No decks yet. Create your first one!
      </div>
    )
  }
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {decks.map((d) => (
        <a key={d.id} href={`/decks/${d.id}`}>
          <Card className="hover:shadow">
            <CardHeader>
              <CardTitle className="text-base">{d.title}</CardTitle>
              {d.description && <CardDescription>{d.description}</CardDescription>}
            </CardHeader>
          </Card>
        </a>
      ))}
    </section>
  )
}
