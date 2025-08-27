"use client";

import TextbookHeader from "@/components/TextbookHeader";
import { TextbookHomePage } from "@/components/TextbookHomePage";
import { useQuestionId } from "@/hooks/useQuestionId";
import { useSeedTextbook } from "@/lib/textbook-store";
import { getPdfPath } from "@/lib/utils";
import type { Textbook } from "@/types/Textbook";

export default function TextbookLeftPanel({ textbook }: { textbook: Textbook }) {
  const tb = useSeedTextbook(textbook);
  const [, setQuestionId] = useQuestionId();

  const pdfPath = getPdfPath(tb);
  if (pdfPath) {
    return (
      <div className="w-1/2 hidden lg:flex flex-col h-full overflow-y-auto">
        <div className="sticky top-0 z-10 flex flex-col items-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-neutral-200 dark:border-neutral-800">
          <TextbookHeader textbook={tb} />
        </div>
        <PDFView path={pdfPath} />
      </div>
    );
  }

  return (
    <div className="w-1/2 hidden lg:flex flex-col h-full overflow-y-auto">
      <div className="mx-[5%] lg:ml-[3%] my-4">
        <TextbookHomePage textbook={tb} setQuestionId={setQuestionId} />
      </div>
    </div>
  );
}

function PDFView({ path }: { path: string }) {
  return (
    <div className="aspect-[3/4]">
      <iframe
        src={path}
        width="100%"
        height="100%"
      >
        This browser does not support PDFs.
      </iframe>
    </div>
  );
}
