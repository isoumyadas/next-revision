"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  comparePasswords,
  generateSalt,
  hashPassword,
} from "../core/passwordHasher";
import { createUserSession, removeUserSession } from "../core/session";
import { cookies } from "next/headers";
import { getOAuthClient } from "../core/oauth/base";
import { OAuthProviders } from "@/generated/prisma/enums";

// export enum OAuthProviders {
//   google,
//   github,
//   discord,
// }

export type OAuthProvider = "discord" | "github" | "google";

export async function logOut() {
  await removeUserSession(await cookies());
  redirect("/sign-in");
}

export async function signIn(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) {
    return {
      status: "error",
      message: "Please fill all the required fields",
    };
  }

  const user = await prisma.person.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      role: true,
      name: true,
      salt: true,
      email: true,
      password: true,
    },
  });

  if (!user || !user.password || !user.salt)
    return {
      status: "error",
      message:
        "Unable to log you in! seems like you need to create an account.",
    };

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password,
    salt: user.salt,
  });

  if (!isCorrectPassword)
    return {
      status: "error",
      message: "Incorrect password! Please check your password again",
    };

  await createUserSession(user, await cookies());

  redirect("/auth-users");
}

export async function signUp(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !email || !password) {
    return "Every field is required";
  }

  const existingUser = await prisma.person.findFirst({
    where: { email: email },
  });

  if (existingUser !== null) return "Account already exists for this email";

  const salt = generateSalt();
  const hashedPassword = await hashPassword(password, salt);

  try {
    const user = await prisma.person.create({
      data: {
        name,
        email,
        // password: hashedPassword as string,
        password: hashedPassword,
        salt: salt,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (user == null) return "Unable to create account";

    await createUserSession(user, await cookies());
  } catch {
    return "Unable to create account";
  }

  redirect("/auth-users");
}

export async function oAuthSignIn(provider: OAuthProviders) {
  // Get oAuth url
  const oAuthClient = getOAuthClient(provider);

  redirect(oAuthClient.createAuthUrl(await cookies()));
}

/**
 *
 * below, zod and react-useForm is used
 *
 */

// export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
//   const { success, data } = signInSchema.safeParse(unsafeData);
//   if (!success) {
//     return "Unable to log you in";
//   }
//   redirect("/");
// }

// export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
//   const { success, data } = signUpSchema.safeParse(unsafeData);
//   if (!success) {
//     return "Unable to create account";
//   }

//   const existingUser = await prisma.person.findFirst({
//     where: { email: data.email },
//   });

//   if (existingUser !== null) return "Account already exists for this email";

//   const hashedPassword = await hashPassword(data.password, "salt");
//   console.log("hash::> ", hashedPassword);

//   redirect("/");
// }
