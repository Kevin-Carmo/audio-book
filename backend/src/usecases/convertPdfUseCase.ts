
import { PdfTextExtractor } from '../services/pdfExtractor'
import { TtsTextProcessor } from '../services/ttsText'
import { IPdfParser, ConvertOutput } from '../types/Upload'


interface ConvertPdfDTO {
  filename: string
}

export class ConvertPdfUseCase {
  private extractor: PdfTextExtractor
  private processor: TtsTextProcessor

  constructor(pdfParser: IPdfParser) {
    this.extractor = new PdfTextExtractor(pdfParser)
    this.processor = new TtsTextProcessor()
  }

  async execute({ filename }: ConvertPdfDTO): Promise<ConvertOutput> {
    if (!filename) {
      return { error: 400, message: 'Filename is required' }
    }

    try {
      const rawText = await this.extractor.extractText(filename)
      const processed = await this.processor.processTextAndSaveChunks(filename, rawText)

      return {
        message: 'Text extracted, processed and chunk files created successfully',
        text: processed.cleanText,
        chunks: processed.chunks,
        totalChunks: processed.totalChunks,
        chunkFiles: processed.chunkFiles,
      }
    } catch (error: any) {
      if (error.message === 'File not found') {
        return { error: 404, message: error.message }
      }
      return { error: 500, message: 'Error parsing PDF' }
    }
  }
}
