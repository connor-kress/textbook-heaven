"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Question } from "@/types/Question";
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
}

export default function NewReplyForm(
  { textbook, parentReplyId, question }: NewReplyFormProps
) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    body: "",
  });

  function handleInputChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    const res = await postReply(textbook, formData.body, parentReplyId, question.id);
    if (res) {
      if (res?.error === "Unauthorized") {
        router.push("/login");
        return;
      }
      alert(res.error);
      return;
    }
    // Post-submit callback?
    window.location.reload();
  }

  return (
    <div className="border-2 border-neutral-500 rounded-xl p-3 mb-5">
      <h1 className="text-2xl font-bold mb-2">New Reply:</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Textarea
          name="body"
          placeholder="Type here"
          required
          rows={5}
          minLength={10}
          value={formData.body}
          onChange={handleInputChange}
        />
        <Button type="submit">Submit</Button>
      </form>
      {formData.body &&
        <>
        <h1 className="text-2xl font-bold mb-2 mt-4">Preview:</h1>
        <MarkdownRenderer text={formData.body} />
        </>
      }
    </div>
  );
}
