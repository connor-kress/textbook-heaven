"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { InputField, SubmitButton } from "@/components/FormFields";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (!isPending && session) {
      router.replace("/textbooks");
    }
  }, [isPending, session, router]);

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange (e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    await authClient.signIn.email(
      {
        email: form.email,
        password: form.password,
        callbackURL: "/textbooks",
        rememberMe: form.rememberMe
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          router.push("/textbooks");
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message);
        }
      }
    );
  };

  return (
    <div className="
      min-h-screen flex items-center justify-center
      bg-white dark:bg-neutral-900
      text-neutral-700 dark:text-neutral-200
      transition-colors
    ">
      <form
        onSubmit={handleSubmit}
        className="
          flex flex-col
          p-8 gap-4
          dark:bg-neutral-800
          rounded shadow-md w-full max-w-md
          transition-colors
        "
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>
        {error && (
          <div className="mb-4 text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}
        <div>
          <label
            className="block mb-1 font-medium"
            htmlFor="email"
          >
            Email
          </label>
          <InputField
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>
        <div>
          <label
            className="block mb-1 font-medium"
            htmlFor="password"
          >
            Password
          </label>
          <InputField
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            autoComplete="current-password"
            placeholder="Your password"
            disabled={loading}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            checked={form.rememberMe}
            onChange={handleChange}
            disabled={loading}
            className="accent-cyan-600 w-4 h-4"
          />
          <label htmlFor="rememberMe" className="text-sm select-none">
            Remember me
          </label>
        </div>
        <div className="flex justify-center mt-2">
          <SubmitButton
            value={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}
