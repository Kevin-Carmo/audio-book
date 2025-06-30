// services/PdfTextExtractor.ts
import fs from 'fs/promises'
import path from 'path'
import { IPdfParser } from '../types/Upload'

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(__dirname, '..', '..', 'uploads')

export class PdfTextExtractor {
  constructor(private readonly pdfParser: IPdfParser) {}

  async extractText(filename: string): Promise<string> {
    if (!filename) throw new Error('Filename is required')

    const filePath = path.resolve(UPLOAD_DIR, filename)
    let fileBuffer: Buffer

    try {
      fileBuffer = await fs.readFile(filePath)
    } catch {
      throw new Error('File not found')
    }

    const text = await this.pdfParser.parse(fileBuffer)
    return text
  }
}
