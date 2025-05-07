import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { chapters } from "./schema";
import { Chapter, ChapterSchema } from "@/types/Textbook";

export async function findChapterByNumAndTextbook(
  num: number,
  textbookId: number
): Promise<Chapter | null> {
  const rows = await db
    .select()
    .from(chapters)
    .where(
      and(
        eq(chapters.num, num),
        eq(chapters.textbookId, textbookId)
      )
    )
    .limit(1);
  if (!rows[0]) return null;
  return ChapterSchema.parse(rows[0]);
}

type CreateChapterInput = {
  title: string;
  num: number;
  textbookId: number;
};

export async function createChapter(
  input: CreateChapterInput
): Promise<Chapter> {
  const [chapter] = await db
    .insert(chapters)
    .values({
      title: input.title,
      num: input.num,
      textbookId: input.textbookId,
    })
    .returning();
  return ChapterSchema.parse(chapter);
}
