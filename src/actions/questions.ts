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

// Create a Chapter
export async function createChapterEndpoint({
  chapterNum,
  chapterTitle,
  textbook,
}: {
  chapterNum: number;
  chapterTitle: string;
  textbook: Textbook;
}): Promise<{ id: number } | { error: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }
  if (!chapterTitle) {
    return { error: "Chapter title not provided" };
  }
  let chapter = await findChapterByNumAndTextbook(chapterNum, textbook.id);
  if (chapter) {
    return { id: chapter.id };
  }
  chapter = await createChapter({
    title: chapterTitle,
    num: chapterNum,
    textbookId: textbook.id,
  });
  if (!chapter) {
    return { error: "Failed to create chapter" };
  }
  revalidatePath(`/textbooks/${textbook.baseFileName}`);
  return { id: chapter.id };
}

// Create a Section
export async function createSectionEndpoint({
  sectionNum,
  sectionTitle,
  chapterId,
  textbook,
}: {
  sectionNum: number;
  sectionTitle: string;
  chapterId: number;
  textbook: Textbook;
}): Promise<{ id: number } | { error: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }
  if (!sectionTitle) {
    return { error: "Section title not provided" };
  }
  let section = await findSectionByNumAndChapter(sectionNum, chapterId);
  if (section) {
    return { id: section.id };
  }
  section = await createSection({
    title: sectionTitle,
    num: sectionNum,
    chapterId,
  });
  if (!section) {
    return { error: "Failed to create section" };
  }
  revalidatePath(`/textbooks/${textbook.baseFileName}`);
  return { id: section.id };
}

// Post a Question
export async function postQuestion({
  questionNum,
  questionBody,
  textbook,
  chapterId,
  sectionId,
}: {
  questionNum: number;
  questionBody: string;
  textbook: Textbook;
  chapterId: number;
  sectionId: number | null;
}): Promise<{id: number} | { error: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  let question;
  try {
    question = await createQuestion({
      authorId: session.user.id,
      num: questionNum,
      body: questionBody,
      chapterId,
      sectionId: sectionId ?? null,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }

  revalidatePath(`/textbooks/${textbook.baseFileName}`);
  return { id: question.id };
}