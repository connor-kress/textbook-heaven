import { Metadata } from "next";

type Props = {
  params: {
    textbookName: string,
  },
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `${params.textbookName} - Textbook Heaven`,
    description: `Questions and PDF view from ${params.textbookName}.`,
  };
}

export default function Textbook({ params }: Props) {
  return <h1>Textbook: {params.textbookName}</h1>
}
