import { useCallback } from "react";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

interface PressAnimationOptions {
    toValue?: number;
    haptics?: boolean;
    hapticStyle?: Haptics.ImpactFeedbackStyle;
}

export function usePressAnimation(options: PressAnimationOptions) {
    const scale = useSharedValue(1);
    const { toValue = 0.95, haptics = true, hapticStyle = Haptics.ImpactFeedbackStyle.Light } = options;

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const onPressIn = useCallback(() => {
        scale.value = withSpring(toValue, {
            damping: 10,
            stiffness: 1000,
        });
        if (haptics) {
            Haptics.impactAsync(hapticStyle);
        }
    }, [scale, toValue, haptics, hapticStyle]);

    const onPressOut = useCallback(() => {
        scale.value = withSpring(1, {
            damping: 120,
            stiffness: 400,
        });
    }, [scale]);

    return { scale, animatedStyle, onPressIn, onPressOut };
}