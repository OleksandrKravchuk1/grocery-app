import { useEffect } from "react";
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export function useExpandAnimation(isExpanded: boolean) {
    const progress = useSharedValue(isExpanded ? 1 : 0);
    
        useEffect(() => {
            progress.value = withTiming(isExpanded ? 1 : 0, {
                duration: 220,
                easing: Easing.out(Easing.cubic),
            });
        }, [isExpanded, progress]);
    
        const fabAnimatedStyle = useAnimatedStyle(() => ({
            width: 38 + 78 * progress.value,
            paddingHorizontal: 10 * progress.value,
        }));
    
        const plusAnimatedStyle = useAnimatedStyle(() => ({
            opacity: 1 - progress.value,
            transform: [{ scale: 1 - 0.12 * progress.value }],
        }));
    
        const controlsAnimatedStyle = useAnimatedStyle(() => ({
            opacity: progress.value,
            transform: [{ scale: 0.9 + 0.1 * progress.value }],
        }));

    return {
        fabAnimatedStyle,
        plusAnimatedStyle,
        controlsAnimatedStyle,
    }
}