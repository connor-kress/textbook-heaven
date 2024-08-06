import { Reply } from "@/types/Question";
import { useState } from "react";
import NewReplyForm from "./NewReplyForm";

export default function ReplyDetails(
  { reply, parentId = null }: { reply: Reply, parentId?: number | null }
) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  return (
    <div className="flex flex-col w-full">
      <div className="border-2 border-neutral-500 rounded-xl p-3 mb-5">
        <h1 className="text-lg">{reply.author}</h1>
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
        { showReplyForm && <NewReplyForm />}
        {
          reply.replies.map((subReply, i) => (
            <ReplyDetails key={i} reply={subReply} parentId={reply.id} />
          ))
        }
      </div>
    </div>
  );
}
