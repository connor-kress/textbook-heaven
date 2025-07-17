import { Question, Reply } from "@/types/Question";
import { useState, useRef, useEffect } from "react";
import NewReplyForm from "./NewReplyForm";
import { Textbook } from "@/types/Textbook";
import { MarkdownRenderer, MarkdownPreview } from "./MarkdownRenderer";
import { authClient } from "@/lib/auth-client";
import { deleteReply, editReply } from "@/actions/reply";
import { formatDate, copyToClipboard } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Edit, Copy, Save } from "lucide-react";
import { CancelButton } from "./CancelButton";
import { Textarea } from "@/components/ui/textarea";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: session } = authClient.useSession();
  
  const isAuthor = session?.user?.id === reply.author.id;

  function handleReplyAdded(newReply: Reply) {
    setParentReplyList(prev => prev.map(r => {
      if (r.id !== reply.id) return r;
      return { ...r, replies: [...r.replies, newReply] };
    }));
    setShowReplyForm(false);
  }

  function handleSetReplies(updater: Reply[] | ((prev: Reply[]) => Reply[])) {
    setParentReplyList(prev => prev.map(r => {
      if (r.id !== reply.id) return r;
      return {
        ...r,
        replies: typeof updater === "function" ? updater(r.replies) : updater,
      };
    }));
  }

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

  async function handleEditSave() {
    setIsSaving(true);
    if (editBody.trim() === "") {
      alert("Reply cannot be empty");
      setIsSaving(false);
      return;
    }
    try {
      const result = await editReply(textbook, reply.id, question.id, editBody.trim());
      if ("error" in result) {
        alert(`Error editing reply: ${result.error}`);
        return;
      }
      // Replace this reply in the parent list
      setParentReplyList(prev => prev.map(r => r.id === reply.id ? result : r));
      setIsEditing(false);
    } catch (error) {
      alert("Failed to edit reply");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEditCancel() {
    setEditBody(reply.body);
    setIsEditing(false);
  }

  // Auto-resize textarea when editing mode starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      const contentHeight = textarea.scrollHeight;
      const size = Math.max(Math.min(contentHeight, 500), 80);
      textarea.style.height = `${size}px`;
      // move cursor to end of text
      const len = textarea.value.length;
      textarea.setSelectionRange(len, len)
    }
  }, [isEditing]);

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
                    onClick={() => {
                      setEditBody(reply.body);
                      setIsEditing(true);
                      // prevent the dropdown from stealing focus
                      [20, 50, 100, 200, 300, 400].forEach(delay => {
                        setTimeout(() => textareaRef.current?.focus(), delay);
                      });
                    }}
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
        {
          isEditing ? (
            <div>
              <Textarea
                ref={textareaRef}
                className="w-full border rounded p-2 mb-2 overflow-y-auto resize-y"
                value={editBody}
                onChange={e => setEditBody(e.target.value)}
                disabled={isSaving}
              />
              <MarkdownPreview text={editBody} />
              <div className="flex gap-2 mt-4">
                <Button onClick={handleEditSave} disabled={isSaving}>
                  <Save className="h-4 w-4" /> Save
                </Button>
                <CancelButton onClick={handleEditCancel} disabled={isSaving} />
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <MarkdownRenderer text={reply.body}/>
            </div>
          )
        }
        {!isEditing && (
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
        )}
      </div>
      
      <div className="ml-10">
        {
          showReplyForm &&
          <NewReplyForm
            textbook={textbook}
            question={question}
            parentReplyId={reply.id}
            onCancel={() => setShowReplyForm(false)}
            onReplyAdded={handleReplyAdded}
            focusTrigger={focusTrigger}
          />
        }
        {
          reply.replies.map((subReply, i) => (
            <ReplyDetails
              key={i}
              textbook={textbook}
              reply={subReply}
              question={question}
              setParentReplyList={handleSetReplies}
            />
          ))
        }
      </div>
    </div>
  );
}
