"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createTextbook, fetchTextbook } from "@/db/textbooks";
import { Textbook } from "@/types/Textbook";
import { slugify, tbUrl } from "@/lib/utils";

export async function createTextbookAction(input: {
  title: string;
  author: string;
  description: string | null;
}): Promise<Textbook | { error: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Unauthorized" };
  }

  const title = input.title.trim();
  const author = input.author.trim();
  const description = input.description?.trim() ?? null;
  if (!title) return { error: "Title is required" };
  if (!author) return { error: "Author is required" };

  // Ensure slug uniqueness by appending -n if needed
  let baseSlugNoAuthor = slugify(title);
  let baseSlugWithAuthor = slugify(`${title}-${author}`);
  let slug = baseSlugNoAuthor.length > 20 || baseSlugWithAuthor.length > 30
    ? baseSlugNoAuthor
    : baseSlugWithAuthor;
  let suffix = 1;
  while (true) {
    const existing = await fetchTextbook(slug);
    if (!existing) break;
    if (slug === baseSlugNoAuthor) {
        slug = baseSlugWithAuthor;
    } else {
        suffix += 1;
        slug = `${baseSlugWithAuthor}-${suffix}`;
    }
  }

  let textbook: Textbook;
  try {
    textbook = await createTextbook({ title, author, description, slug });
  } catch (err: any) {
    return { error: err?.message ?? "Unknown error" };
  }

  revalidatePath("/textbooks");
  revalidatePath(tbUrl(textbook));
  return textbook;
}


