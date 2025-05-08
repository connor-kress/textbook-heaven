CREATE TABLE "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"num" integer NOT NULL,
	"chapterId" integer NOT NULL,
	CONSTRAINT "sections_num_chapterId_unique" UNIQUE("num","chapterId")
);
--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_num_chapterId_unique";--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "sectionId" integer;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_chapterId_chapters_id_fk" FOREIGN KEY ("chapterId") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_sectionId_sections_id_fk" FOREIGN KEY ("sectionId") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "replies_questionId_index" ON "replies" USING btree ("questionId");--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_num_textbookId_unique" UNIQUE("num","textbookId");--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_num_sectionId_unique" UNIQUE("num","sectionId");

-- custom index for robustness (not possible in typescript with drizzle)
CREATE UNIQUE INDEX "unique_chapter_question_num"
ON "questions" ("num", "chapterId")
WHERE "sectionId" IS NULL;
