import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

const {auth} = NextAuth(authConfig);

export async function middleware(request) {
  const sessions = await auth();

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/api/:path*", "/data"],
};
