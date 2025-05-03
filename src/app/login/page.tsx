import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Log in - Textbook Heaven",
  description: "Sign in to Textbook Heaven to post and answer questions.",
};

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="
      min-h-screen flex flex-col items-center justify-center
      bg-white dark:bg-neutral-900
      text-neutral-700 dark:text-neutral-200
      transition-colors
    ">
      <LoginForm />
    </div>
  );
}
