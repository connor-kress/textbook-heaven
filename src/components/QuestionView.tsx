import { mockChapterData } from "@/lib/mockData";
import QuestionSelector from "./QuestionSelector";

export default function QuestionView() {
  const chapters = mockChapterData;
  return (
    <div className="flex flex-col">
      <QuestionSelector chapters={chapters} />
      <QuestionDetails />
    </div>
  );
}

function QuestionDetails() { return (
    <div className="mx-20">
      <div className="my-4">
        <h1 className="mb-2 text-2xl font-bold">
          Chapter 3: Q. 4
        </h1>
        <hr className="border-neutral-600"/>
        <p className="mt-2 text-xl">
          Is this a question?
        </p>
      </div>
      <h2 className="mb-4">
        3 Comments:
      </h2>
      <div className="flex flex-col items-start gap-10">
        { [1, 2, 3].map(i => <CommentDetails key={i} id={i} />) }
      </div>
    </div>
  );
}

function CommentDetails({ id }: { id: number }) {
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="p-4 bg-blue-600">
        Like btn
      </div>
      <div className="p-2 bg-red-600">
        <h1>Comment #{id}</h1>
        <h3 className="pb-2">Created on 9/34/2022</h3>
      </div>
    </div>
  );
}
