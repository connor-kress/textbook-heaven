import pool from "@/lib/db";
import { Question, QuestionSchema } from "@/types/Question";

export async function getQuestionById(
  questionId: number,
): Promise<Question | null> {
  const query = `
    SELECT
      q.id AS question_id,
      q.author_id AS question_author_id,
      q.post_date AS question_post_date,
      q.num AS question_num,
      q.body AS question_body,
      q.chapter_id as question_chapter_id,
      r.id AS reply_id,
      r.author_id AS reply_author_id,
      r.post_date AS reply_post_date,
      r.body AS reply_body,
      r.parent_reply_id AS reply_parent_reply_id,
      uq.name AS question_author_name,
      ur.name AS reply_author_name
    FROM questions q
    LEFT JOIN replies r ON r.question_id = q.id
    LEFT JOIN "user" uq ON q.author_id = uq.id
    LEFT JOIN "user" ur ON r.author_id = ur.id
    WHERE q.id = $1
    ORDER BY r.id ASC;
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
    author_id: row.question_author_id,
    author_name: row.question_author_name,
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
      author_id: row.reply_author_id,
      author_name: row.reply_author_name,
      postDate: row.reply_post_date,
      likes: 0,
      dislikes: 0,
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

