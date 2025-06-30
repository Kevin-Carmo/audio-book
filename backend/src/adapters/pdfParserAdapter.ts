import pdfParse from 'pdf-parse';
import { IPdfParser } from '../types/Upload';


export class PdfParserAdapter implements IPdfParser {
  async parse(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text;
  }
}
