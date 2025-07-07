"use server";

import { createReply, updateReply, deleteReply } from "@/db/replies";
import { auth } from "@/lib/auth";
import { tbUrl } from "@/lib/utils";
import { Textbook } from "@/types/Textbook";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function postReply(
  textbook: Textbook,
  body: string,
  parentReplyId: number | null,
  questionId: number,
): Promise<null | { error: string }> {
  const session = await auth.api.getSession({
      headers: await headers(),
  })
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await createReply({
      authorId: session.user.id,
      body,
      parentReplyId,
      questionId,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }
  revalidatePath(tbUrl(textbook));
  return null;
}

export async function editReply(
  textbook: Textbook,
  replyId: number,
  body: string,
): Promise<null | { error: string }> {
  const session = await auth.api.getSession({
      headers: await headers(),
  })
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await updateReply({
      id: replyId,
      authorId: session.user.id,
      body,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }
  revalidatePath(tbUrl(textbook));
  return null;
}

export async function removeReply(
  textbook: Textbook,
  replyId: number,
): Promise<null | { error: string }> {
  const session = await auth.api.getSession({
      headers: await headers(),
  })
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await deleteReply({
      id: replyId,
      authorId: session.user.id,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }
  revalidatePath(tbUrl(textbook));
  return null;
}
