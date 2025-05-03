import SignupForm from "@/components/SignupForm";

export const metadata = {
  title: "Sign up - Textbook Heaven",
  description: "Sign up for Textbook Heaven to post and answer questions.",
};

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="
      min-h-screen flex flex-col items-center justify-center
      bg-white dark:bg-neutral-900
      text-neutral-700 dark:text-neutral-200
      transition-colors
    ">
      <SignupForm />
    </div>
  );
}
