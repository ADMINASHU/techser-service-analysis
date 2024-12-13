// import { NextResponse } from "next/server";
// import NextAuth from "next-auth";
// import {
//   PUBLIC_ROUTES,
//   LOGIN,
//   ROOT,
//   PROTECTED_ROUTES,
//   VERIFIED_ROUTES,
//   PROFILE,
//   LEVEL1_ROUTES,
//   LEVEL2_ROUTES,
//   LEVEL3_ROUTES,
//   UNAUTHORIZED
// } from "./lib/routes";
// import { authConfig } from "./auth.config";

// const { auth } = NextAuth(authConfig);

// export async function middleware(request) {
//   const session = await auth();
//   const { nextUrl } = request;
//   const isAuthenticated = !!session?.user;
//   // const isAdmin = session?.user?.isAdmin;
//   const isVerified = session?.user?.verified;
//   const level = session?.user?.level;

//   const isPublicRoute =
//     PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) &&
//     !PROTECTED_ROUTES.find((route) => nextUrl.pathname.includes(route));

//   const isLevel1Route = LEVEL1_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
//   const isLevel2Route = LEVEL2_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
//   const isLevel3Route = LEVEL3_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
//   // const isLevel4Route = LEVEL4_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
//   const isVerifiedRoute = VERIFIED_ROUTES.find((route) => nextUrl.pathname.startsWith(route));

//   if (!isAuthenticated && !isPublicRoute) {
//     return NextResponse.redirect(new URL(LOGIN, nextUrl));
//   }

//   if (isVerifiedRoute && !isVerified) {
//     return NextResponse.redirect(new URL(PROFILE, nextUrl));
//   }

//   if (isLevel1Route && level > 1) {
//     return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
//   }
//   if (isLevel2Route && level > 2) {
//     return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
//   }
//   if (isLevel3Route && level > 3) {
//     return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };


// export { auth as middleware } from "@/auth"