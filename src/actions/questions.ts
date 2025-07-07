"use server";

import { createChapter as createChapterDb, findChapterByNumAndTextbook } from "@/db/chapters";
import { createQuestion, updateQuestion, deleteQuestion as deleteQuestionDb } from "@/db/questions";
import { createSection, findSectionByNumAndChapter } from "@/db/sections";
import { auth } from "@/lib/auth";
import { tbUrl } from "@/lib/utils";
import { Textbook } from "@/types/Textbook";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Create a Chapter
export async function createChapter({
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
  chapter = await createChapterDb({
    title: chapterTitle,
    num: chapterNum,
    textbookId: textbook.id,
  });
  if (!chapter) {
    return { error: "Failed to create chapter" };
  }
  revalidatePath(tbUrl(textbook));
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
  revalidatePath(tbUrl(textbook));
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
      sectionId,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }

  revalidatePath(tbUrl(textbook));
  return { id: question.id };
}

// Edit a Question
export async function editQuestion({
  questionId,
  questionBody,
  textbook,
}: {
  questionId: number;
  questionBody: string;
  textbook: Textbook;
}): Promise<null | { error: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await updateQuestion({
      id: questionId,
      authorId: session.user.id,
      body: questionBody,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }

  revalidatePath(tbUrl(textbook));
  return null;
}

// Delete a Question
export async function deleteQuestion({
  questionId,
  textbook,
}: {
  questionId: number;
  textbook: Textbook;
}): Promise<null | { error: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }

  try {
    await deleteQuestionDb({
      id: questionId,
      authorId: session.user.id,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }

  revalidatePath(tbUrl(textbook));
  return null;
}