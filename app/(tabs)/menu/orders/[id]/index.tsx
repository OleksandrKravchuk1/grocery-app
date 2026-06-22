import { useTheme } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.screen }]}>
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.status, { color: theme.accent }]}>Preparing</Text>
          <Text style={[styles.details, { color: theme.muted }]}>Estimated delivery: 15-20 min</Text>
        </View>

        <Pressable
          style={[styles.trackButton, { backgroundColor: theme.accent }]}
          onPress={() => router.push(`/menu/orders/${id}/tracking` as any)}
        >
          <Ionicons name="map-outline" size={24} color="white" />
          <Text style={styles.trackButtonText}>Track Order</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    marginTop: 100,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  status: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  trackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
