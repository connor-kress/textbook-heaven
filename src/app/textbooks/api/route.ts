import { promises as fs } from "fs"
import path from "path"
import Textbook from "@/types/Textbook";

export async function GET() {
  const pdfDir = path.join(process.cwd(), "public", "pdf");
  const fileNames = await fs.readdir(pdfDir);
  const textbooks: Textbook[] = fileNames.map(fn => ({
    fileName: fn,
    filePath: `/pdf/${fn}`,
    uriName: fn.replace(/.pdf$/, ""),
    name: decodeURI(fn.replace(/.pdf$/, "")),
  }));
  return Response.json(textbooks);
}
