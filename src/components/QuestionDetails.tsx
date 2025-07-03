"use client";

import { Question, QuestionSchema } from "@/types/Question";
import { Textbook } from "@/types/Textbook";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ReplyDetails from "./ReplyDetails";
import { MarkdownRenderer } from "./MarkdownRenderer";
import NewReplyForm from "./NewReplyForm";
import { getPrevQuestionId, getNextQuestionId } from "@/lib/utils";

function QuestionContent({ question, textbook }: {question: Question, textbook: Textbook}) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  
  const chapter = textbook.chapters.find(c => c.id === question.chapterId);
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
        <div className={`flex ${shouldSplit ? "flex-col" : "flex-row items-center"} gap-1`}>
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

function NavigationButtons({ prevId, nextId, router }: { 
  prevId: number | null; 
  nextId: number | null; 
  router: any;
}) {
  return (
    <div className="flex justify-between mb-6 w-full">
      <button
        className={`px-4 py-2 rounded font-semibold border transition-colors
          ${prevId
            ? "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-900"
            : "bg-neutral-100 text-neutral-400 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-600 dark:border-neutral-800 cursor-not-allowed"}
        `}
        disabled={!prevId}
        onClick={() => prevId && router.push(`?questionId=${prevId}`)}
      >
        Previous Question
      </button>
      <button
        className={`px-4 py-2 rounded font-semibold border transition-colors
          ${nextId
            ? "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-900"
            : "bg-neutral-100 text-neutral-400 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-600 dark:border-neutral-800 cursor-not-allowed"}
        `}
        disabled={!nextId}
        onClick={() => nextId && router.push(`?questionId=${nextId}`)}
      >
        Next Question
      </button>
    </div>
  );
}

export function QuestionDetails(
  { textbook }: {textbook: Textbook}
) {
  const params = useSearchParams()
  const questionId = params.get("questionId");
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const questionIdNum = questionId ? parseInt(questionId) : null;
  const isValidId = questionIdNum && !isNaN(questionIdNum);
  const prevId = isValidId ? getPrevQuestionId(questionIdNum, textbook) : null;
  const nextId = isValidId ? getNextQuestionId(questionIdNum, textbook) : null;

  async function updateQuestion() {
      setLoading(true);
      if (!isValidId) {
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

  const content = loading ? (
    <div className="text-2xl">
      Loading question...
    </div>
  ) : question === null ? (
    <div className="text-2xl">
      No question data found.
    </div>
  ) : (
    <QuestionContent question={question} textbook={textbook} />
  );

  return (
    <>
      <NavigationButtons prevId={prevId} nextId={nextId} router={router} />
      {content}
    </>
  );
}
