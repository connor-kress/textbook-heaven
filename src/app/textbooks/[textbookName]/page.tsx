import QuestionView from "@/components/QuestionView";
import { fetchTextbook } from "@/db/textbooks";
import { Metadata } from "next";
import Link from "next/link";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    textbookName: string,
  }>,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { textbookName } = await params;
  const textbookNameDecoded = decodeURI(textbookName);
  return {
    title: `${textbookNameDecoded} - Textbook Heaven`,
    description: `Questions and PDF view from ${textbookNameDecoded}.`,
  };
}

export default async function TextbookPage({ params }: Props) {
  const { textbookName } = await params;
  const textbook = await fetchTextbook(decodeURI(textbookName));
  return (
    <div className="fixed inset-0 top-16 flex flex-row">
      {/* Left panel: visible only on lg */}
      <div className="w-1/2 hidden lg:flex flex-col">
        <div className="flex flex-col items-center">
          <div className="p-0.5">
            <span className="text-2xl font-bold">{textbook.title}</span>
            <span className="text-lg"> by {textbook.author}</span>
            <span className="text-sm"> (
              <Link href={textbook.filePath} target="_blank"
                    className="text-blue-700">
                view file
              </Link>)
            </span>
          </div>
        </div>
        <PDFView path={textbook.filePath}/>
      </div>
      {/* Right Panel: scrollable area */}
      <div className="flex flex-col w-full lg:w-1/2 h-full overflow-y-auto">
        <QuestionView textbook={textbook}/>
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
