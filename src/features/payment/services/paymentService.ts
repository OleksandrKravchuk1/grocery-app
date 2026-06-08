import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardBrand, PaymentCard, PaymentPreferences } from '../types/payment';

const CARDS_STORAGE_KEY_PREFIX = '@grocery_payment_cards_';
const PREFS_STORAGE_KEY_PREFIX = '@grocery_payment_prefs_';

function getCardsKey(userId: string): string {
  return `${CARDS_STORAGE_KEY_PREFIX}${userId || 'guest'}`;
}

function getPrefsKey(userId: string): string {
  return `${PREFS_STORAGE_KEY_PREFIX}${userId || 'guest'}`;
}

export function detectCardBrand(number: string): CardBrand {
  const cleanNumber = number.replace(/\s+/g, '');
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber) || /^2(22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
  return 'unknown';
}

export async function getSavedCards(userId: string): Promise<PaymentCard[]> {
  try {
    const key = getCardsKey(userId);
    const data = await AsyncStorage.getItem(key);
    if (!data) return [];
    const cards: PaymentCard[] = JSON.parse(data);

    // Sort: default card first
    return cards.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
  } catch (error) {
    console.error('Error fetching saved cards:', error);
    return [];
  }
}

export async function saveCard(
  userId: string,
  cardData: Omit<PaymentCard, 'id' | 'brand' | 'isDefault'> & { isDefault?: boolean }
): Promise<PaymentCard> {
  const key = getCardsKey(userId);
  const existingCards = await getSavedCards(userId);

  const brand = detectCardBrand(cardData.cardNumber);
  const newCardId = `card_${Math.random().toString(36).substring(2, 11)}`;

  // If it's the first card, force it to be default
  const shouldBeDefault = existingCards.length === 0 || !!cardData.isDefault;

  const cleanNumber = cardData.cardNumber.replace(/\s+/g, '');
  const newCard: PaymentCard = {
    id: newCardId,
    cardholderName: cardData.cardholderName.trim(),
    cardNumber: cleanNumber.slice(-4).padStart(cleanNumber.length, '•'),
    expiryDate: cardData.expiryDate.trim(),
    cvv: '',
    brand,
    isDefault: shouldBeDefault,
  };

  let updatedCards = [...existingCards];
  if (shouldBeDefault) {
    // Clear default flag on all other cards
    updatedCards = updatedCards.map(c => ({ ...c, isDefault: false }));
  }

  updatedCards.push(newCard);
  await AsyncStorage.setItem(key, JSON.stringify(updatedCards));
  return newCard;
}

export async function deleteCard(userId: string, cardId: string): Promise<void> {
  const key = getCardsKey(userId);
  const existingCards = await getSavedCards(userId);

  const cardToDelete = existingCards.find(c => c.id === cardId);
  if (!cardToDelete) return;

  let updatedCards = existingCards.filter(c => c.id !== cardId);

  // If we deleted the default card and there are remaining cards, make the first one default
  if (cardToDelete.isDefault && updatedCards.length > 0) {
    updatedCards[0].isDefault = true;
  }

  await AsyncStorage.setItem(key, JSON.stringify(updatedCards));
}

export async function setDefaultCard(userId: string, cardId: string): Promise<void> {
  const key = getCardsKey(userId);
  const existingCards = await getSavedCards(userId);
  const hasTarget = existingCards.some(c => c.id === cardId);
  if (!hasTarget) return;

  const updatedCards = existingCards.map(c => ({
    ...c,
    isDefault: c.id === cardId,
  }));

  await AsyncStorage.setItem(key, JSON.stringify(updatedCards));
}

export async function getPreferences(userId: string): Promise<PaymentPreferences> {
  try {
    const key = getPrefsKey(userId);
    const data = await AsyncStorage.getItem(key);
    if (!data) {
      return {
        useApplePay: false,
        useGooglePay: false,
        useCashOnDelivery: true,
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return {
      useApplePay: false,
      useGooglePay: false,
      useCashOnDelivery: true,
    };
  }
}

export async function savePreferences(userId: string, prefs: PaymentPreferences): Promise<void> {
  const key = getPrefsKey(userId);
  await AsyncStorage.setItem(key, JSON.stringify(prefs));
}
