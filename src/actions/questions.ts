"use server";

import { createChapter, findChapterByNumAndTextbook } from "@/db/chapters";
import { createQuestion } from "@/db/questions";
import { auth } from "@/lib/auth";
import { Textbook } from "@/types/Textbook";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function postQuestion(
  textbook: Textbook,
  chapterNum: number,
  chapterTitle: string | null,
  questionNum: number,
  questionBody: string,
): Promise<number | { error: string }> {
  const session = await auth.api.getSession({
      headers: await headers(),
  })
  if (!session) {
    return { error: "Unauthorized" };
  }

  // Find or create the chapter
  let chapter = await findChapterByNumAndTextbook(chapterNum, textbook.id);
  if (!chapter) {
    if (!chapterTitle) {
      return { error: "Chapter title not provided" };
    }
    chapter = await createChapter({
      title: chapterTitle,
      num: chapterNum,
      textbookId: textbook.id,
    });
    if (!chapter) {
      return { error: "Failed to create chapter" };
    }
  }

  // Insert the question
  let question;
  try {
    question = await createQuestion({
      authorId: session.user.id,
      num: questionNum,
      body: questionBody,
      chapterId: chapter.id,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }

  revalidatePath(`/textbooks/${textbook.baseFileName}`);
  return question.id;
}
