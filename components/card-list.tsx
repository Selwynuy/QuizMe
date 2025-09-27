'use client'

import { useEffect, useState } from 'react'
import { Card as UICard, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'

type Card = { id: string; front: string; back: string }

export function CardList({
  deckId,
  query,
  sort: sortProp,
}: {
  deckId: string
  query?: string
  sort?: 'created_at' | 'updated_at'
}) {
  const [cards, setCards] = useState<Card[]>([])
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'created_at' | 'updated_at'>('created_at')
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    const effectiveSort = sortProp ?? sort
    const effectiveQuery = (query ?? q).trim()
    const params = new URLSearchParams({ deckId, sort: effectiveSort })
    if (effectiveQuery.length > 0) params.set('q', effectiveQuery)
    const res = await fetch(`/api/cards?${params.toString()}`)
    const j = await res.json()
    if (res.ok) setCards(j.cards)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [deckId, sortProp, query])

  return (
    <div className="mt-8 grid gap-3">
      <form
        className="grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          const res = await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deckId, front, back }),
          })
          const j = await res.json()
          if (!res.ok) setError(j.error || 'Failed')
          setFront('')
          setBack('')
          await load()
        }}
      >
        <UICard>
          <CardHeader>
            <CardTitle>Add Card</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid gap-1">
              <Label htmlFor="term">Term</Label>
              <Input
                id="term"
                className="pr-10"
                placeholder="Term"
                value={front}
                onChange={(e) => setFront(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="definition">Definition</Label>
              <textarea
                id="definition"
                className="rounded-md border px-3 py-2 pr-10"
                rows={3}
                placeholder="Definition"
                value={back}
                onChange={(e) => setBack(e.target.value)}
              />
            </div>
            <Button className="w-fit">Add Card</Button>
          </CardContent>
        </UICard>
        {error && <div className="text-sm text-[--color-error]">{error}</div>}
      </form>

      <ul className="grid gap-3">
        {loading && (
          <li className="rounded-lg border bg-white p-4 text-sm text-slate-500">Loading…</li>
        )}
        {!loading &&
          cards.map((c) => (
            <li key={c.id} className="rounded-lg border bg-white p-5">
              <div className="relative grid gap-3 pt-10">
                <Button
                  aria-label="Delete card"
                  title="Delete card"
                  variant="ghost"
                  className="absolute right-2 top-2 h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                  onClick={async () => {
                    await fetch(`/api/cards/${c.id}`, { method: 'DELETE' })
                    await load()
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
                <div>
                  <Label>Term</Label>
                  <div className="mt-1 rounded-md border px-3 py-2 text-sm">{c.front}</div>
                </div>
                <div>
                  <Label>Definition</Label>
                  <div className="mt-1 rounded-md border px-3 py-2 text-sm whitespace-pre-wrap">
                    {c.back}
                  </div>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

// inline editor removed per request
