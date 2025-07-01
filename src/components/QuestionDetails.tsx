"use client";

import { Question, QuestionSchema } from "@/types/Question";
import { Textbook } from "@/types/Textbook";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ReplyDetails from "./ReplyDetails";
import { MarkdownRenderer } from "./MarkdownRenderer";
import NewReplyForm from "./NewReplyForm";

export function QuestionDetails(
  { textbook }: {textbook: Textbook}
) {
  const params = useSearchParams()
  const questionId = params.get("questionId");
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);

  async function updateQuestion() {
      setLoading(true);
      if (typeof questionId !== "string") {
        setQuestion(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/questions/${questionId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const questionData = QuestionSchema.parse(await res.json());
        setQuestion(questionData);
      } catch (err) {
        console.error(err);
        setQuestion(null);
      }
      setLoading(false);
  }
  useEffect(() => {
    updateQuestion();
  }, [questionId]);

if (loading) {
    return (
      <div className="text-2xl">
        Loading question...
      </div>
    );
  } else if (question === null) {
    return (
      <div className="text-2xl">
        No question data found.
      </div>
    );
  }
  const chapter =
    textbook.chapters.find(c => c.id === question.chapterId);
  if (chapter === undefined) {
    throw new Error("Chapter data cannot be found for question");
  }
  const section = question.sectionId
    ? chapter.sections.find(s => s.id === question.sectionId) ?? null
    : null;
  
  const chapterTitle = `Chapter ${chapter.num}: ${chapter.title}`;
  const sectionTitle = section ? `Section ${section.num}: ${section.title}` : null;
  const questionTitle = question.sectionId === null && chapter.sections.length > 0 
    ? `Review Question ${question.num}`
    : `Question ${question.num}`;

  const shouldSplit = chapterTitle.length > 40 || (sectionTitle && sectionTitle.length > 35);

  return (
    <>
      <div className="mb-4">
        <div className={`flex ${shouldSplit ? 'flex-col' : 'flex-row items-center'} gap-1`}>
          <h1 className="text-xl font-semibold">
            {chapterTitle}
          </h1>
          {section && (
            <h2 className="text-lg text-neutral-600 dark:text-neutral-500">
              {shouldSplit ? sectionTitle : `- ${sectionTitle}`}
            </h2>
          )}
        </div>
        <div className="mt-1">
          <h2 className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
            {questionTitle}
          </h2>
        </div>
      </div>
      <MarkdownRenderer text={question.body}/>
      <button
        onClick={() => setShowCommentForm(prev => !prev)}
        className="text-blue-500 hover:underline mb-2"
      >
        { showCommentForm ? "Close Form" : "New Reply"}
      </button>
      <h2 className="mb-4">
        {question.comments.length} Replies:
      </h2>
      <div className="flex flex-col items-start gap-10">
        {
          showCommentForm &&
          <div className="w-full">
            <NewReplyForm
              textbook={textbook}
              question={question}
              parentReplyId={null}
            />
          </div>
        }
        {question?.comments.map((c, i) => (
          <ReplyDetails
            key={i}
            textbook={textbook}
            reply={c}
            question={question}
          />
        ))}
      </div>
    </>
  );
}
