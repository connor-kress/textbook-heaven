import { fetchTextbooks } from "@/db/textbooks";
import TextbooksListClient from "@/components/TextbooksListClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Available Textbooks - Textbook Heaven",
  description: "A list of available textbooks to post and view question answers.",
};

export default async function TextbookListPage() {
  const textbooks = await fetchTextbooks();
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="w-full max-w-6xl">
        <div className="flex w-full items-start justify-between gap-3 sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Available Textbooks</h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{textbooks.length} textbook{textbooks.length === 1 ? "" : "s"}</p>
          </div>
          <Link href="/textbooks/new">
            <Button>
              <Plus className="h-4 w-4" /> New Textbook
            </Button>
          </Link>
        </div>
      </div>

      {textbooks.length === 0 ? (
        <div className="w-full">
          <div className="mx-auto w-full max-w-3xl aspect-[3/2] sm:aspect-[16/9] rounded-xl border border-neutral-200 dark:border-neutral-800 px-8 py-10 flex flex-col items-center justify-center text-center">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 text-base sm:text-lg">No textbooks yet. Get started by creating your first textbook.</p>
            <Link href="/textbooks/new">
              <Button>
                <Plus className="h-4 w-4" /> Create a Textbook
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <TextbooksListClient textbooks={textbooks} />
      )}
    </div>
  );
}
