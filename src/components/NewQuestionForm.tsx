"use client";

import { postQuestion } from "@/actions/questions";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Textbook } from "@/types/Textbook";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { ChapterSelect } from "@/components/ChapterSelect";
import { SectionSelect } from "@/components/SectionSelect";
import { tbUrl } from "@/lib/utils";

type FormData = {
  num: string;
  body: string;
  chapterId: string;
  sectionId: string;
};

export function NewQuestionForm({ textbook }: { textbook: Textbook }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newChapterId = searchParams.get("newChapterId") ?? "";
  const newSectionId = searchParams.get("newSectionId") ?? "";
  const newQuestionNum = searchParams.get("newQuestionNum") ?? "";
  const [formData, setFormData] = useState<FormData>({
    num: "",
    body: "",
    chapterId: "",
    sectionId: "",
  });

  const selectedChapter = textbook.chapters.find(
    (c) => c.id.toString() === formData.chapterId
  );

  // Set initial chapterId from newChapterId if present
  useEffect(() => {
    if (newChapterId && !formData.chapterId) {
      setFormData((prev) => ({ ...prev, chapterId: newChapterId, sectionId: "" }));
    }
  }, [newChapterId, formData.chapterId]);

  // Set initial sectionId from newSectionId if present
  useEffect(() => {
    if (newSectionId && !formData.sectionId) {
      setFormData((prev) => ({ ...prev, sectionId: newSectionId }));
    }
  }, [newSectionId, formData.sectionId]);

  // Set initial question number from newQuestionNum if present
  useEffect(() => {
    if (newQuestionNum && !formData.num) {
      setFormData((prev) => ({ ...prev, num: newQuestionNum }));
    }
  }, [newQuestionNum, formData.num]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const chapterId = parseInt(formData.chapterId);
    const sectionId = formData.sectionId ? parseInt(formData.sectionId) : null;
    const questionNum = parseInt(formData.num);

    const res = await postQuestion({
      textbook,
      questionNum,
      questionBody: formData.body,
      chapterId,
      sectionId,
    });

    if ("error" in res) {
      if (res.error === "Unauthorized") {
        router.push("/login");
        return;
      }
      alert(res.error);
      return;
    }
    router.push(tbUrl(textbook, { questionId: res.id }));
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-2">Compose New Question:</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <ChapterSelect
            value={formData.chapterId}
            onValueChange={(value) => {
              setFormData({ ...formData, chapterId: value, sectionId: "" });
            }}
            chapters={textbook.chapters}
          />
          <Link href={tbUrl(textbook, { newChapter: "" })}>
            <Button variant="outline" size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {selectedChapter && (
          <div className="flex items-center space-x-2">
            <SectionSelect
              value={formData.sectionId}
              onValueChange={(value) => {
                setFormData({ ...formData, sectionId: value });
              }}
              sections={selectedChapter.sections}
            />
            <Link href={tbUrl(textbook, { newSection: "", newChapterId: formData.chapterId })}>
              <Button variant="outline" size="icon">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        <Input
          type="number"
          name="num"
          placeholder="Question #"
          required
          value={formData.num}
          onChange={handleInputChange}
        />

        <Textarea
          name="body"
          placeholder="Question Body"
          required
          rows={5}
          minLength={10}
          value={formData.body}
          onChange={handleInputChange}
        />

        <Button type="submit">Submit</Button>
      </form>

      {formData.body && (
        <>
          <h1 className="text-2xl font-bold mb-2 mt-4">Preview:</h1>
          <MarkdownRenderer text={formData.body} />
        </>
      )}
    </div>
  );
}
