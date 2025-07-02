"use client";

import { Textbook, Chapter, Section } from "@/types/Textbook";
import { Button } from "@/components/ui/button";
import { PlusIcon, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { tbUrl } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TextbookHomePageProps {
  textbook: Textbook;
}

export function TextbookHomePage({ textbook }: TextbookHomePageProps) {
  const [openChapters, setOpenChapters] = useState<Set<number>>(new Set());

  const toggleChapter = (chapterId: number) => {
    const newOpenChapters = new Set(openChapters);
    if (newOpenChapters.has(chapterId)) {
      newOpenChapters.delete(chapterId);
    } else {
      newOpenChapters.add(chapterId);
    }
    setOpenChapters(newOpenChapters);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{textbook.title}</h1>
          {textbook.author && (
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              by {textbook.author}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={tbUrl(textbook, { newChapter: "" })}>
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Chapter
            </Button>
          </Link>
          <Link href={tbUrl(textbook, { newSection: "" })}>
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Section
            </Button>
          </Link>
          <Link href={tbUrl(textbook, { newQuestion: "" })}>
            <Button variant="outline" size="sm">
              <PlusIcon className="h-4 w-4 mr-2" />
              New Question
            </Button>
          </Link>
        </div>
      </div>

      {textbook.description && (
        <p className="text-neutral-700 dark:text-neutral-300">
          {textbook.description}
        </p>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Chapters</h2>
        
        {textbook.chapters.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p>No chapters yet.</p>
            <Link href={tbUrl(textbook, { newChapter: "" })}>
              <Button variant="outline" className="mt-2">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create First Chapter
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {textbook.chapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                textbook={textbook}
                isOpen={openChapters.has(chapter.id)}
                onToggle={() => toggleChapter(chapter.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ChapterCardProps {
  chapter: Chapter;
  textbook: Textbook;
  isOpen: boolean;
  onToggle: () => void;
}

function ChapterCard({ chapter, textbook, isOpen, onToggle }: ChapterCardProps) {
  const hasSections = chapter.sections.length > 0;
  const hasQuestions = chapter.questions.length > 0;
  const totalQuestions = chapter.questions.length
    + chapter.sections.reduce((sum, section) => sum + section.questions.length, 0);

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )}
                    <div className="text-left min-w-0 flex-1">
                      <h3 className="font-semibold truncate">Chapter {chapter.num}: {chapter.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {totalQuestions} question{totalQuestions !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </Button>
              </CollapsibleTrigger>
            </TooltipTrigger>
            <TooltipContent side="left" className="lg:block hidden">
              <p>Chapter {chapter.num}: {chapter.title}</p>
            </TooltipContent>
            <TooltipContent side="top" className="lg:hidden">
              <p>Chapter {chapter.num}: {chapter.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <CollapsibleContent className="px-4 pb-4">
          <div className="space-y-3">
            {/* Sections */}
            {hasSections && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-neutral-600 dark:text-neutral-400">
                  Sections:
                </h4>
                {chapter.sections.map((section) => (
                  <SectionItem
                    key={section.id}
                    section={section}
                    chapter={chapter}
                    textbook={textbook}
                  />
                ))}
              </div>
            )}

            {/* Add Section Link - always show */}
            <Link
              href={tbUrl(textbook, { newSection: "", newChapterId: chapter.id })}
              className="block"
            >
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                <PlusIcon className="h-3 w-3 mr-1" />
                Add Section
              </Button>
            </Link>

            {/* Review Questions (always show if they exist) */}
            {hasQuestions && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-neutral-600 dark:text-neutral-400">
                  {hasSections ? "Review Questions:" : "Questions:"}
                </h4>
                <div className="ml-4 border-l-2 border-neutral-200 dark:border-neutral-700 pl-3">
                  <div className="flex flex-wrap gap-1">
                    {chapter.questions.map((question) => (
                      <QuestionItem
                        key={question.id}
                        question={question}
                        textbook={textbook}
                      />
                    ))}
                  </div>
                  <div className="mt-2">
                    <Link
                      href={tbUrl(textbook, { newQuestion: "", newChapterId: chapter.id })}
                      className="block"
                    >
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        <PlusIcon className="h-3 w-3 mr-1" />
                        Add {hasSections ? "Review " : ""}Question
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Add first Review Question (when no review questions exist) */}
            {!hasQuestions && (
              <Link
                href={tbUrl(textbook, { newQuestion: "", newChapterId: chapter.id })}
                className="block"
              >
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Add {hasSections ? "Review " : ""}Question
                </Button>
              </Link>
            )}          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface SectionItemProps {
  section: Section;
  chapter: Chapter;
  textbook: Textbook;
}

function SectionItem({ section, chapter, textbook }: SectionItemProps) {
  return (
    <div className="ml-4 border-l-2 border-neutral-200 dark:border-neutral-700 pl-3">
      <div>
        <h5 className="font-medium">
          Section {section.num}: {section.title}
        </h5>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          {section.questions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              textbook={textbook}
            />
          ))}
        </div>
      </div>
      <div className="mt-2">
        <Link
          href={tbUrl(textbook, { newQuestion: "", newChapterId: chapter.id, newSectionId: section.id })}
          className="block"
        >
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            <PlusIcon className="h-3 w-3 mr-1" />
            Add Question
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface QuestionItemProps {
  question: { id: number; num: number };
  textbook: Textbook;
}

function QuestionItem({ question, textbook }: QuestionItemProps) {
  return (
    <Link
      href={tbUrl(textbook, { questionId: question.id })}
      className="inline-block px-2 py-1 text-sm bg-neutral-100 dark:bg-neutral-800 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
    >
      Q{question.num}
    </Link>
  );
} 