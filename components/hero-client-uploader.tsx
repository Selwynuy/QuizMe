'use client'

import FileUpload from '@/components/FileUploader'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export default function HeroClientUploader() {
  const { toast } = useToast()
  const router = useRouter()
  return (
    <FileUpload
      onFileUpload={() => {}}
      setParsedText={(text) => {
        try {
          localStorage.setItem('deck_notes', text)
        } catch {}
        toast({
          title: 'Success!',
          description: 'PDF parsed and flashcards generated. Redirecting…',
        })
        router.push('/decks/new')
      }}
      maxSize={8 * 1024 * 1024}
    />
  )
}
