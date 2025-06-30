import { FastifyRequest, FastifyReply } from 'fastify'
import { uploadFileUseCase } from '../usecases/uploadFileUseCase'
import { ConvertOutput, UploadOutput } from '../types/Upload'
import { PdfParserAdapter } from '../adapters/pdfParserAdapter'
import { ConvertPdfUseCase } from '../usecases/convertPdfUseCase'

export const uploadFileController = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  try {
    const result: UploadOutput = await uploadFileUseCase(request)
    if (result.error) {
      return reply.code(result.error).send({ message: result.message })
    }
    return reply.code(201).send(result)
  } catch (error: unknown) {
    request.log.error(error)
    return reply.code(500).send({
      message: 'Unexpected error when uploading file',
    })
  }
}

export const convertPdfController = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<FastifyReply> => {
  const { filename } = request.body as { filename?: string }

  if (!filename) {
    return reply.code(400).send({ message: 'Filename is required' })
  }

  const pdfParser = new PdfParserAdapter()
  const useCase = new ConvertPdfUseCase(pdfParser)

  try {
    const result: ConvertOutput = await useCase.execute({ filename })

    if (result.error) {
      return reply.code(result.error).send({ message: result.message })
    }

    return reply.code(200).send({
      success: true,
      message: result.message,
      text: result.text,
      chunks: result.chunks,
      totalChunks: result.totalChunks,
      chunkFiles: result.chunkFiles,
    })
  } catch (error) {
    request.log.error(error)
    return reply.code(500).send({ message: 'Unexpected error during PDF conversion' })
  }
}
