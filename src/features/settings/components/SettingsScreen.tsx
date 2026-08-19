import { useTheme } from "@/src/constants/theme";
import { ThemeMode, useThemeMode } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import React, { useCallback, useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NOTIFICATIONS_KEY = "@notifications_enabled";

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "system", label: "System", icon: "phone-portrait-outline" },
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon-outline" },
];

export function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { themeMode, setThemeMode } = useThemeMode();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Load notification preference
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        if (stored !== null) setNotificationsEnabled(stored === "true");
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleNotificationToggle = useCallback(
    (value: boolean) => {
      setNotificationsEnabled(value);
      AsyncStorage.setItem(NOTIFICATIONS_KEY, String(value)).catch(() => {});
    },
    [],
  );

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.screen }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Platform.OS === "android" ? insets.top + 56 : 16,
          paddingBottom: insets.bottom + 24,
        },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Appearance ─── */}
      <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.muted }]}>
          Choose how Grabber looks to you
        </Text>

        <View style={styles.themeRow}>
          {THEME_OPTIONS.map((opt) => {
            const isActive = themeMode === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setThemeMode(opt.value)}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: isActive ? `${theme.accent}15` : theme.inputBg,
                    borderColor: isActive ? theme.accent : theme.border,
                  },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${opt.label} theme`}
              >
                <Ionicons
                  name={opt.icon as any}
                  size={22}
                  color={isActive ? theme.accent : theme.muted}
                />
                <Text
                  style={[
                    styles.themeLabel,
                    { color: isActive ? theme.accent : theme.text, fontWeight: isActive ? "700" : "500" },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ─── Notifications ─── */}
      <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>

        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <View style={[styles.iconWrap, { backgroundColor: `${theme.accent}15` }]}>
              <Ionicons name="notifications-outline" size={20} color={theme.accent} />
            </View>
            <View style={styles.toggleText}>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>Push Notifications</Text>
              <Text style={[styles.toggleDesc, { color: theme.muted }]}>
                Get updates about your orders
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: theme.border, true: `${theme.accent}80` }}
            thumbColor={notificationsEnabled ? theme.accent : theme.muted}
            accessibilityLabel="Toggle push notifications"
          />
        </View>
      </View>

      {/* ─── Language ─── */}
      <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Language</Text>

        <View style={styles.infoRow}>
          <View style={[styles.iconWrap, { backgroundColor: `${theme.accent}15` }]}>
            <Ionicons name="language-outline" size={20} color={theme.accent} />
          </View>
          <View style={styles.infoContent}>
            <Text style={[styles.infoLabel, { color: theme.text }]}>App Language</Text>
            <Text style={[styles.infoValue, { color: theme.muted }]}>English</Text>
          </View>
        </View>
      </View>

      {/* ─── About ─── */}
      <View style={[styles.card, { backgroundColor: theme.card, ...cardShadow }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>

        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: theme.text }]}>Version</Text>
          <Text style={[styles.aboutValue, { color: theme.muted }]}>{appVersion}</Text>
        </View>
        <View style={[styles.aboutRow, { borderBottomWidth: 0 }]}>
          <Text style={[styles.aboutLabel, { color: theme.text }]}>Build</Text>
          <Text style={[styles.aboutValue, { color: theme.muted }]}>
            {Constants.expoConfig?.extra?.buildNumber ?? "1"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  android: {
    elevation: 2,
  },
  default: {},
}) as object;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },

  /* ── Theme selector ── */
  themeRow: {
    flexDirection: "row",
    gap: 10,
  },
  themeOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    gap: 8,
  },
  themeLabel: {
    fontSize: 14,
  },

  /* ── Toggle row ── */
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  toggleInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  toggleText: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  toggleDesc: {
    fontSize: 13,
    marginTop: 2,
  },

  /* ── Info row ── */
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    marginTop: 2,
  },

  /* ── About ── */
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  aboutLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  aboutValue: {
    fontSize: 15,
  },
});
