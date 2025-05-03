"use client";

import Link from "next/link";
import ProfilePicture from "./ProfilePicture";
import { authClient } from "@/lib/auth-client";
import LogoutButton from "./LogoutButton";

export default function Topbar() {
  const { data: session, isPending } = authClient.useSession();
  let rightItems;
  if (isPending || !session) {
    rightItems = (
      <>
        <NavLink href="/signin" text="Login" />
        <NavLink href="/signup" text="Sign up" />
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
        shadow-xl
        text-neutral-200 bg-neutral-800
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
      </div>
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
