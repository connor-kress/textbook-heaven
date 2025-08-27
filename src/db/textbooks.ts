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
  const textbookArray = await db.query.textbooks.findMany({
    orderBy: [asc(textbooks.id)],
    with: textbookIncludes,
  });
  return TextbookSchema.array().parse(textbookArray);
}

export async function fetchTextbook(
  slug: string
): Promise<Textbook | null> {
  const textbook = await db.query.textbooks.findFirst({
    where: eq(textbooks.slug, slug),
    with: textbookIncludes,
  });
  if (!textbook) return null;
  return TextbookSchema.parse(textbook);
}
