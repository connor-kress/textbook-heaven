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
    body = (
      <div className="mx-20 lg:ml-10 my-4">
        <p className="text-2xl">No question selected.</p>
        <p>Click on a chapter above to view questions.</p>
      </div>
    );
  } else {
    body = <QuestionDetails textbook={textbook} />;
  }
  return (
    <div className="flex flex-col">
      {/* 
      <div className="sticky top-0 z-10 bg-white">
        <QuestionSelector textbook={textbook} />
      </div>
      */}
      <QuestionSelector textbook={textbook} />
      {body}
    </div>
  );
}
