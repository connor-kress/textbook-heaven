import { promises as fs } from "fs"
import path from "path"
import Textbook from '@/types/Textbook';
import Link from 'next/link'

export const metadata = {
  title: "Available Textbooks - Textbook Heaven",
  description: "A list of available textbooks to post and view question answers.",
};

async function fetchTextbooks() {
  const pdfDir = path.join(process.cwd(), "public", "pdf");
  const fileNames = await fs.readdir(pdfDir);
  return fileNames.map(fn => ({
    fileName: fn,
    filePath: `/pdf/${fn}`,
    uriName: fn.replace(/.pdf$/, ""),
    name: decodeURI(fn.replace(/.pdf$/, "")),
  }));
}

export default async function TextbookListPage() {
  const textbooks: Textbook[] = await fetchTextbooks();
  return (
    <>
      <h1>Available Textbooks:</h1>
      {
        textbooks.map((tb, i) =>
          <Link href={`/textbooks/${tb.uriName}`} key={i}><h3>{tb.name}</h3></Link>
        )
      }
    </>
  );
}
