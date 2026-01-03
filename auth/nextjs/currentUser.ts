import { cookies } from "next/headers";
import { cache } from "react";
import { getUserFromSession } from "../core/session";

// why used cache => If we call the function multiple times on one page load it will be call only one time.

export const getCurrentUser = cache(async () => {
  return await getUserFromSession(await cookies());
});
