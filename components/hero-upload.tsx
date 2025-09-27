'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/toast-provider'

export function HeroUpload() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const push = useToast()

  const onFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file')
      return
    }
    setIsLoading(true)
    setError(null)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/parse-pdf', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to parse PDF')
      try {
        localStorage.setItem('deck_notes', json.text as string)
      } catch {}
      push({ type: 'success', message: 'Parsed! Redirecting…' })
      router.push('/decks/new')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to parse PDF'
      setError(msg)
      push({ type: 'error', message: msg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload PDF</CardTitle>
        <CardDescription>We’ll extract text and prepare AI flashcards</CardDescription>
      </CardHeader>
      <CardContent>
        <label className="grid place-items-center h-40 rounded border border-dashed cursor-pointer">
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void onFile(f)
            }}
          />
          <div className="text-sm text-[--color-text-secondary]">
            {isLoading ? 'Parsing…' : 'Click to select a PDF'}
          </div>
        </label>
        {error && <div className="mt-2 text-sm text-[--color-error]">{error}</div>}
        <div className="mt-3 text-xs text-[--color-text-secondary]">
          No sign-in required to parse. You’ll be asked to log in to save.
        </div>
      </CardContent>
    </Card>
  )
}
