import { useLocation } from "@/context/LocationContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { AnimatedRegion } from "react-native-maps";
import { DEFAULT_USER_COORD, RESTAURANT_COORD } from "../constants/order";
import { fetchRoute, LatLng } from "../services/routing";
import { useDeliveryStatus } from "./useDeliveryStatus.query";

export function useOrderTracking() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const orderId = Number(id);

  const { coords } = useLocation();
  const USER_COORD = coords ?? DEFAULT_USER_COORD;

  const initialRegion = {
    latitude: (RESTAURANT_COORD.latitude + USER_COORD.latitude) / 2,
    longitude: (RESTAURANT_COORD.longitude + USER_COORD.longitude) / 2,
    latitudeDelta: Math.abs(RESTAURANT_COORD.latitude - USER_COORD.latitude) * 2.5 + 0.02,
    longitudeDelta: Math.abs(RESTAURANT_COORD.longitude - USER_COORD.longitude) * 2.5 + 0.02,
  };

  const { data: delivery } = useDeliveryStatus(orderId);

  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const modalSlide = useRef(new Animated.Value(300)).current;

  const courierCoord = useRef(
    new AnimatedRegion({
      ...RESTAURANT_COORD,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    })
  ).current;

  useEffect(() => {
    async function loadRoute() {
      const points = await fetchRoute(RESTAURANT_COORD, USER_COORD);
      setRouteCoords(points);
    }
    loadRoute();
  }, [USER_COORD.latitude, USER_COORD.longitude]);

  useEffect(() => {
    if (delivery?.location) {
      courierCoord.timing({
        latitude: delivery.location.latitude,
        longitude: delivery.location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
        duration: 2500,
        useNativeDriver: false,
        toValue: 0,
      } as any).start();
    }

    if (delivery?.status === 'delivered') {
      setShowRatingModal(true);
      Animated.spring(modalSlide, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [delivery?.location?.latitude, delivery?.location?.longitude, delivery?.status]);

  function handleConfirm() {
    setIsConfirmed(true);
    setShowRatingModal(false);
  }

  function handleGoBack() {
    router.back();
  }

  return {
    orderId,
    status: delivery?.status ?? 'pending',
    isDelivered: delivery?.status === 'delivered',
    routeCoords,
    courierCoord,
    initialRegion,
    RESTAURANT_COORD,
    USER_COORD,
    isConfirmed,
    showRatingModal,
    rating,
    setRating,
    modalSlide,
    handleConfirm,
    handleGoBack,
  };
}
