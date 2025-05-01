"use server";

import pool from "@/lib/db";
import { Textbook } from "@/types/Textbook";
import { revalidatePath } from "next/cache";

export async function postQuestion(
  textbook: Textbook,
  chapterNum: number,
  chapterTitle: string | null,
  questionNum: number,
  questionBody: string,
): Promise<number | null> {
  // TODO: user authentication
  const chapter = textbook.chapters.find(ch => ch.num === chapterNum);
  let query = "";
  let args = [];
  if (!chapter) {
    if (!chapterTitle) return null;
    query = `
      WITH new_chapter AS (
        INSERT INTO chapters (title, num, textbook_id)
        VALUES ($1, $2, $3)
        RETURNING id
      )

      INSERT INTO questions (author_id, num, body, chapter_id, post_date)
      VALUES ($4, $5, $6, (SELECT id FROM new_chapter), CURRENT_TIMESTAMP)
      RETURNING id;
    `;
    args = [chapterTitle, chapterNum, textbook.id,
            2, questionNum, questionBody];
  } else {
    query = `
      INSERT INTO questions (author_id, num, body, chapter_id, post_date)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id;
    `;
    args = [2, questionNum, questionBody, chapter.id];
  }
  let res = null;
  try {
    res = await pool.query(query, args);
  } catch {
    return null;
  }
  const newQuestionId = res.rows[0].id;
  if (typeof newQuestionId !== "number") {
    throw new Error("Unexpected return type");
  }
  revalidatePath(`/textbooks/${textbook.baseFileName}`);
  return newQuestionId;
}
