export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export interface PaymentCard {
  id: string;
  cardholderName: string;
  cardNumber: string;
  expiryDate: string; // MM/YY
  cvv: string;
  brand: CardBrand;
  isDefault: boolean;
}

export interface PaymentPreferences {
  useApplePay: boolean;
  useGooglePay: boolean;
  useCashOnDelivery: boolean;
}

export interface CreditCardViewProps {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  brand: CardBrand;
  flipped: boolean;
}

export interface AddCardFormProps {
  onSave: (card: {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    isDefault: boolean;
  }) => Promise<boolean>;
  onCancel: () => void;
}