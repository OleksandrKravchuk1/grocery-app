import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/features/auth/context/AuthContext';
import { PaymentCard, PaymentPreferences } from '../types/payment';
import * as paymentService from '../services/paymentService';

export const paymentKeys = {
    all: ['payment'] as const,
    cards: (userId: string) => [...paymentKeys.all, 'cards', userId] as const,
    preferences: (userId: string) => [...paymentKeys.all, 'preferences', userId] as const,
};

export function usePaymentMethods() {
    const { user } = useAuth();
    const userId = user?.id || 'guest';
    const queryClient = useQueryClient();

    // Query for saved cards
    const cardsQuery = useQuery({
        queryKey: paymentKeys.cards(userId),
        queryFn: () => paymentService.getSavedCards(userId),
    });

    // Query for preferences
    const preferencesQuery = useQuery({
        queryKey: paymentKeys.preferences(userId),
        queryFn: () => paymentService.getPreferences(userId),
    });

    // Mutation to add a card
    const addCardMutation = useMutation({
        mutationFn: (cardData: Omit<PaymentCard, 'id' | 'brand' | 'isDefault'> & { isDefault?: boolean }) =>
            paymentService.saveCard(userId, cardData),
        onSuccess: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            void queryClient.invalidateQueries({ queryKey: paymentKeys.cards(userId) });
        },
        onError: async (err) => {
            console.error('Failed to add card:', err);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        },
    });

    // Mutation to delete a card
    const removeCardMutation = useMutation({
        mutationFn: (cardId: string) => paymentService.deleteCard(userId, cardId),
        onSuccess: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            void queryClient.invalidateQueries({ queryKey: paymentKeys.cards(userId) });
        },
        onError: (err) => {
            console.error('Failed to delete card:', err);
        },
    });

    // Mutation to set default card
    const makeDefaultMutation = useMutation({
        mutationFn: (cardId: string) => paymentService.setDefaultCard(userId, cardId),
        onSuccess: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            void queryClient.invalidateQueries({ queryKey: paymentKeys.cards(userId) });
        },
        onError: (err) => {
            console.error('Failed to set default card:', err);
        },
    });

    // Mutation to update preferences with optimistic updates
    const updatePreferencesMutation = useMutation({
        mutationFn: (newPrefs: Partial<PaymentPreferences>) => {
            const current = preferencesQuery.data || {
                useApplePay: false,
                useGooglePay: false,
                useCashOnDelivery: true,
            };
            return paymentService.savePreferences(userId, { ...current, ...newPrefs });
        },
        onMutate: async (newPrefs) => {
            await queryClient.cancelQueries({ queryKey: paymentKeys.preferences(userId) });
            const previousPrefs = queryClient.getQueryData<PaymentPreferences>(paymentKeys.preferences(userId));
            if (previousPrefs) {
                queryClient.setQueryData<PaymentPreferences>(paymentKeys.preferences(userId), {
                    ...previousPrefs,
                    ...newPrefs,
                });
            }
            return { previousPrefs };
        },
        onError: (err, newPrefs, context) => {
            console.error('Failed to save payment preferences:', err);
            if (context?.previousPrefs) {
                queryClient.setQueryData(paymentKeys.preferences(userId), context.previousPrefs);
            }
        },
        onSuccess: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: paymentKeys.preferences(userId) });
        },
    });

    return {
        cards: cardsQuery.data || [],
        preferences: preferencesQuery.data || {
            useApplePay: false,
            useGooglePay: false,
            useCashOnDelivery: true,
        },
        isLoading: cardsQuery.isLoading || preferencesQuery.isLoading,
        isSaving: addCardMutation.isPending,
        error: cardsQuery.isError || addCardMutation.isError
            ? 'An error occurred with payment settings.'
            : null,
        addCard: addCardMutation.mutateAsync,
        removeCard: removeCardMutation.mutate,
        makeDefault: makeDefaultMutation.mutate,
        updatePreferences: updatePreferencesMutation.mutate,
    };
}
