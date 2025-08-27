"use client";

import { useSearchParams } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createChapter } from "@/actions/questions";
import { Textbook } from "@/types/Textbook";
import { useTextbooksStore } from "@/lib/textbook-store";
import { CancelButton } from "./CancelButton";
import { Plus } from "lucide-react";

export function NewChapterForm({ 
  textbook, 
  setQuestionId 
}: { 
  textbook: Textbook;
  setQuestionId: (id: number | null) => void;
}) {
  const searchParams = useSearchParams();
  const newChapterNum = searchParams.get("newChapterNum") ?? "";
  const [formData, setFormData] = useState({
    num: "",
    body: "",
    chapterId: "",
    sectionId: "",
  });

  // Set initial chapter number from newChapterNum if present
  useEffect(() => {
    if (newChapterNum && !formData.num) {
      setFormData((prev) => ({ ...prev, num: newChapterNum }));
    }
  }, [newChapterNum, formData.num]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const chapterNum = parseInt(formData.num);
    const chapterTitle = formData.body;
    const res = await createChapter({
      chapterNum,
      chapterTitle,
      textbook,
    });
    if ("error" in res) {
      alert(res.error);
      return;
    }
    // Update textbook store and navigate back to textbook homepage
    useTextbooksStore.getState().addOrUpdateChapter(textbook.id, res);
    setQuestionId(null);
  }

  const handleCancel = () => {
    setQuestionId(null);
  };

  return (
    <div className="border-2 border-neutral-500 rounded-xl p-4 mb-5">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">New Chapter</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Input
          type="number"
          name="num"
          placeholder="Chapter #"
          required
          value={formData.num}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <Input
          type="text"
          name="body"
          placeholder="Chapter Title"
          required
          value={formData.body}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <div className="flex gap-2">
          <Button type="submit">
            <Plus className="h-4 w-4" /> Create
          </Button>
          <CancelButton onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
} 
