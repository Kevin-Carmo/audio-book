// services/TtsTextProcessor.ts
import fs from 'fs/promises'
import path from 'path'
import { normalizeTextForTTS, splitTextByLength } from '../util/Upload'

const UPLOAD_DIR = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.resolve(__dirname, '..', '..', 'uploads')

const PDF_CHUNK_SIZE = (() => {
  const chunkSizeEnv = process.env.PDF_CHUNK_SIZE
  const parsed = parseInt(chunkSizeEnv || '', 10)
  return !isNaN(parsed) && parsed > 0 ? parsed : 4000
})()

export class TtsTextProcessor {
  async processTextAndSaveChunks(filename: string, rawText: string) {
    const cleanText = normalizeTextForTTS(rawText)
    const chunks = splitTextByLength(cleanText, PDF_CHUNK_SIZE)

    const chunksDir = process.env.TTS_CHUNKS_DIR
      ? path.resolve(process.env.TTS_CHUNKS_DIR)
      : path.resolve(UPLOAD_DIR, 'tts_chunks')

    await fs.mkdir(chunksDir, { recursive: true })

    const chunkFiles: string[] = []
    for (let i = 0; i < chunks.length; i++) {
      const chunkFileName = `${path.parse(filename).name}_chunk_${i + 1}.txt`
      const chunkFilePath = path.join(chunksDir, chunkFileName)
      await fs.writeFile(chunkFilePath, chunks[i], 'utf8')
      chunkFiles.push(chunkFilePath)
    }

    return { cleanText, chunks, chunkFiles, totalChunks: chunks.length }
  }
}
