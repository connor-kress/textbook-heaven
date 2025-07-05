"use client";

import {
  Question,
  QuestionSchema,
  QuestionInfoWithLocation,
} from "@/types/Question";
import { Textbook } from "@/types/Textbook";
import { useState, useEffect } from "react";
import ReplyDetails from "./ReplyDetails";
import { MarkdownRenderer } from "./MarkdownRenderer";
import NewReplyForm from "./NewReplyForm";
import { cn, getOrderedQuestionInfo } from "@/lib/utils";
import { QuestionContentSkeleton, RepliesSkeleton } from "./skeletons";

export function QuestionDetails({
  textbook,
  questionId,
  setQuestionId,
}: {
  textbook: Textbook;
  questionId: number | null;
  setQuestionId: (id: number | null) => void;
}) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestion() {
      setLoading(true);
      if (questionId === null) {
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
    fetchQuestion();
  }, [questionId]);

  const orderedQuestions = getOrderedQuestionInfo(textbook);
  const questionIdx = orderedQuestions.findIndex(q => q.id === questionId);
  if (questionIdx < 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-2">Question Not Found</h2>
        <p className="text-gray-600 dark:text-gray-500">
          {"The question you're looking for doesn't exist."}
        </p>
      </div>
    );
  }
  const currentQuestionInfo = orderedQuestions[questionIdx];
  const prevQuestion = questionIdx > 0 ? orderedQuestions[questionIdx - 1] : null;
  const nextQuestion = questionIdx < orderedQuestions.length - 1 ? orderedQuestions[questionIdx + 1] : null;

  const content = loading ? (
    <QuestionContentSkeleton />
  ) : question === null ? (
    <div className="text-2xl">
      No question data found.
    </div>
  ) : (
    <MarkdownRenderer text={question.body}/>
  );

  return (
    <>
      <NavigationButtons
        prevQuestion={prevQuestion}
        nextQuestion={nextQuestion}
        setQuestionId={setQuestionId}
      />
      <QuestionHeader questionInfo={currentQuestionInfo} textbook={textbook} />
      {content}
      <QuestionReplies
        question={question}
        loading={loading}
        textbook={textbook}
      />
    </>
  );
}

function NavigationButtons({ prevQuestion, nextQuestion, setQuestionId }: {
  prevQuestion: QuestionInfoWithLocation | null; 
  nextQuestion: QuestionInfoWithLocation | null; 
  setQuestionId: (id: number | null) => void;
}) {
  return (
    <div className="flex justify-between mb-6 w-full">
      <button
        className={cn(
          "px-4 py-2 rounded font-semibold border transition-colors touch-manipulation select-none [&::-webkit-tap-highlight-color]:transparent",
          prevQuestion
            ? "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100 active:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-900 dark:active:bg-neutral-700"
            : "bg-neutral-100 text-neutral-400 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-600 dark:border-neutral-800 cursor-not-allowed"
        )}
        disabled={!prevQuestion}
        onClick={() => prevQuestion && setQuestionId(prevQuestion.id)}
      >
        Previous Question
      </button>
      <button
        className={cn(
          "px-4 py-2 rounded font-semibold border transition-colors touch-manipulation select-none [&::-webkit-tap-highlight-color]:transparent",
          nextQuestion
            ? "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100 active:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:border-neutral-700 dark:hover:bg-neutral-900 dark:active:bg-neutral-700"
            : "bg-neutral-100 text-neutral-400 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-600 dark:border-neutral-800 cursor-not-allowed"
        )}
        disabled={!nextQuestion}
        onClick={() => nextQuestion && setQuestionId(nextQuestion.id)}
      >
        Next Question
      </button>
    </div>
  );
}

function QuestionHeader({ 
  questionInfo, 
  textbook 
}: {
  questionInfo: QuestionInfoWithLocation;
  textbook: Textbook;
}) {
  const chapter = textbook.chapters.find(c => c.id === questionInfo.chapterId)!;
  const section = questionInfo.sectionId !== null
    ? chapter.sections.find(s => s.id === questionInfo.sectionId)!
    : null;
  
  const chapterTitle = `Chapter ${chapter.num}: ${chapter.title}`;
  const sectionTitle = section ? `Section ${section.num}: ${section.title}` : null;
  const questionTitle = questionInfo.sectionId === null && chapter.sections.length > 0 
    ? `Review Question ${questionInfo.num}`
    : `Question ${questionInfo.num}`;
  const shouldSplit = chapterTitle.length > 40 || (sectionTitle && sectionTitle.length > 35);

  return (
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
  );
}

function QuestionReplies({ question, loading, textbook }: {
  question: Question | null;
  loading: boolean;
  textbook: Textbook;
}) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const replyCount = question ? question.replies.length : 0;
  return (
    <>
      <button
        onClick={() => setShowCommentForm(prev => !prev)}
        className="text-blue-500 hover:underline mb-2"
        disabled={loading}
      >
        { showCommentForm ? "Close Form" : "New Reply"}
      </button>
      <h2 className="mb-4">
        {`${replyCount} ${replyCount === 1 ? "Reply" : "Replies"}`}
      </h2>
      {loading ? (
        <RepliesSkeleton />
      ) : question === null ? (
        <div className="text-2xl">
          No question data found.
        </div>
      ) : (
        <div className="flex flex-col items-start gap-10 w-full">
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
          {question.replies.map((c, i) => (
            <ReplyDetails
              key={i}
              textbook={textbook}
              reply={c}
              question={question}
            />
          ))}
        </div>
      )}
    </>
  );
}
