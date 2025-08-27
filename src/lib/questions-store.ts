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
  addReply: (questionId: number, parentReplyId: number | null, reply: Reply) => void;
  updateReply: (questionId: number, reply: Reply) => void;
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

  addReply: (questionId: number, parentReplyId: number | null, reply: Reply) => {
    const current = get().questionsById.get(questionId);
    if (!current) return;

    if (parentReplyId == null) {
      get().setQuestion({
        ...current,
        replies: [...current.replies, reply],
      });
      return;
    }

    function addReply(list: Reply[], parentReplyId: number | null, reply: Reply): Reply[] {
      return list.map(r => {
        if (r.id === parentReplyId) return { ...r, replies: [...r.replies, reply] };
        return { ...r, replies: addReply(r.replies, parentReplyId, reply) };
      });
    }

    get().setQuestion({
      ...current,
      replies: addReply(current.replies, parentReplyId, reply),
    });
  },

  updateReply: (questionId: number, reply: Reply) => {
    const current = get().questionsById.get(questionId);
    if (!current) return;

    function updateReply(list: Reply[]): Reply[] {
      return list.map(r => {
        if (r.id === reply.id) return reply;
        return { ...r, replies: updateReply(r.replies) };
      });
    }

    get().setQuestion({
      ...current,
      replies: updateReply(current.replies),
    });
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

    get().setQuestion({
      ...current,
      replies: removeFromTree(current.replies, replyId),
    });
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
    // Only fetch if we don't have it, we're not currently loading it, and we haven't
    // already recorded an error for it
    if (!question && !loading && !error) {
      void fetchQuestion(questionId).catch(() => {});
    }
  }, [questionId, question, loading, error, fetchQuestion]);

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
