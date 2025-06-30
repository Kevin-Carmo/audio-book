import { Transform } from 'stream';
//@ts-ignore
import { NlpManager } from 'node-nlp';

export const createCountingStream = (): { stream: Transform; getBytes: () => number } => {
  let totalBytes = 0;

  const countingStream = new Transform({
    transform(chunk, encoding, callback) {
      totalBytes += chunk.length;
      this.push(chunk); // repassa o chunk
      callback();
    },
  });

  return {
    stream: countingStream,
    getBytes: () => totalBytes,
  };
};

export function normalizeTextForTTS(rawText: string): string {
  return rawText
    .replace(/\r\n|\r/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/(\n\s*){3,}/g, '\n\n')
    .replace(/\.{3,}/g, '.')
    .trim();
}


export function tokenizeAndCleanText(text: string): string {
  const manager = new NlpManager({ languages: ['pt'] });
  const tokens = manager.tokenizer.tokenize(text);
  return tokens
    .join(' ')
    .replace(/ ,/g, ',')
    .replace(/ \./g, '.')
    .replace(/\s{2,}/g, ' ')
    .trim();
}


export function prepareTextForTTS(rawText: string, chunkSize = 4000): {
  text: string;
  chunks: string[];
} {
  const normalized = normalizeTextForTTS(rawText);
  const cleaned = tokenizeAndCleanText(normalized);
  const chunks = splitTextByLength(cleaned, chunkSize);
  return { text: cleaned, chunks };
}


export function splitTextByLength(text: string, maxLength = 5000): string[] {
  const chunks: string[] = [];
  let current = 0;

  const abbreviations = ['Dr.', 'Sr.', 'Sra.', 'Ex.', 'Prof.', 'etc.'];

  while (current < text.length) {
    let end = current + maxLength;
    if (end >= text.length) {
      chunks.push(text.slice(current).trim());
      break;
    }

    let slice = text.slice(current, end);

    for (const abbr of abbreviations) {
      const lastAbbr = slice.lastIndexOf(abbr);
      if (lastAbbr !== -1) {
        const abbrEnd = lastAbbr + abbr.length;
        const extra = abbrEnd >= slice.length - 5 ? abbr.length - (slice.length - lastAbbr) : 0;
        if (extra > 0 && end + extra <= text.length) {
          end += extra;
          slice = text.slice(current, end);
        }
      }
    }

    let cutPos = Math.max(
      text.lastIndexOf('.', end),
      text.lastIndexOf(';', end),
      text.lastIndexOf(',', end)
    );

    if (cutPos <= current || cutPos - current < 100) {
      cutPos = end;
    }

    chunks.push(text.slice(current, cutPos + 1).trim());
    current = cutPos + 1;
  }

  return chunks;
}
