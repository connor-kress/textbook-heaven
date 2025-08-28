"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { tbUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createTextbookAction } from "@/actions/textbook";
import { CancelButton } from "@/components/CancelButton";

type FormState = {
  title: string;
  author: string;
  description: string;
};

export default function NewTextbookForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: "",
    author: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const res = await createTextbookAction({
      title: form.title,
      author: form.author,
      description: form.description || null,
    });
    setSubmitting(false);
    if ("error" in res) {
      if (res.error === "Unauthorized") {
        router.push("/login");
        return;
      }
      alert(res.error);
      return;
    }
    router.push(tbUrl(res));
  }

  const handleCancel = () => {
    router.push("/textbooks");
  };

  return (
    <div className="max-w-xl w-full border-2 border-neutral-500 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">New Textbook</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <Input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <Input
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <Textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          rows={4}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            <Plus className="h-4 w-4" /> {submitting ? "Creating..." : "Create"}
          </Button>
          <CancelButton onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
}


