"use client";

import QuestionSelector from "./QuestionSelector";
import { QuestionDetails } from "./QuestionDetails";
import { useSearchParams } from "next/navigation";
import { ChapterInfo } from "@/types/TextbookInfo";

export default function QuestionView({ chapters }: {chapters: ChapterInfo[]}) {
  const params = useSearchParams()
  const questionId = params.get("questionId");
  const newQuestion = params.get("newQuestion");
  let body = null;
  if (newQuestion !== null) {
    body = <p>New Question: ...</p>;
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
