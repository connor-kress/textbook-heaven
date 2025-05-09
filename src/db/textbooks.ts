import { asc, eq, isNull } from "drizzle-orm";
import { db } from "./index";
import { questions, sections, textbooks } from "./schema"
import { Textbook, TextbookSchema } from '@/types/Textbook';

const allChaptersAndSections = {
  chapters: {
    with: {
      questions: {
        columns: {
          id: true,
          num: true,
        },
        where: isNull(questions.sectionId),
        orderBy: [asc(questions.num)],
      },
      sections: {
        orderBy: [asc(sections.num)],
        with: {
          questions: {
            columns: {
              id: true,
              num: true,
            },
            orderBy: [asc(questions.num)],
          },
        },
      },
    },
  },
};

export async function fetchTextbooks(): Promise<Textbook[]> {
  const rawTextbooks = await db.query.textbooks.findMany({
    orderBy: [asc(textbooks.id)],
    with: allChaptersAndSections,
  });
  const textbookArray = rawTextbooks.map(textbook => ({
    ...textbook,
    baseFileName : textbook.fileName.replace(/.pdf$/, ""),
    filePath: `/pdf/${textbook.fileName}`,
  }));
  // console.log(textbookArray);
  return TextbookSchema.array().parse(textbookArray);
}

export async function fetchTextbook(
  baseFileName: string
): Promise<Textbook | null> {
  const rawTextbook = await db.query.textbooks.findFirst({
    where: eq(textbooks.fileName, `${baseFileName}.pdf`),
    with: allChaptersAndSections,
  });
  if (!rawTextbook) return null;
  const textbook = {
    ...rawTextbook,
    baseFileName : rawTextbook.fileName.replace(/.pdf$/, ""),
    filePath: `/pdf/${rawTextbook.fileName}`,
  };
  // console.dir(textbook, { depth: null });
  return TextbookSchema.parse(textbook);
}
