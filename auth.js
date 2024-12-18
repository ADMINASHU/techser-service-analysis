import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SignInSchema } from "./lib/zod";
import bcrypt from "bcryptjs";
import { signInCredentials } from "./app/action";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  pages: {
    signIn: "/login",
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
        // console.log(user);

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
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
      // console.log(JSON.stringify(token));
      return token;
    },
    session({ session, token }) {
      session.user = token;
      console.log("session: "+ JSON.stringify(session));
      console.log("token: "+ JSON.stringify(token));
      return session;
    },
  },
});
