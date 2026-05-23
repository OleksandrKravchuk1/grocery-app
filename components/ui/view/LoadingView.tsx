import { useTheme } from "@/constants/theme";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";

export const LoadingView = ({ accessibilityLabel = "Loading" }: { accessibilityLabel?: string }) => {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.screen }]}>
            <ActivityIndicator size="large" color={theme.activityIndicator} accessibilityLabel={accessibilityLabel} />
            <Text style={[styles.loadingText, { color: theme.muted }]}>
                Loading...
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    }
});