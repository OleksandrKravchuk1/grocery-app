import { useLocation } from "@/context/LocationContext";
import { fetchRoute, LatLng } from "@/src/features/order/services/routing";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { AnimatedRegion } from "react-native-maps";

const RESTAURANT_COORD = { latitude: 50.4501, longitude: 30.5234 };
const DEFAULT_USER_COORD = { latitude: 50.4550, longitude: 30.5300 };

export function useOrderTracking() {
  const router = useRouter();
  const { coords } = useLocation();
  console.log('[useOrderTracking] coords from context:', coords);
  const USER_COORD = coords ?? DEFAULT_USER_COORD;

  // Center the map midway between restaurant and user, fitting both markers
  const INITIAL_REGION = {
    latitude: (RESTAURANT_COORD.latitude + USER_COORD.latitude) / 2,
    longitude: (RESTAURANT_COORD.longitude + USER_COORD.longitude) / 2,
    latitudeDelta: Math.abs(RESTAURANT_COORD.latitude - USER_COORD.latitude) * 2.5 + 0.02,
    longitudeDelta: Math.abs(RESTAURANT_COORD.longitude - USER_COORD.longitude) * 2.5 + 0.02,
  };

  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [isDelivered, setIsDelivered] = useState(false);
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
    let isCancelled = false;

    async function loadRouteAndAnimate() {
      const routePoints = await fetchRoute(RESTAURANT_COORD, USER_COORD);
      if (isCancelled) return;

      setRouteCoords(routePoints);

      if (routePoints.length > 0) {
        const durationPerSegment = 50000 / routePoints.length;

        let i = 0;
        function moveToNext() {
          if (isCancelled || i >= routePoints.length) return;
          const nextCoord = routePoints[i];

          courierCoord.timing({
            latitude: nextCoord.latitude,
            longitude: nextCoord.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
            duration: durationPerSegment,
            useNativeDriver: false,
            toValue: 0,
          } as any).start(({ finished }) => {
            if (finished) {
              i++;
              if (i >= routePoints.length) {
                if (!isCancelled) {
                  setIsDelivered(true);
                  setShowRatingModal(true);
                  Animated.spring(modalSlide, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 65,
                    friction: 11,
                  }).start();
                }
              } else {
                moveToNext();
              }
            }
          });
        }

        setTimeout(moveToNext, 1000);
      }
    }

    loadRouteAndAnimate();

    return () => {
      isCancelled = true;
    };
  }, [USER_COORD.latitude, USER_COORD.longitude]);

  function handleConfirm() {
    setIsConfirmed(true);
    setShowRatingModal(false);
  }

  function handleGoBack() {
    router.back();
  }

  return {
    // Map data
    routeCoords,
    courierCoord,
    INITIAL_REGION,
    RESTAURANT_COORD,
    USER_COORD,
    // Delivery state
    isDelivered,
    isConfirmed,
    // Rating modal
    showRatingModal,
    rating,
    setRating,
    modalSlide,
    // Actions
    handleConfirm,
    handleGoBack,
  };
}
