import { readFile, writeFile } from "node:fs/promises";

const readStdin = async (encoding: BufferEncoding | undefined) => {
  if (encoding !== undefined) {
    process.stdin.setEncoding(encoding);
  }
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};

export const readData = async (path: string, encoding: BufferEncoding | undefined) => {
  return path === "-" ? readStdin(encoding) : readFile(path, { encoding });
};

const writeStdout = (data: string) => {
  process.stdout.write(data);
};

export const writeData = async (path: string, data: string) => {
  return path === "-" ? writeStdout(data) : writeFile(path, data);
};
