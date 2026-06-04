import { useEffect } from "react";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export function useFadeInSlideUp(triggerCondition: boolean) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(40);

    useEffect(() => {
        if (triggerCondition) return;

        opacity.value = 0;
        translateY.value = 40;

        opacity.value = withTiming(1, { duration: 350 });
        translateY.value = withTiming(0, { duration: 350 });
    }, [triggerCondition]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return animatedStyle;
}