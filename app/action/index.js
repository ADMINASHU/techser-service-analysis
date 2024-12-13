"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function doLogout() {
  await signOut({ redirect: "/" });
}

export async function doLogin(cred) {
  const { userID, password } = cred; // No need to use await here
  try {
    const response = await signIn("credentials", {
      userID,
      password,
      redirect: false,
    });

    if (response.error) {
      console.error("Authentication error:", response.error);
      throw new Error('Sign in failed');
    } else {
      console.log("Login successful:", response);
    }
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        case "CallbackRouteError":
          return { error: "Invalid credentials" };
        default:
          return { error: "An error occurred while attempting to login" };
      }
    }
    throw error;
  }
}
