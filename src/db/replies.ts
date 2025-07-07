import { db } from "./index";
import { replies } from "./schema";
import { eq, and } from "drizzle-orm";

export type CreateReplyInput = {
  authorId: string;
  body: string;
  parentReplyId: number | null;
  questionId: number;
};

export type UpdateReplyInput = {
  id: number;
  authorId: string;
  body: string;
};

export type DeleteReplyInput = {
  id: number;
  authorId: string;
};

export async function createReply(input: CreateReplyInput) {
  const [reply] = await db
    .insert(replies)
    .values(input)
    .returning();
  return reply;
}

export async function updateReply(input: UpdateReplyInput) {
  const [reply] = await db
    .update(replies)
    .set({ body: input.body })
    .where(
      and(
        eq(replies.id, input.id),
        eq(replies.authorId, input.authorId)
      )
    )
    .returning();
  
  if (!reply) {
    throw new Error("Reply not found or you don't have permission to edit it");
  }
  
  return reply;
}

export async function deleteReply(input: DeleteReplyInput) {
  const [reply] = await db
    .delete(replies)
    .where(
      and(
        eq(replies.id, input.id),
        eq(replies.authorId, input.authorId)
      )
    )
    .returning();
  
  if (!reply) {
    throw new Error("Reply not found or you don't have permission to delete it");
  }
  
  return reply;
}
