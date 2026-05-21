import { useTheme } from "@/constants/theme";
import { usePressAnimation } from "@/hooks/usePressAnimation";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ErrorViewProps = {
    message?: string | null;
    onRetry?: () => void;
};

export const ErrorView = ({ message, onRetry }: ErrorViewProps) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const { onPressIn, onPressOut, animatedStyle } = usePressAnimation({});

    return (
        <View style={[styles.centerContainer, { backgroundColor: theme.screen, marginTop: insets.top + 56 }]}>
            <MaterialIcons name="error-outline" size={48} color={theme.danger} />
            <Text style={[styles.errorText, { color: theme.text }]}>Error</Text>
            <Text style={[styles.errorMessage, { color: theme.muted }]}>
                Failed to load orders. Please try again.
            </Text>
            <Animated.View style={[animatedStyle]}>
                <Pressable
                    style={[styles.retryButton, { backgroundColor: theme.accent }]}
                    onPress={() => onRetry?.()}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    accessibilityRole="button"
                    accessibilityLabel="Retry loading"
                >
                    <Text style={styles.retryText}>Try Again</Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    errorText: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
    },
    errorMessage: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});