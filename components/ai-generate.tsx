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

  const handle = async () => {
    const text = getText()
    if (!text) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
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

      <button
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        onClick={handle}
        disabled={loading}
      >
        {loading ? 'Generating flashcards…' : 'Generate Flashcards with AI'}
      </button>
      {error && <div className="text-sm text-destructive">{error}</div>}
    </div>
  )
}
