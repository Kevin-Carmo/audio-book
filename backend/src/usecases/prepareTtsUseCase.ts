import { prepareTextForTTS } from "../infra/nlp/nlpClient";
import { RawText, Sentences } from "../types/Text";

export async function runPrepareTTSUseCase(text: RawText): Promise<Sentences> {
  const sentences = await prepareTextForTTS(text);
  return sentences; 
}
