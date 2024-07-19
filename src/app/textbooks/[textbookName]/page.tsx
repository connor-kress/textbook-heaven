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

export default function TextbookPage({ params }: Props) {
  const textbookName = decodeURI(params.textbookName);
  const pdfPath = `/pdf/${params.textbookName}.pdf`;
  return (
    <div className="flex flex-row">
      <div style={{height: "90vh", width: "50%"}} className="">
        <h1 className="text-2xl font-bold">
          {textbookName}
          <span className="text-sm"> (
            <Link href={pdfPath} target="_blank" className="text-blue-700">
              full screen
            </Link>)
          </span>
        </h1>
        <PDFView path={pdfPath}/>
      </div>
      <div className="">
        Comments
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
