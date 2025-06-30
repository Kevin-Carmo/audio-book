import { FastifyInstance } from 'fastify';
import { uploadFileController, convertPdfController } from '../controllers/Upload';

export const registerRoutes = (app: FastifyInstance) => {
  app.post('/upload', uploadFileController);
  app.post('/convert', convertPdfController);
};
