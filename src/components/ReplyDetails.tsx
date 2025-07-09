import { Question, Reply } from "@/types/Question";
import { useState } from "react";
import NewReplyForm from "./NewReplyForm";
import { Textbook } from "@/types/Textbook";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { authClient } from "@/lib/auth-client";
import { deleteReply } from "@/actions/reply";
import { formatDate, copyToClipboard } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Edit, Copy } from "lucide-react";

type ReplyDetailsProps = {
    textbook: Textbook,
    reply: Reply,
    question: Question,
    setParentReplyList: React.Dispatch<React.SetStateAction<Reply[]>>,
}

export default function ReplyDetails(
  { textbook, reply, question, setParentReplyList }: ReplyDetailsProps
) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [replies, setReplies] = useState(reply.replies);
  const { data: session } = authClient.useSession();
  
  const isAuthor = session?.user?.id === reply.author.id;

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this reply?")) return;
    setIsDeleting(true);
    try {
      const result = await deleteReply(textbook, reply.id);
      if ("error" in result) {
        alert(`Error deleting reply: ${result.error}`);
        return;
      }
      // Remove this reply from the parent list
      setParentReplyList(prev => prev.filter(r => r.id !== reply.id));
    } catch (error) {
      alert("Failed to delete reply");
    } finally {
      setIsDeleting(false);
    }
  };

  async function handleCopy() {
    const success = await copyToClipboard(reply.body);
    if (success) {
      console.log("Reply copied to clipboard");
    } else {
      alert("Failed to copy reply to clipboard");
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="border-2 border-neutral-500 rounded-xl p-4 mb-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {reply.author.image ? (
              <img
                src={reply.author.image}
                alt={reply.author.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-neutral-700">
                {reply.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-base">{reply.author.name}</h3>
              <p className="text-sm text-gray-500">
                {formatDate(reply.postDate)}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleCopy}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </DropdownMenuItem>
              {isAuthor && (
                <>
                  <DropdownMenuItem
                    onClick={() => console.warn("TODO: Edit reply")}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mb-4">
          <MarkdownRenderer text={reply.body}/>
        </div>
        
        <Button
          onClick={() => {
            setShowReplyForm(true);
            setFocusTrigger(prev => prev + 1);
          }}
          variant="outline"
          size="sm"
          className="bg-transparent text-blue-600 border-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
        >
          Reply
        </Button>
      </div>
      
      <div className="ml-10">
        {
          showReplyForm &&
          <NewReplyForm
            textbook={textbook}
            question={question}
            parentReplyId={reply.id}
            onCancel={() => setShowReplyForm(false)}
            onReplyAdded={(newReply) => {
              setReplies(prev => [...prev, newReply]);
              setShowReplyForm(false);
            }}
            focusTrigger={focusTrigger}
          />
        }
        {
          replies.map((subReply, i) => (
            <ReplyDetails
              key={i}
              textbook={textbook}
              reply={subReply}
              question={question}
              setParentReplyList={setReplies}
            />
          ))
        }
      </div>
    </div>
  );
}
