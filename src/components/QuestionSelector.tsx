"use client";

import { Chapter, Textbook } from "@/types/Textbook";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";

export default function QuestionSelector(
  { textbook }: {textbook: Textbook}
) {
  return (
    <div className="
      flex flex-row items-center p-1.5 gap-2
      bg-neutral-800
      overflow-scroll no-scrollbar
    ">
      {
        textbook.chapters.map((ch, i) => (
          <ChapterPill key={i} textbook={textbook} chapter={ch} />
        ))
      }
      <Link
        href={`/textbooks/${textbook.baseFileName}?newQuestion`}
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

function ChapterPill(
  { textbook, chapter }: {textbook: Textbook, chapter: Chapter}
) {
  const params = useSearchParams()
  const questionId = params.get("questionId");
  const [expanded, setExpanded] = useState(false);

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
            <Link href={
                `/textbooks/${textbook.baseFileName}?questionId=${q.id}`
              }
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

