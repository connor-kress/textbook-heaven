import { db } from "./index";
import { replies } from "./schema";

export type CreateReplyInput = {
  authorId: string;
  body: string;
  parentReplyId: number | null;
  questionId: number;
};

export async function createReply(input: CreateReplyInput) {
  await db.insert(replies).values({
    authorId: input.authorId,
    body: input.body,
    parentReplyId: input.parentReplyId,
    questionId: input.questionId,
    postDate: new Date().toISOString(),
  }).execute();
}
