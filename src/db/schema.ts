import {
  pgTable,
  unique,
  text,
  boolean,
  timestamp,
  foreignKey,
  serial,
  integer,
} from "drizzle-orm/pg-core"

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

export const textbooks = pgTable("textbooks", {
	id: serial().primaryKey().notNull(),
	title: text(),
	author: text(),
	description: text(),
	fileName: text("file_name").notNull(),
}, (table) => [
	unique("textbooks_file_name_key").on(table.fileName),
]);

export const chapters = pgTable("chapters", {
	id: serial().primaryKey().notNull(),
	title: text(),
	num: integer().notNull(),
	textbookId: integer("textbook_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.textbookId],
			foreignColumns: [textbooks.id],
			name: "chapters_textbook_id_fkey"
		}).onDelete("cascade"),
]);

export const questions = pgTable("questions", {
	id: serial().primaryKey().notNull(),
	authorId: text("author_id").notNull(),
	postDate: timestamp("post_date", { mode: "string" }).notNull().defaultNow(),
	num: integer().notNull(),
	body: text().notNull(),
	chapterId: integer("chapter_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.id],
			name: "questions_author_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.chapterId],
			foreignColumns: [chapters.id],
			name: "questions_chapter_id_fkey"
		}).onDelete("cascade"),
	unique("questions_chapter_id_num_key").on(table.num, table.chapterId),
]);

export const replies = pgTable("replies", {
	id: serial().primaryKey().notNull(),
	authorId: text("author_id").notNull(),
	postDate: timestamp("post_date", { mode: "string" }).notNull().defaultNow(),
	body: text().notNull(),
	parentReplyId: integer("parent_reply_id"),
	questionId: integer("question_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [user.id],
			name: "replies_author_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parentReplyId],
			foreignColumns: [table.id],
			name: "replies_parent_reply_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.questionId],
			foreignColumns: [questions.id],
			name: "replies_question_id_fkey"
		}).onDelete("cascade"),
]);
