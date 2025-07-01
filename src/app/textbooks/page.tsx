import Link from "next/link"
import { fetchTextbooks } from "@/db/textbooks";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {textbooks.map((tb, i) => {
          const coverImagePath = tb.coverImagePath
            ? `/covers/${tb.coverImagePath}`
            : "/covers/cover-placeholder.jpg";
          return <Link
            href={`/textbooks/${tb.baseFileName}`}
            key={i}
            className="group block rounded-lg shadow hover:shadow-lg transition overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="w-full aspect-[3/4] bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
              <img
                src={coverImagePath}
                alt={tb.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-4 flex flex-col gap-1">
              <h3 className="text-lg font-semibold truncate">{tb.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">{tb.author}</p>
            </div>
          </Link>
        })}
      </div>
    </div>
  );
}
