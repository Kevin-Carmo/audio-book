import { FastifyRequest, FastifyReply } from 'fastify'
import { runPrepareTTSUseCase } from "../usecases/prepareTtsUseCase";

interface PrepareTTSBody {
  text: string;
}

export async function prepareTTSHandler(
  req: FastifyRequest<{ Body: PrepareTTSBody }>,
  res: FastifyReply
) {
  const { text } = req.body;

  if (typeof text !== "string" || text.length === 0) {
    return res.status(400).send({ error: "Texto inválido" });
  }

  try {
    const sentences = await runPrepareTTSUseCase(text);
    return res.status(200).send({ sentences });
  } catch (error: any) {
    return res.status(500).send({ error: error.message || 'Erro interno' });
  }
}
