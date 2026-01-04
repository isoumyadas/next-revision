import { logOut } from "@/auth/nextjs/action";
import { getCurrentUser } from "@/auth/nextjs/currentUser";

export default async function AuthUsers() {
  const fullUser = await getCurrentUser({
    withFullUser: true,
  });

  return (
    <>
      <div className="flex justify-center">
        <button
          type="submit"
          className="p-2 rounded-xl bg-red-600 text-white font-bold"
          onClick={logOut}
        >
          Logout
        </button>
      </div>
      <div className="p-2 rounded-xl bg-gray-500 mt-2">
        <h1 className="text-blue-800 font-bold text-4xl">{fullUser?.name}</h1>
        <p className="text-black font-bold">{fullUser?.email}</p>
      </div>
    </>
  );
}
