"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createSectionEndpoint } from "@/actions/questions";
import { Textbook } from "@/types/Textbook";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { ChapterSelect } from "@/components/ChapterSelect";

export function NewSectionForm({ textbook }: { textbook: Textbook }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newChapterId = searchParams.get("newChapterId") ?? "";
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
    const res = await createSectionEndpoint({
      chapterId: parseInt(formData.chapterId),
      sectionNum,
      sectionTitle,
      textbook,
    });
    if ("error" in res) {
      alert(res.error);
      return;
    }
    // TODO: implement textbook page section view
    router.push(`/textbooks/${textbook.baseFileName}?sectionId=${res.id}`);
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Create New Section:</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <ChapterSelect
            value={formData.chapterId}
            onValueChange={(value) => {
              setFormData((prev) => ({ ...prev, chapterId: value }));
            }}
            chapters={textbook.chapters}
          />
          <Link href={`/textbooks/${textbook.baseFileName}?newChapter`}>
            <Button variant="outline" size="icon">
              <PlusIcon className="h-4 w-4" />
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
        />
        <Input
          type="text"
          name="body"
          placeholder="Section Title"
          required
          value={formData.body}
          onChange={handleInputChange}
        />
        <Button type="submit" disabled={!formData.chapterId}>Submit</Button>
      </form>
    </div>
  );
} 
