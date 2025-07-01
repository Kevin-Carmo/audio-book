import { Transform } from 'stream';
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
