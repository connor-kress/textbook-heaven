import { z } from "zod"

const QuestionSchema = z.object({
  id: z.number(),
  num: z.number(),
});

export const SectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  num: z.number(),
  questions: QuestionSchema.array(),
});

export const ChapterSchema = z.object({
  id: z.number(),
  title: z.string(),
  num: z.number(),
  sections: SectionSchema.array(),
  questions: QuestionSchema.array(),
});

export const TextbookSchema = z.object({
  id: z.number(),
  author: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  fileName: z.string(),
  baseFileName: z.string(),
  filePath: z.string(),
  chapters: ChapterSchema.array(),
  coverImagePath: z.string().nullable(),
});

export type Section = z.infer<typeof SectionSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
export type Textbook = z.infer<typeof TextbookSchema>;
