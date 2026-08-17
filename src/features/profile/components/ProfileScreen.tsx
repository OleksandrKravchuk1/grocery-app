import { useTheme } from "@/src/constants/theme";
import { useAuth } from "@/src/features/auth/context/AuthContext";
import { useSignOut } from "@/src/features/auth/hooks/useSignOut";
import { useFavoriteProducts } from "@/src/features/favorites/hooks/useFavoriteProducts";
import { useOrders } from "@/src/features/order/hooks/useOrders";
import { useProfile } from "@/src/features/profile/hooks/useProfile";
import { ProfileHeader } from "@/src/features/profile/components/ProfileHeader";
import { ProfileMenuItem } from "@/src/features/profile/components/ProfileMenuItem";
import { ProfileStats } from "@/src/features/profile/components/ProfileStats";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const signOut = useSignOut();

  const { profileDefaults } = useProfile();
  const { favoriteIds } = useFavoriteProducts();
  const { data: orders } = useOrders();

  const ordersCount = orders?.length ?? 0;
  const favouritesCount = favoriteIds.length;
  const totalSpent = useMemo(() => {
    if (!orders || orders.length === 0) return 0;
    return orders.reduce((sum: number, order: any) => sum + (order.total_price ?? 0), 0);
  }, [orders]);

  const handleSignOut = () => {
    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: () => void signOut(),
        },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.screen }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: Platform.OS === "android" ? insets.top + 56 : 0, paddingBottom: insets.bottom + 24 },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      accessibilityLabel="Profile"
      accessibilityHint="View your profile information, statistics, and account actions"
    >
      {/* Header: Avatar + Name + Email */}
      <ProfileHeader
        firstName={profileDefaults.firstName}
        lastName={profileDefaults.lastName}
        email={user?.email ?? ""}
      />

      {/* Stats: Orders, Favourites, Spent */}
      <ProfileStats
        ordersCount={ordersCount}
        favouritesCount={favouritesCount}
        totalSpent={totalSpent}
      />

      {/* Menu Actions */}
      <View style={[styles.menuCard, { backgroundColor: theme.card, ...cardShadow }]}>
        <Text style={[styles.menuTitle, { color: theme.text }]} accessibilityRole="header">
          Account
        </Text>

        <ProfileMenuItem
          icon="person-outline"
          label="Edit Profile"
          onPress={() => router.push("/profile/edit" as any)}
        />
        <ProfileMenuItem
          icon="receipt-outline"
          label="Orders History"
          onPress={() => router.push("/menu/orders" as any)}
        />
        <ProfileMenuItem
          icon="card-outline"
          label="Payment Methods"
          onPress={() => router.push("/menu/payment" as any)}
        />
        <ProfileMenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => router.push("/menu/settings" as any)}
        />
        <ProfileMenuItem
          icon="help-buoy-outline"
          label="Support"
          onPress={() => router.push("/menu/support" as any)}
        />
      </View>

      {/* Sign Out */}
      <View style={[styles.menuCard, { backgroundColor: theme.card, ...cardShadow, marginTop: 12 }]}>
        <ProfileMenuItem
          icon="log-out-outline"
          label="Sign out"
          onPress={handleSignOut}
          danger
          showChevron={false}
        />
      </View>
    </ScrollView>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  android: {
    elevation: 3,
  },
  default: {},
}) as object;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 0,
  },
  menuCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
});
