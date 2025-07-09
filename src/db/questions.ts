import { eq, and } from "drizzle-orm";
import { db } from "./index";
import { questions, replies } from "./schema";
import { Question, QuestionSchema } from "@/types/Question";
import { buildReplyTree } from "./replies";

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

function convertDbQuestion(question: any): Question {
  return QuestionSchema.parse({
    ...question,
    author: {
      ...question.user,
      createdAt: new Date(question.user.createdAt),
    },
    postDate: new Date(question.postDate),
    replies: [],
  });
}

export async function fetchQuestion(
  questionId: number,
): Promise<Question | null> {
  const dbQuestion = await db.query.questions.findFirst({
    where: eq(questions.id, questionId),
    with: { user: true },
  });
  if (!dbQuestion) {
    return null;
  }

  // Fetch all replies for this question
  const allReplies = await db.query.replies.findMany({
    where: eq(replies.questionId, questionId),
    with: { user: true },
  });

  const question = convertDbQuestion(dbQuestion);
  question.replies = buildReplyTree(allReplies);
  return question;
}

export async function createQuestion(input: CreateQuestionInput): Promise<Question> {
  const [question] = await db
    .insert(questions)
    .values(input)
    .returning();
  let completeQuestion = await fetchQuestion(question.id);
  if (!completeQuestion) {
    throw new Error("Failed to create question")
  }
  return completeQuestion;
}

export async function updateQuestion(input: UpdateQuestionInput): Promise<Question> {
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
  let completeQuestion = await fetchQuestion(question.id);
  if (!completeQuestion) {
    throw new Error("Failed to update question")
  }
  return completeQuestion;
}

export async function deleteQuestion(input: DeleteQuestionInput): Promise<number> {
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
  return question.id;
}
