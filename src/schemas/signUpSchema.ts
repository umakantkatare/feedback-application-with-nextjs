import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username at least 2 characters")
  .max(20, "username must be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must be not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be contain 6 characters" }),
});
