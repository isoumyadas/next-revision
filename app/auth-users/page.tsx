import { logOut } from "@/auth/nextjs/action";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import Link from "next/link";

export default async function AuthUsers() {
  const fullUser = await getCurrentUser({
    withFullUser: true,
  });

  return (
    <>
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="p-2 rounded-xl bg-red-600 text-white font-bold"
          onClick={logOut}
        >
          Logout
        </button>
        {/* Here exactily, referer works from middleware */}
        <button
          type="submit"
          className="p-2 rounded-xl bg-green-600 text-white font-bold"
        >
          <Link href={"/sign-in"}>Login</Link>
        </button>
      </div>
      <div className="p-2 rounded-xl bg-gray-500 mt-2">
        <h1 className="text-blue-800 font-bold text-4xl">{fullUser?.name}</h1>
        <p className="text-black font-bold">{fullUser?.email}</p>
      </div>
    </>
  );
}
