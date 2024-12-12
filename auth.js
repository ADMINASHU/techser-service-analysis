import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import connectToServiceEaseDB from "./lib/serviceDB";
import client from "./lib/db";
import bcrypt from "bcryptjs";
import { User } from "./app/models/User";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
    updateAge: 1 * 60, // 1 minute
  },
  ...authConfig,
  // providers: [
  //   CredentialProvider({
  //     credentials: {
  //       userID: {},
  //       password: {},
  //     },
  //     async authorize(credentials) {
  //       if (!credentials) return null;
  //       try {
  //         await connectToServiceEaseDB();
  //         const user = await User.findOne({ userID: credentials.userID });
  //         if (!user) {
  //           throw new Error("User not found");
  //         }
  //         const isValidPassword = await bcrypt.compare(credentials.password, user.password);
  //         if (!isValidPassword) {
  //           throw new Error("Invalid credentials");
  //         }
  //         // console.log("user data : " + JSON.stringify(user));
  //         return {
  //           id: user._id.toString(),
  //           userID: user.userID,
  //           email: user.email,
  //           isAdmin: user.isAdmin,
  //           level: user.level,
  //           verified: user.verified,
  //         };
  //       } catch (error) {
  //         throw new Error(error);
  //       }
  //     },
  //   }),
  // ],
  secret: process.env.AUTH_SECRET,
});
