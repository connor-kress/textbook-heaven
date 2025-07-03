import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Textbook } from "@/types/Textbook";
import { QuestionInfoWithLocation } from "@/types/Question";

/**
 * Merges multiple class values into a single string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Returns the URL for a textbook with optional search parameters.
 */
export function tbUrl(
  textbook: Textbook, params?: Record<string, string | number>
): string {
  const url = `/textbooks/${textbook.baseFileName}`;
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value.toString());
  });
  return `${url}?${searchParams.toString()}`;
}

/**
 * Helper to get all question ids in reading order.
 */
export function getOrderedQuestionInfo(textbook: Textbook): QuestionInfoWithLocation[] {
  const ordered = [];
  const sortedChapters = [...textbook.chapters].sort((a, b) => a.num - b.num);
  for (const chapter of sortedChapters) {
    // Section questions
    const sortedSections = [...chapter.sections].sort((a, b) => a.num - b.num);
    for (const section of sortedSections) {
      const sortedSectionQuestions = [...section.questions].sort((a, b) => a.num - b.num);
      for (const q of sortedSectionQuestions) {
        ordered.push({
          ...q,
          chapterNum: chapter.num,
          chapterId: chapter.id,
          sectionNum: section.num,
          sectionId: section.id,
        });
      }
    }
    // Review questions
    const sortedChapterQuestions = [...chapter.questions].sort((a, b) => a.num - b.num);
    for (const q of sortedChapterQuestions) {
      ordered.push({
        ...q,
        chapterNum: chapter.num,
        chapterId: chapter.id,
        sectionNum: null,
        sectionId: null,
      });
    }
  }
  return ordered;
}
