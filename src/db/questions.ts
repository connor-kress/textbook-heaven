import { aliasedTable, eq } from "drizzle-orm";
import { db } from "./index";
import { questions, replies, user } from "./schema";
import { Question, QuestionSchema, Reply } from "@/types/Question";

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
      ...input,
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
      question: questions,
      reply: replies,
      questionAuthorName: questionUser.name,
      replyAuthorName: replyUser.name,
    })
    .from(questions)
    // questionUser should be an inner join but drizzle has a bug
    .leftJoin(questionUser, eq(questions.authorId, questionUser.id))
    .leftJoin(replies, eq(replies.questionId, questions.id))
    .leftJoin(replyUser, eq(replies.authorId, replyUser.id))
    .where(eq(questions.id, questionId))
    .orderBy(replies.id);

  if (rows.length === 0) {
    return null;
  }

  const first = rows[0];
  const question: any = {
    id: first.question.id,
    author_id: first.question.authorId,
    author_name: first.questionAuthorName,
    postDate: first.question.postDate,
    num: first.question.num,
    body: first.question.body,
    chapterId: first.question.chapterId,
    comments: [],
  };
  const replyMap = new Map<number, Reply>(); // type validation at end
  for (let row of rows) {
    if (!row.reply) continue;
    const reply: any = {
      id: row.reply.id,
      author_id: row.reply.authorId,
      author_name: row.replyAuthorName,
      postDate: row.reply.postDate,
      likes: 1, // TODO: get from likes table
      dislikes: 0,
      body: row.reply.body,
      replies: [],
    }
    replyMap.set(reply.id, reply);
    if (row.reply.parentReplyId) {
      const parentReply = replyMap.get(row.reply.parentReplyId);
      // Parent replies should always have a lower id
      // and thus be added to the structure first
      if (!parentReply) {
        console.dir(replyMap, { depth: null });
        throw new Error(
          `Parent reply id ${row.reply.parentReplyId} not found`
        );
      }
      parentReply.replies.push(reply);
    } else {
      question.comments.push(reply);
    }
  }

  console.dir(question, {depth: null});
  return QuestionSchema.parse(question);
}
