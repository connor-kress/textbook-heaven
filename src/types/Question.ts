export type Reply = {
  id: number,
  author: string, // TODO: UserInfo
  postDate: Date,
  likes: number,
  dislikes: number,
  text: string,
}

export type TBComment = Reply & {
  replies: Reply[],
}

export type Question = {
  id: number,
  translator: string, // TODO: UserInfo
  chapter: number,
  num: number,
  text: string,
  comments: TBComment[],
}

export default Question;
