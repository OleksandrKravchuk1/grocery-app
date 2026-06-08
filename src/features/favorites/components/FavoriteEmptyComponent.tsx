import { useTheme } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

export function FavoriteEmptyComponent() {
  const router = useRouter();
  const theme = useTheme();
  const isDark = useColorScheme() === "dark";

  const pingScale = useSharedValue(1);
  const pingOpacity = useSharedValue(0.4);

  useEffect(() => {
    pingScale.value = withRepeat(
      withTiming(1.4, { duration: 1500 }),
      -1,
      false
    );
    pingOpacity.value = withRepeat(
      withTiming(0, { duration: 1500 }),
      -1,
      false
    );
  }, []);

  const pingAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pingScale.value }],
      opacity: pingOpacity.value,
    };
  });

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.iconWrapper}>
        <Animated.View style={[styles.pingRing, isDark ? styles.pingRingDark : styles.pingRingLight, pingAnimatedStyle]} />
        <View style={[styles.iconContainer, isDark ? styles.iconContainerDark : styles.iconContainerLight]}>
          <Ionicons name="heart" size={44} color={isDark ? "#FF6B9E" : "#FF4D8D"} />
        </View>
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>No favorites yet</Text>
      <Text style={[styles.emptySubtitle, { color: theme.muted }]}>
        Tap the heart icon on any product to save it here for later.
      </Text>
      <Pressable
        style={[styles.exploreButton, { backgroundColor: theme.accent }]}
        onPress={() => router.replace("/(tabs)/home")}
        accessibilityRole="button"
        accessibilityLabel="Explore Products"
      >
        <Text style={styles.exploreButtonText}>Explore Products</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconWrapper: {
    position: "relative",
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  iconContainerLight: {
    backgroundColor: "#FFF0F5",
  },
  iconContainerDark: {
    backgroundColor: "rgba(80, 7, 36, 0.3)",
  },
  pingRing: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 48,
    zIndex: 1,
  },
  pingRingLight: {
    backgroundColor: "rgba(252, 231, 243, 0.4)",
  },
  pingRingDark: {
    backgroundColor: "rgba(131, 24, 67, 0.2)",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
})