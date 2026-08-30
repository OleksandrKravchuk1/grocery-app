import { useAppTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { usePulseAnimation } from "@/src/hooks/animations/usePulseAnimation";

type Props = {
  firstName: string;
  lastName: string;
  email: string;
};

function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0).toUpperCase();
  const last = lastName.trim().charAt(0).toUpperCase();
  if (first && last) return `${first}${last}`;
  if (first) return first;
  return "";
}

export function ProfileHeader({ firstName, lastName, email }: Props) {
  const { colors: theme } = useAppTheme();
  const { ring1Style, ring2Style } = usePulseAnimation();
  const initials = getInitials(firstName, lastName);
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return (
    <View style={styles.container}>
      {/* Avatar with pulse rings */}
      <View style={styles.avatarWrap}>
        <Animated.View style={[styles.pulseRing, ring2Style, { borderColor: theme.accent }]} />
        <Animated.View style={[styles.pulseRing, ring1Style, { borderColor: theme.accent }]} />
        <View style={[styles.avatarCircle, { backgroundColor: `${theme.accent}18`, borderColor: theme.accent }]}>
          {initials ? (
            <Text style={[styles.initials, { color: theme.accent }]}>{initials}</Text>
          ) : (
            <Ionicons name="person" size={40} color={theme.accent} accessible={false} />
          )}
        </View>
      </View>

      {/* Name & email */}
      <Text style={[styles.name, { color: theme.text }]} accessibilityRole="header">
        {fullName || "User"}
      </Text>
      <Text style={[styles.email, { color: theme.muted }]} numberOfLines={1}>
        {email || "No email"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 24 : 16,
    paddingBottom: 20,
  },
  avatarWrap: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  pulseRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
});
