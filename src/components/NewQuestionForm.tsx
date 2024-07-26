"use client";

import { postQuestion } from "@/actions/questions";
import { InputField, SubmitButton, TextArea } from "./FormFields";
import { ChangeEvent, FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type FormData = {
  chapter: string,
  chapterName: string,
  num: string,
  text: string,
};

export function NewQuestionForm() {
  const [formData, setFormData] = useState<FormData>({
    chapter: "", chapterName: "", num: "", text: "",
  });
  const { textbookName } = useParams<{ textbookName: string }>();
  const router = useRouter();

  function handleChange(e: ChangeEvent<HTMLFormElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    const chapter = parseInt(formData.chapter);
    const num = parseInt(formData.num);
    const newId = await postQuestion(
      chapter, formData.chapterName, num, formData.text
    );
    if (newId === null) {
      alert("Error creating question.");
    } else {
      // setFormData({chapter: "", chapterName: "", num: "", text: ""});
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
        <InputField type="number" name="chapter" placeholder="Chapter #"
                    required={true} />
        <InputField type="text" name="chapterName" placeholder="New Chapter Name"
                    autoComplete="off" />
        <InputField type="number" name="num" placeholder="Question #"
                    required={true} />
        <TextArea name="text" placeholder="Question Body" required={true}
                  rows={5} minLength={10} />
        <SubmitButton value="Submit" />
      </form>
    </div>
  );
}
