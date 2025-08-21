"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import type { Textbook } from "@/types/Textbook";
import { useTextbooksStore } from "@/lib/textbook-store";
import { tbUrl } from "@/lib/utils";

export default function TextbooksListClient({ textbooks }: { textbooks: Textbook[] }) {
  const setTextbook = useTextbooksStore(state => state.setTextbook);
  const textbooksById = useTextbooksStore(state => state.textbooksById);
  const storeTextbooks = useMemo(() => Array.from(textbooksById.values()), [textbooksById]);

  // Seed store with SSR textbooks if missing; do not overwrite existing client state
  useEffect(() => {
    for (const tb of textbooks) {
      if (!textbooksById.has(tb.id)) setTextbook(tb);
    }
  }, [textbooks, textbooksById, setTextbook]);

  // Use store data if present; otherwise fall back to SSR list to avoid hydration issues
  const list = storeTextbooks.length > 0 ? storeTextbooks : textbooks;

  // Keep a stable order (by id) for rendering consistency
  const ordered = useMemo(() => [...list].sort((a, b) => a.id - b.id), [list]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
      {ordered.map((tb, i) => {
        const coverImagePath = tb.coverImagePath
          ? `/covers/${tb.coverImagePath}`
          : "/covers/cover-placeholder.jpg";
        return (
          <Link
            href={tbUrl(tb)}
            key={i}
            className="group block rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="w-full aspect-[3/4] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
              <img
                src={coverImagePath}
                alt={tb.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-4 flex flex-col gap-1">
              <h3 className="text-lg font-semibold truncate">{tb.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{tb.author}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}


