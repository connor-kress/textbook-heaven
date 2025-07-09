import { and, asc, eq } from "drizzle-orm";
import { db } from "./index";
import { questions, sections } from "./schema";
import { SectionSchema } from "@/types/Textbook";
import { Section } from "@/types/Textbook";

export const sectionIncludes = {
  questions: {
    columns: {
      id: true,
      num: true,
    },
    orderBy: [asc(questions.num)],
  },
};

export async function findSectionByNumAndChapter(
  num: number,
  chapterId: number
): Promise<Section | null> {
  const section = await db.query.sections.findFirst({
    where: and(
      eq(sections.num, num),
      eq(sections.chapterId, chapterId)
    ),
    with: sectionIncludes,
  });
  if (!section) return null;
  return SectionSchema.parse(section);
}

type CreateSectionInput = {
  title: string;
  num: number;
  chapterId: number;
};

export async function createSection(
  input: CreateSectionInput
): Promise<Section> {
  const [section] = await db
    .insert(sections)
    .values(input)
    .returning();
  return {
    ...section,
    questions: [],
  };
}
