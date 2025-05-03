"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await authClient.signOut();
      router.push("/signin");
    } catch (err) {
      alert("Logout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="
        ml-2 px-4 py-2 rounded
        bg-neutral-700 hover:bg-neutral-600
        text-neutral-200 font-semibold
        shadow
        transition-colors
        disabled:opacity-60
      "
      title="Log out"
    >
      {loading ? "Logging out..." : "Log out"}
    </button>
  );
}
