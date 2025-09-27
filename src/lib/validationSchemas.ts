import { z } from 'zod';

// Authentication schemas
export const signUpSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(128, { message: "Password must be less than 128 characters" }),
  displayName: z.string().trim().min(1, { message: "Display name is required" }).max(100, { message: "Display name must be less than 100 characters" })
});

export const signInSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  password: z.string().min(1, { message: "Password is required" }).max(128, { message: "Password must be less than 128 characters" })
});

// Contact form schema
export const contactSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email must be less than 255 characters" }),
  message: z.string().trim().min(1, { message: "Message is required" }).max(1000, { message: "Message must be less than 1000 characters" })
});

// Profile update schema
export const profileUpdateSchema = z.object({
  display_name: z.string().trim().min(1, { message: "Display name is required" }).max(100, { message: "Display name must be less than 100 characters" }),
  avatar_url: z.string().url({ message: "Invalid URL" }).optional().or(z.literal(""))
});

// Admin role management schema
export const roleAssignmentSchema = z.object({
  userId: z.string().uuid({ message: "Invalid user ID" }),
  role: z.enum(['admin', 'client'], { message: "Role must be either 'admin' or 'client'" })
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type RoleAssignmentFormData = z.infer<typeof roleAssignmentSchema>;