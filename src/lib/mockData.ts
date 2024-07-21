import Question from "@/types/Question";
import { ChapterInfo } from "@/types/TextbookInfo";

export const mockChapterData: ChapterInfo[] = [
  {
    name: "The first chapter",
    num: 1,
    questions: [
      {
        id: 1337,
        num: 1,
      },
      {
        id: 1338,
        num: 2,
      },
    ],
  },
  {
    name: "The second chapter",
    num: 2,
    questions: [
      {
        id: 1339,
        num: 1,
      },
      {
        id: 1340,
        num: 2,
      },
      {
        id: 1341,
        num: 6,
      },
      {
        id: 1342,
        num: 5,
      },
      {
        id: 1343,
        num: 10,
      },
    ],
  },
];

export const mockQuestionData: Question = {
    id: 123455555,
    chapter: 3,
    num: 10,
    text: "Is this a question?",
    comments: [
      {
        id: 0,
        author: "Mandar",
        postDate: new Date(),
        likes: 4,
        dislikes: 1,
        text: "Hello, who is this?",
        replies: [
          {
            id: 1,
            author: "Minecraft Server",
            postDate: new Date(),
            likes: 4,
            dislikes: 1,
            text: "I am the SeRVeR.",
          },
          {
            id: 2,
            author: "Connor",
            postDate: new Date(),
            likes: 4,
            dislikes: 1,
            text: "Erm... what the sigma?",
          },
        ],
      },
      {
        id: 3,
        author: "Omar",
        postDate: new Date(),
        likes: 4,
        dislikes: 1,
        text: "I AM A DOCTOR-ENGINEER-POET. ".repeat(10),
        replies: [
          {
            id: 4,
            author: "Mo",
            postDate: new Date(),
            likes: 4,
            dislikes: 1,
            text: "Ok Omar, I believe you.",
          },
          {
            id: 5,
            author: "Pranav",
            postDate: new Date(),
            likes: 4,
            dislikes: 1,
            text: "Can I smell your toes?",
          },
        ],
      },
    ],
  };
