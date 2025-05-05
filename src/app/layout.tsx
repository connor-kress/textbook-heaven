import Topbar from "@/components/Topbar";

import "@/styles/globals.css";
import "katex/dist/katex.min.css";


export const metadata = {
  title: "Textbook Heaven",
  description: "A website to organize textbook questions and answers.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="
        flex flex-col
        bg-white dark:bg-neutral-900
        text-neutral-700 dark:text-neutral-200
      ">
        <Topbar />
        <main className="mt-16 flex-1">{children}</main>
      </body>
    </html>
  )
}
