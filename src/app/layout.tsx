import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Topbar from "@/components/Topbar";
import "@/styles/globals.css";
import "katex/dist/katex.min.css";

export const metadata = {
  title: "Textbook Heaven",
  description: "A website to organize textbook questions and answers.",
}

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          flex flex-col
          ${inter.className}
          min-h-screen
          flex flex-col
          bg-white dark:bg-neutral-900
          text-neutral-700 dark:text-neutral-200
        `}
        // The bg-background and text-foreground will be applied via globals.css
        // or directly if you prefer, but CSS variables are the Shadcn way.
      >
        <ThemeProvider
          attribute="class" // set the class on the <html> tag
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Topbar />
          <main className="mt-16 flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
