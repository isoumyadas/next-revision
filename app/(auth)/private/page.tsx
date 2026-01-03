import Link from "next/link";
import { ToggleRoleButton } from "./ToggleRoleButton";
// import { getCurrentUser } from "@/auth/nextjs/currentUser"

export default async function PrivatePage() {
  // TODO:   const currentUser = await getCurrentUser({ redirectIfNotFound: true })
  const currentUser = { role: "user" };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-8">Private: {currentUser.role}</h1>
      <div className="flex gap-2">
        <ToggleRoleButton />
        <button>
          <Link href="/">Home</Link>
        </button>
      </div>
    </div>
  );
}
