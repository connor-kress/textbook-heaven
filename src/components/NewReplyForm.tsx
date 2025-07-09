"use client";

import { ChangeEvent, FormEvent, useState, useRef, useEffect } from "react";
import { Question, Reply } from "@/types/Question";
import { postReply } from "@/actions/reply";
import { Textbook } from "@/types/Textbook";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type FormData = {
  body: string,
};

type NewReplyFormProps = {
  textbook: Textbook,
  parentReplyId: number | null,
  question: Question,
  onCancel: () => void,
  onReplyAdded: (reply: Reply) => void,
  focusTrigger?: number, // Add this prop to trigger focus
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
        {formData.body &&
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Preview:</p>
            <MarkdownRenderer text={formData.body} />
          </div>
        }
        <div className="flex gap-2">
          <Button type="submit">Submit</Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
