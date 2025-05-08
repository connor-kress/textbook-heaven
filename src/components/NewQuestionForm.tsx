"use client";

import { postQuestion } from "@/actions/questions";
import { InputField, SubmitButton, TextArea } from "./FormFields";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Textbook } from "@/types/Textbook";
import { MarkdownRenderer } from "./MarkdownRenderer";

type FormData = {
  num: string,
  body: string,
  chapterNum: string,
  chapterTitle: string,
  sectionNum: string,
  sectionTitle: string,
};

export function NewQuestionForm(
  { textbook }: {textbook: Textbook}
) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    num: "", body: "",
    chapterNum: "", chapterTitle: "",
    sectionNum: "", sectionTitle: "",
  });

  function handleChange(e: ChangeEvent<HTMLFormElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    const chapterNum = parseInt(formData.chapterNum);
    const sectionNum = formData.sectionNum.trim() !== ""
      ? parseInt(formData.sectionNum)
      : null;
    const questionNum = parseInt(formData.num);
    const chapterTitle = formData.chapterTitle.trim() !== ""
      ? formData.chapterTitle.trim()
      : null;
    const sectionTitle = formData.sectionTitle.trim() !== ""
      ? formData.sectionTitle.trim()
      : null;
    const res = await postQuestion({
      textbook,
      questionNum, questionBody: formData.body,
      chapterNum, chapterTitle: chapterTitle,
      sectionNum, sectionTitle: sectionTitle,
    });
    if (typeof res !== "number") {
      if (res.error === "Unauthorized") {
        router.push("/login");
        return;
      }
      alert(res.error);
      return;
    }
    router.push(`/textbooks/${textbook.baseFileName}?questionId=${res}`);
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-2">Compose New Question:</h1>
      <form
        onSubmit={handleSubmit}
        onChange={handleChange}
        className="
          flex flex-col
          p-3 gap-2
          bg-neutral-800
          rounded
        "
      >
        <InputField type="number" name="chapterNum" placeholder="Chapter #"
                    required={true} />
        <InputField type="text" name="chapterTitle"
                    placeholder="New Chapter Name" autoComplete="off" />
        <InputField type="number" name="sectionNum" placeholder="Section #" />
        <InputField type="text" name="sectionTitle"
                    placeholder="New Section Name" autoComplete="off" />
        <InputField type="number" name="num" placeholder="Question #"
                    required={true} />
        <TextArea name="body" placeholder="Question Body" required={true}
                  rows={5} minLength={10} />
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
