import { db } from "./index";
import { questions } from "./schema";

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
