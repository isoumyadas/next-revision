import { redisClient } from "@/redis/redis";
import crypto from "crypto";
type User = {
  id: string;
  role: "USER" | "ADMIN";
};

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
const COOKIE_SESSION_KEY = "custom-auth-session-id";

export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: "strict" | "lax";
      expires?: number;
    }
  ) => void;
  get: (key: string) => { name: string; value: string } | undefined;
  delete: (key: string) => void;
};

export function getUserFromSession(cookies: Pick<Cookies, "get">) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;

  if (!sessionId || sessionId == null) return null;

  return getUserSessionById(sessionId);
}

export async function getUserSessionById(sessionId: string) {
  const rawUser: User | null = await redisClient.get(`session${sessionId}`);

  if (!rawUser) return null;

  return rawUser;
}

export async function createUserSession(user: User, cookies: Cookies) {
  // if using nextjs you can use inbuilt cookie functionality.
  const sessionId = crypto.randomBytes(512).toString("hex").normalize();

  await redisClient.set(`session${sessionId}`, user, {
    ex: SESSION_EXPIRATION_SECONDS,
  });

  setCookie(sessionId, cookies);
}

export async function removeUserSession(
  cookies: Pick<Cookies, "get" | "delete">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId) return null;

  await redisClient.del(`session${sessionId}`);
  cookies.delete(COOKIE_SESSION_KEY);
}

export async function updateUserSessionData(
  updatedUser: User,
  cookies: Pick<Cookies, "get">
) {
  const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value;
  if (!sessionId || sessionId == null) return null;

  await redisClient.set(`session${sessionId}`, updatedUser, {
    ex: SESSION_EXPIRATION_SECONDS,
  });
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
  cookies.set(COOKIE_SESSION_KEY, sessionId, {
    secure: true, // always encrypted
    httpOnly: true, // only accessible to https and only accessible on the server.
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}
