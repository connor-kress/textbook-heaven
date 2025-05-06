import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { chapters } from "./schema";

export async function findChapterByNumAndTextbook(
  num: number,
  textbookId: number
) {
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
  return rows[0] ?? null;
}

type CreateChapterInput = {
  title: string;
  num: number;
  textbookId: number;
};

export async function createChapter(input: CreateChapterInput) {
  const [chapter] = await db
    .insert(chapters)
    .values({
      title: input.title,
      num: input.num,
      textbookId: input.textbookId,
    })
    .returning();
  return chapter;
}
