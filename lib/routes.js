export const LOGIN = "/login";
export const ROOT = "/";
export const SIGNUP = "/register";
export const PROFILE = "/profile";
export const UNAUTHORIZED = "/unauthorized";

export const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/register",
  "/verify-email",
  "/terms-and-conditions",
  "/privacy-policy",
  "/test",
  "/api/proData",
  "/api/cpData",
  "/api/register",
  "/api/password",
  "/api/send-email",
  "/api/reset-password",
  "/api/change-password",
  "/api/se-users",
  "/api/years",
];
export const PROTECTED_ROUTES = ["/profile", "/api/profile"];
export const VERIFIED_ROUTES = [
  "/users",
  "/data",
  "/dashboard",
  "/control",
  "/api/users",
  "/api/control",
  "/api/years",
];
export const LEVEL1_ROUTES = ["/control", "/data", "/api/control"];
export const LEVEL2_ROUTES = ["/dashboard/region"];
export const LEVEL3_ROUTES = ["/users", "/api/users","/api/users/*path", "/dashboard/branch", "/customer"];
export const AUTH_ROUTES = ["/login", "/register"];
export const AUTH_API_ROUTES = ["/api/auth", "/api/register"];
export const DEFAULT_LOGIN_REDIRECT = "/";