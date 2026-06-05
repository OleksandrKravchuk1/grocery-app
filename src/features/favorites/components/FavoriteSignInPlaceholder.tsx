import { colors } from "@/src/constants/colors";
import { useTheme } from "@/src/constants/theme";
import { usePressAnimation } from "@/src/hooks/animations/usePressAnimation";
import { usePulseAnimation } from "@/src/hooks/animations/usePulseAnimation";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

type Props = {
  onSignInPress: () => void;
};

export function FavoriteSignInPlaceholder({ onSignInPress }: Props) {
  const theme = useTheme();
  const { animatedStyle: buttonAnimatedStyle, onPressIn, onPressOut } = usePressAnimation({});
  const { ring1Style, ring2Style } = usePulseAnimation();

  return (
    <View style={[styles.container, { backgroundColor: theme.screen }]}>
      <View style={styles.artworkContainer}>
        <Animated.View style={[styles.pulseRing, ring2Style, { borderColor: colors.favouriteActive }]} />
        <Animated.View style={[styles.pulseRing, ring1Style, { borderColor: colors.favouriteActive }]} />

        <View style={[styles.centerCircle, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="heart" size={54} color={colors.favouriteActive} />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]} accessibilityRole="header">
          Save the things you love
        </Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Create your personal wishlist! Simply tap the heart icon on any product to save it here for later.
        </Text>
      </View>

      <Animated.View style={[styles.buttonWrapper, buttonAnimatedStyle]}>
        <Pressable
          onPress={onSignInPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[styles.button, { backgroundColor: theme.accent }]}
          accessibilityRole="button"
          accessibilityLabel="Sign in to save favorites"
          accessibilityHint="Navigates to the sign in form"
        >
          <Text style={styles.buttonText}>Sign In / Register</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  artworkContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  pulseRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
  },
  centerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 36,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  buttonWrapper: {
    width: "100%",
  },
  button: {
    width: "100%",
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
