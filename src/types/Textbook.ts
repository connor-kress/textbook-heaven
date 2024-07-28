import { z } from "zod"

export type Chapter = {
  id: number,
  title: string | null,
  num: number,
  questions: {
    id: number,
    num: number,
  }[],
}

export type Textbook = {
  id: number,
  title: string | null,
  author: string | null,
  description: string | null,
  fileName: string,
  baseFileName: string,
  filePath: string,
  chapters: Chapter[],
}

const QuestionSchema = z.object({
  id: z.number(),
  num: z.number(),
});

const ChapterSchema = z.object({
  id: z.number(),
  title: z.string().nullable(),
  num: z.number(),
  questions: QuestionSchema.array(),
});

export const TextbookSchema: z.ZodType<Textbook> = z.object({
  id: z.number(),
  author: z.string().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  fileName: z.string(),
  baseFileName: z.string(),
  filePath: z.string(),
  chapters: ChapterSchema.array(),
});
