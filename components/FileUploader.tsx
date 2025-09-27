'use client'

import { UploadCloud } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Input } from './ui/input'
import { useToast } from '@/components/ui/use-toast'

export default function FileUpload({
  onFileUpload,
  setParsedText,
  maxSize,
}: {
  onFileUpload: (file: File) => void
  setParsedText: (text: string) => void
  maxSize: number
}) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const uploadFileToApi = async (file: File) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('FILE', file)
    formData.append('count', '12')

    try {
      const response = await fetch('/api/parse-and-generate', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload and generate')
      }

      const result = await response.json()
      setParsedText(result.text)

      // Store generated cards in localStorage for the deck form
      try {
        localStorage.setItem('generated_cards', JSON.stringify(result.cards))
      } catch {}

      toast({
        title: 'Success!',
        description: `Generated ${result.cards.length} flashcards from PDF`,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: (error as Error).message,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 1) {
        toast({
          variant: 'destructive',
          title: 'Multiple files not allowed',
          description: 'Please upload only one PDF file.',
        })
        return
      }

      const file = acceptedFiles[0]
      onFileUpload(file)
      await uploadFileToApi(file)
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize: maxSize,
  })

  return (
    <div>
      <label
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="text-center">
          <div className="border p-2 rounded-md max-w-min mx-auto">
            <UploadCloud size={20} />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold">
              {isUploading ? 'Processing PDF...' : 'Drag and drop PDF files'}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            {isUploading
              ? 'Generating flashcards with AI...'
              : 'Click to upload files (files should be under 8 MB)'}
          </p>
        </div>
      </label>
      <Input
        {...getInputProps()}
        id="dropzone-file"
        accept="application/pdf"
        type="file"
        className="hidden"
        disabled={isUploading}
      />
    </div>
  )
}
