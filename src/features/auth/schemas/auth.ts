import * as z from "zod";

export const signInFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be at most 30 characters")
    .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-]+$/, "Name contains invalid characters"),
  lastName: z
    .string()
    .min(2, "Surname must be at least 2 characters")
    .max(30, "Surname must be at most 30 characters")
    .regex(/^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-]+$/, "Surname contains invalid characters"),
  phone: z
    .string()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      return val.trim().length >= 10 && val.trim().length <= 15;
    }, "Phone must be 10–15 characters"),
  gender: z
    .enum(["Male", "Female", "Other"], "Choose a valid gender option"),
  birthday: z
    .string()
    .refine((date) => {
      if (!date || date.trim() === "") return true;
      return /^\d{4}-\d{2}-\d{2}$/.test(date);
    }, "Use format YYYY-MM-DD (e.g. 2000-01-31)")
    .refine((date) => {
      if (!date || date.trim() === "") return true;
      const parsed = new Date(date);
      if (isNaN(parsed.getTime())) return false;
      const now = new Date();
      const age = now.getFullYear() - parsed.getFullYear();
      return age >= 13 && age <= 120;
    }, "Enter a valid date (age must be 13–120)"),
});

export const authFormSchema = z.object({
  email: z
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});
