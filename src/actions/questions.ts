"use server";

import { mockQuestionData } from "@/lib/mockData";
import Question from "@/types/Question";

export async function fetchQuestionData(
  _questionId: number,
): Promise<Question> {
  return mockQuestionData;
}
