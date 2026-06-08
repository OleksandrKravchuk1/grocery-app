import { PaymentOption } from "@/app/(tabs)/home/payment/components/PaymentOption";
import { colors } from "@/constants/colors";
import { useTheme } from "@/src/constants/theme";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { useCart } from "@/src/features/cart/context/CartContext";
import { getCartSubtotal } from "@/src/features/cart/utilities/cart";
import { createOrder } from "@/src/features/order/api/orders";
import { FormInput } from "@/src/features/payment/components/FormInput";
import { usePaymentMethods } from "@/src/features/payment/hooks/usePaymentMethods";
import { formatCardNumber, formatCvc, formatExpiry, validateCardPaymentDetails } from "@/src/utilities/formatCard";
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PaymentMethod = "apple" | "card";

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { user } = useAuth();

  const { items, clearCart } = useCart();
  const total = getCartSubtotal(items);

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cards } = usePaymentMethods();
  const [selectedCardId, setSelectedCardId] = useState<string | "new">("new");
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (cards && cards.length > 0 && !hasInitializedRef.current) {
      const defaultCard = cards.find(c => c.isDefault) || cards[0];
      setSelectedCardId(defaultCard.id);
      hasInitializedRef.current = true;
    }
  }, [cards]);

  const isSavedCardSelected = method === "card" && cards.length > 0 && selectedCardId !== "new";

  const cardValidationError = validateCardPaymentDetails({ cardNumber, expiry, cvc, now: new Date() });
  const canPayCard = isSavedCardSelected || cardValidationError === null;

  const handleConfirmPress = async () => {
    if (isSubmitting) return;

    if (method === "card" && !isSavedCardSelected && cardValidationError) {
      Alert.alert(cardValidationError.title, cardValidationError.message, [{ text: "OK" }]);
      return;
    }

    try {
      setIsSubmitting(true);

      if (user?.id) {
        await createOrder({
          userId: user.id,
          items,
          price: total,
        });
      }

      clearCart();

      Alert.alert("Success", "Payment successful!", [
        {
          text: "OK",
          onPress: () => {
            router.dismissAll();
          },
        },
      ]);
    } catch (error) {
      console.error("Payment confirmation error:", error);
      Alert.alert("Error", "Could not complete order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.screen }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24 },
        ]}
        accessibilityLabel="Payment"
        accessibilityHint="Choose how you want to pay and enter your card details if needed"
      >
        <PaymentOption
          icon={<FontAwesome6 name="apple-pay" size={22} color={theme.text} />}
          label="Apple pay"
          selected={method === "apple"}
          onPress={() => setMethod("apple")}
          theme={theme}
        />

        <PaymentOption
          icon={<Ionicons name="card-outline" size={22} color={theme.text} />}
          label="Pay with card"
          selected={method === "card"}
          onPress={() => setMethod("card")}
          theme={theme}
        />

        {method === "card" ? (
          <View style={styles.form}>
            {/* Saved Cards Selection */}
            {cards.length > 0 && (
              <View style={styles.savedCardsSection}>
                <Text style={[styles.label, { color: theme.text }]}>Saved Payment Cards</Text>
                <View style={[styles.savedCardsList, { borderColor: theme.border }]}>
                  {cards.map((card) => {
                    const isSelected = selectedCardId === card.id;
                    return (
                      <Pressable
                        key={card.id}
                        style={[
                          styles.savedCardRow,
                          { borderBottomColor: theme.border },
                          isSelected && { backgroundColor: theme.inputBg }
                        ]}
                        onPress={() => setSelectedCardId(card.id)}
                      >
                        <View style={styles.savedCardInfo}>
                          <Ionicons
                            name={(card.brand === 'visa' ? 'logo-visa' : 'card') as any}
                            size={20}
                            color={theme.text}
                            style={{ marginRight: 10 }}
                          />
                          <Text style={[styles.savedCardNumber, { color: theme.text }]}>
                            {card.brand.toUpperCase()} ending in {card.cardNumber.slice(-4)}
                          </Text>
                        </View>
                        <Ionicons
                          name={isSelected ? "radio-button-on" : "radio-button-off"}
                          size={20}
                          color={isSelected ? theme.accent : theme.muted}
                        />
                      </Pressable>
                    );
                  })}

                  {/* New Card Option */}
                  <Pressable
                    style={[
                      styles.savedCardRow,
                      selectedCardId === 'new' && { backgroundColor: theme.inputBg }
                    ]}
                    onPress={() => setSelectedCardId('new')}
                  >
                    <View style={styles.savedCardInfo}>
                      <Ionicons
                        name="add-outline"
                        size={20}
                        color={theme.text}
                        style={{ marginRight: 10 }}
                      />
                      <Text style={[styles.savedCardNumber, { color: theme.text, fontWeight: '600' }]}>
                        Use a new credit or debit card
                      </Text>
                    </View>
                    <Ionicons
                      name={selectedCardId === 'new' ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={selectedCardId === 'new' ? theme.accent : theme.muted}
                    />
                  </Pressable>
                </View>
              </View>
            )}

            {/* Card input form fields (rendered only if using a new card or if no saved cards exist) */}
            {(selectedCardId === "new" || cards.length === 0) && (
              <View style={{ gap: 10 }}>
                <FormInput
                  label="Card number"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  onChangeTextFormatter={formatCardNumber}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={theme.muted}
                  keyboardType="number-pad"
                  maxLength={19}
                  accessibilityLabel="Card number"
                  accessibilityHint="Enter your 16 digit card number"
                  rightElement={
                    <View style={styles.brandRow}>
                      <FontAwesome6 name="cc-mastercard" size={22} color="#EB001B" accessible={false} />
                      <FontAwesome6 name="cc-visa" size={22} color="#1A1F71" accessible={false} />
                      <FontAwesome6 name="cc-discover" size={22} color="#FF6000" accessible={false} />
                      <FontAwesome6 name="cc-jcb" size={22} color="#0B4EA2" accessible={false} />
                    </View>
                  }
                />

                <View style={styles.row}>
                  <FormInput
                    label="Expiry"
                    value={expiry}
                    onChangeText={setExpiry}
                    onChangeTextFormatter={formatExpiry}
                    placeholder="mm/yy"
                    placeholderTextColor={theme.muted}
                    keyboardType="number-pad"
                    maxLength={5}
                    containerStyle={styles.flex1}
                    accessibilityLabel="Expiry date"
                    accessibilityHint="Enter the card expiration date in month and year"
                  />

                  <FormInput
                    label="CVC"
                    value={cvc}
                    onChangeText={setCvc}
                    onChangeTextFormatter={formatCvc}
                    placeholder="***"
                    placeholderTextColor={theme.muted}
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={4}
                    containerStyle={styles.flex1}
                    accessibilityLabel="CVC"
                    accessibilityHint="Enter the security code from your card"
                    rightElement={
                      <MaterialCommunityIcons name="credit-card-outline" size={20} color={theme.muted} accessible={false} />
                    }
                  />
                </View>
              </View>
            )}
          </View>
        ) : null}

        <Pressable
          style={[styles.confirmButton, {
            backgroundColor:
              method === "card" && !canPayCard ? "#C9C9C9" : theme.accent,
          },
          (isSubmitting || (method === "card" && !canPayCard)) && { opacity: 0.7 }
          ]}
          onPress={handleConfirmPress}
          disabled={isSubmitting || (method === "card" && !canPayCard)}
          accessibilityRole="button"
          accessibilityLabel={method === "card"
            ? `Confirm and pay $${total.toFixed(2)}`
            : `Pay with Apple Pay $${total.toFixed(2)}`}
          accessibilityHint={method === "card"
            ? "Confirms your card payment details and completes the order"
            : "Completes the order with Apple Pay"}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>
              {method === "card"
                ? `Confirm and Pay ($${total.toFixed(2)})`
                : `Pay with Apple Pay ($${total.toFixed(2)})`}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 12,
  },
  form: {
    marginTop: 4,
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  confirmButton: {
    minHeight: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  confirmText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  savedCardsSection: {
    marginTop: 4,
    marginBottom: 8,
    gap: 8,
  },
  savedCardsList: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  savedCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
  },
  savedCardInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  savedCardNumber: {
    fontSize: 15,
    fontWeight: "500",
  },
});
