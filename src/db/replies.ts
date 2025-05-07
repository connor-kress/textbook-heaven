import { db } from "./index";
import { replies } from "./schema";

export type CreateReplyInput = {
  authorId: string;
  body: string;
  parentReplyId: number | null;
  questionId: number;
};

export async function createReply(input: CreateReplyInput) {
  const [reply] = await db
    .insert(replies)
    .values({
      ...input,
      postDate: new Date().toISOString(),
    })
    .returning();
  return reply;
}
