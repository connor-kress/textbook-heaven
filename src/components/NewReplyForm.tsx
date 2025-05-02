"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { SubmitButton, TextArea } from "./FormFields";
import { Question } from "@/types/Question";
import { postReply } from "@/actions/reply";
import { Textbook } from "@/types/Textbook";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { useRouter } from "next/navigation";

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

  function handleChange(e: ChangeEvent<HTMLFormElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    try{
      await postReply(textbook, formData.body, parentReplyId, question.id);
    } catch (err: any){
      if (
        err?.message === "Unauthorized" ||
        err?.toString().includes("Unauthorized")
      ) {
        router.push("/signin");
        return;
      }
      alert(err?.message || err);
      return;
    }
    // Post-submit callback?
    window.location.reload();
  }

  return (
    <div className="border-2 border-neutral-500 rounded-xl p-3 mb-5">
      <h1 className="text-2xl font-bold mb-2">New Reply:</h1>
      <form
        onSubmit={handleSubmit}
        onChange={handleChange}
        className="flex flex-col gap-2"
      >
        <TextArea name="body" placeholder="Type here" required={true}
                  rows={5} minLength={10} />
        {/* reply preview here */}
        <SubmitButton value="Submit" />
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
