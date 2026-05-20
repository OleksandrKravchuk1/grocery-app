import React from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Separator } from "@/components/ui/Separator";
import { useTheme } from "@/constants/theme";
import { useOrders } from "@/hooks/useOrders";
import { formatDate, getStatusColor } from "@/utilities/orders";
import { Order } from '@/types/order';

export default function OrdersScreen() {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const { data: orders = [], isLoading, error, refetch } = useOrders();

    const renderOrderCard = ({ item }: { item: Order }) => (
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

    const renderError = () => {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.screen }]}>
                <MaterialIcons name="error-outline" size={48} color={theme.danger} />
                <Text style={[styles.errorText, { color: theme.text }]}>Error</Text>
                <Text style={[styles.errorMessage, { color: theme.muted }]}>
                    {error instanceof Error ? error.message : 'Failed to load orders. Please try again.'}
                </Text>
                <Pressable
                    style={[styles.retryButton, { backgroundColor: theme.accent }]}
                    onPress={() => refetch()}
                >
                    <Text style={styles.retryText}>Try Again</Text>
                </Pressable>
            </View>
        )
    };

    const renderLoading = () => {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.screen }]}>
                <ActivityIndicator size="large" color={theme.accent} />
                <Text style={[styles.loadingText, { color: theme.muted }]}>
                    Loading orders...
                </Text>
            </View>
        );
    };

    const renderEmpty = () => {
        return (
            <View style={[styles.centerContainer, { backgroundColor: theme.screen }]}>
                <MaterialIcons name="shopping-bag" size={64} color={theme.muted} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No Orders Yet</Text>
                <Text style={[styles.emptyMessage, { color: theme.muted }]}>
                    Start shopping to place your first order
                </Text>
            </View>
        );
    }

    if (error) {
        return renderError();
    }

    if (isLoading) {
        return renderLoading();
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.screen }]}>
            <FlatList
                data={orders}
                renderItem={renderOrderCard}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
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
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    errorText: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
    },
    errorMessage: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
    },
    emptyMessage: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    shopButton: {
        marginTop: 24,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 8,
    },
    shopButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
