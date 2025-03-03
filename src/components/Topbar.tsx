import Link from "next/link";

export default function Topbar() {
  return (
    <header className="
      fixed h-16 w-full z-50
      flex flex-row items-center
      shadow-xl
      text-neutral-200
      bg-neutral-800
    ">
      <Logo />
      <NavLink href="/textbooks" text="Textbooks" />
    </header>
  );
}

function Logo() {
  return (
    <div className="
      flex items-center text-center
      h-full max-w-36 px-4
      text-xl font-bold
      cursor-pointer
      hover:bg-neutral-700
    ">
      <Link href="/">Textbook Heaven</Link>
    </div>
  );
}

function NavLink({ href, text }: { href: string, text: string }) {
  return (
    <div className="
      flex items-center text-center
      h-full px-4
      text-lg
      cursor-pointer
      hover:bg-neutral-700
    ">
      <Link href={href}>{text}</Link>
    </div>
  );
}
