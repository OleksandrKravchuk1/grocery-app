import { useTheme } from "@/constants/theme";
import { usePressAnimation } from "@/hooks/animations/usePressAnimation";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";

type Props = {
    onPress: () => void;
    title?: string;
    isSaving: boolean;
};

export const SubmitButton = ({ onPress, title, isSaving }: Props) => {
    const theme = useTheme();
    const { animatedStyle, onPressIn, onPressOut } = usePressAnimation({});
    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                disabled={isSaving}
                style={[styles.button, { backgroundColor: theme.accent }, isSaving && styles.disabled]}
                accessibilityRole="button"
                accessibilityLabel="Submit"
                accessibilityHint="Submits your changes"
                accessibilityState={{ disabled: isSaving }}
            >
                <Text style={styles.buttonText}>{title || (isSaving ? "Saving..." : "Save")}</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        marginTop: 14,
        minHeight: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    disabled: {
        opacity: 0.6,
    },
});