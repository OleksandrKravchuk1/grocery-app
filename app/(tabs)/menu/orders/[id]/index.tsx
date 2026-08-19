import { LoadingView } from "@/components/ui/view/LoadingView";
import { useTheme } from "@/src/constants/theme";
import { OrderItemList } from "@/src/features/order/components/OrderItemList";
import { OrderTimeline } from "@/src/features/order/components/OrderTimeline";
import { useOrder } from "@/src/features/order/hooks/useOrder";
import { formatDate, getStatusColor } from "@/src/features/order/utilities/orders";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const segments = useSegments();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading) return <LoadingView />;
  if (isError || !order) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.screen }]}>
        <Text style={{ color: theme.danger }}>Error loading order details</Text>
      </View>
    );
  }

  const mockAddress = "123 Main St, Apt 4B, New York, NY 10001";
  const mockPayment = "Apple Pay";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.screen }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === 'android' ? insets.top + 56 : 16, paddingBottom: insets.bottom + 24 }
      ]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.headerCard, { backgroundColor: theme.card, ...cardShadow }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.orderId, { color: theme.text }]}>Order #{order.id.toString().slice(0, 8)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status, theme) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(order.status, theme) }]}>
              {order.status?.charAt(0).toUpperCase() + order.status?.slice(1).toLowerCase()}
            </Text>
          </View>
        </View>
        <Text style={[styles.orderDate, { color: theme.muted }]}>{formatDate(order.created_at)}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Track Order</Text>
        <OrderTimeline status={order.status} />

        {order.status !== 'cancelled' && order.status !== 'completed' && (
          <Pressable
            style={[styles.trackButton, { backgroundColor: theme.accent }]}
            onPress={() => {
              const tabRoot = segments[1] === "profile" ? "profile" : "menu";
              router.push(`/${tabRoot}/orders/${id}/tracking` as any);
            }}
          >
            <Ionicons name="map-outline" size={20} color="white" />
            <Text style={styles.trackButtonText}>Live Tracking</Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Delivery Address</Text>
        <View style={styles.infoRow}>
          <View style={[styles.iconWrap, { backgroundColor: `${theme.accent}15` }]}>
            <Ionicons name="location-outline" size={20} color={theme.accent} />
          </View>
          <Text style={[styles.infoText, { color: theme.text }]}>{mockAddress}</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Payment Method</Text>
        <View style={styles.infoRow}>
          <View style={[styles.iconWrap, { backgroundColor: `${theme.accent}15` }]}>
            <Ionicons name="card-outline" size={20} color={theme.accent} />
          </View>
          <Text style={[styles.infoText, { color: theme.text }]}>{mockPayment}</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Order Items</Text>
        <OrderItemList items={order.order_items} />

        <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.text }]}>${order.total_price.toFixed(2)}</Text>
        </View>
      </View>

    </ScrollView>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  android: {
    elevation: 2,
  },
  default: {},
}) as object;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  headerCard: {
    padding: 16,
    borderRadius: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
  },
  card: {
    padding: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  trackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
});
