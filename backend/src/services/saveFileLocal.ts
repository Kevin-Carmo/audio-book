import path from 'path'
import fs from 'fs'
import { pipeline } from 'stream/promises'
import crypto from 'crypto'
import type { MultipartFile } from '@fastify/multipart'
import { UploadInput, UploadOutput } from '../types/Upload'
import { createCountingStream } from '../util/Upload'

const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(__dirname, '..', '..', 'uploads')

export class FileStorageService {
  async saveFileLocal(
    data: MultipartFile
  ): Promise<UploadInput | UploadOutput> {
    await fs.promises.mkdir(UPLOADS_DIR, { recursive: true })

    const uniqueName = `${crypto.randomUUID()}.pdf`
    const destPath = path.join(UPLOADS_DIR, uniqueName)

    const { stream: countingStream, getBytes } = createCountingStream()

    await pipeline(
      data.file,
      countingStream,
      fs.createWriteStream(destPath, { mode: 0o600 })
    )

    if (data.file.truncated) {
      await fs.promises.unlink(destPath)
      return {
        error: 413,
        message: 'File size exceeds limit',
      }
    }

    return {
      filename: uniqueName,
      originalname: data.filename,
      size: getBytes(),
      path: destPath,
    }
  }
}
