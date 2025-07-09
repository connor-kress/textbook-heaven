import { db } from "./index";
import { replies } from "./schema";
import { eq, and } from "drizzle-orm";
import { Reply, ReplySchema } from "@/types/Question";
import { findReplyInTree } from "@/lib/utils";

export type CreateReplyInput = {
  authorId: string;
  body: string;
  parentReplyId: number | null;
  questionId: number;
};

export type UpdateReplyInput = {
  replyId: number;
  authorId: string;
  body: string;
  questionId: number;
};

export type DeleteReplyInput = {
  replyId: number;
  authorId: string;
};

export function convertDbReply(reply: any): Reply {
  return ReplySchema.parse({
    id: reply.id,
    body: reply.body,
    author: {
      ...reply.user,
      createdAt: new Date(reply.user.createdAt),
    },
    postDate: new Date(reply.postDate),
    replies: [],
    likes: 0,
    dislikes: 0,
  });
}

export function buildReplyTree(replies: any[], parentReplyId: number | null = null): Reply[] {
  return replies
    .filter(r => r.parentReplyId === parentReplyId)
    .map(r => ({
      ...convertDbReply(r),
      replies: buildReplyTree(replies, r.id),
    }));
}

export async function fetchReply(replyId: number, questionId: number): Promise<Reply | null> {
  const allReplies = await db.query.replies.findMany({
    where: eq(replies.questionId, questionId),
    with: { user: true },
  });
  const replyTree = buildReplyTree(allReplies);
  const reply = findReplyInTree(replyId, replyTree);
  if (!reply) return null;
  return reply;
}

export async function createReply(input: CreateReplyInput): Promise<Reply> {
  const [dbReply] = await db
    .insert(replies)
    .values(input)
    .returning();
  const reply = await fetchReply(dbReply.id, input.questionId);
  if (!reply) {
    throw new Error("Failed to create reply")
  }
  return reply;
}

export async function updateReply(input: UpdateReplyInput): Promise<Reply> {
  await db
    .update(replies)
    .set({ body: input.body })
    .where(
      and(
        eq(replies.id, input.replyId),
        eq(replies.authorId, input.authorId),
      )
    );
  const reply = await fetchReply(input.replyId, input.questionId);
  if (!reply) {
    throw new Error("Failed to update reply")
  }
  return reply;
}

export async function deleteReply(input: DeleteReplyInput): Promise<number> {
  const [deletedReply] = await db
    .delete(replies)
    .where(
      and(
        eq(replies.id, input.replyId),
        eq(replies.authorId, input.authorId),
      )
    )
    .returning();
  if (!deletedReply) {
    throw new Error("Reply not found or you don't have permission to delete it");
  }
  return deletedReply.id;
}
