import {useState} from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {FontAwesome6, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {colors} from "@/constants/colors";
import {PaymentOption} from "@/app/(tabs)/home/payment/components/PaymentOption";
import {
    formatCardNumber,
    formatCvc,
    formatExpiry,
    validateCardPaymentDetails,
} from "@/utilities/formatCard";
import {useCart} from "@/context/CartContext";
import {getCartSubtotal} from "@/utilities/cart";
import {useRouter} from "expo-router";

type PaymentMethod = "apple" | "card";

export default function PaymentScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const isDark = useColorScheme() === "dark";

    const {items, clearCart} = useCart();
    const total = getCartSubtotal(items);

    const [method, setMethod] = useState<PaymentMethod>("card");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");

    const theme = {
        screen: isDark ? colors.black : colors.screenLight,
        card: isDark ? colors.darkGrey : colors.white,
        text: isDark ? colors.white : colors.textLight,
        muted: isDark ? colors.mutedDark : colors.mutedLight,
        border: isDark ? colors.inputBorderDark : colors.inputBorderLight,
        inputBg: isDark ? colors.inputBgDark : colors.white,
        accent: colors.accent,
    };

    const cardValidationError = validateCardPaymentDetails({cardNumber, expiry, cvc, now: new Date()});
    const canPayCard = cardValidationError === null;

    const handleConfirmPress = () => {
        if (method === "apple") {
            Alert.alert("Success", "Payment successful!", [{text: "OK"}]);
            clearCart();
            router.dismissAll();
            return;
        }

        if (cardValidationError) {
            Alert.alert(cardValidationError.title, cardValidationError.message, [{text: "OK"}]);
            return;
        }

        Alert.alert("Success", "Payment successful!", [{text: "OK"}]);
        clearCart();
        router.dismissAll();
    };

    return (
        <View style={[styles.container, {backgroundColor: theme.screen}]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                    styles.content,
                    {paddingTop: insets.top + 56, paddingBottom: insets.bottom + 24},
                ]}
                accessibilityLabel="Payment"
                accessibilityHint="Choose how you want to pay and enter your card details if needed"
            >
                <PaymentOption
                    icon={<FontAwesome6 name="apple-pay" size={22} color={theme.text}/>}
                    label="Apple pay"
                    selected={method === "apple"}
                    onPress={() => setMethod("apple")}
                    theme={theme}
                />

                <PaymentOption
                    icon={<Ionicons name="card-outline" size={22} color={theme.text}/>}
                    label="Pay with card"
                    selected={method === "card"}
                    onPress={() => setMethod("card")}
                    theme={theme}
                />

                {method === "card" ? (
                    <View style={styles.form}>
                        <Text style={[styles.label, {color: theme.text}]}>Card number</Text>
                        <View style={[styles.inputWrap, {backgroundColor: theme.inputBg, borderColor: theme.border}]}>
                            <TextInput
                                value={cardNumber}
                                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                                placeholder="1234 5678 9012 3456"
                                placeholderTextColor={theme.muted}
                                keyboardType="number-pad"
                                style={[styles.input, {color: theme.text}]}
                                maxLength={19}
                                accessibilityLabel="Card number"
                                accessibilityHint="Enter your 16 digit card number"
                            />
                            <View style={styles.brandRow}>
                                <FontAwesome6 name="cc-mastercard" size={22} color="#EB001B" accessible={false}/>
                                <FontAwesome6 name="cc-visa" size={22} color="#1A1F71" accessible={false}/>
                                <FontAwesome6 name="cc-discover" size={22} color="#FF6000" accessible={false}/>
                                <FontAwesome6 name="cc-jcb" size={22} color="#0B4EA2" accessible={false}/>
                            </View>
                        </View>

                        <View style={styles.row}>
                            <View style={styles.flex1}>
                                <Text style={[styles.label, {color: theme.text}]}>Expiry</Text>
                                <View style={[styles.inputWrap, {
                                    backgroundColor: theme.inputBg,
                                    borderColor: theme.border
                                }]}>
                                    <TextInput
                                        value={expiry}
                                        onChangeText={(text) => setExpiry(formatExpiry(text))}
                                        placeholder="mm/yy"
                                        placeholderTextColor={theme.muted}
                                        keyboardType="number-pad"
                                        style={[styles.input, {color: theme.text}]}
                                        maxLength={5}
                                        accessibilityLabel="Expiry date"
                                        accessibilityHint="Enter the card expiration date in month and year"
                                    />
                                </View>
                            </View>

                            <View style={styles.flex1}>
                                <Text style={[styles.label, {color: theme.text}]}>CVC</Text>
                                <View style={[styles.inputWrap, {
                                    backgroundColor: theme.inputBg,
                                    borderColor: theme.border
                                }]}>
                                    <TextInput
                                        value={cvc}
                                        onChangeText={(text) => setCvc(formatCvc(text))}
                                        placeholder="***"
                                        placeholderTextColor={theme.muted}
                                        keyboardType="number-pad"
                                        secureTextEntry
                                        style={[styles.input, {color: theme.text}]}
                                        maxLength={4}
                                        accessibilityLabel="CVC"
                                        accessibilityHint="Enter the security code from your card"
                                    />
                                    <MaterialCommunityIcons name="credit-card-outline" size={20} color={theme.muted} accessible={false}/>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : null}

                <Pressable
                    style={[styles.confirmButton, {
                        backgroundColor:
                            method === "card" && !canPayCard ? "#C9C9C9" : theme.accent,
                    },
                    ]}
                    onPress={handleConfirmPress}
                    accessibilityRole="button"
                    accessibilityLabel={method === "card"
                        ? `Confirm and pay $${total.toFixed(2)}`
                        : `Pay with Apple Pay $${total.toFixed(2)}`}
                    accessibilityHint={method === "card"
                        ? "Confirms your card payment details and completes the order"
                        : "Completes the order with Apple Pay"}
                >
                    <Text style={styles.confirmText}>
                        {method === "card"
                            ? `Confirm and Pay ($${total.toFixed(2)})`
                            : `Pay with Apple Pay ($${total.toFixed(2)})`}
                    </Text>
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
    inputWrap: {
        minHeight: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
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
});
