'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/toast-provider'
import { Share2 } from 'lucide-react'

export function ShareButton({ url }: { url: string }) {
  const push = useToast()
  return (
    <Button
      aria-label="Share"
      title="Share"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url)
          push({ type: 'success', message: 'Link copied' })
        } catch {
          push({ type: 'error', message: 'Copy failed' })
        }
      }}
    >
      <Share2 className="h-4 w-4" />
      <span className="sr-only">Share</span>
    </Button>
  )
}
