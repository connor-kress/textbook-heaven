import Topbar from "@/components/Topbar";
import pool from "@/lib/db";
import "@/styles/globals.css";

export const metadata = {
  title: "Textbook Heaven",
  description: "A website to organize textbook questions and answers.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  pool;
  return (
    <html lang="en">
      <body className="
        flex flex-col
        bg-white dark:bg-neutral-900
        text-neutral-950 dark:text-neutral-200
      ">
        <Topbar />
        <main className="mt-16 flex-1">{children}</main>
      </body>
    </html>
  )
}
