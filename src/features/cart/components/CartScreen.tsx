import { palette } from "@/src/constants/colors";
import { usePressAnimation } from "@/hooks/animations/usePressAnimation";
import { useAppTheme } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { CartItem } from "@/src/features/cart/components/CartItem";
import { useCart } from "@/src/features/cart/context/CartContext";
import { getCartSubtotal } from "@/src/features/cart/utilities/cart";
import { useRouter } from "expo-router";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors: theme } = useAppTheme();

  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart } = useCart();
  const canCheckout = items.length > 0;
  const total = getCartSubtotal(items);

  const { onPressIn, onPressOut, animatedStyle } = usePressAnimation({});

  const handleCheckout = () => {
    if (!canCheckout) return;
    if (!user?.id) {
      Alert.alert(
        "Sign In Required",
        "You need to sign in before proceeding to checkout.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign In",
            onPress: () => router.push("/profile" as any),
          },
        ],
      );
      return;
    }
    router.push('/home/checkout');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.screen }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.key}
        contentContainerStyle={[styles.listContent, { paddingTop: insets.top + 56 }]}
        style={styles.list}
        accessibilityRole="list"
        accessibilityLabel="Cart items"
        accessibilityHint="Browse the products in your cart"
        renderItem={({ item }) => (
          <CartItem
            title={item.product.title}
            price={parseFloat((item.product.price * item.quantity).toFixed(2))}
            quantity={item.quantity}
            image={item.product.image}
            onIncrease={() => updateQuantity(item.product, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.product, item.quantity - 1)}
            onRemove={() => removeFromCart(item.product)}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.muted }]}
            accessibilityRole="text">
            Your cart is empty.
          </Text>
        }
      />
      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: theme.text }]}>
          Total
        </Text>
        <Text style={[styles.summaryValue, { color: theme.text }]}>
          ${total.toFixed(2)}
        </Text>
      </View>
      <View style={[styles.separator, { borderColor: theme.border }]}></View>
      <Animated.View style={[animatedStyle]}>
        <Pressable
          style={[styles.button, !canCheckout && styles.buttonDisabled, { backgroundColor: theme.accent }]}
          onPress={handleCheckout}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={!canCheckout}
          accessibilityRole="button"
          accessibilityLabel="Go to checkout"
          accessibilityHint="Opens the checkout screen to review your order"
          accessibilityState={{ disabled: !canCheckout }}
        >
          <Text style={styles.buttonText}>Go to checkout</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  button: {
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: palette.green,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "700",
  },
  summaryRow: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  separator: {
    borderColor: palette.grey100,
    borderWidth: 1
  },
});