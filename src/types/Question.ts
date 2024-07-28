import { z } from "zod"

export type Reply = {
  id: number,
  author: string, // TODO: User
  postDate: Date,
  likes: number,
  dislikes: number,
  body: string,
  replies: Reply[],
}

export type Question = {
  id: number,
  author: string, // TODO: User
  postDate: Date,
  chapter: number,
  num: number,
  body: string,
  comments: Reply[],
}

const ReplySchema: z.ZodType<Reply> = z.object({
  id: z.number(),
  author: z.string(),
  postDate: z.date(),
  likes: z.number(),
  dislikes: z.number(),
  body: z.string(),
  replies: z.lazy(() => ReplySchema.array()),
});

export const QuestionSchema = z.object({
  id: z.number(),
  author: z.string(),
  postDate: z.date(),
  chapter: z.number(),
  num: z.number(),
  body: z.string(),
  comments: ReplySchema.array(),
});
