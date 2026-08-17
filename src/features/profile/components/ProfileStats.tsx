import { useTheme } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type StatItem = {
  icon: ComponentProps<typeof Ionicons>["name"];
  value: string;
  label: string;
};

type Props = {
  ordersCount: number;
  favouritesCount: number;
  totalSpent: number;
};

export function ProfileStats({ ordersCount, favouritesCount, totalSpent }: Props) {
  const theme = useTheme();

  const stats: StatItem[] = [
    {
      icon: "receipt-outline",
      value: ordersCount.toString(),
      label: "Orders",
    },
    {
      icon: "heart-outline",
      value: favouritesCount.toString(),
      label: "Favourites",
    },
    {
      icon: "wallet-outline",
      value: `$${totalSpent.toFixed(0)}`,
      label: "Spent",
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat) => (
        <View
          key={stat.label}
          style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}
          accessibilityLabel={`${stat.label}: ${stat.value}`}
        >
          <Ionicons name={stat.icon} size={22} color={theme.accent} accessible={false} />
          <Text style={[styles.value, { color: theme.text }]}>{stat.value}</Text>
          <Text style={[styles.label, { color: theme.muted }]}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  android: {
    elevation: 2,
  },
  default: {},
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
});
