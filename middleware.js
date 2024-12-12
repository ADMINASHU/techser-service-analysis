import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { auth } from "@/auth";
import {
  PUBLIC_ROUTES,
  LOGIN,
  ROOT,
  PROTECTED_ROUTES,
  VERIFIED_ROUTES,
  PROFILE,
  LEVEL1_ROUTES,
  LEVEL2_ROUTES,
  LEVEL3_ROUTES,
  UNAUTHORIZED,
  AUTH_ROUTES,
  AUTH_API_ROUTES,
  DEFAULT_LOGIN_REDIRECT,
} from "./lib/routes";

export default async function middleware(req) {
  const session = await auth();

  const { nextUrl } = auth();
  const isLoggedIn = !!session?.user;
  console.log(isLoggedIn);

  // const isVerified = session?.user?.verified;
  // const level = session?.user?.level,
  // const isVerified = undefined;
  // const level = undefined;

  // const isPublicRoute = PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
  // const isLevel1Route = LEVEL1_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
  // const isLevel2Route = LEVEL2_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
  // const isLevel3Route = LEVEL3_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
  // const isVerifiedRoute = VERIFIED_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
  // const isAuthRoute = AUTH_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
  // const isAuthApiRoute = AUTH_API_ROUTES.find((route) => nextUrl.pathname.startsWith(route));

  // if (isAuthApiRoute) {
  //   return null;
  // }

  // if (isAuthRoute) {
  //   if (isLoggedIn) {
  //     return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  //   }
  //   return null;
  // }

  // if (!isLoggedIn && !isPublicRoute) {
  //   return NextResponse.redirect(new URL(LOGIN, nextUrl));
  // }

  // if (isVerifiedRoute && !isVerified) {
  //   return NextResponse.redirect(new URL(PROFILE, nextUrl));
  // }

  // if (isLevel1Route && level > 1) {
  //   return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
  // }
  // if (isLevel2Route && level > 2) {
  //   return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
  // }
  // if (isLevel3Route && level > 3) {
  //   return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
  // }
  // return null;

  // return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
