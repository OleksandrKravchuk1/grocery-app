import { useTheme } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { PaymentCard } from '../types/payment';
import { CreditCardView } from './CreditCardView';

interface SavedCardsCarouselProps {
  cards: PaymentCard[];
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function SavedCardsCarousel({
  cards,
  onDelete,
  onSetDefault,
}: SavedCardsCarouselProps) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewWidth = event.nativeEvent.layoutMeasurement.width;

    if (viewWidth === 0) return;
    const index = Math.round(contentOffset / viewWidth);
    if (index >= 0 && index < cards.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const confirmDelete = (card: PaymentCard) => {
    Alert.alert(
      'Remove Payment Method',
      `Are you sure you want to delete the card ending in ${card.cardNumber.slice(-4)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(card.id);
            if (activeIndex >= cards.length - 1 && activeIndex > 0) {
              setActiveIndex(activeIndex - 1);
            }
          },
        },
      ]
    );
  };

  if (cards.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="card-outline" size={48} color={theme.muted} />
        <Text style={[styles.emptyTitle, { color: theme.text }]}>No Saved Cards</Text>
        <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
          Add a credit or debit card for faster checkout.
        </Text>
      </View>
    );
  }

  const activeCard = cards[activeIndex] || cards[0];

  return (
    <View style={styles.container}>
      {/* CAROUSEL FLATLIST */}
      <FlatList
        ref={flatListRef}
        data={cards}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.cardWrapper, { width: screenWidth }]}>
            {item.isDefault && (
              <View style={[styles.defaultBadge, { backgroundColor: theme.accent }]}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            )}
            <CreditCardView
              cardholderName={item.cardholderName}
              cardNumber={item.cardNumber}
              expiryDate={item.expiryDate}
              cvv=''
              brand={item.brand}
              flipped={false}
            />
          </View>
        )}
      />

      {/* DOT INDICATORS */}
      {cards.length > 1 && (
        <View style={styles.dotsContainer}>
          {cards.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor: idx === activeIndex ? theme.accent : theme.border,
                  width: idx === activeIndex ? 16 : 8,
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* CONTROL PANEL FOR ACTIVE CARD */}
      {activeCard && (
        <View style={[styles.controlPanel, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardInfoRow}>
            <Ionicons
              name={
                (activeCard.brand === 'visa' ? 'logo-visa' : 'card') as any
              }
              size={20}
              color={theme.text}
            />
            <Text style={[styles.cardInfoText, { color: theme.text }]}>
              {activeCard.brand.toUpperCase()} ending in {activeCard.cardNumber.slice(-4)}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            {!activeCard.isDefault ? (
              <Pressable
                style={[styles.actionBtn, { borderColor: theme.border }]}
                onPress={() => onSetDefault(activeCard.id)}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color={theme.accent} />
                <Text style={[styles.actionBtnText, { color: theme.text }]}>Use as Default</Text>
              </Pressable>
            ) : (
              <View style={styles.defaultStatus}>
                <Ionicons name="checkmark-circle" size={18} color={theme.accent} />
                <Text style={[styles.defaultStatusText, { color: theme.accent }]}>Primary card</Text>
              </View>
            )}

            <Pressable
              style={[styles.actionBtn, styles.deleteBtn, { borderColor: theme.border }]}
              onPress={() => confirmDelete(activeCard)}
            >
              <Ionicons name="trash-outline" size={18} color={theme.danger} />
              <Text style={[styles.actionBtnText, { color: theme.danger }]}>Delete</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  cardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  defaultBadge: {
    position: 'absolute',
    top: 24,
    right: 32,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginVertical: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,0.1)',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  controlPanel: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardInfoText: {
    fontSize: 15,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteBtn: {
    flex: 0.5,
  },
  defaultStatus: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  defaultStatusText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
