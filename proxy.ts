import { NextResponse, type NextRequest } from "next/server";
import {
  getUserFromSession,
  updateUserSessionExpiration,
} from "./auth/core/session";
const privateRoutes = ["/private", "/auth-users"];
const adminRoutes = ["/admin"];
const authRoutes = ["/sign-in", "/sign-up"];

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

  if (authRoutes.includes(req.nextUrl.pathname)) {
    const user = await getUserFromSession(req.cookies);

    // Step A: Check if we know where they came from
    // User is on /about, clicks "Login". referer is /about. Middleware sends them back to /about.
    const referer = req.headers.get("referer");

    // Step B: Verify the referer is internal (from your own website)
    // We don't want to redirect them back to Google or an external site.
    if (user !== null && referer && referer.startsWith(req.nextUrl.origin)) {
      return NextResponse.redirect(referer);
    }

    if (user?.role === "ADMIN" && user !== null) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (user !== null) {
      return NextResponse.redirect(new URL("/private", req.url));
    }
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
