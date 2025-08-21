"use client";

import QuestionSelector from "./QuestionSelector";
import { QuestionDetails } from "./QuestionDetails";
import { useSearchParams } from "next/navigation";
import { Textbook } from "@/types/Textbook";
import { NewQuestionForm } from "./NewQuestionForm";
import { NewChapterForm } from "./NewChapterForm";
import { NewSectionForm } from "./NewSectionForm";
import { TextbookHomePage } from "./TextbookHomePage";
import { useQuestionId } from "@/hooks/useQuestionId";
import { useState, useEffect } from "react";
import { useSeedTextbook } from "@/lib/textbook-store";

export default function TextbookView(
  { textbook }: {textbook: Textbook}
) {
  const params = useSearchParams();
  const [questionId, setQuestionId] = useQuestionId();
  const [isHydrated, setIsHydrated] = useState(false);
  // Seed the textbooks store with SSR textbook and read from it
  const textbookFromStore = useSeedTextbook(textbook);
  
  // Wait for hydration to complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const newQuestion = params.get("newQuestion");
  const newChapter = params.get("newChapter");
  const newSection = params.get("newSection");
  
  let body = null;
  
  // Show SSR data during initial hydration to avoid mismatches
  if (!isHydrated) {
    body = (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{textbook.title}</h1>
            {textbook.author && (
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                by {textbook.author}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  } else if (newQuestion !== null) {
    body = <NewQuestionForm textbook={textbookFromStore} setQuestionId={setQuestionId} />;
  } else if (newChapter !== null) {
    body = <NewChapterForm textbook={textbookFromStore} setQuestionId={setQuestionId} />;
  } else if (newSection !== null) {
    body = <NewSectionForm textbook={textbookFromStore} setQuestionId={setQuestionId}/>;
  } else if (questionId === null) {
    body = (
      <TextbookHomePage
        textbook={textbookFromStore}
        setQuestionId={setQuestionId}
      />
    );
  } else {
    body = (
      <QuestionDetails
        textbook={textbookFromStore}
        questionId={questionId}
        setQuestionId={setQuestionId}
      />
    );
  }
  
  return (
    <div className="flex flex-col">
      <QuestionSelector
        textbook={textbookFromStore}
        questionId={questionId}
        setQuestionId={setQuestionId}
      />
      <div className="mx-[5%] lg:ml-[3%] my-4">
        {body}
      </div>
    </div>
  );
} 