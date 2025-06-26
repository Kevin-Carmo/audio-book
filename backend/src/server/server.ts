import Fastify from 'fastify'
import multipart from '@fastify/multipart'
import { registerRoutes } from '../routes/Upload'


export const buildServer = async () => {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,      
          translateTime: 'HH:MM:ss',
          ignore: 'pid,hostname'
        },
      },
    },
  })

  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB
      files: 1,
      parts: 1,
    },
  })

  registerRoutes(app)

  return app
}
