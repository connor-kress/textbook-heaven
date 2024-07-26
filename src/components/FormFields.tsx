import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function InputField(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="
        p-2 rounded shadow-lg
        bg-neutral-700 text-white
        placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-cyan-500
      "
      {...props}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="
        p-2 rounded shadow-lg
        bg-neutral-700 text-white
        placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-cyan-500
        content-normal
      "
      {...props}
    />
  );
}

type SubmitButtonProps = {
  value?: string,
};

export function SubmitButton(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="
        cursor-pointer w-40 py-1 rounded
        bg-cyan-500 text-neutral-900 
        bg-gradient-to-r
        from-cyan-500 to-teal-500 from-30%
        shadow-lg
      "
      type="submit"
      {...props}
    />
  );
}
