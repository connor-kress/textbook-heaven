"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { InputField, SubmitButton } from "@/components/FormFields";
import { FcGoogle } from "react-icons/fc"

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loggedOut = searchParams.get("loggedOut");
  const { data: session, isPending } = authClient.useSession();

  // Redirect if already logged in
  useEffect(() => {
    if (!isPending && session && !loggedOut) {
      router.replace("/textbooks");
    }
  }, [isPending, session, loggedOut, router]);

  const [form, setForm] = useState({
    email: "",
    password: "",
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
      },
      {
        onRequest: () => {
          setError("")
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

  async function googleSignIn() {
    try {
      await authClient.signIn.social({
        provider: "google"
      }, {
        onResponse: () => {
          setLoading(false)
        },
        onRequest: () => {
          setError("")
          setLoading(true)
        },
        onSuccess: () => {
          router.replace("/textbooks")
        },
        onError: (ctx) => {
          setError(ctx.error.message)
        }
      });
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong");
    }
  }

  return (
    <>
      {loggedOut && (
        <div className="
          mb-4 px-4 py-2 rounded
          bg-green-100 dark:bg-green-900
          text-green-700 dark:text-green-200
          shadow
        ">
          You have been logged out.
        </div>
      )}
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
        <div className="flex justify-center mt-2">
          <SubmitButton
            value={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
        </div>
        <hr className="border-gray-500 my-2" />
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={googleSignIn}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <FcGoogle />
            Sign in with Google
          </button>
        </div>
      </form>
    </>
  );
}
