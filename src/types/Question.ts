import { z } from "zod"
import { UserSchema } from "./User";

const ReplyBaseSchema = z.object({
  id: z.number(),
  author: UserSchema,
  postDate: z.coerce.date(),
  likes: z.number(),
  dislikes: z.number(),
  body: z.string(),
});

// Because type inference is needed for recursive zod types
export type Reply = z.infer<typeof ReplyBaseSchema> & {
  replies: Reply[],
};
export const ReplySchema: z.ZodType<Reply> = ReplyBaseSchema.extend({
  replies: z.lazy(() => ReplySchema.array()),
});

export const QuestionSchema = z.object({
  id: z.number(),
  author: UserSchema,
  postDate: z.coerce.date(),
  chapterId: z.number(),
  num: z.number(),
  body: z.string(),
  comments: ReplySchema.array(),
});

export type Question = z.infer<typeof QuestionSchema>;
