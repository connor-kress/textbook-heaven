"use server";

import pool from "@/lib/db";
import { Textbook } from "@/types/Textbook";
import { revalidatePath } from "next/cache";

export async function postReply(
  textbook: Textbook,
  body: string,
  parentReplyId: number | null,
  questionId: number,
) {
  // TODO: user authentication
  const query = `
    INSERT INTO replies (author, body, parent_reply_id, question_id, post_date)
    VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP);
  `;
  const args = ["Anonymous", body, parentReplyId, questionId];
  await pool.query(query, args);
  revalidatePath(`/textbooks/${textbook.baseFileName}`);
}
