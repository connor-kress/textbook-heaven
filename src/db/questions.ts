import { aliasedTable, eq, and } from "drizzle-orm";
import { db } from "./index";
import { questions, replies, user } from "./schema";
import { Question, QuestionSchema, Reply } from "@/types/Question";

type CreateQuestionInput = {
  authorId: string;
  num: number;
  body: string;
  chapterId: number;
  sectionId: number | null;
};

type UpdateQuestionInput = {
  id: number;
  authorId: string;
  body: string;
};

type DeleteQuestionInput = {
  id: number;
  authorId: string;
};

export async function createQuestion(input: CreateQuestionInput) {
  const [question] = await db
    .insert(questions)
    .values(input)
    .returning();
  return question;
}

export async function updateQuestion(input: UpdateQuestionInput) {
  const [question] = await db
    .update(questions)
    .set({ body: input.body })
    .where(
      and(
        eq(questions.id, input.id),
        eq(questions.authorId, input.authorId)
      )
    )
    .returning();
  
  if (!question) {
    throw new Error("Question not found or you don't have permission to edit it");
  }
  
  return question;
}

export async function deleteQuestion(input: DeleteQuestionInput) {
  const [question] = await db
    .delete(questions)
    .where(
      and(
        eq(questions.id, input.id),
        eq(questions.authorId, input.authorId)
      )
    )
    .returning();
  
  if (!question) {
    throw new Error("Question not found or you don't have permission to delete it");
  }
  
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
      questionAuthor: questionUser,
      replyAuthor: replyUser,
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
    ...first.question,
    author: first.questionAuthor!,
    replies: [],
  };
  const replyMap = new Map<number, Reply>(); // type validation at end
  for (let row of rows) {
    if (!row.reply) continue;
    const reply: any = {
      ...row.reply,
      author: row.replyAuthor!,
      likes: 1, // TODO: get from likes table
      dislikes: 0,
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
      question.replies.push(reply);
    }
  }

  const validQuestion = QuestionSchema.parse(question);
  // console.dir(validQuestion, {depth: null});
  return validQuestion;
}
