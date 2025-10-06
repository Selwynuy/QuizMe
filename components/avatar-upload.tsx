'use client'

import { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function AvatarUpload({ name, email }: { name?: string | null; email?: string | null }) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const initials = (name || email || 'User')
    .split(' ')
    .map((s) => s.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="h-16 w-16">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt={name || email || 'User'} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute -bottom-1 -right-1 rounded-full bg-white border shadow px-2 py-1 text-xs"
        >
          Edit
        </button>
      </div>
      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
          }}
        />
        {/* Intentionally no Save button here; saving should happen in the form section */}
      </div>
    </div>
  )
}
