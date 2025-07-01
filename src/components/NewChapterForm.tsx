"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createChapterEndpoint } from "@/actions/questions";
import { Textbook } from "@/types/Textbook";

export function NewChapterForm({ textbook }: { textbook: Textbook }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    num: "",
    body: "",
    chapterId: "",
    sectionId: "",
  });

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
    const res = await createChapterEndpoint({
      chapterNum,
      chapterTitle,
      textbook,
    });
    if ("error" in res) {
      alert(res.error);
      return;
    }
    // TODO: implement textbook page chapter view
    router.push(`/textbooks/${textbook.baseFileName}?chapterId=${res.id}`);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Create New Chapter:</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Input
          type="number"
          name="num"
          placeholder="Chapter #"
          required
          value={formData.num}
          onChange={handleInputChange}
        />
        <Input
          type="text"
          name="body"
          placeholder="Chapter Title"
          required
          value={formData.body}
          onChange={handleInputChange}
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
} 
