import Link from 'next/link'
import { fetchTextbooks } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Available Textbooks - Textbook Heaven",
  description: "A list of available textbooks to post and view question answers.",
};

export default async function TextbookListPage() {
  const textbooks = await fetchTextbooks();
  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <h1 className="text-2xl font-bold">Available Textbooks:</h1>
      {
        textbooks.map((tb, i) =>
          <Link
            href={`/textbooks/${tb.baseFileName}`} key={i}
            className="text-blue-400"
          >
            <h3>{tb.title}</h3>
          </Link>
        )
      }
    </div>
  );
}
