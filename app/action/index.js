"use server";

import { signIn, signOut } from "@/auth";

export async function doLogout() {
  await signOut({ redirect: "/" });
}

export async function doLogin(cred) {
  const { userID, password } = await cred;
  try {
    const response = await signIn("credentials", {
      userID: userID,
      password: password,
      redirect: false,
    });
    console.log("from server: "+response);
    return response;
    
  } catch (error) {
    throw new Error(error);
  }
}
