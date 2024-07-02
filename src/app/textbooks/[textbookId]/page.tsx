type TextbookProps = {
  params: {
    textbookId: string,
  },
};

export default function Textbook({ params }: TextbookProps) {
  return <h1>Textbook {params.textbookId}</h1>
}
