"use server";

import {
  createReply,
  updateReply,
  deleteReply as deleteReplyDb,
} from "@/db/replies";
import { auth } from "@/lib/auth";
import { tbUrl } from "@/lib/utils";
import { Textbook } from "@/types/Textbook";
import { Reply } from "@/types/Question";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Create a reply
export async function postReply(
  textbook: Textbook,
  body: string,
  parentReplyId: number | null,
  questionId: number,
): Promise<Reply | { error: string }> {
  const session = await auth.api.getSession({
      headers: await headers(),
  })
  if (!session) {
    return { error: "Unauthorized" };
  }
  let reply;
  try {
    reply = await createReply({
      authorId: session.user.id,
      body,
      parentReplyId,
      questionId,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }
  revalidatePath(tbUrl(textbook));
  return reply;
}

// Edit a reply
export async function editReply(
  textbook: Textbook,
  replyId: number,
  questionId: number,
  body: string,
): Promise<Reply | { error: string }> {
  const session = await auth.api.getSession({
      headers: await headers(),
  })
  if (!session) {
    return { error: "Unauthorized" };
  }
  let reply;
  try {
    reply = await updateReply({
      replyId,
      questionId,
      authorId: session.user.id,
      body,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }
  revalidatePath(tbUrl(textbook));
  return reply;
}

// Delete a reply and return its ID
export async function deleteReply(
  textbook: Textbook,
  replyId: number,
): Promise<{ id: number } | { error: string }> {
  const session = await auth.api.getSession({
      headers: await headers(),
  })
  if (!session) {
    return { error: "Unauthorized" };
  }
  let deletedId;
  try {
    deletedId = await deleteReplyDb({
      replyId,
      authorId: session.user.id,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }
  revalidatePath(tbUrl(textbook));
  return { id: deletedId };
}
