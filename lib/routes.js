export const LOGIN = "/login";
export const ROOT = "/";
export const SIGNUP = "/register";
export const PROFILE = "/profile";
export const UNAUTHORIZED = "/unauthorized";

export const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/register",
  "/verify-email",
  "/terms-and-conditions",
  "/privacy-policy",
  "/test",
  //   "/api/",
];
export const PROTECTED_ROUTES = ["/profile", "/api/profile"];
export const VERIFIED_ROUTES = [
  "/users",
  "/data",
  "/dashboard",
  "/control",
  "/api/users",
  "/api/control",
];
export const LEVEL1_ROUTES = ["/control", "/data", "/api/users", "/api/control"];
export const LEVEL2_ROUTES = ["/dashboard/region"];
export const LEVEL3_ROUTES = ["/users", "/dashboard/branch", "/customer"];
