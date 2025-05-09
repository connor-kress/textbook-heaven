"use client";

import { Chapter, Textbook } from "@/types/Textbook";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

export default function QuestionSelector({ textbook }: { textbook: Textbook }) {
  const params = useSearchParams();
  const questionId = params.get("questionId");

  return (
    <div className="flex overflow-x-auto no-scrollbar items-center
                    p-1 gap-1 bg-neutral-800">
      {textbook.chapters.map((chapter) => (
        <ChapterDropdown
          key={chapter.id}
          chapter={chapter}
          textbook={textbook}
          currentQuestionId={questionId}
        />
      ))}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/textbooks/${textbook.baseFileName}?newQuestion`}
              title=""
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 min-w-10
                           text-neutral-500 hover:text-neutral-200"
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
  textbook,
  currentQuestionId,
}: {
  chapter: Chapter;
  textbook: Textbook;
  currentQuestionId: string | null;
}) {
  const hasReviewQuestions = chapter.questions.length > 0;
  const hasSections = chapter.sections.length > 0;

  const hasActiveQuestion =
    currentQuestionId && isQuestionInChapter(chapter, currentQuestionId);

  const reviewQuestions = chapter.questions.map((question) => (
    <QuestionMenuItem
      key={question.id}
      question={question}
      textbook={textbook}
      isActive={currentQuestionId === question.id.toString()}
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
                  <AlertCircle className="h-3 w-3 ml-2
                                          text-muted-foreground" />
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
                      textbook={textbook}
                      isActive={currentQuestionId === question.id.toString()}
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
                    ? "bg-cyan-800 hover:bg-cyan-700 text-white border-cyan-500"
                    : "bg-neutral-900 hover:bg-neutral-700 text-neutral-200",
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
  question, textbook, isActive
}: {
  question: { id: number; num: number };
  textbook: Textbook;
  isActive: boolean;
}) {
  return (
    <DropdownMenuItem asChild>
      <Link
        href={`/textbooks/${textbook.baseFileName}?questionId=${question.id}`}
        className={cn(
          isActive && "bg-accent font-medium"
        )}
      >
        {"Question"} {question.num}
      </Link>
    </DropdownMenuItem>
  );
}

// Checks if a question is in a given chapter
function isQuestionInChapter(chapter: Chapter, questionId: string): boolean {
  if (chapter.questions.some(q => q.id.toString() === questionId)) {
    return true;
  }
  for (const section of chapter.sections) {
    if (section.questions.some(q => q.id.toString() === questionId)) {
      return true;
    }
  }
  return false;
}
