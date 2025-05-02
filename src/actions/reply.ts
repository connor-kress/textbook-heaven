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
) {
  const session = await auth.api.getSession({
      headers: headers(),
  })
  if (!session) {
    throw new Error("Unauthorized");
  }
  const query = `
    INSERT INTO replies (author_id, body, parent_reply_id, question_id, post_date)
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP);
  `;
  const args = [session.user.id, body, parentReplyId, questionId];
  await pool.query(query, args);
  revalidatePath(`/textbooks/${textbook.baseFileName}`);
}
