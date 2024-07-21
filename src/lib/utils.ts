import { promises as fs } from "fs"
import path from "path"
import { TextbookInfo } from '@/types/TextbookInfo';
import { mockChapterData } from "./mockData";

export async function fetchTextbookInfoList(): Promise<TextbookInfo[]> {
  const pdfDir = path.join(process.cwd(), "public", "pdf");
  const fileNames = await fs.readdir(pdfDir);
  const uriNames = fileNames.map(name => name.replace(/.pdf$/, ""));
  return await Promise.all(uriNames.map(name => fetchTextbookInfo(name)));
}

export async function fetchTextbookInfo(
  uriName: string
): Promise<TextbookInfo> {
  return {
    chapters: mockChapterData,
    fileName: `${uriName}.pdf`,
    filePath: `/pdf/${uriName}.pdf`,
    uriName: uriName,
    name: decodeURI(uriName),
  };
}
