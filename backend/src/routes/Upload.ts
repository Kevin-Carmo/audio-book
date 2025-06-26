import { FastifyInstance } from 'fastify'
import { uploadFileController } from '../controllers/Upload'

export const registerRoutes = (app: FastifyInstance) => {
  app.post('/upload', uploadFileController)
}
