import { relations } from "drizzle-orm/relations";
import {
  user,
  session,
  account,
  textbooks,
  chapters,
  questions,
  replies,
  sections,
} from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  }),
}));

export const userRelations = relations(user, ({many}) => ({
  sessions: many(session),
  accounts: many(account),
  questions: many(questions),
  replies: many(replies),
}));

export const accountRelations = relations(account, ({one}) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  }),
}));

export const textbooksRelations = relations(textbooks, ({many}) => ({
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({one, many}) => ({
  textbook: one(textbooks, {
    fields: [chapters.textbookId],
    references: [textbooks.id]
  }),
  sections: many(sections),
  questions: many(questions),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [sections.chapterId],
    references: [chapters.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({one, many}) => ({
  user: one(user, {
    fields: [questions.authorId],
    references: [user.id]
  }),
  chapter: one(chapters, {
    fields: [questions.chapterId],
    references: [chapters.id]
  }),
  section: one(sections, {
    fields: [questions.sectionId],
    references: [sections.id]
  }),
  replies: many(replies),
}));

export const repliesRelations = relations(replies, ({one, many}) => ({
  user: one(user, {
    fields: [replies.authorId],
    references: [user.id]
  }),
  parentReply: one(replies, {
    fields: [replies.parentReplyId],
    references: [replies.id],
  }),
  replies: many(replies),
  question: one(questions, {
    fields: [replies.questionId],
    references: [questions.id]
  }),
}));
