"use client";

import { ChangeEvent, FormEvent, useState, useRef, useEffect } from "react";
import { Question, Reply } from "@/types/Question";
import { postReply } from "@/actions/reply";
import { Textbook } from "@/types/Textbook";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownPreview } from "./MarkdownRenderer";
import { CancelButton } from "./CancelButton";
import { Send } from "lucide-react";

type FormData = {
  body: string,
};

type NewReplyFormProps = {
  textbook: Textbook,
  parentReplyId: number | null,
  question: Question,
  onCancel: () => void,
  onReplyAdded: (reply: Reply) => void,
  focusTrigger?: number, // updated to trigger focus
}

export default function NewReplyForm(
  { textbook, parentReplyId, question, onCancel, onReplyAdded, focusTrigger }: NewReplyFormProps
) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formData, setFormData] = useState<FormData>({
    body: "",
  });

  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Focus the textarea when focusTrigger changes
  useEffect(() => {
    if (textareaRef.current && focusTrigger !== undefined) {
      textareaRef.current.focus();
    }
  }, [focusTrigger]);

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    const res = await postReply(textbook, formData.body, parentReplyId, question.id);
    if ("error" in res) {
      if (res.error === "Unauthorized") {
        router.push("/login");
        return;
      }
      alert(res.error);
      return;
    }
    onReplyAdded(res);
  }

  return (
    <div className="border-2 border-neutral-500 rounded-xl p-4 mb-5 w-full">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">New Reply</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Textarea
          ref={textareaRef}
          name="body"
          placeholder="Type here"
          required
          rows={5}
          minLength={10}
          value={formData.body}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <MarkdownPreview text={formData.body} />
        <div className="flex gap-2">
          <Button type="submit">
            <Send className="h-4 w-4" /> Post
          </Button>
          <CancelButton onClick={onCancel} />
        </div>
      </form>
    </div>
  );
}
