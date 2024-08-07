import { ChangeEvent, FormEvent, useState } from "react";
import { InputField, SubmitButton, TextArea } from "./FormFields";
import { Question, Reply } from "@/types/Question";
import { postReply } from "@/actions/reply";
import { Textbook } from "@/types/Textbook";
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
    await postReply(textbook, formData.body, parentReplyId, question.id);
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
    </div>
  );
}
