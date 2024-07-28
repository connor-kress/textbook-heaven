"use client";

import QuestionSelector from "./QuestionSelector";
import { QuestionDetails } from "./QuestionDetails";
import { useSearchParams } from "next/navigation";
import { Chapter } from "@/types/Textbook";
import { NewQuestionForm } from "./NewQuestionForm";

export default function QuestionView({ chapters }: {chapters: Chapter[]}) {
  const params = useSearchParams()
  const questionId = params.get("questionId");
  const newQuestion = params.get("newQuestion");
  let body = null;
  if (newQuestion !== null) {
    body = <NewQuestionForm />;
  } else if (questionId === null) {
    body = <p>No question</p>;
  } else {
    body = <QuestionDetails />;
  }
  return (
    <div className="flex flex-col">
      <QuestionSelector chapters={chapters} />
      {body}
    </div>
  );
}
