'use client'

import { useState } from 'react'

type CardDraft = { front: string; back: string }

export function AIGenerate({
  getText,
  onResult,
}: {
  getText: () => string
  onResult: (cards: CardDraft[]) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardCount, setCardCount] = useState(5)

  const handle = async () => {
    const text = getText()
    if (!text) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, count: cardCount }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to generate')
      onResult(json.cards as CardDraft[])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-3">
      <div className="text-sm text-muted-foreground mb-1">
        AI will analyze your text and create flashcards automatically
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Number of flashcards to generate</label>
        <input
          type="number"
          min="1"
          max="50"
          value={cardCount}
          onChange={(e) => setCardCount(Math.min(Math.max(Number(e.target.value), 1), 50))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
      </div>

      <button
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        onClick={handle}
        disabled={loading}
      >
        {loading
          ? `Generating ${cardCount} flashcards…`
          : `Generate ${cardCount} Flashcards with AI`}
      </button>
      {error && <div className="text-sm text-destructive">{error}</div>}
    </div>
  )
}
