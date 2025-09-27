import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import os from 'os'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import PDFParser from 'pdf2json'

export async function POST(req: NextRequest) {
  const formData: FormData = await req.formData()
  // accept either 'file' or 'FILE'
  const uploaded = formData.getAll('file')
  const uploadedFiles = uploaded.length ? uploaded : formData.getAll('FILE')
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
      return new NextResponse('Uploaded file is not in the expected format.', {
        status: 500,
      })
    }
  } else {
    console.log('No files found.')
    return new NextResponse('No File Found', { status: 404 })
  }

  const response = new NextResponse(parsedText)
  response.headers.set('FileName', fileName)
  return response
}
