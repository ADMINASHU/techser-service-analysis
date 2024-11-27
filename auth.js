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
        if (!credentials) return null;
        try {
          await connectToServiceEaseDB();
          const user = await User.findOne({ userID: credentials.userID });
          if (!user) {
            throw new Error("User not found");
          }
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }
          // console.log("user data : " + JSON.stringify(user));
          return {
            id: user._id.toString(),
            userID: user.userID,
            email: user.email,
            isAdmin: user.isAdmin,
            level: user.level,
            verified: user.verified,
          };
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userID = user.userID;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
        token.level = user.level;
        token.verified = user.verified;
        // Ensure isAdmin is defined
      }
      // console.log("JWT Callback - Token:", token);
      // Console log the token
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          userID: token.userID,
          email: token.email,
          isAdmin: token.isAdmin, // Ensure isAdmin is defined
          level: token.level, // Ensure isAdmin is defined
          verified: token.verified,
        };
      }
      // console.log("Session Callback - Session:", session); // Console log the session
      return session;
    },
  },
  debug: true,
});
