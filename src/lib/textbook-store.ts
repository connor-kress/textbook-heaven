import { create } from "zustand";
import { useEffect } from "react";
import type { Textbook } from "@/types/Textbook";

type TextbooksState = {
  textbooksById: Map<number, Textbook>;
  getTextbook: (id: number) => Textbook | null;
  setTextbook: (textbook: Textbook) => void;
  removeTextbook: (id: number) => void;
  clear: () => void;
  removeQuestionFromTextbook: (
    textbookId: number,
    args: { questionId: number; chapterId: number; sectionId: number | null }
  ) => void;
};

export const useTextbooksStore = create<TextbooksState>((set, get) => ({
  textbooksById: new Map<number, Textbook>(),

  getTextbook: (id: number) => {
    return get().textbooksById.get(id) ?? null;
  },

  setTextbook: (textbook: Textbook) => {
    set(state => {
      const next = new Map(state.textbooksById);
      next.set(textbook.id, textbook);
      return { textbooksById: next };
    });
  },

  removeTextbook: (id: number) => {
    set(state => {
      const next = new Map(state.textbooksById);
      next.delete(id);
      return { textbooksById: next };
    });
  },

  clear: () => set({ textbooksById: new Map() }),

  removeQuestionFromTextbook: (
    textbookId: number,
    { questionId, chapterId, sectionId }
  ) => {
    set(state => {
      const existing = state.textbooksById.get(textbookId);
      if (!existing) return {} as any;

      const updatedChapters = existing.chapters.map(chapter => {
        if (chapter.id !== chapterId) return chapter;
        if (sectionId === null) {
          return {
            ...chapter,
            questions: chapter.questions.filter(q => q.id !== questionId),
          };
        }
        const updatedSections = chapter.sections.map(section =>
          section.id === sectionId
            ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
            : section
        );
        return { ...chapter, sections: updatedSections };
      });

      const updatedTextbook: Textbook = { ...existing, chapters: updatedChapters };
      const next = new Map(state.textbooksById);
      next.set(textbookId, updatedTextbook);
      return { textbooksById: next };
    });
  },
}));

export function useTextbookById(id: number | null): Textbook | null {
  return useTextbooksStore(state => (id != null ? state.textbooksById.get(id) ?? null : null));
}

// Seeds the store with the SSR textbook if missing and returns the store value
// falling back to the SSR textbook to avoid hydration mismatches.
export function useSeedTextbook(ssrTextbook: Textbook): Textbook {
  const storeTextbook = useTextbookById(ssrTextbook.id);
  const setTextbook = useTextbooksStore(state => state.setTextbook);

  useEffect(() => {
    if (!storeTextbook) {
      setTextbook(ssrTextbook);
    }
  }, [storeTextbook, ssrTextbook, setTextbook]);

  return storeTextbook ?? ssrTextbook;
}

 