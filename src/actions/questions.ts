"use server";

import { createChapter, findChapterByNumAndTextbook } from "@/db/chapters";
import { createQuestion } from "@/db/questions";
import { createSection, findSectionByNumAndChapter } from "@/db/sections";
import { auth } from "@/lib/auth";
import { Textbook } from "@/types/Textbook";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

type questionInput = {
  questionNum: number;
  questionBody: string;
  textbook: Textbook;
  chapterNum: number;
  chapterTitle: string | null;
  sectionNum: number | null;
  sectionTitle: string | null;
};

export async function postQuestion({
  questionNum, questionBody, textbook,
  chapterNum, chapterTitle, sectionNum, sectionTitle,
}: questionInput): Promise<number | { error: string }> {
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

  // Find or create the section
  let section = null;
  if (sectionNum) {
    section = await findSectionByNumAndChapter(sectionNum, chapter.id);
    if (!section) {
      if (!sectionTitle) {
        return { error: "Section title not provided" };
      }
      section = await createSection({
        title: sectionTitle,
        num: sectionNum,
        chapterId: chapter.id,
      });
      if (!section) {
        return { error: "Failed to create section" };
      }
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
      sectionId: section ? section.id : null,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }

  revalidatePath(`/textbooks/${textbook.baseFileName}`);
  return question.id;
}
