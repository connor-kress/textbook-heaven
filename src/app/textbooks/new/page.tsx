import NewTextbookForm from "@/components/NewTextbookForm";

export const metadata = {
  title: "Create Textbook - Textbook Heaven",
  description: "Create a new textbook entry.",
};

export default function NewTextbookPage() {
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h1 className="text-2xl font-bold">Create a New Textbook</h1>
      <NewTextbookForm />
    </div>
  );
}


