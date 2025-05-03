"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { InputField, SubmitButton } from "@/components/FormFields";

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    await authClient.signUp.email(
      {
        email: form.email,
        password: form.password,
        name: form.name,
        callbackURL: "/textbooks"
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
        Sign Up
      </h2>
      {error && (
        <div className="mb-4 text-red-600 dark:text-red-400 text-center">
          {error}
        </div>
      )}
      <div>
        <label
          className="block mb-1 font-medium"
          htmlFor="name"
        >
          Name
        </label>
        <InputField
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
          placeholder="Your name"
          disabled={loading}
        />
      </div>
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          disabled={loading}
        />
      </div>
      <div className="flex justify-center mt-2">
        <SubmitButton
          value={loading ? "Signing up..." : "Sign Up"}
          disabled={loading}
        />
      </div>
    </form>
  );
}
