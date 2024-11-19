import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "./app/models/User";
import connectToServiceEaseDB from "./lib/serviceDB";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  providers: [
    CredentialProvider({
      credentials: {
        userID: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials === null) return null;
        try {
          await connectToServiceEaseDB();
          // console.log(`Searching for user with ID: ${credentials.userID}`);
          const user = await User.findOne({ userID: credentials?.userID });
          console.log("from auth page: " + user);

          if (user) {
            const isValidPassword = bcrypt.compare(credentials.password, user.password);
            if (isValidPassword) {
              return user;
            } else {
              throw new Error("Invalid credentials");
            }
          } else {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
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
