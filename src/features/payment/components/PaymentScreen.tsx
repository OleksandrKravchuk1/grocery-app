import { LoadingView } from '@/components/ui/view/LoadingView';
import { useTheme } from '@/src/constants/theme';
import { AddCardForm } from '@/src/features/payment/components/AddCardForm';
import { PaymentOptions } from '@/src/features/payment/components/PaymentOptions';
import { SavedCardsCarousel } from '@/src/features/payment/components/SavedCardsCarousel';
import { usePaymentMethods } from '@/src/features/payment/hooks/usePaymentMethods';
import { usePressAnimation } from '@/src/hooks/animations/usePressAnimation';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [showAddCard, setShowAddCard] = useState(false);

  const {
    cards,
    preferences,
    isLoading,
    error,
    addCard,
    removeCard,
    makeDefault,
    updatePreferences,
  } = usePaymentMethods();

  const { animatedStyle, onPressIn, onPressOut } = usePressAnimation({
    toValue: 0.96,
  });

  if (isLoading) {
    return <LoadingView />
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.screen }]}>
      {showAddCard ? (
        <Animated.View
          style={[styles.animatedView, { paddingTop: insets.top + 60 }]}
          entering={FadeIn.duration(250)}
          exiting={FadeOut.duration(200)}
        >
          <AddCardForm
            onSave={async (newCard) => {
              try {
                await addCard(newCard);
                setShowAddCard(false);
                return true;
              } catch {
                return false;
              }
            }}
            onCancel={() => setShowAddCard(false)}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={[styles.animatedView, { paddingTop: insets.top + 60 }]}
          entering={FadeIn.duration(250)}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Error Message banner */}
            {error && (
              <View style={[styles.errorBanner, { backgroundColor: theme.danger + '15' }]}>
                <Ionicons name="alert-circle" size={20} color={theme.danger} />
                <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
              </View>
            )}

            {/* Saved Cards Carousel */}
            <SavedCardsCarousel
              cards={cards}
              onDelete={removeCard}
              onSetDefault={makeDefault}
            />

            {/* Add Card Trigger Button */}
            <Animated.View style={[styles.btnWrapper, animatedStyle]}>
              <Pressable
                style={[
                  styles.addCardBtn,
                  cards.length === 0
                    ? { backgroundColor: theme.accent, borderColor: 'transparent' }
                    : { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }
                ]}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={() => setShowAddCard(true)}
                accessibilityRole="button"
                accessibilityLabel="Add a new credit or debit card"
              >
                <Ionicons
                  name="add-outline"
                  size={20}
                  color={cards.length === 0 ? '#fff' : theme.text}
                />
                <Text
                  style={[
                    styles.addCardBtnText,
                    { color: cards.length === 0 ? '#fff' : theme.text }
                  ]}
                >
                  Add New Card
                </Text>
              </Pressable>
            </Animated.View>

            {/* Other payment methods */}
            <PaymentOptions
              preferences={preferences}
              onChange={updatePreferences}
            />
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  btnWrapper: {
    marginHorizontal: 16,
    marginTop: 4,
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  addCardBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
