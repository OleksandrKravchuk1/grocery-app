import { useAppTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function LoadingView({ accessibilityLabel = "Loading" }: { accessibilityLabel?: string }) {
  const { colors: theme } = useAppTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 600 }),
        withTiming(1, { duration: 600 }),
      ),
      -1,
      false,
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.6, { duration: 600 }),
      ),
      -1,
      false,
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: theme.screen }]}
      accessibilityLabel={accessibilityLabel}
    >
      <Animated.View style={[styles.iconWrap, { backgroundColor: `${theme.accent}15` }, animatedStyle]}>
        <Ionicons name="leaf-outline" size={32} color={theme.accent} />
      </Animated.View>
      <Text style={[styles.loadingText, { color: theme.muted }]}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: "500",
  },
});