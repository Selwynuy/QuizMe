'use client'

import { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface EnhancedUploadProps {
  onContentGenerated: (content: string) => void
  onCardsGenerated: (cards: { front: string; back: string }[]) => void
  hasExistingContent?: boolean
}

export function EnhancedUpload({
  onContentGenerated,
  onCardsGenerated,
  hasExistingContent = false,
}: EnhancedUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text' | 'url'>('file')
  const [textContent, setTextContent] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [cardCount, setCardCount] = useState(5)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const form = new FormData()
      form.append('file', file)
      form.append('count', cardCount.toString())

      const res = await fetch('/api/parse-and-generate', { method: 'POST', body: form })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Upload and generation failed')

      onContentGenerated(json.text)
      onCardsGenerated(json.cards)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload and generation failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleTextGeneration = async () => {
    if (!textContent.trim()) {
      setError('Please enter some text')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textContent, count: cardCount }),
      })
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Generation failed')

      onContentGenerated(textContent)
      onCardsGenerated(json.cards)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlGeneration = async () => {
    if (!urlInput.trim()) {
      setError('Please enter a URL')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const res = await fetch('/api/extract-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'URL extraction failed')
      }

      if (!json.success) {
        setError(json.error || 'URL extraction not available')
        return
      }

      // If successful, generate flashcards from extracted content
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: json.content, count: cardCount }),
      })
      const generateJson = await generateRes.json()

      if (!generateRes.ok) throw new Error(generateJson.error || 'Generation failed')

      onContentGenerated(json.content)
      onCardsGenerated(generateJson.cards)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'URL processing failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="grid gap-6">
      {hasExistingContent && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <span className="text-lg">📄</span>
            <span className="font-medium">Content already uploaded!</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            Your PDF has been processed and is ready for review. Check the content preview above.
          </p>
        </div>
      )}

      {/* Upload Method Selection */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant={uploadMethod === 'file' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('file')}
          className="flex items-center gap-2"
        >
          📄 File Upload
        </Button>
        <Button
          variant={uploadMethod === 'text' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('text')}
          className="flex items-center gap-2"
        >
          ✍️ Text Input
        </Button>
        <Button
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          onClick={() => setUploadMethod('url')}
          className="flex items-center gap-2"
        >
          🔗 URL Import
        </Button>
      </div>

      {/* Card Count */}
      <div className="grid gap-2">
        <label className="text-sm font-medium">Number of flashcards to generate</label>
        <Input
          type="number"
          min="1"
          max="50"
          value={cardCount}
          onChange={(e) => setCardCount(Math.min(Math.max(Number(e.target.value), 1), 50))}
          className="w-32"
          disabled={isUploading}
        />
      </div>

      {/* File Upload */}
      {uploadMethod === 'file' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload PDF File</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="text-4xl">📄</div>
                <div>
                  <p className="text-lg font-medium">
                    {dragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                  </p>
                  <p className="text-sm text-gray-500">or</p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Input */}
      {uploadMethod === 'text' && (
        <Card>
          <CardHeader>
            <CardTitle>Paste Your Content</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste your notes, textbook content, or any text you want to study..."
              rows={8}
              disabled={isUploading}
            />
            <Button onClick={handleTextGeneration} disabled={isUploading || !textContent.trim()}>
              {isUploading
                ? `Generating ${cardCount} flashcards...`
                : `Generate ${cardCount} Flashcards`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* URL Import */}
      {uploadMethod === 'url' && (
        <Card>
          <CardHeader>
            <CardTitle>Import from URL</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/article"
              disabled={isUploading}
            />
            <Button onClick={handleUrlGeneration} disabled={isUploading || !urlInput.trim()}>
              {isUploading ? 'Extracting content...' : 'Extract & Generate Flashcards'}
            </Button>
            <p className="text-xs text-gray-500">
              Extract content from web pages, articles, or online documents
            </p>
          </CardContent>
        </Card>
      )}

      {/* Status Messages */}
      {isUploading && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            Processing content and generating {cardCount} flashcards...
          </div>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
        </div>
      )}
    </div>
  )
}
