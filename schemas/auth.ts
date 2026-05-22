import * as z from "zod";

export const signInFormSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(20, "First name must be at most 50 characters"),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(20, "Last name must be at most 20 characters"),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(15, "Phone number must be at most 15 characters"),
    gender: z
        .enum(["Male", "Female", "Other"], "Choose a valid gender option"),
    birthday: z
        .string()
        .refine((date) => {
            if (!date) return true;
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, "Invalid date format. Use YYYY-MM-DD"),
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