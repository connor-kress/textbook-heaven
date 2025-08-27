"use client";

import { postQuestion } from "@/actions/questions";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Textbook } from "@/types/Textbook";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ChapterSelect } from "@/components/ChapterSelect";
import { SectionSelect } from "@/components/SectionSelect";
import { tbUrl } from "@/lib/utils";
import { MarkdownPreview } from "./MarkdownRenderer";
import { CancelButton } from "./CancelButton";
import { cn } from "@/lib/utils";
import { useTextbooksStore } from "@/lib/textbook-store";
import { useQuestionsStore } from "@/lib/questions-store";

type FormData = {
  num: string;
  body: string;
  chapterId: string;
  sectionId: string;
};

export function NewQuestionForm({
  textbook,
  setQuestionId
}: {
  textbook: Textbook;
  setQuestionId: (id: number | null) => void;
}) {
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
    // Update the global state with new question
    useTextbooksStore.getState().addOrUpdateQuestionInfo(textbook.id, {
      chapterId: res.chapterId,
      sectionId: res.sectionId,
      info: { id: res.id, num: res.num },
    });
    useQuestionsStore.getState().setQuestion(res);
    // Navigate to question
    setQuestionId(res.id);
  }

  const handleCancel = () => {
    setQuestionId(null);
  };

  return (
    <div className="border-2 border-neutral-500 rounded-xl p-4 mb-5">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">New Question</h3>
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
              <Plus className="h-4 w-4" />
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
                <Plus className="h-4 w-4" />
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
          autoComplete="off"
        />

        <Textarea
          name="body"
          placeholder="Question Body"
          required
          rows={5}
          minLength={10}
          value={formData.body}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <MarkdownPreview text={formData.body} />

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!formData.chapterId}
            className={cn(
              !formData.chapterId
                ? "opacity-60 bg-neutral-200 text-neutral-400 border-neutral-200" : "",
            )}
          >
            <Plus className="h-4 w-4" /> Create
          </Button>
          <CancelButton onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
}
