import { NextResponse } from 'next/server'
import { createClient } from '@/lib/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await request.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
  const path = `${user.user.id}/${Date.now()}_${safeName}`

  const { error: uploadError } = await supabase.storage.from('uploads').upload(path, bytes, {
    contentType: 'application/pdf',
    upsert: false,
  })
  if (uploadError) {
    console.error('Upload error:', uploadError)
    return NextResponse.json(
      {
        error: uploadError.message.includes('Bucket not found')
          ? 'Storage bucket not configured. Please contact support.'
          : uploadError.message,
      },
      { status: 500 },
    )
  }

  const { data: signed, error: signError } = await supabase.storage
    .from('uploads')
    .createSignedUrl(path, 60 * 60)
  if (signError) return NextResponse.json({ error: signError.message }, { status: 500 })

  return NextResponse.json({ path, url: signed.signedUrl })
}
