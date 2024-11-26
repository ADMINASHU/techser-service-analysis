import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { PUBLIC_ROUTES, LOGIN, ROOT, PROTECTED_ROUTES, ADMIN_ROUTES } from "./lib/routes";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export async function middleware(request) {
  const session = await auth();
  const { nextUrl } = request;
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.isAdmin;

  const isPublicRoute =
    PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) &&
    !PROTECTED_ROUTES.find((route) => nextUrl.pathname.includes(route));

  const isAdminRoute = ADMIN_ROUTES.find((route) => nextUrl.pathname.startsWith(route));

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }

  if (isAdminRoute && !isAdmin) {
    // Redirect to root if trying to access admin route without admin privileges
    return NextResponse.redirect(new URL(ROOT, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
