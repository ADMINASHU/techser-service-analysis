"use server";

import { signIn, signOut } from "@/auth";

export async function doLogout() {
  await signOut({ redirect: "/" });
}

export async function doLogin( {userID, password}) {
  // console.log("from server: "+userID);
  try {
    const response = await signIn("credentials", {
      userID: userID,
      password: password,
      redirect: false,
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
