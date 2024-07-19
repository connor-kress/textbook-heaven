import Question from "@/types/Question";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const questionIdStr = searchParams.get('questionId')
  if (questionIdStr === null) {
    return new Response("Missing `questionId` parameter.", {
      status: 400,
    });
  }
  const questionId = parseInt(questionIdStr);
  console.log(questionId);
  if (isNaN(questionId)) {
    return new Response("Invalid parameter (`parseInt` error).", {
      status: 400,
    });
  }
  const question = getData(questionId);
  return Response.json(question);
}

function getData(questionId: number): Question {
  return {
    id: questionId,
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
}
