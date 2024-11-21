import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import { PUBLIC_ROUTES, LOGIN, ROOT, PROTECTED_ROUTES } from "./lib/routes";
const { auth } = NextAuth(authConfig);

export async function middleware(request) {
  const session = await auth();
  const { nextUrl } = request;
  const isAuthenticated = !!session?.user;
  // console.log("middleware");
  // console.log(isAuthenticated, nextUrl.pathname);
  const isPublicRoute =
    PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) &&
    !PROTECTED_ROUTES.find((route) => nextUrl.pathname.includes(route));

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
