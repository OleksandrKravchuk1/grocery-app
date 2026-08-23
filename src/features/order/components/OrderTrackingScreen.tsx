import { useTheme } from "@/src/constants/theme";
import { CourierRatingModal } from "@/src/features/order/components/CourierRatingModal";
import { useOrderTracking } from "@/src/features/order/hooks/useOrderTracking";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getStatusLabel } from "../utilities/orders";

export function OrderTrackingScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const {
    status,
    routeCoords,
    courierCoord,
    initialRegion,
    RESTAURANT_COORD,
    USER_COORD,
    isDelivered,
    isConfirmed,
    showRatingModal,
    rating,
    setRating,
    modalSlide,
    handleConfirm,
    handleGoBack,
  } = useOrderTracking();

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker coordinate={RESTAURANT_COORD} title="Restaurant" pinColor="red" />
        <Marker coordinate={USER_COORD} title="You" pinColor="blue" />

        <Marker.Animated
          coordinate={courierCoord as any}
          title={isDelivered ? 'Delivered here 🛵' : 'Courier'}
          pinColor="green"
          zIndex={2}
        />

        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor={isDelivered ? theme.muted : theme.accent}
            lineDashPattern={isDelivered ? [6, 4] : undefined}
          />
        )}
      </MapView>

      {/* Bottom panel: changes based on delivery state */}
      {!isConfirmed ? (
        <View style={[styles.bottomPanel, { backgroundColor: theme.card, paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.deliveryInfo}>
            <Text style={[styles.etaText, { color: isDelivered ? theme.accent : theme.text }]}>
              {isDelivered ? 'Delivered! 🎉' : '15-20 min.'}
            </Text>
            <Text style={[styles.statusText, { color: theme.muted }]}>
              {getStatusLabel(status)}
            </Text>
          </View>

          <View style={styles.courierProfile}>
            <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
            <View style={styles.courierDetails}>
              <Text style={[styles.courierName, { color: theme.text }]}>Nick</Text>
              <Text style={[styles.courierVehicle, { color: theme.muted }]}>Honda Dio • KA1234IK</Text>
            </View>

            {!isDelivered && (
              <Pressable style={[styles.callButton, { backgroundColor: theme.accent }]}>
                <Ionicons name="call" size={20} color="white" accessible={false} />
              </Pressable>
            )}
          </View>
        </View>
      ) : (
        <View style={[styles.bottomPanel, { backgroundColor: theme.card, paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.deliveredRow}>
            <Ionicons name="checkmark-circle" size={40} color={theme.accent} />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.etaText, { color: theme.text }]}>Order complete</Text>
              <Text style={[styles.statusText, { color: theme.muted }]}>
                {'⭐'.repeat(rating) || 'Not rated'}
              </Text>
            </View>
          </View>
          <Pressable style={[styles.doneButton, { backgroundColor: theme.accent }]} onPress={handleGoBack}>
            <Text style={styles.doneButtonText}>Back to orders</Text>
          </Pressable>
        </View>
      )}

      <CourierRatingModal
        visible={showRatingModal}
        rating={rating}
        modalSlide={modalSlide}
        onRate={setRating}
        onConfirm={handleConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  deliveryInfo: {
    marginBottom: 20,
  },
  etaText: {
    fontSize: 24,
    fontWeight: '800',
  },
  statusText: {
    fontSize: 16,
    marginTop: 4,
  },
  courierProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  courierDetails: {
    flex: 1,
    marginLeft: 12,
  },
  courierName: {
    fontSize: 16,
    fontWeight: '600',
  },
  courierVehicle: {
    fontSize: 14,
    marginTop: 2,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  doneButton: {
    padding: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
