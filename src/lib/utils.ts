import { promises as fs } from "fs"
import path from "path"
import TextbookInfo from '@/types/TextbookInfo';

export async function fetchTextbookInfoList(): Promise<TextbookInfo[]> {
  const pdfDir = path.join(process.cwd(), "public", "pdf");
  const fileNames = await fs.readdir(pdfDir);
  return fileNames.map(fn => ({
    fileName: fn,
    filePath: `/pdf/${fn}`,
    uriName: fn.replace(/.pdf$/, ""),
    name: decodeURI(fn.replace(/.pdf$/, "")),
  }));
}

export async function fetchTextbookInfo(
  uriName: string
): Promise<TextbookInfo> {
  return {
    fileName: `${uriName}.pdf`,
    filePath: `/pdf/${uriName}.pdf`,
    uriName: uriName,
    name: decodeURI(uriName),
  };
}
