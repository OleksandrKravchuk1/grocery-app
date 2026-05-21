import {Pressable, StyleProp, StyleSheet, Text, useColorScheme, ViewStyle} from "react-native";
import {useEffect} from "react";
import {Feather} from "@expo/vector-icons";
import Animated, {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {colors} from "@/constants/colors";
import {useCart} from "@/context/CartContext";
import {Product} from "@/types/product";

type AddToCartButtonProps = {
    product: Product;
    style?: StyleProp<ViewStyle>;
};

export const AddToCartButton = ({product, style}: AddToCartButtonProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const {getQuantity, addToCart, updateQuantity, removeFromCart} = useCart();
    const quantity = getQuantity(product);

    const isExpanded = quantity > 0;
    const progress = useSharedValue(isExpanded ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(isExpanded ? 1 : 0, {
            duration: 220,
            easing: Easing.out(Easing.cubic),
        });
    }, [isExpanded, progress]);

    const fabAnimatedStyle = useAnimatedStyle(() => ({
        width: 38 + 78 * progress.value,
        paddingHorizontal: 10 * progress.value,
    }));

    const plusAnimatedStyle = useAnimatedStyle(() => ({
        opacity: 1 - progress.value,
        transform: [{scale: 1 - 0.12 * progress.value}],
    }));

    const controlsAnimatedStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [{scale: 0.9 + 0.1 * progress.value}],
    }));

    const handleAdd = () => addToCart(product);
    const handleIncrease = () => updateQuantity(product, quantity + 1);
    const handleDecrease = () => {
        if (quantity === 1) removeFromCart(product);
        else updateQuantity(product, quantity - 1);
    };

    return (
        <Animated.View
            style={[styles.fabBase, {
                backgroundColor: isDark ? colors.black : colors.white
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
                    <Feather name="plus" size={26} color={isDark ? "white" : "black"} accessible={false}/>
                </Pressable>
            </Animated.View>

            <Animated.View pointerEvents={isExpanded ? "auto" : "none"}
                           style={[styles.fabControlsRow, controlsAnimatedStyle]}
            >
                <Pressable onPress={handleDecrease}
                           accessibilityRole='button'
                           accessibilityLabel={quantity === 1 ? `Remove ${product.title} from cart` : `Decrease ${product.title} quantity`}
                           accessibilityHint='Decreases quantity of this item in cart'
                >
                    {quantity === 1
                        ? <Feather name="trash-2" size={18} color={isDark ? "white" : "black"} accessible={false}/>
                        : <Feather name="minus" size={18} color={isDark ? "white" : "black"} accessible={false}/>
                    }
                </Pressable>
                <Text style={{color: isDark ? colors.white : colors.black, fontWeight: "700"}}
                      accessibilityRole='text'
                      accessibilityLabel={`Quantity: ${quantity}`}
                >
                    {quantity}
                </Text>
                <Pressable onPress={handleIncrease}
                           accessibilityRole='button'
                           accessibilityLabel={`Increase ${product.title} quantity`}
                           accessibilityHint='Increases quantity of this item in cart'
                >
                    <Feather name="plus" size={18} color={isDark ? "white" : "black"} accessible={false}/>
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
        shadowOffset: {width: 0, height: 2},
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
