import QuestionSelector from "@/components/QuestionSelector";
import QuestionView from "@/components/QuestionView";
import { mockChapterData } from "@/lib/mockData";
import { fetchComments, fetchTextbookInfo } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: {
    textbookName: string,
  },
};

export function generateMetadata({ params }: Props): Metadata {
  const textbookName = decodeURI(params.textbookName);
  return {
    title: `${textbookName} - Textbook Heaven`,
    description: `Questions and PDF view from ${textbookName}.`,
  };
}

export default async function TextbookPage({ params }: Props) {
  const textbook = await fetchTextbookInfo(params.textbookName);
  const chapters = mockChapterData;
  return (
    <div className="flex flex-row">
      <div className="w-1/2 h-[90vh] hidden lg:flex flex-col">
        <h1 className="text-2xl font-bold">
          {textbook.name}
          <span className="text-sm"> (
            <Link href={textbook.filePath} target="_blank"
                  className="text-blue-700">
              full screen
            </Link>)
          </span>
        </h1>
        <PDFView path={textbook.filePath}/>
      </div>
      <div className="flex flex-col w-full lg:w-1/2">
        <QuestionView chapters={chapters}/>
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
