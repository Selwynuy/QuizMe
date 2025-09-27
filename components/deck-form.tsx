'use client'

import { useEffect, useState } from 'react'
import { PdfUpload } from '@/components/pdf-upload'
import { AIGenerate } from '@/components/ai-generate'
import { createDeck } from '@/lib/actions/decks'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export function DeckForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [notes, setNotes] = useState('')
  const [draftCards, setDraftCards] = useState<{ front: string; back: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const cached = localStorage.getItem('deck_notes')
      if (cached) {
        setNotes(cached)
        localStorage.removeItem('deck_notes')
      }

      // Load pre-generated cards from PDF upload
      const generatedCards = localStorage.getItem('generated_cards')
      if (generatedCards) {
        const cards = JSON.parse(generatedCards)
        setDraftCards(cards)
        localStorage.removeItem('generated_cards')
      }
    } catch {}
  }, [])

  async function handleSave() {
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setSaving(true)
    setError(null)
    const { data, error } = await createDeck({
      title,
      description,
      is_public: isPublic,
      cards: draftCards,
    })
    setSaving(false)
    if (error) {
      setError(error)
      return
    }
    if (data) window.location.href = `/decks/${data.id}`
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Deck</CardTitle>
          <CardDescription>Title, description, privacy</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="deck-title">Title</Label>
            <Input
              id="deck-title"
              placeholder="e.g. Biology - Cell Structure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deck-desc">Description</Label>
            <textarea
              id="deck-desc"
              className="rounded-md border px-3 py-2"
              rows={3}
              placeholder="Optional"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Make deck public
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload PDF</CardTitle>
          <CardDescription>Optional: attach study material</CardDescription>
        </CardHeader>
        <CardContent>
          <PdfUpload
            onUploaded={() => {}}
            onParsed={(t) => setNotes((prev) => (prev ? prev + '\n\n' + t : t))}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Flashcard Generation</CardTitle>
          <CardDescription>Paste notes and generate drafts</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <textarea
            className="rounded-md border px-3 py-2"
            rows={8}
            placeholder="Paste notes or extracted text here"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <AIGenerate getText={() => notes} onResult={setDraftCards} />
          {draftCards.length > 0 && (
            <div>
              <div className="font-medium">Preview ({draftCards.length})</div>
              <ul className="mt-3 grid gap-2">
                {draftCards.map((c, i) => (
                  <li key={i} className="rounded border p-3">
                    <div className="text-sm font-medium">Q: {c.front}</div>
                    <div className="text-sm text-[--color-text-secondary]">A: {c.back}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {error && <div className="text-sm text-[--color-error]">{error}</div>}
      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Deck'}
        </Button>
        <Button variant="outline" asChild>
          <a href="/dashboard">Cancel</a>
        </Button>
      </div>
    </div>
  )
}
