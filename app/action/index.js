"use server";

import { signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { AuthError } from "next-auth";

export async function doLogout() {
  await signOut({ redirect: "/" });
}

export async function doLogin(cred) {
  const { userID, password } = await cred;
  if (!userID || !password) {
    return { error: "Please provide a valid userID and password" };
  }
  try {
    await signIn("credentials", {
      userID: userID,
      password: password,
      redirectTo: "/test",
    });
    return { success: "Login successful" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "An error occurred while attempting to login" };
      }
    }
    throw error;
  }
}
