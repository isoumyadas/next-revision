import { cookies } from "next/headers";
import { cache } from "react";

// why used cache => If we call the function multiple times on one page load it will be call only one time.

// export const getCurrentUser = cache(async () => {
//   return await getUserFromSession(await cookies());
// });

import { getUserFromSession } from "../core/session";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type FullUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDb>>,
  undefined | null
>;

/**
 * 
 * 
 * The Goal: Define the TypeScript type for a "Full User" exactly as it comes    from the database.

  typeof getUserFromDb: "Look at the function getUserFromDb."

  ReturnType<...>: "What does that function return?" (It returns Promise<User | null>).

  Awaited<...>: "Unwrap the Promise." (Now we have User | null).

  Exclude<..., undefined | null>: "Remove null or undefined."

  Result: FullUser is now guaranteed to be a valid user object, not null.
 * 
 * 
 */

type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>;

function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound: true;
}): Promise<FullUser>;
function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound?: false;
}): Promise<FullUser | null>;
function _getCurrentUser(options: {
  withFullUser?: false;
  redirectIfNotFound: true;
}): Promise<User>;
function _getCurrentUser(options?: {
  withFullUser?: false;
  redirectIfNotFound?: false;
}): Promise<User | null>;

/**
 *
 * The above four functions are called funciton overload
 *
 * => They don't run; they just tell TypeScript what to expect.
 *
 * => It gives you perfect autocomplete.
 * => If you call getCurrentUser({  redirectIfNotFound: true }),
 * => TypeScript knows you don't need to check if (user === null)
 * => because the function would have redirected the user away if they didn't exist.
 *
 *
 */

async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const user = await getUserFromSession(await cookies());

  if (user == null) {
    if (redirectIfNotFound) return redirect("/sign-in");
    return null;
  }

  if (withFullUser) {
    const fullUser = await getUserFromDb(user.id);
    // This should never happen
    if (fullUser == null) throw new Error("User not found in database");
    return fullUser;
  }

  return user;
}

export const getCurrentUser = cache(_getCurrentUser);

/**
 * 
 * React's cache.

  Without this: If your Navbar calls getCurrentUser and your Sidebar also calls getCurrentUser, your app would query the database/session twice.

  With this: The first call runs the logic. The second call just re-uses the result from the first one instantly.
 * 
 * 
 */

function getUserFromDb(id: string) {
  return prisma.person.findFirst({
    where: { id },
    select: {
      email: true,
      name: true,
      id: true,
      role: true,
      createdAt: true,
    },
  });
}
