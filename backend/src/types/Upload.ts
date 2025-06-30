export type UploadOutput = {
  filename?: string;
  originalname?: string;
  size?: number;
  path?: string;
  error?: number;
  message?: string;
};

export type UploadInput = {
  filename: string;
  originalname: string;
  size: number;
  path: string;
};

export interface IPdfParser {
  parse(buffer: Buffer): Promise<string>;
}

export type ConvertOutput = {
  error?: number;            
  message: string;          
  text?: string;             
  chunks?: string[];         
  totalChunks?: number;      
  chunkFiles?: string[];     
};

