// lib/schemas.js
import { z } from "zod";


// Define a schema for user login
export const SignInSchema = z.object({
  userID: z
    .string()
    .trim()
    .nonempty("User ID is required")
    .min(3, "User ID must be at least 3 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be less than 32 characters"),
});

// Define a schema for user registration

export const RegisterSchema = z
  .object({
    userID: z
      .string()
      .trim()
      .nonempty("User ID is required")
      .min(3, "User ID must be at least 3 characters"),
    email: z.string().trim().nonempty("Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters")
      .max(32, "Confirm Password must be less than 32 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
