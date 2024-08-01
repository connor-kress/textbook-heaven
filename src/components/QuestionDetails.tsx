"use client";

import { fetchQuestion} from "@/actions/questions";
import { Question, Reply } from "@/types/Question";
import { Textbook } from "@/types/Textbook";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function QuestionDetails(
  { textbook }: {textbook: Textbook}
) {
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
        <hr className="border-neutral-600" />
        <p className="mt-2 text-xl">{question.body}</p>
      </div>
      <h2 className="mb-4">
        {question.comments.length} Comments:
      </h2>
      <div className="flex flex-col items-start gap-10">
        {question?.comments.map((c, i) => (
          <ReplyDetails key={i} reply={c} isBase={true} />
        ))}
      </div>
    </div>
  );
}


function ReplyDetails({ reply, isBase }: { reply: Reply, isBase: boolean }) {
  return (
    <div className="flex flex-row w-full">
      {
        isBase &&
        <div className="
            py-4 px-2 bg-blue-600 bg-opacity-20 flex-shrink-0
          "
        >
          Like btn
        </div>
      }
      <div className="p-2 bg-red-600 bg-opacity-10 flex-1">
        <h1 className="text-lg">{reply.author}</h1>
        <h3 className="pb-2">
          Posted: {reply.postDate.toLocaleDateString()}
        </h3>
        <p>{reply.body}</p>
        <div>{
          reply.replies.map((subReply, i) => (
            <ReplyDetails key={i} reply={subReply} isBase={false} />
          ))
        }</div>
      </div>
    </div>
  );
}
