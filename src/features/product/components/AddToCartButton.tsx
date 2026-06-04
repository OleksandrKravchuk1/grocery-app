import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useCart } from "@/src/features/cart/context/CartContext";
import { Product } from "@/src/types/product";
import { useTheme } from "@/src/constants/theme";
import { useExpandAnimation } from "@/src/hooks/animations/useExpandAnimation";

type AddToCartButtonProps = {
    product: Product;
    style?: StyleProp<ViewStyle>;
};

export const AddToCartButton = ({ product, style }: AddToCartButtonProps) => {
    const theme = useTheme();
    const { getQuantity, addToCart, updateQuantity, removeFromCart } = useCart();

    const quantity = getQuantity(product);
    const isExpanded = quantity > 0;

    const { controlsAnimatedStyle, fabAnimatedStyle, plusAnimatedStyle } = useExpandAnimation(isExpanded);

    const handleAdd = () => addToCart(product);
    const handleInc = () => updateQuantity(product, quantity + 1);
    const handleDec = () => {
        if (quantity === 1) removeFromCart(product);
        else updateQuantity(product, quantity - 1);
    };

    return (
        <Animated.View
            style={[styles.fabBase, {
                backgroundColor: theme.screen,
            },
                fabAnimatedStyle,
                style,
            ]}>
            <Animated.View pointerEvents={isExpanded ? "none" : "auto"}
                style={[styles.fabLayerCenter, plusAnimatedStyle]}
            >
                <Pressable style={styles.fabLayerCenter}
                    onPress={handleAdd}
                    accessibilityRole='button'
                    accessibilityLabel={`Add ${product.title} to cart`}
                    accessibilityHint='Adds this product to your cart'
                >
                    <Feather name="plus" size={26} color={theme.text} accessible={false} />
                </Pressable>
            </Animated.View>

            <Animated.View pointerEvents={isExpanded ? "auto" : "none"}
                style={[styles.fabControlsRow, controlsAnimatedStyle]}
            >
                <Pressable onPress={handleDec}
                    accessibilityRole='button'
                    accessibilityLabel={quantity === 1 ? `Remove ${product.title} from cart` : `Decrease ${product.title} quantity`}
                    accessibilityHint='Decreases quantity of this item in cart'
                >
                    {quantity === 1
                        ? <Feather name="trash-2" size={18} color={theme.text} accessible={false} />
                        : <Feather name="minus" size={18} color={theme.text} accessible={false} />
                    }
                </Pressable>
                <Text style={{ color: theme.text, fontWeight: "700" }}
                    accessibilityRole='text'
                    accessibilityLabel={`Quantity: ${quantity}`}
                >
                    {quantity}
                </Text>
                <Pressable onPress={handleInc}
                    accessibilityRole='button'
                    accessibilityLabel={`Increase ${product.title} quantity`}
                    accessibilityHint='Increases quantity of this item in cart'
                >
                    <Feather name="plus" size={18} color={theme.text} accessible={false} />
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    fabBase: {
        position: "absolute",
        right: 0,
        bottom: -4,
        height: 38,
        borderRadius: 30,
        justifyContent: "center",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    fabLayerCenter: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
    },
    fabControlsRow: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
});
