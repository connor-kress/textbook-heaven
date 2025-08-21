import { fetchTextbooks } from "@/db/textbooks";
import TextbooksListClient from "@/components/TextbooksListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Available Textbooks - Textbook Heaven",
  description: "A list of available textbooks to post and view question answers.",
};

export default async function TextbookListPage() {
  const textbooks = await fetchTextbooks();
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h1 className="text-2xl font-bold">Available Textbooks:</h1>
      <TextbooksListClient textbooks={textbooks} />
    </div>
  );
}
