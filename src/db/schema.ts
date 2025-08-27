import {
  pgTable,
  unique,
  text,
  boolean,
  timestamp,
  foreignKey,
  serial,
  integer,
  index,
} from "drizzle-orm/pg-core"

/* Better Auth Tables */

export const user = pgTable("user", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  email: text().notNull(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp({ mode: "string" }).notNull(),
  updatedAt: timestamp({ mode: "string" }).notNull(),
}, (table) => [
  unique("user_email_key").on(table.email),
]);

export const session = pgTable("session", {
  id: text().primaryKey().notNull(),
  expiresAt: timestamp({ mode: "string" }).notNull(),
  token: text().notNull(),
  createdAt: timestamp({ mode: "string" }).notNull(),
  updatedAt: timestamp({ mode: "string" }).notNull(),
  ipAddress: text(),
  userAgent: text(),
  userId: text().notNull(),
}, (table) => [
  foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "session_userId_fkey"
    }),
  unique("session_token_key").on(table.token),
]);

export const account = pgTable("account", {
  id: text().primaryKey().notNull(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: text().notNull(),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp({ mode: "string" }),
  refreshTokenExpiresAt: timestamp({ mode: "string" }),
  scope: text(),
  password: text(),
  createdAt: timestamp({ mode: "string" }).notNull(),
  updatedAt: timestamp({ mode: "string" }).notNull(),
}, (table) => [
  foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "account_userId_fkey"
    }),
]);

export const verification = pgTable("verification", {
  id: text().primaryKey().notNull(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ mode: "string" }).notNull(),
  createdAt: timestamp({ mode: "string" }),
  updatedAt: timestamp({ mode: "string" }),
});

/* My Tables */

export const textbooks = pgTable("textbooks", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  author: text().notNull(),
  description: text(),
  slug: text().notNull(),
  fileName: text(),
  coverImagePath: text(),
}, (table) => [
  unique().on(table.slug),
  unique().on(table.fileName),
]);

export const chapters = pgTable("chapters", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  num: integer().notNull(),
  textbookId: integer().notNull(),
}, (table) => [
  foreignKey({
      columns: [table.textbookId],
      foreignColumns: [textbooks.id],
    }).onDelete("cascade"),
  unique().on(table.num, table.textbookId),
]);

export const sections = pgTable("sections", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  num: integer().notNull(),
  chapterId: integer().notNull(),
}, (table) => [
  foreignKey({
      columns: [table.chapterId],
      foreignColumns: [chapters.id],
    }).onDelete("cascade"),
  unique().on(table.num, table.chapterId),
]);

export const questions = pgTable("questions", {
  id: serial().primaryKey().notNull(),
  authorId: text().notNull(),
  postDate: timestamp({ mode: "string" }).notNull().defaultNow(),
  editedAt: timestamp({ mode: "string" }),
  num: integer().notNull(),
  body: text().notNull(),
  chapterId: integer().notNull(),
  sectionId: integer(),
}, (table) => [
  foreignKey({
      columns: [table.authorId],
      foreignColumns: [user.id],
    }).onDelete("cascade"),
  foreignKey({
      columns: [table.chapterId],
      foreignColumns: [chapters.id],
    }).onDelete("cascade"),
  foreignKey({
      columns: [table.sectionId],
      foreignColumns: [sections.id],
    }).onDelete("cascade"),
  unique().on(table.num, table.sectionId),
]);

export const replies = pgTable("replies", {
  id: serial().primaryKey().notNull(),
  authorId: text().notNull(),
  postDate: timestamp({ mode: "string" }).notNull().defaultNow(),
  editedAt: timestamp({ mode: "string" }),
  body: text().notNull(),
  parentReplyId: integer(),
  questionId: integer().notNull(),
}, (table) => [
  foreignKey({
      columns: [table.authorId],
      foreignColumns: [user.id],
    }).onDelete("cascade"),
  foreignKey({
      columns: [table.parentReplyId],
      foreignColumns: [table.id],
    }).onDelete("cascade"),
  foreignKey({
      columns: [table.questionId],
      foreignColumns: [questions.id],
    }).onDelete("cascade"),
  index().on(table.questionId),
]);
