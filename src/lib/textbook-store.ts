import { create } from "zustand";
import { useEffect } from "react";
import type { Textbook, Chapter, Section } from "@/types/Textbook";

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
  addOrUpdateQuestionInfo: (
    textbookId: number,
    args: { chapterId: number; sectionId: number | null; info: { id: number; num: number } }
  ) => void;
  addOrUpdateChapter: (textbookId: number, chapter: Chapter) => void;
  addOrUpdateSection: (textbookId: number, chapterId: number, section: Section) => void;
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

  addOrUpdateQuestionInfo: (textbookId, { chapterId, sectionId, info }) => {
    set(state => {
      const existing = state.textbooksById.get(textbookId);
      if (!existing) return {} as any;

      function updateQuestionInfoList(list: { id: number; num: number }[]) {
        const filtered = list.filter(q => q.id !== info.id);
        filtered.push(info);
        return filtered.sort((a, b) => a.num - b.num);
      }

      const updatedChapters = existing.chapters.map(ch => {
        if (ch.id !== chapterId) return ch;
        if (sectionId == null) {
          return {
            ...ch,
            questions: updateQuestionInfoList(ch.questions),
          };
        }
        return {
          ...ch,
          sections: ch.sections.map(sec =>
            sec.id === sectionId
              ? { ...sec, questions: updateQuestionInfoList(sec.questions) }
              : sec
          ),
        };
      });

      const updatedTextbook: Textbook = { ...existing, chapters: updatedChapters };
      const next = new Map(state.textbooksById);
      next.set(textbookId, updatedTextbook);
      return { textbooksById: next };
    });
  },

  addOrUpdateChapter: (textbookId, chapter) => {
    set(state => {
      const existing = state.textbooksById.get(textbookId);
      if (!existing) return {} as any;
      const filtered = existing.chapters.filter(c => c.id !== chapter.id);
      filtered.push(chapter);
      const updated: Textbook = {
        ...existing,
        chapters: filtered.sort((a, b) => a.num - b.num),
      };
      const next = new Map(state.textbooksById);
      next.set(textbookId, updated);
      return { textbooksById: next };
    });
  },

  addOrUpdateSection: (textbookId, chapterId, section) => {
    set(state => {
      const existing = state.textbooksById.get(textbookId);
      if (!existing) return {} as any;
      const updatedChapters = existing.chapters.map(ch => {
        if (ch.id !== chapterId) return ch;
        const filtered = ch.sections.filter(s => s.id !== section.id);
        filtered.push(section);
        return { ...ch, sections: filtered.sort((a, b) => a.num - b.num) };
      });
      const updated: Textbook = { ...existing, chapters: updatedChapters };
      const next = new Map(state.textbooksById);
      next.set(textbookId, updated);
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

 