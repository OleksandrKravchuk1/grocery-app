import {
  isValidExpiry,
  isValidLuhn,
} from '@/src/utilities/formatCard';
import * as z from 'zod';

export type CardFormValues = z.infer<typeof cardFormSchema>;

// Zod form validation schema matching app validation patterns
export const cardFormSchema = z.object({
  cardholderName: z
    .string()
    .trim()
    .min(1, 'Cardholder name is required.'),
  cardNumber: z
    .string()
    .refine((val) => val.replace(/\D/g, '').length === 16, 'Enter all 16 digits of your card number.')
    .refine((val) => isValidLuhn(val), 'Card number failed validation. Please check the digits.'),
  expiryDate: z
    .string()
    .refine((val) => val.replace(/\D/g, '').length === 4, 'Enter expiry date in MM/YY format.')
    .refine((val) => isValidExpiry(val), 'Card expiry date is invalid or already expired.'),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV must contain 3 or 4 digits.'),
  isDefault: z.boolean(),
});