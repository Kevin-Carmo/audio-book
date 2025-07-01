import axios from "axios";
import { RawText, Sentences } from "../../types/Text";


const NLP_API_URL = process.env.NLP_API_URL || "http://localhost:8000";

export async function prepareTextForTTS(text: RawText): Promise<Sentences> {
  try {
    const response = await axios.post(`${NLP_API_URL}/split`, { text });
    return response.data.sentences;
  } catch (error: any) {
    console.error("Erro ao chamar NLP API:", error.response?.data || error.message);
    throw new Error("Falha ao processar texto no microserviço NLP");
  }
}
