import { FastifyRequest, FastifyReply } from 'fastify'
import { uploadFileUseCase } from '../usecases/uploadFileUseCase'
import { UploadOutput } from '../types/Upload'

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
