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

