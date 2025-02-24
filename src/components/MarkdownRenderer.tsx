import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function MarkdownRenderer({ text }: { text: string }) {
  return (
    <div
      className="
        prose dark:prose-dark
        flex flex-col
        max-w-full w-full
        dark:bg-neutral-900
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
