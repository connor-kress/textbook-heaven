import { Chapter, Textbook, TextbookSchema } from '@/types/Textbook';
import pool from "./db";

export async function fetchTextbooks(): Promise<Textbook[]> {
  const query = `
    SELECT
      t.id AS textbook_id,
      t.title AS textbook_title,
      t.author AS textbook_author,
      t.description AS textbook_description,
      t.file_name AS textbook_file_name,
      c.id AS chapter_id,
      c.title AS chapter_title,
      c.num AS chapter_num,
      q.id AS question_id,
      q.num AS question_num
    FROM textbooks t
    LEFT JOIN chapters c ON t.id = c.textbook_id
    LEFT JOIN questions q ON c.id = q.chapter_id;
  `;
  const res = await pool.query(query);

  const textbookMap = new Map<number, Textbook>();
  res.rows.forEach(row => {
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
    const textbook = textbookMap.get(row.textbook_id);
    const chapter = textbook!.chapters.find(c => c.id === row.chapter_id);
    if (row.chapter_id) {
      if (!chapter) {
        textbook!.chapters.push({
          id: row.chapter_id,
          title: row.chapter_title,
          num: row.chapter_num,
          questions: [],
        });
      }
    }
    if (row.question_id) {
      chapter!.questions.push({
        id: row.question_id,
        num: row.question_num,
      });
    }
  });
  const textbooks = Array.from(textbookMap.values());
  const ret = TextbookSchema.array().parse(textbooks);
  console.log(ret);
  return ret;
}

export async function fetchTextbook(
  baseFileName: string
): Promise<Textbook> {
  const query = `
    SELECT
      t.id AS textbook_id,
      t.title AS textbook_title,
      t.author AS textbook_author,
      t.description AS textbook_description,
      t.file_name AS textbook_file_name,
      c.id AS chapter_id,
      c.title AS chapter_title,
      c.num AS chapter_num,
      q.id AS question_id,
      q.num AS question_num
    FROM textbooks t
    LEFT JOIN chapters c ON t.id = c.textbook_id
    LEFT JOIN questions q ON c.id = q.chapter_id
    WHERE t.file_name = $1;
  `;
  const fileName = `${baseFileName}.pdf`;
  const res = await pool.query(query, [fileName]);
  if (res.rows.length === 0) {
    throw new Error("No textbooks found")
  }

  const chapterMap = new Map<number, Chapter>();
  res.rows.forEach(row => {
    if (!chapterMap.has(row.chapter_id)) {
      chapterMap.set(row.chapter_id, {
        id: row.chapter_id,
        title: row.chapter_title,
        num: row.chapter_num,
        questions: [],
      });
    }
    if (row.question_id) {
      chapterMap.get(row.chapter_id)?.questions.push({
        id: row.question_id,
        num: row.question_num,
      });
    }
  });
  const chapters = Array.from(chapterMap.values());
  const t = res.rows[0];
  const textbook = {
    id: t.textbook_id,
    title: t.textbook_title,
    author: t.textbook_author,
    description: t.textbook_description,
    fileName: t.textbook_file_name,
    baseFileName,
    filePath: `/pdf/${t.textbook_file_name}`,
    chapters,
  };
  const ret = TextbookSchema.parse(textbook);
  console.log(ret);
  return ret;
}
