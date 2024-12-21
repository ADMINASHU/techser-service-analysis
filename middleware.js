export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  unstable_allowDynamic: [
    "**/node_modules/@react-email*/**/*.mjs*",
  ],
};
