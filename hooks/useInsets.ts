import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useInsets() {
    const insets = useSafeAreaInsets();
    
    const topInset = Platform.OS === 'android' ? insets.top + 56 : insets.top + 100;

    return {
        ...insets,
        topInset,
    };
}
