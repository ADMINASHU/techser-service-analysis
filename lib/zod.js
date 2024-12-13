// lib/schemas.js
import { z } from "zod";
import { object, string } from "zod";

// Define a schema for user login
const loginSchema = z.object({
  userID: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

export { loginSchema };

// Define a schema for user registration

export const RegisterSchema = object({
  userID: string().min(1, "User ID is required"),
  email: string().min("Invalid Email"),
  password: string()
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
  confirmPassword: string()
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password does not match",
  path: ["confirmPassword"],
});
