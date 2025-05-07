import { eq } from "drizzle-orm";
import { db } from "./index";
import { chapters, questions, textbooks } from "./schema";
import { Chapter, Textbook, TextbookSchema } from '@/types/Textbook';

const textbookQuery = db
    .select({
      textbook_id: textbooks.id,
      textbook_title: textbooks.title,
      textbook_author: textbooks.author,
      textbook_description: textbooks.description,
      textbook_file_name: textbooks.fileName,

      chapter_id: chapters.id,
      chapter_title: chapters.title,
      chapter_num: chapters.num,

      question_id: questions.id,
      question_num: questions.num,
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
    if (!textbookMap.has(row.textbook_id)) {
      textbookMap.set(row.textbook_id, {
        id: row.textbook_id,
        title: row.textbook_title,
        author: row.textbook_author,
        description: row.textbook_description,
        fileName: row.textbook_file_name,
        baseFileName : row.textbook_file_name.replace(/.pdf$/, ""),
        filePath: `/pdf/${row.textbook_file_name}`,
        chapters: [],
      })
    }
    const textbook = textbookMap.get(row.textbook_id)!;
    let chapter = textbook.chapters.find(c => c.id === row.chapter_id);
    if (row.chapter_id && row.chapter_num) {
      if (!chapter) {
        textbook!.chapters.push({
          id: row.chapter_id,
          title: row.chapter_title,
          num: row.chapter_num,
          questions: [],
        });
        chapter = textbook.chapters.find(c => c.id === row.chapter_id);
      }
    }
    if (row.question_id && row.question_num) {
      chapter!.questions.push({
        id: row.question_id,
        num: row.question_num,
      });
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
    if (!row.chapter_id || !row.chapter_num) {
      continue;
    }
    if (!chapterMap.has(row.chapter_id)) {
      chapterMap.set(row.chapter_id, {
        id: row.chapter_id,
        title: row.chapter_title,
        num: row.chapter_num,
        questions: [],
      });
    }
    if (row.question_id && row.question_num) {
      chapterMap.get(row.chapter_id)?.questions.push({
        id: row.question_id,
        num: row.question_num,
      });
    }
  };
  const chapters = Array.from(chapterMap.values());
  const first = rows[0];
  const textbook: Textbook = {
    id: first.textbook_id,
    title: first.textbook_title,
    author: first.textbook_author,
    description: first.textbook_description,
    fileName: first.textbook_file_name,
    baseFileName,
    filePath: `/pdf/${first.textbook_file_name}`,
    chapters,
  };
  console.log(textbook);
  return TextbookSchema.parse(textbook);
}
