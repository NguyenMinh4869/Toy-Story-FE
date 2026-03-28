import { z } from "zod";
import type { LoginDto } from "./AccountDTO";

/**
 * Login form validation schema
 * Matches backend LoginDto (email/password)
 */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

/**
 * Login form data type
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Convert LoginFormData to LoginDto
 */
export const toLoginDto = (formData: LoginFormData): LoginDto => {
  return {
    email: formData.email,
    password: formData.password,
  };
};

/**
 * Register form validation schema
 * Matches backend CreateUserDto structure
 */
export const registerSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    name: z.string().min(1, "Name is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/**
 * Register form data type
 */
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Convert RegisterFormData to CreateUserDto
 */
import type { CreateUserDto } from "./AccountDTO";

export const toCreateUserDto = (formData: RegisterFormData): CreateUserDto => {
  return {
    email: formData.email,
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    name: formData.name,
    phoneNumber: formData.phoneNumber,
  };
};
