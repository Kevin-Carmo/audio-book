import { FastifyRequest } from 'fastify'
import { UploadOutput } from '../types/Upload'
import { saveFileLocal } from '../services/saveFileLocal'
import { ALLOWED_MIME_TYPES } from '../config/mimeTypes'

export const uploadFileUseCase = async (
  request: FastifyRequest
): Promise<UploadOutput> => {
  const file = await request.file()
  if (!file) {
    return {
      error: 400,
      message: 'No files uploaded',
    }
  }
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return {
      error: 400,
      message: `File type not allowed: ${file.mimetype}`,
    }
  }
  const result = await saveFileLocal(file)
  if ('error' in result) {
    return result
  }

  return {
    message: 'File successfully sent',
    ...result,
  }
}
