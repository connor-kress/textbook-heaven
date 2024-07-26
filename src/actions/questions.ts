"use server";

import { mockChapterData, mockQuestionData } from "@/lib/mockData";
import Question from "@/types/Question";
import { randomInt } from "crypto";
import { revalidatePath } from "next/cache";

export async function fetchQuestion(
  questionId: number,
): Promise<Question | null> {
  const res = mockQuestionData.get(questionId);
  if (typeof res === "undefined") {
    return null;
  }
  return res;
}

export async function postQuestion(
  chapterNum: number,
  chapterName: string,
  num: number,
  text: string,
): Promise<number | null> {
  const question: Question = {
    id: randomInt(9999),
    translator: "anonymous",
    chapter: chapterNum,
    num,
    text,
    comments: [],
  };
  mockQuestionData.set(question.id, question);
  const questionInfo = {
    id: question.id,
    num: question.num,
  };
  const chapter = mockChapterData.find(c => c.num === question.chapter);
  if (chapter === undefined) {
    if (chapterName === null) {
      mockQuestionData.delete(question.id);
      return null;
    }
    mockChapterData.push({
      num: question.chapter,
      name: chapterName,
      questions: [questionInfo],
    });
  } else {
    if (chapter.questions.find(q => q.num == question.num)) {
      mockQuestionData.delete(question.id);
      return null;
    }
    chapter.questions.push(questionInfo);
  }
  revalidatePath("/textbooks");
  console.log(mockChapterData)
  return question.id;
}
