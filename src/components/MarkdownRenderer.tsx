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

export function MarkdownPreview({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Preview:</p>
      <MarkdownRenderer text={text} />
    </div>
  );
} 