import { Transform } from 'stream'

export const createCountingStream = (): { stream: Transform; getBytes: () => number } => {
  let totalBytes = 0

  const countingStream = new Transform({
    transform(chunk, encoding, callback) {
      totalBytes += chunk.length
      this.push(chunk) // Repassa o chunk adiante no pipeline
      callback()
    },
  })

  return {
    stream: countingStream,
    getBytes: () => totalBytes,
  }
}

export function normalizeTextForTTS(rawText: string): string {
  return rawText
    .replace(/\r\n|\r/g, '\n') // padroniza quebras de linha
    .replace(/\n{3,}/g, '\n\n') // reduz quebras múltiplas para 2 (pausa clara)
    .replace(/[ \t]{2,}/g, ' ') // reduz múltiplos espaços
    .replace(/[“”]/g, '"') // padroniza aspas para dupla padrão
    .replace(/[‘’]/g, "'") // padroniza aspas simples
    .replace(/[^\S\r\n]+/g, ' ') // remove espaços unicode estranhos
    .replace(/([.!?])([^\s])/g, '$1\n\n$2') // força quebra após pontuações fortes para pausa
    .trim()
}

export function splitTextByLength(text: string, maxLength = 5000): string[] {
  const chunks: string[] = []
  let current = 0

  const abbreviations = ['Dr.', 'Sr.', 'Sra.', 'Ex.', 'Prof.', 'etc.']

  while (current < text.length) {
    let end = current + maxLength
    if (end >= text.length) {
      chunks.push(text.slice(current).trim())
      break
    }

    let slice = text.slice(current, end)

    // Ajusta o 'end' para incluir abreviações que possam ser cortadas no meio
    for (const abbr of abbreviations) {
      const lastAbbr = slice.lastIndexOf(abbr)
      if (lastAbbr !== -1) {
        const abbrEndPos = lastAbbr + abbr.length
        // Se a abreviação estiver muito próxima do fim do slice (ex: últimos 5 caracteres), inclui ela inteira
        if (abbrEndPos >= slice.length - 5 && end + (abbr.length - (slice.length - lastAbbr)) <= text.length) {
          end += abbr.length - (slice.length - lastAbbr)
          slice = text.slice(current, end)
        }
      }
    }

    // Busca a última pontuação forte para cortar, dentro do limite ajustado
    let cutPos = Math.max(
      text.lastIndexOf('.', end),
      text.lastIndexOf(';', end),
      text.lastIndexOf(',', end)
    )

    // Se não achou ponto ou pontuação válida, corta no limite max
    if (cutPos <= current) {
      cutPos = end
    }

    // Evita cortes muito pequenos
    if (cutPos - current < 100) {
      cutPos = end
    }

    chunks.push(text.slice(current, cutPos + 1).trim())
    current = cutPos + 1
  }

  return chunks
}
