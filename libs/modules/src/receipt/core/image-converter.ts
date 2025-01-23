import { readFile } from 'fs/promises';
import { extname } from 'path';

export async function imageToDataUrl(source: string) {
  const buffer = await readFile(source);
  const extension = extname(source).slice(1);
  return `data:image/${extension};base64,${buffer.toString('base64')}`;
}
