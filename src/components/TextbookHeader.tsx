"use client";

import Link from "next/link";
import type { Textbook } from "@/types/Textbook";
import { Button } from "@/components/ui/button";
import { useSeedTextbook, useTextbooksStore } from "@/lib/textbook-store";
import { getPdfPath } from "@/lib/utils";

export default function TextbookHeader({ textbook }: { textbook: Textbook }) {
  const tb = useSeedTextbook(textbook);
  const setTextbook = useTextbooksStore(state => state.setTextbook);
  const pdfPath = getPdfPath(tb);

  return (
    <div className="flex items-center gap-2 py-0.5 px-4">
      <span className="text-2xl font-bold">{tb.title}</span>
      {tb.author && <span className="text-lg"> by {tb.author}</span>}
      {pdfPath && (
        <span className="text-sm">
          <Link href={pdfPath} target="_blank" className="text-blue-700">
            view file
          </Link>
        </span>
      )}
      <Button
        size="sm"
        variant="outline"
        className="ml-2"
        onClick={() => setTextbook({ ...tb, title: "Bogus Title", author: "Bogus Author" })}
      >
        Bogus
      </Button>
    </div>
  );
}
