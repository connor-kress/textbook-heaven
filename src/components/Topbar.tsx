"use client";

import Link from "next/link";
import ProfilePicture from "./ProfilePicture";
import { authClient } from "@/lib/auth-client";
import LogoutButton from "./LogoutButton";
import { ThemeToggleButton } from "./ThemeToggleButton";

export default function Topbar() {
  const { data: session, isPending } = authClient.useSession();
  let rightItems;
  if (isPending || !session) {
    rightItems = (
      <>
        <NavLink href="/login" text="Login" />
      </>
    );
  } else {
    rightItems = (
      <>
        <ProfilePicture />
        <LogoutButton />
      </>
    );
  }

  return (
    <header
      className="
        fixed h-16 w-full z-50 pr-4
        flex items-center justify-between
        shadow-md
        text-neutral-800 bg-neutral-100
        dark:text-neutral-200 dark:bg-neutral-900
      "
    >
      {/* left side */}
      <div className="flex items-center h-full">
        <Logo />
        <NavLink href="/textbooks" text="Textbooks" />
      </div>

      {/* right side */}
      <div className="flex items-center h-full">
        {rightItems}
        <div className="ml-2">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="
        flex items-center text-center
        h-full max-w-36 px-4
        text-xl font-bold
        cursor-pointer
        hover:bg-neutral-200
        dark:hover:bg-neutral-700
      "
    >
      Textbook Heaven
    </Link>
  );
}

function NavLink({ href, text }: { href: string, text: string }) {
  return (
    <Link
      href={href}
      className="
        flex items-center text-center
        h-full px-4
        text-lg
        cursor-pointer
        hover:bg-neutral-200
        dark:hover:bg-neutral-700
      "
    >
      {text}
    </Link>
  );
}
