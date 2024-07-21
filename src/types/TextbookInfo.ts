export type ChapterInfo = {
  name: string,
  num: number,
  questions: {
    id: number,
    num: number,
  }[],
}

export type TextbookInfo = {
  chapters: ChapterInfo[],
  fileName: string,
  filePath: string,
  uriName: string,
  name: string,
}
