"use client";

import { fetchQuestion} from "@/actions/questions";
import { Question } from "@/types/Question";
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
        const questionData = await fetchQuestion(parseInt(questionId));
        setQuestion(questionData);
      } catch (e) {
        // check error
        setQuestion(null);
      }
      setLoading(false);
  }
  useEffect(() => {
    updateQuestion();
  }, [questionId]);

if (loading) {
    return (
      <div className="mx-20 lg:ml-10 text-2xl">
        Loading question...
      </div>
    );
  } else if (question === null) {
    return (
      <div className="mx-20 lg:ml-10 text-2xl">
        No question data found.
      </div>
    );
  }
  const chapter =
    textbook.chapters.find(c => c.id === question.chapterId);
  if (chapter === undefined) {
    throw new Error("Chapter data cannot be found for question");
  }
  
  return (
    <div className="mx-20 lg:ml-10">
      <div className="my-4">
        <h1 className="mb-2 text-2xl font-bold">
          Chapter {chapter.num}: {chapter.title} - {}
          <span className="text-neutral-400">
            Q. {question.num}
          </span>
        </h1>
        <hr className="mb-2 border-neutral-600" />
        <MarkdownRenderer text={question.body}/>
      </div>
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
          <ReplyDetails key={i} textbook={textbook} reply={c} question={question} />
        ))}
      </div>
    </div>
  );
}
