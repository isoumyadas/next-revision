"use server";

import { updateUserSessionData } from "@/auth/core/session";
import { getCurrentUser } from "@/auth/nextjs/currentUser";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function toggleRole() {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
  });

  const updatedUser = await prisma.person.update({
    where: {
      id: user.id,
    },
    data: {
      role: user.role === "ADMIN" ? "USER" : "ADMIN",
    },
    select: {
      id: true,
      role: true,
    },
  });

  // updating session:

  await updateUserSessionData(updatedUser, await cookies());
}
