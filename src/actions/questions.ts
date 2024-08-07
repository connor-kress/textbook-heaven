"use server";

import pool from "@/lib/db";
import { Question, QuestionSchema } from "@/types/Question";
import { Textbook } from "@/types/Textbook";
import { revalidatePath } from "next/cache";

export async function fetchQuestion(
  questionId: number,
): Promise<Question | null> {
  const query = `
    SELECT
      q.id AS question_id,
      q.author AS question_author,
      q.post_date AS question_post_date,
      q.num AS question_num,
      q.body AS question_body,
      q.chapter_id as question_chapter_id,
      r.id AS reply_id,
      r.author AS reply_author,
      r.post_date AS reply_post_date,
      r.likes AS reply_likes,
      r.dislikes AS reply_dislikes,
      r.body AS reply_body,
      r.parent_reply_id AS reply_parent_reply_id
    FROM questions q
    LEFT JOIN replies r ON r.question_id = q.id
    WHERE q.id = $1;
  `;
  let res = null;
  try {
    res = await pool.query(query, [questionId]);
    if (res.rows.length === 0) {
      throw new Error("No questions found");
    }
  } catch {
    return null;
  }
  const row = res.rows[0];
  const question: any = {
    id: row.question_id,
    author: row.question_author,
    postDate: row.question_post_date,
    num: row.question_num,
    body: row.question_body,
    chapterId: row.question_chapter_id,
    comments: [],
  };
  const replyMap = new Map<number, any>(); // type validation at end
  res.rows.forEach(row => {
    if (!row.reply_id) return;
    const reply: any = {
      id: row.reply_id,
      author: row.reply_author,
      postDate: row.reply_post_date,
      likes: row.reply_likes,
      dislikes: row.reply_dislikes,
      body: row.reply_body,
      replies: [],
    }
    replyMap.set(reply.id, reply);
    if (row.reply_parent_reply_id) {
      const parentReply = replyMap.get(row.reply_parent_reply_id);
      if (parentReply) {
        parentReply.replies.push(reply);
      } else {
        // Parent replies should always have a lower id
        // and thus be added to the structure first
        console.dir(replyMap, { depth: null });
        throw new Error(
          `Parent reply id ${row.reply_parent_reply_id} not found`
        );
      }
    } else {
      question.comments.push(reply);
    }
  })

  const ret = QuestionSchema.parse(question);
  console.dir(ret, {depth: null});
  return ret;
}

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

      INSERT INTO questions (author, num, body, chapter_id, post_date)
      VALUES ($4, $5, $6, (SELECT id FROM new_chapter), CURRENT_TIMESTAMP)
      RETURNING id;
    `;
    args = [chapterTitle, chapterNum, textbook.id,
            "anonymous", questionNum, questionBody];
  } else {
    query = `
      INSERT INTO questions (author, num, body, chapter_id, post_date)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      RETURNING id;
    `;
    args = ["Anonymous", questionNum, questionBody, chapter.id];
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
