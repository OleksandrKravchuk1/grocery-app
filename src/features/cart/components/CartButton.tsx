import { useAppTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View, Text } from "react-native";

import { useCart } from "@/src/features/cart/context/CartContext";
import { getCartItemCount } from "@/src/features/cart/utilities/cart";

export function CartButton() {
  const { colors: theme } = useAppTheme();
  const router = useRouter();
  const { items } = useCart();
  const itemCount = getCartItemCount(items);

  const handleOnPress = () => {
    router.push('/home/cart');
  }

  return (
    <Pressable
      style={styles.bagIcon}
      onPress={handleOnPress}
      accessibilityRole='button'
      accessibilityLabel={`Shopping Cart, ${itemCount} items`}
      accessibilityHint='View items in your shopping cart'
    >
      <Ionicons
        name="bag-outline"
        size={24}
        color={theme.text}
        accessible={false} />
      
      {itemCount > 0 && (
        <View style={[styles.badge, { backgroundColor: theme.accent }]}>
          <Text style={styles.badgeText}>
            {itemCount > 99 ? '99+' : itemCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bagIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: 32,
    height: 32,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
