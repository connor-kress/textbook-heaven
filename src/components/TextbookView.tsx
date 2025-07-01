"use client";

import QuestionSelector from "./QuestionSelector";
import { QuestionDetails } from "./QuestionDetails";
import { useSearchParams } from "next/navigation";
import { Textbook } from "@/types/Textbook";
import { NewQuestionForm } from "./NewQuestionForm";
import { NewChapterForm } from "./NewChapterForm";
import { NewSectionForm } from "./NewSectionForm";
import { TextbookHomePage } from "./TextbookHomePage";

export default function TextbookView(
  { textbook }: {textbook: Textbook}
) {
  const params = useSearchParams()
  const questionId = params.get("questionId");
  const newQuestion = params.get("newQuestion");
  const newChapter = params.get("newChapter");
  const newSection = params.get("newSection");
  let body = null;
  if (newQuestion !== null) {
    body = <NewQuestionForm textbook={textbook} />;
  } else if (newChapter !== null) {
    body = <NewChapterForm textbook={textbook} />;
  } else if (newSection !== null) {
    body = <NewSectionForm textbook={textbook} />;
  } else if (questionId === null) {
    body = <TextbookHomePage textbook={textbook} />;
  } else {
    body = <QuestionDetails textbook={textbook} />;
  }
  return (
    <div className="flex flex-col">
      <QuestionSelector textbook={textbook} />
      <div className="mx-[5%] lg:ml-[3%] my-4">
        {body}
      </div>
    </div>
  );
} 