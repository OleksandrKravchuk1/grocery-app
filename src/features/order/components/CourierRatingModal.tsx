import { useTheme } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CourierRatingModalProps {
  visible: boolean;
  rating: number;
  modalSlide: Animated.Value;
  onRate: (star: number) => void;
  onConfirm: () => void;
}

export function CourierRatingModal({ visible, rating, modalSlide, onRate, onConfirm }: CourierRatingModalProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.ratingSheet,
            {
              backgroundColor: theme.card,
              paddingBottom: insets.bottom + 24,
              transform: [{ translateY: modalSlide }],
            },
          ]}
        >
          <Text style={[styles.ratingTitle, { color: theme.text }]}>Your order arrived! 🎉</Text>
          <Text style={[styles.ratingSubtitle, { color: theme.muted }]}>How was Nick?</Text>

          <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.ratingAvatar} />

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => onRate(star)} style={styles.starBtn}>
                <Ionicons
                  name={rating >= star ? 'star' : 'star-outline'}
                  size={36}
                  color={rating >= star ? '#FFB800' : theme.muted}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            style={[styles.confirmButton, { backgroundColor: theme.accent }]}
            onPress={onConfirm}
          >
            <Text style={styles.confirmButtonText}>{rating > 0 ? 'Submit & Done' : 'Skip'}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  ratingSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 32,
    alignItems: 'center',
  },
  ratingTitle: { fontSize: 24, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  ratingSubtitle: { fontSize: 16, marginBottom: 24, textAlign: 'center' },
  ratingAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 24 },
  starsRow: { flexDirection: 'row', marginBottom: 24, gap: 8 },
  starBtn: { padding: 4 },
  confirmButton: { padding: 16, borderRadius: 100, alignItems: 'center', width: '100%' },
  confirmButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
