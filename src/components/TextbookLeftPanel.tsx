"use client";

import TextbookHeader from "@/components/TextbookHeader";
import { TextbookHomePage } from "@/components/TextbookHomePage";
import { useQuestionId } from "@/hooks/useQuestionId";
import { useSeedTextbook } from "@/lib/textbook-store";
import type { Textbook } from "@/types/Textbook";

export default function TextbookLeftPanel({ textbook }: { textbook: Textbook }) {
  const tb = useSeedTextbook(textbook);
  const [, setQuestionId] = useQuestionId();

  if (tb.filePath) {
    return (
      <div className="w-1/2 hidden lg:flex flex-col">
        <div className="flex flex-col items-center">
          <TextbookHeader textbook={tb} />
        </div>
        <PDFView path={tb.filePath} />
      </div>
    );
  }

  return (
    <div className="w-1/2 hidden lg:flex flex-col">
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


