import { useAppTheme } from "@/src/context/ThemeContext";
import { Order } from "@/src/types/order";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export function OrderItemList({ items }: { items: Order['order_items'] }) {
  const { colors: theme } = useAppTheme();

  if (!items || items.length === 0) {
    return <Text style={{ color: theme.muted }}>No items found.</Text>;
  }

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View 
          key={item.id} 
          style={[
            styles.itemRow, 
            index < items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.border }
          ]}
        >
          {item.product?.image ? (
             <Image 
               source={{ uri: item.product.image }} 
               style={[styles.image, { backgroundColor: theme.inputBg }]} 
               contentFit="cover"
             />
          ) : (
            <View style={[styles.image, { backgroundColor: theme.inputBg }]} />
          )}
          
          <View style={styles.info}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
              {item.product?.title || 'Unknown Product'}
            </Text>
            <Text style={[styles.quantity, { color: theme.muted }]}>
              Qty: {item.quantity}
            </Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: theme.text }]}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  quantity: {
    fontSize: 14,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
});
