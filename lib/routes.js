export const LOGIN = "/login";
export const ROOT = "/";
export const SIGNUP = "/register";
export const PROFILE = "/profile";
export const UNAUTHORIZED = "/unauthorized";
export const PUBLIC_ROUTES = [
  "/forgot-password",
  "/verify-email",
  "/terms-and-conditions",
  "/privacy-policy",
  "/test",
  "/api/proData",
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
export const LEVEL1_ROUTES = ["/control", "/data", "/api/control"];
export const LEVEL2_ROUTES = ["/dashboard/region"];
export const LEVEL3_ROUTES = ["/users", "/api/users", "/dashboard/branch", "/customer"];
export const AUTH_ROUTES = ["/login", "/register"];
export const AUTH_API_ROUTES = ["/api/auth", "/api/register"];
export const DEFAULT_LOGIN_REDIRECT = "/";
