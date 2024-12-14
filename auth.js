import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import { saltAndHashPassword } from "@/utils/password"

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        userID: { label: "userID", type: "string", required: true },
        password: { label: "password", type: "password", required: true },
      },
      authorize: async (credentials) => {
        if (credentials.userID === "admin" && credentials.password === "qwer") {
          return { id: 1, name: "Admin", email: "admin@example.com" };
        }

        return null;
      },
    }),
  ],
});
