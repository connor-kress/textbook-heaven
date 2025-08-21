import { create } from "zustand";
import { useEffect } from "react";
import type { Textbook } from "@/types/Textbook";

type TextbooksState = {
  textbooksById: Map<number, Textbook>;
  getTextbook: (id: number) => Textbook | null;
  setTextbook: (textbook: Textbook) => void;
  removeTextbook: (id: number) => void;
  clear: () => void;
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

 