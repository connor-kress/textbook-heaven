import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-4xl font-bold">Textbook Heaven</h1>
      <p className="text-center max-w-md">
        This is a website designed to make self study less painful and more
        cooperative.
      </p>

      <Link
        href="/textbooks"
        className="bg-blue-500 text-white px-6 py-2 rounded-md
                   hover:bg-blue-600 transition"
      >
        Browse Textbooks
      </Link>

      <div className="flex space-x-6">
        <Link
          href="/login"
          className="text-blue-500 hover:underline font-medium"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="text-blue-500 hover:underline font-medium"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
