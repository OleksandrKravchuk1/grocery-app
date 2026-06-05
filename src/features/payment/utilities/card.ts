import { CardBrand } from '../types/payment';

// Determine Gradient & Logo based on Brand
export const getCardTheme = (brand: CardBrand) => {
  switch (brand) {
    case 'visa':
      return {
        colors: ['#0f3443', '#34e89e'] as [string, string, ...string[]],
        brandName: 'VISA',
        logoColor: '#fff',
      };
    case 'mastercard':
      return {
        colors: ['#141E30', '#243B55'] as [string, string, ...string[]],
        brandName: 'Mastercard',
        logoColor: '#f15a24',
      };
    case 'amex':
      return {
        colors: ['#000428', '#004e92'] as [string, string, ...string[]],
        brandName: 'AMEX',
        logoColor: '#00a3e0',
      };
    case 'discover':
      return {
        colors: ['#ed4264', '#ffedbc'] as [string, string, ...string[]],
        brandName: 'Discover',
        logoColor: '#ff6600',
      };
    default:
      // Grocer Theme (Green Gradient)
      return {
        colors: ['#0d7a04', '#0CA201'] as [string, string, ...string[]],
        brandName: 'GROCER CARD',
        logoColor: '#fff',
      };
  }
};

// Format Card Number for Card Face (e.g. 4111 2222 3333 4444)
export const formatCardNumberForFace = (num: string) => {
  const clean = num.replace(/\s+/g, '').padEnd(16, '•');
  const matches = clean.match(/.{1,4}/g);
  return matches ? matches.join('  ') : clean;
};

// Format Expiry Date for Card Face (e.g. MM/YY)
export const formatExpiryForFace = (exp: string) => {
  const clean = exp.replace(/\//g, '').padEnd(4, '•');
  return `${clean.slice(0, 2)}/${clean.slice(2)}`;
};
