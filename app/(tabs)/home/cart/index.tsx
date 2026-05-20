import CartItem from "@/components/CartItem";
import { colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/db/orders";
import { usePressAnimation } from "@/hooks/usePressAnimation";
import { getCartSubtotal } from "@/utilities/cart";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const isDark = useColorScheme() === 'dark';
    
    const {user} = useAuth();
    const {items, updateQuantity, removeFromCart, clearCart} = useCart();
    const canCheckout = items.length > 0;
    const total = getCartSubtotal(items);

    const {onPressIn, onPressOut, animatedStyle} = usePressAnimation({});

    const handleCheckout = async () => {
        if (!canCheckout || !user?.id) {
            return;
        };
        try {
            await createOrder({
                userId: user.id,
                items,
                price: total,
            });
            clearCart();
            router.push('/home/checkout');
        } catch (error) {
            console.error('Error creating order:', error);
        };
    };

    return (
        <View style={[styles.container, {backgroundColor: isDark ? colors.black : colors.white}]}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.key}
                contentContainerStyle={[styles.listContent, {paddingTop: insets.top + 56}]}
                style={styles.list}
                accessibilityRole="list"
                accessibilityLabel="Cart items"
                accessibilityHint="Browse the products in your cart"
                renderItem={({item}) => (
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
                    <Text style={[styles.emptyText, {color: isDark ? colors.white : colors.black}]}
                          accessibilityRole="text">
                        Your cart is empty.
                    </Text>
                }
            />
            <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, {color: isDark ? colors.white : colors.black}]}>
                    Total
                </Text>
                <Text style={[styles.summaryValue, {color: isDark ? colors.white : colors.black}]}>
                    ${total.toFixed(2)}
                </Text>
            </View>
            <View style={styles.separator}></View>
            <Animated.View style={[animatedStyle]}>
                <Pressable
                    style={[styles.button, !canCheckout && styles.buttonDisabled]}
                    onPress={handleCheckout}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    disabled={!canCheckout}
                    accessibilityRole="button"
                    accessibilityLabel="Go to checkout"
                    accessibilityHint="Opens the checkout screen to review your order"
                    accessibilityState={{disabled: !canCheckout}}
                >
                    <Text style={styles.buttonText}>Go to checkout</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
};

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
        backgroundColor: colors.green,
        alignItems: "center",
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: colors.white,
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
        borderColor: colors.lightGrey,
        borderWidth: 1
    },
});

