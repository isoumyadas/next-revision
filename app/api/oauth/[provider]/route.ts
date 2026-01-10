import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { getOAuthClient } from "@/auth/core/oauth/base";
// import { OAuthProviders } from "@/auth/nextjs/action";
import z from "zod";
import { OAuthProviders } from "@/generated/prisma/enums";
import { createUserSession } from "@/auth/core/session";
import { cookies } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider: rawProvider } = await params;
  // const provider = rawProvider
  const provider = z.enum(OAuthProviders).parse(rawProvider);
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // const providers = OAuthProviders()

  if (typeof code !== "string" || typeof state !== "string") {
    redirect(
      `/sign-in?oauthError=${encodeURIComponent(
        "Failed to connect. Please try again"
      )}`
    );
  }

  const oAuthClient = getOAuthClient(provider);
  try {
    // const oAuthUser = await new OAuthClient().fetchUser(
    //   code,
    //   state,
    //   await cookies()
    // );
    const oAuthUser = await oAuthClient.fetchUser(code, state, await cookies());
    console.log("OAuthUser::> ", oAuthUser);
    const user = await connectUserToAccount(oAuthUser, provider);
    await createUserSession(user, await cookies());
  } catch (error) {
    console.log("error::", error);
    redirect("/not-found");
  }

  redirect("/private");
}

function connectUserToAccount(
  { id, email, name }: { id: string; email: string; name: string },
  provider: OAuthProviders
) {
  console.log("email:: ", email);
  console.log("name:: ", name);

  return prisma.$transaction(async (trx) => {
    let user = await prisma.person.findFirst({
      where: { email: email },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      const newUser = await trx.person.create({
        data: {
          email,
          name,
        },
        select: {
          id: true,
          role: true,
        },
      });
      user = newUser;

      await trx.userOAuthAccountTable.create({
        data: {
          provider,
          providerAccountId: id,
          userId: user.id,
        },
      });
    }

    return user;
  });
}
