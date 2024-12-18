import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInCredentials } from "./app/action";
import { NextResponse } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth({

  pages: {
    signIn: "/login",
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
    authorized({auth, request:{nextUrl}}){ 
      const isLoggedIn = !!auth?.user;
      const protectedRoutes = ["/"];

      if (!isLoggedIn && protectedRoutes.includes(nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/login", nextUrl));

      }
      return true;

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
