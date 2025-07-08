import { db } from "./index";
import { replies, user } from "./schema";
import { eq, and } from "drizzle-orm";
import { Reply } from "@/types/Question";

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

export async function createReply(input: CreateReplyInput): Promise<Reply> {
  const [reply] = await db
    .insert(replies)
    .values(input)
    .returning();

  const completeReply = await db.query.replies.findFirst({
    where: eq(replies.id, reply.id),
    with: { user: true },
  });
  if (!completeReply) {
    throw new Error("Failed to create reply");
  }

  return {
    ...completeReply,
    author: {
      ...completeReply.user!,
      createdAt: new Date(completeReply.user!.createdAt),
    },
    postDate: new Date(completeReply.postDate),
    replies: [],
    likes: 0,
    dislikes: 0,
  };
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
