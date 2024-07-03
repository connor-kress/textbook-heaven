import { Metadata } from "next";

type Props = {
  params: {
    textbookId: string,
  },
};

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `${params.textbookId} - Textbook Heaven`,
    description: `Questions and PDF view from ${params.textbookId}.`,
  };
}

export default function Textbook({ params }: Props) {
  return <h1>Textbook: {params.textbookId}</h1>
}
