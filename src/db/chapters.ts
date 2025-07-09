import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "./index";
import { chapters, questions, sections } from "./schema";
import { Chapter, ChapterSchema } from "@/types/Textbook";
import { sectionIncludes } from "./sections";

export const chapterIncludes = {
  questions: {
    columns: {
      id: true,
      num: true,
    },
    where: isNull(questions.sectionId),
    orderBy: [asc(questions.num)],
  },
  sections: {
    orderBy: [asc(sections.num)],
    with: sectionIncludes,
  },
};

export async function fetchChapter(chapterId: number): Promise<Chapter | null> {
  const chapter = await db.query.chapters.findFirst({
    where: eq(chapters.id, chapterId),
    with: chapterIncludes,
  });
  if (!chapter) return null;
  return ChapterSchema.parse(chapter);
}

export async function findChapterByNumAndTextbook(
  num: number,
  textbookId: number
): Promise<Chapter | null> {
  const chapter = await db.query.chapters.findFirst({
    where: and(
      eq(chapters.num, num),
      eq(chapters.textbookId, textbookId)
    ),
    with: chapterIncludes,
  });
  if (!chapter) return null;
  return ChapterSchema.parse(chapter);
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
    .values(input)
    .returning();
  return {
    ...chapter,
    sections: [],
    questions: [],
  };
}
