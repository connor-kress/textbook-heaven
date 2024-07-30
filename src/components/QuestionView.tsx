"use client";

import QuestionSelector from "./QuestionSelector";
import { QuestionDetails } from "./QuestionDetails";
import { useSearchParams } from "next/navigation";
import { Textbook } from "@/types/Textbook";
import { NewQuestionForm } from "./NewQuestionForm";

export default function QuestionView(
  { textbook }: {textbook: Textbook}
) {
  const params = useSearchParams()
  const questionId = params.get("questionId");
  const newQuestion = params.get("newQuestion");
  let body = null;
  if (newQuestion !== null) {
    body = <NewQuestionForm textbook={textbook} />;
  } else if (questionId === null) {
    body = <p>No question</p>;
  } else {
    body = <QuestionDetails textbook={textbook} />;
  }
  return (
    <div className="flex flex-col">
      <QuestionSelector textbook={textbook} />
      {body}
    </div>
  );
}
