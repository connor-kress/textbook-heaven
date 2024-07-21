import { mockChapterData } from "@/lib/mockData";
import QuestionSelector from "./QuestionSelector";
import { QuestionDetails } from "./QuestionDetails";

export default function QuestionView() {
  const chapters = mockChapterData;
  return (
    <div className="flex flex-col">
      <QuestionSelector chapters={chapters} />
      <QuestionDetails />
    </div>
  );
}
