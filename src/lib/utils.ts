import { promises as fs } from "fs"
import path from "path"
import Textbook from '@/types/Textbook';

export async function fetchTextbooks(): Promise<Textbook[]> {
  const pdfDir = path.join(process.cwd(), "public", "pdf");
  const fileNames = await fs.readdir(pdfDir);
  return fileNames.map(fn => ({
    fileName: fn,
    filePath: `/pdf/${fn}`,
    uriName: fn.replace(/.pdf$/, ""),
    name: decodeURI(fn.replace(/.pdf$/, "")),
  }));
}
