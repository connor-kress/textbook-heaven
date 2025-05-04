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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function googleSignIn() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/textbooks",
        requestSignUp: true,
      }, {
        onResponse: () => {
          setLoading(false);
        },
        onRequest: () => {
          setError("");
          setLoading(true);
        },
        onSuccess: () => {
          console.log("Login successful");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
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
      <div
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
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={googleSignIn}
            disabled={loading}
            className="
              flex items-center justify-center gap-2
              border border-blue-500 text-blue-600
              bg-white px-6 py-2 rounded-md
              hover:bg-blue-50 transition
              font-medium
              text-center
            "
          >
            <FcGoogle className="text-xl" />
            Sign In with Google
          </button>
        </div>
      </div>
    </>
  );
}
