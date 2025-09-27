declare module 'pdf-parse' {
  export interface PdfParseResult {
    text: string
    numpages?: number
    info?: Record<string, unknown>
    metadata?: unknown
    version?: string
  }

  function pdf(data: Uint8Array | ArrayBuffer | Buffer): Promise<PdfParseResult>
  export default pdf
}
