import { Metadata } from "next";

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
  return (
    <div className="flex flex-row">
      <div style={{height: "90vh", width: "50%"}} className="">
        <h1 className="text-2xl font-bold">Textbook: {decodeURI(params.textbookName)}</h1>
        <PDFView name={params.textbookName}/>
      </div>
      <div className="">
        Comments
      </div>
    </div>
  );
}

function PDFView({ name }: { name: string }) {
  return (
    <iframe 
      src={`/pdf/${name}.pdf`}
      width="100%" 
      height="100%" 
    >
      This browser does not support PDFs.
    </iframe>
  );
}
