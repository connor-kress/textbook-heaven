import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Chapter, Section, Textbook } from "@/types/Textbook";
import { QuestionInfo, QuestionInfoWithLocation, Reply } from "@/types/Question";

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
  const encodedTextbookName = encodeURIComponent(textbook.baseFileName);
  const url = `/textbooks/${encodedTextbookName}`;
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
 * Copies text to the clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy text to clipboard:", error);
    return false;
  }
}

/**
 * Formats a date into a human-readable relative time string.
 */
export function formatDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

/**
 * Updates a list of question infos, keeping questions sorted by num.
 */
function updateQuestionInfoList(list: QuestionInfo[], info: QuestionInfo): QuestionInfo[] {
  const newList = list.filter(q => q.id !== info.id);
  newList.push(info);
  return newList.sort((a, b) => a.num - b.num);
}

/**
 * Returns a new Textbook with the provided QuestionInfo inserted into the
 * appropriate chapter/section, keeping questions sorted by num. Does not mutate input.
 */
export function addQuestionInfoToTextbook(
  textbook: Textbook,
  chapterId: number,
  sectionId: number | null,
  info: QuestionInfo
): Textbook {
  const updatedChapters = textbook.chapters.map(ch => {
    if (ch.id !== chapterId) return ch;
    // Add to review questions
    if (sectionId == null) {
      return {
        ...ch,
        questions: updateQuestionInfoList(ch.questions, info),
      };
    }
    // Add to section questions
    return {
      ...ch,
      sections: ch.sections.map(sec => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          questions: updateQuestionInfoList(sec.questions, info),
        };
      }),
    };
  });
  return { ...textbook, chapters: updatedChapters };
}

/**
 * Returns a new Textbook with a chapter added or updated (by id),
 * keeping chapters sorted by num. New chapters start with empty sections/questions.
 */
export function addChapterToTextbook(
  textbook: Textbook,
  chapter: Chapter,
): Textbook {
  const newChapters = textbook.chapters.filter(c => c.id !== chapter.id);
  newChapters.push(chapter);
  return {
    ...textbook,
    chapters: newChapters.sort((a, b) => a.num - b.num),
  };
}

/**
 * Returns a new Textbook with a section added or updated (by id) within a chapter,
 * keeping sections sorted by num. New sections start with empty questions.
 */
export function addSectionToTextbook(
  textbook: Textbook,
  chapterId: number,
  section: Section,
): Textbook {
  const updatedChapters = textbook.chapters.map(ch => {
    if (ch.id !== chapterId) return ch;
    const newSections = ch.sections.filter(s => s.id !== section.id);
    newSections.push(section);
    return { ...ch, sections: newSections.sort((a, b) => a.num - b.num) };
  });
  return { ...textbook, chapters: updatedChapters };
}

/**
 * Finds a reply in a tree of replies.
 */
export function findReplyInTree(replyId: number, replyTree: Reply[]): Reply | null {
  for (const reply of replyTree) {
    if (reply.id === replyId) return reply;
    const found = findReplyInTree(replyId, reply.replies);
    if (found) return found;
  }
  return null;
}
