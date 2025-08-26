import { create } from "zustand";
import { useEffect } from "react";
import { Question, QuestionSchema, Reply } from "@/types/Question";

type QuestionsState = {
  questionsById: Map<number, Question>;
  loadingIds: Set<number>;
  errorById: Map<number, string>;
  getQuestion: (id: number) => Question | null;
  setQuestion: (question: Question) => void;
  removeQuestion: (id: number) => void;
  fetchQuestion: (id: number) => Promise<Question>;
  setReply: (questionId: number, reply: Reply) => void;
  removeReply: (questionId: number, replyId: number) => void;
};

export const useQuestionsStore = create<QuestionsState>((set, get) => ({
  questionsById: new Map<number, Question>(),
  loadingIds: new Set<number>(),
  errorById: new Map<number, string>(),

  getQuestion: (id: number) => {
    const cached = get().questionsById.get(id);
    return cached ?? null;
  },

  setQuestion: (question: Question) => {
    set(state => {
      const next = new Map(state.questionsById);
      next.set(question.id, question);
      const nextErrors = new Map(state.errorById);
      nextErrors.delete(question.id);
      return { questionsById: next, errorById: nextErrors };
    });
  },

  removeQuestion: (id: number) => {
    set(state => {
      const next = new Map(state.questionsById);
      next.delete(id);
      const nextLoading = new Set(state.loadingIds);
      nextLoading.delete(id);
      const nextErrors = new Map(state.errorById);
      nextErrors.delete(id);
      return { questionsById: next, loadingIds: nextLoading, errorById: nextErrors };
    });
  },

  fetchQuestion: async (id: number) => {
    const cached = get().questionsById.get(id);
    if (cached) return cached;

    // mark loading
    set(state => ({ loadingIds: new Set(state.loadingIds).add(id) }));
    try {
      const res = await fetch(`/api/questions/${id}`, { cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message = (body as any).error ?? `Failed to fetch question ${id}`;
        set(state => {
          const nextLoading = new Set(state.loadingIds);
          nextLoading.delete(id);
          const nextErrors = new Map(state.errorById);
          nextErrors.set(id, message);
          return { loadingIds: nextLoading, errorById: nextErrors };
        });
        throw new Error(message);
      }
      const parsed = QuestionSchema.parse(await res.json());
      get().setQuestion(parsed);
      return parsed;
    } finally {
      set(state => {
        const next = new Set(state.loadingIds);
        next.delete(id);
        return { loadingIds: next };
      });
    }
  },

  setReply: (questionId: number, reply: Reply) => {
    const current = get().questionsById.get(questionId);
    if (!current) return;
    const updated: Question = {
      ...current,
      replies: [...current.replies, reply],
    };
    get().setQuestion(updated);
  },

  removeReply: (questionId: number, replyId: number) => {
    const current = get().questionsById.get(questionId);
    if (!current) return;

    function removeFromTree(list: Reply[], targetId: number): Reply[] {
      const filtered = list.filter(r => r.id !== targetId);
      return filtered.map(r => ({
        ...r,
        replies: removeFromTree(r.replies, targetId),
      }));
    }

    const updated: Question = {
      ...current,
      replies: removeFromTree(current.replies, replyId),
    };
    get().setQuestion(updated);
  },
}));

export function useQuestion(questionId: number | null): {
  question: Question | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} {
  const question = useQuestionsStore(state => (questionId != null ? state.questionsById.get(questionId) ?? null : null));
  const loading = useQuestionsStore(state => (questionId != null ? state.loadingIds.has(questionId) : false));
  const error = useQuestionsStore(state => (questionId != null ? state.errorById.get(questionId) ?? null : null));
  const fetchQuestion = useQuestionsStore(state => state.fetchQuestion);

  useEffect(() => {
    if (questionId == null) return;
    if (!question && !loading) {
      void fetchQuestion(questionId).catch(() => {});
    }
  }, [questionId, question, loading, fetchQuestion]);

  return {
    question,
    loading,
    error,
    refetch: async () => {
      if (questionId == null) return;
      await fetchQuestion(questionId);
    },
  };
}
