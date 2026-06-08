import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export interface PulseAnimationOptions {
  initialValue?: number;
  toValue?: number;
  duration?: number;
}

export function usePulseAnimation(options: PulseAnimationOptions = {}) {
  const {
    initialValue = 1,
    toValue = 1.15,
    duration = 2500,
  } = options;

  const pulseValue = useSharedValue(initialValue);

  useEffect(() => {
    pulseValue.value = withRepeat(
      withTiming(toValue, {
        duration,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      -1,
      true
    );
  }, [pulseValue, toValue, duration]);

  const ring1Style = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
    opacity: 0.35 - (pulseValue.value - 1) * 2,
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value + 0.1 }],
    opacity: 0.15 - (pulseValue.value - 1) * 1.5,
  }));

  return {
    pulseValue,
    ring1Style,
    ring2Style,
  };
}
