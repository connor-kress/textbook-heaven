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
      <body>{children}</body>
    </html>
  )
}
