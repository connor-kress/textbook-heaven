"use client";

import { useState, useEffect, useCallback } from "react";

// Reads the questionId from the URL and keeps it in sync
// with the state without triggering a Next navigation.
export function useQuestionId(): [number | null, (id: number | null) => void] {
  // Parameters to clear when navigating or canceling forms
  const FORM_PARAMS = [
    "newQuestion",
    "newChapter", 
    "newSection",
    "newChapterId",
    "newSectionId", 
    "newQuestionNum",
    "newChapterNum",
    "newSectionNum"
  ];

  // read initial value once
  const read = () => {
    const p = new URLSearchParams(window.location.search).get("questionId");
    return p ? parseInt(p, 10) : null;
  };
  const [qid, setQid] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    return read();
  });

  // keep back/forward in sync
  useEffect(() => {
    const onPop = () => setQid(read());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // update both URL & state without triggering Next navigation
  const change = useCallback((next: number | null) => {
    const params = new URLSearchParams(window.location.search);
    FORM_PARAMS.forEach(param => params.delete(param));
    if (next !== null) {
      params.set("questionId", next.toString());
    } else {
      params.delete("questionId");
    }
    const search = params.toString();
    const newUrl = window.location.pathname + (search ? `?${search}` : "");
    window.history.pushState({}, "", newUrl);
    setQid(next);
  }, []);

  return [qid, change];
}
