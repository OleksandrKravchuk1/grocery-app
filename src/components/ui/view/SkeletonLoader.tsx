import { useAppTheme } from "@/src/context/ThemeContext";
import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type SkeletonLoaderProps = {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function SkeletonLoader({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const { colors: theme } = useAppTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[{ width: width as any, height, borderRadius }, style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            backgroundColor: theme.inputBg,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}

/** Pre-built skeleton patterns for common screen layouts */

export function SkeletonCard({ style }: { style?: ViewStyle }) {
  const { colors: theme } = useAppTheme();
  return (
    <View style={[skeletonStyles.card, { backgroundColor: theme.card }, style]}>
      <SkeletonLoader width="100%" height={16} borderRadius={6} />
      <SkeletonLoader width="70%" height={14} borderRadius={6} style={{ marginTop: 10 }} />
      <SkeletonLoader width="40%" height={14} borderRadius={6} style={{ marginTop: 10 }} />
    </View>
  );
}

export function SkeletonProductCard({ style }: { style?: ViewStyle }) {
  const { colors: theme } = useAppTheme();
  return (
    <View style={[skeletonStyles.productCard, { backgroundColor: theme.card }, style]}>
      <SkeletonLoader width="100%" height={120} borderRadius={12} />
      <SkeletonLoader width="80%" height={14} borderRadius={6} style={{ marginTop: 10 }} />
      <SkeletonLoader width="40%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
    </View>
  );
}

export function SkeletonProfileHeader() {
  const { colors: theme } = useAppTheme();
  return (
    <View style={[skeletonStyles.profileHeader, { backgroundColor: theme.card }]}>
      <SkeletonLoader width={80} height={80} borderRadius={40} />
      <SkeletonLoader width={160} height={18} borderRadius={6} style={{ marginTop: 14 }} />
      <SkeletonLoader width={200} height={14} borderRadius={6} style={{ marginTop: 8 }} />
    </View>
  );
}

export function SkeletonListItem() {
  const { colors: theme } = useAppTheme();
  return (
    <View style={[skeletonStyles.listItem, { borderBottomColor: theme.border }]}>
      <SkeletonLoader width={36} height={36} borderRadius={10} />
      <SkeletonLoader width="60%" height={16} borderRadius={6} />
    </View>
  );
}

export function SkeletonSettingsScreen() {
  const { colors: theme } = useAppTheme();
  return (
    <View style={[skeletonStyles.screenContainer, { backgroundColor: theme.screen }]}>
      <View style={[skeletonStyles.card, { backgroundColor: theme.card }]}>
        <SkeletonLoader width="40%" height={18} borderRadius={6} />
        <SkeletonLoader width="70%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
        <View style={skeletonStyles.themeRow}>
          <SkeletonLoader width="30%" height={60} borderRadius={14} />
          <SkeletonLoader width="30%" height={60} borderRadius={14} />
          <SkeletonLoader width="30%" height={60} borderRadius={14} />
        </View>
      </View>
      <View style={[skeletonStyles.card, { backgroundColor: theme.card, marginTop: 16 }]}>
        <SkeletonLoader width="50%" height={18} borderRadius={6} />
        <SkeletonListItem />
      </View>
      <View style={[skeletonStyles.card, { backgroundColor: theme.card, marginTop: 16 }]}>
        <SkeletonLoader width="35%" height={18} borderRadius={6} />
        <SkeletonListItem />
      </View>
    </View>
  );
}

export function SkeletonSupportScreen() {
  const { colors: theme } = useAppTheme();
  return (
    <View style={[skeletonStyles.screenContainer, { backgroundColor: theme.screen }]}>
      <View style={[skeletonStyles.card, { backgroundColor: theme.card }]}>
        <SkeletonLoader width="60%" height={18} borderRadius={6} />
        <SkeletonLoader width="45%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={[skeletonStyles.faqRow, { borderBottomColor: theme.border }]}>
            <SkeletonLoader width="85%" height={16} borderRadius={6} />
            <SkeletonLoader width={18} height={18} borderRadius={9} />
          </View>
        ))}
      </View>
      <View style={[skeletonStyles.card, { backgroundColor: theme.card, marginTop: 16 }]}>
        <SkeletonLoader width="40%" height={18} borderRadius={6} />
        <SkeletonLoader width="30%" height={14} borderRadius={6} style={{ marginTop: 16 }} />
        <SkeletonLoader width="100%" height={44} borderRadius={12} style={{ marginTop: 8 }} />
        <SkeletonLoader width="30%" height={14} borderRadius={6} style={{ marginTop: 16 }} />
        <SkeletonLoader width="100%" height={100} borderRadius={12} style={{ marginTop: 8 }} />
        <SkeletonLoader width="100%" height={48} borderRadius={12} style={{ marginTop: 16 }} />
      </View>
    </View>
  );
}

export function SkeletonOrderDetail() {
  const { colors: theme } = useAppTheme();
  return (
    <View style={[skeletonStyles.screenContainer, { backgroundColor: theme.screen }]}>
      {/* Header card */}
      <View style={[skeletonStyles.card, { backgroundColor: theme.card }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <SkeletonLoader width="50%" height={18} borderRadius={6} />
          <SkeletonLoader width={80} height={26} borderRadius={13} />
        </View>
        <SkeletonLoader width="35%" height={14} borderRadius={6} style={{ marginTop: 10 }} />
      </View>
      {/* Timeline card */}
      <View style={[skeletonStyles.card, { backgroundColor: theme.card, marginTop: 16 }]}>
        <SkeletonLoader width="40%" height={18} borderRadius={6} />
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 16 }}>
            <SkeletonLoader width={24} height={24} borderRadius={12} />
            <SkeletonLoader width="50%" height={14} borderRadius={6} />
          </View>
        ))}
      </View>
      {/* Items card */}
      <View style={[skeletonStyles.card, { backgroundColor: theme.card, marginTop: 16 }]}>
        <SkeletonLoader width="40%" height={18} borderRadius={6} />
        {[1, 2].map((i) => (
          <View key={i} style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
            <SkeletonLoader width={56} height={56} borderRadius={10} />
            <View style={{ flex: 1 }}>
              <SkeletonLoader width="70%" height={14} borderRadius={6} />
              <SkeletonLoader width="30%" height={14} borderRadius={6} style={{ marginTop: 8 }} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export function SkeletonHomeScreen() {
  const { colors: theme } = useAppTheme();
  return (
    <View style={[skeletonStyles.screenContainer, { backgroundColor: theme.screen }]}>
      {/* Address + Cart button */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 12 }}>
        <SkeletonLoader width="55%" height={20} borderRadius={6} />
        <SkeletonLoader width={40} height={40} borderRadius={20} />
      </View>
      {/* Banner */}
      <SkeletonLoader width="100%" height={160} borderRadius={16} style={{ marginTop: 20, marginHorizontal: 16 }} />
      {/* Categories */}
      <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: 20 }}>
        {[1, 2, 3, 4].map((i) => (
          <SkeletonLoader key={i} width={70} height={85} borderRadius={12} />
        ))}
      </View>
      {/* Product section */}
      <SkeletonLoader width="40%" height={20} borderRadius={6} style={{ marginTop: 24, marginLeft: 16 }} />
      <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 16, marginTop: 12 }}>
        {[1, 2].map((i) => (
          <SkeletonProductCard key={i} style={{ flex: 1 }} />
        ))}
      </View>
    </View>
  );
}

export function SkeletonOrdersList() {
  const { colors: theme } = useAppTheme();
  return (
    <View style={[skeletonStyles.screenContainer, { backgroundColor: theme.screen }]}>
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} style={{ marginBottom: 12 }} />
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  productCard: {
    borderRadius: 16,
    padding: 12,
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
});
