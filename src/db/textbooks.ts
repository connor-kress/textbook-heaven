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

export type CreateTextbookInput = {
  title: string;
  author: string;
  description: string | null;
  slug: string;
};

export async function createTextbook(
  input: CreateTextbookInput
): Promise<Textbook> {
  const [row] = await db
    .insert(textbooks)
    .values({
      title: input.title,
      author: input.author,
      description: input.description,
      slug: input.slug,
      fileName: null,
      coverImagePath: null,
    })
    .returning();

  return {
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description,
    slug: row.slug,
    fileName: row.fileName,
    coverImagePath: row.coverImagePath,
    chapters: [],
  };
}
