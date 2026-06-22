import { fetchRoute, LatLng } from "@/src/features/order/services/routing";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { AnimatedRegion } from "react-native-maps";

const RESTAURANT_COORD = { latitude: 50.4501, longitude: 30.5234 };
const USER_COORD = { latitude: 50.4550, longitude: 30.5300 };

export const INITIAL_REGION = {
  latitude: 50.4501,
  longitude: 30.5234,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export function useOrderTracking() {
  const router = useRouter();

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
      const coords = await fetchRoute(RESTAURANT_COORD, USER_COORD);
      if (isCancelled) return;

      setRouteCoords(coords);

      if (coords.length > 0) {
        const durationPerSegment = 50000 / coords.length;

        let i = 0;
        function moveToNext() {
          if (isCancelled || i >= coords.length) return;
          const nextCoord = coords[i];

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
              if (i >= coords.length) {
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
  }, []);

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
