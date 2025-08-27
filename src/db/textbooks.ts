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
  const textbookArray = rawTextbooks.map(textbook => {
    const fileName = textbook.fileName ?? null;
    return {
      ...textbook,
      baseFileName: fileName ? fileName.replace(/\.pdf$/, "") : null,
      filePath: fileName ? `/pdf/${fileName}` : null,
    };
  });
  // console.log(textbookArray);
  return TextbookSchema.array().parse(textbookArray);
}

export async function fetchTextbook(
  slug: string
): Promise<Textbook | null> {
  const rawTextbook = await db.query.textbooks.findFirst({
    where: eq(textbooks.slug, slug),
    with: textbookIncludes,
  });
  if (!rawTextbook) return null;
  const fileName = rawTextbook.fileName ?? null;
  const textbook = {
    ...rawTextbook,
    baseFileName: fileName ? fileName.replace(/\.pdf$/, "") : null,
    filePath: fileName ? `/pdf/${fileName}` : null,
  };
  // console.dir(textbook, { depth: null });
  return TextbookSchema.parse(textbook);
}
