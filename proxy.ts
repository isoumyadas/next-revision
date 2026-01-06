import { NextResponse, type NextRequest } from "next/server";
import {
  getUserFromSession,
  updateUserSessionExpiration,
} from "./auth/core/session";
const privateRoutes = ["/private", "/auth-users"];
const adminRoutes = ["/admin"];

// export it specifically called proxy | even the file name should be proxy
export default async function proxy(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next();
  await updateUserSessionExpiration({
    set: (key, value, options) => {
      response.cookies.set({ ...options, name: key, value });
    },
    get: (key) => request.cookies.get(key),
  });

  return response;
}

async function middlewareAuth(req: NextRequest) {
  // on server to get pathname we use this:
  if (privateRoutes.includes(req.nextUrl.pathname)) {
    const user = await getUserFromSession(req.cookies);
    if (user == null) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  if (adminRoutes.includes(req.nextUrl.pathname)) {
    const user = await getUserFromSession(req.cookies);
    if (user == null) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth-users", req.url));
    }
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
