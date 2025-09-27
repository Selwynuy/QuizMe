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
        body: JSON.stringify({ text, count: 12 }),
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
    <div className="grid gap-2">
      <button
        className="rounded-md bg-[--color-secondary] px-4 py-2 text-white"
        onClick={handle}
        disabled={loading}
      >
        {loading ? 'Generating…' : 'Generate with AI'}
      </button>
      {error && <div className="text-sm text-[--color-error]">{error}</div>}
    </div>
  )
}
