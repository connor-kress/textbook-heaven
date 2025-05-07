import { Question, QuestionSchema } from "@/types/Question";
import { db } from "./index";
import { questions, replies, user } from "./schema";
import { aliasedTable, eq } from "drizzle-orm";

type CreateQuestionInput = {
  authorId: string;
  num: number;
  body: string;
  chapterId: number;
};

export async function createQuestion(input: CreateQuestionInput) {
  const [question] = await db
    .insert(questions)
    .values({
      authorId: input.authorId,
      num: input.num,
      body: input.body,
      chapterId: input.chapterId,
      postDate: new Date().toISOString(),
    })
    .returning();
  return question;
}

export async function getQuestionById(
  questionId: number,
): Promise<Question | null> {
  const questionUser = aliasedTable(user, "uq");
  const replyUser = aliasedTable(user, "ur");

  const rows = await db
    .select({
      question_id: questions.id,
      question_author_id: questions.authorId,
      question_post_date: questions.postDate,
      question_num: questions.num,
      question_body: questions.body,
      question_chapter_id: questions.chapterId,

      reply_id: replies.id,
      reply_author_id: replies.authorId,
      reply_post_date: replies.postDate,
      reply_body: replies.body,
      reply_parent_reply_id: replies.parentReplyId,

      question_author_name: questionUser.name,
      reply_author_name: replyUser.name,
    })
    .from(questions)
    .leftJoin(replies, eq(replies.questionId, questions.id))
    .leftJoin(questionUser, eq(questions.authorId, questionUser.id))
    .leftJoin(replyUser, eq(replies.authorId, replyUser.id))
    .where(eq(questions.id, questionId))
    .orderBy(replies.id);

  if (rows.length === 0) {
    return null;
  }

  const first = rows[0];
  const question: any = {
    id: first.question_id,
    author_id: first.question_author_id,
    author_name: first.question_author_name,
    postDate: first.question_post_date,
    num: first.question_num,
    body: first.question_body,
    chapterId: first.question_chapter_id,
    comments: [],
  };
  const replyMap = new Map<number, any>(); // type validation at end
  rows.forEach(row => {
    if (!row.reply_id) return;
    const reply = {
      id: row.reply_id,
      author_id: row.reply_author_id,
      author_name: row.reply_author_name,
      postDate: row.reply_post_date,
      likes: 1, // TODO: get from likes table
      dislikes: 0,
      body: row.reply_body,
      replies: [],
    }
    replyMap.set(reply.id, reply);
    if (row.reply_parent_reply_id) {
      const parentReply = replyMap.get(row.reply_parent_reply_id);
      // Parent replies should always have a lower id
      // and thus be added to the structure first
      if (!parentReply) {
        console.dir(replyMap, { depth: null });
        throw new Error(
          `Parent reply id ${row.reply_parent_reply_id} not found`
        );
      }
      parentReply.replies.push(reply);
    } else {
      question.comments.push(reply);
    }
  })

  const ret = QuestionSchema.parse(question);
  console.dir(ret, {depth: null});
  return ret;
}
