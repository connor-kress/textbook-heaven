import { Question, Reply } from "@/types/Question";
import { useState } from "react";
import NewReplyForm from "./NewReplyForm";
import { Textbook } from "@/types/Textbook";

type ReplyDetailsProps = {
    textbook: Textbook,
    reply: Reply,
    question: Question,
}

export default function ReplyDetails(
  { textbook, reply, question }: ReplyDetailsProps
) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  return (
    <div className="flex flex-col w-full">
      <div className="border-2 border-neutral-500 rounded-xl p-3 mb-5">
        <h1 className="text-lg">{reply.author_name}</h1>
        <h3 className="pb-2">
          Posted: {reply.postDate.toLocaleDateString()}
        </h3>
        <p className="pb-2">{reply.body}</p>
        <button onClick={() => setShowReplyForm(true)}
                className="text-blue-500 hover:underline">
          New Reply
        </button>
      </div>
      <div className="ml-10">
        { showReplyForm && <NewReplyForm textbook={textbook} question={question} parentReplyId={reply.id} />}
        {
          reply.replies.map((subReply, i) => (
            <ReplyDetails key={i} textbook={textbook} reply={subReply} question={question} />
          ))
        }
      </div>
    </div>
  );
}
