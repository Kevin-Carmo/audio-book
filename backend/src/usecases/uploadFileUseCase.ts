import { FastifyRequest } from 'fastify';
import { UploadOutput } from '../types/Upload';
import { FileStorageService } from '../services/saveFileLocal';
import { ALLOWED_MIME_TYPES } from '../config/mimeTypes';

const fileStorageService = new FileStorageService();

export const uploadFileUseCase = async (
  request: FastifyRequest
): Promise<UploadOutput> => {
  const file = await request.file();
  if (!file) {
    return { error: 400, message: 'No files uploaded' };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return { error: 400, message: `File type not allowed: ${file.mimetype}` };
  }

  const result = await fileStorageService.saveFileLocal(file);

  if ('error' in result) {
    return result;
  }

  return { message: 'File successfully sent', ...result };
};
