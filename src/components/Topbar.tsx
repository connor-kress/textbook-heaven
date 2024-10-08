import Link from "next/link";

export default function Topbar() {
  return (
    <header className="
      fixed h-16 w-full
      flex flex-row items-center
      shadow-xl
      bg-gray-400 dark:bg-neutral-800
    ">
      <Logo />
    </header>
  );
}

function Logo() {
  return (
    <div className="
      flex items-center text-center
      h-full max-w-36
      text-xl font-bold
      cursor-pointer
      hover:bg-gray-300 dark:hover:bg-neutral-700
    ">
      <Link href="/">Textbook Heaven</Link>
    </div>
  );
}
