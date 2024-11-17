import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { getUserByID } from "./data/users";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialProvider({
      // credentials: {
      //   userID: {},
      //   password: {},
      // },
      async authorize(credentials) {
        if (credentials === null) return null;
        try {
          const user = getUserByID(credentials.userID);
          if (user) {
            const isMatch = user?.password === credentials?.password;
            if (isMatch) {
              return user;
            } else {
              throw new Error("Invalid credentials");
            }
          } else {
            throw new Error("User not found");
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
