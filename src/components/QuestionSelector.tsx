"use client";

import { Chapter, Textbook } from "@/types/Textbook";
import { QuestionInfo } from "@/types/Question";
import Link from "next/link";
import { BsPlus } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { tbUrl } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function QuestionSelector({
  textbook,
  questionId,
  setQuestionId,
}: {
  textbook: Textbook;
  questionId: number | null;
  setQuestionId: (id: number | null) => void;
}) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for hydration to complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <div className="flex overflow-x-auto no-scrollbar items-center p-1 gap-1 bg-neutral-100 dark:bg-neutral-800">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuestionId(null)}
              className="rounded-full h-10 w-10 min-w-10
                         bg-neutral-200 hover:bg-neutral-300 text-neutral-800 border-neutral-300
                         dark:bg-neutral-900 dark:hover:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {"Back to Textbook"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {textbook.chapters.map((chapter) => (
        <ChapterDropdown
          key={chapter.id}
          chapter={chapter}
          // Default to null during SSR and initial hydration
          currentQuestionId={isHydrated ? questionId : null}
          setQuestionId={setQuestionId}
        />
      ))}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={tbUrl(textbook, { newQuestion: "" })}
              title=""
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 min-w-10
                           text-neutral-600 hover:text-neutral-800
                           dark:text-neutral-500 dark:hover:text-neutral-200"
              >
                <BsPlus className="h-6 w-6" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            {"Create New Question"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function ChapterDropdown({
  chapter,
  currentQuestionId,
  setQuestionId,
}: {
  chapter: Chapter;
  currentQuestionId: number | null;
  setQuestionId: (questionId: number | null) => void;
}) {
  const hasReviewQuestions = chapter.questions.length > 0;
  const hasSections = chapter.sections.length > 0;

  const hasActiveQuestion =
    currentQuestionId && isQuestionInChapter(chapter, currentQuestionId);

  const reviewQuestions = chapter.questions.map((question) => (
    <QuestionMenuItem
      key={question.id}
      question={question}
      isActive={currentQuestionId === question.id}
      setQuestionId={setQuestionId}
    />
  ));

  let dropdownContent;
  if (hasSections) {
    dropdownContent = (
      <>
        {/* Sections */}
        {chapter.sections.map((section) => (
          <DropdownMenuSub key={section.id}>
            <DropdownMenuSubTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="truncate align-middle">
                      {chapter.num}.{section.num} {section.title}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {section.title}
                  </TooltipContent>
                </Tooltip>
                {section.questions.length === 0 && (
                  <AlertCircle className="h-3 w-3 ml-2 text-muted-foreground" />
                )}
              </TooltipProvider>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {section.questions.length > 0 ? (
                section.questions
                  .sort((a, b) => a.num - b.num)
                  .map((question) => (
                    <QuestionMenuItem
                      key={question.id}
                      question={question}
                      isActive={currentQuestionId === question.id}
                      setQuestionId={setQuestionId}
                    />
                  ))
              ) : (
                <DropdownMenuItem disabled>
                  {"No questions yet"}
                </DropdownMenuItem>
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}

        {/* Review Questions */}
        {hasReviewQuestions && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {"Review"}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {reviewQuestions}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}
      </>
    );
  } else {
    // Only show questions if no sections exist
    dropdownContent = reviewQuestions;
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "rounded-full",
                  hasActiveQuestion
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-400 dark:bg-cyan-800 dark:hover:bg-cyan-700 dark:text-white dark:border-cyan-500"
                    : "bg-neutral-200 hover:bg-neutral-300 text-neutral-800 border-neutral-300 dark:bg-neutral-900 dark:hover:bg-neutral-700 dark:text-neutral-200 dark:border-neutral-600",
                  "flex items-center gap-2"
                )}
              >
                {"Ch."} {chapter.num}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            {chapter.title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{chapter.title}</DropdownMenuLabel>
        {dropdownContent}
        {!hasSections && !hasReviewQuestions && (
          <DropdownMenuItem disabled>
            {"No questions yet"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function QuestionMenuItem({
  question,
  isActive,
  setQuestionId,
}: {
  question: QuestionInfo;
  isActive: boolean;
  setQuestionId: (questionId: number | null) => void;
}) {
  return (
    <DropdownMenuItem asChild>
      <button
        onClick={() => setQuestionId(question.id)}
        className={cn(
          "w-full text-left",
          isActive && "bg-accent font-medium",
        )}
      >
        {"Question"} {question.num}
      </button>
    </DropdownMenuItem>
  );
}

// Checks if a question is in a given chapter
function isQuestionInChapter(chapter: Chapter, questionId: number): boolean {
  if (chapter.questions.some(q => q.id === questionId)) {
    return true;
  }
  for (const section of chapter.sections) {
    if (section.questions.some(q => q.id === questionId)) {
      return true;
    }
  }
  return false;
}
