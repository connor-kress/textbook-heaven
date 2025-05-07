import { eq } from "drizzle-orm";
import { db } from "./index";
import { chapters, questions, textbooks } from "./schema";
import { Chapter, Textbook, TextbookSchema } from '@/types/Textbook';

const textbookQuery = db
    .select({
      textbook: textbooks,
      chapter: chapters,
      question: {
        id: questions.id,
        num: questions.num,
      },
    })
    .from(textbooks)
    .leftJoin(chapters, eq(textbooks.id, chapters.textbookId))
    .leftJoin(questions, eq(chapters.id, questions.chapterId));

export async function fetchTextbooks(): Promise<Textbook[]> {
  const rows = await textbookQuery
    .orderBy(textbooks.id)
    .execute();

  const textbookMap = new Map<number, Textbook>();
  for (let row of rows) {
    if (!textbookMap.has(row.textbook.id)) {
      textbookMap.set(row.textbook.id, {
        ...row.textbook,
        baseFileName : row.textbook.fileName.replace(/.pdf$/, ""),
        filePath: `/pdf/${row.textbook.fileName}`,
        chapters: [],
      })
    }
    const textbook = textbookMap.get(row.textbook.id)!;
    let chapter = textbook.chapters.find(c => c.id === row.chapter?.id);
    if (row.chapter) {
      if (!chapter) {
        chapter = { ...row.chapter, questions: [] };
        textbook.chapters.push(chapter);
      }
    }
    if (row.question) {
      chapter!.questions.push(row.question);
    }
  };
  const textbookArray = Array.from(textbookMap.values());
  console.log(textbookArray);
  return TextbookSchema.array().parse(textbookArray);
}

export async function fetchTextbook(
  baseFileName: string
): Promise<Textbook | null> {
  const rows = await textbookQuery
    .where(eq(textbooks.fileName, `${baseFileName}.pdf`))
    .execute()

  if (rows.length === 0) {
    return null;
  }

  const chapterMap = new Map<number, Chapter>();
  for (let row of rows) {
    if (!row.chapter) {
      continue;
    }
    if (!chapterMap.has(row.chapter.id)) {
      chapterMap.set(row.chapter.id, { ...row.chapter, questions: [] });
    }
    if (row.question) {
      chapterMap.get(row.chapter.id)?.questions.push(row.question);
    }
  };
  const chapters = Array.from(chapterMap.values());
  const first = rows[0];
  const textbook: Textbook = {
    ...first.textbook,
    baseFileName,
    filePath: `/pdf/${first.textbook.fileName}`,
    chapters,
  };
  console.log(textbook);
  return TextbookSchema.parse(textbook);
}
