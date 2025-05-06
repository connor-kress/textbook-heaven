"use server";

import { createReply } from "@/db/replies";
import { auth } from "@/lib/auth";
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
  revalidatePath(`/textbooks/${textbook.baseFileName}`);
  return null;
}
