import { z } from "zod"

const QuestionSchema = z.object({
  id: z.number(),
  num: z.number(),
});

export const ChapterSchema = z.object({
  id: z.number(),
  title: z.string().nullable(),
  num: z.number(),
  questions: QuestionSchema.array(),
});

export const TextbookSchema = z.object({
  id: z.number(),
  author: z.string().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  fileName: z.string(),
  baseFileName: z.string(),
  filePath: z.string(),
  chapters: ChapterSchema.array(),
});

export type Chapter = z.infer<typeof ChapterSchema>;
export type Textbook = z.infer<typeof TextbookSchema>;
