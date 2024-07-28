"use client";

import { Chapter } from "@/types/Textbook";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";

export default function QuestionSelector(
  { chapters }: { chapters: Chapter[] }
) {
  const { textbookName } = useParams<{ textbookName: string }>();
  return (
    <div className="
      flex flex-row items-center p-1.5 gap-2
      bg-neutral-800
      overflow-scroll no-scrollbar
    ">
      {
        chapters.map((ch, i) => (
          <ChapterPill key={i} chapter={ch} />
        ))
      }
      <Link
        href={`/textbooks/${textbookName}?newQuestion`}
        title="Create New Question"
        className="
        rounded-full p-2 cursor-pointer
        text-neutral-500 hover:text-neutral-200
        bg-neutral-700
        bg-opacity-0 hover:bg-opacity-100
      ">
        <BsPlus size="28" />
      </Link>
    </div>
  );
}

function ChapterPill({ chapter }: { chapter: Chapter }) {
  const params = useSearchParams()
  const questionId = params.get("questionId");
  const [expanded, setExpanded] = useState(false);
  const { textbookName } = useParams<{ textbookName: string }>();

  chapter.questions.sort((a, b) => a.num - b.num);
  return (
    <div className="flex flex-row items-center">
      <button onClick={() => setExpanded(prev => !prev)}
        title={chapter.title === null ? "No Title" : chapter.title}
        className={`
        p-4 text-nowrap cursor-pointer shadow-lg
        bg-neutral-900 hover:bg-neutral-700
        ${expanded ? "rounded-l-3xl" : "rounded-3xl"}
      `}>
        chpt. {chapter.num}
      </button>
      {expanded && <div className="
        flex flex-row p-2 pr-3 gap-2
        min-h-14
        bg-cyan-500 rounded-r-3xl shadow-lg
      ">
        {
          chapter.questions.map((q, i) => (
            <Link href={`/textbooks/${textbookName}?questionId=${q.id}`}
                  key={i} className={`
              p-2 rounded-full
              cursor-pointer font-bold
              ${questionId === q.id.toString()
                  ? "text-neutral-200 underline"
                  : "text-neutral-900 hover:text-neutral-200"}
            `}>{q.num}</Link>
          ))
        }
      </div>}
    </div>
  );

}

