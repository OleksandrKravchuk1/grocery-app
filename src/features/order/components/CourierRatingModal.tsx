import { useAppTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CourierRatingModalProps {
  visible: boolean;
  rating: number;
  modalSlide: Animated.Value;
  onRate: (star: number) => void;
  onConfirm: () => void;
}

export function CourierRatingModal({
  visible,
  rating,
  modalSlide,
  onRate,
  onConfirm,
}: CourierRatingModalProps) {
  const { colors: theme } = useAppTheme();
  const insets = useSafeAreaInsets();

  const starScales = useRef([1, 2, 3, 4, 5].map(() => new Animated.Value(1))).current;

  function handleRate(star: number) {
    onRate(star);
    Animated.sequence([
      Animated.spring(starScales[star - 1], {
        toValue: 1.4,
        useNativeDriver: true,
        speed: 40,
      }),
      Animated.spring(starScales[star - 1], {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start();
  }

  const ratingLabels = ['', 'Terrible', 'Bad', 'Okay', 'Good', 'Excellent!'];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.card,
              paddingBottom: insets.bottom + 32,
              transform: [{ translateY: modalSlide }],
            },
          ]}
        >
          {/* Drag handle */}
          <View style={[styles.handle, { backgroundColor: theme.muted + '40' }]} />

          {/* Celebration badge */}
          <View style={[styles.badge, { backgroundColor: theme.accent + '18' }]}>
            <Text style={styles.badgeEmoji}>🎉</Text>
            <Text style={[styles.badgeText, { color: theme.accent }]}>Order Delivered!</Text>
          </View>

          {/* Courier card */}
          <View style={[styles.courierCard, { backgroundColor: theme.screen }]}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/200?img=33' }}
              style={styles.avatar}
            />
            <View style={styles.courierInfo}>
              <Text style={[styles.courierName, { color: theme.text }]}>Nick Delivery</Text>
              <View style={styles.vehicleRow}>
                <Ionicons name="bicycle-outline" size={14} color={theme.muted} />
                <Text style={[styles.vehicleText, { color: theme.muted }]}>Honda Dio • KA1234IK</Text>
              </View>
            </View>
            <View style={[styles.checkBadge, { backgroundColor: theme.accent }]}>
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          </View>

          {/* Rating prompt */}
          <Text style={[styles.ratePrompt, { color: theme.text }]}>
            How was your delivery?
          </Text>
          <Text style={[styles.rateLabel, { color: rating > 0 ? '#FFB800' : theme.muted }]}>
            {rating > 0 ? ratingLabels[rating] : 'Tap a star to rate'}
          </Text>

          {/* Stars */}
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => handleRate(star)}>
                <Animated.View style={{ transform: [{ scale: starScales[star - 1] }] }}>
                  <Ionicons
                    name={rating >= star ? 'star' : 'star-outline'}
                    size={40}
                    color={rating >= star ? '#FFB800' : theme.muted + '60'}
                  />
                </Animated.View>
              </Pressable>
            ))}
          </View>

          {/* Confirm button */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: theme.accent, opacity: pressed ? 0.85 : 1 },
            ]}
            onPress={onConfirm}
          >
            <Text style={styles.buttonText}>
              {rating > 0 ? `Submit ${ratingLabels[rating]} Rating` : 'Skip'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    marginBottom: 24,
  },
  badgeEmoji: { fontSize: 16 },
  badgeText: { fontSize: 14, fontWeight: '700' },
  courierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 28,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  courierInfo: { flex: 1 },
  courierName: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  vehicleText: { fontSize: 13 },
  checkBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratePrompt: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  button: {
    width: '100%',
    padding: 18,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
