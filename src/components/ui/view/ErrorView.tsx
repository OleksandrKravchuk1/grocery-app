import { useAppTheme } from "@/src/context/ThemeContext";
import { useShakeAnimation } from "@/src/hooks/animations/useShakeAnimation";
import { usePressAnimation } from "@/src/hooks/animations/usePressAnimation";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ErrorViewProps = {
  message?: string | null;
  onRetry?: () => void;
  isOffline?: boolean;
};

export function ErrorView({ message, onRetry, isOffline = false }: ErrorViewProps) {
  const { colors: theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { onPressIn, onPressOut, animatedStyle: buttonAnim } = usePressAnimation({});
  const { animatedStyle: shakeAnim } = useShakeAnimation();

  // Haptic on mount
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  }, []);

  const icon = isOffline ? (
    <Ionicons name="cloud-offline-outline" size={48} color={theme.muted} />
  ) : (
    <MaterialIcons name="error-outline" size={48} color={theme.danger} />
  );

  const title = isOffline ? "You're Offline" : "Something Went Wrong";
  const subtitle = isOffline
    ? "Check your internet connection and try again."
    : message || "An unexpected error occurred. Please try again.";

  return (
    <View style={[styles.centerContainer, { backgroundColor: theme.screen, marginTop: insets.top + 56 }]}>
      <Animated.View style={shakeAnim}>
        {icon}
      </Animated.View>
      <Text style={[styles.errorTitle, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.errorMessage, { color: theme.muted }]}>{subtitle}</Text>
      {onRetry && (
        <Animated.View style={buttonAnim}>
          <Pressable
            style={[styles.retryButton, { backgroundColor: theme.accent }]}
            onPress={onRetry}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            accessibilityRole="button"
            accessibilityLabel="Retry loading"
          >
            <Ionicons name="refresh-outline" size={18} color="white" />
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});