"use server";

import { auth } from "@/lib/auth";
import pool from "@/lib/db";
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
      headers: headers(),
  })
  if (!session) {
    return { error: "Unauthorized" };
  }
  const query = `
    INSERT INTO replies (author_id, body, parent_reply_id, question_id,
                         post_date)
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP);
  `;
  const args = [session.user.id, body, parentReplyId, questionId];
  try {
    await pool.query(query, args);
  } catch (err: any) {
    const message =
      typeof err?.message === "string"
        ? err.message
        : typeof err === "string"
          ? err
          : "Unknown error";
    return { error: message };
  }
  revalidatePath(`/textbooks/${textbook.baseFileName}`);
  return null;
}
