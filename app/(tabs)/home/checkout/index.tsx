import {useEffect, useState} from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    useColorScheme,
    View
} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {SectionTitle} from "@/components/ui/SectionTitle";
import {DeliveryRow} from "@/components/ui/row/DeliveryRow";
import {Row} from "@/components/ui/row/Row";
import {useLocation} from "@/context/LocationContext";
import {useAuth} from "@/context/AuthContext";
import {useCart} from "@/context/CartContext";
import {colors} from "@/constants/colors";
import {Profile} from "@/types/profile";
import {getProfiles} from "@/db/profiles";
import {FontAwesome6, MaterialCommunityIcons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {getCartItemCount, getCartSubtotal} from "@/utilities/cart";

type DeliveryType = 'priority' | 'standard';

const BAG_FEE = 0.25;
const SERVICE_FEE_PERCENT = 0.10;
const DELIVERY_FEES = {
    priority: 0.00,
    standard: 0.00,
};

export default function CheckoutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const {address} = useLocation();
    const {user} = useAuth();
    const {items} = useCart();

    const [deliveryType, setDeliveryType] = useState<DeliveryType>('priority');
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [invoiceRequested, setInvoiceRequested] = useState(false);

    const theme = {
        screen: isDark ? colors.black : colors.screenLight,
        card: isDark ? colors.darkGrey : colors.white,
        text: isDark ? colors.white : colors.textLight,
        muted: isDark ? colors.mutedDark : colors.mutedLight,
        border: isDark ? colors.inputBorderDark : colors.inputBorderLight,
        accent: colors.accent,
    };

    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getProfiles(user.id);
                setProfile(data);
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        };

        void loadProfile();
    }, [user?.id]);

    const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'User';
    const phone = profile?.phone || 'No phone';

    const subtotal = getCartSubtotal(items);
    const totalItems = getCartItemCount(items);
    const serviceFee = subtotal * SERVICE_FEE_PERCENT;
    const deliveryFee = DELIVERY_FEES[deliveryType];
    const total = subtotal + BAG_FEE + serviceFee + deliveryFee;

    if (loading) {
        return (
            <View style={[styles.container, {backgroundColor: theme.screen}]}>
                <ActivityIndicator size="large" color={theme.accent} accessibilityLabel="Loading checkout details"/>
            </View>
        );
    }


    //TODO add text input for product amount
    return (
        <ScrollView
            style={[styles.container, {backgroundColor: theme.screen}]}
            contentContainerStyle={[
                styles.content,
                {paddingTop: insets.top + 56, paddingBottom: insets.bottom + 20},
            ]}
            showsVerticalScrollIndicator={false}
            accessibilityLabel="Checkout"
            accessibilityHint="Review your details, choose delivery and payment, then continue"
        >
            <SectionTitle title="Details" color={theme.text}/>
            <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
                <Row icon="person-outline" label={fullName} color={theme.text} borderColor={theme.border}/>
                <Row icon="call-outline" label={phone} color={theme.text}/>
            </View>

            <SectionTitle title="Address" color={theme.text}/>
            <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
                <Row
                    icon="location-outline"
                    label="Apartment 609"
                    subtitle={address === "Your Address..." ? "45 Soho loop street birmingham.." : address}
                    color={theme.text}
                />
            </View>

            <SectionTitle title="Have coupon?" color={theme.text}/>
            <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
                <Row icon="pricetag-outline" label="Apply Coupon" color={theme.text}/>
            </View>

            <SectionTitle title="Delivery" color={theme.text}/>
            <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
                <DeliveryRow
                    icon="receipt-outline"
                    label="Priority (10 - 20 mins)"
                    selected={deliveryType === "priority"}
                    onPress={() => setDeliveryType("priority")}
                    color={theme.text}
                    borderColor={theme.border}
                    accent={theme.accent}
                />
                <DeliveryRow
                    icon="bicycle-outline"
                    label="Standard (30 - 45 mins)"
                    selected={deliveryType === "standard"}
                    onPress={() => setDeliveryType("standard")}
                    color={theme.text}
                    borderColor={theme.border}
                    accent={theme.accent}
                />
                <Row icon="time-outline" label="Schedule" color={theme.text}/>
            </View>

            <SectionTitle title={`Order Summary (${totalItems} items)`} color={theme.text}/>
            <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, {color: theme.muted}]}>Subtotal</Text>
                    <Text style={[styles.summaryValue, {color: theme.text}]}>${subtotal.toFixed(2)}</Text>
                </View>

                <View style={[styles.summaryRow, {borderTopColor: theme.border, borderTopWidth: 1}]}>
                    <Text style={[styles.summaryLabel, {color: theme.muted}]}>Bag fee</Text>
                    <Text style={[styles.summaryValue, {color: theme.text}]}>${BAG_FEE.toFixed(2)}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, {color: theme.muted}]}>Service fee</Text>
                    <Text style={[styles.summaryValue, {color: theme.text}]}>${serviceFee.toFixed(2)}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, {color: theme.muted}]}>Delivery</Text>
                    <Text style={[styles.summaryValue, {color: theme.text}]}>${deliveryFee.toFixed(2)}</Text>
                </View>

                <View style={[styles.summaryRow, {borderTopColor: theme.border, borderTopWidth: 1}]}>
                    <Text style={[styles.summaryLabel, {color: theme.text, fontWeight: '600'}]}>Total</Text>
                    <Text style={[styles.summaryTotal, {color: theme.accent}]}>${total.toFixed(2)}</Text>
                </View>
            </View>

            {/* REQUEST INVOICE */}
            <View style={[styles.invoiceRow, {backgroundColor: theme.card, borderColor: theme.border}]}>
                <Text style={[styles.invoiceLabel, {color: theme.text}]}>Request an invoice</Text>
                <Switch
                    value={invoiceRequested}
                    onValueChange={setInvoiceRequested}
                    trackColor={{false: theme.border, true: theme.accent}}
                    thumbColor={invoiceRequested ? colors.white : colors.white}
                    accessibilityRole="switch"
                    accessibilityLabel="Request an invoice"
                    accessibilityHint="Toggles whether you want an invoice for this order"
                />
            </View>

            {/* PAYMENT METHOD */}
            <SectionTitle title="Payment method" color={theme.text}/>
            <View style={[styles.card, {backgroundColor: theme.card, borderColor: theme.border}]}>
                <Pressable
                    style={styles.paymentRow}
                    onPress={() => router.push('/home/payment')}
                    accessibilityRole="button"
                    accessibilityLabel="Payment method"
                    accessibilityHint="Opens payment method selection"
                >
                    <View style={styles.paymentIcon}>
                        <FontAwesome6 name="apple-pay" size={24} color={theme.text} accessible={false}/>
                    </View>
                    <Text style={[styles.paymentLabel, {color: theme.text}]}>Apple pay</Text>
                    <MaterialCommunityIcons name="chevron-right" size={24} color={theme.text} accessible={false}/>
                </Pressable>
            </View>


            <Pressable
                style={[styles.placeOrderButton, {backgroundColor: theme.accent}]}
                onPress={() => router.push('/home/payment')}
                accessibilityRole="button"
                accessibilityLabel="Continue to payment"
                accessibilityHint="Opens the payment screen to complete your order"
            >
                <Text style={styles.placeOrderText}>Continue to payment</Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 16,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 16,
        overflow: "hidden",
    },
    placeOrderButton: {
        minHeight: 52,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 2,
    },
    placeOrderText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "700",
    },
    summaryRow: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 16,
        fontWeight: '400',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    summaryTotal: {
        fontSize: 18,
        fontWeight: '700',
    },
    invoiceRow: {
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    invoiceLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    paymentRow: {
        minHeight: 56,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentLabel: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
});