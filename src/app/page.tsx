import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-2 p-2">
      <h1 className="text-4xl font-bold">Textbook Heaven</h1>
      <p>
        This is a website designed to make self study less painful and more
        cooperative.
      </p>
      <p>
        To get started, simply
        {" "}<Link className="text-blue-400" href="/textbooks">
          click here
        </Link>{" "}
        to view the available textbooks.
      </p>
    </div>
  );
}
