'use client'

import { useState } from 'react'

export function PdfUpload({
  onUploaded,
  onParsed,
}: {
  onUploaded: (result: { path: string; url: string }) => void
  onParsed?: (text: string) => void
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardCount, setCardCount] = useState(5)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setError(null)

    try {
      // Directly parse and generate flashcards
      const form = new FormData()
      form.append('file', file)
      form.append('count', cardCount.toString())

      const res = await fetch('/api/parse-and-generate', { method: 'POST', body: form })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Upload and generation failed')

      // Store generated cards for deck form
      try {
        localStorage.setItem('generated_cards', JSON.stringify(json.cards))
      } catch {}

      // Call the upload callback with a mock response (since we're not actually uploading to storage)
      onUploaded({ path: 'generated', url: 'generated' })

      // Call the parsed callback with the text
      if (onParsed) {
        onParsed(json.text as string)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload and generation failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Number of flashcards to generate</label>
        <input
          type="number"
          min="1"
          max="50"
          value={cardCount}
          onChange={(e) => setCardCount(Math.min(Math.max(Number(e.target.value), 1), 50))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isUploading}
        />
      </div>

      <label className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <span>Choose PDF File</span>
        <input type="file" accept="application/pdf" onChange={handleChange} className="hidden" />
      </label>

      {isUploading && (
        <div className="text-sm text-[--color-text-secondary]">
          Processing PDF and generating {cardCount} flashcards…
        </div>
      )}
      {error && <div className="text-sm text-[--color-error]">{error}</div>}
    </div>
  )
}
