"use server";

import { mockQuestionData } from "@/lib/mockData";
import Question from "@/types/Question";

export async function fetchQuestionData(
  questionId: number,
): Promise<Question | null> {
  const res = mockQuestionData.get(questionId);
  if (typeof res === "undefined") {
    return null;
  }
  return res;
}
