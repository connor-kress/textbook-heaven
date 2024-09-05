import { z } from "zod"

export type Reply = {
  id: number,
  author_id: number,
  author_name: string,
  postDate: Date,
  likes: number,
  dislikes: number,
  body: string,
  replies: Reply[],
}

export type Question = {
  id: number,
  author_id: number,
  author_name: string,
  postDate: Date,
  chapterId: number,
  num: number,
  body: string,
  comments: Reply[],
}

const ReplySchema: z.ZodType<Reply> = z.object({
  id: z.number(),
  author_id: z.number(),
  author_name: z.string(),
  postDate: z.date(),
  likes: z.number(),
  dislikes: z.number(),
  body: z.string(),
  replies: z.lazy(() => ReplySchema.array()),
});

export const QuestionSchema = z.object({
  id: z.number(),
  author_id: z.number(),
  author_name: z.string(),
  postDate: z.date(),
  chapterId: z.number(),
  num: z.number(),
  body: z.string(),
  comments: ReplySchema.array(),
});
