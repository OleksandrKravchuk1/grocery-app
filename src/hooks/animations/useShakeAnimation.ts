import { useCallback, useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function useShakeAnimation() {
  const translateX = useSharedValue(0);

  const shake = useCallback(() => {
    translateX.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withRepeat(withTiming(8, { duration: 100 }), 3, true),
      withTiming(0, { duration: 50 }),
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Shake once on mount
  useEffect(() => {
    shake();
  }, [shake]);

  return { animatedStyle, shake };
}
