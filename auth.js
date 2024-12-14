import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { SignInSchema } from "./lib/zod";
import bcrypt from "bcryptjs";
import { signInCredentials } from "./app/action";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
        console.log(user);

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
});
