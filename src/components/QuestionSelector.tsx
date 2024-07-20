"use client";

import { useState } from "react";

export default function QuestionSelector() {
  return (
    <div className="
      flex flex-row items-center p-1.5 gap-2
      bg-neutral-800
      overflow-scroll no-scrollbar
    ">
      {
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <ChapterPill key={i} chapter={i} />
        ))
      }
    </div>
  );
}

function ChapterPill({ chapter }: { chapter: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="flex flex-row items-center">
      <button onClick={() => setExpanded(prev => !prev)}
        className={`
        p-4 text-nowrap cursor-pointer shadow-lg
        bg-neutral-900 hover:bg-neutral-700
        ${expanded ? "rounded-l-3xl" : "rounded-3xl"}
      `}>
        chpt. {chapter}
      </button>
      {expanded && <div className="
        flex flex-row p-2 pr-3 gap-2
        bg-cyan-600 rounded-r-3xl shadow-lg
      ">
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="
              p-2 rounded-full
              text-neutral-900 hover:text-neutral-200
              cursor-pointer font-bold
            ">{i}</div>
          ))
        }
      </div>}
    </div>
  );

}

