import TextbookView from "@/components/TextbookView";
import { fetchTextbook } from "@/db/textbooks";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import TextbookLeftPanel from "@/components/TextbookLeftPanel";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    textbookSlug: string,
  }>,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { textbookSlug } = await params;
  const decodedTextbookSlug = decodeURIComponent(textbookSlug);
  return {
    title: `${decodedTextbookSlug} - Textbook Heaven`,
    description: `Questions and PDF view from ${decodedTextbookSlug}.`,
  };
}

export default async function TextbookPage({ params }: Props) {
  const { textbookSlug } = await params;
  const decodedTextbookSlug = decodeURIComponent(textbookSlug);
  const textbook = await fetchTextbook(decodedTextbookSlug);
  if (!textbook) notFound();
  return (
    <div className="fixed inset-0 top-16 flex flex-row">
      {/* Left panel: encapsulated component (shows PDF or home page) */}
      <TextbookLeftPanel textbook={textbook} />
      {/* Right Panel: scrollable area */}
      <div className="flex flex-col w-full lg:w-1/2 h-full overflow-y-auto">
        <TextbookView textbook={textbook} suppressHome={!textbook.fileName} />
      </div>
    </div>
  );
}
