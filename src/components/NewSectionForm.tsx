"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSection } from "@/actions/questions";
import { Textbook } from "@/types/Textbook";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ChapterSelect } from "@/components/ChapterSelect";
import { cn, tbUrl } from "@/lib/utils";
import { CancelButton } from "./CancelButton";

export function NewSectionForm({ 
  textbook, 
  setQuestionId 
}: { 
  textbook: Textbook;
  setQuestionId: (id: number | null) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newChapterId = searchParams.get("newChapterId") ?? "";
  const newSectionNum = searchParams.get("newSectionNum") ?? "";
  const [formData, setFormData] = useState({
    num: "",
    body: "",
    chapterId: "",
    sectionId: "",
  });

  // Set initial chapterId from newChapterId if present
  useEffect(() => {
    if (newChapterId && !formData.chapterId) {
      setFormData((prev) => ({ ...prev, chapterId: newChapterId }));
    }
  }, [newChapterId, formData.chapterId]);

  // Set initial section number from newSectionNum if present
  useEffect(() => {
    if (newSectionNum && !formData.num) {
      setFormData((prev) => ({ ...prev, num: newSectionNum }));
    }
  }, [newSectionNum, formData.num]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const sectionNum = parseInt(formData.num);
    const sectionTitle = formData.body;
    const res = await createSection({
      chapterId: parseInt(formData.chapterId),
      sectionNum,
      sectionTitle,
      textbook,
    });
    if ("error" in res) {
      alert(res.error);
      return;
    }
    router.push(tbUrl(textbook));
  }

  const handleCancel = () => {
    setQuestionId(null);
  };

  return (
    <div className="border-2 border-neutral-500 rounded-xl p-4 mb-5">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">New Section</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <ChapterSelect
            value={formData.chapterId}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, chapterId: value }));
            }}
            chapters={textbook.chapters}
          />
          <Link href={tbUrl(textbook, { newChapter: "" })}>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Input
          type="number"
          name="num"
          placeholder="Section #"
          required
          value={formData.num}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <Input
          type="text"
          name="body"
          placeholder="Section Title"
          required
          value={formData.body}
          onChange={handleInputChange}
          autoComplete="off"
        />
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
