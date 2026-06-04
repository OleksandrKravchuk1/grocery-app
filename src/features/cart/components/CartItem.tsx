import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {Feather} from "@expo/vector-icons";
import {colors} from "@/src/constants/colors";
import {useTheme} from "@/src/constants/theme";

type Props = {
    title: string;
    price: number;
    quantity: number;
    image: string;
    onIncrease: () => void;
    onDecrease: () => void;
    onRemove: () => void;
}

const CartItem = ({price, title, image, quantity, onIncrease, onDecrease, onRemove}: Props) => {
    const theme = useTheme();

    return (
        <View style={[styles.card, {backgroundColor: theme.imageContainer}]}>
            <View style={[styles.leftSection, {backgroundColor: theme.thumbnailBg}]}>
                <Image source={{uri: image}} style={styles.image} resizeMode="contain" accessible={false}/>
            </View>

            <View style={styles.contentContainer}>
                <Text numberOfLines={1} style={[styles.title, {color: theme.text}]}>
                    {quantity} {title}
                </Text>
                <Text style={[styles.price, {color: theme.text}]}>${price.toFixed(2)}</Text>
            </View>

            <View style={[styles.controls, {
                backgroundColor: theme.controlBg,
                borderColor: theme.controlBorder
            }]}>
                <Pressable hitSlop={8}
                           onPress={quantity === 1 ? onRemove : onDecrease}
                           style={styles.iconButton}
                           accessibilityRole="button"
                            accessibilityLabel={quantity === 1 ? `Remove ${title} from cart` : `Decrease ${title} quantity`}
                            accessibilityHint={quantity === 1 ? "Removes this item from your cart" : "Decreases quantity of this item in your cart"}
                >
                    <Feather name={quantity === 1 ? "trash-2" : "minus"}
                             size={18}
                             color={theme.text}
                             accessible={false}
                    />
                </Pressable>
                <Text style={[styles.quantityText, {color: theme.text}]}
                      accessibilityRole="text"
                      accessibilityLabel={`Quantity: ${quantity}`}
                >
                    {quantity}
                </Text>
                <Pressable hitSlop={8}
                           onPress={onIncrease}
                           style={styles.iconButton}
                           accessibilityRole="button"
                            accessibilityLabel={`Increase ${title} quantity`}
                            accessibilityHint="Increases quantity of this item in your cart"
                >
                    <Feather name="plus" size={20} color={theme.text} accessible={false}/>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        borderRadius: 14,
        overflow: 'hidden',
        minHeight: 120,
    },
    leftSection: {
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 90,
        height: 90,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        justifyContent: 'center',
        gap: 8,
    },
    title: {
        fontSize: 34 / 2,
        fontWeight: '700',
    },
    price: {
        fontSize: 32 / 2,
        fontWeight: '700',
    },
    controls: {
        alignSelf: 'center',
        marginRight: 12,
        height: 40,
        minWidth: 110,
        borderRadius: 999,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: StyleSheet.hairlineWidth,
    },
    iconButton: {
        width: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        fontSize: 24 / 2,
        fontWeight: '700',
        minWidth: 16,
        textAlign: 'center',
    },
});

export default CartItem;
