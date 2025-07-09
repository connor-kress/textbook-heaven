"use server";

import { createChapter as createChapterDb, findChapterByNumAndTextbook } from "@/db/chapters";
import { createQuestion, updateQuestion, deleteQuestion as deleteQuestionDb } from "@/db/questions";
import { createSection as createSectionDb, findSectionByNumAndChapter } from "@/db/sections";
import { auth } from "@/lib/auth";
import { tbUrl } from "@/lib/utils";
import { Question } from "@/types/Question";
import { Chapter, Section, Textbook } from "@/types/Textbook";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

// Create a chapter
export async function createChapter({
  chapterNum,
  chapterTitle,
  textbook,
}: {
  chapterNum: number;
  chapterTitle: string;
  textbook: Textbook;
}): Promise<Chapter | { error: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }
  if (chapterTitle === "") {
    return { error: "Chapter title not provided" };
  }
  let chapter = await findChapterByNumAndTextbook(chapterNum, textbook.id);
  if (chapter) return chapter;
  try {
    chapter = await createChapterDb({
      title: chapterTitle,
      num: chapterNum,
      textbookId: textbook.id,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }
  if (!chapter) {
    return { error: "Failed to create chapter" };
  }
  revalidatePath(tbUrl(textbook));
  console.log(chapter);
  return chapter;
}

// Create a section
export async function createSection({
  sectionNum,
  sectionTitle,
  chapterId,
  textbook,
}: {
  sectionNum: number;
  sectionTitle: string;
  chapterId: number;
  textbook: Textbook;
}): Promise<Section | { error: string }> {
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
  if (section) return section;
  try {
    section = await createSectionDb({
      title: sectionTitle,
      num: sectionNum,
      chapterId,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }
  if (!section) {
    return { error: "Failed to create section" };
  }
  revalidatePath(tbUrl(textbook));
  return section;
}

// Post a question
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
}): Promise<Question | { error: string }> {
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
  return question;
}

// Edit a question
export async function editQuestion({
  questionId,
  questionBody,
  textbook,
}: {
  questionId: number;
  questionBody: string;
  textbook: Textbook;
}): Promise<Question | { error: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }
  let question;
  try {
    question = await updateQuestion({
      id: questionId,
      authorId: session.user.id,
      body: questionBody,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }
  revalidatePath(tbUrl(textbook));
  return question;
}

// Delete a question
export async function deleteQuestion({
  questionId,
  textbook,
}: {
  questionId: number;
  textbook: Textbook;
}): Promise<{ id: number } | { error: string }> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { error: "Unauthorized" };
  }
  let deletedId;
  try {
    deletedId = await deleteQuestionDb({
      id: questionId,
      authorId: session.user.id,
    });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }
  revalidatePath(tbUrl(textbook));
  return { id: deletedId };
}
