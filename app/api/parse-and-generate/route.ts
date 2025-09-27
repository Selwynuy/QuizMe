import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import PDFParser from 'pdf2json'

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Missing GEMINI_API_KEY' }, { status: 500 })
  }

  const formData: FormData = await req.formData()
  const uploaded = formData.getAll('file')
  const uploadedFiles = uploaded.length ? uploaded : formData.getAll('FILE')
  const count = Math.min(Math.max(Number(formData.get('count') ?? 12), 1), 50)

  let fileName = ''
  let parsedText = ''

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[0]
    console.log('Uploaded file:', uploadedFile)

    if (uploadedFile instanceof File) {
      fileName = uuidv4()

      const tmpDir = os.tmpdir()
      const tempFilePath = path.join(tmpDir, `${fileName}.pdf`)
      await fs.mkdir(path.dirname(tempFilePath), { recursive: true }).catch(() => {})

      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer())
      await fs.writeFile(tempFilePath, fileBuffer)

      const pdfParser = new (PDFParser as any)(null, 1)

      pdfParser.on('pdfParser_dataError', (errData: any) => console.log(errData.parserError))

      pdfParser.on('pdfParser_dataReady', () => {
        console.log((pdfParser as any).getRawTextContent())
        parsedText = (pdfParser as any).getRawTextContent()
      })

      await new Promise((resolve, reject) => {
        pdfParser.loadPDF(tempFilePath)
        pdfParser.on('pdfParser_dataReady', resolve)
        pdfParser.on('pdfParser_dataError', reject)
      })

      // cleanup temp file best-effort
      await fs.unlink(tempFilePath).catch(() => {})
    } else {
      console.log('Uploaded file is not in the expected format.')
      return NextResponse.json(
        { error: 'Uploaded file is not in the expected format.' },
        { status: 500 },
      )
    }
  } else {
    console.log('No files found.')
    return NextResponse.json({ error: 'No File Found' }, { status: 404 })
  }

  if (!parsedText.trim()) {
    return NextResponse.json({ error: 'No text could be extracted from PDF' }, { status: 400 })
  }

  // Now generate flashcards with Gemini
  const system = `You generate study flashcards from input material.
Return ONLY valid JSON: an array of objects with keys front and back.
Each front is a concise question/prompt. Each back is a precise answer.
Avoid duplicates, avoid trivial facts, and focus on high-value concepts.`

  const user = `Create ${count} flashcards from the following content. Respond with JSON only.
CONTENT:\n\n${parsedText.slice(0, 20000)}`

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

    return NextResponse.json({
      text: parsedText,
      cards,
      fileName,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Generation failed' }, { status: 500 })
  }
}
