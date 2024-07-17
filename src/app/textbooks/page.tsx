import Link from 'next/link'

export const metadata = {
  title: "Available Textbooks - Textbook Heaven",
  description: "A list of available textbooks to post and view question answers.",
};

export default async function TextbookList() {
  const res = await fetch("http://localhost:3000/textbooks/api", {
    cache: "no-store",
  });
  const textbookNames: string[] = await res.json();
  return (
    <>
      <h1>Available Textbooks:</h1>
      {
        textbookNames.map((name, i) =>
          <Link href={`/textbooks/${name}`} key={i}><h3>{name}</h3></Link>
        )
      }
    </>
  );
}
