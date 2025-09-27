import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 })
  }

  const body = (await request.json().catch(() => null)) as { text?: string; count?: number } | null
  const text = body?.text?.toString().slice(0, 20000) || ''
  const count = Math.min(Math.max(Number(body?.count ?? 12), 1), 50)
  if (!text) return NextResponse.json({ error: 'text is required' }, { status: 400 })

  const system = `You generate study flashcards from input material.
Return ONLY valid JSON: an array of objects with keys front and back.
Each front is a concise question/prompt. Each back is a precise answer.
Avoid duplicates, avoid trivial facts, and focus on high-value concepts.`

  const user = `Create ${count} flashcards from the following content. Respond with JSON only.
CONTENT:\n\n${text}`

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${system}\n\n${user}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
          },
        }),
      },
    )

    if (!resp.ok) {
      const err = await resp.text()
      return NextResponse.json({ error: `Gemini error: ${err}` }, { status: 500 })
    }
    const data = (await resp.json()) as any
    const content: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
    // Try parsing best-effort
    const match = content.match(/\[([\s\S]*)\]/)
    const jsonText = match ? `[${match[1]}]` : content
    const parsed = JSON.parse(jsonText)
    if (!Array.isArray(parsed)) throw new Error('Invalid JSON output')
    const cards = parsed
      .map((c: any) => ({ front: String(c.front || ''), back: String(c.back || '') }))
      .filter((c: any) => c.front && c.back)
    return NextResponse.json({ cards })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Generation failed' }, { status: 500 })
  }
}
