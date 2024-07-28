"use client";

import { fetchQuestion} from "@/actions/questions";
import { Question, Reply } from "@/types/Question";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function QuestionDetails() {
  const params = useSearchParams()
  const questionId = params.get("questionId");
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  async function updateQuestion() {
      setLoading(true);
      if (typeof questionId !== "string") {
        setQuestion(null);
        setLoading(false);
        return;
      }
      try {
        const id = await fetchQuestion(parseInt(questionId));
        // setQuestion(id);
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
  return (
    <div className="mx-20 lg:ml-10">
      <div className="my-4">
        <h1 className="mb-2 text-2xl font-bold">
          Chapter {question.chapter}: Q. {question.num}
        </h1>
        <hr className="border-neutral-600" />
        <p className="mt-2 text-xl">{question.body}</p>
      </div>
      <h2 className="mb-4">
        {question.comments.length} Comments:
      </h2>
      <div className="flex flex-col items-start gap-10">
        {question?.comments.map((c, i) => (
          <CommentDetails key={i} comment={c} />
        ))}
      </div>
    </div>
  );
}


function CommentDetails({ comment }: { comment: Reply }) {
  return (
    <div className="flex flex-row items-center w-full">
      <div className="py-4 px-2 bg-blue-600 bg-opacity-20 flex-shrink-0">
        Like btn
      </div>
      <div className="p-2 bg-red-600 bg-opacity-10 flex-1">
        <h1 className="text-lg">{comment.author}</h1>
        <h3 className="pb-2">
          Posted: {comment.postDate.toLocaleDateString()}
        </h3>
        <p>{comment.body}</p>
        <div>{
          comment.replies.map((reply, i) => (
            <div key={i} className="p-2 bg-red-600 bg-opacity-10 flex flex-col">
              <h1 className="text-lg">{reply.author}</h1>
              <h3 className="pb-2">
                Posted: {reply.postDate.toLocaleDateString()}
              </h3>
              <p>{reply.body}</p>
            </div>
          ))
        }</div>
      </div>
    </div>
  );
}
