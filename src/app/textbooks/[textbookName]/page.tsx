import TextbookView from "@/components/TextbookView";
import { fetchTextbook } from "@/db/textbooks";
import { Metadata } from "next";
import TextbookHeader from "@/components/TextbookHeader";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    textbookName: string,
  }>,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { textbookName } = await params;
  const textbookNameDecoded = decodeURIComponent(textbookName);
  return {
    title: `${textbookNameDecoded} - Textbook Heaven`,
    description: `Questions and PDF view from ${textbookNameDecoded}.`,
  };
}

export default async function TextbookPage({ params }: Props) {
  const { textbookName } = await params;
  const decodedTextbookName = decodeURIComponent(textbookName);
  const textbook = await fetchTextbook(decodedTextbookName);
  if (!textbook) notFound();
  return (
    <div className="fixed inset-0 top-16 flex flex-row">
      {/* Left panel: visible only on lg */}
      <div className="w-1/2 hidden lg:flex flex-col">
        <div className="flex flex-col items-center">
          <TextbookHeader textbook={textbook} />
        </div>
        <PDFView path={textbook.filePath}/>
      </div>
      {/* Right Panel: scrollable area */}
      <div className="flex flex-col w-full lg:w-1/2 h-full overflow-y-auto">
        <TextbookView textbook={textbook}/>
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
