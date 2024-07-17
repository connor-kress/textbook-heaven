import { promises as fs } from "fs"
import path from "path"

export async function GET() {
  const pdfDir = path.join(process.cwd(), "public", "pdf");
  const fileNames = await fs.readdir(pdfDir);
  const textbookNames = fileNames.map(name => decodeURI(name.slice(0, -4)));
  return Response.json(textbookNames);
}
