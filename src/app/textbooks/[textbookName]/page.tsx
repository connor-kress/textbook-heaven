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

export default function Textbook({ params }: Props) {
  return (
    <div style={{height: "90vh"}}>
      <h1>Textbook: {decodeURI(params.textbookName)}</h1>
      <iframe 
        src={`/pdf/${params.textbookName}.pdf`}
        width="50%" 
        height="100%" 
      >
        This browser does not support PDFs.
      </iframe>
    </div>
  );
}
