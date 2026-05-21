import { Order } from "@/types/order";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Separator } from "./ui/Separator";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/constants/theme";
import { formatDate, getStatusColor } from "@/utilities/orders";

export const OrderCard = ({ item }: { item: Order }) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    return (
        <Pressable
            style={({ pressed }) => [
                styles.orderCard,
                {
                    backgroundColor: theme.card,
                    opacity: pressed ? 0.8 : 1,
                    marginTop: insets.top + 56
                },
            ]}
            onPress={() => router.push(`/menu/orders/${item.id}` as any)}
        >
            <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                    <Text style={[styles.orderId, { color: theme.text }]}>
                        Order #{item.id.toString().slice(0, 8)}
                    </Text>
                    <Text style={[styles.orderDate, { color: theme.muted }]}>
                        {formatDate(item.created_at)}
                    </Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) + '20' },
                    ]}
                >
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status?.charAt(0).toUpperCase() + item.status?.slice(1).toLowerCase()}
                    </Text>
                </View>
            </View>

            <Separator />

            <View style={styles.orderContent}>
                <Text style={[styles.itemCount, { color: theme.muted }]}>
                    {item.order_items?.length || 0} item{item.order_items?.length !== 1 ? 's' : ''}
                </Text>
                <Text style={[styles.totalPrice, { color: theme.text }]}>
                    ${item.total_price.toFixed(2)}
                </Text>
            </View>

            <View style={styles.actionRow}>
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.muted}
                    accessible={false}
                />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    orderCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    orderInfo: {
        flex: 1,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    orderDate: {
        fontSize: 12,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    orderContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemCount: {
        fontSize: 13,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '700',
    },
    actionRow: {
        alignItems: 'flex-end',
    },
});