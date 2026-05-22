import { useTheme } from "@/constants/theme";
import { usePressAnimation } from "@/hooks/usePressAnimation";
import { Pressable, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

type Props = {
    onPress: () => void;
    isSaving: boolean;
}

export const SignOutButton = ({ onPress, isSaving }: Props) => {
    const theme = useTheme();
    const { animatedStyle, onPressIn, onPressOut } = usePressAnimation({});
    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                style={[styles.dangerButton, { borderColor: theme.danger }]}
                accessibilityRole="button"
                accessibilityLabel="Sign out"
                accessibilityHint="Signs you out of the app"
            >
                <Text style={[styles.dangerButtonText, { color: theme.danger }]}>Sign out</Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    dangerButton: {
        marginTop: 10,
        minHeight: 48,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    dangerButtonText: {
        fontSize: 16,
        fontWeight: "700",
    },
});