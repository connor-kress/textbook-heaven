"use client";

export function NewQuestionForm() {
  return (
    <div className="py-4 px-20">
      <h1 className="text-2xl font-bold mb-2">Compose New Question:</h1>
      <form
        className="
          flex flex-col text-black
          p-3 gap-2
          bg-neutral-800
          rounded
        "
      >
        <InputField name="name" placeholder="name?" />
        <InputField name="text" placeholder="body?" />
      </form>
    </div>
  );
}

type InputFieldProps = {
    name: string;
    placeholder: string;
};

function InputField({ name, placeholder }: InputFieldProps) {
  return (
    <input
      className="
        p-2 rounded
        bg-neutral-700 text-white
        placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
      name={name}
      placeholder={placeholder}
    />
  );
}
