"use server";

import { Question } from "@/types/Question";
import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";

export async function fetchQuestion(
  questionId: number,
): Promise<Question | null> {
  // ...
}

export async function postQuestion(
  chapterNum: number,
  chapterName: string,
  num: number,
  text: string,
): Promise<number | null> {
  if (chapter === undefined) {
    if (chapterName === null) {
      return null;
    }
  } else {
    if (chapter.questions.find(q => q.num == question.num)) {
      return null;
    }
  }
  revalidatePath("/textbooks");
  return question.id;
}
