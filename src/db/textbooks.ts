import { asc, eq } from "drizzle-orm";
import { db } from "./index";
import { chapters, textbooks } from "./schema"
import { Textbook, TextbookSchema } from '@/types/Textbook';
import { chapterIncludes } from "./chapters";

const textbookIncludes = {
  chapters: {
    with: chapterIncludes,
    orderBy: [asc(chapters.num)],
  },
};

export async function fetchTextbooks(): Promise<Textbook[]> {
  const rawTextbooks = await db.query.textbooks.findMany({
    orderBy: [asc(textbooks.id)],
    with: textbookIncludes,
  });
  const textbookArray = rawTextbooks.map(textbook => ({
    ...textbook,
    baseFileName : textbook.fileName.replace(/.pdf$/, ""),
    filePath: `/pdf/${textbook.fileName}`,
  }));
  // console.log(textbookArray);
  return TextbookSchema.array().parse(textbookArray);
}

export async function fetchTextbook(
  baseFileName: string
): Promise<Textbook | null> {
  const rawTextbook = await db.query.textbooks.findFirst({
    where: eq(textbooks.fileName, `${baseFileName}.pdf`),
    with: textbookIncludes,
  });
  if (!rawTextbook) return null;
  const textbook = {
    ...rawTextbook,
    baseFileName : rawTextbook.fileName.replace(/.pdf$/, ""),
    filePath: `/pdf/${rawTextbook.fileName}`,
  };
  // console.dir(textbook, { depth: null });
  return TextbookSchema.parse(textbook);
}
