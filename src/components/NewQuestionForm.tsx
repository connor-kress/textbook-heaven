"use client";

import { postQuestion } from "@/actions/questions";
import { InputField, SubmitButton, TextArea } from "./FormFields";
import { ChangeEvent, FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Textbook } from "@/types/Textbook";

type FormData = {
  chapterNum: string,
  chapterTitle: string,
  num: string,
  body: string,
};

export function NewQuestionForm(
  { textbook }: {textbook: Textbook}
) {
  const [formData, setFormData] = useState<FormData>({
    chapterNum: "", chapterTitle: "", num: "", body: "",
  });
  const { textbookName } = useParams<{ textbookName: string }>();
  const router = useRouter();

  function handleChange(e: ChangeEvent<HTMLFormElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    const chapterNum = parseInt(formData.chapterNum);
    const num = parseInt(formData.num);
    const newId = await postQuestion(
      textbook, chapterNum, formData.chapterTitle, num, formData.body
    );
    if (newId === null) {
      alert("Error creating question.");
    } else {
      // setFormData({chapterNum: "", chapterTitle: "", num: "", body: ""});
      // revalidatePath("/textbooks");
      router.push(`/textbooks/${textbookName}?questionId=${newId}`);
    }
  }

  return (
    <div className="py-4 px-20">
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
        <InputField type="number" name="num" placeholder="Question #"
                    required={true} />
        <TextArea name="body" placeholder="Question Body" required={true}
                  rows={5} minLength={10} />
        <SubmitButton value="Submit" />
      </form>
    </div>
  );
}
