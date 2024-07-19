import Link from 'next/link'
import { fetchTextbooks } from '@/lib/utils';

export const metadata = {
  title: "Available Textbooks - Textbook Heaven",
  description: "A list of available textbooks to post and view question answers.",
};

export default async function TextbookListPage() {
  const textbooks = await fetchTextbooks();
  return (
    <>
      <h1>Available Textbooks:</h1>
      {
        textbooks.map((tb, i) =>
          <Link href={`/textbooks/${tb.uriName}`} key={i}><h3>{tb.name}</h3></Link>
        )
      }
    </>
  );
}
