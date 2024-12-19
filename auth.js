import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInCredentials } from "./app/action";
import { NextResponse } from "next/server";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prismaClient";
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

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  providers: [
    Credentials({
      credentials: {
        userID: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { userID, password } = credentials;

        const user = await signInCredentials({ userID, password });

        if (user.error) {
          throw new CredentialsSignin(user.error);
        }

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAuthenticated = !!auth?.user;
      const isVerified = auth?.user?.verified;
      const level = auth?.user?.level;

      const isPublicRoute = PUBLIC_ROUTES.find((route) => nextUrl.pathname.startsWith(route)) && 
                            !PROTECTED_ROUTES.find((route) => nextUrl.pathname.includes(route));

      const isAuthRoute = AUTH_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
      const isAuthApiRoute = AUTH_API_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
      const isLevel1Route = LEVEL1_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
      const isLevel2Route = LEVEL2_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
      const isLevel3Route = LEVEL3_ROUTES.find((route) => nextUrl.pathname.startsWith(route));
      const isVerifiedRoute = VERIFIED_ROUTES.find((route) => nextUrl.pathname.startsWith(route));

      if (isAuthApiRoute) {
        return null;
      }

      if (!isAuthenticated && !isPublicRoute) {
        return NextResponse.redirect(new URL(LOGIN, nextUrl));
      }

      if (isVerifiedRoute && !isVerified) {
        return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
      }
      if (isAuthenticated && isVerified) {
        if (isLevel1Route && level > 1) {
          return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
        }
        if (isLevel2Route && level > 2) {
          return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
        }
        if (isLevel3Route && level > 3) {
          return NextResponse.redirect(new URL(UNAUTHORIZED, nextUrl));
        }
      }
      return NextResponse.next();
    },
    jwt({ token, user }) {
      if (user) {
        const newToken = {
          userID: user.userID,
          isAdmin: user.isAdmin,
          level: user.level,
          verified: user.verified,
          fName: user.fName,
        };
        token = { ...token, ...newToken };
      }
      return token;
    },
    session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});
