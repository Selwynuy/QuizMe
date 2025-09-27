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

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setError(null)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      onUploaded(json)
      if (onParsed) {
        const form2 = new FormData()
        form2.append('file', file)
        form2.append('count', '12')
        const res2 = await fetch('/api/parse-and-generate', { method: 'POST', body: form2 })
        const j2 = await res2.json()
        if (res2.ok && j2.text) {
          onParsed(j2.text as string)
          // Store generated cards for deck form
          try {
            localStorage.setItem('generated_cards', JSON.stringify(j2.cards))
          } catch {}
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="grid gap-2">
      <input type="file" accept="application/pdf" onChange={handleChange} />
      {isUploading && <div className="text-sm text-[--color-text-secondary]">Uploading…</div>}
      {error && <div className="text-sm text-[--color-error]">{error}</div>}
    </div>
  )
}
