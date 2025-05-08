import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { sections } from "./schema";

export async function findSectionByNumAndChapter(
  num: number,
  chapterId: number
) {
  const rows = await db
    .select()
    .from(sections)
    .where(
      and(
        eq(sections.num, num),
        eq(sections.chapterId, chapterId)
      )
    )
    .limit(1);
  if (!rows[0]) return null;
  return rows[0];
}

type CreateSectionInput = {
  title: string;
  num: number;
  chapterId: number;
};

export async function createSection(
  input: CreateSectionInput
) {
  const [section] = await db
    .insert(sections)
    .values(input)
    .returning();
  return section;
}
