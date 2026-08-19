import { useTheme } from "@/src/constants/theme";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OfflineBanner() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { isConnected, isInternetReachable } = useNetworkStatus();
  const isOffline = !isConnected || !isInternetReachable;
  const prevOffline = useRef(false);

  const translateY = useSharedValue(-80);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isOffline) {
      translateY.value = withTiming(0, { duration: 350 });
      opacity.value = withTiming(1, { duration: 350 });

      // Only haptic on transition to offline
      if (!prevOffline.current) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      }
    } else {
      translateY.value = withTiming(-80, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
    prevOffline.current = isOffline;
  }, [isOffline, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + (Platform.OS === "android" ? 0 : 0),
          backgroundColor: "#FF6B6B",
        },
        animatedStyle,
      ]}
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLabel="No internet connection"
    >
      <Ionicons name="cloud-offline-outline" size={18} color="white" />
      <Text style={styles.text}>No Internet Connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
