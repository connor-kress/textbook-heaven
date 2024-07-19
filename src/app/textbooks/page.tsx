import Textbook from '@/types/Textbook';
import Link from 'next/link'

export const metadata = {
  title: "Available Textbooks - Textbook Heaven",
  description: "A list of available textbooks to post and view question answers.",
};

export default async function TextbookList() {
  const res = await fetch("http://localhost:3000/textbooks/api", {
    cache: "no-store",
  });
  const textbookNames: Textbook[] = await res.json();
  return (
    <>
      <h1>Available Textbooks:</h1>
      {
        textbookNames.map((tb, i) =>
          <Link href={`/textbooks/${tb.uriName}`} key={i}><h3>{tb.name}</h3></Link>
        )
      }
    </>
  );
}
