"use client";

import { authClient } from "@/lib/auth-client";

export default function ProfilePicture() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Not signed in</div>;
  if (!session.user.image) {
    return (
      <div className="px-4">
        {session.user.name}
      </div>
    );
  }

  return (
    <img
      src={session.user.image}
      alt={session.user.name}
      className="w-8 h-8 rounded-full"
    />
  );
}
