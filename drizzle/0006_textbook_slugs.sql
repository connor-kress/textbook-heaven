-- Add slug column
ALTER TABLE "textbooks" ADD COLUMN "slug" text;

-- Backfill slug: use fileName without .pdf (case-insensitive), or fallback to a unique placeholder using id
UPDATE "textbooks"
SET "slug" = CASE
  WHEN "fileName" IS NOT NULL THEN regexp_replace("fileName", E'\\.pdf$', '', 'i')
  ELSE 'untitled-' || "id"::text
END;

-- Make slug required
ALTER TABLE "textbooks" ALTER COLUMN "slug" SET NOT NULL;

-- Enforce uniqueness on slug
ALTER TABLE "textbooks" ADD CONSTRAINT "textbooks_slug_unique" UNIQUE("slug");