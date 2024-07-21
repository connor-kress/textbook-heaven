"use client";

import { ChapterInfo } from "@/types/TextbookInfo";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function QuestionSelector(
  { chapters }: { chapters: ChapterInfo[] }
) {
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
    </div>
  );
}

function ChapterPill({ chapter }: { chapter: ChapterInfo }) {
  const [expanded, setExpanded] = useState(false);
  const { textbookName } = useParams<{ textbookName: string }>();

  chapter.questions.sort((a, b) => a.num - b.num);
  return (
    <div className="flex flex-row items-center">
      <button onClick={() => setExpanded(prev => !prev)}
        title={chapter.name}
        className={`
        p-4 text-nowrap cursor-pointer shadow-lg
        bg-neutral-900 hover:bg-neutral-700
        ${expanded ? "rounded-l-3xl" : "rounded-3xl"}
      `}>
        chpt. {chapter.num}
      </button>
      {expanded && <div className="
        flex flex-row p-2 pr-3 gap-2
        bg-cyan-600 rounded-r-3xl shadow-lg
      ">
        {
          chapter.questions.map((q, i) => (
            <Link href={`/textbooks/${textbookName}?questionId=${q.id}`}
                  key={i} className="
              p-2 rounded-full
              text-neutral-900 hover:text-neutral-200
              cursor-pointer font-bold
            ">{q.num}</Link>
          ))
        }
      </div>}
    </div>
  );

}

